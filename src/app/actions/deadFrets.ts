"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireOnboardedUser } from "@/server/session";

const schema = z.record(
  z.string(),
  z.array(z.number().int().min(0).max(24))
);

/** Persist the user's dead/buzzing frets (string index -> frets). */
export async function updateDeadFrets(dead: unknown) {
  const user = await requireOnboardedUser();
  const parsed = schema.safeParse(dead);
  if (!parsed.success) return { ok: false };

  await prisma.user.update({
    where: { id: user.id },
    data: { deadFrets: parsed.data as unknown as Prisma.InputJsonValue },
  });
  revalidatePath("/app/settings");
  revalidatePath("/app/lessons");
  return { ok: true };
}
