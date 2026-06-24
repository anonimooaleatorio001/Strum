"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type AuthState = { error?: string } | undefined;

export async function authenticate(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/app",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha incorretos." };
    }
    // signIn throws a redirect on success — let Next handle it.
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
