import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { mailTransport, smtpFromAddress } from "@/lib/mailer";

export async function createNotification(input: {
  workspaceId?: string;
  brandId?: string;
  userId?: string;
  channel: "IN_APP" | "EMAIL" | "WEBHOOK";
  eventType: string;
  subject?: string;
  body?: string;
  payload?: Record<string, unknown>;
}) {
  const data: Prisma.NotificationEventUncheckedCreateInput = {
    ...input,
    payload: input.payload as Prisma.InputJsonValue | undefined
  };

  return prisma.notificationEvent.create({
    data
  });
}

export async function sendEmailNotification(input: {
  to: string;
  subject: string;
  body: string;
}) {
  await mailTransport.sendMail({
    from: smtpFromAddress,
    to: input.to,
    subject: input.subject,
    text: input.body
  });
}
