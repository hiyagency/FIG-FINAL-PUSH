import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  it("returns ok status", async () => {
    const response = GET();
    const json = await response.json();

    expect(json.status).toBe("ok");
  });
});
