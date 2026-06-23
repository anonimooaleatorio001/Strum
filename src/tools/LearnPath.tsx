import { useMemo, useState } from "react";
import { Check, Lock, Star, Play } from "lucide-react";
import { useProgress, DAILY_GOAL_XP } from "../state/progress";
import {
  UNITS,
  ORDERED_LESSONS,
  TOTAL_LESSONS,
  type Lesson,
} from "./lessonData";
import LessonModal from "./LessonModal";

export default function LearnPath() {
  const { isLessonComplete, completeLesson, completedLessons, dailyXp } =
    useProgress();
  const [active, setActive] = useState<Lesson | null>(null);

  const { statusById, currentId } = useMemo(() => {
    const statusById = new Map<
      string,
      { completed: boolean; unlocked: boolean }
    >();
    ORDERED_LESSONS.forEach(({ lesson }, i) => {
      const completed = isLessonComplete(lesson.id);
      const prevDone =
        i === 0 || isLessonComplete(ORDERED_LESSONS[i - 1].lesson.id);
      statusById.set(lesson.id, { completed, unlocked: prevDone });
    });
    const current = ORDERED_LESSONS.find(({ lesson }) => {
      const s = statusById.get(lesson.id)!;
      return s.unlocked && !s.completed;
    });
    return { statusById, currentId: current?.lesson.id };
  }, [isLessonComplete, completedLessons]); // eslint-disable-line react-hooks/exhaustive-deps

  const doneCount = completedLessons.length;
  const goalPct = Math.min(100, Math.round((dailyXp / DAILY_GOAL_XP) * 100));

  let nodeIndex = -1;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Daily goal + overall progress */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-cyprus">Daily goal</span>
            <span className="text-sm font-medium text-cyprus/60">
              {dailyXp}/{DAILY_GOAL_XP} XP
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cyprus/10">
            <div
              className="h-full rounded-full bg-[#C8893B] transition-all duration-500"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-cyprus/50">
            {goalPct >= 100 ? "Goal smashed — see you tomorrow! 🎉" : "Keep your streak alive today."}
          </p>
        </div>
        <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-cyprus">Course progress</span>
            <span className="text-sm font-medium text-cyprus/60">
              {doneCount}/{TOTAL_LESSONS}
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cyprus/10">
            <div
              className="h-full rounded-full bg-cyprus transition-all duration-500"
              style={{ width: `${(doneCount / TOTAL_LESSONS) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-cyprus/50">
            {doneCount === TOTAL_LESSONS
              ? "You finished the whole course — legend!"
              : "Lessons completed so far."}
          </p>
        </div>
      </div>

      {/* Units + winding path */}
      {UNITS.map((unit) => (
        <div key={unit.id} className="mb-4">
          <div className="sticky top-[64px] z-10 mb-2 rounded-2xl bg-cyprus px-5 py-4 text-sand shadow-[0_4px_20px_rgba(0,71,65,0.18)]">
            <p className="text-[12px] font-medium uppercase tracking-wide text-sand/60">
              {unit.subtitle}
            </p>
            <h3 className="text-lg font-semibold">{unit.title}</h3>
          </div>

          <div className="flex flex-col items-center py-4">
            {unit.lessons.map((lesson) => {
              nodeIndex += 1;
              const status = statusById.get(lesson.id)!;
              const isCurrent = lesson.id === currentId;
              const offset = Math.round(Math.sin(nodeIndex * 0.9) * 84);

              return (
                <div
                  key={lesson.id}
                  className="flex flex-col items-center py-5"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  <div className="relative">
                    {isCurrent && (
                      <span className="absolute -inset-1 rounded-full bg-cyprus/40 animate-pulse-ring" />
                    )}
                    {isCurrent && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cyprus px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-sand">
                        Start
                      </span>
                    )}
                    <button
                      disabled={!status.unlocked}
                      onClick={() => setActive(lesson)}
                      aria-label={lesson.title}
                      className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full transition-transform duration-200 ${
                        status.unlocked
                          ? "hover:scale-105 active:scale-95"
                          : "cursor-not-allowed"
                      } ${
                        status.completed
                          ? "bg-cyprus text-sand shadow-[0_5px_0_#012e2a]"
                          : isCurrent
                          ? "bg-cyprus text-sand shadow-[0_5px_0_#012e2a]"
                          : status.unlocked
                          ? "bg-cyprus/15 text-cyprus shadow-[0_5px_0_rgba(0,71,65,0.18)]"
                          : "bg-cyprus/10 text-cyprus/30"
                      }`}
                    >
                      {status.completed ? (
                        <Check size={28} strokeWidth={2.6} />
                      ) : isCurrent ? (
                        <Play size={26} strokeWidth={2.4} className="ml-0.5" />
                      ) : status.unlocked ? (
                        <Star size={26} strokeWidth={2.2} />
                      ) : (
                        <Lock size={24} strokeWidth={2.2} />
                      )}
                    </button>
                  </div>
                  <span
                    className={`mt-3 max-w-[140px] text-center text-[13px] font-medium ${
                      status.unlocked ? "text-cyprus" : "text-cyprus/35"
                    }`}
                  >
                    {lesson.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {active && (
        <LessonModal
          lesson={active}
          onClose={() => setActive(null)}
          onComplete={(xp) => {
            completeLesson(active.id, xp);
            setActive(null);
          }}
        />
      )}
    </div>
  );
}
