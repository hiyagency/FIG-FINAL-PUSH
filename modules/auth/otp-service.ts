import { createId } from "@paralleldrive/cuid2";
import { OtpPurpose, type OtpVerification, type User } from "@prisma/client";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  constantTimeOtpMatch,
  generateNumericOtp,
  hashOtp,
  OTP_GENERIC_RESPONSE,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_SENDS_PER_WINDOW,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_SEND_WINDOW_MINUTES,
  OTP_TTL_MINUTES
} from "@/modules/auth/otp";
import { sendOtpEmail } from "@/modules/auth/otp-mailer";
import {
  requestOtpSchema,
  resendOtpSchema,
  type OtpPurposeInput,
  type RequestOtpInput,
  type ResendOtpInput,
  type VerifyOtpInput,
  verifyOtpSchema
} from "@/modules/auth/schemas";
import { createDatabaseSession } from "@/modules/auth/session";

type AuthUser = Pick<User, "id" | "email" | "name" | "timezone">;
type OtpRecord = Pick<
  OtpVerification,
  "id" | "email" | "otpHash" | "purpose" | "expiresAt" | "attemptsUsed" | "consumedAt" | "createdAt"
>;

type OtpRequestResult = {
  ok: true;
  email: string;
  purpose: OtpPurposeInput;
  message: string;
  cooldownSeconds: number;
};

type OtpRequestError = Extract<OtpVerifyResult, { ok: false }>;

type OtpVerifyResult =
  | {
      ok: true;
      redirectTo: string;
      isNewUser: boolean;
    }
  | {
      ok: false;
      code:
        | "invalid_email"
        | "wrong_otp"
        | "expired_otp"
        | "consumed_otp"
        | "too_many_attempts"
        | "failed_to_send_otp"
        | "resend_cooldown_active"
        | "invalid_request";
      message: string;
      retryAfterSeconds?: number;
    };

type OtpAuthDependencies = {
  findUserByEmail(email: string): Promise<AuthUser | null>;
  createUser(email: string): Promise<AuthUser>;
  countRecentRequests(email: string, since: Date): Promise<number>;
  invalidateActiveOtps(email: string, purpose: OtpPurposeInput, consumedAt: Date): Promise<void>;
  createOtp(input: {
    email: string;
    otpHash: string;
    purpose: OtpPurposeInput;
    expiresAt: Date;
  }): Promise<OtpRecord>;
  getLatestOtp(email: string, purpose: OtpPurposeInput): Promise<OtpRecord | null>;
  updateOtp(
    id: string,
    data: Partial<Pick<OtpRecord, "attemptsUsed" | "consumedAt">>
  ): Promise<OtpRecord>;
  deleteOtp(id: string): Promise<void>;
  sendOtpEmail(email: string, otp: string): Promise<void>;
  createSession(userId: string): Promise<void>;
};

function purposeToDb(purpose: OtpPurposeInput) {
  return purpose === "signup" ? OtpPurpose.SIGNUP : OtpPurpose.LOGIN;
}

