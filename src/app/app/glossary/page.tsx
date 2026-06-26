import { BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlossaryList from "@/components/learn/GlossaryList";
import { requireOnboardedUser } from "@/server/session";
import { prisma } from "@/lib/db";

export default async function GlossaryPage() {
  const user = await requireOnboardedUser();
  const seen = await prisma.glossarySeen.findMany({
    where: { userId: user.id },
    select: { termId: true },
  });

  return (
    <div>
      <PageHeader
        icon={BookOpen}
        title="Glossário"
        subtitle="Os termos do mundo das cordas, explicados em português. Marque os que já entendeu."
      />
      <GlossaryList seen={seen.map((s) => s.termId)} />
    </div>
  );
}
