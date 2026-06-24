import AppShell from "@/components/AppShell";
import { requireOnboardedUser } from "@/server/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedUser();
  return (
    <AppShell
      name={user.name ?? ""}
      streak={user.progress?.streak ?? 0}
      xp={user.progress?.xp ?? 0}
    >
      {children}
    </AppShell>
  );
}
