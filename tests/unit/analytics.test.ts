import { describe, expect, it } from "vitest";

import { summarizePerformanceMemory } from "@/modules/analytics/service";

describe("summarizePerformanceMemory", () => {
  it("returns the highest scoring snapshot characteristics", () => {
    const result = summarizePerformanceMemory([
      {
        views: 1000,
        saves: 50,
        shares: 20,
        captionLength: 80,
        hookStyle: "Story",
        subtitleStyle: "Minimal",
        pacingStyle: "Clean",
        ctaFamily: "Save CTA"
      },
      {
        views: 1400,
        saves: 90,
        shares: 40,
        captionLength: 130,
        hookStyle: "Authority",
        subtitleStyle: "Bold dark",
        pacingStyle: "Fast-cut",
        ctaFamily: "Comment CTA"
      }
    ]);

    expect(result.bestCaptionLength).toBe(130);
    expect(result.bestHookStyle).toBe("Authority");
    expect(result.bestPacing).toBe("Fast-cut");
  });
});
