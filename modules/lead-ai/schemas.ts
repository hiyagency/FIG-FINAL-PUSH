import { z } from "zod";

export const searchLocationSchema = z.object({
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  region: z.string().trim().optional()
});

export const searchConstraintsSchema = z.object({
  websitePresence: z.enum(["any", "required", "missing_only"]).default("any"),
  minRating: z.number().min(0).max(5).optional(),
  maxRating: z.number().min(0).max(5).optional(),
  employeeSize: z.string().trim().optional(),
  mustHaveEmail: z.boolean().default(false),
  mustHavePhone: z.boolean().default(false),
  hasWeakSeo: z.boolean().optional(),
  hasPoorMobileUx: z.boolean().optional(),
  hasOutdatedBranding: z.boolean().optional(),
  hasNoSocialLinks: z.boolean().optional(),
  onlyDomains: z.array(z.string().trim()).default([]),
  excludeDomains: z.array(z.string().trim()).default([]),
  excludeDuplicates: z.boolean().default(true),
  language: z.string().trim().optional()
});

export const parsedSearchIntentSchema = z.object({
  rawPrompt: z.string().min(3),
  industries: z.array(z.string().trim()).default([]),
  subIndustries: z.array(z.string().trim()).default([]),
  serviceNeeds: z.array(z.string().trim()).default([]),
  locations: z.array(searchLocationSchema).default([]),
  businessSize: z
    .enum(["unknown", "micro", "small", "small_to_mid", "mid_market", "enterprise"])
    .default("unknown"),
  signals: z.array(z.string().trim()).default([]),
  contactPreferences: z
    .array(
      z.enum([
        "business_email",
        "business_phone",
        "business_whatsapp",
        "contact_name",
        "contact_role"
      ])
    )
    .default(["business_email", "business_phone"]),
  constraints: searchConstraintsSchema.default({
    websitePresence: "any",
    mustHaveEmail: false,
    mustHavePhone: false,
    excludeDuplicates: true,
    onlyDomains: [],
    excludeDomains: []
  }),
  resultLimit: z.number().int().min(1).max(250).default(100),
  sortBy: z
    .enum([
      "highest_opportunity",
      "weakest_seo",
      "weakest_mobile",
      "closest_match",
      "newest_found"
    ])
    .default("highest_opportunity")
});

export const searchRequestSchema = z.object({
  rawPrompt: z.string().min(3).max(2000),
  locationFilters: z.array(searchLocationSchema).default([]),
  nicheFilters: z.array(z.string().trim()).default([]),
  signalFilters: z.array(z.string().trim()).default([]),
  resultLimit: z.number().int().min(1).max(250).default(100)
});

export const sourceEvidenceSchema = z.object({
  connectorKey: z.string(),
  sourceName: z.string(),
  url: z.string().url(),
  field: z.string().optional(),
  value: z.string().optional(),
  confidence: z.number().min(0).max(100),
  notes: z.string().optional()
});

export const leadSignalSetSchema = z.object({
  websiteQualityScore: z.number().min(0).max(100).optional(),
  mobileFriendlinessScore: z.number().min(0).max(100).optional(),
  seoScore: z.number().min(0).max(100).optional(),
  brandingScore: z.number().min(0).max(100).optional(),
  speedScore: z.number().min(0).max(100).optional(),
  adActivitySignal: z.boolean().default(false),
  crmSignal: z.boolean().default(false),
  bookingSignal: z.boolean().default(false),
  outdatedWebsiteSignal: z.boolean().default(false),
  noWebsiteSignal: z.boolean().default(false),
  weakSocialPresenceSignal: z.boolean().default(false),
  sslEnabled: z.boolean().optional(),
  hasViewportTag: z.boolean().optional(),
  hasTitleTag: z.boolean().optional(),
  hasMetaDescription: z.boolean().optional(),
  hasH1: z.boolean().optional(),
  hasSchemaHints: z.boolean().optional(),
  hasContactPage: z.boolean().optional(),
  hasCta: z.boolean().optional(),
  hasForm: z.boolean().optional(),
  hasMapEmbed: z.boolean().optional()
});

export const contactRecordSchema = z.object({
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  businessEmail: z.string().optional(),
  businessPhone: z.string().optional(),
  businessWhatsApp: z.string().optional(),
  sourceEvidence: z.array(sourceEvidenceSchema).default([])
});

export const websiteAuditResultSchema = z.object({
  websiteExists: z.boolean(),
  finalUrl: z.string().optional(),
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  headings: z.array(z.string()).default([]),
  contactPageUrl: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).default({}),
  signals: leadSignalSetSchema,
  painPoints: z.array(z.string()).default([]),
  sourceEvidence: z.array(sourceEvidenceSchema).default([])
});

export const connectorLeadCandidateSchema = z.object({
  companyName: z.string().min(1),
  website: z.string().optional(),
  domain: z.string().optional(),
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  businessEmail: z.string().optional(),
  businessPhone: z.string().optional(),
  industry: z.string().optional(),
  subIndustry: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  googleRating: z.number().optional(),
  reviewSummary: z.string().optional(),
  employeeSizeEstimate: z.string().optional(),
  revenueEstimateOptional: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  sourceEvidence: z.array(sourceEvidenceSchema).default([]),
  sourceNames: z.array(z.string()).optional(),
  sourceUrls: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  signals: leadSignalSetSchema.partial().optional()
});

export const leadInsightSchema = z.object({
  aiSummary: z.string().min(10),
  whyThisLeadFits: z.string().min(10),
  outreachAngle: z.string().min(10),
  recommendedServiceOffer: z.string().min(3),
  coldOpenerLine: z.string().min(10),
  whyNow: z.string().min(10),
  priorityLevel: z.enum(["low", "medium", "high"])
});
