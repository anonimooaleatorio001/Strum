import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Check } from "lucide-react";
import {
  autoCorrelate,
  centsOffFromPitch,
  GUITAR_STRINGS,
  nearestString,
  noteFromPitch,
  noteName,
  noteOctave,
} from "../lib/pitch";

interface Reading {
  midi: number;
  cents: number;
  freq: number;
}

export default function Tuner() {
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
      setError("Microphone access isn't available in this browser.");
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
          // hold the last reading briefly, then clear on sustained silence
          silenceRef.current += 1;
          if (silenceRef.current > 30) setReading(null);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone permission was denied. Allow mic access to tune.");
      } else if (name === "NotFoundError") {
        setError("No microphone was found on this device.");
      } else {
        setError("Couldn't start the microphone. Please try again.");
      }
      stop();
    }
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  const cents = reading?.cents ?? 0;
  const inTune = reading !== null && Math.abs(cents) <= 5;
  const activeString = reading ? nearestString(reading.midi) : -1;
  const needlePct = Math.max(-50, Math.min(50, cents)) + 50; // 0..100

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-cyprus/10 bg-sand p-6 sm:p-10 shadow-[0_2px_30px_rgba(0,71,65,0.06)]">
        {/* Big note read-out */}
        <div className="flex flex-col items-center">
          <div
            className={`flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
              inTune
                ? "border-cyprus bg-cyprus text-sand"
                : reading
                ? "border-cyprus/30 bg-sand text-cyprus"
                : "border-cyprus/15 bg-sand text-cyprus/40"
            }`}
          >
            <div className="text-center leading-none">
              <div className="text-5xl sm:text-6xl font-semibold tracking-tight">
                {reading ? noteName(reading.midi) : "–"}
                {reading && (
                  <span className="align-super text-xl sm:text-2xl opacity-70">
                    {noteOctave(reading.midi)}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs font-medium opacity-70">
                {reading ? `${reading.freq.toFixed(1)} Hz` : "no signal"}
              </div>
            </div>
          </div>

          <div className="mt-4 h-6 text-sm font-medium">
            {inTune ? (
              <span className="inline-flex items-center gap-1.5 text-cyprus">
                <Check size={16} strokeWidth={2.4} /> In tune
              </span>
            ) : reading ? (
              <span className="text-cyprus/70">
                {cents > 0 ? "♯ sharp" : "♭ flat"} · {Math.abs(cents)} cents
              </span>
            ) : (
              <span className="text-cyprus/40">Play a single string…</span>
            )}
          </div>
        </div>

        {/* Cents meter */}
        <div className="mt-6">
          <div className="relative h-12">
            {/* centre band */}
            <div className="absolute left-1/2 top-0 h-12 w-[12%] -translate-x-1/2 rounded-md bg-cyprus/10" />
            {/* ticks */}
            <div className="absolute inset-x-0 top-0 flex justify-between px-1">
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-px ${i === 5 ? "h-6 bg-cyprus/50" : "h-3 bg-cyprus/20"}`}
                />
              ))}
            </div>
            {/* needle */}
            <div
              className="absolute top-0 h-9 w-[3px] -translate-x-1/2 rounded-full transition-all duration-100"
              style={{
                left: `${needlePct}%`,
                background: inTune ? "#004741" : "#004741",
                opacity: reading ? 1 : 0.25,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] font-medium text-cyprus/45">
            <span>♭ −50</span>
            <span>0</span>
            <span>+50 ♯</span>
          </div>
        </div>

        {/* Standard tuning targets */}
        <div className="mt-7 grid grid-cols-6 gap-2">
          {GUITAR_STRINGS.map((s, i) => {
            const active = i === activeString;
            return (
              <div
                key={s.label}
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
            {listening ? "Stop listening" : "Start tuning"}
          </button>
          {error && (
            <p className="max-w-sm text-center text-[13px] text-cyprus/70">{error}</p>
          )}
          <p className="max-w-sm text-center text-[12px] text-cyprus/45">
            Pluck one string at a time. Strum picks up your mic — nothing leaves
            your device.
          </p>
        </div>
      </div>
    </div>
  );
}
