import { describe, expect, it } from "vitest";

import { classifyEngagementMessage } from "@/modules/engagement/service";

describe("classifyEngagementMessage", () => {
  it("detects high lead intent on pricing questions", async () => {
    const result = await classifyEngagementMessage(
      "Can you send pricing and booking details?"
    );

    expect(result.leadIntentScore).toBeGreaterThan(0.8);
    expect(result.requiresApproval).toBe(true);
  });
});
