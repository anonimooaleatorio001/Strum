import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre para continuar sua trilha."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-semibold text-cyprus underline">
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
