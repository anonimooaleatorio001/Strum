"use client";

import { useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { getAudioContext, playNote } from "@/lib/audio";
import { noteName } from "@/lib/pitch";
import type { TargetNote } from "@/lib/curriculum";

/**
 * A lightweight preview of an exercise: an ASCII-ish tab plus a "listen"
 * button that plays the target notes in time. The full note-highway Player v2
 * arrives in Phase 2.
 */
export default function ExercisePlayer({
  notes,
  bpm,
  stringLabels,
}: {
  notes: TargetNote[];
  bpm: number;
  stringLabels: string[];
}) {
  const [playing, setPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timers = useRef<number[]>([]);

  const secPerBeat = 60 / bpm;

  function listen() {
    if (playing) return;
    const ac = getAudioContext();
    const start = ac.currentTime + 0.1;
    setPlaying(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];

    notes.forEach((n, i) => {
      playNote(n.midi, start + n.beat * secPerBeat, 0.5, 0.12);
      const tHighlight = window.setTimeout(
        () => setActiveIdx(i),
        (n.beat * secPerBeat + 0.1) * 1000
      );
      timers.current.push(tHighlight);
    });

    const last = notes[notes.length - 1];
    const endMs = ((last.beat + 1) * secPerBeat + 0.2) * 1000;
    const tEnd = window.setTimeout(() => {
      setPlaying(false);
      setActiveIdx(-1);
    }, endMs);
    timers.current.push(tEnd);
  }

  // Render a tab grid: one row per string (high string on top), columns = notes.
  const rows = stringLabels.length;

  return (
    <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
      <div className="overflow-x-auto scrollbar-none">
        <div className="inline-block min-w-full font-mono text-[13px] text-cyprus">
          {Array.from({ length: rows }).map((_, rowFromTop) => {
            // top row = highest string (last in low->high array)
            const stringIdx = rows - 1 - rowFromTop;
            return (
              <div key={stringIdx} className="flex items-center gap-1 py-0.5">
                <span className="w-7 shrink-0 text-cyprus/45">
                  {stringLabels[stringIdx][0]}
                </span>
                <span className="text-cyprus/25">|</span>
                {notes.map((n, i) => {
                  const here = n.string === stringIdx;
                  const active = i === activeIdx && here;
                  return (
                    <span
                      key={i}
                      className={`inline-flex h-6 w-7 items-center justify-center rounded ${
                        active
                          ? "bg-cyprus text-sand"
                          : here
                          ? "bg-cyprus/10 text-cyprus"
                          : "text-cyprus/20"
                      }`}
                    >
                      {here ? n.fret : "–"}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={listen}
          disabled={playing}
          className="inline-flex items-center gap-2 rounded-full bg-cyprus px-5 py-2.5 text-sm font-medium text-sand transition-colors hover:bg-[#11421f] disabled:opacity-60"
        >
          {playing ? <Volume2 size={16} /> : <Play size={16} />}
          {playing ? "Tocando…" : "Ouvir"}
        </button>
        <span className="text-[12px] text-cyprus/45">
          {notes.length} notas · {bpm} BPM ·{" "}
          {noteName(notes[0].midi)}
          {notes.length > 1 ? `…${noteName(notes[notes.length - 1].midi)}` : ""}
        </span>
      </div>
    </div>
  );
}
