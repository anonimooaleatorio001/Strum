// Open-string MIDI numbers for standard tuning (low E → high E).
const OPEN = [40, 45, 50, 55, 59, 64];

export type Fret = number | null; // number = fret, 0 = open, null = muted

export interface Chord {
  display: string;
  name: string;
  category: "Major" | "Minor" | "Dominant 7th" | "Barre" | "Color";
  difficulty: "Easy" | "Medium" | "Hard";
  frets: Fret[];
  fingers: (number | null)[];
  midi: (number | null)[];
  tip: string;
}

function midiFor(frets: Fret[]): (number | null)[] {
  return frets.map((f, i) => (f === null ? null : OPEN[i] + f));
}

function chord(
  display: string,
  name: string,
  category: Chord["category"],
  difficulty: Chord["difficulty"],
  frets: Fret[],
  fingers: (number | null)[],
  tip: string
): Chord {
  return { display, name, category, difficulty, frets, fingers, midi: midiFor(frets), tip };
}

export const CHORDS: Chord[] = [
  chord("C", "C major", "Major", "Easy", [null, 3, 2, 0, 1, 0], [null, 3, 2, null, 1, null], "Keep your wrist low so the ringing strings stay clear."),
  chord("A", "A major", "Major", "Easy", [null, 0, 2, 2, 2, 0], [null, null, 1, 2, 3, null], "Bunch three fingers into the 2nd fret — tight but tidy."),
  chord("G", "G major", "Major", "Easy", [3, 2, 0, 0, 0, 3], [2, 1, null, null, null, 3], "Use fingers 2-1-3 (or 3-2-4) for an easy switch to C."),
  chord("E", "E major", "Major", "Easy", [0, 2, 2, 1, 0, 0], [null, 2, 3, 1, null, null], "The fullest open chord — strum all six strings."),
  chord("D", "D major", "Major", "Easy", [null, null, 0, 2, 3, 2], [null, null, null, 1, 3, 2], "Only strum the top four strings."),
  chord("Am", "A minor", "Minor", "Easy", [null, 0, 2, 2, 1, 0], [null, null, 2, 3, 1, null], "Same shape as E major, moved up a string set."),
  chord("Em", "E minor", "Minor", "Easy", [0, 2, 2, 0, 0, 0], [null, 2, 3, null, null, null], "The very first chord most players learn."),
  chord("Dm", "D minor", "Minor", "Medium", [null, null, 0, 2, 3, 1], [null, null, null, 2, 3, 1], "A moody favourite — top four strings only."),
  chord("E7", "E dominant 7th", "Dominant 7th", "Easy", [0, 2, 0, 1, 0, 0], [null, 2, null, 1, null, null], "Lift one finger off E major and you're there."),
  chord("A7", "A dominant 7th", "Dominant 7th", "Easy", [null, 0, 2, 0, 2, 0], [null, null, 1, null, 2, null], "Bluesy and open — great for 12-bar jams."),
  chord("D7", "D dominant 7th", "Dominant 7th", "Medium", [null, null, 0, 2, 1, 2], [null, null, null, 2, 1, 3], "Watch the cramped 1st-fret note on the B string."),
  chord("G7", "G dominant 7th", "Dominant 7th", "Medium", [3, 2, 0, 0, 0, 1], [3, 2, null, null, null, 1], "Pairs beautifully into a C chord."),
  chord("Cadd9", "C add 9", "Color", "Medium", [null, 3, 2, 0, 3, 0], [null, 2, 1, null, 3, 4], "A shimmery upgrade to plain C."),
  chord("C7", "C dominant 7th", "Dominant 7th", "Medium", [null, 3, 2, 3, 1, 0], [null, 3, 2, 4, 1, null], "Adds a bluesy tension to the C shape."),
  chord("F", "F major (barre)", "Barre", "Hard", [1, 3, 3, 2, 1, 1], [1, 3, 4, 2, 1, 1], "Barre the 1st fret with a firm, straight index finger."),
  chord("Bm", "B minor (barre)", "Barre", "Hard", [null, 2, 4, 4, 3, 2], [null, 1, 3, 4, 2, 1], "Barre the 2nd fret — keep the thumb behind the neck."),
  chord("Em7", "E minor 7th", "Minor", "Easy", [0, 2, 2, 0, 3, 0], [null, 1, 2, null, 3, null], "Add the little finger to Em for a softer, jazzy colour."),
  chord("Am7", "A minor 7th", "Minor", "Easy", [null, 0, 2, 0, 1, 0], [null, null, 2, null, 1, null], "Lift one finger off Am — open and mellow."),
  chord("Cmaj7", "C major 7th", "Color", "Easy", [null, 3, 2, 0, 0, 0], [null, 3, 2, null, null, null], "Dreamy version of C — leave the high strings open."),
  chord("Fmaj7", "F major 7th", "Color", "Medium", [null, null, 3, 2, 1, 0], [null, null, 3, 2, 1, null], "A friendlier F — no barre required."),
  chord("Dm7", "D minor 7th", "Minor", "Medium", [null, null, 0, 2, 1, 1], [null, null, null, 3, 1, 1], "Small index barre across the top two strings."),
  chord("Asus2", "A suspended 2nd", "Color", "Easy", [null, 0, 2, 2, 0, 0], [null, null, 1, 2, null, null], "Open and ringing — great between A and Asus4."),
  chord("Asus4", "A suspended 4th", "Color", "Easy", [null, 0, 2, 2, 3, 0], [null, null, 1, 2, 3, null], "Wiggle to and from A for instant texture."),
  chord("Dsus2", "D suspended 2nd", "Color", "Easy", [null, null, 0, 2, 3, 0], [null, null, null, 1, 3, null], "Lift the middle finger off D."),
  chord("Dsus4", "D suspended 4th", "Color", "Easy", [null, null, 0, 2, 3, 3], [null, null, null, 1, 2, 3], "Add the little finger to D — classic folk move."),
  chord("Esus4", "E suspended 4th", "Color", "Easy", [0, 2, 2, 2, 0, 0], [null, 1, 2, 3, null, null], "Tension that begs to resolve back to E."),
  chord("G/B", "G over B", "Major", "Medium", [null, 2, 0, 0, 0, 3], [null, 1, null, null, null, 3], "A smooth bass walk from C to G."),
  chord("E5", "E power chord", "Color", "Easy", [0, 2, 2, null, null, null], [null, 1, 2, null, null, null], "Two notes, all attitude — the rock staple."),
  chord("A5", "A power chord", "Color", "Easy", [null, 0, 2, 2, null, null], [null, null, 1, 2, null, null], "Move this shape around for any power chord."),
  chord("D5", "D power chord", "Color", "Easy", [null, null, 0, 2, 3, null], [null, null, null, 1, 2, null], "Crunchy and simple — palm-mute for punch."),
];

export const CHORD_CATEGORIES: Chord["category"][] = [
  "Major",
  "Minor",
  "Dominant 7th",
  "Color",
  "Barre",
];
