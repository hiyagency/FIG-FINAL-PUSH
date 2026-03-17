import { OtpPurpose } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { OTP_GENERIC_RESPONSE, hashOtp } from "@/modules/auth/otp";
import { createOtpAuthService } from "@/modules/auth/otp-service";

type TestUser = {
  id: string;
  email: string;
  name: string | null;
  timezone: string | null;
};

type TestOtpRecord = {
  id: string;
  email: string;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  attemptsUsed: number;
  consumedAt: Date | null;
  createdAt: Date;
};

function createHarness() {
  const users: TestUser[] = [];
  const otpRecords: TestOtpRecord[] = [];
  const sentOtps: Array<{ email: string; otp: string }> = [];
  const sessions: string[] = [];

  const service = createOtpAuthService({
    async findUserByEmail(email) {
      return users.find((user) => user.email === email) ?? null;
    },
    async createUser(email) {
      const user = {
        id: `user-${users.length + 1}`,
        email,
        name: null,
        timezone: null
      };

      users.push(user);

      return user;
    },
    async countRecentRequests(email, since) {
      return otpRecords.filter((otpRecord) => otpRecord.email === email && otpRecord.createdAt >= since).length;
    },
    async invalidateActiveOtps(email, purpose, consumedAt) {
      const targetPurpose = purpose === "signup" ? OtpPurpose.SIGNUP : OtpPurpose.LOGIN;

      for (const otpRecord of otpRecords) {
        if (
          otpRecord.email === email &&
          otpRecord.purpose === targetPurpose &&
          !otpRecord.consumedAt &&
          otpRecord.expiresAt > new Date()
        ) {
          otpRecord.consumedAt = consumedAt;
        }
      }
    },
    async createOtp({ email, otpHash, purpose, expiresAt }) {
      const otpRecord: TestOtpRecord = {
        id: `otp-${otpRecords.length + 1}`,
        email,
        otpHash,
        purpose: purpose === "signup" ? OtpPurpose.SIGNUP : OtpPurpose.LOGIN,
        expiresAt,
        attemptsUsed: 0,
        consumedAt: null,
        createdAt: new Date()
      };

      otpRecords.push(otpRecord);

      return otpRecord;
    },
    async getLatestOtp(email, purpose) {
      const targetPurpose = purpose === "signup" ? OtpPurpose.SIGNUP : OtpPurpose.LOGIN;

      return (
        [...otpRecords]
          .filter((otpRecord) => otpRecord.email === email && otpRecord.purpose === targetPurpose)
          .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0] ?? null
      );
    },
    async updateOtp(id, data) {
      const otpRecord = otpRecords.find((candidate) => candidate.id === id);

      if (!otpRecord) {
        throw new Error(`Unknown OTP: ${id}`);
      }

      if (typeof data.attemptsUsed === "number") {
        otpRecord.attemptsUsed = data.attemptsUsed;
      }

      otpRecord.consumedAt = data.consumedAt ?? null;

      return otpRecord;
    },
    async deleteOtp(id) {
      const index = otpRecords.findIndex((otpRecord) => otpRecord.id === id);

      if (index >= 0) {
        otpRecords.splice(index, 1);
      }
    },
    async sendOtpEmail(email, otp) {
      sentOtps.push({ email, otp });
    },
    async createSession(userId) {
      sessions.push(userId);
    }
  });

  return {
    users,
    otpRecords,
    sentOtps,
    sessions,
    service
  };
}

