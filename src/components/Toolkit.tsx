import { TOOLS, type ToolId } from "../tools/tools";
import StatBadges from "./StatBadges";
import LearnPath from "../tools/LearnPath";
import Tuner from "../tools/Tuner";
import Metronome from "../tools/Metronome";
import Chords from "../tools/Chords";

export default function Toolkit({
  active,
  setActive,
}: {
  active: ToolId;
  setActive: (t: ToolId) => void;
}) {
  const meta = TOOLS.find((t) => t.id === active)!;
  const Icon = meta.icon;

  return (
    <section id="toolkit" className="bg-sand">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-30 border-b border-cyprus/10 bg-sand/90 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {TOOLS.map((t) => {
                const TabIcon = t.icon;
                const isActive = t.id === active;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-cyprus text-sand"
                        : "text-cyprus/60 hover:bg-cyprus/5 hover:text-cyprus"
                    }`}
                  >
                    <TabIcon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <div className="hidden sm:block">
              <StatBadges />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <header className="mb-8 flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyprus text-sand">
            <Icon size={20} />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-cyprus sm:text-3xl">
              {meta.label}
            </h2>
            <p className="mt-1 max-w-xl text-[14px] text-cyprus/60">
              {meta.blurb}
            </p>
          </div>
        </header>

        {active === "learn" && <LearnPath />}
        {active === "tuner" && <Tuner />}
        {active === "metronome" && <Metronome />}
        {active === "chords" && <Chords />}
      </div>
    </section>
  );
}
