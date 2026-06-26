"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { getAudioContext, playNote } from "@/lib/audio";
import {
  nextRound,
  NOTE_NAMES_PT,
  type EarMode,
  type EarRound,
} from "@/lib/ear";
import { recordEarAnswer } from "@/app/actions/learn";

export default function EarTrainer({ best }: { best: number }) {
  const [mode, setMode] = useState<EarMode>("interval");
  const [round, setRound] = useState<EarRound | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(best);
  const [score, setScore] = useState(0);
  const answered = useRef(false);

  const playRound = useCallback((r: EarRound) => {
    const ac = getAudioContext();
    const t = ac.currentTime + 0.08;
    if (r.mode === "interval") {
      playNote(r.rootMidi, t, 0.9, 0.12);
      playNote(r.rootMidi + r.interval.semitones, t + 0.65, 1.1, 0.12);
    } else {
      playNote(r.midi, t, 1.3, 0.12);
    }
  }, []);

  const newRound = useCallback(
    (m: EarMode) => {
      const difficulty = Math.floor(streak / 4);
      const r = nextRound(m, difficulty);
      answered.current = false;
      setPicked(null);
      setRound(r);
      playRound(r);
    },
    [playRound, streak]
  );

  useEffect(() => {
    newRound(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  async function answer(value: number) {
    if (!round || answered.current) return;
    answered.current = true;
    setPicked(value);

    const correctVal =
      round.mode === "interval" ? round.interval.semitones : round.pitchClass;
    const ok = value === correctVal;
    const newStreak = ok ? streak + 1 : 0;
    setStreak(newStreak);
    if (ok) {
      setScore((s) => s + 1);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    }
    await recordEarAnswer({ correct: ok, streak: Math.max(newStreak, bestStreak) });
    setTimeout(() => newRound(mode), 1100);
  }

  const correctVal =
    round?.mode === "interval"
      ? round.interval.semitones
      : round?.mode === "note"
      ? round.pitchClass
      : -1;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex justify-center gap-2">
        {(["interval", "note"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium ${
              mode === m
                ? "bg-cyprus text-sand"
                : "bg-cyprus/8 text-cyprus/70"
            }`}
          >
            {m === "interval" ? "Intervalos" : "Notas"}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-center gap-6 text-sm">
        <span className="text-cyprus/60">
          Sequência: <b className="text-cyprus">{streak}</b>
        </span>
        <span className="text-cyprus/60">
          Recorde: <b className="text-cyprus">{bestStreak}</b>
        </span>
        <span className="text-cyprus/60">
          Acertos: <b className="text-cyprus">{score}</b>
        </span>
      </div>

      <div className="rounded-2xl border border-cyprus/10 bg-sand p-6 text-center">
        <button
          onClick={() => round && playRound(round)}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-cyprus px-6 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#11421f]"
        >
          <Volume2 size={16} /> Ouvir de novo
        </button>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {round?.mode === "interval" &&
            round.options.map((opt) => (
              <AnswerButton
                key={opt.semitones}
                label={opt.name}
                state={btnState(opt.semitones, picked, correctVal)}
                onClick={() => answer(opt.semitones)}
              />
            ))}
          {round?.mode === "note" &&
            round.options.map((pc) => (
              <AnswerButton
                key={pc}
                label={NOTE_NAMES_PT[pc]}
                state={btnState(pc, picked, correctVal)}
                onClick={() => answer(pc)}
              />
            ))}
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] text-cyprus/45">
        Ganhe 2 XP por acerto. A dificuldade sobe conforme você acerta seguidas.
      </p>
    </div>
  );
}

function btnState(
  value: number,
  picked: number | null,
  correct: number
): "idle" | "correct" | "wrong" {
  if (picked === null) return "idle";
  if (value === correct) return "correct";
  if (value === picked) return "wrong";
  return "idle";
}

function AnswerButton({
  label,
  state,
  onClick,
}: {
  label: string;
  state: "idle" | "correct" | "wrong";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-3.5 text-sm font-semibold transition-colors ${
        state === "correct"
          ? "bg-cyprus text-sand"
          : state === "wrong"
          ? "bg-ochre/20 text-ochre"
          : "bg-cyprus/8 text-cyprus hover:bg-cyprus/15"
      }`}
    >
      {label}
    </button>
  );
}
