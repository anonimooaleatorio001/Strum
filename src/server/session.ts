import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** The full DB user for the current session, or null. Cached per request. */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    include: { progress: true },
  });
});

/**
 * Require a logged-in, onboarded user. Redirects to /login or /onboarding as
 * needed. Used by every page under /app.
 */
export async function requireOnboardedUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboarded) redirect("/onboarding");
  return user;
}

/** Require a logged-in user (onboarded or not). Used by /onboarding. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
