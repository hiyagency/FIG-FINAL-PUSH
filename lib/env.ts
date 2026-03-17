import { z } from "zod";

function booleanFromEnv(defaultValue: boolean) {
  return z.preprocess((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (["true", "1", "yes", "on"].includes(normalized)) {
        return true;
      }

      if (["false", "0", "no", "off", ""].includes(normalized)) {
        return false;
      }
    }

    return value;
  }, z.boolean()).default(defaultValue);
}

function getDefaultAppUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "http://localhost:3000";

  return /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
}

const defaultAppUrl = getDefaultAppUrl();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default(defaultAppUrl),
  NEXTAUTH_URL: z.string().url().default(defaultAppUrl),
  NEXTAUTH_SECRET: z.string().min(16).default("dev-nextauth-secret-should-be-replaced"),
  APP_ENCRYPTION_KEY: z
    .string()
    .min(16)
    .default("dev-encryption-secret-should-be-replaced"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5432/lead_ai?schema=public"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  S3_ENDPOINT: z.string().url().default("http://localhost:9000"),
  S3_REGION: z.string().min(1).default("us-east-1"),
  S3_BUCKET: z.string().min(1).default("lead-ai"),
  S3_ACCESS_KEY_ID: z.string().min(1).default("minioadmin"),
  S3_SECRET_ACCESS_KEY: z.string().min(1).default("minioadmin"),
  S3_FORCE_PATH_STYLE: booleanFromEnv(true),
  MAIL_FROM: z.string().min(1).default("Lead.ai <hello@lead.ai>"),
  SMTP_FROM: z.string().min(1).default("Lead.ai <no-reply@yourdomain.com>"),
  SMTP_HOST: z.string().min(1).default("smtp-relay.brevo.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: booleanFromEnv(false),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  GOOGLE_MAPS_API_KEY: z.string().optional().default(""),
  SEARCH_API_PROVIDER: z.enum(["serper", "serpapi", "brave", "none"]).default("serper"),
  SEARCH_API_KEY: z.string().optional().default(""),
  SEARCH_API_BASE_URL: z.string().optional().default(""),
  LEAD_AI_ENABLE_MOCK_DATA: booleanFromEnv(true),
  LEAD_AI_DISABLE_AUTH: booleanFromEnv(true),
  LEAD_AI_DISABLE_QUEUE: booleanFromEnv(false),
  LEAD_AI_EXPORT_DIR: z.string().default("uploads/exports"),
  LEAD_AI_DEFAULT_USER_EMAIL: z.string().default("founder@lead.ai"),
  LEAD_AI_DEFAULT_USER_PASSWORD: z.string().default("LeadAiDemoPassword123!"),
  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  STRIPE_PRICE_STARTER: z.string().optional().default(""),
  STRIPE_PRICE_GROWTH: z.string().optional().default(""),
  STRIPE_PRICE_AGENCY: z.string().optional().default(""),
  INSTAGRAM_APP_ID: z.string().optional().default(""),
  INSTAGRAM_APP_SECRET: z.string().optional().default(""),
  META_REDIRECT_URI: z
    .string()
    .url()
    .optional()
    .default("http://localhost:3000/api/auth/callback/instagram"),
  FFMPEG_PATH: z.string().default("ffmpeg"),
  FFPROBE_PATH: z.string().default("ffprobe"),
  SENTRY_DSN: z.string().optional().default(""),
  SENTRY_AUTH_TOKEN: z.string().optional().default(""),
  FEATURE_ENABLE_EXPERIMENTS: booleanFromEnv(true),
  FEATURE_ENABLE_BILLING: booleanFromEnv(true),
  FEATURE_ENABLE_MEDIA_PIPELINE: booleanFromEnv(true),
  CRON_SIGNING_SECRET: z
    .string()
    .min(16)
    .default("dev-cron-secret-should-be-replaced")
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment configuration:\n${message}`);
  }

  return result.data;
}

export const env = parseEnv();

export type AppEnv = typeof env;
