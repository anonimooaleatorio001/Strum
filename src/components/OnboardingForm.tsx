"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Guitar, Music2 } from "lucide-react";
import { saveOnboarding } from "@/app/actions/onboarding";
import { INSTRUMENTS, type InstrumentId } from "@/lib/instruments";
import { submitClass } from "@/components/auth/AuthShell";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={submitClass}>
      {pending ? "Salvando…" : "Começar a tocar"}
    </button>
  );
}

const cardBase =
  "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all";

export default function OnboardingForm() {
  const [state, formAction] = useActionState(saveOnboarding, undefined);
  const [instrument, setInstrument] = useState<InstrumentId>("GUITAR");
  const [handedness, setHandedness] = useState<"RIGHT" | "LEFT">("RIGHT");
  const [numStrings, setNumStrings] = useState(6);

  const stringChoices = INSTRUMENTS[instrument].stringChoices;

  function pickInstrument(id: InstrumentId) {
    setInstrument(id);
    setNumStrings(INSTRUMENTS[id].defaultStrings);
  }

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <input type="hidden" name="instrument" value={instrument} />
      <input type="hidden" name="handedness" value={handedness} />
      <input type="hidden" name="numStrings" value={numStrings} />

      {/* Instrument */}
      <div>
        <p className="mb-3 text-sm font-semibold text-cyprus">
          Qual instrumento você toca?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(["GUITAR", "BASS"] as const).map((id) => {
            const active = instrument === id;
            const Icon = id === "GUITAR" ? Guitar : Music2;
            return (
              <button
                key={id}
                type="button"
                onClick={() => pickInstrument(id)}
                className={`${cardBase} ${
                  active
                    ? "border-cyprus bg-cyprus/[0.06] text-cyprus"
                    : "border-cyprus/15 bg-sand text-cyprus/70 hover:border-cyprus/40"
                }`}
              >
                <Icon size={28} />
                <span className="text-sm font-semibold">
                  {id === "GUITAR" ? "Violão / Guitarra" : "Baixo"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number of strings */}
      <div>
        <p className="mb-3 text-sm font-semibold text-cyprus">
          Quantas cordas?
        </p>
        <div className="flex gap-3">
          {stringChoices.map((n) => {
            const active = numStrings === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setNumStrings(n)}
                className={`h-12 flex-1 rounded-xl border-2 text-sm font-semibold transition-all ${
                  active
                    ? "border-cyprus bg-cyprus text-sand"
                    : "border-cyprus/15 bg-sand text-cyprus/70 hover:border-cyprus/40"
                }`}
              >
                {n} cordas
              </button>
            );
          })}
        </div>
      </div>

      {/* Handedness */}
      <div>
        <p className="mb-3 text-sm font-semibold text-cyprus">
          Você é destro ou canhoto?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["RIGHT", "Destro"],
              ["LEFT", "Canhoto"],
            ] as const
          ).map(([val, label]) => {
            const active = handedness === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setHandedness(val)}
                className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                  active
                    ? "border-cyprus bg-cyprus text-sand"
                    : "border-cyprus/15 bg-sand text-cyprus/70 hover:border-cyprus/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {state?.error && (
        <p className="text-[13px] font-medium text-red-700">{state.error}</p>
      )}
      <Submit />
    </form>
  );
}
