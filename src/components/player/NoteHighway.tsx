"use client";

// Player v2 — the falling-note highway with live microphone grading.
//
// Notes scroll down lanes (one per string) toward a hit-line. The user plays
// along on their real instrument; the mic detects pitch and each note lights up
// green the moment it's matched in time. Two modes:
//   • timed  — notes fall on a clock; timing counts toward the score (default)
//   • wait   — the line pauses on each note until you play it (beginner mode)
//
// At the end the attempt is graded into crowns and reported via onComplete.

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Play, RotateCcw, Music2, Volume2, VolumeX } from "lucide-react";
import { getAudioContext, playNote, playClick } from "@/lib/audio";
import { startPitchTracker, type PitchTracker } from "@/lib/mic";
import {
  gradeFromResults,
  timingWindow,
  pitchMatches,
  type TargetResult,
  type GradeSummary,
} from "@/lib/grading";
import { noteName } from "@/lib/pitch";
import type { TargetNote } from "@/lib/curriculum";

const LEAD_SECONDS = 2.6; // how long a note takes to fall to the hit-line
const COLORS = {
  cyprus: "#004741",
  sand: "#F0EDE4",
  ochre: "#C8893B",
  dim: "rgba(0,71,65,0.12)",
  dimText: "rgba(0,71,65,0.45)",
};

type Phase = "ready" | "countdown" | "playing" | "done";

interface Props {
  notes: TargetNote[];
  bpm: number;
  stringLabels: string[]; // low -> high
  waitMode: boolean;
  title: string;
  onComplete: (s: GradeSummary) => void;
}

