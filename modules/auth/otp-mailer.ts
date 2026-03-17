import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { mailTransport, smtpFromAddress } from "@/lib/mailer";

export async function sendOtpEmail(input: {
  email: string;
  otp: string;
}) {
  const subject = "Your Lead.ai verification code";
  const text = [
    "Your Lead.ai verification code",
    "",
    `Code: ${input.otp}`,
    "",
    "This code expires in 10 minutes.",
    "If you did not request this, ignore this email."
  ].join("\n");

  const html = `
    <div style="margin:0;padding:24px;background:#07111f;font-family:Arial,sans-serif;color:#f8fbff;">
      <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:24px;background:#0b1830;padding:32px;">
        <div style="display:inline-block;padding:10px 16px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#9fb0d8;">
          Lead.ai
        </div>
        <h1 style="margin:24px 0 12px;font-size:28px;line-height:1.2;color:#ffffff;">
          Your verification code
        </h1>
        <p style="margin:0 0 24px;color:#b8c5e3;font-size:16px;line-height:1.7;">
          Use this one-time code to continue securely in Lead.ai. It expires in 10 minutes.
        </p>
        <div style="margin:0 0 24px;padding:22px 24px;border-radius:20px;background:#07111f;border:1px solid rgba(35,192,255,0.24);text-align:center;">
          <div style="font-size:40px;letter-spacing:0.32em;font-weight:700;color:#23c0ff;">
            ${input.otp}
          </div>
        </div>
        <p style="margin:0;color:#9fb0d8;font-size:14px;line-height:1.7;">
          If you did not request this, ignore this email. No one at Lead.ai will ever ask for this code.
        </p>
      </div>
    </div>
  `;

  try {
    await mailTransport.sendMail({
      from: smtpFromAddress,
      to: input.email,
      subject,
      text,
      html
    });
  } catch (error) {
    logger.error({ email: input.email, error }, "Failed to send OTP email");
    throw new Error("failed_to_send_otp");
  }

  if (env.NODE_ENV !== "production") {
    logger.info({ email: input.email, otp: input.otp }, "Development OTP preview");
  }
}
