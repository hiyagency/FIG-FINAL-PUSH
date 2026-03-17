import type { Session } from "next-auth";
import * as XLSX from "xlsx";

import { env } from "@/lib/env";
import type { ParsedSearchIntent } from "@/modules/lead-ai/contracts";
import { demoPrompts } from "@/modules/lead-ai/demo-prompts";
import { clampScore, normalizeCompanyName, slugify } from "@/modules/lead-ai/helpers";
import { getMockCandidates } from "@/modules/lead-ai/mock-data";
import { parsePromptToIntent } from "@/modules/lead-ai/prompt-parser";
import { scoreLead } from "@/modules/lead-ai/scoring";

const demoUser = {
  id: "lead-ai-demo-user",
  name: "Lead.ai Demo",
  email: "demo@lead.ai",
  locale: "en",
  timezone: "Asia/Calcutta"
} as const;

const defaultSettings = {
  id: "demo-settings",
  connectorToggles: {
    searchApi: true,
    publicWeb: true,
    companyWebsite: true,
    directorySources: true
  },
  complianceText:
    "Demo mode is active. Lead.ai is showing sample prospecting output with public-source style evidence so you can use the workspace without authentication.",
  enrichmentDepth: "standard",
  dedupeSettings: {
    domain: true,
    companyName: true,
    businessPhone: true
  },
  exportDefaults: {
    format: "CSV",
    includeSources: true
  }
} as const;

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function isAuthDisabled() {
  return env.LEAD_AI_DISABLE_AUTH;
}

