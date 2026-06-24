import Link from "next/link";
import { Sparkles, Guitar, Gauge, Music, GraduationCap } from "lucide-react";
import Logo from "@/components/Logo";
import TextRollButton from "@/components/TextRollButton";
import { getCurrentUser } from "@/server/session";

const FEATURES = [
  { icon: GraduationCap, title: "Trilha de lições", body: "Aprenda no estilo Duolingo: XP, streak e coroas." },
  { icon: Gauge, title: "Afinador", body: "Afinador cromático que escuta pelo microfone." },
  { icon: Music, title: "Metrônomo & acordes", body: "Tempo firme e uma biblioteca de acordes pra ouvir." },
  { icon: Guitar, title: "Violão e baixo", body: "Escolha seu instrumento e siga sua trilha." },
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/app" : "/register";

  return (
    <main className="min-h-screen bg-sand">
      {/* Navbar */}
      <header className="mx-auto max-w-[1200px] p-3 sm:p-4">
        <nav className="flex items-center justify-between rounded-full bg-sand/95 p-[5px] pl-4 shadow-[0_2px_20px_rgba(0,71,65,0.08)] backdrop-blur">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/tuner"
              className="hidden rounded-full px-4 py-2 text-sm text-cyprus transition-colors hover:text-cyprus/60 sm:inline"
            >
              Afinador
            </Link>
            {user ? (
              <TextRollButton label="Meu painel" href="/app" variant="cyprus" />
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-cyprus transition-colors hover:text-cyprus/60"
                >
                  Entrar
                </Link>
                <TextRollButton label="Começar" href="/register" variant="cyprus" />
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex items-center gap-2 text-[13px] font-medium tracking-wide text-cyprus">
          <Sparkles size={15} />
          Strum · Aprenda do jeito divertido
        </div>
        <h1 className="max-w-[15ch] text-[clamp(2rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-cyprus">
          Aprenda violão e baixo, uma nota de cada vez.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-cyprus/70 sm:text-[17px]">
          Trilha de lições, afinador, metrônomo e biblioteca de acordes — tudo
          em um lugar calmo e focado. Sem complicação.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5">
          <TextRollButton label={user ? "Continuar" : "Criar conta grátis"} href={ctaHref} variant="cyprus" />
          <TextRollButton label="Afinar agora" href="/tuner" variant="sand" />
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-cyprus/10 bg-sand p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyprus text-sand">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-cyprus">
                  {f.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-cyprus/60">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="bg-cyprus text-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
          <span className="text-[13px] text-sand/60">
            © {new Date().getFullYear()} Strum. Pratique bem.
          </span>
          <span className="text-[13px] text-sand/60">
            Seu áudio nunca sai do dispositivo.
          </span>
        </div>
      </footer>
    </main>
  );
}
