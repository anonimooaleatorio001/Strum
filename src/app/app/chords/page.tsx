import { Music } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Chords from "@/components/tools/Chords";
import { getCurrentUser } from "@/server/session";

export default async function ChordsPage() {
  const user = await getCurrentUser();
  const lefty = user?.handedness === "LEFT";

  return (
    <div>
      <PageHeader
        icon={Music}
        title="Acordes"
        subtitle="Uma biblioteca interativa de acordes — toque em qualquer um para ouvir."
      />
      <Chords lefty={lefty} />
    </div>
  );
}
