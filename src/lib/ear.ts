// Ear-training content ("Treino auditivo"). Two game modes:
//   • interval — hear two notes, name the distance between them
//   • note     — hear one note, name it
// Pure helpers; the client component plays the notes and tracks the streak.

export interface Interval {
  semitones: number;
  name: string;
  short: string;
}

export const INTERVALS: Interval[] = [
  { semitones: 0, name: "Uníssono", short: "1J" },
  { semitones: 2, name: "Segunda maior", short: "2M" },
  { semitones: 3, name: "Terça menor", short: "3m" },
  { semitones: 4, name: "Terça maior", short: "3M" },
  { semitones: 5, name: "Quarta justa", short: "4J" },
  { semitones: 7, name: "Quinta justa", short: "5J" },
  { semitones: 9, name: "Sexta maior", short: "6M" },
  { semitones: 12, name: "Oitava", short: "8J" },
];

export const NOTE_NAMES_PT = [
  "Dó",
  "Dó#",
  "Ré",
  "Ré#",
  "Mi",
  "Fá",
  "Fá#",
  "Sol",
  "Sol#",
  "Lá",
  "Lá#",
  "Si",
];

export type EarMode = "interval" | "note";

export interface IntervalRound {
  mode: "interval";
  rootMidi: number;
  interval: Interval;
  options: Interval[];
}

export interface NoteRound {
  mode: "note";
  midi: number;
  pitchClass: number;
  options: number[]; // pitch classes
}

export type EarRound = IntervalRound | NoteRound;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A fresh round. `difficulty` widens the pool of possible answers. */
export function nextRound(mode: EarMode, difficulty = 0): EarRound {
  const root = 52 + Math.floor(Math.random() * 12); // E3..D#4

  if (mode === "interval") {
    const pool = INTERVALS.slice(0, Math.min(INTERVALS.length, 4 + difficulty));
    const interval = pick(pool);
    const wrong = shuffle(pool.filter((i) => i.semitones !== interval.semitones)).slice(0, 3);
    return {
      mode: "interval",
      rootMidi: root,
      interval,
      options: shuffle([interval, ...wrong]),
    };
  }

  const pc = Math.floor(Math.random() * 12);
  const allPcs = shuffle(Array.from({ length: 12 }, (_, i) => i).filter((i) => i !== pc));
  const wrong = allPcs.slice(0, 3);
  return {
    mode: "note",
    midi: root,
    pitchClass: pc,
    options: shuffle([pc, ...wrong]),
  };
}
