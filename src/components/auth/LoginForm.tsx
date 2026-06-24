"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/actions/auth";
import { inputClass, submitClass } from "./AuthShell";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={submitClass}>
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="seu@email.com"
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Sua senha"
        className={inputClass}
      />
      {state?.error && (
        <p className="text-[13px] font-medium text-red-700">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}
