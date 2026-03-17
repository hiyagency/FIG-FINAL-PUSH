import { generateStructuredObject } from "@/modules/ai/client";
import type {
  EnrichedLeadCandidate,
  LeadInsight,
  LeadScoreResult,
  ParsedSearchIntent
} from "@/modules/lead-ai/contracts";
import { trimText } from "@/modules/lead-ai/helpers";
import { leadInsightSchema } from "@/modules/lead-ai/schemas";

function fallbackInsight(
  candidate: EnrichedLeadCandidate,
  score: LeadScoreResult,
  intent: ParsedSearchIntent
): LeadInsight {
  const topPainPoints = candidate.painPoints.slice(0, 3).join(", ") || "visible conversion friction";
  const serviceOffer = candidate.signals.noWebsiteSignal
    ? "website launch sprint"
    : candidate.signals.bookingSignal
      ? "conversion-focused redesign"
      : "website optimization and local SEO package";

  return {
    aiSummary: trimText(
      `${candidate.companyName} shows ${topPainPoints}. Public-source analysis suggests a credible opportunity for ${serviceOffer}.`,
      200
    )!,
    whyThisLeadFits: trimText(
      `This lead aligns with the brief for ${intent.industries[0] || "target businesses"} and scores ${score.opportunityScore}/100 on visible opportunity.`,
      180
    )!,
    outreachAngle: trimText(
      `Lead with ${serviceOffer}, anchored in ${candidate.painPoints[0] || "conversion and search visibility"} and backed by public website findings.`,
      180
    )!,
    recommendedServiceOffer: serviceOffer,
    coldOpenerLine: trimText(
      `I checked your public website and noticed a few quick wins around ${candidate.painPoints[0]?.toLowerCase() || "conversion and visibility"} that could help you capture more demand.`,
      180
    )!,
    whyNow: trimText(
      `Improving these public-facing issues now can strengthen both discovery and conversion before more competitors modernize.`,
      180
    )!,
    priorityLevel:
      score.opportunityScore >= 85 ? "high" : score.opportunityScore >= 65 ? "medium" : "low"
  };
}

export async function generateLeadInsight(input: {
  candidate: EnrichedLeadCandidate;
  score: LeadScoreResult;
  intent: ParsedSearchIntent;
}) {
  const fallback = fallbackInsight(input.candidate, input.score, input.intent);

  const aiResult = await generateStructuredObject({
    schema: leadInsightSchema,
    system: [
      "You write concise B2B outreach research notes for a compliant prospecting product.",
      "Only refer to public business information provided in the input.",
      "Do not mention or invent private data, hidden contacts, or unverifiable claims.",
      "Keep the tone helpful, specific, and commercially useful."
    ].join(" "),
    user: JSON.stringify({
      prompt: input.intent.rawPrompt,
      candidate: {
        companyName: input.candidate.companyName,
        industry: input.candidate.industry,
        location: [input.candidate.city, input.candidate.state, input.candidate.country]
          .filter(Boolean)
          .join(", "),
        painPoints: input.candidate.painPoints,
        signals: input.candidate.signals,
        scores: input.score,
        website: input.candidate.website
      }
    })
  }).catch(() => null);

  return aiResult ?? fallback;
}
