import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import ExercisePlayer from "@/components/ExercisePlayer";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { findExercise } from "@/lib/curriculum";
import { getTuning } from "@/lib/instruments";
import { practiceExercise } from "@/app/actions/lesson";

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const user = await requireOnboardedUser();

  const exercise = findExercise(user.instrument, user.numStrings, exerciseId);
  if (!exercise) notFound();

  const path = await getPathState(user);
  const status = path.statusById[exerciseId];
  if (!status?.unlocked) redirect("/app/lessons");

  const tuning = getTuning(user.instrument, user.numStrings);
  const stringLabels = tuning.map((s) => s.label);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/app/lessons"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyprus/60 transition-colors hover:text-cyprus"
      >
        <ArrowLeft size={16} /> Voltar à trilha
      </Link>

      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-cyprus">
          {exercise.title}
        </h1>
        {status.crown > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyprus/10 px-2.5 py-1 text-[11px] font-bold text-cyprus">
            <Check size={12} strokeWidth={3} /> coroa {status.crown}
          </span>
        )}
      </div>
      <p className="mb-6 text-[14px] text-cyprus/60">
        Ouça a sequência, toque junto no seu instrumento e marque como praticada
        para ganhar XP. (O player com detecção de áudio chega na Fase 2.)
      </p>

      <ExercisePlayer
        notes={exercise.notes}
        bpm={exercise.bpm}
        stringLabels={stringLabels}
      />

      <form action={practiceExercise} className="mt-6">
        <input type="hidden" name="exerciseId" value={exercise.id} />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyprus py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35] sm:w-auto sm:px-10"
        >
          <Check size={18} strokeWidth={2.4} />
          {status.crown > 0 ? "Praticar de novo (+5 XP)" : "Concluir lição (+15 XP)"}
        </button>
      </form>
    </div>
  );
}
