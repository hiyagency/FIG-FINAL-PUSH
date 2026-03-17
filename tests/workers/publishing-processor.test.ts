import { describe, expect, it } from "vitest";

import { getPublishModeCapabilities } from "@/modules/publishing/service";

describe("publishing mode capabilities", () => {
  it("exposes internal experiment fallback", () => {
    const result = getPublishModeCapabilities("INTERNAL_EXPERIMENT");

    expect(result.transparentFallback).toContain("internal experiment");
  });
});