export function getDemoSession(): Session {
  return {
    user: {
      ...demoUser
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
  };
}

export function getDemoUser() {
  return demoUser;
}

export function createDemoSearchId(rawPrompt: string) {
  return `demo-search-${encode(rawPrompt)}`;
}

export function createDemoLeadId(rawPrompt: string, index: number) {
  return `demo-lead-${encode(`${rawPrompt}::${index}`)}`;
}

function getPromptFromSearchId(searchId?: string) {
  if (!searchId?.startsWith("demo-search-")) {
    return demoPrompts[0];
  }

  try {
    return decode(searchId.replace("demo-search-", "")) || demoPrompts[0];
  } catch {
    return demoPrompts[0];
  }
}

function getLeadMetaFromLeadId(leadId: string) {
  if (!leadId.startsWith("demo-lead-")) {
    return null;
  }

  try {
    const [rawPrompt, indexValue] = decode(leadId.replace("demo-lead-", "")).split("::");

    return {
      rawPrompt: rawPrompt || demoPrompts[0],
      index: Number(indexValue || "0")
    };
  } catch {
    return null;
  }
}

function createSignalPreset(index: number, intent: ParsedSearchIntent, hasWebsite: boolean) {
  const weakSeo = intent.signals.includes("weak_seo") || index !== 2;
  const poorMobile = intent.signals.includes("poor_mobile_experience") || index === 0;
  const outdatedWebsite = !hasWebsite || intent.signals.includes("outdated_website") || index < 2;
  const missingBooking = intent.signals.includes("missing_booking_funnel") || index !== 1;
  const weakSocial = intent.signals.includes("weak_social_presence") || index !== 1;

  const seoScore = hasWebsite ? (weakSeo ? 35 + index * 6 : 68) : 0;
  const mobileFriendlinessScore = hasWebsite ? (poorMobile ? 34 + index * 7 : 72) : 0;
  const brandingScore = hasWebsite ? (outdatedWebsite ? 40 + index * 8 : 74) : 0;
  const speedScore = hasWebsite ? 46 + index * 8 : 0;
  const websiteQualityScore = clampScore(
    seoScore * 0.3 + mobileFriendlinessScore * 0.25 + brandingScore * 0.25 + speedScore * 0.2
  );

  return {
    websiteQualityScore,
    mobileFriendlinessScore,
    seoScore,
    brandingScore,
    speedScore,
    adActivitySignal: index === 1,
    crmSignal: intent.serviceNeeds.includes("crm") && index === 2,
    bookingSignal: hasWebsite && !missingBooking,
    outdatedWebsiteSignal: outdatedWebsite,
    noWebsiteSignal: !hasWebsite,
    weakSocialPresenceSignal: weakSocial,
    sslEnabled: hasWebsite,
    hasViewportTag: hasWebsite && !poorMobile,
    hasTitleTag: hasWebsite,
    hasMetaDescription: hasWebsite && index !== 0,
    hasH1: hasWebsite,
    hasSchemaHints: hasWebsite && index === 2,
    hasContactPage: hasWebsite,
    hasCta: hasWebsite && !missingBooking,
    hasForm: hasWebsite && index !== 2,
    hasMapEmbed: hasWebsite && index === 1
  };
}

function createPainPoints(
  signals: ReturnType<typeof createSignalPreset>,
  intent: ParsedSearchIntent
) {
  const painPoints = [
    signals.noWebsiteSignal ? "No website detected" : null,
    signals.outdatedWebsiteSignal && !signals.noWebsiteSignal ? "Outdated website experience" : null,
    signals.mobileFriendlinessScore < 50 ? "Poor mobile experience" : null,
    signals.seoScore < 45 ? "Weak SEO foundations" : null,
    !signals.bookingSignal ? "No visible booking or conversion CTA" : null,
    signals.weakSocialPresenceSignal ? "Weak social presence" : null,
    intent.serviceNeeds.includes("crm") && !signals.crmSignal ? "No visible CRM signal" : null
  ].filter(Boolean) as string[];

  return painPoints.length ? painPoints : ["Opportunity detected in public website signals"];
}

function createLeadNarrative(
  companyName: string,
  painPoints: string[],
  intent: ParsedSearchIntent,
  opportunityScore: number,
  hasWebsite: boolean
) {
  const leadOffer = !hasWebsite
    ? "website launch and local visibility package"
    : intent.serviceNeeds.includes("crm")
      ? "conversion funnel and CRM automation package"
      : intent.serviceNeeds.includes("booking")
        ? "booking funnel optimization package"
        : "website redesign and local SEO package";

  return {
    aiSummary: `${companyName} shows ${painPoints.slice(0, 3).join(", ").toLowerCase()}. Demo mode ranks this lead at ${opportunityScore}/100 opportunity for a ${leadOffer}.`,
    outreachAngle: `Lead with a ${leadOffer} focused on ${painPoints[0]?.toLowerCase() || "conversion friction"} and public-facing trust signals.`,
    whyNow:
      "A cleaner digital funnel would improve discoverability and make it easier for high-intent visitors to convert before competitors modernize.",
    bestOfferToPitch: leadOffer,
    coldOpenerLine: `I reviewed your public web presence and noticed a few quick wins around ${painPoints[0]?.toLowerCase() || "lead conversion"} that could help capture more demand.`,
    priorityLevel:
      opportunityScore >= 85 ? "high" : opportunityScore >= 65 ? "medium" : "low"
  };
}

async function buildDemoSearchDetail(rawPrompt: string) {
  const intent = await parsePromptToIntent({ rawPrompt });
  const candidates = getMockCandidates(intent).slice(0, 3);

  const leads = candidates.map((candidate, index) => {
    const hasWebsite =
      !intent.signals.includes("no_website") || index !== 0 ? Boolean(candidate.website) : false;
    const signals = createSignalPreset(index, intent, hasWebsite);
    const painPoints = createPainPoints(signals, intent);
    const enrichedCandidate = {
      ...candidate,
      website: hasWebsite ? candidate.website : undefined,
      domain: hasWebsite ? candidate.domain : undefined,
      normalizedCompanyName: normalizeCompanyName(candidate.companyName),
      painPoints,
      sourceNames: candidate.sourceEvidence.map((item) => item.sourceName),
      sourceUrls: candidate.sourceEvidence.map((item) => item.url),
      signals
    };
    const score = scoreLead(enrichedCandidate, intent);
    const narrative = createLeadNarrative(
      candidate.companyName,
      painPoints,
      intent,
      score.opportunityScore,
      hasWebsite
    );

    return {
      id: createDemoLeadId(rawPrompt, index),
      companyName: candidate.companyName,
      contactName: null,
      contactRole: null,
      businessEmail: candidate.businessEmail,
      businessPhone: candidate.businessPhone,
      website: hasWebsite ? candidate.website : null,
      domain: hasWebsite ? candidate.domain : null,
      industry: candidate.industry ?? intent.industries[0] ?? "Business",
      subIndustry: candidate.subIndustry ?? null,
      city: candidate.city ?? null,
      state: candidate.state ?? null,
      country: candidate.country ?? null,
      address: candidate.address ?? null,
      opportunityScore: score.opportunityScore,
      fitScore: score.fitScore,
      confidenceScore: score.confidenceScore,
      painPoints,
      aiSummary: narrative.aiSummary,
      outreachAngle: narrative.outreachAngle,
      whyNow: narrative.whyNow,
      bestOfferToPitch: narrative.bestOfferToPitch,
      coldOpenerLine: narrative.coldOpenerLine,
      priorityLevel: narrative.priorityLevel,
      sourceUrls: candidate.sourceEvidence.map((item) => item.url),
      sourceNames: candidate.sourceEvidence.map((item) => item.sourceName),
      websiteQualityScore: signals.websiteQualityScore,
      mobileFriendlinessScore: signals.mobileFriendlinessScore,
      seoScore: signals.seoScore,
      brandingScore: signals.brandingScore,
      speedScore: signals.speedScore,
      outdatedWebsiteSignal: signals.outdatedWebsiteSignal,
      weakSocialPresenceSignal: signals.weakSocialPresenceSignal,
      leadSources: candidate.sourceEvidence.map((item, sourceIndex) => ({
        id: `demo-source-${index}-${sourceIndex}`,
        connectorName: item.connectorKey,
        sourceName: item.sourceName,
        sourceUrl: item.url
      }))
    };
  });

  const createdAt = new Date();
  const searchId = createDemoSearchId(rawPrompt);

  return {
    id: searchId,
    rawPrompt,
    name:
      intent.industries[0] && (intent.locations[0]?.city || intent.locations[0]?.country)
        ? `${intent.industries[0]} ${intent.locations[0]?.city || intent.locations[0]?.country}`
        : intent.industries[0] || "Lead search",
    status: "COMPLETE",
    progressPercent: 100,
    currentMessage:
      "Demo mode is active. Lead.ai is showing sample prospecting output without requiring authentication.",
    summary: {
      totalLeads: leads.length,
      avgOpportunityScore: Math.round(
        leads.reduce((total, lead) => total + lead.opportunityScore, 0) / Math.max(leads.length, 1)
      ),
      mode: "demo"
    },
    parsedQuery: {
      industries: intent.industries,
      serviceNeeds: intent.serviceNeeds,
      signals: intent.signals,
      locationCity: intent.locations[0]?.city ?? null,
      locationState: intent.locations[0]?.state ?? null,
      locationCountry: intent.locations[0]?.country ?? null
    },
    jobs: [
      {
        id: `demo-job-parse-${slugify(rawPrompt)}`,
        stage: "PARSE",
        status: "COMPLETE",
        progress: 100,
        message: "Prompt converted into structured ICP filters.",
        connectorKey: null,
        updatedAt: createdAt
      },
      {
        id: `demo-job-search-${slugify(rawPrompt)}`,
        stage: "SEARCH",
        status: "COMPLETE",
        progress: 100,
        message: "Demo discovery pipeline generated ranked sample leads.",
        connectorKey: "mock-mode",
        updatedAt: createdAt
      },
      {
        id: `demo-job-score-${slugify(rawPrompt)}`,
        stage: "SCORE",
        status: "COMPLETE",
        progress: 100,
        message: "Opportunity, fit, and confidence scores applied.",
        connectorKey: null,
        updatedAt: createdAt
      }
    ],
    searchLeads: leads.map((lead, index) => ({
      rank: index + 1,
      lead
    }))
  };
}

export async function getDemoDashboardData() {
  const detail = await buildDemoSearchDetail(demoPrompts[0]);

  return {
    leadCount: detail.searchLeads.length,
    searches: [
      {
        id: detail.id,
        name: detail.name,
        rawPrompt: detail.rawPrompt,
        status: detail.status,
        _count: {
          searchLeads: detail.searchLeads.length
        }
      }
    ],
    campaigns: [
      {
        id: "demo-campaign",
        name: "Demo outbound sprint",
        status: "ACTIVE",
        _count: {
          leads: 2
        }
      }
    ],
    lists: [
      {
        id: "demo-list",
        name: "Sample lead list",
        _count: {
          leads: detail.searchLeads.length
        }
      }
    ],
    exports: [
      {
        id: createDemoExportId(detail.id, "CSV"),
        status: "COMPLETE",
        fileName: "lead-ai-demo-export.csv"
      }
    ]
  };
}

export async function getDemoSearchDetail(searchId: string) {
  return buildDemoSearchDetail(getPromptFromSearchId(searchId));
}

export async function getDemoLeadDetail(leadId: string) {
  const leadMeta = getLeadMetaFromLeadId(leadId);

  if (!leadMeta) {
    return null;
  }

  const search = await buildDemoSearchDetail(leadMeta.rawPrompt);
  const result = search.searchLeads[leadMeta.index];

  if (!result) {
    return null;
  }

  return {
    ...result.lead,
    searchLeads: [
      {
        search: {
          id: search.id,
          name: search.name,
          rawPrompt: search.rawPrompt
        }
      }
    ],
    campaignLeads: [
      {
        campaign: {
          id: "demo-campaign",
          name: "Demo outbound sprint"
        }
      }
    ],
    leadListLeads: [
      {
        list: {
          id: "demo-list",
          name: "Sample lead list"
        }
      }
    ]
  };
}

export async function getDemoCampaignsData() {
  const detail = await buildDemoSearchDetail(demoPrompts[0]);

  return [
    {
      id: "demo-campaign",
      name: "Demo outbound sprint",
      description: "Sample campaign built so the app is ready to explore without authentication.",
      status: "ACTIVE",
      leads: detail.searchLeads.slice(0, 2).map((item) => ({
        lead: item.lead
      }))
    }
  ];
}

export function getDemoSettingsData() {
  return defaultSettings;
}

export function updateDemoSettingsData(input: {
  connectorToggles: Record<string, boolean>;
  enrichmentDepth: string;
  complianceText: string;
  dedupeSettings: Record<string, boolean>;
  exportDefaults: Record<string, string | boolean>;
}) {
  return {
    ...defaultSettings,
    ...input
  };
}

export function createDemoCampaign(input: {
  name: string;
  description?: string;
  leadIds?: string[];
  searchId?: string;
}) {
  return {
    id: `demo-campaign-${slugify(input.name) || "new"}`,
    name: input.name,
    description: input.description ?? null,
    status: "ACTIVE",
    leads: (input.leadIds ?? []).map((leadId) => ({
      leadId
    })),
    searchId: input.searchId ?? null
  };
}

export function createDemoLeadList(input: {
  name: string;
  description?: string;
  leadIds?: string[];
  searchId?: string;
}) {
  return {
    id: `demo-list-${slugify(input.name) || "new"}`,
    name: input.name,
    description: input.description ?? null,
    leads: (input.leadIds ?? []).map((leadId) => ({
      leadId
    })),
    searchId: input.searchId ?? null
  };
}

export function createDemoExportId(searchId: string, format: "CSV" | "XLSX") {
  return `demo-export-${format.toLowerCase()}-${encode(searchId)}`;
}

export function createDemoExportRecord(input: {
  format: "CSV" | "XLSX";
  searchId?: string;
  campaignId?: string;
  listId?: string;
  fileName: string;
}) {
  const searchId = input.searchId || createDemoSearchId(demoPrompts[0]);

  return {
    id: createDemoExportId(searchId, input.format),
    status: "COMPLETE",
    format: input.format,
    fileName:
      input.fileName ||
      `lead-ai-demo-export.${input.format === "XLSX" ? "xlsx" : "csv"}`,
    searchId,
    campaignId: input.campaignId ?? null,
    listId: input.listId ?? null,
    storageKey: null
  };
}

export function getDemoExportRecord(exportId: string) {
  const match = exportId.match(/^demo-export-(csv|xlsx)-(.+)$/i);

  if (!match) {
    return null;
  }

  const format = match[1]!.toUpperCase() as "CSV" | "XLSX";
  const searchId = decode(match[2]!);

  return {
    id: exportId,
    status: "COMPLETE",
    format,
    searchId,
    fileName: `lead-ai-demo-export.${format === "XLSX" ? "xlsx" : "csv"}`,
    storageKey: null
  };
}

function csvEscape(value: unknown) {
  const rawValue = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${rawValue.replaceAll('"', '""')}"`;
}

export async function buildDemoExportDownload(exportId: string) {
  const exportRecord = getDemoExportRecord(exportId);

  if (!exportRecord) {
    return null;
  }

  const search = await getDemoSearchDetail(exportRecord.searchId);
  const headers = [
    "Company",
    "Email",
    "Phone",
    "Website",
    "Location",
    "Opportunity Score",
    "Pain Points",
    "Outreach Angle"
  ];
  const rows = search.searchLeads.map((item) => [
    item.lead.companyName,
    item.lead.businessEmail,
    item.lead.businessPhone,
    item.lead.website,
    [item.lead.city, item.lead.state, item.lead.country].filter(Boolean).join(", "),
    item.lead.opportunityScore,
    item.lead.painPoints.join("; "),
    item.lead.outreachAngle
  ]);

  if (exportRecord.format === "CSV") {
    const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => row.map(csvEscape).join(","))].join(
      "\n"
    );

    return {
      buffer: Buffer.from(csv, "utf8"),
      contentType: "text/csv; charset=utf-8",
      fileName: exportRecord.fileName
    };
  }

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  return {
    buffer: Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as ArrayBuffer),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileName: exportRecord.fileName
  };
}
