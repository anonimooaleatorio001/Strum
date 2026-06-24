"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { onboardingSchema } from "@/lib/validation";
import { requireUser } from "@/server/session";

export type OnboardingState = { error?: string } | undefined;

export async function saveOnboarding(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const user = await requireUser();

  const parsed = onboardingSchema.safeParse({
    instrument: formData.get("instrument"),
    handedness: formData.get("handedness"),
    numStrings: formData.get("numStrings"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { instrument, handedness, numStrings } = parsed.data;
  // Guitar is always 6 strings; clamp to keep things consistent.
  const strings = instrument === "GUITAR" ? 6 : numStrings;

  await prisma.user.update({
    where: { id: user.id },
    data: { instrument, handedness, numStrings: strings, onboarded: true },
  });

  redirect("/app");
}
