"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Check } from "lucide-react";
import {
  autoCorrelate,
  centsOffFromPitch,
  noteFromPitch,
  noteName,
  noteOctave,
} from "@/lib/pitch";
import {
  getTuning,
  nearestStringIndex,
  type InstrumentId,
  type StringDef,
} from "@/lib/instruments";

interface Reading {
  midi: number;
  cents: number;
  freq: number;
}

export default function Tuner({
  instrument = "GUITAR",
  numStrings = 6,
}: {
  instrument?: InstrumentId;
  numStrings?: number;
}) {
  const strings: StringDef[] = getTuning(instrument, numStrings);

  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const silenceRef = useRef<number>(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      void ctxRef.current.close();
    }
    ctxRef.current = null;
    setListening(false);
    setReading(null);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Seu navegador não permite acesso ao microfone.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });
      streamRef.current = stream;
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctor();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      bufRef.current = new Float32Array(analyser.fftSize);
      setListening(true);

      const tick = () => {
        const buf = bufRef.current;
        if (!buf) return;
        analyser.getFloatTimeDomainData(buf);
        const freq = autoCorrelate(buf, ctx.sampleRate);
        if (freq > 0 && freq < 2000) {
          silenceRef.current = 0;
          const midi = noteFromPitch(freq);
          const cents = centsOffFromPitch(freq, midi);
          setReading({ midi, cents, freq });
        } else {
          silenceRef.current += 1;
          if (silenceRef.current > 30) setReading(null);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Permissão do microfone negada. Permita o acesso para afinar.");
      } else if (name === "NotFoundError") {
        setError("Nenhum microfone encontrado neste dispositivo.");
      } else {
        setError("Não foi possível iniciar o microfone. Tente de novo.");
      }
      stop();
    }
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  const cents = reading?.cents ?? 0;
  const inTune = reading !== null && Math.abs(cents) <= 5;
  const activeString = reading ? nearestStringIndex(strings, reading.midi) : -1;
  const needlePct = Math.max(-50, Math.min(50, cents)) + 50;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-cyprus/10 bg-sand p-6 shadow-[0_2px_30px_rgba(0,71,65,0.06)] sm:p-10">
        <div className="flex flex-col items-center">
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-full border-2 transition-colors duration-300 sm:h-40 sm:w-40 ${
              inTune
                ? "border-cyprus bg-cyprus text-sand"
                : reading
                ? "border-cyprus/30 bg-sand text-cyprus"
                : "border-cyprus/15 bg-sand text-cyprus/40"
            }`}
          >
            <div className="text-center leading-none">
              <div className="text-5xl font-semibold tracking-tight sm:text-6xl">
                {reading ? noteName(reading.midi) : "–"}
                {reading && (
                  <span className="align-super text-xl opacity-70 sm:text-2xl">
                    {noteOctave(reading.midi)}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs font-medium opacity-70">
                {reading ? `${reading.freq.toFixed(1)} Hz` : "sem sinal"}
              </div>
            </div>
          </div>

          <div className="mt-4 h-6 text-sm font-medium">
            {inTune ? (
              <span className="inline-flex items-center gap-1.5 text-cyprus">
                <Check size={16} strokeWidth={2.4} /> Afinada
              </span>
            ) : reading ? (
              <span className="text-cyprus/70">
                {cents > 0 ? "♯ aguda" : "♭ grave"} · {Math.abs(cents)} cents
              </span>
            ) : (
              <span className="text-cyprus/40">Toque uma corda…</span>
            )}
          </div>
        </div>

        {/* Cents meter */}
        <div className="mt-6">
          <div className="relative h-12">
            <div className="absolute left-1/2 top-0 h-12 w-[12%] -translate-x-1/2 rounded-md bg-cyprus/10" />
            <div className="absolute inset-x-0 top-0 flex justify-between px-1">
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-px ${
                    i === 5 ? "h-6 bg-cyprus/50" : "h-3 bg-cyprus/20"
                  }`}
                />
              ))}
            </div>
            <div
              className="absolute top-0 h-9 w-[3px] -translate-x-1/2 rounded-full bg-cyprus transition-all duration-100"
              style={{ left: `${needlePct}%`, opacity: reading ? 1 : 0.25 }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] font-medium text-cyprus/45">
            <span>♭ −50</span>
            <span>0</span>
            <span>+50 ♯</span>
          </div>
        </div>

        {/* Target strings */}
        <div
          className="mt-7 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${strings.length}, minmax(0, 1fr))` }}
        >
          {strings.map((s, i) => {
            const active = i === activeString;
            return (
              <div
                key={s.label + i}
                className={`flex flex-col items-center rounded-xl border py-2.5 transition-colors duration-200 ${
                  active && inTune
                    ? "border-cyprus bg-cyprus text-sand"
                    : active
                    ? "border-cyprus/50 bg-cyprus/5 text-cyprus"
                    : "border-cyprus/10 bg-sand text-cyprus/55"
                }`}
              >
                <span className="text-base font-semibold">{s.label[0]}</span>
                <span className="text-[10px] opacity-70">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={listening ? stop : start}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ${
              listening
                ? "bg-cyprus/10 text-cyprus hover:bg-cyprus/15"
                : "bg-cyprus text-sand hover:bg-[#013a35]"
            }`}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
            {listening ? "Parar" : "Começar a afinar"}
          </button>
          {error && (
            <p className="max-w-sm text-center text-[13px] text-cyprus/70">
              {error}
            </p>
          )}
          <p className="max-w-sm text-center text-[12px] text-cyprus/45">
            Toque uma corda de cada vez. O áudio do microfone não sai do seu
            dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}
