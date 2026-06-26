import "server-only";
import type { User } from "@prisma/client";
import { orderedExercises, findExercise, type Exercise } from "@/lib/curriculum";
import { getSkillStrengths } from "@/server/skills";
import { getCrownsByExercise } from "@/server/progress";

export interface ReviewItem {
  exercise: Exercise;
  skillId: string;
  strength: number;
  reason: "weak" | "new" | "stale";
}

/**
 * Build a personalised review set. Prioritises:
 *   1. skills the user has practised whose strength has decayed (spaced review)
 *   2. the next not-yet-cleared exercise on the path (forward progress)
 * Falls back to the first exercises when there's no history yet.
 */
export async function getReviewSet(user: User, max = 4): Promise<ReviewItem[]> {
  const ordered = orderedExercises(user.instrument, user.numStrings);
  const [strengths, crowns] = await Promise.all([
    getSkillStrengths(user.id),
    getCrownsByExercise(user.id),
  ]);

  const items: ReviewItem[] = [];
  const usedSkills = new Set<string>();

  // weakest practised skills first
  const practised = Object.entries(strengths).sort((a, b) => a[1] - b[1]);
  for (const [skillId, strength] of practised) {
    if (strength > 0.7) continue; // still fresh, skip
    const ex = ordered.find((o) => o.skillId === skillId)?.exercise;
    if (ex && !usedSkills.has(skillId)) {
      items.push({ exercise: ex, skillId, strength, reason: "stale" });
      usedSkills.add(skillId);
    }
    if (items.length >= max) break;
  }

  // next exercise to clear (first unlocked, uncrowned)
  if (items.length < max) {
    for (let i = 0; i < ordered.length; i++) {
      const o = ordered[i];
      const prevId = i === 0 ? null : ordered[i - 1].exercise.id;
      const unlocked = prevId === null || (crowns[prevId] ?? 0) > 0;
      const done = (crowns[o.exercise.id] ?? 0) > 0;
      if (unlocked && !done && !usedSkills.has(o.skillId)) {
        items.push({
          exercise: o.exercise,
          skillId: o.skillId,
          strength: strengths[o.skillId] ?? 0,
          reason: "new",
        });
        usedSkills.add(o.skillId);
        break;
      }
    }
  }

  // pad with the earliest exercises if still short
  for (let i = 0; items.length < max && i < ordered.length; i++) {
    const o = ordered[i];
    if (!items.some((it) => it.exercise.id === o.exercise.id)) {
      items.push({
        exercise: o.exercise,
        skillId: o.skillId,
        strength: strengths[o.skillId] ?? 0,
        reason: "weak",
      });
    }
  }

  return items.slice(0, max);
}

/** A short, local coaching tip derived from the user's recent numbers. */
export function localCoachTip(stats: {
  streak: number;
  dailyXp: number;
  dailyGoalXp: number;
  weakestStrength: number;
}): string {
  if (stats.dailyXp >= stats.dailyGoalXp) {
    return "Meta do dia batida! Que tal um treino auditivo rápido para fechar com chave de ouro?";
  }
  if (stats.streak === 0) {
    return "Comece com uma lição curta hoje — manter o hábito vale mais que treinar muito de uma vez.";
  }
  if (stats.weakestStrength < 0.4) {
    return "Algumas habilidades estão enferrujando. Faça a revisão adaptativa para reforçá-las antes de avançar.";
  }
  return "Bom ritmo! Suba o BPM do metrônomo em 5 e tente a próxima lição com um pouco mais de velocidade.";
}

export { findExercise };
