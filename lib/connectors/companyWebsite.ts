import { extractPublicBusinessContacts } from "@/modules/lead-ai/contact-extractor";
import { ensureHttps } from "@/modules/lead-ai/helpers";

import { type LeadConnector } from "@/lib/connectors/base";

export const companyWebsiteConnector: LeadConnector = {
  key: "company-website",
  displayName: "Company website",
  async enrich(input) {
    const website = ensureHttps(input.candidate.website || input.candidate.domain);

    if (!website) {
      return null;
    }

    const response = await fetch(website, {
      headers: {
        "user-agent": "Lead.ai/1.0 (+https://lead.ai)"
      }
    }).catch(() => null);

    if (!response?.ok) {
      return null;
    }

    const html = await response.text();
    const contacts = extractPublicBusinessContacts({
      html,
      sourceUrl: response.url,
      connectorKey: "company-website"
    });

    return {
      candidate: {
        businessEmail: contacts.businessEmail,
        businessPhone: contacts.businessPhone,
        contactName: contacts.contactName,
        contactRole: contacts.contactRole
      },
      evidence: contacts.sourceEvidence,
      contacts
    };
  }
};
