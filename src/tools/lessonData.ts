// Bite-sized guitar lessons. Each question is either a plain multiple-choice
// item or a "chord" item that renders a diagram (by chord display name).

export type Question =
  | {
      kind: "text";
      prompt: string;
      options: string[];
      answer: number;
    }
  | {
      kind: "chord";
      prompt: string;
      chord: string; // matches a `display` in chordData
      options: string[];
      answer: number;
    };

export interface Lesson {
  id: string;
  title: string;
  xp: number;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const UNITS: Unit[] = [
  {
    id: "u1",
    title: "Unit 1 · Getting started",
    subtitle: "Know your instrument",
    lessons: [
      {
        id: "u1l1",
        title: "Meet the guitar",
        xp: 10,
        questions: [
          {
            kind: "text",
            prompt: "How many strings does a standard guitar have?",
            options: ["4", "5", "6", "12"],
            answer: 2,
          },
          {
            kind: "text",
            prompt: "Which part do you press the strings against to make notes?",
            options: ["The bridge", "The fretboard", "The headstock", "The soundhole"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "The thinnest string is nicknamed the…",
            options: ["high E", "low E", "A string", "D string"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "On a right-handed guitar, which hand usually strums?",
            options: ["The left hand", "The right hand"],
            answer: 1,
          },
        ],
      },
      {
        id: "u1l2",
        title: "The six strings",
        xp: 10,
        questions: [
          {
            kind: "text",
            prompt: "From thickest to thinnest, the open strings are:",
            options: ["E A D G B E", "E B G D A E", "A D G C E A", "E A D G C F"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "Which is the 6th (lowest-pitched) string?",
            options: ["High E", "Low E", "A", "G"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "The 1st string is the…",
            options: ["thickest", "thinnest"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "The open 5th string plays which note?",
            options: ["E", "A", "D", "G"],
            answer: 1,
          },
        ],
      },
      {
        id: "u1l3",
        title: "Standard tuning",
        xp: 10,
        questions: [
          {
            kind: "text",
            prompt: "Standard tuning from low to high is:",
            options: ["E A D G B E", "D A D G B E", "C G C F A D", "E A D G C F"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "Tuning a string too high makes it sound…",
            options: ["flat", "sharp"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "A tuner reads −12 cents. The string is…",
            options: ["sharp", "flat", "perfectly in tune"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "To raise a string's pitch you turn the tuning peg so the string gets…",
            options: ["tighter", "looser"],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "u2",
    title: "Unit 2 · First chords",
    subtitle: "Shapes you'll use forever",
    lessons: [
      {
        id: "u2l1",
        title: "Easy minors",
        xp: 12,
        questions: [
          {
            kind: "chord",
            prompt: "Which chord is shown?",
            chord: "Em",
            options: ["E major", "E minor", "A minor", "G major"],
            answer: 1,
          },
          {
            kind: "chord",
            prompt: "Name this chord:",
            chord: "Am",
            options: ["A minor", "A major", "D minor", "E minor"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "How many fretting fingers does E minor use?",
            options: ["1", "2", "3", "4"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "A minor is the same fretting shape as which open chord?",
            options: ["E major", "G major", "D major"],
            answer: 0,
          },
        ],
      },
      {
        id: "u2l2",
        title: "Big open majors",
        xp: 12,
        questions: [
          {
            kind: "chord",
            prompt: "Which chord is this?",
            chord: "G",
            options: ["C major", "G major", "E major", "D major"],
            answer: 1,
          },
          {
            kind: "chord",
            prompt: "Name this chord:",
            chord: "C",
            options: ["C major", "A major", "G major", "F major"],
            answer: 0,
          },
          {
            kind: "chord",
            prompt: "Which chord is shown?",
            chord: "D",
            options: ["A major", "D major", "E major", "G major"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "When you play a D chord you should strum…",
            options: ["all six strings", "the top four strings", "only two strings"],
            answer: 1,
          },
        ],
      },
      {
        id: "u2l3",
        title: "Switching chords",
        xp: 12,
        questions: [
          {
            kind: "text",
            prompt: "The best way to practise chord changes is to:",
            options: [
              "play as fast as you possibly can",
              "change slowly and evenly with a metronome",
              "never look at your hand",
            ],
            answer: 1,
          },
          {
            kind: "chord",
            prompt: "Identify this chord:",
            chord: "E",
            options: ["E major", "A major", "Em", "G major"],
            answer: 0,
          },
          {
            kind: "chord",
            prompt: "Which chord is this?",
            chord: "A",
            options: ["A major", "D major", "E major", "C major"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "A 'pivot finger' is a finger that…",
            options: [
              "stays in place between two chords",
              "you lift off first",
              "does the strumming",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "u3",
    title: "Unit 3 · Rhythm & beyond",
    subtitle: "Make it groove",
    lessons: [
      {
        id: "u3l1",
        title: "Keeping time",
        xp: 14,
        questions: [
          {
            kind: "text",
            prompt: "BPM stands for…",
            options: ["Beats Per Minute", "Bars Per Measure", "Beats Per Measure"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "A metronome helps you play with steady…",
            options: ["volume", "timing", "tone"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "In 4/4 time, how many beats are in each bar?",
            options: ["2", "3", "4", "6"],
            answer: 2,
          },
          {
            kind: "text",
            prompt: "The strongest (accented) beat in a bar is usually beat…",
            options: ["1", "2", "3", "4"],
            answer: 0,
          },
        ],
      },
      {
        id: "u3l2",
        title: "Strumming basics",
        xp: 14,
        questions: [
          {
            kind: "text",
            prompt: "A downstroke moves…",
            options: [
              "from the lowest string toward the highest",
              "from the highest string toward the lowest",
            ],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "“D D U U D U” describes a…",
            options: ["strumming pattern", "chord shape", "scale"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "Palm muting mainly changes the…",
            options: ["pitch", "tone and dynamics", "tuning"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "Keeping your strumming hand moving steadily helps most with…",
            options: ["timing", "tuning"],
            answer: 0,
          },
        ],
      },
      {
        id: "u3l3",
        title: "Seventh chords",
        xp: 14,
        questions: [
          {
            kind: "chord",
            prompt: "Which chord is shown?",
            chord: "G7",
            options: ["G major", "G7", "C7", "E7"],
            answer: 1,
          },
          {
            kind: "chord",
            prompt: "Name this chord:",
            chord: "E7",
            options: ["E minor", "E7", "A7", "E major"],
            answer: 1,
          },
          {
            kind: "text",
            prompt: "A dominant 7th chord adds tension that wants to…",
            options: ["resolve to another chord", "stay unresolved"],
            answer: 0,
          },
          {
            kind: "text",
            prompt: "G7 most naturally leads into which chord?",
            options: ["C", "F#", "B"],
            answer: 0,
          },
        ],
      },
    ],
  },
];

/** Flat, ordered list of lessons with their unit index — drives the path + unlocking. */
export const ORDERED_LESSONS: { lesson: Lesson; unitIndex: number }[] =
  UNITS.flatMap((u, unitIndex) =>
    u.lessons.map((lesson) => ({ lesson, unitIndex }))
  );

export const TOTAL_LESSONS = ORDERED_LESSONS.length;
