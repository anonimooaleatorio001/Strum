import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import Tuner from "@/components/tools/Tuner";

export const metadata = {
  title: "Afinador · Strum",
  description: "Afinador cromático gratuito para violão e baixo. Funciona no navegador.",
};

// Public, no-login chromatic tuner (guitar default).
export default function PublicTunerPage() {
  return (
    <main className="min-h-screen bg-sand">
      <header className="mx-auto max-w-[1100px] px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyprus/60 transition-colors hover:text-cyprus"
          >
            <ArrowLeft size={16} /> Início
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-[1100px] px-5 py-6 sm:px-8">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-cyprus sm:text-3xl">
          Afinador
        </h1>
        <p className="mb-8 max-w-xl text-[14px] text-cyprus/60">
          Afinação padrão de violão (E A D G B E). Crie uma conta para afinar
          baixo e salvar seu progresso.
        </p>
        <Tuner instrument="GUITAR" numStrings={6} />
      </section>
    </main>
  );
}
