import { URL } from "node:url";

import type { ParsedSearchIntent, SearchLocation } from "@/modules/lead-ai/contracts";

const personalEmailProviders = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "aol.com"
]);

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function normalizeCompanyName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(private|pvt|limited|ltd|llp|llc|inc|corp|company|co)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalizeDomain(input?: string | null) {
  if (!input) {
    return undefined;
  }

  try {
    const url = input.startsWith("http") ? new URL(input) : new URL(`https://${input}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return input.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]?.toLowerCase();
  }
}

export function ensureHttps(input?: string | null) {
  if (!input) {
    return undefined;
  }

  return /^https?:\/\//i.test(input) ? input : `https://${input}`;
}

export function unique<T>(values: T[]) {
  return [...new Set(values.filter(Boolean) as T[])];
}

export function uniqueObjectsBy<T>(items: T[], keyFn: (item: T) => string) {
  const map = new Map<string, T>();

  for (const item of items) {
    const key = keyFn(item);

    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return [...map.values()];
}

export function titleCase(input?: string | null) {
  if (!input) {
    return undefined;
  }

  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function normalizePhone(input?: string | null) {
  if (!input) {
    return undefined;
  }

  const digits = input.replace(/[^\d+]/g, "");
  return digits.length >= 8 ? digits : undefined;
}

export function sanitizeBusinessEmail(input?: string | null, websiteOrDomain?: string | null) {
  if (!input) {
    return undefined;
  }

  const normalized = input.trim().toLowerCase();
  const [, domain] = normalized.split("@");

  if (!domain) {
    return undefined;
  }

  const companyDomain = canonicalizeDomain(websiteOrDomain);

  if (personalEmailProviders.has(domain) && domain !== companyDomain) {
    return undefined;
  }

  return normalized;
}

export function locationLabel(location?: SearchLocation) {
  if (!location) {
    return "Global";
  }

  return [location.city, location.state, location.country].filter(Boolean).join(", ") || "Global";
}

export function buildIntentSummary(intent: ParsedSearchIntent) {
  const location = locationLabel(intent.locations[0]);
  const industry = intent.industries[0] || "businesses";
  return `${industry} in ${location}`;
}

export async function runWithConcurrency<T, TResult>(
  items: T[],
  limit: number,
  handler: (item: T, index: number) => Promise<TResult>
) {
  const results: TResult[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await handler(items[index]!, index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(limit, items.length || 1)) }, () => worker())
  );

  return results;
}

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function trimText(input?: string | null, maxLength = 280) {
  if (!input) {
    return undefined;
  }

  return input.length <= maxLength ? input : `${input.slice(0, maxLength - 1).trimEnd()}…`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
