import { Gauge } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Tuner from "@/components/tools/Tuner";
import { requireOnboardedUser } from "@/server/session";

export default async function TunerPage() {
  const user = await requireOnboardedUser();
  return (
    <div>
      <PageHeader
        icon={Gauge}
        title="Afinador"
        subtitle="Afinador cromático que escuta pelo microfone, já configurado para o seu instrumento."
      />
      <Tuner instrument={user.instrument} numStrings={user.numStrings} />
    </div>
  );
}
