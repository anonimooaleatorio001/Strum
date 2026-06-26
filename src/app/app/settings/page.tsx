import { Settings } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SettingsForm, { type SettingsValues } from "@/components/SettingsForm";
import DeadFretsEditor from "@/components/DeadFretsEditor";
import { requireOnboardedUser } from "@/server/session";
import { getTuning, type DeadFrets } from "@/lib/instruments";

export default async function SettingsPage() {
  const user = await requireOnboardedUser();
  const s = (user.settings ?? {}) as Partial<SettingsValues>;

  const initial: SettingsValues = {
    dailyGoalXp: user.dailyGoalXp,
    reminders: s.reminders ?? true,
    metronome: s.metronome ?? true,
    waitMode: s.waitMode ?? true,
    camera: s.camera ?? false,
  };

  const tuning = getTuning(user.instrument, user.numStrings);
  const deadFrets = (user.deadFrets as DeadFrets | null) ?? {};

  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Configurações"
        subtitle="Ajuste sua meta diária e como as lições funcionam."
      />
      <div className="space-y-6">
        <SettingsForm initial={initial} />
        <DeadFretsEditor
          stringLabels={tuning.map((t) => t.label)}
          initial={deadFrets}
        />
      </div>
    </div>
  );
}