describe("createOtpAuthService", () => {
  it("sends a signup OTP and stores only the hash", async () => {
    const harness = createHarness();
    const result = await harness.service.requestOtp({
      email: " Founder@Lead.ai ",
      purpose: "signup",
      callbackUrl: "/app"
    });

    expect(result.ok).toBe(true);
    expect(harness.sentOtps).toHaveLength(1);
    expect(harness.otpRecords).toHaveLength(1);
    expect(harness.sentOtps[0]?.otp).toMatch(/^\d{6}$/);
    expect(harness.otpRecords[0]?.email).toBe("founder@lead.ai");
    expect(harness.otpRecords[0]?.otpHash).toBe(hashOtp(harness.sentOtps[0]!.otp));

    if (result.ok && "message" in result) {
      expect(result.message).toBe(OTP_GENERIC_RESPONSE);
    }
  });

  it("does not reveal whether a login email exists", async () => {
    const harness = createHarness();
    const result = await harness.service.requestOtp({
      email: "missing@lead.ai",
      purpose: "login",
      callbackUrl: "/app"
    });

    expect(result.ok).toBe(true);
    expect(harness.sentOtps).toHaveLength(0);
    expect(harness.otpRecords).toHaveLength(0);

    if (result.ok && "message" in result) {
      expect(result.message).toBe(OTP_GENERIC_RESPONSE);
    }
  });

  it("sends and verifies a login OTP for an existing user", async () => {
    const harness = createHarness();
    harness.users.push({
      id: "user-existing",
      email: "owner@lead.ai",
      name: "Owner",
      timezone: "Asia/Calcutta"
    });

    const requestResult = await harness.service.requestOtp({
      email: "owner@lead.ai",
      purpose: "login",
      callbackUrl: "/app"
    });

    expect(requestResult.ok).toBe(true);
    expect(harness.sentOtps).toHaveLength(1);

    const verifyResult = await harness.service.verifyOtp({
      email: "owner@lead.ai",
      purpose: "login",
      otp: harness.sentOtps[0]!.otp,
      callbackUrl: "/app"
    });

    expect(verifyResult.ok).toBe(true);
    expect(harness.sessions).toEqual(["user-existing"]);

    if (verifyResult.ok) {
      expect(verifyResult.isNewUser).toBe(false);
      expect(verifyResult.redirectTo).toBe("/app");
    }
  });

  it("creates a new account and session after successful signup verification", async () => {
    const harness = createHarness();
    await harness.service.requestOtp({
      email: "new-user@lead.ai",
      purpose: "signup",
      callbackUrl: "/app"
    });

    const sentOtp = harness.sentOtps[0]?.otp;
    expect(sentOtp).toBeTruthy();

    const result = await harness.service.verifyOtp({
      email: "new-user@lead.ai",
      purpose: "signup",
      otp: sentOtp!,
      callbackUrl: "/app"
    });

    expect(result.ok).toBe(true);
    expect(harness.users).toHaveLength(1);
    expect(harness.sessions).toEqual([harness.users[0]!.id]);

    if (result.ok) {
      expect(result.isNewUser).toBe(true);
      expect(result.redirectTo).toBe("/app");
    }
  });

  it("rejects expired verification codes", async () => {
    const harness = createHarness();
    await harness.service.requestOtp({
      email: "expired@lead.ai",
      purpose: "signup",
      callbackUrl: "/app"
    });

    harness.otpRecords[0]!.expiresAt = new Date(Date.now() - 1_000);

    const result = await harness.service.verifyOtp({
      email: "expired@lead.ai",
      purpose: "signup",
      otp: harness.sentOtps[0]!.otp,
      callbackUrl: "/app"
    });

    expect(result).toMatchObject({
      ok: false,
      code: "expired_otp"
    });
  });

  it("tracks failed attempts and blocks verification after the fifth wrong code", async () => {
    const harness = createHarness();
    await harness.service.requestOtp({
      email: "attempts@lead.ai",
      purpose: "signup",
      callbackUrl: "/app"
    });

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const result = await harness.service.verifyOtp({
        email: "attempts@lead.ai",
        purpose: "signup",
        otp: "111111",
        callbackUrl: "/app"
      });

      expect(result.ok).toBe(false);

      if (!result.ok && attempt < 5) {
        expect(result.code).toBe("wrong_otp");
      }

      if (!result.ok && attempt === 5) {
        expect(result.code).toBe("too_many_attempts");
      }
    }

    expect(harness.otpRecords[0]?.attemptsUsed).toBe(5);
    expect(harness.otpRecords[0]?.consumedAt).toBeInstanceOf(Date);
  });

  it("resends a fresh OTP and consumes the previous active code", async () => {
    const harness = createHarness();
    await harness.service.requestOtp({
      email: "resend@lead.ai",
      purpose: "signup",
      callbackUrl: "/app"
    });

    harness.otpRecords[0]!.createdAt = new Date(Date.now() - 61_000);
    const firstOtpId = harness.otpRecords[0]!.id;

    const result = await harness.service.resendOtp({
      email: "resend@lead.ai",
      purpose: "signup",
      callbackUrl: "/app"
    });

    expect(result.ok).toBe(true);
    expect(harness.sentOtps).toHaveLength(2);
    expect(harness.otpRecords).toHaveLength(2);
    expect(harness.otpRecords.find((otpRecord) => otpRecord.id === firstOtpId)?.consumedAt).toBeInstanceOf(Date);
    expect(harness.otpRecords[1]?.otpHash).toBe(hashOtp(harness.sentOtps[1]!.otp));
  });
});
