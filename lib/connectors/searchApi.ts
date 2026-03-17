import { env } from "@/lib/env";
import type { ConnectorLeadCandidate } from "@/modules/lead-ai/contracts";
import { canonicalizeDomain, ensureHttps } from "@/modules/lead-ai/helpers";

import {
  buildQueryVariants,
  createSourceEvidence,
  fetchJson,
  hasSearchProvider,
  type LeadConnector
} from "@/lib/connectors/base";

type SerperResponse = {
  organic?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
  }>;
};

type BraveResponse = {
  web?: {
    results?: Array<{
      title?: string;
      url?: string;
      description?: string;
    }>;
  };
};

type SerpApiResponse = {
  organic_results?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
  }>;
};

function titleToCompanyName(title?: string) {
  if (!title) {
    return undefined;
  }

  return title.split(/[|\-–:]/)[0]?.trim() || title.trim();
}

async function runSearch(query: string, limit: number) {
  switch (env.SEARCH_API_PROVIDER) {
    case "serper": {
      return fetchJson<SerperResponse>("search-api", {
        url: env.SEARCH_API_BASE_URL || "https://google.serper.dev/search",
        init: {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": env.SEARCH_API_KEY
          },
          body: JSON.stringify({
            q: query,
            num: limit
          })
        },
        minDelayMs: 350
      }).then((response) => response.organic ?? []);
    }
    case "brave": {
      const url = new URL(
        env.SEARCH_API_BASE_URL || "https://api.search.brave.com/res/v1/web/search"
      );
      url.searchParams.set("q", query);
      url.searchParams.set("count", String(limit));
      return fetchJson<BraveResponse>("search-api", {
        url: url.toString(),
        init: {
          headers: {
            accept: "application/json",
            "x-subscription-token": env.SEARCH_API_KEY
          }
        },
        minDelayMs: 350
      }).then((response) => response.web?.results ?? []);
    }
    case "serpapi": {
      const url = new URL(env.SEARCH_API_BASE_URL || "https://serpapi.com/search.json");
      url.searchParams.set("q", query);
      url.searchParams.set("api_key", env.SEARCH_API_KEY);
      url.searchParams.set("num", String(limit));
      return fetchJson<SerpApiResponse>("search-api", {
        url: url.toString(),
        minDelayMs: 350
      }).then((response) => response.organic_results ?? []);
    }
    default:
      return [];
  }
}

export const searchApiConnector: LeadConnector = {
  key: "search-api",
  displayName: "Search API",
  async search(input) {
    if (!hasSearchProvider()) {
      return [];
    }

    const variants = buildQueryVariants(input.intent).slice(0, 2);
    const records = await Promise.all(
      variants.map((variant) => runSearch(variant || input.query, Math.min(10, input.limit)))
    );

    const mapped = records.flatMap((items, variantIndex) =>
      items.flatMap((item) => {
        const url = "link" in item ? item.link : "url" in item ? item.url : undefined;
        const companyName = titleToCompanyName(item.title);

        if (!url || !companyName) {
          return [];
        }

        const website = ensureHttps(url);
        const domain = canonicalizeDomain(website);

        if (!domain) {
          return [];
        }

        const description =
          "snippet" in item
            ? item.snippet
            : "description" in item
              ? item.description
              : undefined;

        const lead: ConnectorLeadCandidate = {
          companyName,
          website,
          domain,
          sourceEvidence: [
            createSourceEvidence({
              connectorKey: "search-api",
              sourceName: env.SEARCH_API_PROVIDER,
              url,
              field: "website",
              value: website,
              confidence: 68,
              notes: description
            })
          ],
          notes: description ? [description] : undefined
        };

        return variantIndex === 0 ? [lead] : [{ ...lead, sourceNames: [env.SEARCH_API_PROVIDER] }];
      })
    );

    const seen = new Set<string>();
    return mapped.filter((item) => {
      const key = `${item.domain}|${item.companyName.toLowerCase()}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }
};
