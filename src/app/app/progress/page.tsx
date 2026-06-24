import { BarChart3, Flame, Zap, Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requireOnboardedUser } from "@/server/session";
import { getPathState } from "@/server/path";
import { prisma } from "@/lib/db";

export default async function ProgressPage() {
  const user = await requireOnboardedUser();
  const path = await getPathState(user);

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const stats = [
    { icon: Flame, label: "Streak", value: `${user.progress?.streak ?? 0} dias` },
    { icon: Zap, label: "XP total", value: `${user.progress?.xp ?? 0}` },
    {
      icon: Trophy,
      label: "Lições",
      value: `${path.doneCount}/${path.totalExercises}`,
    },
  ];

  return (
    <div>
      <PageHeader
        icon={BarChart3}
        title="Progresso"
        subtitle="Acompanhe seu XP, streak e as últimas tentativas."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-cyprus/10 bg-sand p-5"
            >
              <div className="flex items-center gap-2 text-cyprus">
                <Icon size={18} className="text-ochre" />
                <span className="text-2xl font-semibold">{s.value}</span>
              </div>
              <p className="mt-1 text-[13px] text-cyprus/55">{s.label}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-cyprus">
        Tentativas recentes
      </h2>
      {attempts.length === 0 ? (
        <p className="rounded-2xl border border-cyprus/10 bg-sand p-5 text-sm text-cyprus/55">
          Você ainda não praticou nenhuma lição. Comece pela trilha!
        </p>
      ) : (
        <ul className="divide-y divide-cyprus/10 overflow-hidden rounded-2xl border border-cyprus/10 bg-sand">
          {attempts.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between px-5 py-3.5 text-sm"
            >
              <span className="font-medium text-cyprus">{a.exerciseId}</span>
              <span className="flex items-center gap-3 text-cyprus/55">
                <span>coroa {a.crown}</span>
                <span>
                  {new Date(a.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
