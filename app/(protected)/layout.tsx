import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return children;
}
