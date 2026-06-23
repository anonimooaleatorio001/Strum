import { useEffect, useState } from "react";
import { Clock, Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import StatBadges from "./StatBadges";
import { TOOLS, type ToolId } from "../tools/tools";

const EASE = "ease-[cubic-bezier(0.25,0.1,0.25,1)]";

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  useEffect(() => {
    const id = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
      1000
    );
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Navbar({
  onNavigate,
}: {
  onNavigate: (tool: ToolId) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useClock();

  const go = (tool: ToolId) => {
    setMenuOpen(false);
    onNavigate(tool);
  };

  return (
    <div className="relative z-20 mx-auto max-w-[1440px] p-2 sm:p-3">
      <nav className="flex items-center justify-between rounded-full bg-sand/95 p-[5px] pl-3 shadow-[0_2px_20px_rgba(0,71,65,0.08)] backdrop-blur">
        {/* Left: logo + links */}
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden items-center gap-6 md:flex">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className="text-[14px] text-cyprus transition-colors duration-300 hover:text-cyprus/55"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="hidden items-center gap-1.5 text-[13px] text-cyprus/60 lg:inline-flex">
            <Clock size={14} />
            {time}
          </span>
          <button
            onClick={() => go("learn")}
            className={`group flex items-center gap-3 rounded-full bg-cyprus py-2 pl-5 pr-2 text-[13px] font-medium text-sand transition-colors duration-500 ${EASE} hover:bg-[#013a35]`}
          >
            <span className="flex h-[20px] flex-col overflow-hidden">
              <span
                className={`flex flex-col transition-transform duration-500 ${EASE} group-hover:-translate-y-1/2`}
              >
                <span className="leading-[20px]">Start learning</span>
                <span className="leading-[20px]" aria-hidden="true">
                  Start learning
                </span>
              </span>
            </span>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-sand text-cyprus transition-transform duration-500 ${EASE} group-hover:-rotate-45`}
            >
              <ArrowRight size={14} strokeWidth={2.2} />
            </span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cyprus text-sand md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-cyprus/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-3 bottom-3 animate-pop rounded-2xl bg-sand p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <StatBadges />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cyprus/10 text-cyprus"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className="border-b border-cyprus/10 py-3 text-left text-[28px] font-medium leading-[32px] text-cyprus last:border-0"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => go("learn")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cyprus py-3.5 text-sm font-medium text-sand"
            >
              Start learning
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
