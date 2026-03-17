import { describe, expect, it } from "vitest";

import type { EnrichedLeadCandidate, ParsedSearchIntent } from "@/modules/lead-ai/contracts";
import { scoreLead } from "@/modules/lead-ai/scoring";

describe("scoreLead", () => {
  it("rewards obvious opportunity and geographic fit", () => {
    const intent: ParsedSearchIntent = {
      rawPrompt: "Find dentists in Mumbai with outdated websites and weak SEO",
      industries: ["Dentists"],
      subIndustries: [],
      serviceNeeds: ["website", "seo"],
      locations: [{ city: "Mumbai", state: "Maharashtra", country: "India" }],
      businessSize: "small_to_mid",
      signals: ["outdated_website", "weak_seo"],
      contactPreferences: ["business_email", "business_phone"],
      constraints: {
        websitePresence: "required",
        mustHaveEmail: false,
        mustHavePhone: false,
        excludeDuplicates: true,
        onlyDomains: [],
        excludeDomains: []
      },
      resultLimit: 50,
      sortBy: "highest_opportunity"
    };

    const candidate: EnrichedLeadCandidate = {
      companyName: "Mumbai Dental Co",
      normalizedCompanyName: "mumbai dental",
      industry: "Dentists",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      businessEmail: "hello@mumbaidental.example",
      businessPhone: "+912240001122",
      sourceEvidence: [
        {
          connectorKey: "mock",
          sourceName: "mock",
          url: "https://mumbaidental.example",
          confidence: 100
        }
      ],
      sourceNames: ["mock"],
      sourceUrls: ["https://mumbaidental.example"],
      painPoints: ["Outdated design heuristics detected"],
      signals: {
        websiteQualityScore: 38,
        mobileFriendlinessScore: 36,
        seoScore: 32,
        brandingScore: 45,
        speedScore: 48,
        adActivitySignal: false,
        crmSignal: false,
        bookingSignal: false,
        outdatedWebsiteSignal: true,
        noWebsiteSignal: false,
        weakSocialPresenceSignal: true
      }
    };

    const score = scoreLead(candidate, intent);

    expect(score.opportunityScore).toBeGreaterThan(70);
    expect(score.fitScore).toBeGreaterThan(75);
    expect(score.confidenceScore).toBeGreaterThan(40);
  });
});
