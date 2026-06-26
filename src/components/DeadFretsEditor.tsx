"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { DeadFrets } from "@/lib/instruments";
import { updateDeadFrets } from "@/app/actions/deadFrets";

const FRETS = 12;

export default function DeadFretsEditor({
  stringLabels,
  initial,
}: {
  stringLabels: string[]; // low -> high
  initial: DeadFrets;
}) {
  const [dead, setDead] = useState<DeadFrets>(initial);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok">("idle");

  function toggle(stringIdx: number, fret: number) {
    setDead((d) => {
      const key = String(stringIdx);
      const list = new Set(d[key] ?? []);
      if (list.has(fret)) list.delete(fret);
      else list.add(fret);
      const next = { ...d, [key]: [...list].sort((a, b) => a - b) };
      if (next[key].length === 0) delete next[key];
      return next;
    });
  }

  async function save() {
    setSaved("saving");
    const res = await updateDeadFrets(dead);
    setSaved(res?.ok ? "ok" : "idle");
    if (res?.ok) setTimeout(() => setSaved("idle"), 1500);
  }

  const rows = stringLabels.length;
  const total = Object.values(dead).reduce((s, a) => s + a.length, 0);

  return (
    <div className="rounded-2xl border border-cyprus/10 bg-sand p-5">
      <h3 className="font-semibold text-cyprus">Casas mortas</h3>
      <p className="mt-1 text-[13px] text-cyprus/55">
        Marque casas que trasteiam ou não soam no seu instrumento. As lições vão
        evitá-las, escolhendo a mesma nota em outro lugar quando possível.
      </p>

      <div className="mt-4 overflow-x-auto scrollbar-none">
        <div className="inline-block min-w-full">
          {/* header */}
          <div className="flex items-center gap-1 pb-1">
            <span className="w-7 shrink-0" />
            {Array.from({ length: FRETS + 1 }).map((_, f) => (
              <span
                key={f}
                className="w-7 shrink-0 text-center text-[10px] font-medium text-cyprus/40"
              >
                {f}
              </span>
            ))}
          </div>
          {Array.from({ length: rows }).map((_, rowFromTop) => {
            const si = rows - 1 - rowFromTop;
            return (
              <div key={si} className="flex items-center gap-1 py-0.5">
                <span className="w-7 shrink-0 font-mono text-[12px] text-cyprus/45">
                  {stringLabels[si][0]}
                </span>
                {Array.from({ length: FRETS + 1 }).map((_, f) => {
                  const isDead = (dead[String(si)] ?? []).includes(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggle(si, f)}
                      className={`h-7 w-7 shrink-0 rounded-md border text-[11px] transition-colors ${
                        isDead
                          ? "border-ochre bg-ochre text-sand"
                          : "border-cyprus/10 bg-cyprus/[0.03] text-cyprus/30 hover:bg-cyprus/10"
                      }`}
                    >
                      {isDead ? "×" : ""}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-cyprus px-5 py-2.5 text-sm font-semibold text-sand transition-colors hover:bg-[#11421f]"
        >
          <Check size={16} />
          {saved === "saving" ? "Salvando…" : saved === "ok" ? "Salvo!" : "Salvar"}
        </button>
        <span className="text-[12px] text-cyprus/45">
          {total} casa{total === 1 ? "" : "s"} marcada{total === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
