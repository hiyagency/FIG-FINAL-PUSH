import { generateStructuredObject } from "@/modules/ai/client";
import type { ParsedSearchIntent } from "@/modules/lead-ai/contracts";
import { unique } from "@/modules/lead-ai/helpers";
import { parsedSearchIntentSchema } from "@/modules/lead-ai/schemas";

const industryPatterns: Array<[RegExp, string]> = [
  [/\bdentists?\b/i, "Dentists"],
  [/\brestaurants?\b/i, "Restaurants"],
  [/\bmanufactur(?:er|ers|ing)\b/i, "Manufacturing companies"],
  [/\breal estate\b/i, "Real estate agencies"],
  [/\bcoaching institutes?\b/i, "Coaching institutes"],
  [/\bhotels?\b/i, "Hotels"],
  [/\bagenc(?:y|ies)\b/i, "Agencies"],
  [/\bsaas\b/i, "SaaS companies"]
];

const servicePatterns: Array<[RegExp, string]> = [
  [/\bwebsite|web site|redesign\b/i, "website"],
  [/\bseo\b/i, "seo"],
  [/\bads?|ppc|paid\b/i, "ads"],
  [/\bcrm\b/i, "crm"],
  [/\bbooking|reservation|ordering\b/i, "booking"],
  [/\bsocial\b/i, "social"],
  [/\bautomation\b/i, "automation"],
  [/\bmobile\b/i, "mobile"]
];

const signalPatterns: Array<[RegExp, string]> = [
  [/\boutdated website|dated website|outdated design\b/i, "outdated_website"],
  [/\bpoor mobile|weak mobile|mobile performance|mobile experience\b/i, "poor_mobile_experience"],
  [/\bweak seo|poor seo|low seo\b/i, "weak_seo"],
  [/\blow social|weak social|no social\b/i, "weak_social_presence"],
  [/\bno website|without website\b/i, "no_website"],
  [/\bbooking funnel|online ordering|reservation\b/i, "missing_booking_funnel"],
  [/\bcrm\b/i, "missing_crm_signal"],
  [/\bcta|lead capture|contact form\b/i, "weak_conversion_path"]
];

const sizePatterns: Array<[RegExp, ParsedSearchIntent["businessSize"]]> = [
  [/\bmicro\b/i, "micro"],
  [/\bsmall to mid\b|\bsmall[-\s]?mid\b/i, "small_to_mid"],
  [/\bsmall\b/i, "small"],
  [/\bmid[-\s]?market\b/i, "mid_market"],
  [/\benterprise\b/i, "enterprise"]
];

const sortPatterns: Array<[RegExp, ParsedSearchIntent["sortBy"]]> = [
  [/\bseo\b/i, "weakest_seo"],
  [/\bmobile\b/i, "weakest_mobile"],
  [/\bclosest match\b/i, "closest_match"],
  [/\bnewest\b/i, "newest_found"]
];

const locationAliases: Record<
  string,
  {
    city?: string;
    state?: string;
    country?: string;
  }
> = {
  indore: { city: "Indore", state: "Madhya Pradesh", country: "India" },
  mumbai: { city: "Mumbai", state: "Maharashtra", country: "India" },
  bhopal: { city: "Bhopal", state: "Madhya Pradesh", country: "India" },
  goa: { state: "Goa", country: "India" },
  gujarat: { state: "Gujarat", country: "India" },
  dubai: { city: "Dubai", country: "United Arab Emirates" }
};

function parseLocation(rawPrompt: string) {
  const lowered = rawPrompt.toLowerCase();

  for (const [alias, value] of Object.entries(locationAliases)) {
    if (lowered.includes(alias)) {
      return value;
    }
  }

  const locationMatch = rawPrompt.match(/\bin\s+([a-zA-Z\s,]+?)(?:\s+(?:with|who|that|for)\b|$)/i);

  if (!locationMatch) {
    return {};
  }

  const parts = locationMatch[1]
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    return { city: parts[0] };
  }

  if (parts.length === 2) {
    return { city: parts[0], country: parts[1] };
  }

  return {
    city: parts[0],
    state: parts[1],
    country: parts[2]
  };
}

