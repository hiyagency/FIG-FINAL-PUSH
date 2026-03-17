import type {
  EnrichedLeadCandidate,
  LeadScoreResult,
  LeadSignalSet,
  ParsedSearchIntent
} from "@/modules/lead-ai/contracts";
import { clampScore, locationLabel } from "@/modules/lead-ai/helpers";

function computeSignalPenalty(signals: LeadSignalSet) {
  let score = 0;

  if (signals.noWebsiteSignal) score += 32;
  if (signals.outdatedWebsiteSignal) score += 20;
  if (signals.weakSocialPresenceSignal) score += 8;
  if (!signals.hasCta) score += 8;
  if (!signals.hasForm) score += 6;
  if (!signals.bookingSignal) score += 6;
  if (!signals.crmSignal) score += 5;

  score += Math.max(0, 70 - (signals.mobileFriendlinessScore ?? 70)) * 0.18;
  score += Math.max(0, 70 - (signals.seoScore ?? 70)) * 0.22;
  score += Math.max(0, 70 - (signals.brandingScore ?? 70)) * 0.12;
  score += Math.max(0, 65 - (signals.speedScore ?? 65)) * 0.16;

  return clampScore(score);
}

function computeFitScore(candidate: EnrichedLeadCandidate, intent: ParsedSearchIntent) {
  let score = 45;

  const industry = candidate.industry?.toLowerCase() ?? "";
  const promptIndustries = intent.industries.map((value) => value.toLowerCase());
  const promptSignals = new Set(intent.signals);
  const firstLocation = intent.locations[0];
  const candidateLocation = locationLabel({
    city: candidate.city,
    state: candidate.state,
    country: candidate.country
  }).toLowerCase();

  if (promptIndustries.some((value) => industry.includes(value.replace(/s$/, "")))) {
    score += 25;
  }

  if (
    firstLocation &&
    [firstLocation.city, firstLocation.state, firstLocation.country]
      .filter(Boolean)
      .some((value) => candidateLocation.includes(String(value).toLowerCase()))
  ) {
    score += 20;
  }

  if (intent.constraints.mustHaveEmail && candidate.businessEmail) {
    score += 5;
  }

  if (intent.constraints.mustHavePhone && candidate.businessPhone) {
    score += 5;
  }

  if (promptSignals.has("outdated_website") && candidate.signals.outdatedWebsiteSignal) {
    score += 8;
  }

  if (promptSignals.has("poor_mobile_experience")) {
    score += Math.max(0, 16 - (candidate.signals.mobileFriendlinessScore ?? 100) / 6);
  }

  if (promptSignals.has("weak_seo")) {
    score += Math.max(0, 18 - (candidate.signals.seoScore ?? 100) / 5);
  }

  return clampScore(score);
}

function computeConfidenceScore(candidate: EnrichedLeadCandidate) {
  const sourceCountScore = Math.min(candidate.sourceEvidence.length * 12, 36);
  const contactScore = candidate.businessEmail || candidate.businessPhone ? 18 : 0;
  const websiteScore = candidate.website ? 18 : 0;
  const auditScore = candidate.audit?.websiteExists ? 16 : 6;
  const dataCompleteness = [
    candidate.companyName,
    candidate.industry,
    candidate.city,
    candidate.country,
    candidate.website
  ].filter(Boolean).length;

  return clampScore(sourceCountScore + contactScore + websiteScore + auditScore + dataCompleteness * 4);
}

export function scoreLead(candidate: EnrichedLeadCandidate, intent: ParsedSearchIntent): LeadScoreResult {
  const opportunityScore = computeSignalPenalty(candidate.signals);
  const fitScore = computeFitScore(candidate, intent);
  const confidenceScore = computeConfidenceScore(candidate);

  return {
    opportunityScore,
    fitScore,
    confidenceScore,
    scoreBreakdown: [
      {
        label: "Opportunity",
        score: opportunityScore,
        reason: "Higher when website quality, SEO, UX, and funnel signals suggest a visible gap."
      },
      {
        label: "ICP fit",
        score: fitScore,
        reason: "Higher when industry, geography, and requested contact/signal filters match the prompt."
      },
      {
        label: "Confidence",
        score: confidenceScore,
        reason: "Higher when the lead is supported by multiple public sources and website evidence."
      }
    ]
  };
}
