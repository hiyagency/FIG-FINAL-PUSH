import { load } from "cheerio";

import type { LeadSignalSet, WebsiteAuditResult } from "@/modules/lead-ai/contracts";
import { clampScore, ensureHttps } from "@/modules/lead-ai/helpers";

const socialNetworks = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "youtube.com"
];

const ctaPatterns = /(book|reserve|schedule|contact|quote|demo|start|consultation|enquire)/i;

export async function auditWebsite(website?: string | null): Promise<WebsiteAuditResult> {
  const normalized = ensureHttps(website);

  if (!normalized) {
    return {
      websiteExists: false,
      headings: [],
      socialLinks: {},
      painPoints: ["No website detected"],
      sourceEvidence: [],
      signals: {
        adActivitySignal: false,
        crmSignal: false,
        bookingSignal: false,
        outdatedWebsiteSignal: true,
        noWebsiteSignal: true,
        weakSocialPresenceSignal: true,
        websiteQualityScore: 0,
        mobileFriendlinessScore: 0,
        seoScore: 0,
        brandingScore: 0,
        speedScore: 0
      }
    };
  }

  const startedAt = Date.now();
  const response = await fetch(normalized, {
    headers: {
      "user-agent": "Lead.ai/1.0 (+https://lead.ai)"
    }
  }).catch(() => null);

  if (!response?.ok) {
    return {
      websiteExists: false,
      finalUrl: normalized,
      headings: [],
      socialLinks: {},
      painPoints: ["Website could not be reached"],
      sourceEvidence: [],
      signals: {
        adActivitySignal: false,
        crmSignal: false,
        bookingSignal: false,
        outdatedWebsiteSignal: true,
        noWebsiteSignal: true,
        weakSocialPresenceSignal: true,
        websiteQualityScore: 12,
        mobileFriendlinessScore: 10,
        seoScore: 10,
        brandingScore: 15,
        speedScore: 10
      }
    };
  }

  const html = await response.text();
  const responseTime = Date.now() - startedAt;
  const $ = load(html);
  const title = $("title").first().text().trim() || undefined;
  const metaDescription = $("meta[name='description']").attr("content")?.trim() || undefined;
  const headings = $("h1, h2")
    .slice(0, 6)
    .map((_, element) => $(element).text().trim())
    .get()
    .filter(Boolean);
  const hasViewportTag = Boolean($("meta[name='viewport']").attr("content"));
  const hasH1 = Boolean($("h1").first().text().trim());
  const hasSchemaHints = $("script[type='application/ld+json']").length > 0;
  const hasForm = $("form").length > 0;
  const hasContactPage =
    $("a[href*='contact'], a[href*='about'], a[href*='book'], a[href*='appointment']").length > 0;
  const hasMapEmbed = $("iframe[src*='maps.google']").length > 0;
  const hasCta = $("a, button")
    .toArray()
    .some((element) => ctaPatterns.test($(element).text()));
  const socialLinks = Object.fromEntries(
    socialNetworks
      .map((network) => {
        const href = $(`a[href*='${network}']`).first().attr("href");
        return href ? [network.split(".")[0]!, href] : null;
      })
      .filter(Boolean) as Array<[string, string]>
  );
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const textLength = text.length;
  const bookingSignal = /book|reserve|appointment|order online/i.test(text);
  const crmSignal = /hubspot|salesforce|zoho|freshsales|pipedrive|intercom|calendly/i.test(html);
  const adActivitySignal = /gtag|googleads|fbq|googletagmanager/i.test(html);
  const weakSocialPresenceSignal = Object.keys(socialLinks).length === 0;
  const outdatedWebsiteSignal =
    !hasViewportTag ||
    !hasCta ||
    textLength < 1300 ||
    (!metaDescription && !hasSchemaHints);

  const mobileFriendlinessScore = clampScore(
    (hasViewportTag ? 55 : 10) + (hasCta ? 20 : 0) + (hasForm ? 10 : 0) + (hasMapEmbed ? 5 : 0)
  );
  const seoScore = clampScore(
    (title ? 30 : 0) +
      (metaDescription ? 20 : 0) +
      (hasH1 ? 15 : 0) +
      (hasSchemaHints ? 15 : 0) +
      (textLength > 1800 ? 20 : textLength > 900 ? 10 : 0)
  );
  const brandingScore = clampScore(
    (textLength > 1600 ? 30 : 15) + (Object.keys(socialLinks).length > 0 ? 15 : 0) + (hasCta ? 20 : 0)
  );
  const speedScore = clampScore(100 - responseTime / 40 - html.length / 6000);
  const websiteQualityScore = clampScore(
    mobileFriendlinessScore * 0.28 +
      seoScore * 0.32 +
      brandingScore * 0.2 +
      speedScore * 0.2
  );

  const signals: LeadSignalSet = {
    websiteQualityScore,
    mobileFriendlinessScore,
    seoScore,
    brandingScore,
    speedScore,
    adActivitySignal,
    crmSignal,
    bookingSignal,
    outdatedWebsiteSignal,
    noWebsiteSignal: false,
    weakSocialPresenceSignal,
    sslEnabled: normalized.startsWith("https://"),
    hasViewportTag,
    hasTitleTag: Boolean(title),
    hasMetaDescription: Boolean(metaDescription),
    hasH1,
    hasSchemaHints,
    hasContactPage,
    hasCta,
    hasForm,
    hasMapEmbed
  };

  const painPoints = [
    !hasViewportTag ? "No mobile viewport meta tag" : null,
    !metaDescription ? "Missing meta description" : null,
    !hasH1 ? "No visible H1 heading" : null,
    !hasCta ? "Weak conversion CTA" : null,
    weakSocialPresenceSignal ? "Weak social presence" : null,
    !bookingSignal ? "No obvious booking or lead capture funnel" : null,
    speedScore < 45 ? "Likely slow page experience" : null,
    outdatedWebsiteSignal ? "Outdated design heuristics detected" : null
  ].filter(Boolean) as string[];

  return {
    websiteExists: true,
    finalUrl: response.url,
    title,
    metaDescription,
    headings,
    contactPageUrl:
      $("a[href*='contact']").first().attr("href") ||
      $("a[href*='appointment']").first().attr("href") ||
      undefined,
    socialLinks,
    painPoints,
    sourceEvidence: [
      {
        connectorKey: "company-website",
        sourceName: "official-website",
        url: response.url,
        confidence: 80
      }
    ],
    signals
  };
}
