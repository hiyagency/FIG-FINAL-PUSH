import { env } from "@/lib/env";
import type { ConnectorLeadCandidate } from "@/modules/lead-ai/contracts";
import { canonicalizeDomain, titleCase } from "@/modules/lead-ai/helpers";

import { createSourceEvidence, fetchJson, type LeadConnector } from "@/lib/connectors/base";

type GoogleTextSearchResponse = {
  results?: Array<{
    name?: string;
    formatted_address?: string;
    rating?: number;
    business_status?: string;
    place_id?: string;
    types?: string[];
  }>;
};

type GooglePlaceDetailsResponse = {
  result?: {
    website?: string;
    formatted_phone_number?: string;
    rating?: number;
    name?: string;
    formatted_address?: string;
    types?: string[];
  };
};

async function getPlaceDetails(placeId: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set(
    "fields",
    "name,formatted_address,website,formatted_phone_number,rating,types"
  );
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("key", env.GOOGLE_MAPS_API_KEY);

  return fetchJson<GooglePlaceDetailsResponse>("directory-a", {
    url: url.toString(),
    minDelayMs: 300
  }).then((response) => response.result);
}

export const directoryAConnector: LeadConnector = {
  key: "directory-a",
  displayName: "Google Places API",
  async search(input) {
    if (!env.GOOGLE_MAPS_API_KEY) {
      return [];
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    url.searchParams.set("query", input.query);
    url.searchParams.set("key", env.GOOGLE_MAPS_API_KEY);

    const response = await fetchJson<GoogleTextSearchResponse>("directory-a", {
      url: url.toString(),
      minDelayMs: 300
    });

    const results = response.results?.slice(0, input.limit) ?? [];
    const details = await Promise.all(
      results
        .filter((result) => Boolean(result.place_id))
        .slice(0, Math.min(results.length, 8))
        .map((result) => getPlaceDetails(result.place_id!))
    );

    return results.map((result, index) => {
      const detail = details[index];
      const website = detail?.website;
      const domain = canonicalizeDomain(website);
      const locationLabel = result.formatted_address?.split(",").map((part) => part.trim()) ?? [];

      const lead: ConnectorLeadCandidate = {
        companyName: titleCase(detail?.name || result.name || "Unknown business")!,
        website,
        domain,
        businessPhone: detail?.formatted_phone_number,
        googleRating: detail?.rating || result.rating,
        industry: result.types?.[0]?.replaceAll("_", " "),
        address: detail?.formatted_address || result.formatted_address,
        city: locationLabel.at(-3),
        state: locationLabel.at(-2),
        country: locationLabel.at(-1),
        sourceEvidence: [
          createSourceEvidence({
            connectorKey: "directory-a",
            sourceName: "google-places",
            url: website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name || "")}`,
            field: "company_name",
            value: result.name,
            confidence: 74
          })
        ]
      };

      return lead;
    });
  }
};
