import { Trophy } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requireOnboardedUser } from "@/server/session";
import { syncAchievements } from "@/server/achievements";
import { BADGES } from "@/lib/achievements";

export default async function AchievementsPage() {
  const user = await requireOnboardedUser();
  const { badges } = await syncAchievements(user);
  const byId = new Map(badges.map((b) => [b.id, b]));
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div>
      <PageHeader
        icon={Trophy}
        title="Conquistas"
        subtitle={`Você desbloqueou ${unlockedCount} de ${BADGES.length} medalhas. Continue praticando para coletar todas.`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => {
          const view = byId.get(b.id)!;
          const Icon = (Icons[b.icon as keyof typeof Icons] ??
            Trophy) as LucideIcon;
          return (
            <div
              key={b.id}
              className={`flex flex-col items-center rounded-2xl border p-5 text-center transition-colors ${
                view.unlocked
                  ? "border-ochre/30 bg-ochre/[0.07]"
                  : "border-cyprus/10 bg-sand"
              }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  view.unlocked
                    ? "bg-ochre text-sand"
                    : "bg-cyprus/8 text-cyprus/30"
                }`}
              >
                <Icon size={26} />
              </span>
              <h3
                className={`mt-3 text-sm font-semibold ${
                  view.unlocked ? "text-cyprus" : "text-cyprus/50"
                }`}
              >
                {b.name}
              </h3>
              <p className="mt-1 text-[12px] leading-snug text-cyprus/55">
                {b.description}
              </p>
              {!view.unlocked && view.progress > 0 && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cyprus/10">
                  <div
                    className="h-full rounded-full bg-cyprus/40"
                    style={{ width: `${Math.round(view.progress * 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
