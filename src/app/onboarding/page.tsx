import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import OnboardingForm from "@/components/OnboardingForm";
import { getCurrentUser } from "@/server/session";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.onboarded) redirect("/app");

  return (
    <main className="flex min-h-screen flex-col items-center bg-sand px-5 py-10">
      <Logo size={40} />
      <div className="mt-8 w-full max-w-md rounded-3xl border border-cyprus/10 bg-sand p-7 shadow-[0_2px_30px_rgba(0,71,65,0.06)] sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-cyprus">
          Vamos preparar tudo{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-sm text-cyprus/60">
          Três perguntas rápidas pra montar sua trilha.
        </p>
        <div className="mt-7">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
