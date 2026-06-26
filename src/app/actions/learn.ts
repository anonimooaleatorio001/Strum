"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOnboardedUser } from "@/server/session";
import { awardXp } from "@/server/progress";

/** Toggle whether a glossary term is marked as understood. */
export async function toggleGlossaryTerm(termId: string, seen: boolean) {
  const user = await requireOnboardedUser();
  if (typeof termId !== "string" || !termId) return { ok: false };

  if (seen) {
    await prisma.glossarySeen.upsert({
      where: { userId_termId: { userId: user.id, termId } },
      create: { userId: user.id, termId },
      update: {},
    });
  } else {
    await prisma.glossarySeen
      .delete({ where: { userId_termId: { userId: user.id, termId } } })
      .catch(() => undefined);
  }
  revalidatePath("/app/glossary");
  return { ok: true };
}

const earSchema = z.object({
  correct: z.boolean(),
  streak: z.number().int().min(0).max(999),
});

/** Record one ear-training answer: award XP on a hit, track the best streak. */
export async function recordEarAnswer(input: unknown) {
  const user = await requireOnboardedUser();
  const parsed = earSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const { correct, streak } = parsed.data;
  const settings = (user.settings as Record<string, unknown> | null) ?? {};
  const earBest = typeof settings.earBest === "number" ? settings.earBest : 0;

  if (streak > earBest) {
    await prisma.user.update({
      where: { id: user.id },
      data: { settings: { ...settings, earBest: streak } },
    });
  }

  if (correct) {
    const res = await awardXp(user.id, 2, "ear-training");
    revalidatePath("/app");
    return { ok: true, xp: res.xp };
  }
  return { ok: true };
}
