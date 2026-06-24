import { Settings } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SettingsForm, { type SettingsValues } from "@/components/SettingsForm";
import { requireOnboardedUser } from "@/server/session";

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

  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Configurações"
        subtitle="Ajuste sua meta diária e como as lições funcionam."
      />
      <SettingsForm initial={initial} />
    </div>
  );
}
