"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, Save, Trash2, Plus, Minus } from "lucide-react";
import { getAudioContext, playNote, playClick } from "@/lib/audio";
import { saveComposition, deleteComposition } from "@/app/actions/composer";

type Cell = number | null;

interface Props {
  id: string;
  title: string;
  bpm: number;
  bars: number;
  subdivision: number;
  grid: Cell[][];
  stringMidi: number[]; // low -> high
  stringLabels: string[];
}

const MAX_FRET = 12;

export default function ComposerEditor(props: Props) {
  const [title, setTitle] = useState(props.title);
  const [bpm, setBpm] = useState(props.bpm);
  const [bars, setBars] = useState(props.bars);
  const [subdivision, setSubdivision] = useState(props.subdivision);
  const [grid, setGrid] = useState<Cell[][]>(props.grid);
  const [brush, setBrush] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok">("idle");
  const timers = useRef<number[]>([]);

  const steps = bars * subdivision;

  // keep the grid's column count in sync with bars × subdivision
  useEffect(() => {
    setGrid((g) =>
      g.map((row) => {
        if (row.length === steps) return row;
        if (row.length < steps)
          return [...row, ...Array.from({ length: steps - row.length }, () => null)];
        return row.slice(0, steps);
      })
    );
  }, [steps]);

  function paint(stringIdx: number, step: number) {
    setGrid((g) =>
      g.map((row, si) =>
        si === stringIdx
          ? row.map((c, ci) => (ci === step ? (c === brush ? null : brush) : c))
          : row
      )
    );
  }

  function stop() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(false);
    setActiveStep(-1);
  }

  function play() {
    if (playing) return stop();
    const ac = getAudioContext();
    const secPerStep = 60 / bpm / (subdivision / 4) / 4; // subdivision per quarter
    const start = ac.currentTime + 0.1;
    setPlaying(true);

    for (let step = 0; step < steps; step++) {
      const t = start + step * secPerStep;
      grid.forEach((row, si) => {
        const fret = row[step];
        if (fret !== null) playNote(props.stringMidi[si] + fret, t, 0.5, 0.12);
      });
      if (step % subdivision === 0) playClick(step === 0, t);
      timers.current.push(
        window.setTimeout(() => setActiveStep(step), (t - ac.currentTime) * 1000)
      );
    }
    timers.current.push(
      window.setTimeout(stop, (steps * secPerStep + 0.2) * 1000)
    );
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  async function save() {
    setSaved("saving");
    const res = await saveComposition({
      id: props.id,
      title,
      bpm,
      bars,
      subdivision,
      grid,
    });
    setSaved(res?.ok ? "ok" : "idle");
    if (res?.ok) setTimeout(() => setSaved("idle"), 1500);
  }

  const rows = props.stringLabels.length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-xl border border-cyprus/15 bg-sand px-4 py-2.5 text-lg font-semibold text-cyprus outline-none focus:border-cyprus/40"
        />
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-cyprus px-5 py-2.5 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35]"
        >
          <Save size={16} />
          {saved === "saving" ? "Salvando…" : saved === "ok" ? "Salvo!" : "Salvar"}
        </button>
      </div>

      {/* controls */}
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-cyprus/10 bg-sand px-5 py-4">
        <Stepper label="BPM" value={bpm} set={setBpm} min={40} max={240} step={5} />
        <Stepper label="Compassos" value={bars} set={setBars} min={1} max={8} />
        <Stepper
          label="Divisão"
          value={subdivision}
          set={setSubdivision}
          min={1}
          max={8}
        />
        <button
          onClick={play}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-cyprus/20 px-5 py-2 text-sm font-semibold text-cyprus transition-colors hover:bg-cyprus/5"
        >
          {playing ? <Square size={15} /> : <Play size={15} />}
          {playing ? "Parar" : "Tocar"}
        </button>
      </div>

      {/* fret brush */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="shrink-0 text-[12px] font-medium text-cyprus/55">
          Casa:
        </span>
        {Array.from({ length: MAX_FRET + 1 }).map((_, f) => (
          <button
            key={f}
            onClick={() => setBrush(f)}
            className={`h-8 w-8 shrink-0 rounded-lg text-[13px] font-bold transition-colors ${
              brush === f ? "bg-cyprus text-sand" : "bg-cyprus/8 text-cyprus"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="overflow-x-auto rounded-2xl border border-cyprus/10 bg-sand p-3 scrollbar-none">
        <div className="inline-block min-w-full">
          {Array.from({ length: rows }).map((_, rowFromTop) => {
            const si = rows - 1 - rowFromTop; // high string on top
            return (
              <div key={si} className="flex items-center gap-1 py-0.5">
                <span className="w-6 shrink-0 text-[12px] font-mono text-cyprus/45">
                  {props.stringLabels[si][0]}
                </span>
                {Array.from({ length: steps }).map((_, step) => {
                  const fret = grid[si]?.[step] ?? null;
                  const beat = step % subdivision === 0;
                  const isActive = step === activeStep;
                  return (
                    <button
                      key={step}
                      onClick={() => paint(si, step)}
                      className={`h-8 w-8 shrink-0 rounded-md border text-[12px] font-bold transition-colors ${
                        fret !== null
                          ? "border-cyprus bg-cyprus text-sand"
                          : beat
                          ? "border-cyprus/15 bg-cyprus/[0.04] text-transparent hover:bg-cyprus/10"
                          : "border-cyprus/8 text-transparent hover:bg-cyprus/10"
                      } ${isActive ? "ring-2 ring-ochre" : ""}`}
                    >
                      {fret ?? "."}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={() => {
            if (confirm("Excluir esta composição?")) deleteComposition(props.id);
          }}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-cyprus/50 hover:text-ochre"
        >
          <Trash2 size={14} /> Excluir composição
        </button>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  set,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-medium text-cyprus/55">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => set(Math.max(min, value - step))}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyprus/8 text-cyprus"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-bold text-cyprus">
          {value}
        </span>
        <button
          onClick={() => set(Math.min(max, value + step))}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyprus/8 text-cyprus"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
