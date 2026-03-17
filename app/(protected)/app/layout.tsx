import { LeadAppShell } from "@/components/lead-ai/app-shell";
import { getServerAuthSession } from "@/lib/auth";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return <LeadAppShell user={session!.user}>{children}</LeadAppShell>;
}
