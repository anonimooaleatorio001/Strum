import { lazy, Suspense } from "react";
import { Sparkles } from "lucide-react";
import Navbar from "./Navbar";
import ShaderBoundary from "./ShaderBoundary";
import TextRollButton from "./TextRollButton";
import type { ToolId } from "../tools/tools";

// Defer the (three.js-heavy) shader so the hero paints immediately.
const ShaderBackground = lazy(() => import("./ShaderBackground"));

export default function Hero({
  onNavigate,
}: {
  onNavigate: (tool: ToolId) => void;
}) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-sand">
      {/* Animated shader backdrop */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <ShaderBoundary>
          <Suspense fallback={null}>
            <ShaderBackground />
          </Suspense>
        </ShaderBoundary>
      </div>
      {/* Legibility scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-sand via-sand/70 to-transparent" />

      <Navbar onNavigate={onNavigate} />

      <div className="flex-1" />

      <div className="relative z-20 mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mb-5 inline-flex items-center gap-2 text-[13px] font-medium tracking-wide text-cyprus sm:mb-8">
          <Sparkles size={15} />
          Strum · Learn guitar the fun way
        </div>

        <h1 className="max-w-[15ch] text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-cyprus sm:text-[clamp(2.5rem,5vw,4.2rem)]">
          Learn guitar,
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          one strum at a time.
        </h1>

        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-cyprus/70 sm:text-[17px]">
          Your tuner, metronome, chord library and a playful, level-up course —
          all in one calm, focused place. No sign-up, nothing to install.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:gap-5">
          <TextRollButton
            label="Start learning"
            variant="cyprus"
            onClick={() => onNavigate("learn")}
          />
          <TextRollButton
            label="Tune your guitar"
            variant="sand"
            onClick={() => onNavigate("tuner")}
          />
        </div>
      </div>
    </section>
  );
}
