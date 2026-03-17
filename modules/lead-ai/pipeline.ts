import type { Prisma } from "@prisma/client";
import { SearchJobStage, SearchJobStatus, SearchStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { discoveryConnectors, enrichmentConnectors } from "@/lib/connectors";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type {
  ConnectorLeadCandidate,
  EnrichedLeadCandidate,
  LeadSignalSet,
  ParsedSearchIntent
} from "@/modules/lead-ai/contracts";
import {
  buildIntentSummary,
  canonicalizeDomain,
  normalizeCompanyName,
  normalizePhone,
  runWithConcurrency,
  sanitizeBusinessEmail,
  unique,
  uniqueObjectsBy
} from "@/modules/lead-ai/helpers";
import { getMockCandidates } from "@/modules/lead-ai/mock-data";
import { generateLeadInsight } from "@/modules/lead-ai/outreach";
import { parsePromptToIntent } from "@/modules/lead-ai/prompt-parser";
import { scoreLead } from "@/modules/lead-ai/scoring";

type SearchContext = Prisma.SearchGetPayload<{
  include: {
    parsedQuery: true;
    user: {
      include: {
        leadSettings: true;
      };
    };
  };
}>;

function defaultSignals(partial?: Partial<LeadSignalSet>): LeadSignalSet {
  return {
    adActivitySignal: false,
    crmSignal: false,
    bookingSignal: false,
    outdatedWebsiteSignal: false,
    noWebsiteSignal: false,
    weakSocialPresenceSignal: false,
    ...partial
  };
}

async function ensureJob(searchId: string, stage: SearchJobStage, connectorKey?: string) {
  const existing = await prisma.searchJob.findFirst({
    where: {
      searchId,
      stage,
      connectorKey: connectorKey ?? null
    }
  });

  if (existing) {
    return existing;
  }

  return prisma.searchJob.create({
    data: {
      searchId,
      stage,
      connectorKey,
      status: "QUEUED"
    }
  });
}

async function updateJob(
  searchId: string,
  stage: SearchJobStage,
  input: {
    connectorKey?: string;
    status?: SearchJobStatus;
    progress?: number;
    message?: string;
    result?: Prisma.InputJsonValue;
    errorMessage?: string | null;
  }
) {
  const job = await ensureJob(searchId, stage, input.connectorKey);

  return prisma.searchJob.update({
    where: { id: job.id },
    data: {
      status: input.status,
      progress: input.progress,
      message: input.message,
      result: input.result,
      errorMessage: input.errorMessage ?? undefined,
      startedAt: input.status === "RUNNING" && !job.startedAt ? new Date() : undefined,
      finishedAt:
        input.status &&
        ["COMPLETE", "FAILED", "PARTIAL", "CANCELED"].includes(input.status) &&
        !job.finishedAt
          ? new Date()
          : undefined
    }
  });
}

async function updateSearchStatus(
  searchId: string,
  input: {
    status?: SearchStatus;
    progressPercent?: number;
    currentMessage?: string | null;
    summary?: Prisma.InputJsonValue;
    startedAt?: Date;
    completedAt?: Date;
  }
) {
  return prisma.search.update({
    where: { id: searchId },
    data: input
  });
}

async function getSearchContext(searchId: string) {
  const search = await prisma.search.findUnique({
    where: { id: searchId },
    include: {
      parsedQuery: true,
      user: {
        include: {
          leadSettings: true
        }
      }
    }
  });

  if (!search) {
    throw new Error(`Search ${searchId} not found`);
  }

  return search as SearchContext;
}

async function toIntent(search: SearchContext) {
  if (search.parsedQuery) {
    return parsePromptToIntent({
      rawPrompt: search.rawPrompt,
      overrides: {
        rawPrompt: search.rawPrompt,
        industries: search.parsedQuery.industries,
        subIndustries: [],
        serviceNeeds: search.parsedQuery.serviceNeeds,
        locations: [
          {
            country: search.parsedQuery.locationCountry ?? undefined,
            state: search.parsedQuery.locationState ?? undefined,
            city: search.parsedQuery.locationCity ?? undefined
          }
        ].filter((location) => Object.values(location).some(Boolean)),
        businessSize:
          (search.parsedQuery.businessSize as ParsedSearchIntent["businessSize"] | null) ?? "unknown",
        signals: search.parsedQuery.signals,
        contactPreferences: search.parsedQuery
          .contactPreferences as ParsedSearchIntent["contactPreferences"],
        constraints:
          typeof search.parsedQuery.constraints === "object" && search.parsedQuery.constraints
            ? (search.parsedQuery.constraints as ParsedSearchIntent["constraints"])
            : undefined,
        resultLimit: search.resultLimit,
        sortBy: search.sortBy as ParsedSearchIntent["sortBy"]
      }
    });
  }

  return parsePromptToIntent({ rawPrompt: search.rawPrompt });
}

function mergeCandidate<T extends ConnectorLeadCandidate>(base: T, patch?: Partial<ConnectorLeadCandidate>) {
  if (!patch) {
    return base;
  }

  return {
    ...base,
    ...patch,
    website: patch.website ?? base.website,
    domain: patch.domain ?? base.domain,
    socialLinks: {
      ...(base.socialLinks ?? {}),
      ...(patch.socialLinks ?? {})
    },
    sourceEvidence: [...(base.sourceEvidence ?? []), ...(patch.sourceEvidence ?? [])],
    notes: unique([...(base.notes ?? []), ...(patch.notes ?? [])]),
    sourceNames: unique([...(base.sourceNames ?? []), ...(patch.sourceNames ?? [])]),
    sourceUrls: unique([...(base.sourceUrls ?? []), ...(patch.sourceUrls ?? [])])
  } as T;
}

function normalizeCandidate(candidate: ConnectorLeadCandidate): EnrichedLeadCandidate {
  const website = candidate.website;
  const domain = canonicalizeDomain(candidate.domain || website);
  const businessPhone = normalizePhone(candidate.businessPhone);

  return {
    ...candidate,
    domain,
    website,
    businessEmail: sanitizeBusinessEmail(candidate.businessEmail, domain),
    businessPhone,
    normalizedCompanyName: normalizeCompanyName(candidate.companyName),
    painPoints: [],
    sourceNames: unique([
      ...(candidate.sourceNames ?? []),
      ...candidate.sourceEvidence.map((evidence) => evidence.sourceName)
    ]),
    sourceUrls: unique([
      ...(candidate.sourceUrls ?? []),
      ...candidate.sourceEvidence.map((evidence) => evidence.url)
    ]),
    signals: defaultSignals(candidate.signals)
  };
}

function dedupeCandidates(candidates: EnrichedLeadCandidate[]) {
  return uniqueObjectsBy(candidates, (candidate) =>
    [candidate.domain, candidate.normalizedCompanyName, candidate.businessPhone]
      .filter(Boolean)
      .join("|")
  );
}

async function persistLead(
  searchId: string,
  candidate: EnrichedLeadCandidate,
  score: ReturnType<typeof scoreLead>,
  insight: Awaited<ReturnType<typeof generateLeadInsight>>
) {
  const existing = await prisma.lead.findFirst({
    where: {
      OR: [
        candidate.domain ? { domain: candidate.domain } : undefined,
        {
          normalizedCompanyName: candidate.normalizedCompanyName,
          businessPhone: candidate.businessPhone ?? undefined
        }
      ].filter(Boolean) as Prisma.LeadWhereInput[]
    }
  });

  const baseData: Prisma.LeadUncheckedCreateInput = {
    companyName: candidate.companyName,
    normalizedCompanyName: candidate.normalizedCompanyName,
    contactName: candidate.contacts?.contactName ?? candidate.contactName,
    contactRole: candidate.contacts?.contactRole ?? candidate.contactRole,
    businessEmail: candidate.contacts?.businessEmail ?? candidate.businessEmail,
    businessPhone: candidate.contacts?.businessPhone ?? candidate.businessPhone,
    website: candidate.website,
    domain: candidate.domain,
    industry: candidate.industry,
    subIndustry: candidate.subIndustry,
    country: candidate.country,
    state: candidate.state,
    city: candidate.city,
    address: candidate.address,
    googleRating: candidate.googleRating,
    reviewSummary: candidate.reviewSummary,
    employeeSizeEstimate: candidate.employeeSizeEstimate,
    revenueEstimateOptional: candidate.revenueEstimateOptional,
    socialLinks: candidate.socialLinks ?? {},
    sourceUrls: candidate.sourceUrls,
    sourceNames: candidate.sourceNames,
    sourceCount: candidate.sourceUrls.length,
    websiteQualityScore: candidate.signals.websiteQualityScore,
    mobileFriendlinessScore: candidate.signals.mobileFriendlinessScore,
    seoScore: candidate.signals.seoScore,
    brandingScore: candidate.signals.brandingScore,
    speedScore: candidate.signals.speedScore,
    adActivitySignal: candidate.signals.adActivitySignal,
    crmSignal: candidate.signals.crmSignal,
    bookingSignal: candidate.signals.bookingSignal,
    outdatedWebsiteSignal: candidate.signals.outdatedWebsiteSignal,
    noWebsiteSignal: candidate.signals.noWebsiteSignal,
    weakSocialPresenceSignal: candidate.signals.weakSocialPresenceSignal,
    painPoints: candidate.painPoints,
    aiSummary: insight.aiSummary,
    outreachAngle: insight.outreachAngle,
    bestOfferToPitch: insight.recommendedServiceOffer,
    coldOpenerLine: insight.coldOpenerLine,
    whyNow: insight.whyNow,
    priorityLevel: insight.priorityLevel,
    opportunityScore: score.opportunityScore,
    fitScore: score.fitScore,
    confidenceScore: score.confidenceScore,
    latestAudit: candidate.audit ?? {}
  };

  const lead = existing
    ? await prisma.lead.update({
        where: { id: existing.id },
        data: {
          ...baseData,
          sourceUrls: unique([...(existing.sourceUrls ?? []), ...candidate.sourceUrls]),
          sourceNames: unique([...(existing.sourceNames ?? []), ...candidate.sourceNames]),
          sourceCount: unique([...(existing.sourceUrls ?? []), ...candidate.sourceUrls]).length
        }
      })
    : await prisma.lead.create({ data: baseData });

  await prisma.searchLead.upsert({
    where: {
      searchId_leadId: {
        searchId,
        leadId: lead.id
      }
    },
    update: {
      updatedAt: new Date()
    },
    create: {
      searchId,
      leadId: lead.id
    }
  });

  await prisma.leadScore.upsert({
    where: {
      searchId_leadId: {
        searchId,
        leadId: lead.id
      }
    },
    update: {
      opportunityScore: score.opportunityScore,
      fitScore: score.fitScore,
      confidenceScore: score.confidenceScore,
      scoreBreakdown: score.scoreBreakdown,
      rationale: insight.whyThisLeadFits
    },
    create: {
      searchId,
      leadId: lead.id,
      opportunityScore: score.opportunityScore,
      fitScore: score.fitScore,
      confidenceScore: score.confidenceScore,
      scoreBreakdown: score.scoreBreakdown,
      rationale: insight.whyThisLeadFits
    }
  });

  for (const evidence of candidate.sourceEvidence) {
    await prisma.leadSource.create({
      data: {
        leadId: lead.id,
        connectorName: evidence.connectorKey,
        sourceName: evidence.sourceName,
        sourceUrl: evidence.url,
        fieldName: evidence.field,
        fieldValue: evidence.value,
        fieldConfidence: Math.round(evidence.confidence),
        evidence: evidence.notes ? { notes: evidence.notes } : {}
      }
    });
  }

  return lead;
}

function sortScoredLeads(
  items: Array<{
    candidate: EnrichedLeadCandidate;
    score: ReturnType<typeof scoreLead>;
  }>,
  sortBy: ParsedSearchIntent["sortBy"]
) {
  const sorted = [...items];

  switch (sortBy) {
    case "weakest_mobile":
      sorted.sort(
        (a, b) =>
          (a.candidate.signals.mobileFriendlinessScore ?? 100) -
          (b.candidate.signals.mobileFriendlinessScore ?? 100)
      );
      break;
    case "weakest_seo":
      sorted.sort((a, b) => (a.candidate.signals.seoScore ?? 100) - (b.candidate.signals.seoScore ?? 100));
      break;
    case "closest_match":
      sorted.sort((a, b) => b.score.fitScore - a.score.fitScore);
      break;
    case "newest_found":
      break;
    default:
      sorted.sort(
        (a, b) =>
          b.score.opportunityScore + b.score.fitScore * 0.35 -
          (a.score.opportunityScore + a.score.fitScore * 0.35)
      );
      break;
  }

  return sorted;
}

export async function runSearchPipeline(searchId: string) {
  const search = await getSearchContext(searchId);
  const intent = await toIntent(search);

  await updateSearchStatus(searchId, {
    status: "RUNNING",
    progressPercent: 8,
    currentMessage: "Parsing search intent and preparing connector fan-out.",
    startedAt: search.startedAt ?? new Date()
  });

  await updateJob(searchId, "PARSE", {
    status: "COMPLETE",
    progress: 100,
    message: "Structured intent ready.",
    result: intent
  });

  const discoveryResults = await Promise.allSettled(
    discoveryConnectors.map(async (connector) => {
      const stage = connector.key === "directory-a" ? "DIRECTORY" : "SEARCH";
      await updateJob(searchId, stage, {
        connectorKey: connector.key,
        status: "RUNNING",
        progress: 25,
        message: `Searching via ${connector.displayName}.`
      });

      const results =
        (await connector.search?.({
          query: buildIntentSummary(intent),
          intent,
          location: intent.locations[0],
          limit: Math.min(intent.resultLimit, 25)
        })) ?? [];

      await updateJob(searchId, stage, {
        connectorKey: connector.key,
        status: results.length ? "COMPLETE" : "PARTIAL",
        progress: 100,
        message: results.length
          ? `${connector.displayName} returned ${results.length} records.`
          : `${connector.displayName} returned no records.`,
        result: {
          count: results.length
        }
      });

      return results;
    })
  );

  const discoveredCandidates = discoveryResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  if (!discoveredCandidates.length && env.LEAD_AI_ENABLE_MOCK_DATA) {
    logger.info({ searchId }, "Falling back to mock-mode candidates");
    discoveredCandidates.push(...getMockCandidates(intent));
  }

  if (!discoveredCandidates.length) {
    await updateSearchStatus(searchId, {
      status: "FAILED",
      progressPercent: 100,
      currentMessage: "No connector results were returned. Configure providers or enable mock mode.",
      completedAt: new Date(),
      summary: {
        totalLeads: 0
      }
    });

    await updateJob(searchId, "SEARCH", {
      status: "FAILED",
      progress: 100,
      message: "No results returned by enabled discovery connectors.",
      errorMessage: "No discovery results"
    });

    return;
  }

  await updateSearchStatus(searchId, {
    progressPercent: 32,
    currentMessage: `Discovered ${discoveredCandidates.length} candidates. Auditing public websites.`
  });

  const normalizedCandidates = uniqueObjectsBy(
    discoveredCandidates.map(normalizeCandidate),
    (candidate) =>
      [candidate.domain, candidate.normalizedCompanyName, candidate.businessPhone]
        .filter(Boolean)
        .join("|")
  );

  await updateJob(searchId, "ENRICH", {
    status: "RUNNING",
    progress: 20,
    message: "Running public website enrichment."
  });

  const enrichedCandidates = await runWithConcurrency(normalizedCandidates, 4, async (candidate) => {
    let merged = candidate;

    for (const connector of enrichmentConnectors) {
      const enrichment = await connector.enrich?.({
        candidate: merged,
        intent
      });

      if (!enrichment) {
        continue;
      }

      merged = {
        ...mergeCandidate(merged, enrichment.candidate),
        audit: enrichment.audit ?? merged.audit,
        contacts: enrichment.contacts ?? merged.contacts,
        sourceEvidence: [...merged.sourceEvidence, ...enrichment.evidence],
        signals: defaultSignals({
          ...merged.signals,
          ...(enrichment.signals ?? {})
        }),
        painPoints: unique([...merged.painPoints, ...(enrichment.audit?.painPoints ?? [])])
      };
    }

    if (!merged.website) {
      merged.signals.noWebsiteSignal = true;
      merged.signals.outdatedWebsiteSignal = true;
      merged.painPoints = unique([...merged.painPoints, "No website detected"]);
    }

    merged.sourceNames = unique([
      ...merged.sourceNames,
      ...merged.sourceEvidence.map((item) => item.sourceName)
    ]);
    merged.sourceUrls = unique([
      ...merged.sourceUrls,
      ...merged.sourceEvidence.map((item) => item.url)
    ]);

    return merged;
  });

  await updateJob(searchId, "ENRICH", {
    status: "COMPLETE",
    progress: 100,
    message: "Public enrichment completed.",
    result: {
      count: enrichedCandidates.length
    }
  });

  const dedupedCandidates = dedupeCandidates(enrichedCandidates);

  await updateSearchStatus(searchId, {
    progressPercent: 66,
    currentMessage: "Scoring and generating outreach insights."
  });

  await updateJob(searchId, "SCORE", {
    status: "RUNNING",
    progress: 25,
    message: "Computing opportunity, fit, and confidence scores."
  });

  const scored = await runWithConcurrency(dedupedCandidates, 3, async (candidate) => {
    const score = scoreLead(candidate, intent);
    const insight = await generateLeadInsight({
      candidate,
      score,
      intent
    });

    return { candidate, score, insight };
  });

  const sorted = sortScoredLeads(
    scored.map((item) => ({ candidate: item.candidate, score: item.score })),
    intent.sortBy
  );
  const rankedItems = sorted
    .map((item) =>
      scored.find(
        (candidate) =>
          candidate.candidate.normalizedCompanyName === item.candidate.normalizedCompanyName &&
          candidate.candidate.domain === item.candidate.domain
      )
    )
    .filter(Boolean) as typeof scored;

  await prisma.searchLead.deleteMany({ where: { searchId } });

  let rank = 1;
  for (const item of rankedItems.slice(0, intent.resultLimit)) {
    const lead = await persistLead(searchId, item.candidate, item.score, item.insight);
    await prisma.searchLead.update({
      where: {
        searchId_leadId: {
          searchId,
          leadId: lead.id
        }
      },
      data: {
        rank
      }
    });
    rank += 1;
  }

  const topPainPoints = unique(rankedItems.flatMap((item) => item.candidate.painPoints).slice(0, 8));

  await updateJob(searchId, "SCORE", {
    status: "COMPLETE",
    progress: 100,
    message: "Scores and insights finalized.",
    result: {
      count: rankedItems.length
    }
  });

  await updateJob(searchId, "RANK", {
    status: "COMPLETE",
    progress: 100,
    message: "Leads ranked for the results table."
  });

  await updateSearchStatus(searchId, {
    status: "COMPLETE",
    progressPercent: 100,
    currentMessage: `Ready with ${rankedItems.length} scored leads.`,
    completedAt: new Date(),
    summary: {
      totalLeads: rankedItems.length,
      avgOpportunityScore:
        rankedItems.reduce((sum, item) => sum + item.score.opportunityScore, 0) /
        Math.max(rankedItems.length, 1),
      avgFitScore:
        rankedItems.reduce((sum, item) => sum + item.score.fitScore, 0) /
        Math.max(rankedItems.length, 1),
      topPainPoints
    }
  });
}

export async function cancelSearch(searchId: string, userId: string) {
  await prisma.search.update({
    where: {
      id: searchId,
      userId
    },
    data: {
      status: "CANCELED",
      currentMessage: "Search canceled by user.",
      completedAt: new Date()
    }
  });

  await prisma.searchJob.updateMany({
    where: {
      searchId,
      status: {
        in: ["QUEUED", "RUNNING"]
      }
    },
    data: {
      status: "CANCELED",
      progress: 100,
      message: "Canceled by user."
    }
  });
}
