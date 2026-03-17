import { LeadAppShell } from "@/components/lead-ai/app-shell";
import { getServerAuthSession } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <LeadAppShell authDisabled={env.LEAD_AI_DISABLE_AUTH} user={session!.user}>
      {children}
    </LeadAppShell>
  );
}
