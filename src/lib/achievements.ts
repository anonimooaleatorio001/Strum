// Achievement badges ("Conquistas"). Definitions live here; unlock state is
// derived from a user's stats and persisted in AchievementUnlock so we can show
// *when* each was earned and fire a one-time celebration.

export interface BadgeStats {
  xp: number;
  streak: number;
  lessonsDone: number; // exercises with at least one crown
  fiveCrowns: number; // exercises at crown 5
  songs: number;
  compositions: number;
  earBest: number; // best ear-training streak
  glossarySeen: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** lucide-react icon name (resolved in the UI). */
  icon: string;
  test: (s: BadgeStats) => boolean;
  /** 0..1 progress toward unlock, for locked badges. */
  progress: (s: BadgeStats) => number;
}

const ratio = (n: number, d: number) => Math.max(0, Math.min(1, n / d));

export const BADGES: Badge[] = [
  {
    id: "first-note",
    name: "Primeira nota",
    description: "Conclua sua primeira lição.",
    icon: "Music",
    test: (s) => s.lessonsDone >= 1,
    progress: (s) => ratio(s.lessonsDone, 1),
  },
  {
    id: "streak-3",
    name: "Pegando o ritmo",
    description: "Mantenha um streak de 3 dias.",
    icon: "Flame",
    test: (s) => s.streak >= 3,
    progress: (s) => ratio(s.streak, 3),
  },
  {
    id: "streak-7",
    name: "Semana cheia",
    description: "Mantenha um streak de 7 dias.",
    icon: "Flame",
    test: (s) => s.streak >= 7,
    progress: (s) => ratio(s.streak, 7),
  },
  {
    id: "xp-100",
    name: "Centena",
    description: "Acumule 100 XP.",
    icon: "Zap",
    test: (s) => s.xp >= 100,
    progress: (s) => ratio(s.xp, 100),
  },
  {
    id: "xp-500",
    name: "Quinhentos",
    description: "Acumule 500 XP.",
    icon: "Zap",
    test: (s) => s.xp >= 500,
    progress: (s) => ratio(s.xp, 500),
  },
  {
    id: "lessons-10",
    name: "Dedicado",
    description: "Conclua 10 lições.",
    icon: "GraduationCap",
    test: (s) => s.lessonsDone >= 10,
    progress: (s) => ratio(s.lessonsDone, 10),
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Tire 5 coroas em uma lição.",
    icon: "Crown",
    test: (s) => s.fiveCrowns >= 1,
    progress: (s) => ratio(s.fiveCrowns, 1),
  },
  {
    id: "five-crowns-5",
    name: "Coroado",
    description: "Tire 5 coroas em 5 lições.",
    icon: "Crown",
    test: (s) => s.fiveCrowns >= 5,
    progress: (s) => ratio(s.fiveCrowns, 5),
  },
  {
    id: "composer",
    name: "Compositor",
    description: "Crie sua primeira composição.",
    icon: "PenLine",
    test: (s) => s.compositions >= 1,
    progress: (s) => ratio(s.compositions, 1),
  },
  {
    id: "collector",
    name: "Colecionador",
    description: "Importe sua primeira música.",
    icon: "Library",
    test: (s) => s.songs >= 1,
    progress: (s) => ratio(s.songs, 1),
  },
  {
    id: "good-ear",
    name: "Bom ouvido",
    description: "Acerte 5 seguidas no treino auditivo.",
    icon: "Ear",
    test: (s) => s.earBest >= 5,
    progress: (s) => ratio(s.earBest, 5),
  },
  {
    id: "scholar",
    name: "Estudioso",
    description: "Marque 10 termos do glossário.",
    icon: "BookOpen",
    test: (s) => s.glossarySeen >= 10,
    progress: (s) => ratio(s.glossarySeen, 10),
  },
];

export function evaluateBadges(stats: BadgeStats): {
  unlocked: string[];
} {
  return { unlocked: BADGES.filter((b) => b.test(stats)).map((b) => b.id) };
}
