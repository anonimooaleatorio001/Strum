import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Minus, Plus } from "lucide-react";
import { getAudioContext, playClick } from "../lib/audio";

const MIN_BPM = 40;
const MAX_BPM = 240;
const SIGNATURES = [2, 3, 4, 6];

function tempoName(bpm: number): string {
  if (bpm < 66) return "Largo";
  if (bpm < 76) return "Adagio";
  if (bpm < 108) return "Andante";
  if (bpm < 120) return "Moderato";
  if (bpm < 168) return "Allegro";
  return "Presto";
}

export default function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);

  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beatsPerBar);
  const nextNoteTimeRef = useRef(0);
  const beatCounterRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const queueRef = useRef<{ beat: number; time: number }[]>([]);
  const tapsRef = useRef<number[]>([]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    beatsRef.current = beatsPerBar;
  }, [beatsPerBar]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
    queueRef.current = [];
    setPlaying(false);
    setCurrentBeat(-1);
  }, []);

  const start = useCallback(() => {
    const ac = getAudioContext();
    beatCounterRef.current = 0;
    nextNoteTimeRef.current = ac.currentTime + 0.08;
    queueRef.current = [];

    const scheduler = () => {
      const secondsPerBeat = 60 / bpmRef.current;
      while (nextNoteTimeRef.current < ac.currentTime + 0.12) {
        const beat = beatCounterRef.current % beatsRef.current;
        playClick(beat === 0, nextNoteTimeRef.current);
        queueRef.current.push({ beat, time: nextNoteTimeRef.current });
        nextNoteTimeRef.current += secondsPerBeat;
        beatCounterRef.current += 1;
      }
    };

    const draw = () => {
      const now = ac.currentTime;
      while (queueRef.current.length && queueRef.current[0].time <= now) {
        const next = queueRef.current.shift();
        if (next) setCurrentBeat(next.beat);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    scheduler();
    timerRef.current = window.setInterval(scheduler, 25);
    rafRef.current = requestAnimationFrame(draw);
    setPlaying(true);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const toggle = () => (playing ? stop() : start());

  const nudge = (delta: number) =>
    setBpm((b) => Math.max(MIN_BPM, Math.min(MAX_BPM, b + delta)));

  const tap = () => {
    const now = performance.now();
    const taps = tapsRef.current;
    if (taps.length && now - taps[taps.length - 1] > 2000) taps.length = 0;
    taps.push(now);
    if (taps.length > 5) taps.shift();
    if (taps.length >= 2) {
      let sum = 0;
      for (let i = 1; i < taps.length; i++) sum += taps[i] - taps[i - 1];
      const avg = sum / (taps.length - 1);
      setBpm(Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(60000 / avg))));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-cyprus/10 bg-sand p-6 sm:p-10 shadow-[0_2px_30px_rgba(0,71,65,0.06)]">
        {/* Beat indicator */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          {Array.from({ length: beatsPerBar }).map((_, i) => {
            const active = i === currentBeat;
            const downbeat = i === 0;
            return (
              <div
                key={i}
                className={`rounded-full transition-all duration-75 ${
                  downbeat ? "h-5 w-5 sm:h-6 sm:w-6" : "h-4 w-4 sm:h-5 sm:w-5"
                } ${
                  active
                    ? "scale-125 bg-cyprus"
                    : "bg-cyprus/15"
                }`}
              />
            );
          })}
        </div>

        {/* BPM display */}
        <div className="mt-8 text-center">
          <div className="flex items-end justify-center gap-3">
            <span className="text-7xl sm:text-8xl font-semibold tracking-tight text-cyprus tabular-nums">
              {bpm}
            </span>
            <span className="mb-3 text-sm font-medium text-cyprus/50">BPM</span>
          </div>
          <div className="mt-1 text-sm font-medium text-cyprus/60">
            {tempoName(bpm)}
          </div>
        </div>

        {/* +/- and slider */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => nudge(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyprus/10 text-cyprus transition-colors hover:bg-cyprus/20"
            aria-label="Decrease tempo"
          >
            <Minus size={18} />
          </button>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="strum-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cyprus/15"
            aria-label="Tempo"
          />
          <button
            onClick={() => nudge(1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyprus/10 text-cyprus transition-colors hover:bg-cyprus/20"
            aria-label="Increase tempo"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Time signature */}
        <div className="mt-7 flex items-center justify-center gap-2">
          <span className="mr-1 text-[13px] font-medium text-cyprus/50">
            Beats
          </span>
          {SIGNATURES.map((s) => (
            <button
              key={s}
              onClick={() => setBeatsPerBar(s)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                beatsPerBar === s
                  ? "bg-cyprus text-sand"
                  : "bg-cyprus/8 text-cyprus/70 hover:bg-cyprus/15"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-full bg-cyprus px-8 py-3.5 text-sm font-medium text-sand transition-colors hover:bg-[#013a35]"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? "Stop" : "Start"}
          </button>
          <button
            onClick={tap}
            className="inline-flex items-center rounded-full border border-cyprus/20 px-6 py-3.5 text-sm font-medium text-cyprus transition-colors hover:bg-cyprus/5"
          >
            Tap tempo
          </button>
        </div>
      </div>
    </div>
  );
}
