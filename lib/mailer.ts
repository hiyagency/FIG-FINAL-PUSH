import nodemailer from "nodemailer";

import { env } from "@/lib/env";

declare global {
  var __mailTransport__: nodemailer.Transporter | undefined;
}

const smtpPass = env.SMTP_PASS || env.SMTP_PASSWORD;

export const mailTransport =
  global.__mailTransport__ ??
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: smtpPass
        }
      : undefined
  });

if (process.env.NODE_ENV !== "production") {
  global.__mailTransport__ = mailTransport;
}

export const smtpFromAddress = env.SMTP_FROM || env.MAIL_FROM;
