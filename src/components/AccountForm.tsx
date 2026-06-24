"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "@/app/actions/account";
import { INSTRUMENTS, type InstrumentId } from "@/lib/instruments";
import { inputClass, submitClass } from "@/components/auth/AuthShell";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={submitClass + " sm:w-auto sm:px-10"}>
      {pending ? "Salvando…" : "Salvar"}
    </button>
  );
}

const pill =
  "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all";

export default function AccountForm({
  initialName,
  initialInstrument,
  initialHandedness,
  initialStrings,
}: {
  initialName: string;
  initialInstrument: InstrumentId;
  initialHandedness: "LEFT" | "RIGHT";
  initialStrings: number;
}) {
  const [state, formAction] = useActionState(updateProfile, undefined);
  const [instrument, setInstrument] = useState<InstrumentId>(initialInstrument);
  const [handedness, setHandedness] = useState(initialHandedness);
  const [numStrings, setNumStrings] = useState(initialStrings);

  const stringChoices = INSTRUMENTS[instrument].stringChoices;

  function pickInstrument(id: InstrumentId) {
    setInstrument(id);
    if (!INSTRUMENTS[id].stringChoices.includes(numStrings)) {
      setNumStrings(INSTRUMENTS[id].defaultStrings);
    }
  }

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <input type="hidden" name="instrument" value={instrument} />
      <input type="hidden" name="handedness" value={handedness} />
      <input type="hidden" name="numStrings" value={numStrings} />

      <div>
        <label className="mb-2 block text-sm font-semibold text-cyprus">Nome</label>
        <input
          name="name"
          defaultValue={initialName}
          placeholder="Seu nome"
          className={inputClass}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-cyprus">Instrumento</p>
        <div className="flex gap-3">
          {(["GUITAR", "BASS"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => pickInstrument(id)}
              className={`flex-1 ${pill} ${
                instrument === id
                  ? "border-cyprus bg-cyprus text-sand"
                  : "border-cyprus/15 text-cyprus/70 hover:border-cyprus/40"
              }`}
            >
              {id === "GUITAR" ? "Violão/Guitarra" : "Baixo"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-cyprus">Cordas</p>
        <div className="flex gap-3">
          {stringChoices.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNumStrings(n)}
              className={`flex-1 ${pill} ${
                numStrings === n
                  ? "border-cyprus bg-cyprus text-sand"
                  : "border-cyprus/15 text-cyprus/70 hover:border-cyprus/40"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-cyprus">Mão</p>
        <div className="flex gap-3">
          {(
            [
              ["RIGHT", "Destro"],
              ["LEFT", "Canhoto"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setHandedness(val)}
              className={`flex-1 ${pill} ${
                handedness === val
                  ? "border-cyprus bg-cyprus text-sand"
                  : "border-cyprus/15 text-cyprus/70 hover:border-cyprus/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {state?.error && (
        <p className="text-[13px] font-medium text-red-700">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-[13px] font-medium text-cyprus">Salvo! ✓</p>
      )}
      <Submit />
    </form>
  );
}