function heuristicParsePrompt(rawPrompt: string): ParsedSearchIntent {
  const industries = unique(
    industryPatterns
      .filter(([pattern]) => pattern.test(rawPrompt))
      .map(([, industry]) => industry)
  );

  const serviceNeeds = unique(
    servicePatterns
      .filter(([pattern]) => pattern.test(rawPrompt))
      .map(([, service]) => service)
  );

  const signals = unique(
    signalPatterns
      .filter(([pattern]) => pattern.test(rawPrompt))
      .map(([, signal]) => signal)
  );

  const businessSize =
    sizePatterns.find(([pattern]) => pattern.test(rawPrompt))?.[1] ?? "unknown";

  const sortBy =
    sortPatterns.find(([pattern]) => pattern.test(rawPrompt))?.[1] ?? "highest_opportunity";

  const resultLimitMatch = rawPrompt.match(/\b(\d{1,3})\s+(?:results|leads|companies)\b/i);
  const location = parseLocation(rawPrompt);

  return parsedSearchIntentSchema.parse({
    rawPrompt,
    industries,
    subIndustries: [],
    serviceNeeds,
    locations: Object.keys(location).length > 0 ? [location] : [],
    businessSize,
    signals,
    contactPreferences: ["business_email", "business_phone"],
    constraints: {
      websitePresence: /without website|no website/i.test(rawPrompt)
        ? "missing_only"
        : /with website|only leads with website/i.test(rawPrompt)
          ? "required"
          : "any",
      minRating: undefined,
      maxRating: undefined,
      employeeSize: undefined,
      mustHaveEmail: /must have email|with email/i.test(rawPrompt),
      mustHavePhone: /must have phone|with phone/i.test(rawPrompt),
      hasWeakSeo: /weak seo|poor seo/i.test(rawPrompt) || undefined,
      hasPoorMobileUx: /poor mobile|mobile performance|mobile experience/i.test(rawPrompt) || undefined,
      hasOutdatedBranding: /outdated branding|dated website|outdated website/i.test(rawPrompt) || undefined,
      hasNoSocialLinks: /no social/i.test(rawPrompt) || undefined,
      onlyDomains: [],
      excludeDomains: [],
      excludeDuplicates: true,
      language: undefined
    },
    resultLimit: resultLimitMatch ? Number(resultLimitMatch[1]) : 100,
    sortBy
  });
}

function normalizeIntent(intent: ParsedSearchIntent): ParsedSearchIntent {
  return parsedSearchIntentSchema.parse({
    ...intent,
    industries: unique(intent.industries),
    subIndustries: unique(intent.subIndustries),
    serviceNeeds: unique(intent.serviceNeeds),
    signals: unique(intent.signals),
    contactPreferences: unique(intent.contactPreferences),
    locations: intent.locations.length ? intent.locations : [{}],
    constraints: {
      ...intent.constraints,
      onlyDomains: unique(intent.constraints.onlyDomains ?? []),
      excludeDomains: unique(intent.constraints.excludeDomains ?? [])
    }
  });
}

export async function parsePromptToIntent(input: {
  rawPrompt: string;
  overrides?: Partial<ParsedSearchIntent>;
}) {
  const heuristic = heuristicParsePrompt(input.rawPrompt);

  const aiResult = await generateStructuredObject({
    schema: parsedSearchIntentSchema,
    system: [
      "You parse B2B prospecting prompts into strict JSON for a compliant lead discovery system.",
      "Only use public-business-source intent. Never infer private data or personal contact details.",
      "Return JSON that matches the schema exactly.",
      "Use short normalized signal keys such as outdated_website, poor_mobile_experience, weak_seo, weak_social_presence, missing_booking_funnel, missing_crm_signal."
    ].join(" "),
    user: JSON.stringify({
      rawPrompt: input.rawPrompt,
      heuristic
    })
  }).catch(() => null);

  return normalizeIntent({
    ...heuristic,
    ...(aiResult ?? {}),
    ...(input.overrides ?? {})
  });
}
