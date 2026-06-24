// Pitch detection + musical-note maths used by the Tuner.

export const NOTE_STRINGS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/** The six open strings of a guitar in standard tuning (low → high), as MIDI numbers. */
export const GUITAR_STRINGS: { label: string; midi: number }[] = [
  { label: "E2", midi: 40 },
  { label: "A2", midi: 45 },
  { label: "D3", midi: 50 },
  { label: "G3", midi: 55 },
  { label: "B3", midi: 59 },
  { label: "E4", midi: 64 },
];

export function frequencyFromNoteNumber(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function noteFromPitch(frequency: number): number {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

export function centsOffFromPitch(frequency: number, note: number): number {
  return Math.floor(
    (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
  );
}

export function noteName(midi: number): string {
  return NOTE_STRINGS[((midi % 12) + 12) % 12];
}

export function noteOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

/** Nearest standard-tuning string for a given MIDI note (by absolute distance). */
export function nearestString(midi: number): number {
  let best = 0;
  let bestDist = Infinity;
  GUITAR_STRINGS.forEach((s, i) => {
    const d = Math.abs(s.midi - midi);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

/**
 * Classic ACF2+ autocorrelation pitch detector (Chris Wilson). Returns the
 * fundamental frequency in Hz, or -1 when the signal is too quiet / unpitched.
 */
export function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // not enough signal

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmed = buf.slice(r1, r2);
  const n = trimmed.length;
  const c = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
      c[i] = c[i] + trimmed[j] * trimmed[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < n; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  // Parabolic interpolation for sub-sample accuracy.
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}
