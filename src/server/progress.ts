import "server-only";
import { prisma } from "@/lib/db";
import { todayKey, dayGap } from "@/lib/dates";

export interface AwardResult {
  xp: number;
  streak: number;
  dailyXp: number;
  dailyGoalXp: number;
}

/**
 * Award XP atomically and roll the streak / daily counters. A 1-day gap keeps
 * the streak alive (a single "freeze"); a longer gap resets it to 1.
 */
export async function awardXp(
  userId: string,
  amount: number,
  reason: string
): Promise<AwardResult> {
  const today = todayKey();

  const [user] = await prisma.$transaction([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { dailyGoalXp: true, progress: true },
    }),
  ]);

  const prev = user.progress;
  const gap = prev ? dayGap(prev.lastActiveDate, today) : Infinity;

  let streak = prev?.streak ?? 0;
  let streakFreezeAt = prev?.streakFreezeAt ?? "";
  if (!prev || prev.lastActiveDate !== today) {
    if (gap === 1) {
      streak = streak + 1;
    } else if (gap === 2) {
      // one missed day — burn a freeze, keep the streak
      streak = streak + 1;
      streakFreezeAt = today;
    } else {
      streak = 1;
    }
  }

  const sameDay = prev?.dailyDate === today;
  const dailyXp = (sameDay ? prev?.dailyXp ?? 0 : 0) + amount;
  const xp = (prev?.xp ?? 0) + amount;

  await prisma.$transaction([
    prisma.progress.upsert({
      where: { userId },
      create: {
        userId,
        xp,
        streak,
        lastActiveDate: today,
        dailyXp,
        dailyDate: today,
        streakFreezeAt,
      },
      update: {
        xp,
        streak,
        lastActiveDate: today,
        dailyXp,
        dailyDate: today,
        streakFreezeAt,
      },
    }),
    prisma.xpEvent.create({ data: { userId, amount, reason } }),
  ]);

  return { xp, streak, dailyXp, dailyGoalXp: user.dailyGoalXp };
}

/** Record a graded attempt (and award XP on a pass). */
export async function recordAttempt(opts: {
  userId: string;
  exerciseId: string;
  skillId: string;
  crown: number;
  pitchScore: number;
  tempoScore: number;
  passed: boolean;
  xp: number;
}) {
  await prisma.attempt.create({
    data: {
      userId: opts.userId,
      exerciseId: opts.exerciseId,
      skillId: opts.skillId,
      crown: opts.crown,
      pitchScore: opts.pitchScore,
      tempoScore: opts.tempoScore,
      passed: opts.passed,
    },
  });

  if (opts.passed && opts.xp > 0) {
    return awardXp(opts.userId, opts.xp, `exercise:${opts.exerciseId}`);
  }
  return null;
}

/** Best passed crown per exercise for a user. */
export async function getCrownsByExercise(
  userId: string
): Promise<Record<string, number>> {
  const rows = await prisma.attempt.findMany({
    where: { userId, passed: true },
    select: { exerciseId: true, crown: true },
  });
  const out: Record<string, number> = {};
  for (const r of rows) {
    out[r.exerciseId] = Math.max(out[r.exerciseId] ?? 0, r.crown);
  }
  return out;
}