function createDefaultOtpDependencies(): OtpAuthDependencies {
  return {
    findUserByEmail(email) {
      return prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          timezone: true
        }
      });
    },
    createUser(email) {
      return prisma.user.create({
        data: {
          id: createId(),
          email
        },
        select: {
          id: true,
          email: true,
          name: true,
          timezone: true
        }
      });
    },
    countRecentRequests(email, since) {
      return prisma.otpVerification.count({
        where: {
          email,
          createdAt: {
            gte: since
          }
        }
      });
    },
    invalidateActiveOtps(email, purpose, consumedAt) {
      return prisma.otpVerification.updateMany({
        where: {
          email,
          purpose: purposeToDb(purpose),
          consumedAt: null,
          expiresAt: {
            gt: new Date()
          }
        },
        data: {
          consumedAt
        }
      }).then(() => undefined);
    },
    createOtp({ email, otpHash, purpose, expiresAt }) {
      return prisma.otpVerification.create({
        data: {
          email,
          otpHash,
          purpose: purposeToDb(purpose),
          expiresAt
        }
      });
    },
    getLatestOtp(email, purpose) {
      return prisma.otpVerification.findFirst({
        where: {
          email,
          purpose: purposeToDb(purpose)
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    },
    updateOtp(id, data) {
      return prisma.otpVerification.update({
        where: { id },
        data
      });
    },
    deleteOtp(id) {
      return prisma.otpVerification.delete({
        where: { id }
      }).then(() => undefined);
    },
    sendOtpEmail(email, otp) {
      return sendOtpEmail({ email, otp });
    },
    createSession(userId) {
      return createDatabaseSession(userId);
    }
  };
}

function invalidRequest(message = "Invalid request. Please try again."): OtpRequestError {
  return {
    ok: false,
    code: "invalid_request",
    message
  };
}

export function createOtpAuthService(dependencies: OtpAuthDependencies = createDefaultOtpDependencies()) {
  async function issueOtp(
    input: RequestOtpInput | ResendOtpInput,
    options: {
      enforceCooldown: boolean;
      genericOnRateLimit: boolean;
    }
  ): Promise<OtpRequestResult | OtpRequestError> {
    const parsed = requestOtpSchema.parse(input);
    const now = new Date();
    const existingUser = await dependencies.findUserByEmail(parsed.email);

    if (parsed.purpose === "login" && !existingUser) {
      return {
        ok: true,
        email: parsed.email,
        purpose: parsed.purpose,
        message: OTP_GENERIC_RESPONSE,
        cooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS
      };
    }

    const latestOtp = await dependencies.getLatestOtp(parsed.email, parsed.purpose);
    if (
      options.enforceCooldown &&
      latestOtp &&
      now.getTime() - latestOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_SECONDS * 1000
    ) {
      return {
        ok: false,
        code: "resend_cooldown_active",
        message: "Please wait before requesting another code.",
        retryAfterSeconds: Math.max(
          1,
          OTP_RESEND_COOLDOWN_SECONDS -
            Math.floor((now.getTime() - latestOtp.createdAt.getTime()) / 1000)
        )
      };
    }

    const recentCount = await dependencies.countRecentRequests(
      parsed.email,
      new Date(now.getTime() - OTP_SEND_WINDOW_MINUTES * 60 * 1000)
    );

    if (recentCount >= OTP_MAX_SENDS_PER_WINDOW) {
      if (options.genericOnRateLimit) {
        return {
          ok: true,
          email: parsed.email,
          purpose: parsed.purpose,
          message: OTP_GENERIC_RESPONSE,
          cooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS
        };
      }

      return invalidRequest("Too many codes have been requested. Please try again later.");
    }

    const otp = generateNumericOtp();
    const createdOtp = await (async () => {
      await dependencies.invalidateActiveOtps(parsed.email, parsed.purpose, now);

      return dependencies.createOtp({
        email: parsed.email,
        otpHash: hashOtp(otp),
        purpose: parsed.purpose,
        expiresAt: new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000)
      });
    })();

    try {
      await dependencies.sendOtpEmail(parsed.email, otp);
    } catch (error) {
      await dependencies.deleteOtp(createdOtp.id);

      return {
        ok: false,
        code: "failed_to_send_otp",
        message: "We could not send the verification code. Please check SMTP settings and try again."
      };
    }

    logger.info(
      { email: parsed.email, purpose: parsed.purpose },
      "OTP request completed"
    );

    return {
      ok: true,
      email: parsed.email,
      purpose: parsed.purpose,
      message: OTP_GENERIC_RESPONSE,
      cooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS
    };
  }

  return {
    async requestOtp(input: RequestOtpInput): Promise<OtpRequestResult | OtpRequestError> {
      return issueOtp(input, {
        enforceCooldown: false,
        genericOnRateLimit: true
      });
    },
    async resendOtp(input: ResendOtpInput): Promise<OtpRequestResult | OtpRequestError> {
      const parsed = resendOtpSchema.parse(input);

      return issueOtp(parsed, {
        enforceCooldown: true,
        genericOnRateLimit: false
      });
    },
    async verifyOtp(input: VerifyOtpInput): Promise<OtpVerifyResult> {
      const parsed = verifyOtpSchema.parse(input);
      const otpRecord = await dependencies.getLatestOtp(parsed.email, parsed.purpose);

      if (!otpRecord) {
        return {
          ok: false,
          code: "expired_otp",
          message: "This verification code is invalid or has expired."
        };
      }

      if (otpRecord.consumedAt) {
        return {
          ok: false,
          code: "consumed_otp",
          message: "This verification code has already been used or replaced."
        };
      }

      if (otpRecord.expiresAt.getTime() < Date.now()) {
        return {
          ok: false,
          code: "expired_otp",
          message: "This verification code has expired. Request a new code to continue."
        };
      }

      if (otpRecord.attemptsUsed >= OTP_MAX_ATTEMPTS) {
        return {
          ok: false,
          code: "too_many_attempts",
          message: "Too many incorrect attempts. Request a new code to continue."
        };
      }

      if (!constantTimeOtpMatch(otpRecord.otpHash, parsed.otp)) {
        const nextAttempts = otpRecord.attemptsUsed + 1;

        await dependencies.updateOtp(otpRecord.id, {
          attemptsUsed: nextAttempts,
          consumedAt: nextAttempts >= OTP_MAX_ATTEMPTS ? new Date() : null
        });

        return nextAttempts >= OTP_MAX_ATTEMPTS
          ? {
              ok: false,
              code: "too_many_attempts",
              message: "Too many incorrect attempts. Request a new code to continue."
            }
          : {
              ok: false,
              code: "wrong_otp",
              message: "That verification code is incorrect. Please try again."
            };
      }

      await dependencies.updateOtp(otpRecord.id, {
        consumedAt: new Date()
      });

      let user = await dependencies.findUserByEmail(parsed.email);
      let isNewUser = false;

      if (!user && parsed.purpose === "signup") {
        user = await dependencies.createUser(parsed.email);
        isNewUser = true;
      }

      if (!user) {
        return {
          ok: false,
          code: "invalid_request",
          message: "This verification request is no longer valid."
        };
      }

      await dependencies.createSession(user.id);

      return {
        ok: true,
        redirectTo: parsed.callbackUrl || "/app",
        isNewUser
      };
    }
  };
}

export const otpAuthService = createOtpAuthService();
