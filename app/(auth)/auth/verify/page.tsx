import { redirect } from "next/navigation";
import { z } from "zod";

import { OtpVerificationPanel } from "@/components/forms/otp-verification-panel";

const searchParamsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),
  purpose: z.enum(["signup", "login"]),
  callbackUrl: z.string().min(1).default("/app"),
  sentAt: z.coerce.number().optional()
});

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VerifyPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = searchParamsSchema.safeParse({
    email: getFirstValue(params.email),
    purpose: getFirstValue(params.purpose),
    callbackUrl: getFirstValue(params.callbackUrl),
    sentAt: getFirstValue(params.sentAt)
  });

  if (!parsed.success) {
    redirect("/auth/login");
  }

  return (
    <OtpVerificationPanel
      email={parsed.data.email}
      purpose={parsed.data.purpose}
      callbackUrl={parsed.data.callbackUrl}
      sentAt={parsed.data.sentAt}
    />
  );
}
