import Link from "next/link";
import { Library, Music2, Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SongImportForm from "@/components/songs/SongImportForm";
import { requireOnboardedUser } from "@/server/session";
import { prisma } from "@/lib/db";
import { SEED_SONGS } from "@/lib/songs";
import { addSeedSong } from "@/app/actions/songs";

export default async function SongsPage() {
  const user = await requireOnboardedUser();
  const songs = await prisma.song.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const seeds = SEED_SONGS.filter((s) => s.instrument === user.instrument);

  return (
    <div>
      <PageHeader
        icon={Library}
        title="Músicas"
        subtitle="Importe tablaturas para tocar junto, com controle de velocidade e loop. Comece pelas músicas prontas."
      />

      {songs.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyprus/50">
            Suas músicas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {songs.map((s) => (
              <Link
                key={s.id}
                href={`/app/songs/${s.id}`}
                className="rounded-2xl border border-cyprus/10 bg-sand p-5 transition-colors hover:border-cyprus/30"
              >
                <h3 className="font-semibold text-cyprus">{s.title}</h3>
                <p className="mt-1 text-[13px] text-cyprus/55">
                  {s.artist ?? "—"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyprus/50">
          Músicas prontas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {seeds.map((s) => (
            <form
              key={s.id}
              action={addSeedSong.bind(null, s.id)}
              className="flex items-center justify-between rounded-2xl border border-cyprus/10 bg-sand p-5"
            >
              <div>
                <h3 className="font-semibold text-cyprus">{s.title}</h3>
                <p className="mt-1 text-[13px] text-cyprus/55">
                  {s.artist} · {s.bpm} BPM
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-cyprus px-4 py-2 text-[13px] font-semibold text-sand transition-colors hover:bg-[#013a35]"
              >
                <Plus size={15} /> Adicionar
              </button>
            </form>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyprus/50">
          <Music2 size={15} /> Importar tablatura
        </h2>
        <SongImportForm />
      </div>
    </div>
  );
}
