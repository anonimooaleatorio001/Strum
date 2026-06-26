import "server-only";
import { prisma } from "@/lib/db";

// Spaced-repetition skill strength.
//
// Each skill has a "strength" in 0..1 that decays over time (half-life model)
// and is reinforced when the user passes an exercise for that skill. The
// adaptive lesson picker (src/server/adaptive.ts) uses the *current* decayed
// strength to decide what needs review.

const HALF_LIFE_DAYS = 5;

/** Strength decayed to `now` from its last review. */
export function decayedStrength(strength: number, reviewAt: Date, now = new Date()): number {
  const days = (now.getTime() - reviewAt.getTime()) / 86_400_000;
  if (days <= 0) return strength;
  return strength * Math.pow(0.5, days / HALF_LIFE_DAYS);
}

/**
 * Reinforce a skill after an attempt. `quality` (0..1) is the pitch accuracy;
 * a clean pass pushes strength toward 1, a sloppy one nudges it less.
 */
export async function reinforceSkill(userId: string, skillId: string, quality: number) {
  const now = new Date();
  const existing = await prisma.skillStrength.findUnique({
    where: { userId_skillId: { userId, skillId } },
  });
  const current = existing
    ? decayedStrength(existing.strength, existing.reviewAt, now)
    : 0;
  // move a fraction of the remaining distance to 1, scaled by quality
  const next = current + (1 - current) * (0.4 + 0.5 * quality);

  await prisma.skillStrength.upsert({
    where: { userId_skillId: { userId, skillId } },
    create: { userId, skillId, strength: clamp01(next), reviewAt: now },
    update: { strength: clamp01(next), reviewAt: now },
  });
}

/** Map of skillId -> current decayed strength for a user. */
export async function getSkillStrengths(userId: string): Promise<Record<string, number>> {
  const now = new Date();
  const rows = await prisma.skillStrength.findMany({ where: { userId } });
  const out: Record<string, number> = {};
  for (const r of rows) out[r.skillId] = decayedStrength(r.strength, r.reviewAt, now);
  return out;
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
