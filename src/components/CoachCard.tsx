"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

/** Dashboard coaching tip. Pulls from /api/coach (Claude if configured). */
export default function CoachCard({ initialTip }: { initialTip: string }) {
  const [tip, setTip] = useState(initialTip);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/coach", { cache: "no-store" });
      const data = (await res.json()) as { tip?: string };
      if (data.tip) setTip(data.tip);
    } catch {
      /* keep the current tip */
    } finally {
      setLoading(false);
    }
  }

  // fetch a fresh (possibly AI) tip once on mount
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ochre/25 bg-ochre/[0.07] p-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ochre text-sand">
        <Sparkles size={18} />
      </span>
      <div className="flex-1">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-ochre">
          Dica do Strum
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-cyprus/80">{tip}</p>
      </div>
      <button
        onClick={refresh}
        disabled={loading}
        aria-label="Nova dica"
        className="shrink-0 text-cyprus/40 transition-colors hover:text-cyprus disabled:opacity-50"
      >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
