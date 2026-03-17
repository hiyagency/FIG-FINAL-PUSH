import { hash } from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";

import { prisma } from "@/lib/db";
import { registerSchema, type RegisterInput } from "@/modules/auth/schemas";

export async function registerUser(input: RegisterInput) {
  const data = registerSchema.parse(input);
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() }
  });

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  return prisma.user.create({
    data: {
      id: createId(),
      email: data.email.toLowerCase(),
      name: data.name,
      timezone: data.timezone,
      passwordCredential: {
        create: {
          passwordHash: await hash(data.password, 12)
        }
      }
    }
  });
}
