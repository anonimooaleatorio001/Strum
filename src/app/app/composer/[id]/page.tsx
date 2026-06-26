import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ComposerEditor from "@/components/composer/ComposerEditor";
import { requireOnboardedUser } from "@/server/session";
import { prisma } from "@/lib/db";
import { getTuning } from "@/lib/instruments";

export default async function ComposerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireOnboardedUser();
  const comp = await prisma.composition.findFirst({
    where: { id, userId: user.id },
  });
  if (!comp) notFound();

  const tuning = getTuning(comp.instrument, user.numStrings);
  const grid = (comp.grid as (number | null)[][]) ?? [];

  return (
    <div>
      <Link
        href="/app/composer"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyprus/60 transition-colors hover:text-cyprus"
      >
        <ArrowLeft size={16} /> Minhas composições
      </Link>

      <ComposerEditor
        id={comp.id}
        title={comp.title}
        bpm={comp.bpm}
        bars={comp.bars}
        subdivision={comp.subdivision}
        grid={grid}
        stringMidi={tuning.map((s) => s.midi)}
        stringLabels={tuning.map((s) => s.label)}
      />
    </div>
  );
}
