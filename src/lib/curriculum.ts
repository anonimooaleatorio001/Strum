// Deterministic curriculum generator.
//
// The whole course (6 units → skills → exercises) is generated from a fixed
// seed per instrument, so every user sees the same stable path and exercise
// ids without storing any of it in the database. Progress rows simply
// reference `exerciseId` / `skillId`.

import { getTuning, type InstrumentId, type StringDef } from "./instruments";

export interface TargetNote {
  /** Index into the active tuning (0 = lowest string). */
  string: number;
  fret: number;
  midi: number;
  /** Beat position within the exercise (in quarter notes). */
  beat: number;
}

export interface Exercise {
  id: string;
  skillId: string;
  title: string;
  bpm: number;
  bars: number;
  notes: TargetNote[];
}

export interface Skill {
  id: string;
  title: string;
  blurb: string;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  skills: Skill[];
}

// --- seeded RNG (mulberry32) ---------------------------------------------

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// --- unit/skill blueprint -------------------------------------------------

const UNIT_BLUEPRINT: { title: string; subtitle: string; skills: string[] }[] = [
  {
    title: "Primeiros sons",
    subtitle: "Conheça o braço",
    skills: ["Cordas soltas", "Casas 1–3"],
  },
  {
    title: "Dedos no traste",
    subtitle: "Mão esquerda firme",
    skills: ["Dó maior na corda", "Trocando de corda"],
  },
  {
    title: "Ritmo básico",
    subtitle: "No tempo",
    skills: ["Semínimas", "Colcheias"],
  },
  {
    title: "Escala maior",
    subtitle: "Caminhos no braço",
    skills: ["Escala de Sol", "Padrões de dedo"],
  },
  {
    title: "Groove",
    subtitle: "Faça balançar",
    skills: ["Notas com pausa", "Síncope leve"],
  },
  {
    title: "Desafio",
    subtitle: "Junte tudo",
    skills: ["Frase completa", "Velocidade"],
  },
];

const EXERCISES_PER_SKILL = 2; // 6 units * 2 skills * 2 = 24 exercises per instrument

// --- curated content ------------------------------------------------------
//
// Real, musical exercises (scales, riffs, picking patterns) keyed by
// `unit:skill:exercise`. Notes are [string, fret] pairs using only strings 0–3,
// which exist on guitar and every bass, so one set works for both instruments
// (it simply sounds an octave lower on bass). `[-1, -1]` marks a rest. `step`
// is the spacing in beats (1 = quarter notes, 0.5 = eighths).

interface Pattern {
  step: number;
  notes: [number, number][];
}

const R: [number, number] = [-1, -1]; // rest

