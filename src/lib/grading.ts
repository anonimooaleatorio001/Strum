// Lesson grading engine (Phase 3).
//
// Pure, framework-free logic that turns a stream of detected pitches into a
// score. The in-lesson player (Player v2) feeds it the target notes plus the
// pitches it heard through the microphone; this module decides which targets
// were hit, how clean the pitch was, how tight the timing was, and how many
// crowns (1..5) the attempt earns.

import type { TargetNote } from "./curriculum";

/** A single pitch reading from the mic, in absolute audio-context seconds. */
export interface PitchHit {
  midi: number;
  /** Cents away from the nearest semitone (|cents| small = in tune). */
  cents: number;
  time: number;
}

export interface TargetResult {
  index: number;
  /** True once a matching pitch was detected for this target. */
  hit: boolean;
  /** Timing error in seconds (detected - expected); 0 in wait mode. */
  timingError: number;
  /** |cents| of the cleanest matching reading. */
  cents: number;
}

export interface GradeSummary {
  pitchScore: number; // 0..1 — fraction of notes hit, weighted by tuning
  tempoScore: number; // 0..1 — timing tightness (1 in wait mode)
  accuracy: number; // 0..1 — combined headline number
  crown: number; // 1..5
  passed: boolean;
  hitCount: number;
  total: number;
  results: TargetResult[];
}

/** A detected pitch counts for a target if it's the same MIDI note (±1 octave). */
export function pitchMatches(detectedMidi: number, targetMidi: number): boolean {
  const diff = Math.abs(detectedMidi - targetMidi);
  return diff < 0.6 || Math.abs(diff - 12) < 0.6 || Math.abs(diff - 24) < 0.6;
}

/** How forgiving the timing window is, in seconds, given the tempo. */
export function timingWindow(bpm: number): number {
  // Half a beat, clamped to a sane range.
  return Math.min(0.6, Math.max(0.25, 30 / bpm));
}

/**
 * Grade a timed attempt: each target has an expected absolute time
 * (startTime + beat * secPerBeat). A target is hit if any reading within its
 * timing window matches its pitch; we keep the closest-in-tune reading.
 */
export function gradeTimed(
  targets: TargetNote[],
  expectedTimes: number[],
  hits: PitchHit[],
  bpm: number
): GradeSummary {
  const win = timingWindow(bpm);
  const results: TargetResult[] = targets.map((t, i) => {
    const expected = expectedTimes[i];
    let best: PitchHit | null = null;
    for (const h of hits) {
      if (Math.abs(h.time - expected) > win) continue;
      if (!pitchMatches(h.midi, t.midi)) continue;
      if (!best || Math.abs(h.cents) < Math.abs(best.cents)) best = h;
    }
    return {
      index: i,
      hit: best !== null,
      timingError: best ? best.time - expected : 0,
      cents: best ? Math.abs(best.cents) : 99,
    };
  });
  return summarise(results, win, false);
}

/**
 * Grade a wait-mode attempt: order doesn't depend on a clock — `results` is
 * built by the player as the user clears each note. Timing always scores full.
 */
export function gradeWait(results: TargetResult[]): GradeSummary {
  return summarise(results, 1, true);
}

/**
 * Grade from per-note results the player accumulated live (the common path for
 * Player v2, which marks each note as it's matched through the mic).
 */
export function gradeFromResults(
  results: TargetResult[],
  bpm: number,
  waitMode: boolean
): GradeSummary {
  return summarise(results, waitMode ? 1 : timingWindow(bpm), waitMode);
}

function summarise(
  results: TargetResult[],
  win: number,
  waitMode: boolean
): GradeSummary {
  const total = results.length || 1;
  const hitResults = results.filter((r) => r.hit);
  const hitCount = hitResults.length;

  // Pitch score: fraction hit, gently weighted by how in-tune each hit was.
  const tuneBonus =
    hitResults.reduce((s, r) => s + Math.max(0, 1 - r.cents / 50), 0) /
    Math.max(1, hitCount);
  const hitFraction = hitCount / total;
  const pitchScore = clamp01(hitFraction * (0.8 + 0.2 * tuneBonus));

  // Tempo score: how tight the timing was, relative to the window.
  let tempoScore = 1;
  if (!waitMode && hitCount > 0) {
    const avgErr =
      hitResults.reduce((s, r) => s + Math.abs(r.timingError), 0) / hitCount;
    tempoScore = clamp01(1 - avgErr / win);
  }

  const accuracy = waitMode
    ? pitchScore
    : clamp01(pitchScore * 0.7 + tempoScore * 0.3);

  return {
    pitchScore,
    tempoScore,
    accuracy,
    crown: crownFor(accuracy, hitFraction),
    passed: hitFraction >= 0.6,
    hitCount,
    total: results.length,
    results,
  };
}

/** Map accuracy → crown. You need to hit most notes to pass at all. */
export function crownFor(accuracy: number, hitFraction: number): number {
  if (hitFraction < 0.6) return 0;
  if (accuracy >= 0.97) return 5;
  if (accuracy >= 0.9) return 4;
  if (accuracy >= 0.8) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** XP awarded for an attempt, scaled by crown and whether it's a new best. */
export function xpForCrown(crown: number, improved: boolean): number {
  if (crown <= 0) return 0;
  const base = 8 + crown * 4; // 12..28
  return improved ? base : Math.round(base * 0.4);
}