export default function NoteHighway({
  notes,
  bpm,
  stringLabels,
  waitMode: waitModeInitial,
  title,
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(0);
  const [guide, setGuide] = useState(true);
  const [waitMode, setWaitMode] = useState(waitModeInitial);
  const [liveLabel, setLiveLabel] = useState("—");

  // Mutable game state, read by the render loop without re-rendering React.
  const trackerRef = useRef<PitchTracker | null>(null);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const resultsRef = useRef<TargetResult[]>([]);
  const liveRef = useRef<{ midi: number; cents: number }>({ midi: -1, cents: 0 });
  const scheduledRef = useRef<boolean[]>([]);
  const waitIdxRef = useRef(0);
  const waitHoldRef = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  phaseRef.current = phase;

  const secPerBeat = 60 / bpm;
  const expectedTimes = (t0: number) => notes.map((n) => t0 + n.beat * secPerBeat);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    trackerRef.current?.stop();
    trackerRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  // ---- the render + grading loop ----------------------------------------
  const frame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const lanes = stringLabels.length;
    const laneW = cssW / lanes;
    const hitY = cssH - 70;
    const noteR = Math.min(laneW * 0.34, 22);

    // lanes + labels
    for (let i = 0; i < lanes; i++) {
      const x = i * laneW + laneW / 2;
      ctx.strokeStyle = COLORS.dim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssH);
      ctx.stroke();
      ctx.fillStyle = COLORS.dimText;
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stringLabels[i][0], x, cssH - 16);
    }

    // hit-line
    ctx.strokeStyle = COLORS.ochre;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, hitY);
    ctx.lineTo(cssW, hitY);
    ctx.stroke();

    const ac = getAudioContext();
    const now = ac.currentTime;
    const t0 = startTimeRef.current;
    const times = expectedTimes(t0);
    const win = timingWindow(bpm);

    if (waitMode) {
      drawWait(ctx, { lanes, laneW, hitY, noteR, now });
    } else {
      drawTimed(ctx, { lanes, laneW, hitY, noteR, now, times, win });

      // schedule reference guide audio as notes approach
      if (guide && phaseRef.current === "playing") {
        notes.forEach((n, i) => {
          if (!scheduledRef.current[i] && times[i] - now < 0.05 && times[i] - now > -0.05) {
            scheduledRef.current[i] = true;
            playNote(n.midi, Math.max(now, times[i]), 0.4, 0.07);
          }
        });
      }

      // end of the run?
      const lastTime = times[times.length - 1];
      if (phaseRef.current === "playing" && now > lastTime + win + 0.3) {
        finish();
        return;
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, guide, stringLabels, waitMode]);

  // ---- timed-mode drawing -----------------------------------------------
  function drawTimed(
    ctx: CanvasRenderingContext2D,
    g: { lanes: number; laneW: number; hitY: number; noteR: number; now: number; times: number[]; win: number }
  ) {
    notes.forEach((n, i) => {
      const progress = (g.now - (g.times[i] - LEAD_SECONDS)) / LEAD_SECONDS;
      if (progress < -0.1 || progress > 1.4) return;
      const x = n.string * g.laneW + g.laneW / 2;
      const y = progress * g.hitY;
      const r = resultsRef.current[i];
      drawNote(ctx, x, y, g.noteR, n.fret, r?.hit ? "hit" : progress > 1 ? "missed" : "pending");
    });
    drawLive(ctx, g.lanes, g.laneW, g.hitY);
  }

  // ---- wait-mode drawing -------------------------------------------------
  function drawWait(
    ctx: CanvasRenderingContext2D,
    g: { lanes: number; laneW: number; hitY: number; noteR: number; now: number }
  ) {
    const idx = waitIdxRef.current;
    notes.forEach((n, i) => {
      const rel = i - idx; // 0 = current note sitting on the line
      const y = g.hitY - rel * 64;
      if (y < -30 || y > g.hitY + 30) return;
      const x = n.string * g.laneW + g.laneW / 2;
      const r = resultsRef.current[i];
      const state = r?.hit ? "hit" : rel === 0 ? "current" : "pending";
      drawNote(ctx, x, y, g.noteR, n.fret, state);
    });
    drawLive(ctx, g.lanes, g.laneW, g.hitY);
  }

  function drawLive(ctx: CanvasRenderingContext2D, lanes: number, laneW: number, hitY: number) {
    const m = liveRef.current.midi;
    if (m < 0) return;
    // place the live marker on the lane whose tuning is closest in pitch class
    let lane = 0;
    let best = 99;
    notes.forEach((n) => {
      const d = Math.abs(((m - n.midi) % 12 + 12) % 12);
      const dd = Math.min(d, 12 - d);
      if (dd < best) {
        best = dd;
        lane = n.string;
      }
    });
    const x = lane * laneW + laneW / 2;
    const inTune = Math.abs(liveRef.current.cents) < 18;
    ctx.fillStyle = inTune ? COLORS.cyprus : COLORS.ochre;
    ctx.beginPath();
    ctx.arc(x, hitY, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNote(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    fret: number,
    state: "pending" | "hit" | "missed" | "current"
  ) {
    let fill = COLORS.cyprus;
    let alpha = 1;
    if (state === "hit") fill = COLORS.cyprus;
    else if (state === "missed") {
      fill = COLORS.dimText;
      alpha = 0.5;
    } else if (state === "current") fill = COLORS.ochre;
    else fill = "rgba(0,71,65,0.78)";

    ctx.globalAlpha = alpha;
    if (state === "hit") {
      ctx.shadowColor = COLORS.ochre;
      ctx.shadowBlur = 16;
    }
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = COLORS.sand;
    ctx.font = `700 ${Math.round(r)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(fret), x, y + 1);
    ctx.textBaseline = "alphabetic";
    ctx.globalAlpha = 1;
  }

  // ---- pitch input ------------------------------------------------------
  const onPitch = useCallback(
    (p: { midi: number; cents: number; time: number }) => {
      liveRef.current = { midi: p.midi, cents: p.cents };
      if (p.midi >= 0) setLiveLabel(`${noteName(p.midi)}`);
      if (phaseRef.current !== "playing" || p.midi < 0) return;

      if (waitMode) {
        const idx = waitIdxRef.current;
        const target = notes[idx];
        if (!target) return;
        if (pitchMatches(p.midi, target.midi) && Math.abs(p.cents) < 35) {
          waitHoldRef.current += 1;
          if (waitHoldRef.current >= 2) {
            resultsRef.current[idx] = {
              index: idx,
              hit: true,
              timingError: 0,
              cents: Math.abs(p.cents),
            };
            waitIdxRef.current += 1;
            waitHoldRef.current = 0;
            if (waitIdxRef.current >= notes.length) finish();
          }
        } else {
          waitHoldRef.current = 0;
        }
        return;
      }

      // timed: match the nearest in-window, not-yet-hit note
      const t0 = startTimeRef.current;
      const win = timingWindow(bpm);
      let bestI = -1;
      let bestErr = Infinity;
      notes.forEach((n, i) => {
        if (resultsRef.current[i]?.hit) return;
        const expected = t0 + n.beat * secPerBeat;
        const err = Math.abs(p.time - expected);
        if (err <= win && pitchMatches(p.midi, n.midi) && err < bestErr) {
          bestErr = err;
          bestI = i;
        }
      });
      if (bestI >= 0) {
        const expected = t0 + notes[bestI].beat * secPerBeat;
        resultsRef.current[bestI] = {
          index: bestI,
          hit: true,
          timingError: p.time - expected,
          cents: Math.abs(p.cents),
        };
      }
    },
    [bpm, notes, secPerBeat, waitMode]
  );

  function finish() {
    if (phaseRef.current === "done") return;
    setPhase("done");
    cancelAnimationFrame(rafRef.current);
    trackerRef.current?.stop();
    trackerRef.current = null;
    const summary = gradeFromResults(resultsRef.current, bpm, waitMode);
    onComplete(summary);
  }

  async function start() {
    resultsRef.current = notes.map((_, i) => ({
      index: i,
      hit: false,
      timingError: 0,
      cents: 99,
    }));
    scheduledRef.current = notes.map(() => false);
    waitIdxRef.current = 0;
    waitHoldRef.current = 0;

    try {
      trackerRef.current = await startPitchTracker({ onPitch });
    } catch {
      // No mic permission: fall back to a "listen & self-mark" run is handled
      // by the parent; here we just surface the failure via an empty grade.
      setPhase("ready");
      alert(
        "Não consegui acessar o microfone. Permita o acesso para tocar e ser avaliado."
      );
      return;
    }

    // count-in
    setPhase("countdown");
    const ac = getAudioContext();
    for (let i = 4; i > 0; i--) {
      setCount(i);
      playClick(i === 4, ac.currentTime);
      await wait(secPerBeat * 1000);
    }
    setCount(0);
    startTimeRef.current = ac.currentTime + (waitMode ? 0 : 0.1);
    setPhase("playing");
    rafRef.current = requestAnimationFrame(frame);
  }

  function reset() {
    cleanup();
    setPhase("ready");
  }

  const liveCents = liveRef.current.cents;

  return (
    <div className="rounded-2xl border border-cyprus/10 bg-sand p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-cyprus">{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWaitMode((w) => !w)}
            disabled={phase === "playing" || phase === "countdown"}
            className="rounded-full border border-cyprus/15 px-3 py-1 text-[11px] font-semibold text-cyprus/70 disabled:opacity-40"
          >
            {waitMode ? "Modo: espera" : "Modo: no tempo"}
          </button>
          <button
            onClick={() => setGuide((g) => !g)}
            aria-label="Áudio guia"
            className="rounded-full border border-cyprus/15 p-1.5 text-cyprus/70"
          >
            {guide ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="h-[380px] w-full rounded-xl bg-[#fbfaf5]"
        />
        {phase === "countdown" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="animate-pop text-7xl font-bold text-cyprus">
              {count}
            </span>
          </div>
        )}
        {phase === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#fbfaf5]/80 backdrop-blur-sm">
            <Music2 size={32} className="text-cyprus/40" />
            <p className="max-w-xs text-center text-[13px] text-cyprus/60">
              Pegue seu instrumento. Toque cada nota quando ela cruzar a linha.
              Vamos ouvir pelo microfone e te dar a nota.
            </p>
            <button
              onClick={start}
              className="inline-flex items-center gap-2 rounded-full bg-cyprus px-6 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35]"
            >
              <Mic size={16} /> Tocar e ser avaliado
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] text-cyprus/55">
          <Mic size={13} />
          <span>
            Ouvindo: <span className="font-semibold text-cyprus">{liveLabel}</span>
          </span>
          {liveRef.current.midi >= 0 && (
            <span
              className={
                Math.abs(liveCents) < 18 ? "text-cyprus" : "text-ochre"
              }
            >
              {liveCents > 0 ? "+" : ""}
              {liveCents}¢
            </span>
          )}
        </div>
        {(phase === "playing" || phase === "done") && (
          <button
            onClick={phase === "done" ? () => { reset(); start(); } : reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyprus/15 px-3 py-1.5 text-[12px] font-medium text-cyprus/70"
          >
            {phase === "done" ? <Play size={13} /> : <RotateCcw size={13} />}
            {phase === "done" ? "De novo" : "Parar"}
          </button>
        )}
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
