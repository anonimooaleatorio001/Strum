import { Music } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Chords from "@/components/tools/Chords";

export default function ChordsPage() {
  return (
    <div>
      <PageHeader
        icon={Music}
        title="Acordes"
        subtitle="Uma biblioteca interativa de acordes — toque em qualquer um para ouvir."
      />
      <Chords />
    </div>
  );
}
