import Link from "next/link";
import {
  Sparkles,
  Music,
  GraduationCap,
  ArrowUpRight,
  Flame,
  Zap,
  Crown,
  Mic,
  Camera,
  Ear,
} from "lucide-react";
import Logo from "@/components/Logo";
import WaveField from "@/components/WaveField";
import TextRollButton from "@/components/TextRollButton";
import { getCurrentUser } from "@/server/session";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Trilha de lições",
    body: "Aprenda no estilo Duolingo — XP, ofensiva e coroas a cada nota.",
    accent: "bg-sunshine text-forest-deep",
  },
  {
    icon: Mic,
    title: "Te escuta tocar",
    body: "O microfone avalia sua afinação e o tempo, e te dá a nota.",
    accent: "bg-carrot text-cream",
  },
  {
    icon: Camera,
    title: "Vê suas mãos",
    body: "A câmera mostra a forma do acorde sobreposta. Tudo no aparelho.",
    accent: "bg-kiwi text-forest-deep",
  },
  {
    icon: Ear,
    title: "Treino de ouvido",
    body: "Reconheça intervalos e notas para tirar música de ouvido.",
    accent: "bg-tomato text-cream",
  },
];

const MARQUEE = [
  "Afinador",
  "Metrônomo",
  "Acordes",
  "Compositor",
  "Músicas",
  "Conquistas",
  "Glossário",
  "Revisão adaptativa",
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/app" : "/register";

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream">
      {/* Flowing topographic background */}
      <WaveField
        className="pointer-events-none absolute inset-x-0 top-0 h-[115%] w-full select-none"
        opacity={0.55}
      />
      {/* Readability wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/20 via-cream/75 to-cream" />
      {/* Desktop grid lines */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {[25, 50, 75].map((p) => (
          <span
            key={p}
            className="absolute top-0 h-full w-px bg-forest/10"
            style={{ left: `${p}%` }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="animate-fade-down mx-auto max-w-[1200px] p-3 sm:p-4">
          <nav className="glass flex items-center justify-between rounded-full p-[6px] pl-5">
            <Logo />
            <div className="hidden items-center gap-8 md:flex">
              <Link href="/tuner" className="text-[13px] font-medium text-forest/70 transition-colors hover:text-forest">
                Afinador
              </Link>
              <Link href="/login" className="text-[13px] font-medium text-forest/70 transition-colors hover:text-forest">
                Entrar
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-forest transition-colors hover:text-forest/60 md:hidden"
              >
                Entrar
              </Link>
              <TextRollButton label={user ? "Meu painel" : "Começar"} href={ctaHref} variant="cyprus" />
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pt-10 text-center sm:px-8 sm:pt-16">
          {/* glass eyebrow badge */}
          <div className="animate-fade-up glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-forest">
            <Sparkles size={14} className="text-carrot" />
            Violão & baixo · do jeito divertido
          </div>

          <h1 className="font-display max-w-[16ch] text-[clamp(2.4rem,8vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-forest">
            <span className="animate-fade-up block">Aprenda a tocar,</span>
            <span className="animate-fade-up block [animation-delay:120ms]">
              uma <span className="font-serif italic font-normal text-carrot">nota</span> de cada vez
              <span className="text-sunshine">.</span>
            </span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-[54ch] text-[15px] leading-[1.65] text-forest/70 [animation-delay:240ms] sm:text-[18px]">
            Trilha de lições que te <span className="text-forest font-semibold">escuta tocar</span>,
            afinador, metrônomo, músicas e muito mais — num lugar vivo, colorido
            e feito para você não largar o instrumento.
          </p>

          {/* CTA pill (Questly-style) */}
          <div className="animate-fade-up mt-7 w-full max-w-md [animation-delay:340ms]">
            <Link
              href={ctaHref}
              className="glass group flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-left"
            >
              <span className="flex-1 text-sm text-forest/60 sm:text-base">
                {user ? "Continue de onde parou…" : "Toque sua primeira nota hoje…"}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition-transform group-hover:scale-105 active:scale-95">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>

          <div className="animate-fade-up mt-5 flex flex-wrap items-center justify-center gap-3 [animation-delay:460ms]">
            <Link
              href={ctaHref}
              className="rounded-full bg-forest px-7 py-3 text-sm font-semibold text-cream transition-all hover:bg-forest-deep hover:shadow-lg"
            >
              {user ? "Ir para o painel" : "Criar conta grátis"}
            </Link>
            <Link
              href="/tuner"
              className="rounded-full bg-sunshine px-7 py-3 text-sm font-semibold text-forest-deep ring-1 ring-forest/10 transition-colors hover:bg-[#ffd54a]"
            >
              Afinar agora
            </Link>
          </div>

          {/* App preview mockup */}
          <AppPreview />
        </section>

        {/* Feature grid */}
        <section className="mx-auto max-w-[1200px] px-5 pb-4 pt-20 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-3xl border border-forest/10 bg-cream p-6 transition-transform hover:-translate-y-1"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${f.accent}`}>
                    <Icon size={20} />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold text-forest">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-forest/60">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Marquee strip */}
        <section className="overflow-hidden py-10">
          <div className="flex w-max animate-marquee gap-3 whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span
                key={i}
                className="font-display rounded-full bg-forest px-6 py-2.5 text-lg font-bold text-cream"
              >
                {m}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-forest-deep text-cream">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-5 py-12 sm:flex-row sm:items-center sm:px-8">
            <Logo tone="cream" />
            <div className="flex flex-col gap-1 text-[13px] text-cream/55 sm:items-end">
              <span>© {new Date().getFullYear()} Strum · Pratique bem.</span>
              <span>Seu áudio nunca sai do dispositivo.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

/** Stylised dark "browser chrome" preview of the Strum app (CodeNest vibe). */
function AppPreview() {
  return (
    <div className="animate-hero-rise relative z-0 mx-auto mt-16 w-full max-w-3xl [animation-delay:620ms]">
      <div className="overflow-hidden rounded-t-3xl bg-forest-deep text-left shadow-[0_-20px_80px_rgba(12,48,20,0.35)] ring-1 ring-cream/10">
        {/* title bar */}
        <div className="flex items-center gap-3 border-b border-cream/5 bg-[#0a280f] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-tomato" />
          <span className="h-2.5 w-2.5 rounded-full bg-sunshine" />
          <span className="h-2.5 w-2.5 rounded-full bg-kiwi" />
          <span className="mx-auto rounded-md bg-forest-deep px-6 py-1 text-[10px] text-cream/50">
            strum.app
          </span>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="hidden w-[26%] shrink-0 flex-col gap-3 border-r border-cream/5 bg-[#0e3315] p-4 sm:flex">
            <Logo size={22} wordmark={false} tone="cream" />
            {[Flame, Zap, Crown, Music].map((Icon, i) => (
              <span key={i} className="flex items-center gap-2 text-[11px] text-cream/55">
                <Icon size={13} /> {["Ofensiva", "XP", "Coroas", "Tocar"][i]}
              </span>
            ))}
          </aside>

          {/* main */}
          <div className="flex-1 p-4 sm:p-5">
            {/* stat tiles */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: "OFENSIVA", v: "7", c: "text-carrot" },
                { l: "XP", v: "1.240", c: "text-sunshine" },
                { l: "COROAS", v: "18", c: "text-kiwi" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-cream/[0.04] p-3 ring-1 ring-cream/5">
                  <div className={`font-display text-xl font-bold ${s.c}`}>{s.v}</div>
                  <div className="mt-0.5 text-[8px] tracking-wider text-cream/40">{s.l}</div>
                </div>
              ))}
            </div>

            {/* lesson-of-the-day card */}
            <div className="mt-3 rounded-xl bg-gradient-to-br from-forest to-[#0e3315] p-4 ring-1 ring-cream/10">
              <p className="text-[9px] uppercase tracking-wider text-cream/45">
                Lição de hoje
              </p>
              <p className="font-display mt-1 text-base font-bold text-cream">
                Escala de Sol · 2
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <span
                    key={i}
                    className="h-7 flex-1 rounded-md"
                    style={{
                      background: i % 3 === 0 ? "#ffc926" : "rgba(243,232,204,0.12)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* mini note-highway */}
            <div className="mt-3 flex items-end gap-1.5 rounded-xl bg-cream/[0.04] p-3 ring-1 ring-cream/5">
              {[40, 70, 30, 88, 55, 64, 42, 76, 50, 90, 35, 60].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h * 0.5 + 12}px`,
                    background: i === 9 ? "#f96015" : "#18542a",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
