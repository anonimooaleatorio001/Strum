"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { inputClass, submitClass } from "./AuthShell";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Não foi possível criar a conta.");
      return;
    }

    // Auto-login, then go to onboarding.
    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Conta criada, mas o login falhou. Tente entrar.");
      return;
    }
    startTransition(() => {
      router.push("/onboarding");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input name="name" type="text" autoComplete="name" placeholder="Seu nome" className={inputClass} />
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
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="Senha (mín. 8 caracteres)"
        className={inputClass}
      />
      {error && <p className="text-[13px] font-medium text-red-700">{error}</p>}
      <button type="submit" disabled={pending} className={submitClass}>
        {pending ? "Criando…" : "Criar conta"}
      </button>
    </form>
  );
}
