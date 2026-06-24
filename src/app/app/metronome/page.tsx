import { Timer } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Metronome from "@/components/tools/Metronome";

export default function MetronomePage() {
  return (
    <div>
      <PageHeader
        icon={Timer}
        title="Metrônomo"
        subtitle="Tempo firme com tap tempo, acentos e fórmulas de compasso."
      />
      <Metronome />
    </div>
  );
}
