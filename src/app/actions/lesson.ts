"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { findExercise } from "@/lib/curriculum";
import { recordAttempt } from "@/server/progress";

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
