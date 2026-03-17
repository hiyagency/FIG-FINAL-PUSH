import { z } from "zod";

import { generateStructuredObject } from "@/modules/ai/client";

export const contentDiagnosisOutputSchema = z.object({
  nicheDetected: z.string(),
  contentIntent: z.string(),
  strongestAngles: z.array(z.string()).min(3),
  weakPoints: z.array(z.string()).min(2),
  recommendedReelTypes: z.array(z.string()).min(3),
  recommendedEditingStyle: z.string(),
  bestPlatformSuggestions: z.array(z.string()).min(1),
  confidenceSummary: z.string()
});

export type ContentDiagnosisOutput = z.infer<typeof contentDiagnosisOutputSchema>;

function buildHeuristicDiagnosis(input: {
  transcriptText?: string;
  durationMs?: number;
}): ContentDiagnosisOutput {
  const transcript = (input.transcriptText || "").toLowerCase();
  const mentionsOffer =
    transcript.includes("offer") ||
    transcript.includes("book") ||
    transcript.includes("dm");

  return {
    nicheDetected: transcript.includes("coach") ? "Coaching" : "Knowledge business",
    contentIntent: mentionsOffer ? "PROMOTIONAL" : "EDUCATIONAL",
    strongestAngles: [
      "Face-led authority delivery",
      "Single-topic clarity",
      "Strong CTA opportunity"
    ],
    weakPoints: [
      "Opening may need a stronger first-line hook",
      "Subtitle density should be tuned for retention"
    ],
    recommendedReelTypes: ["Authority", "Organic", "Fast-cut"],
    recommendedEditingStyle:
      input.durationMs && input.durationMs > 30_000
        ? "Tighter opening cuts, dead-air removal, medium subtitle density"
        : "Punchy authority pacing with medium CTA emphasis",
    bestPlatformSuggestions: ["Instagram Reels"],
    confidenceSummary:
      "Heuristic diagnosis generated locally because no external AI provider was configured."
  };
}

export async function generateContentDiagnosis(input: {
  transcriptText?: string;
  durationMs?: number;
  brandContext?: string;
}) {
  const heuristic = buildHeuristicDiagnosis(input);
  const aiResult = await generateStructuredObject({
    schema: contentDiagnosisOutputSchema,
    system:
      "You are REEL.ai's content diagnosis planner. Return JSON only. Infer niche, intent, angles, weak points, reel types, editing style, and platform fit.",
    user: JSON.stringify(
      {
        transcriptText: input.transcriptText,
        durationMs: input.durationMs,
        brandContext: input.brandContext,
        heuristic
      },
      null,
      2
    )
  });

  return aiResult ?? heuristic;
}
