"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOnboardedUser } from "@/server/session";
import { getTuning } from "@/lib/instruments";

/** Create a blank composition sized to the user's instrument, then edit it. */
export async function createComposition() {
  const user = await requireOnboardedUser();
  const strings = getTuning(user.instrument, user.numStrings);
  const bars = 2;
  const subdivision = 4;
  const steps = bars * subdivision;
  const grid = strings.map(() => Array.from({ length: steps }, () => null));

  const comp = await prisma.composition.create({
    data: {
      userId: user.id,
      title: "Nova composição",
      instrument: user.instrument,
      bpm: 90,
      bars,
      subdivision,
      grid,
    },
  });
  redirect(`/app/composer/${comp.id}`);
}

const saveSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(80),
  bpm: z.number().int().min(40).max(240),
  bars: z.number().int().min(1).max(8),
  subdivision: z.number().int().min(1).max(8),
  grid: z.array(z.array(z.number().int().min(0).max(24).nullable())),
});

export type SaveCompState = { ok?: boolean; error?: string } | undefined;

export async function saveComposition(input: unknown): Promise<SaveCompState> {
  const user = await requireOnboardedUser();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados inválidos." };

  const { id, title, bpm, bars, subdivision, grid } = parsed.data;
  const owned = await prisma.composition.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!owned) return { error: "Composição não encontrada." };

  await prisma.composition.update({
    where: { id },
    data: { title, bpm, bars, subdivision, grid },
  });
  revalidatePath("/app/composer");
  revalidatePath(`/app/composer/${id}`);
  return { ok: true };
}

export async function deleteComposition(id: string) {
  const user = await requireOnboardedUser();
  await prisma.composition.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/app/composer");
  redirect("/app/composer");
}
