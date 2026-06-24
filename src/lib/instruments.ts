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
