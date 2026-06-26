"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, Repeat, Gauge } from "lucide-react";
import { getAudioContext, playNote } from "@/lib/audio";
import type { SongNote } from "@/lib/tab";

interface Props {
  notes: SongNote[];
  bpm: number;
  stringLabels: string[];
}

/** Practice player: scrolling tab, adjustable tempo, and an A/B loop. */
export default function SongPlayer({ notes, bpm, stringLabels }: Props) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [loop, setLoop] = useState(false);
  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // distinct beat columns
  const beats = [...new Set(notes.map((n) => n.beat))].sort((a, b) => a - b);
  const beatIndex = new Map(beats.map((b, i) => [b, i]));
  const rows = stringLabels.length;

  function stop() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(false);
    setActiveBeat(-1);
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function play() {
    if (playing) return stop();
    const ac = getAudioContext();
    const secPerBeat = (60 / bpm) / speed;
    const start = ac.currentTime + 0.1;
    setPlaying(true);

    const lastBeat = beats[beats.length - 1] ?? 0;
    notes.forEach((nt) => {
      playNote(nt.midi, start + nt.beat * secPerBeat, 0.6, 0.12);
    });
    beats.forEach((b) => {
      timers.current.push(
        window.setTimeout(() => {
          setActiveBeat(b);
          scrollRef.current
            ?.querySelector(`[data-beat="${b}"]`)
            ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        }, (start + b * secPerBeat - ac.currentTime) * 1000)
      );
    });

    timers.current.push(
      window.setTimeout(() => {
        if (loop) {
          stop();
          setTimeout(play, 250);
        } else stop();
      }, ((lastBeat + 1) * secPerBeat + 0.2) * 1000)
    );
  }

  return (
    <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none"
      >
        <div className="inline-block min-w-full font-mono text-[13px] text-cyprus">
          {Array.from({ length: rows }).map((_, rowFromTop) => {
            const si = rows - 1 - rowFromTop;
            return (
              <div key={si} className="flex items-center gap-1 py-0.5">
                <span className="w-6 shrink-0 text-cyprus/45">
                  {stringLabels[si][0]}
                </span>
                <span className="text-cyprus/25">|</span>
                {beats.map((b) => {
                  const note = notes.find((n) => n.beat === b && n.string === si);
                  const active = b === activeBeat;
                  return (
                    <span
                      key={b}
                      data-beat={b}
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded ${
                        note
                          ? active
                            ? "bg-ochre text-sand"
                            : "bg-cyprus text-sand"
                          : active
                          ? "bg-cyprus/10"
                          : "text-cyprus/15"
                      }`}
                    >
                      {note ? note.fret : "–"}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          onClick={play}
          className="inline-flex items-center gap-2 rounded-full bg-cyprus px-5 py-2.5 text-sm font-semibold text-sand transition-colors hover:bg-[#11421f]"
        >
          {playing ? <Square size={16} /> : <Play size={16} />}
          {playing ? "Parar" : "Tocar"}
        </button>

        <button
          onClick={() => setLoop((l) => !l)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
            loop
              ? "border-cyprus bg-cyprus/10 text-cyprus"
              : "border-cyprus/15 text-cyprus/60"
          }`}
        >
          <Repeat size={15} /> Loop
        </button>

        <label className="ml-auto flex items-center gap-2 text-[13px] text-cyprus/60">
          <Gauge size={15} />
          Velocidade
          <input
            type="range"
            min={0.5}
            max={1.25}
            step={0.05}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="strum-range h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-cyprus/15"
          />
          <span className="w-10 font-semibold text-cyprus">
            {Math.round(speed * 100)}%
          </span>
        </label>
      </div>
    </div>
  );
}
