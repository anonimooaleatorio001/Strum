import Link from "next/link";
import {
  Play,
  Gauge,
  Timer,
  Music,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import CoachCard from "@/components/CoachCard";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { getSkillStrengths } from "@/server/skills";
import { localCoachTip } from "@/server/adaptive";
import { findExercise } from "@/lib/curriculum";
import { todayKey } from "@/lib/dates";

const SHORTCUTS = [
  { href: "/app/review", label: "Revisão", icon: Sparkles },
  { href: "/app/lessons", label: "Trilha", icon: GraduationCap },
  { href: "/app/tuner", label: "Afinador", icon: Gauge },
  { href: "/app/metronome", label: "Metrônomo", icon: Timer },
  { href: "/app/chords", label: "Acordes", icon: Music },
];

export default async function AppHome() {
  const user = await requireOnboardedUser();
  const path = await getPathState(user);
  const progress = user.progress;

  const dailyXp = progress?.dailyDate === todayKey() ? progress.dailyXp : 0;
  const goal = user.dailyGoalXp;
  const goalPct = Math.min(100, Math.round((dailyXp / goal) * 100));

  const todays = path.currentId
    ? findExercise(user.instrument, user.numStrings, path.currentId)
    : null;

  const strengths = await getSkillStrengths(user.id);
  const strengthValues = Object.values(strengths);
  const initialTip = localCoachTip({
    streak: progress?.streak ?? 0,
    dailyXp,
    dailyGoalXp: goal,
    weakestStrength: strengthValues.length ? Math.min(...strengthValues) : 1,
  });

  return (
    <div className="mx-auto max-w-2xl">
      {/* greeting */}
      <div className="animate-fade-up flex items-end justify-between">
        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-forest sm:text-2xl">
            Olá{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-[13px] text-forest/55">
            {user.instrument === "BASS" ? "Baixo" : "Violão"} ·{" "}
            {path.doneCount}/{path.totalExercises} lições
          </p>
        </div>
        <span className="text-[13px] font-semibold text-forest/45">
          {goalPct}% da meta
        </span>
      </div>

      {/* lesson of the day — the one hero action */}
      <div className="animate-fade-up mt-4 overflow-hidden rounded-3xl bg-forest text-cream [animation-delay:80ms]">
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-cream/50">
              {todays ? "Lição de hoje" : "Tudo em dia 🎉"}
            </p>
            <h2 className="font-display mt-0.5 truncate text-lg font-bold sm:text-xl">
              {todays ? todays.title : "Você completou a trilha"}
            </h2>
            <p className="mt-0.5 text-[13px] text-cream/65">
              {todays
                ? `${todays.notes.length} notas · ${todays.bpm} BPM`
                : "Volte amanhã para manter a ofensiva"}
            </p>
          </div>
          <Link
            href={todays ? `/app/lessons/${todays.id}` : "/app/lessons"}
            aria-label={todays ? "Começar lição" : "Ver trilha"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sunshine text-forest-deep transition-transform hover:scale-105 active:scale-95"
          >
            <Play size={20} strokeWidth={2.4} className="ml-0.5" />
          </Link>
        </div>
        {/* slim daily-goal bar */}
        <div className="px-5 pb-4 sm:px-6">
          <div className="mb-1 flex items-center justify-between text-[11px] text-cream/55">
            <span>Meta de hoje</span>
            <span>
              {dailyXp}/{goal} XP
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-cream/15">
            <div
              className="h-full rounded-full bg-sunshine transition-all duration-700"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* coach tip — slim line */}
      <div className="animate-fade-up mt-3 [animation-delay:160ms]">
        <CoachCard initialTip={initialTip} />
      </div>

      {/* shortcuts — compact chips */}
      <div className="animate-fade-up mt-4 flex flex-wrap gap-2 [animation-delay:240ms]">
        {SHORTCUTS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-cream px-4 py-2 text-[13px] font-medium text-forest/80 transition-colors hover:border-forest/30 hover:text-forest"
            >
              <Icon size={15} />
              {s.label}
            </Link>
          );
        })}
        <Link
          href="/app/songs"
          className="inline-flex items-center gap-1.5 rounded-full bg-forest/8 px-4 py-2 text-[13px] font-medium text-forest transition-colors hover:bg-forest/15"
        >
          Mais <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
