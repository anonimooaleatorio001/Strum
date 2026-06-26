"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { importSong, type ImportState } from "@/app/actions/songs";

const PLACEHOLDER = `e|--0--2--3--2--0-----|
B|--------------------|
G|--------------------|
D|--------------------|
A|--------------------|
E|--------------------|`;

export default function SongImportForm() {
  const [state, action, pending] = useActionState<ImportState, FormData>(
    importSong,
    undefined
  );

  return (
    <form action={action} className="rounded-2xl border border-cyprus/10 bg-sand p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          name="title"
          required
          placeholder="Título"
          className="rounded-xl border border-cyprus/15 bg-sand px-3.5 py-2.5 text-sm text-cyprus outline-none focus:border-cyprus/40 sm:col-span-1"
        />
        <input
          name="artist"
          placeholder="Artista (opcional)"
          className="rounded-xl border border-cyprus/15 bg-sand px-3.5 py-2.5 text-sm text-cyprus outline-none focus:border-cyprus/40"
        />
        <input
          name="bpm"
          type="number"
          defaultValue={100}
          min={40}
          max={240}
          placeholder="BPM"
          className="rounded-xl border border-cyprus/15 bg-sand px-3.5 py-2.5 text-sm text-cyprus outline-none focus:border-cyprus/40"
        />
      </div>
      <textarea
        name="tab"
        required
        rows={8}
        placeholder={PLACEHOLDER}
        className="mt-3 w-full rounded-xl border border-cyprus/15 bg-sand px-3.5 py-3 font-mono text-[13px] text-cyprus outline-none focus:border-cyprus/40"
      />
      {state?.error && (
        <p className="mt-2 text-[13px] font-medium text-ochre">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyprus px-5 py-2.5 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35] disabled:opacity-60"
      >
        <Upload size={16} />
        {pending ? "Importando…" : "Importar tablatura"}
      </button>
    </form>
  );
}
