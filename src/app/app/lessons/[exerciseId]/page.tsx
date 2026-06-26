import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown } from "lucide-react";
import LessonPlayer from "@/components/player/LessonPlayer";
import ExercisePlayer from "@/components/ExercisePlayer";
import { practiceExercise } from "@/app/actions/lesson";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { findExercise } from "@/lib/curriculum";
import { getTuning, remapDeadFrets, type DeadFrets } from "@/lib/instruments";

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
  const settings = (user.settings as { waitMode?: boolean } | null) ?? {};
  const deadFrets = (user.deadFrets as DeadFrets | null) ?? null;
  const notes = remapDeadFrets(exercise.notes, deadFrets, tuning);

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
          <span className="inline-flex items-center gap-1 rounded-full bg-ochre/15 px-2.5 py-1 text-[11px] font-bold text-ochre">
            <Crown size={12} fill="#C8893B" /> {status.crown}
          </span>
        )}
      </div>
      <p className="mb-6 text-[14px] text-cyprus/60">
        Toque cada nota quando ela cruzar a linha. O Strum ouve pelo microfone,
        avalia sua afinação e o tempo, e te dá coroas.
      </p>

      <LessonPlayer
        exerciseId={exercise.id}
        title={exercise.title}
        notes={notes}
        bpm={exercise.bpm}
        stringLabels={stringLabels}
        waitMode={Boolean(settings.waitMode)}
        bestCrown={status.crown}
      />

      <details className="mt-6 rounded-2xl border border-cyprus/10 bg-sand">
        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-cyprus">
          Sem microfone? Ouça e marque como praticada
        </summary>
        <div className="border-t border-cyprus/10 px-5 py-5">
          <ExercisePlayer
            notes={notes}
            bpm={exercise.bpm}
            stringLabels={stringLabels}
          />
          <form action={practiceExercise} className="mt-5">
            <input type="hidden" name="exerciseId" value={exercise.id} />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyprus/20 py-3 text-sm font-semibold text-cyprus transition-colors hover:bg-cyprus/5"
            >
              {status.crown > 0
                ? "Praticar de novo (+5 XP)"
                : "Concluir sem áudio (+15 XP)"}
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
