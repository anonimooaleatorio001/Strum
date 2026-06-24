import Link from "next/link";
import { Check, Lock, Star, Play } from "lucide-react";
import type { PathState } from "@/server/path";

/** Winding, Duolingo-style lesson path. Pure server component. */
export default function LessonPath({ path }: { path: PathState }) {
  let nodeIndex = -1;

  return (
    <div className="mx-auto max-w-2xl">
      {path.units.map((unit) => (
        <div key={unit.id} className="mb-4">
          <div className="sticky top-[64px] z-10 mb-2 rounded-2xl bg-cyprus px-5 py-4 text-sand shadow-[0_4px_20px_rgba(0,71,65,0.18)]">
            <p className="text-[12px] font-medium uppercase tracking-wide text-sand/60">
              {unit.subtitle}
            </p>
            <h3 className="text-lg font-semibold">{unit.title}</h3>
          </div>

          <div className="flex flex-col items-center py-4">
            {unit.skills.flatMap((skill) =>
              skill.exercises.map((ex) => {
                nodeIndex += 1;
                const status = path.statusById[ex.id];
                const isCurrent = ex.id === path.currentId;
                const offset = Math.round(Math.sin(nodeIndex * 0.9) * 84);

                const Node = (
                  <div className="relative">
                    {isCurrent && (
                      <span className="absolute -inset-1 animate-pulse-ring rounded-full bg-cyprus/40" />
                    )}
                    {isCurrent && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cyprus px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-sand">
                        Comece
                      </span>
                    )}
                    <span
                      className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full transition-transform duration-200 ${
                        status.unlocked ? "hover:scale-105 active:scale-95" : ""
                      } ${
                        status.crown > 0
                          ? "bg-cyprus text-sand shadow-[0_5px_0_#012e2a]"
                          : isCurrent
                          ? "bg-cyprus text-sand shadow-[0_5px_0_#012e2a]"
                          : status.unlocked
                          ? "bg-cyprus/15 text-cyprus shadow-[0_5px_0_rgba(0,71,65,0.18)]"
                          : "bg-cyprus/10 text-cyprus/30"
                      }`}
                    >
                      {status.crown > 0 ? (
                        <span className="flex items-center">
                          <Check size={26} strokeWidth={2.6} />
                          {status.crown > 1 && (
                            <span className="ml-0.5 text-xs font-bold">
                              {status.crown}
                            </span>
                          )}
                        </span>
                      ) : isCurrent ? (
                        <Play size={26} strokeWidth={2.4} className="ml-0.5" />
                      ) : status.unlocked ? (
                        <Star size={26} strokeWidth={2.2} />
                      ) : (
                        <Lock size={24} strokeWidth={2.2} />
                      )}
                    </span>
                  </div>
                );

                return (
                  <div
                    key={ex.id}
                    className="flex flex-col items-center py-5"
                    style={{ transform: `translateX(${offset}px)` }}
                  >
                    {status.unlocked ? (
                      <Link href={`/app/lessons/${ex.id}`} aria-label={ex.title}>
                        {Node}
                      </Link>
                    ) : (
                      <div aria-label={`${ex.title} (bloqueado)`}>{Node}</div>
                    )}
                    <span
                      className={`mt-3 max-w-[140px] text-center text-[13px] font-medium ${
                        status.unlocked ? "text-cyprus" : "text-cyprus/35"
                      }`}
                    >
                      {ex.title}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
