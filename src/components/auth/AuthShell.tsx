import Link from "next/link";
import Logo from "@/components/Logo";
import WaveField from "@/components/WaveField";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-5 py-10">
      <WaveField
        className="pointer-events-none absolute inset-x-0 top-0 h-full w-full select-none"
        opacity={0.45}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/70 to-cream" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <Link href="/" className="animate-fade-down mb-8">
          <Logo size={42} />
        </Link>
        <div className="animate-fade-up glass w-full max-w-sm rounded-3xl p-7 sm:p-8">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-forest">
            {title}
          </h1>
          <p className="mt-1 text-sm text-forest/60">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-6 text-sm text-forest/70">{footer}</div>
      </div>
    </main>
  );
}

export const inputClass =
  "w-full rounded-xl border border-forest/15 bg-cream/80 px-4 py-3 text-[15px] text-forest outline-none transition-colors placeholder:text-forest/35 focus:border-forest";

export const submitClass =
  "w-full rounded-full bg-forest py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:bg-forest/30";
