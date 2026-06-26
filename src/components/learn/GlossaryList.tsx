"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryTerm,
} from "@/lib/glossary";
import { toggleGlossaryTerm } from "@/app/actions/learn";

export default function GlossaryList({ seen }: { seen: string[] }) {
  const [marked, setMarked] = useState<Set<string>>(new Set(seen));
  const [cat, setCat] = useState<GlossaryTerm["category"] | "Todos">("Todos");
  const [open, setOpen] = useState<string | null>(null);

  const terms = GLOSSARY.filter((t) => cat === "Todos" || t.category === cat);

  async function toggle(id: string) {
    const next = new Set(marked);
    const willSee = !next.has(id);
    if (willSee) next.add(id);
    else next.delete(id);
    setMarked(next);
    await toggleGlossaryTerm(id, willSee);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex flex-wrap gap-2">
        {(["Todos", ...GLOSSARY_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              cat === c
                ? "bg-cyprus text-sand"
                : "bg-cyprus/8 text-cyprus/70 hover:bg-cyprus/15"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-4 text-[13px] text-cyprus/55">
        {marked.size}/{GLOSSARY.length} termos marcados
      </div>

      <div className="flex flex-col gap-2.5">
        {terms.map((t) => {
          const isOpen = open === t.id;
          const isSeen = marked.has(t.id);
          return (
            <div
              key={t.id}
              className="rounded-2xl border border-cyprus/10 bg-sand"
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <button
                  onClick={() => toggle(t.id)}
                  aria-label={isSeen ? "Desmarcar" : "Marcar como entendido"}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSeen
                      ? "border-cyprus bg-cyprus text-sand"
                      : "border-cyprus/25 text-transparent hover:border-cyprus/50"
                  }`}
                >
                  <Check size={15} strokeWidth={3} />
                </button>
                <button
                  onClick={() => setOpen(isOpen ? null : t.id)}
                  className="flex flex-1 items-center justify-between text-left"
                >
                  <span>
                    <span className="font-semibold text-cyprus">{t.term}</span>
                    <span className="ml-2 text-[12px] text-cyprus/45">
                      {t.category}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-cyprus/60">
                      {t.short}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-cyprus/40 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              {isOpen && (
                <p className="border-t border-cyprus/10 px-4 py-3.5 text-[14px] leading-relaxed text-cyprus/75">
                  {t.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
