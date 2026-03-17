import { load } from "cheerio";

import type { ContactRecord } from "@/modules/lead-ai/contracts";
import {
  canonicalizeDomain,
  normalizePhone,
  sanitizeBusinessEmail,
  titleCase,
  uniqueObjectsBy
} from "@/modules/lead-ai/helpers";

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phonePattern = /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/g;
const rolePattern = /\b(founder|owner|director|manager|partner|co-founder|principal)\b/i;

export function extractPublicBusinessContacts(input: {
  html: string;
  sourceUrl: string;
  connectorKey?: string;
}) {
  const $ = load(input.html);
  const text = $("body").text();
  const domain = canonicalizeDomain(input.sourceUrl);

  const emails = [...new Set(text.match(emailPattern) ?? [])]
    .map((email) => sanitizeBusinessEmail(email, domain))
    .filter(Boolean) as string[];

  const phones = [...new Set(text.match(phonePattern) ?? [])]
    .map((phone) => normalizePhone(phone))
    .filter(Boolean) as string[];

  const candidates: ContactRecord[] = [];

  const structuredDataMatches = $("script[type='application/ld+json']")
    .map((_, element) => $(element).text())
    .get();

  for (const raw of structuredDataMatches) {
    try {
      const parsed = JSON.parse(raw);
      const records = Array.isArray(parsed) ? parsed : [parsed];

      for (const record of records) {
        if (!record || typeof record !== "object") {
          continue;
        }

        const name = typeof record.name === "string" ? titleCase(record.name) : undefined;
        const role =
          typeof record.jobTitle === "string" && rolePattern.test(record.jobTitle)
            ? titleCase(record.jobTitle)
            : undefined;
        const email =
          typeof record.email === "string" ? sanitizeBusinessEmail(record.email, domain) : undefined;
        const telephone =
          typeof record.telephone === "string" ? normalizePhone(record.telephone) : undefined;

        if (name || role || email || telephone) {
          candidates.push({
            contactName: name,
            contactRole: role,
            businessEmail: email,
            businessPhone: telephone,
            sourceEvidence: [
              {
                connectorKey: input.connectorKey ?? "company-website",
                sourceName: "structured-data",
                url: input.sourceUrl,
                confidence: 78
              }
            ]
          });
        }
      }
    } catch {
      continue;
    }
  }

  if (emails.length || phones.length) {
    candidates.push({
      businessEmail: emails[0],
      businessPhone: phones[0],
      sourceEvidence: [
        {
          connectorKey: input.connectorKey ?? "company-website",
          sourceName: "page-text",
          url: input.sourceUrl,
          confidence: 65
        }
      ]
    });
  }

  const deduped = uniqueObjectsBy(candidates, (candidate) =>
    [
      candidate.contactName,
      candidate.contactRole,
      candidate.businessEmail,
      candidate.businessPhone
    ]
      .filter(Boolean)
      .join("|")
  );

  return deduped[0] ?? { sourceEvidence: [] };
}
