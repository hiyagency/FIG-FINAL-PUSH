import { createHmac } from "node:crypto";

import { PublishMode } from "@prisma/client";

import { decryptValue } from "@/lib/encryption";
import { env } from "@/lib/env";

export type InstagramConnection = {
  username?: string | null;
  externalAccountId: string;
  encryptedAccessToken: string;
  scopes: string[];
  expiresAt?: Date | null;
  capabilities?: Record<string, unknown> | null;
};

export function getPublishModeCapabilities(mode: PublishMode) {
  return {
    mode,
    platformNativeTrial: mode === PublishMode.PLATFORM_TRIAL,
    transparentFallback:
      mode === PublishMode.INTERNAL_EXPERIMENT
        ? "Platform-native trial publishing is unavailable. REEL.ai will track variants as an internal experiment."
        : null
  };
}

export function validateInstagramConnection(account: InstagramConnection) {
  if (account.expiresAt && account.expiresAt.getTime() < Date.now()) {
    return {
      ok: false,
      code: "TOKEN_EXPIRED",
      message: "Instagram access token expired. Reconnect the account before publishing."
    };
  }

  if (!account.scopes.includes("instagram_content_publish")) {
    return {
      ok: false,
      code: "MISSING_SCOPE",
      message:
        "Connected account is missing the instagram_content_publish scope."
    };
  }

  return {
    ok: true as const,
    accessToken: decryptValue(account.encryptedAccessToken)
  };
}

export function buildInstagramPublishPayload(input: {
  account: InstagramConnection;
  caption: string;
  mediaUrl: string;
  coverUrl?: string;
  mode?: PublishMode;
}) {
  const validation = validateInstagramConnection(input.account);

  if (!validation.ok) {
    return validation;
  }

  return {
    ok: true as const,
    apiBaseUrl: "https://graph.facebook.com/v23.0",
    accountId: input.account.externalAccountId,
    accessToken: validation.accessToken,
    createContainerPayload: {
      media_type: "REELS",
      video_url: input.mediaUrl,
      thumb_offset: 0,
      caption: input.caption,
      cover_url: input.coverUrl
    },
    modeCapabilities: getPublishModeCapabilities(
      input.mode ?? PublishMode.STANDARD
    )
  };
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const expected = createHmac("sha256", env.STRIPE_WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("hex");

  return signature === expected;
}
