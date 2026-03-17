import { compare } from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
        include: { passwordCredential: true }
      });

      if (!user?.passwordCredential) {
        return null;
      }

      const isValid = await compare(
        credentials.password,
        user.passwordCredential.passwordHash
      );

      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      };
    }
  })
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }) as NextAuthOptions["providers"][number]
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/app",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error"
  },
  providers,
  callbacks: {
    async session({ session, user }) {
      const userWithProfile = user as typeof user & {
        locale?: string | null;
        timezone?: string | null;
      };

      if (session.user) {
        session.user.id = user.id;
        session.user.locale = userWithProfile.locale;
        session.user.timezone = userWithProfile.timezone;
      }

      return session;
    }
  }
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
