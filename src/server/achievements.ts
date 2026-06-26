import "server-only";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { BADGES, evaluateBadges, type BadgeStats } from "@/lib/achievements";
import { getCrownsByExercise } from "@/server/progress";

/** Gather everything the badge rules need, in one place. */
export async function getBadgeStats(user: User): Promise<BadgeStats> {
  const [crowns, songs, compositions, glossarySeen] = await Promise.all([
    getCrownsByExercise(user.id),
    prisma.song.count({ where: { userId: user.id } }),
    prisma.composition.count({ where: { userId: user.id } }),
    prisma.glossarySeen.count({ where: { userId: user.id } }),
  ]);

  const progress = await prisma.progress.findUnique({
    where: { userId: user.id },
  });

  const crownValues = Object.values(crowns);
  const settings = (user.settings as { earBest?: number } | null) ?? {};

  return {
    xp: progress?.xp ?? 0,
    streak: progress?.streak ?? 0,
    lessonsDone: crownValues.filter((c) => c > 0).length,
    fiveCrowns: crownValues.filter((c) => c >= 5).length,
    songs,
    compositions,
    earBest: settings.earBest ?? 0,
    glossarySeen,
  };
}

export interface BadgeView {
  id: string;
  unlocked: boolean;
  unlockedAt: Date | null;
  progress: number;
}

/**
 * Reconcile the user's stats with the AchievementUnlock table: persist any
 * newly-earned badges and return the full view plus the list of *new* unlocks
 * (so the UI can celebrate them once).
 */
export async function syncAchievements(
  user: User
): Promise<{ badges: BadgeView[]; newlyUnlocked: string[] }> {
  const stats = await getBadgeStats(user);
  const earned = new Set(evaluateBadges(stats).unlocked);

  const existing = await prisma.achievementUnlock.findMany({
    where: { userId: user.id },
  });
  const existingMap = new Map(existing.map((e) => [e.badgeId, e.unlockedAt]));

  const newlyUnlocked = [...earned].filter((id) => !existingMap.has(id));
  if (newlyUnlocked.length) {
    await prisma.achievementUnlock.createMany({
      data: newlyUnlocked.map((badgeId) => ({ userId: user.id, badgeId })),
      skipDuplicates: true,
    });
  }

  const badges: BadgeView[] = BADGES.map((b) => ({
    id: b.id,
    unlocked: earned.has(b.id),
    unlockedAt: existingMap.get(b.id) ?? (earned.has(b.id) ? new Date() : null),
    progress: b.test(stats) ? 1 : b.progress(stats),
  }));

  return { badges, newlyUnlocked };
}
