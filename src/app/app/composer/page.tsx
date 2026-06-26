import Link from "next/link";
import { PenLine, Plus, Music2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requireOnboardedUser } from "@/server/session";
import { prisma } from "@/lib/db";
import { createComposition } from "@/app/actions/composer";

export default async function ComposerPage() {
  const user = await requireOnboardedUser();
  const comps = await prisma.composition.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        icon={PenLine}
        title="Compositor"
        subtitle="Monte suas próprias frases e riffs numa grade de tablatura e ouça na hora."
      />

      <form action={createComposition} className="mb-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-cyprus px-5 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#11421f]"
        >
          <Plus size={18} /> Nova composição
        </button>
      </form>

      {comps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cyprus/20 bg-sand p-10 text-center">
          <Music2 className="mx-auto mb-3 text-cyprus/30" size={32} />
          <p className="text-[14px] text-cyprus/55">
            Você ainda não criou nenhuma composição. Comece agora!
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {comps.map((c) => (
            <Link
              key={c.id}
              href={`/app/composer/${c.id}`}
              className="rounded-2xl border border-cyprus/10 bg-sand p-5 transition-colors hover:border-cyprus/30"
            >
              <h3 className="font-semibold text-cyprus">{c.title}</h3>
              <p className="mt-1 text-[13px] text-cyprus/55">
                {c.bpm} BPM · {c.bars} compassos ·{" "}
                {c.instrument === "BASS" ? "Baixo" : "Guitarra"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
