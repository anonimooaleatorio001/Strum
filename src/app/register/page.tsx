import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Criar sua conta"
      subtitle="Comece sua trilha em menos de um minuto."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-cyprus underline">
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
