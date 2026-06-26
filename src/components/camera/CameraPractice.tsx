"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, RefreshCw, FlipHorizontal2 } from "lucide-react";
import ChordDiagram from "@/components/ChordDiagram";
import { strumChord } from "@/lib/audio";
import { CHORDS } from "@/lib/chords";

/**
 * Camera practice mode. Streams the rear/selfie camera with a translucent
 * chord-shape reference overlaid in the corner so you can check your finger
 * placement against the target in real time. (Hand-tracking detection is a
 * future upgrade; this works fully offline and on every device today.)
 */
export default function CameraPractice({ lefty = false }: { lefty?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mirror, setMirror] = useState(true);
  const [chordIdx, setChordIdx] = useState(0);
  const chord = CHORDS[chordIdx];

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setOn(true);
    } catch {
      setError(
        "Não consegui acessar a câmera. Verifique a permissão no navegador."
      );
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setOn(false);
  }

  useEffect(() => () => stop(), []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl border border-cyprus/10 bg-cyprus/5">
        <div className="aspect-video w-full">
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ transform: mirror ? "scaleX(-1)" : "none" }}
          />
        </div>

        {!on && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cyprus/5 text-center">
            <Camera size={34} className="text-cyprus/40" />
            <p className="max-w-xs text-[13px] text-cyprus/60">
              Aponte a câmera para suas mãos no braço do instrumento e confira a
              forma do acorde sobreposta no canto.
            </p>
            <button
              onClick={start}
              className="inline-flex items-center gap-2 rounded-full bg-cyprus px-6 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#11421f]"
            >
              <Camera size={16} /> Ligar câmera
            </button>
            {error && (
              <p className="text-[12px] font-medium text-ochre">{error}</p>
            )}
          </div>
        )}

        {on && (
          <div className="absolute right-3 top-3 rounded-2xl bg-sand/95 p-3 shadow-lg backdrop-blur">
            <p className="mb-1 text-center text-sm font-bold text-cyprus">
              {chord.display}
            </p>
            <ChordDiagram frets={chord.frets} fingers={chord.fingers} size={0.95} lefty={lefty} />
          </div>
        )}
      </div>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {on ? (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-full border border-cyprus/20 px-4 py-2 text-sm font-semibold text-cyprus"
          >
            <CameraOff size={16} /> Desligar
          </button>
        ) : (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full bg-cyprus px-4 py-2 text-sm font-semibold text-sand"
          >
            <Camera size={16} /> Ligar câmera
          </button>
        )}
        <button
          onClick={() => setMirror((m) => !m)}
          className="inline-flex items-center gap-2 rounded-full border border-cyprus/15 px-4 py-2 text-[13px] font-medium text-cyprus/70"
        >
          <FlipHorizontal2 size={15} /> Espelhar
        </button>
        <button
          onClick={() => strumChord(chord.midi)}
          className="inline-flex items-center gap-2 rounded-full border border-cyprus/15 px-4 py-2 text-[13px] font-medium text-cyprus/70"
        >
          <RefreshCw size={15} /> Ouvir acorde
        </button>
      </div>

      {/* chord picker */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CHORDS.map((c, i) => (
          <button
            key={c.display}
            onClick={() => setChordIdx(i)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
              i === chordIdx
                ? "bg-cyprus text-sand"
                : "bg-cyprus/8 text-cyprus hover:bg-cyprus/15"
            }`}
          >
            {c.display}
          </button>
        ))}
      </div>
    </div>
  );
}
