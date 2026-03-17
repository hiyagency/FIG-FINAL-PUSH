import type { ConnectorLeadCandidate, ParsedSearchIntent } from "@/modules/lead-ai/contracts";

function locationSuffix(intent: ParsedSearchIntent) {
  const location = intent.locations[0];
  return [location?.city, location?.state, location?.country].filter(Boolean).join(", ") || "Global";
}

export function getMockCandidates(intent: ParsedSearchIntent): ConnectorLeadCandidate[] {
  const industry = intent.industries[0] || "Business";
  const location = locationSuffix(intent);
  const slugBase = industry.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return [
    {
      companyName: `${industry} One ${location.split(",")[0] || "Co"}`,
      website: `https://${slugBase}-one.example`,
      domain: `${slugBase}-one.example`,
      businessEmail: `hello@${slugBase}-one.example`,
      businessPhone: "+1 555 010 1000",
      industry,
      city: intent.locations[0]?.city,
      state: intent.locations[0]?.state,
      country: intent.locations[0]?.country,
      sourceEvidence: [
        {
          connectorKey: "mock-mode",
          sourceName: "mock-mode",
          url: `https://${slugBase}-one.example`,
          confidence: 100,
          notes: "Generated only because LEAD_AI_ENABLE_MOCK_DATA is enabled."
        }
      ],
      notes: [`Mock-mode lead for ${industry} in ${location}`]
    },
    {
      companyName: `${industry} Growth Group`,
      website: `https://${slugBase}-growth.example`,
      domain: `${slugBase}-growth.example`,
      businessEmail: `contact@${slugBase}-growth.example`,
      businessPhone: "+1 555 010 1001",
      industry,
      city: intent.locations[0]?.city,
      state: intent.locations[0]?.state,
      country: intent.locations[0]?.country,
      sourceEvidence: [
        {
          connectorKey: "mock-mode",
          sourceName: "mock-mode",
          url: `https://${slugBase}-growth.example`,
          confidence: 100,
          notes: "Generated only because LEAD_AI_ENABLE_MOCK_DATA is enabled."
        }
      ]
    },
    {
      companyName: `${industry} Prime Studio`,
      website: `https://${slugBase}-prime.example`,
      domain: `${slugBase}-prime.example`,
      businessEmail: `team@${slugBase}-prime.example`,
      businessPhone: "+1 555 010 1002",
      industry,
      city: intent.locations[0]?.city,
      state: intent.locations[0]?.state,
      country: intent.locations[0]?.country,
      sourceEvidence: [
        {
          connectorKey: "mock-mode",
          sourceName: "mock-mode",
          url: `https://${slugBase}-prime.example`,
          confidence: 100,
          notes: "Generated only because LEAD_AI_ENABLE_MOCK_DATA is enabled."
        }
      ]
    }
  ];
}
