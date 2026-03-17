import { describe, expect, it } from "vitest";

import { parsePromptToIntent } from "@/modules/lead-ai/prompt-parser";

describe("parsePromptToIntent", () => {
  it("extracts industry, location, and signal hints from common prompts", async () => {
    const intent = await parsePromptToIntent({
      rawPrompt: "Find restaurants in Indore without modern online ordering systems"
    });

    expect(intent.industries).toContain("Restaurants");
    expect(intent.locations[0]?.city).toBe("Indore");
    expect(intent.signals).toContain("missing_booking_funnel");
  });
});
