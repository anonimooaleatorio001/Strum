import Link from "next/link";
import Logo from "@/components/Logo";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand px-5 py-10">
      <Link href="/" className="mb-8">
        <Logo size={40} />
      </Link>
      <div className="w-full max-w-sm rounded-3xl border border-cyprus/10 bg-sand p-7 shadow-[0_2px_30px_rgba(0,71,65,0.06)] sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-cyprus">
          {title}
        </h1>
        <p className="mt-1 text-sm text-cyprus/60">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      <div className="mt-6 text-sm text-cyprus/70">{footer}</div>
    </main>
  );
}

export const inputClass =
  "w-full rounded-xl border border-cyprus/15 bg-sand px-4 py-3 text-[15px] text-cyprus outline-none transition-colors placeholder:text-cyprus/35 focus:border-cyprus";

export const submitClass =
  "w-full rounded-full bg-cyprus py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35] disabled:cursor-not-allowed disabled:bg-cyprus/30";
