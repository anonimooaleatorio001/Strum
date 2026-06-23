import { TOOLS, type ToolId } from "../tools/tools";

export default function Footer({
  onNavigate,
}: {
  onNavigate: (tool: ToolId) => void;
}) {
  return (
    <footer className="bg-cyprus text-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
                <rect width="32" height="32" rx="9" fill="#F0EDE4" />
                <path
                  d="M16 6c4.4 0 8 2.7 8 7 0 3.4-2.2 8.1-5 11-1 1-2 1.6-3 1.6s-2-.6-3-1.6c-2.8-2.9-5-7.6-5-11 0-4.3 3.6-7 8-7Z"
                  fill="#004741"
                />
                <circle cx="16" cy="13" r="2.2" fill="#F0EDE4" />
              </svg>
              <span className="text-lg font-semibold">Strum</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-sand/65">
              Everything a beginning guitarist needs to practise well — a course,
              a tuner, a metronome and a chord library — in one calm place.
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-sand/50">
              Toolkit
            </h4>
            <ul className="mt-4 space-y-2.5">
              {TOOLS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onNavigate(t.id)}
                    className="text-[14px] text-sand/80 transition-colors hover:text-sand"
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-sand/50">
              Practice tips
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-sand/70">
              <li>Tune up before every session.</li>
              <li>Start slow with the metronome.</li>
              <li>A little every day beats a lot once a week.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-sand/15 pt-6 text-[13px] text-sand/55 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Strum. Practice well.</span>
          <span>Built with the Web Audio API — your audio never leaves the device.</span>
        </div>
      </div>
    </footer>
  );
}
