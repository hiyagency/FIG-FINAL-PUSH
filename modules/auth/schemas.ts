import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),
  password: z.string().min(12).max(128),
  timezone: z.string().min(2).default("UTC")
});

export type RegisterInput = z.infer<typeof registerSchema>;

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email();

export const otpPurposeSchema = z.enum(["signup", "login"]);

export const requestOtpSchema = z.object({
  email: emailSchema,
  purpose: otpPurposeSchema,
  callbackUrl: z.string().min(1).default("/app")
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  purpose: otpPurposeSchema,
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit verification code."),
  callbackUrl: z.string().min(1).default("/app")
});

export const resendOtpSchema = z.object({
  email: emailSchema,
  purpose: otpPurposeSchema,
  callbackUrl: z.string().min(1).default("/app")
});

export type OtpPurposeInput = z.infer<typeof otpPurposeSchema>;
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