const CURATED: Record<string, Pattern> = {
  // Unit 1 — Primeiros sons
  "0:0:0": { step: 1, notes: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 0], [2, 0], [1, 0], [0, 0]] },
  "0:0:1": { step: 1, notes: [[0, 0], [2, 0], [1, 0], [3, 0], [2, 0], [0, 0], [3, 0], [1, 0]] },
  "0:1:0": { step: 1, notes: [[0, 1], [0, 2], [0, 3], [0, 2], [1, 1], [1, 2], [1, 3], [1, 2]] },
  "0:1:1": { step: 1, notes: [[1, 3], [1, 2], [1, 1], [2, 1], [2, 2], [2, 3], [2, 2], [2, 1]] },

  // Unit 2 — Dó maior na corda / Trocando de corda (C major scale)
  "1:0:0": { step: 0.5, notes: [[1, 3], [1, 5], [2, 2], [2, 3], [2, 5], [3, 2], [3, 4], [3, 5], [3, 4], [3, 2], [2, 5], [2, 3], [2, 2], [1, 5], [1, 3], [1, 3]] },
  "1:0:1": { step: 0.5, notes: [[3, 5], [3, 4], [3, 2], [2, 5], [2, 3], [2, 2], [1, 5], [1, 3], [1, 5], [2, 2], [2, 3], [2, 5], [3, 2], [3, 4], [3, 5], [3, 5]] },
  "1:1:0": { step: 0.5, notes: [[1, 3], [2, 3], [1, 5], [2, 5], [2, 2], [3, 2], [2, 3], [3, 4], [1, 3], [2, 3], [1, 5], [2, 5], [2, 2], [3, 2], [2, 0], [3, 0]] },
  "1:1:1": { step: 0.5, notes: [[3, 2], [2, 2], [3, 4], [2, 3], [3, 5], [2, 5], [3, 2], [2, 2], [1, 3], [0, 3], [1, 5], [0, 5], [1, 3], [0, 3], [1, 0], [0, 0]] },

  // Unit 3 — Ritmo básico
  "2:0:0": { step: 1, notes: [[1, 3], [2, 0], [2, 2], [3, 0], [1, 3], [2, 2], [2, 0], [1, 3]] },
  "2:0:1": { step: 1, notes: [[0, 3], [1, 0], [1, 2], [2, 0], [2, 2], [1, 2], [1, 0], [0, 3]] },
  "2:1:0": { step: 0.5, notes: [[1, 3], [1, 3], [2, 0], [2, 0], [2, 2], [2, 2], [3, 0], [3, 0], [1, 3], [2, 0], [2, 2], [3, 0], [2, 2], [2, 0], [1, 3], [1, 3]] },
  "2:1:1": { step: 0.5, notes: [[0, 0], [0, 0], [1, 0], [1, 0], [2, 0], [2, 0], [1, 0], [1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 0]] },

  // Unit 4 — Escala de Sol / Padrões (G major scale)
  "3:0:0": { step: 0.5, notes: [[0, 3], [0, 5], [1, 2], [1, 3], [1, 5], [2, 2], [2, 4], [2, 5], [2, 4], [2, 2], [1, 5], [1, 3], [1, 2], [0, 5], [0, 3], [0, 3]] },
  "3:0:1": { step: 0.5, notes: [[2, 5], [2, 4], [2, 2], [1, 5], [1, 3], [1, 2], [0, 5], [0, 3], [0, 5], [1, 2], [1, 3], [1, 5], [2, 2], [2, 4], [2, 5], [2, 5]] },
  "3:1:0": { step: 0.5, notes: [[0, 3], [1, 2], [0, 5], [1, 3], [1, 2], [1, 5], [1, 3], [2, 2], [1, 5], [2, 4], [2, 2], [2, 5], [2, 4], [3, 0], [2, 5], [2, 5]] },
  "3:1:1": { step: 0.5, notes: [[0, 3], [0, 5], [0, 3], [1, 2], [1, 3], [1, 2], [1, 5], [1, 3], [2, 2], [2, 4], [2, 2], [1, 5], [1, 3], [0, 5], [0, 3], [0, 3]] },

  // Unit 5 — Groove (with rests / syncopation)
  "4:0:0": { step: 0.5, notes: [[1, 3], R, [2, 2], R, [2, 0], [2, 2], R, [1, 3], [1, 3], R, [2, 2], R, [2, 0], [2, 2], R, [1, 3]] },
  "4:0:1": { step: 0.5, notes: [[0, 3], R, [1, 0], [1, 2], R, [1, 2], [1, 0], R, [0, 3], R, [1, 0], [1, 2], R, [2, 0], R, [1, 0]] },
  "4:1:0": { step: 0.5, notes: [[1, 3], R, [1, 3], [2, 2], R, [2, 2], [2, 0], R, [1, 3], R, [1, 3], [2, 2], R, [2, 0], [2, 2], R] },
  "4:1:1": { step: 0.5, notes: [[2, 0], R, [2, 2], [2, 0], R, [3, 0], [2, 2], R, [2, 0], R, [2, 2], [2, 0], R, [1, 3], R, [1, 3]] },

  // Unit 6 — Desafio
  "5:0:0": { step: 0.5, notes: [[1, 3], [2, 0], [2, 2], [3, 0], [3, 2], [2, 3], [2, 0], [1, 3], [1, 5], [2, 3], [2, 2], [2, 0], [1, 3], [1, 2], [1, 0], [0, 3]] },
  "5:0:1": { step: 0.5, notes: [[0, 3], [1, 0], [1, 2], [2, 0], [2, 2], [3, 0], [3, 2], [2, 3], [3, 2], [3, 0], [2, 2], [2, 0], [1, 2], [1, 0], [0, 3], [0, 3]] },
  "5:1:0": { step: 0.5, notes: [[0, 3], [0, 5], [1, 2], [1, 3], [1, 5], [2, 2], [2, 4], [2, 5], [2, 4], [2, 2], [1, 5], [1, 3], [1, 2], [0, 5], [0, 3], [0, 5]] },
  "5:1:1": { step: 0.5, notes: [[2, 5], [2, 4], [2, 2], [1, 5], [1, 3], [1, 2], [0, 5], [0, 3], [1, 2], [1, 5], [2, 2], [2, 5], [3, 2], [3, 4], [3, 5], [3, 5]] },
};

