import { z } from "zod";

import { generateStructuredObject } from "@/modules/ai/client";

export const engagementClassifierSchema = z.object({
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "RISKY"]),
  leadIntentScore: z.number().min(0).max(1),
  moderationDecision: z.enum(["ALLOW", "REVIEW", "HIDE", "BLOCK"]),
  requiresApproval: z.boolean(),
  reason: z.string()
});

export async function classifyEngagementMessage(message: string) {
  const lower = message.toLowerCase();
  const fallback = {
    sentiment: lower.includes("spam") ? "RISKY" : "NEUTRAL",
    leadIntentScore:
      lower.includes("pricing") || lower.includes("book") || lower.includes("dm")
        ? 0.92
        : 0.21,
    moderationDecision: lower.includes("spam") ? "REVIEW" : "ALLOW",
    requiresApproval: lower.includes("pricing"),
    reason: "Heuristic classification based on lead and spam keywords."
  } as const;

  return (
    (await generateStructuredObject({
      schema: engagementClassifierSchema,
      system:
        "You are REEL.ai's comment and DM classifier. Score sentiment, lead intent, moderation risk, and approval requirement. Return JSON only.",
      user: JSON.stringify({ message, fallback }, null, 2)
    })) ?? fallback
  );
}
