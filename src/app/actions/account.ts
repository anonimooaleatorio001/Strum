"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOnboardedUser } from "@/server/session";
import { INSTRUMENTS } from "@/lib/instruments";

const profileSchema = z.object({
  name: z.string().trim().max(60).optional(),
  instrument: z.enum(["GUITAR", "BASS"]),
  handedness: z.enum(["LEFT", "RIGHT"]),
  numStrings: z.coerce.number().int().min(4).max(6),
});

export type AccountState = { error?: string; ok?: boolean } | undefined;

export async function updateProfile(
  _prev: AccountState,
  formData: FormData
): Promise<AccountState> {
  const user = await requireOnboardedUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name") ?? undefined,
    instrument: formData.get("instrument"),
    handedness: formData.get("handedness"),
    numStrings: formData.get("numStrings"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, instrument, handedness, numStrings } = parsed.data;
  // Keep the string count valid for the chosen instrument.
  const allowed = INSTRUMENTS[instrument].stringChoices;
  const strings = allowed.includes(numStrings)
    ? numStrings
    : INSTRUMENTS[instrument].defaultStrings;

  await prisma.user.update({
    where: { id: user.id },
    data: { name: name || null, instrument, handedness, numStrings: strings },
  });

  revalidatePath("/app");
  revalidatePath("/app/account");
  return { ok: true };
}
