import { z } from "zod";

import { generateStructuredObject } from "@/modules/ai/client";

export const captionPackageSchema = z.object({
  primaryCaption: z.string(),
  shortCaption: z.string(),
  longCaption: z.string(),
  hashtags: z.array(z.string()).min(3),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()).min(2),
  seoTitle: z.string(),
  pinnedComment: z.string(),
  ctaText: z.string(),
  audienceAngle: z.string(),
  whyThisMayWork: z.string(),
  readabilityScore: z.number().min(0).max(100),
  riskWarnings: z.array(z.string()),
  overuseWarnings: z.array(z.string())
});

export const originalitySchema = z.object({
  originalityScore: z.number().min(0).max(100),
  warnings: z.array(z.string()),
  improvementIdeas: z.array(z.string())
});

export async function generateCaptionPackage(input: {
  projectTitle: string;
  funnelGoal: string;
  brandVoice?: string;
}) {
  const fallback = {
    primaryCaption: `${input.projectTitle}. This version is optimized for ${input.funnelGoal.toLowerCase()} with a direct, clear CTA and tighter first-line framing.`,
    shortCaption: `${input.projectTitle} in under 30 seconds.`,
    longCaption: `${input.projectTitle}. Built to create attention, retention, and a meaningful next step for the audience.`,
    hashtags: ["#contentops", "#shortform", "#instagramstrategy", "#reelai"],
    primaryKeyword: "short-form content strategy",
    secondaryKeywords: ["instagram reels", "creator ops"],
    seoTitle: input.projectTitle,
    pinnedComment: "Want the framework behind this? Reply READY.",
    ctaText: "Comment READY for the breakdown.",
    audienceAngle: "Operators who want better content without bigger teams.",
    whyThisMayWork:
      "Direct clarity, specific outcome framing, and a low-friction CTA support retention and response.",
    readabilityScore: 82,
    riskWarnings: [],
    overuseWarnings: []
  };

  return (
    (await generateStructuredObject({
      schema: captionPackageSchema,
      system:
        "You are REEL.ai's caption and discovery engine. Return JSON only. Generate platform-safe, business-aware captions, hooks, and SEO metadata.",
      user: JSON.stringify({ input, fallback }, null, 2)
    })) ?? fallback
  );
}

export async function evaluateOriginality(input: {
  hook: string;
  caption: string;
  templateName?: string;
}) {
  const fallback = {
    originalityScore: 76,
    warnings: input.hook.toLowerCase().includes("secret")
      ? ["Hook phrasing may feel overused."]
      : [],
    improvementIdeas: [
      "Use a more specific audience pain point in the first line.",
      "Swap generic CTA phrasing for a brand-specific promise."
    ]
  };

  return (
    (await generateStructuredObject({
      schema: originalitySchema,
      system:
        "You are REEL.ai's originality evaluator. Score originality, flag generic patterns, and suggest alternatives. Return JSON only.",
      user: JSON.stringify({ input, fallback }, null, 2)
    })) ?? fallback
  );
}
