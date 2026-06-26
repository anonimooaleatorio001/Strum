// Instrument definitions: standard tunings for guitar and bass, in MIDI.
// Strings are listed low (thickest) -> high (thinnest).

export type InstrumentId = "GUITAR" | "BASS";

export interface StringDef {
  /** Note label with octave, e.g. "E2". */
  label: string;
  /** MIDI note number of the open string. */
  midi: number;
}

export interface InstrumentDef {
  id: InstrumentId;
  name: string;
  /** Allowed string counts the user can pick during onboarding. */
  stringChoices: number[];
  /** Default string count. */
  defaultStrings: number;
  /**
   * Standard tunings keyed by string count. Each array is low -> high.
   * (For the note-highway the UI flips these so the highest string is on top.)
   */
  tunings: Record<number, StringDef[]>;
}

const S = (label: string, midi: number): StringDef => ({ label, midi });

export const INSTRUMENTS: Record<InstrumentId, InstrumentDef> = {
  GUITAR: {
    id: "GUITAR",
    name: "Guitar",
    stringChoices: [6],
    defaultStrings: 6,
    tunings: {
      6: [S("E2", 40), S("A2", 45), S("D3", 50), S("G3", 55), S("B3", 59), S("E4", 64)],
    },
  },
  BASS: {
    id: "BASS",
    name: "Bass",
    stringChoices: [4, 5, 6],
    defaultStrings: 4,
    tunings: {
      4: [S("E1", 28), S("A1", 33), S("D2", 38), S("G2", 43)],
      5: [S("B0", 23), S("E1", 28), S("A1", 33), S("D2", 38), S("G2", 43)],
      6: [S("B0", 23), S("E1", 28), S("A1", 33), S("D2", 38), S("G2", 43), S("C3", 48)],
    },
  },
};

/** The active string set for an instrument + chosen string count. */
export function getTuning(instrument: InstrumentId, numStrings: number): StringDef[] {
  const def = INSTRUMENTS[instrument];
  return def.tunings[numStrings] ?? def.tunings[def.defaultStrings];
}

/** Map of string index -> list of dead/buzzing frets to avoid. */
export type DeadFrets = Record<string, number[]>;

export function isDeadFret(
  dead: DeadFrets | null | undefined,
  stringIdx: number,
  fret: number
): boolean {
  if (!dead) return false;
  return (dead[String(stringIdx)] ?? []).includes(fret);
}

interface Playable {
  string: number;
  fret: number;
  midi: number;
}

/**
 * Re-fingers notes that fall on dead frets, preferring an alternative position
 * with the *same pitch* on another string; if none exists it nudges the fret by
 * a semitone. Keeps exercise ids stable (curriculum stays pure) while honouring
 * a specific instrument's dead spots.
 */
export function remapDeadFrets<T extends Playable>(
  notes: T[],
  dead: DeadFrets | null | undefined,
  strings: StringDef[],
  maxFret = 15
): T[] {
  if (!dead || Object.keys(dead).length === 0) return notes;
  return notes.map((n) => {
    if (!isDeadFret(dead, n.string, n.fret)) return n;

    // same pitch on a different string?
    for (let si = 0; si < strings.length; si++) {
      const fret = n.midi - strings[si].midi;
      if (fret >= 0 && fret <= maxFret && !isDeadFret(dead, si, fret)) {
        return { ...n, string: si, fret };
      }
    }
    // last resort: shift up/down a fret on the same string
    for (const delta of [1, -1, 2, -2]) {
      const fret = n.fret + delta;
      if (fret >= 0 && fret <= maxFret && !isDeadFret(dead, n.string, fret)) {
        return { ...n, fret, midi: strings[n.string].midi + fret };
      }
    }
    return n;
  });
}

/** Pick the open string nearest to a MIDI note (by absolute distance). */
export function nearestStringIndex(strings: StringDef[], midi: number): number {
  let best = 0;
  let bestDist = Infinity;
  strings.forEach((s, i) => {
    const d = Math.abs(s.midi - midi);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}