function patternToNotes(pat: Pattern, strings: StringDef[]): TargetNote[] {
  const out: TargetNote[] = [];
  let beat = 0;
  for (const [s, f] of pat.notes) {
    if (s >= 0 && s < strings.length) {
      out.push({
        string: s,
        fret: f,
        midi: strings[s].midi + f,
        beat: Math.round(beat * 100) / 100,
      });
    }
    beat += pat.step;
  }
  return out;
}

/** Build a short, musical exercise — curated when available, else generated. */
function buildExercise(
  rng: () => number,
  strings: StringDef[],
  unitIndex: number,
  skillIndex: number,
  exerciseIndex: number,
  id: string,
  skillId: string,
  title: string
): Exercise {
  const bars = 2;
  const beatsPerBar = 4;
  const totalBeats = bars * beatsPerBar;
  const bpm = 60 + unitIndex * 8; // gets faster deeper in the course

  const curated = CURATED[`${unitIndex}:${skillIndex}:${exerciseIndex}`];
  if (curated) {
    return { id, skillId, title, bpm, bars, notes: patternToNotes(curated, strings) };
  }

  // Fallback: procedural generation (kept for safety).
  const maxFret = Math.min(2 + unitIndex, 5);
  const notes: TargetNote[] = [];
  const step = unitIndex >= 2 ? 0.5 : 1;
  for (let beat = 0; beat < totalBeats; beat += step) {
    if (unitIndex >= 4 && rng() < 0.2) continue;
    const string = Math.floor(rng() * strings.length);
    const fret = Math.floor(rng() * (maxFret + 1));
    notes.push({
      string,
      fret,
      midi: strings[string].midi + fret,
      beat: Math.round(beat * 100) / 100,
    });
  }
  if (notes.length < 4) {
    for (let i = notes.length; i < 4; i++) {
      notes.push({ string: 0, fret: 0, midi: strings[0].midi, beat: i });
    }
  }
  return { id, skillId, title, bpm, bars, notes };
}

const cache = new Map<string, Unit[]>();

/** Full ordered course for an instrument + string count. Memoised. */
export function buildCurriculum(
  instrument: InstrumentId,
  numStrings: number
): Unit[] {
  const key = `${instrument}:${numStrings}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const strings = getTuning(instrument, numStrings);

  const units: Unit[] = UNIT_BLUEPRINT.map((bp, ui) => {
    const unitId = `${instrument.toLowerCase()}-u${ui + 1}`;
    const skills: Skill[] = bp.skills.map((skillTitle, si) => {
      const skillId = `${unitId}-s${si + 1}`;
      const exercises: Exercise[] = [];
      for (let ei = 0; ei < EXERCISES_PER_SKILL; ei++) {
        const exId = `${skillId}-e${ei + 1}`;
        const rng = mulberry32(hashSeed(`${key}:${exId}`));
        exercises.push(
          buildExercise(
            rng,
            strings,
            ui,
            si,
            ei,
            exId,
            skillId,
            `${skillTitle} ${ei + 1}`
          )
        );
      }
      return {
        id: skillId,
        title: skillTitle,
        blurb: bp.subtitle,
        exercises,
      };
    });
    return {
      id: unitId,
      index: ui,
      title: `Unidade ${ui + 1} · ${bp.title}`,
      subtitle: bp.subtitle,
      skills,
    };
  });

  cache.set(key, units);
  return units;
}

/** Flat, ordered list of exercises with their unit/skill, for unlock logic. */
export function orderedExercises(
  instrument: InstrumentId,
  numStrings: number
): { exercise: Exercise; unitIndex: number; skillId: string }[] {
  const units = buildCurriculum(instrument, numStrings);
  const out: { exercise: Exercise; unitIndex: number; skillId: string }[] = [];
  for (const unit of units) {
    for (const skill of unit.skills) {
      for (const ex of skill.exercises) {
        out.push({ exercise: ex, unitIndex: unit.index, skillId: skill.id });
      }
    }
  }
  return out;
}

export function findExercise(
  instrument: InstrumentId,
  numStrings: number,
  exerciseId: string
): Exercise | undefined {
  return orderedExercises(instrument, numStrings).find(
    (o) => o.exercise.id === exerciseId
  )?.exercise;
}
