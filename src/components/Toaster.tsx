"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { subscribeToasts, type ToastItem } from "@/lib/toast";

const ICON = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONE = {
  success: "bg-forest text-cream",
  error: "bg-tomato text-cream",
  info: "bg-forest-deep text-cream",
};

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts((t) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== t.id));
      }, 3800);
    });
  }, []);

  function dismiss(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
      {items.map((t) => {
        const Icon = ICON[t.type];
        return (
          <div
            key={t.id}
            className={`animate-fade-up pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-medium shadow-glass ${TONE[t.type]}`}
          >
            <Icon size={16} className="shrink-0" />
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Fechar"
              className="ml-1 shrink-0 opacity-70 transition-opacity hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
