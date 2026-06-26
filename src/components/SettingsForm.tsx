"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings } from "@/app/actions/settings";
import { submitClass } from "@/components/auth/AuthShell";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={submitClass + " sm:w-auto sm:px-10"}>
      {pending ? "Salvando…" : "Salvar configurações"}
    </button>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-cyprus/10 bg-sand p-4">
      <span>
        <span className="block text-sm font-semibold text-cyprus">{label}</span>
        <span className="mt-0.5 block text-[13px] text-cyprus/55">{hint}</span>
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-5 w-5 shrink-0 accent-[#18542a]"
      />
    </label>
  );
}

export interface SettingsValues {
  dailyGoalXp: number;
  reminders: boolean;
  metronome: boolean;
  waitMode: boolean;
  camera: boolean;
}

export default function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [state, formAction] = useActionState(updateSettings, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div className="rounded-2xl border border-cyprus/10 bg-sand p-4">
        <label className="block text-sm font-semibold text-cyprus">
          Meta diária de XP
        </label>
        <p className="mb-3 text-[13px] text-cyprus/55">
          Quanto você quer ganhar por dia.
        </p>
        <div className="flex flex-wrap gap-2">
          {[20, 30, 50, 80, 120].map((v) => (
            <label
              key={v}
              className="cursor-pointer rounded-full border border-cyprus/15 px-4 py-1.5 text-[13px] font-medium text-cyprus/70 transition-colors has-[:checked]:border-cyprus has-[:checked]:bg-cyprus has-[:checked]:text-sand"
            >
              <input
                type="radio"
                name="dailyGoalXp"
                value={v}
                defaultChecked={initial.dailyGoalXp === v}
                className="sr-only"
              />
              {v} XP
            </label>
          ))}
        </div>
      </div>

      <Toggle name="reminders" label="Lembretes" hint="Receba um empurrãozinho para praticar." defaultChecked={initial.reminders} />
      <Toggle name="metronome" label="Metrônomo nas lições" hint="Toca um clique durante exercícios no tempo." defaultChecked={initial.metronome} />
      <Toggle name="waitMode" label="Modo esperar" hint="A lição espera você acertar antes de seguir." defaultChecked={initial.waitMode} />
      <Toggle name="camera" label="Câmera (coach de postura)" hint="Usa a câmera para ajudar com a posição da mão. (Fase 4)" defaultChecked={initial.camera} />

      {state?.error && (
        <p className="text-[13px] font-medium text-red-700">{state.error}</p>
      )}
      {state?.ok && <p className="text-[13px] font-medium text-cyprus">Salvo! ✓</p>}
      <Submit />
    </form>
  );
}
