export type BusinessSize =
  | "unknown"
  | "micro"
  | "small"
  | "small_to_mid"
  | "mid_market"
  | "enterprise";

export type SearchSortOption =
  | "highest_opportunity"
  | "weakest_seo"
  | "weakest_mobile"
  | "closest_match"
  | "newest_found";

export type SearchLocation = {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  region?: string;
};

export type WebsitePresenceFilter = "any" | "required" | "missing_only";

export type ContactPreference =
  | "business_email"
  | "business_phone"
  | "business_whatsapp"
  | "contact_name"
  | "contact_role";

export type SearchConstraints = {
  websitePresence: WebsitePresenceFilter;
  minRating?: number;
  maxRating?: number;
  employeeSize?: string;
  mustHaveEmail: boolean;
  mustHavePhone: boolean;
  hasWeakSeo?: boolean;
  hasPoorMobileUx?: boolean;
  hasOutdatedBranding?: boolean;
  hasNoSocialLinks?: boolean;
  onlyDomains?: string[];
  excludeDomains?: string[];
  excludeDuplicates: boolean;
  language?: string;
};

export type ParsedSearchIntent = {
  rawPrompt: string;
  industries: string[];
  subIndustries: string[];
  serviceNeeds: string[];
  locations: SearchLocation[];
  businessSize: BusinessSize;
  signals: string[];
  contactPreferences: ContactPreference[];
  constraints: SearchConstraints;
  resultLimit: number;
  sortBy: SearchSortOption;
};

export type SourceEvidence = {
  connectorKey: string;
  sourceName: string;
  url: string;
  field?: string;
  value?: string;
  confidence: number;
  notes?: string;
};

export type LeadSignalSet = {
  websiteQualityScore?: number;
  mobileFriendlinessScore?: number;
  seoScore?: number;
  brandingScore?: number;
  speedScore?: number;
  adActivitySignal: boolean;
  crmSignal: boolean;
  bookingSignal: boolean;
  outdatedWebsiteSignal: boolean;
  noWebsiteSignal: boolean;
  weakSocialPresenceSignal: boolean;
  sslEnabled?: boolean;
  hasViewportTag?: boolean;
  hasTitleTag?: boolean;
  hasMetaDescription?: boolean;
  hasH1?: boolean;
  hasSchemaHints?: boolean;
  hasContactPage?: boolean;
  hasCta?: boolean;
  hasForm?: boolean;
  hasMapEmbed?: boolean;
};

export type ContactRecord = {
  contactName?: string;
  contactRole?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessWhatsApp?: string;
  sourceEvidence: SourceEvidence[];
};

export type WebsiteAuditResult = {
  websiteExists: boolean;
  finalUrl?: string;
  title?: string;
  metaDescription?: string;
  headings: string[];
  contactPageUrl?: string;
  socialLinks: Record<string, string>;
  signals: LeadSignalSet;
  painPoints: string[];
  sourceEvidence: SourceEvidence[];
};

export type ConnectorLeadCandidate = {
  companyName: string;
  website?: string;
  domain?: string;
  contactName?: string;
  contactRole?: string;
  businessEmail?: string;
  businessPhone?: string;
  industry?: string;
  subIndustry?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  googleRating?: number;
  reviewSummary?: string;
  employeeSizeEstimate?: string;
  revenueEstimateOptional?: string;
  socialLinks?: Record<string, string>;
  sourceEvidence: SourceEvidence[];
  sourceNames?: string[];
  sourceUrls?: string[];
  notes?: string[];
  signals?: Partial<LeadSignalSet>;
};

export type EnrichedLeadCandidate = ConnectorLeadCandidate & {
  audit?: WebsiteAuditResult;
  contacts?: ContactRecord;
  normalizedCompanyName: string;
  painPoints: string[];
  sourceNames: string[];
  sourceUrls: string[];
  signals: LeadSignalSet;
};

export type LeadScoreResult = {
  opportunityScore: number;
  fitScore: number;
  confidenceScore: number;
  scoreBreakdown: Array<{
    label: string;
    score: number;
    reason: string;
  }>;
};

export type LeadInsight = {
  aiSummary: string;
  whyThisLeadFits: string;
  outreachAngle: string;
  recommendedServiceOffer: string;
  coldOpenerLine: string;
  whyNow: string;
  priorityLevel: "low" | "medium" | "high";
};

export type SearchProgressSnapshot = {
  id: string;
  status: string;
  progressPercent: number;
  currentMessage?: string | null;
  summary?: Record<string, unknown> | null;
  jobs: Array<{
    id: string;
    stage: string;
    status: string;
    progress: number;
    message?: string | null;
    connectorKey?: string | null;
    updatedAt: string;
  }>;
};
