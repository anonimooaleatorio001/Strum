import { User } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AccountForm from "@/components/AccountForm";
import { requireOnboardedUser } from "@/server/session";

export default async function AccountPage() {
  const user = await requireOnboardedUser();
  return (
    <div>
      <PageHeader
        icon={User}
        title="Conta"
        subtitle="Atualize seu perfil e as preferências do instrumento."
      />
      <p className="mb-6 text-sm text-cyprus/60">
        Conectado como <span className="font-medium text-cyprus">{user.email}</span>
      </p>
      <AccountForm
        initialName={user.name ?? ""}
        initialInstrument={user.instrument}
        initialHandedness={user.handedness}
        initialStrings={user.numStrings}
      />
    </div>
  );
}
