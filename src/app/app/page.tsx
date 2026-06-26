import Link from "next/link";
import { Flame, Zap, Target, Play, Gauge, Timer, Music, Sparkles } from "lucide-react";
import CoachCard from "@/components/CoachCard";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { getSkillStrengths } from "@/server/skills";
import { localCoachTip } from "@/server/adaptive";
import { findExercise } from "@/lib/curriculum";
import { todayKey } from "@/lib/dates";

const QUICK = [
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
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-cyprus sm:text-3xl">
        Bom te ver de novo{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
      </h1>
      <p className="mt-1 text-[14px] text-cyprus/60">
        {user.instrument === "BASS" ? "Baixo" : "Violão/Guitarra"} ·{" "}
        {user.numStrings} cordas
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
          <div className="flex items-center gap-2 text-cyprus">
            <Flame size={18} className="text-ochre" fill="#C8893B" />
            <span className="text-2xl font-semibold">{progress?.streak ?? 0}</span>
          </div>
          <p className="mt-1 text-[13px] text-cyprus/55">dias de streak</p>
        </div>
        <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
          <div className="flex items-center gap-2 text-cyprus">
            <Zap size={18} className="text-ochre" fill="#C8893B" />
            <span className="text-2xl font-semibold">{progress?.xp ?? 0}</span>
          </div>
          <p className="mt-1 text-[13px] text-cyprus/55">XP total</p>
        </div>
        <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyprus">
              <Target size={15} /> Meta de hoje
            </span>
            <span className="text-[13px] font-medium text-cyprus/55">
              {dailyXp}/{goal} XP
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-cyprus/10">
            <div
              className="h-full rounded-full bg-ochre transition-all duration-500"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson of the day */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-cyprus p-6 text-sand sm:p-8">
        <p className="text-[12px] font-medium uppercase tracking-wide text-sand/60">
          Lição de hoje
        </p>
        {todays ? (
          <>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              {todays.title}
            </h2>
            <p className="mt-1 text-[14px] text-sand/70">
              {todays.notes.length} notas · {todays.bpm} BPM
            </p>
            <Link
              href={`/app/lessons/${todays.id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-sand px-6 py-3 text-sm font-semibold text-cyprus transition-transform hover:scale-[1.02]"
            >
              <Play size={16} strokeWidth={2.4} /> Começar
            </Link>
          </>
        ) : (
          <>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              Você completou tudo! 🎉
            </h2>
            <p className="mt-1 text-[14px] text-sand/70">
              Volte amanhã para manter o streak ou revise uma lição.
            </p>
            <Link
              href="/app/lessons"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-sand px-6 py-3 text-sm font-semibold text-cyprus"
            >
              Ver trilha
            </Link>
          </>
        )}
      </div>

      {/* Coach tip */}
      <div className="mt-6">
        <CoachCard initialTip={initialTip} />
      </div>

      {/* Adaptive review */}
      <Link
        href="/app/review"
        className="mt-6 flex items-center justify-between rounded-2xl border border-cyprus/10 bg-sand p-5 transition-colors hover:border-cyprus/30"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
            <Sparkles size={18} />
          </span>
          <div>
            <h3 className="font-semibold text-cyprus">Revisão adaptativa</h3>
            <p className="text-[13px] text-cyprus/55">
              Pratique o que mais precisa, escolhido para você.
            </p>
          </div>
        </div>
        <Play size={18} className="text-cyprus/40" />
      </Link>

      {/* Quick tools */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {QUICK.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-cyprus/10 bg-sand p-5 text-cyprus transition-colors hover:bg-cyprus/[0.03]"
            >
              <Icon size={22} />
              <span className="text-[13px] font-medium">{q.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
