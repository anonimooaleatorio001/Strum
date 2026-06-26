"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { findExercise } from "@/lib/curriculum";
import { recordAttempt, getCrownsByExercise } from "@/server/progress";
import { reinforceSkill } from "@/server/skills";
import { xpForCrown } from "@/lib/grading";

const gradeSchema = z.object({
  exerciseId: z.string().min(1),
  crown: z.number().int().min(0).max(5),
  pitchScore: z.number().min(0).max(1),
  tempoScore: z.number().min(0).max(1),
});

export type GradeResult =
  | {
      ok: true;
      crown: number;
      improved: boolean;
      xp: number;
      streak: number;
      totalXp: number;
      passed: boolean;
    }
  | { ok: false; error: string };

/**
 * Record a real, audio-graded attempt from Player v2. Awards XP scaled by the
 * crown earned (and whether it beat the user's previous best for the exercise),
 * and feeds the spaced-repetition skill strength.
 */
export async function gradeLesson(input: unknown): Promise<GradeResult> {
  const user = await requireOnboardedUser();
  const parsed = gradeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };

  const { exerciseId, crown, pitchScore, tempoScore } = parsed.data;
  const exercise = findExercise(user.instrument, user.numStrings, exerciseId);
  if (!exercise) return { ok: false, error: "Exercício não encontrado." };

  const path = await getPathState(user);
  if (!path.statusById[exerciseId]?.unlocked) {
    return { ok: false, error: "Lição bloqueada." };
  }

  const passed = crown > 0;
  const crowns = await getCrownsByExercise(user.id);
  const prevBest = crowns[exerciseId] ?? 0;
  const improved = crown > prevBest;
  const xp = passed ? xpForCrown(crown, improved) : 0;

  const award = await recordAttempt({
    userId: user.id,
    exerciseId,
    skillId: exercise.skillId,
    crown: Math.max(1, crown),
    pitchScore,
    tempoScore,
    passed,
    xp,
  });

  await reinforceSkill(user.id, exercise.skillId, passed ? pitchScore : 0);

  revalidatePath("/app");
  revalidatePath("/app/lessons");
  revalidatePath("/app/progress");

  return {
    ok: true,
    crown,
    improved,
    xp,
    streak: award?.streak ?? 0,
    totalXp: award?.xp ?? 0,
    passed,
  };
}

/**
 * Phase-1 lesson completion. Until the real Player v2 (Phase 2) grades audio,
 * a lesson is "practised" with a confirm button — but it still flows through
 * the real attempt + XP + streak + unlock machinery.
 */
export async function practiceExercise(formData: FormData) {
  const user = await requireOnboardedUser();
  const exerciseId = String(formData.get("exerciseId") ?? "");

  const exercise = findExercise(user.instrument, user.numStrings, exerciseId);
  if (!exercise) redirect("/app/lessons");

  // Guard: the exercise must be unlocked for this user.
  const path = await getPathState(user);
  const status = path.statusById[exerciseId];
  if (!status?.unlocked) redirect("/app/lessons");

  const firstTime = status.crown === 0;
  const xp = firstTime ? 15 : 5;

  await recordAttempt({
    userId: user.id,
    exerciseId,
    skillId: exercise.skillId,
    crown: 1,
    pitchScore: 1,
    tempoScore: 1,
    passed: true,
    xp,
  });

  revalidatePath("/app");
  revalidatePath("/app/lessons");
  redirect("/app/lessons");
}
