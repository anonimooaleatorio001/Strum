"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireOnboardedUser } from "@/server/session";
import { getTuning } from "@/lib/instruments";
import { parseTab } from "@/lib/tab";
import { SEED_SONGS } from "@/lib/songs";

const importSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().max(100).optional(),
  bpm: z.coerce.number().int().min(40).max(240),
  tab: z.string().min(5).max(20000),
});

export type ImportState = { ok?: boolean; error?: string } | undefined;

/** Parse pasted ASCII tab into timed notes and save it as a song. */
export async function importSong(
  _prev: ImportState,
  formData: FormData
): Promise<ImportState> {
  const user = await requireOnboardedUser();
  const parsed = importSchema.safeParse({
    title: formData.get("title"),
    artist: formData.get("artist") || undefined,
    bpm: formData.get("bpm"),
    tab: formData.get("tab"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const tuning = getTuning(user.instrument, user.numStrings);
  const song = parseTab(parsed.data.tab, tuning);
  if (!song || song.notes.length === 0) {
    return {
      error:
        "Não consegui ler a tablatura. Cole no formato com uma linha por corda (ex.: e|--0--2--|).",
    };
  }

  const created = await prisma.song.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      artist: parsed.data.artist ?? null,
      source: "tab",
      instrument: user.instrument,
      data: {
        notes: song.notes,
        bpm: parsed.data.bpm,
        bars: song.bars,
      } as unknown as Prisma.InputJsonValue,
    },
  });
  revalidatePath("/app/songs");
  redirect(`/app/songs/${created.id}`);
}

/** Add one of the built-in starter songs to the user's library. */
export async function addSeedSong(seedId: string): Promise<void> {
  const user = await requireOnboardedUser();
  const seed = SEED_SONGS.find((s) => s.id === seedId);
  if (!seed) return;

  const tuning = getTuning(seed.instrument, seed.instrument === "BASS" ? 4 : 6);
  const song = parseTab(seed.tab, tuning);
  if (!song) return;

  const created = await prisma.song.create({
    data: {
      userId: user.id,
      title: seed.title,
      artist: seed.artist,
      source: "seed",
      instrument: seed.instrument,
      data: {
        notes: song.notes,
        bpm: seed.bpm,
        bars: song.bars,
      } as unknown as Prisma.InputJsonValue,
    },
  });
  revalidatePath("/app/songs");
  redirect(`/app/songs/${created.id}`);
}

export async function deleteSong(id: string) {
  const user = await requireOnboardedUser();
  await prisma.song.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/app/songs");
  redirect("/app/songs");
}
