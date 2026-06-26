"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Zap, Flame, ArrowRight, RotateCcw } from "lucide-react";
import NoteHighway from "./NoteHighway";
import { gradeLesson, type GradeResult } from "@/app/actions/lesson";
import type { GradeSummary } from "@/lib/grading";
import type { TargetNote } from "@/lib/curriculum";

interface Props {
  exerciseId: string;
  title: string;
  notes: TargetNote[];
  bpm: number;
  stringLabels: string[];
  waitMode: boolean;
  bestCrown: number;
  lefty?: boolean;
}

export default function LessonPlayer({
  exerciseId,
  title,
  notes,
  bpm,
  stringLabels,
  waitMode,
  bestCrown,
  lefty = false,
}: Props) {
  const router = useRouter();
  const [summary, setSummary] = useState<GradeSummary | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleComplete(s: GradeSummary) {
    setSummary(s);
    const res = await gradeLesson({
      exerciseId,
      crown: s.crown,
      pitchScore: s.pitchScore,
      tempoScore: s.tempoScore,
    });
    setResult(res);
  }

  function again() {
    setSummary(null);
    setResult(null);
  }

  if (summary) {
    return (
      <ResultPanel
        summary={summary}
        result={result}
        bestCrown={bestCrown}
        pending={pending}
        onAgain={again}
        onContinue={() =>
          startTransition(() => {
            router.push("/app/lessons");
            router.refresh();
          })
        }
      />
    );
  }

  return (
    <NoteHighway
      notes={notes}
      bpm={bpm}
      stringLabels={stringLabels}
      waitMode={waitMode}
      title={title}
      lefty={lefty}
      onComplete={handleComplete}
    />
  );
}

function ResultPanel({
  summary,
  result,
  bestCrown,
  pending,
  onAgain,
  onContinue,
}: {
  summary: GradeSummary;
  result: GradeResult | null;
  bestCrown: number;
  pending: boolean;
  onAgain: () => void;
  onContinue: () => void;
}) {
  const passed = summary.passed;
  const pct = Math.round(summary.accuracy * 100);
  const xp = result?.ok ? result.xp : 0;
  const streak = result?.ok ? result.streak : 0;

  return (
    <div className="rounded-2xl border border-cyprus/10 bg-sand p-7 text-center animate-pop">
      <div className="mb-1 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((c) => (
          <Crown
            key={c}
            size={28}
            className={c <= summary.crown ? "text-ochre" : "text-cyprus/15"}
            fill={c <= summary.crown ? "#f96015" : "none"}
          />
        ))}
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-cyprus">
        {passed ? "Mandou bem!" : "Quase lá!"}
      </h2>
      <p className="mt-1 text-[14px] text-cyprus/60">
        {passed
          ? summary.crown > bestCrown
            ? "Novo recorde nessa lição."
            : "Lição concluída."
          : "Acerte ao menos 60% das notas para passar. Tente de novo!"}
      </p>

      <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
        <Stat label="Precisão" value={`${pct}%`} icon={<Check size={16} />} />
        <Stat
          label="Afinação"
          value={`${Math.round(summary.pitchScore * 100)}%`}
          icon={<Check size={16} />}
        />
        <Stat
          label="Tempo"
          value={`${Math.round(summary.tempoScore * 100)}%`}
          icon={<Check size={16} />}
        />
      </div>

      {passed && (
        <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyprus">
            <Zap size={16} className="text-ochre" /> +{xp} XP
          </span>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyprus">
              <Flame size={16} className="text-ochre" /> {streak} dias
            </span>
          )}
        </div>
      )}

      <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={onAgain}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-cyprus/15 px-6 py-3 text-sm font-semibold text-cyprus"
        >
          <RotateCcw size={16} /> Tentar de novo
        </button>
        <button
          onClick={onContinue}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyprus px-6 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#11421f] disabled:opacity-60"
        >
          Continuar <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-cyprus/[0.06] px-3 py-4">
      <div className="text-xl font-bold text-cyprus">{value}</div>
      <div className="mt-0.5 flex items-center justify-center gap-1 text-[11px] font-medium text-cyprus/50">
        {label}
      </div>
    </div>
  );
}
