import { env } from "@/lib/env";
import type {
  ConnectorLeadCandidate,
  ContactRecord,
  LeadSignalSet,
  ParsedSearchIntent,
  SearchLocation,
  SourceEvidence,
  WebsiteAuditResult
} from "@/modules/lead-ai/contracts";
import { canonicalizeDomain, ensureHttps, sleep } from "@/modules/lead-ai/helpers";

export type ConnectorSearchInput = {
  query: string;
  intent: ParsedSearchIntent;
  location?: SearchLocation;
  limit: number;
};

export type ConnectorEnrichInput = {
  candidate: ConnectorLeadCandidate;
  intent: ParsedSearchIntent;
};

export type ConnectorEnrichmentResult = {
  candidate: Partial<ConnectorLeadCandidate>;
  evidence: SourceEvidence[];
  signals?: Partial<LeadSignalSet>;
  audit?: WebsiteAuditResult;
  contacts?: ContactRecord;
};

export interface LeadConnector {
  key: string;
  displayName: string;
  minDelayMs?: number;
  search?(input: ConnectorSearchInput): Promise<ConnectorLeadCandidate[]>;
  enrich?(input: ConnectorEnrichInput): Promise<ConnectorEnrichmentResult | null>;
}

const lastCallByConnector = new Map<string, number>();

export async function waitForRateLimit(key: string, minDelayMs = 400) {
  const previous = lastCallByConnector.get(key) ?? 0;
  const elapsed = Date.now() - previous;

  if (elapsed < minDelayMs) {
    await sleep(minDelayMs - elapsed);
  }

  lastCallByConnector.set(key, Date.now());
}

export async function fetchJson<T>(
  connectorKey: string,
  input: {
    url: string;
    init?: RequestInit;
    minDelayMs?: number;
  }
) {
  await waitForRateLimit(connectorKey, input.minDelayMs);
  const response = await fetch(input.url, input.init);

  if (!response.ok) {
    throw new Error(`${connectorKey} request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export function buildQueryVariants(intent: ParsedSearchIntent) {
  const location = [intent.locations[0]?.city, intent.locations[0]?.state, intent.locations[0]?.country]
    .filter(Boolean)
    .join(", ");
  const industry = intent.industries[0] || "businesses";
  const signalHints = intent.signals
    .slice(0, 2)
    .map((signal) => signal.replaceAll("_", " "))
    .join(" ");

  return [
    `${industry} ${location} official website`,
    `${industry} ${location} public business listing`,
    `${industry} ${location} ${signalHints}`.trim()
  ].filter(Boolean);
}

export function createSourceEvidence(input: {
  connectorKey: string;
  sourceName: string;
  url: string;
  field?: string;
  value?: string;
  confidence?: number;
  notes?: string;
}): SourceEvidence {
  return {
    connectorKey: input.connectorKey,
    sourceName: input.sourceName,
    url: input.url,
    field: input.field,
    value: input.value,
    confidence: input.confidence ?? 70,
    notes: input.notes
  };
}

export function deriveWebsiteFields(rawUrl?: string | null) {
  const website = ensureHttps(rawUrl);
  const domain = canonicalizeDomain(website);

  return {
    website,
    domain
  };
}

export function hasSearchProvider() {
  return env.SEARCH_API_PROVIDER !== "none" && Boolean(env.SEARCH_API_KEY);
}
