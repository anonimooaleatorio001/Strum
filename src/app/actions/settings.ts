"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOnboardedUser } from "@/server/session";

const schema = z.object({
  dailyGoalXp: z.coerce.number().int().min(10).max(500),
  reminders: z.coerce.boolean(),
  metronome: z.coerce.boolean(),
  waitMode: z.coerce.boolean(),
  camera: z.coerce.boolean(),
});

export type SettingsState = { ok?: boolean; error?: string } | undefined;

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const user = await requireOnboardedUser();

  const parsed = schema.safeParse({
    dailyGoalXp: formData.get("dailyGoalXp"),
    reminders: formData.get("reminders") === "on",
    metronome: formData.get("metronome") === "on",
    waitMode: formData.get("waitMode") === "on",
    camera: formData.get("camera") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { dailyGoalXp, reminders, metronome, waitMode, camera } = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      dailyGoalXp,
      settings: { reminders, metronome, waitMode, camera },
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/settings");
  return { ok: true };
}
