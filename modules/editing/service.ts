import { z } from "zod";

import { generateStructuredObject } from "@/modules/ai/client";

export const promptEditPlanSchema = z.object({
  summary: z.string(),
  operations: z.array(
    z.object({
      type: z.enum([
        "trim_opening",
        "adjust_subtitles",
        "modify_cta",
        "change_caption_theme",
        "adjust_pacing",
        "swap_template",
        "update_audio"
      ]),
      target: z.string(),
      params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    })
  )
});

export type PromptEditPlan = z.infer<typeof promptEditPlanSchema>;

function buildRuleBasedPlan(prompt: string): PromptEditPlan {
  const normalized = prompt.toLowerCase();
  const operations: PromptEditPlan["operations"] = [];

  if (normalized.includes("faster")) {
    operations.push({
      type: "adjust_pacing",
      target: "opening",
      params: { intensity: "high", seconds: 3 }
    });
  }

  if (normalized.includes("subtitle")) {
    operations.push({
      type: "adjust_subtitles",
      target: "subtitle_track",
      params: {
        size: normalized.includes("smaller") ? "sm" : "md",
        theme: normalized.includes("darker") ? "dark-premium" : "brand-default"
      }
    });
  }

  if (normalized.includes("cta")) {
    operations.push({
      type: "modify_cta",
      target: "ending_card",
      params: {
        strength: normalized.includes("stronger") ? "high" : "medium"
      }
    });
  }

  if (operations.length === 0) {
    operations.push({
      type: "change_caption_theme",
      target: "caption_style",
      params: { mood: "premium" }
    });
  }

  return {
    summary: "Prompt translated into deterministic edit operations.",
    operations
  };
}

export async function planPromptEdit(prompt: string, brandContext?: string) {
  const fallback = buildRuleBasedPlan(prompt);
  const aiResult = await generateStructuredObject({
    schema: promptEditPlanSchema,
    system:
      "You are REEL.ai's prompt-to-edit interpreter. Convert natural language into structured edit operations. Return JSON only.",
    user: JSON.stringify({ prompt, brandContext, fallback }, null, 2)
  });

  return aiResult ?? fallback;
}
