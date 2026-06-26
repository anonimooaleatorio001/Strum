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
    <div className="flex items-center gap-2.5 rounded-full border border-forest/10 bg-cream px-4 py-2.5">
      <Sparkles size={15} className="shrink-0 text-carrot" />
      <p className="flex-1 truncate text-[13px] text-forest/75" title={tip}>
        {tip}
      </p>
      <button
        onClick={refresh}
        disabled={loading}
        aria-label="Nova dica"
        className="shrink-0 text-forest/35 transition-colors hover:text-forest disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
