import { randomUUID } from "node:crypto";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { cookies } from "next/headers";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

function getSessionCookieConfig(useSecureCookies: boolean) {
  const prefix = useSecureCookies ? "__Secure-" : "";

  return {
    name: `${prefix}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: useSecureCookies
    }
  };
}

export async function createDatabaseSession(userId: string) {
  const adapter = PrismaAdapter(prisma);
  const sessionToken = randomUUID();
  const maxAge = authOptions.session?.maxAge ?? 30 * 24 * 60 * 60;
  const expires = new Date(Date.now() + maxAge * 1000);

  await adapter.createSession?.({
    sessionToken,
    userId,
    expires
  });

  const useSecureCookies = env.NEXTAUTH_URL.startsWith("https://");
  const sessionCookie = getSessionCookieConfig(useSecureCookies);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookie.name, sessionToken, {
    ...sessionCookie.options,
    expires
  });
}
