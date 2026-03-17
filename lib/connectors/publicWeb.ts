import { ensureHttps } from "@/modules/lead-ai/helpers";
import { auditWebsite } from "@/modules/lead-ai/website-audit";

import { type LeadConnector } from "@/lib/connectors/base";

export const publicWebConnector: LeadConnector = {
  key: "public-web",
  displayName: "Public web enrichment",
  async enrich(input) {
    const website = ensureHttps(input.candidate.website || input.candidate.domain);

    if (!website) {
      return null;
    }

    const audit = await auditWebsite(website).catch(() => null);

    if (!audit) {
      return null;
    }

    return {
      candidate: {
        website: audit.finalUrl || website,
        sourceUrls: audit.sourceEvidence.map((item) => item.url),
        sourceNames: audit.sourceEvidence.map((item) => item.sourceName),
        socialLinks: audit.socialLinks
      },
      evidence: audit.sourceEvidence,
      signals: audit.signals,
      audit
    };
  }
};
