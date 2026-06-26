import { Ear } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EarTrainer from "@/components/learn/EarTrainer";
import { requireOnboardedUser } from "@/server/session";

export default async function EarPage() {
  const user = await requireOnboardedUser();
  const settings = (user.settings as { earBest?: number } | null) ?? {};

  return (
    <div>
      <PageHeader
        icon={Ear}
        title="Treino auditivo"
        subtitle="Treine seu ouvido a reconhecer intervalos e notas. Essencial para tirar músicas de ouvido."
      />
      <EarTrainer best={settings.earBest ?? 0} />
    </div>
  );
}
