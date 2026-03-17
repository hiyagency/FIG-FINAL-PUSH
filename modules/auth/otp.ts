import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_LENGTH = 6;
export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_MAX_SENDS_PER_WINDOW = 3;
export const OTP_SEND_WINDOW_MINUTES = 15;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_GENERIC_RESPONSE =
  "If this email can be used, a verification code has been sent.";

export function generateNumericOtp() {
  return randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");
}

export function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

export function constantTimeOtpMatch(expectedHash: string, candidateOtp: string) {
  const expected = Buffer.from(expectedHash, "hex");
  const actual = Buffer.from(hashOtp(candidateOtp), "hex");

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
