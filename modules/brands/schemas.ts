import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  niche: z.string().max(120).optional(),
  offerType: z.string().max(120).optional(),
  targetAudience: z.string().max(180).optional(),
  postingLanguage: z.string().max(16).default("en")
});

export const brandDnaSchema = z.object({
  brandName: z.string().min(2),
  niche: z.string().optional(),
  offerType: z.string().optional(),
  targetAudience: z.string().optional(),
  preferredCaptionStyle: z.string().optional(),
  preferredHookStyle: z.string().optional(),
  pacingStyle: z.string().optional(),
  transitionAggressiveness: z.number().min(0).max(100).default(40),
  subtitleStyle: z.record(z.string(), z.unknown()).optional(),
  fontPreferences: z.record(z.string(), z.unknown()).optional(),
  colorPalette: z.record(z.string(), z.unknown()).optional(),
  logoAssetIds: z.array(z.string()).default([]),
  ctaTone: z.string().optional(),
  bannedWords: z.array(z.string()).default([]),
  preferredWords: z.array(z.string()).default([]),
  audioVibe: z.string().optional(),
  platformGoals: z.array(z.string()).default([]),
  postingLanguages: z.array(z.string()).default(["en"]),
  complianceNotes: z.string().optional(),
  approvalRules: z.record(z.string(), z.unknown()).optional()
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type BrandDnaInput = z.infer<typeof brandDnaSchema>;
