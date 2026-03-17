import { describe, expect, it } from "vitest";

import { planPromptEdit } from "@/modules/editing/service";

describe("planPromptEdit", () => {
  it("translates pacing and subtitle requests into operations", async () => {
    const result = await planPromptEdit(
      "Cut faster in the first 3 seconds and reduce subtitle size."
    );

    expect(result.operations.some((operation) => operation.type === "adjust_pacing")).toBe(true);
    expect(result.operations.some((operation) => operation.type === "adjust_subtitles")).toBe(true);
  });
});
