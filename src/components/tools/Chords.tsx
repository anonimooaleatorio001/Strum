"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { CHORDS, CHORD_CATEGORIES, type Chord } from "@/lib/chords";
import ChordDiagram from "@/components/ChordDiagram";
import { strumChord } from "@/lib/audio";

const FILTERS = ["All", ...CHORD_CATEGORIES] as const;

const difficultyStyle: Record<Chord["difficulty"], string> = {
  Easy: "bg-cyprus/10 text-cyprus",
  Medium: "bg-cyprus/15 text-cyprus",
  Hard: "bg-cyprus text-sand",
};

export default function Chords() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  const shown =
    filter === "All" ? CHORDS : CHORDS.filter((c) => c.category === filter);

  const play = (chord: Chord) => {
    strumChord(chord.midi);
    setLastPlayed(chord.display);
    window.setTimeout(
      () => setLastPlayed((cur) => (cur === chord.display ? null : cur)),
      900
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-7 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              filter === f
                ? "bg-cyprus text-sand"
                : "border border-cyprus/15 text-cyprus/70 hover:bg-cyprus/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((chord) => (
          <button
            key={chord.display}
            onClick={() => play(chord)}
            className={`group flex flex-col items-center rounded-2xl border bg-sand p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(12,48,20,0.12)] ${
              lastPlayed === chord.display
                ? "border-cyprus shadow-[0_8px_24px_rgba(12,48,20,0.16)]"
                : "border-cyprus/10"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-lg font-semibold text-cyprus">
                {chord.display}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                  difficultyStyle[chord.difficulty]
                }`}
              >
                {chord.difficulty}
              </span>
            </div>

            <div className="my-3 flex justify-center">
              <ChordDiagram frets={chord.frets} fingers={chord.fingers} />
            </div>

            <div className="flex w-full items-center justify-between">
              <span className="text-[11px] text-cyprus/55">{chord.name}</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  lastPlayed === chord.display
                    ? "bg-cyprus text-sand"
                    : "bg-cyprus/8 text-cyprus group-hover:bg-cyprus group-hover:text-sand"
                }`}
              >
                <Volume2 size={14} />
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-[12px] text-cyprus/45">
        Tap any chord to hear it strummed. Diagrams read low E (left) to high E
        (right); numbers show suggested fingers.
      </p>
    </div>
  );
}
