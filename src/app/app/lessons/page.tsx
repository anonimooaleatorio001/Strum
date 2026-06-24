import { GraduationCap } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LessonPath from "@/components/LessonPath";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";

export default async function LessonsPage() {
  const user = await requireOnboardedUser();
  const path = await getPathState(user);

  return (
    <div>
      <PageHeader
        icon={GraduationCap}
        title="Sua trilha"
        subtitle="Complete uma lição por vez para destravar a próxima e manter o streak."
      />

      <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-cyprus/10 bg-sand p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-cyprus">
            Progresso do curso
          </span>
          <span className="text-sm font-medium text-cyprus/60">
            {path.doneCount}/{path.totalExercises}
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cyprus/10">
          <div
            className="h-full rounded-full bg-cyprus transition-all duration-500"
            style={{
              width: `${(path.doneCount / path.totalExercises) * 100}%`,
            }}
          />
        </div>
      </div>

      <LessonPath path={path} />
    </div>
  );
}
