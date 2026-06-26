import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import SongPlayer from "@/components/songs/SongPlayer";
import { requireOnboardedUser } from "@/server/session";
import { prisma } from "@/lib/db";
import { getTuning } from "@/lib/instruments";
import { deleteSong } from "@/app/actions/songs";
import type { SongNote } from "@/lib/tab";

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireOnboardedUser();
  const song = await prisma.song.findFirst({
    where: { id, userId: user.id },
  });
  if (!song) notFound();

  const data = song.data as unknown as { notes: SongNote[]; bpm: number };
  const tuning = getTuning(song.instrument, user.numStrings);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/app/songs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyprus/60 transition-colors hover:text-cyprus"
      >
        <ArrowLeft size={16} /> Voltar às músicas
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-cyprus">
        {song.title}
      </h1>
      <p className="mb-6 mt-1 text-[14px] text-cyprus/60">
        {song.artist ?? "—"} · {data.bpm} BPM · {data.notes.length} notas
      </p>

      <SongPlayer
        notes={data.notes}
        bpm={data.bpm}
        stringLabels={tuning.map((s) => s.label)}
      />

      <form action={deleteSong.bind(null, song.id)} className="mt-5">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-cyprus/50 hover:text-ochre"
        >
          <Trash2 size={14} /> Excluir música
        </button>
      </form>
    </div>
  );
}
