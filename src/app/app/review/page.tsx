import Link from "next/link";
import { Sparkles, Play, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { requireOnboardedUser } from "@/server/session";
import { getReviewSet } from "@/server/adaptive";

const REASON_LABEL: Record<string, string> = {
  stale: "Precisa de revisão",
  new: "Próximo passo",
  weak: "Reforço",
};

export default async function ReviewPage() {
  const user = await requireOnboardedUser();
  const items = await getReviewSet(user, 5);

  return (
    <div>
      <Link
        href="/app"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyprus/60 transition-colors hover:text-cyprus"
      >
        <ArrowLeft size={16} /> Início
      </Link>

      <PageHeader
        icon={Sparkles}
        title="Revisão adaptativa"
        subtitle="O Strum escolhe o que praticar com base no que está enfraquecendo e no seu próximo passo na trilha."
      />

      <div className="mx-auto max-w-2xl space-y-3">
        {items.map((item) => (
          <Link
            key={item.exercise.id}
            href={`/app/lessons/${item.exercise.id}`}
            className="flex items-center justify-between rounded-2xl border border-cyprus/10 bg-sand p-5 transition-colors hover:border-cyprus/30"
          >
            <div>
              <span className="inline-block rounded-full bg-cyprus/8 px-2.5 py-0.5 text-[11px] font-semibold text-cyprus/60">
                {REASON_LABEL[item.reason]}
              </span>
              <h3 className="mt-2 font-semibold text-cyprus">
                {item.exercise.title}
              </h3>
              <p className="mt-0.5 text-[13px] text-cyprus/55">
                {item.exercise.notes.length} notas · {item.exercise.bpm} BPM
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyprus text-sand">
              <Play size={18} className="ml-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
