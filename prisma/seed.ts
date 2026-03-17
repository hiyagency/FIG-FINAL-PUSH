import { hash } from "bcryptjs";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const demoPrompt =
  "Find dentists in Mumbai with outdated websites and weak SEO";

const demoLeads = [
  {
    companyName: "Harbor Dental Care",
    normalizedCompanyName: "harbor dental care",
    industry: "Dental clinics",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    website: "https://harbordental.example",
    domain: "harbordental.example",
    businessEmail: "hello@harbordental.example",
    businessPhone: "+91 22 4000 1100",
    painPoints: ["Weak title tags", "Outdated mobile layout", "No visible booking CTA"],
    aiSummary:
      "Public website shows an aging design system, limited local SEO optimization, and weak conversion cues for appointment booking.",
    outreachAngle:
      "Pitch a high-conversion redesign with appointment funnel optimization and local SEO upgrades.",
    bestOfferToPitch: "Website redesign + local SEO sprint",
    coldOpenerLine:
      "Noticed your clinic appears strong offline, but the online booking path feels harder than it should be on mobile.",
    whyNow: "Competition in local dental search is increasing and conversion friction is visible.",
    priorityLevel: "high",
    sourceNames: ["mock-public-directory", "official-website"],
    sourceUrls: ["https://directory.example/harbor-dental", "https://harbordental.example"],
    sourceCount: 2,
    websiteQualityScore: 42,
    mobileFriendlinessScore: 38,
    seoScore: 36,
    brandingScore: 44,
    speedScore: 51,
    bookingSignal: false,
    outdatedWebsiteSignal: true,
    weakSocialPresenceSignal: true,
    opportunityScore: 91,
    fitScore: 88,
    confidenceScore: 72
  },
  {
    companyName: "Smile District Dental",
    normalizedCompanyName: "smile district dental",
    industry: "Dental clinics",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    website: "https://smiledistrict.example",
    domain: "smiledistrict.example",
    businessEmail: "appointments@smiledistrict.example",
    businessPhone: "+91 22 4000 2211",
    painPoints: ["Thin service pages", "Missing meta descriptions", "Weak visual branding"],
    aiSummary:
      "Public pages exist but under-sell services, lack search intent coverage, and use low-trust branding.",
    outreachAngle:
      "Lead with a trust-focused site refresh and service-page SEO package for higher treatment inquiries.",
    bestOfferToPitch: "Trust-focused website refresh",
    coldOpenerLine:
      "Your clinic already has the right services, but the site does not build as much confidence as your practice likely deserves.",
    whyNow: "Patients often compare clinics quickly on mobile and first-impression trust matters.",
    priorityLevel: "high",
    sourceNames: ["mock-public-directory", "official-website"],
    sourceUrls: ["https://directory.example/smile-district", "https://smiledistrict.example"],
    sourceCount: 2,
    websiteQualityScore: 49,
    mobileFriendlinessScore: 46,
    seoScore: 40,
    brandingScore: 39,
    speedScore: 57,
    crmSignal: false,
    bookingSignal: true,
    outdatedWebsiteSignal: true,
    weakSocialPresenceSignal: false,
    opportunityScore: 86,
    fitScore: 84,
    confidenceScore: 75
  },
  {
    companyName: "Ivory Dental Studio",
    normalizedCompanyName: "ivory dental studio",
    industry: "Dental clinics",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    website: "https://ivorydental.example",
    domain: "ivorydental.example",
    businessEmail: "care@ivorydental.example",
    businessPhone: "+91 22 4000 3344",
    painPoints: ["Slow homepage", "No FAQ/schema hints", "Limited social proof"],
    aiSummary:
      "Public-facing site loads slowly, omits common local SEO trust assets, and has thin conversion support.",
    outreachAngle:
      "Position a technical SEO and CRO improvement plan centered on speed and patient trust signals.",
    bestOfferToPitch: "Technical SEO + CRO refresh",
    coldOpenerLine:
      "I checked your public site and it feels like speed and trust cues are holding back the number of high-intent visitors who convert.",
    whyNow: "Improving speed and trust assets can lift both rankings and inquiry conversion.",
    priorityLevel: "medium",
    sourceNames: ["mock-public-directory", "official-website"],
    sourceUrls: ["https://directory.example/ivory-dental", "https://ivorydental.example"],
    sourceCount: 2,
    websiteQualityScore: 53,
    mobileFriendlinessScore: 52,
    seoScore: 41,
    brandingScore: 58,
    speedScore: 31,
    crmSignal: false,
    bookingSignal: false,
    outdatedWebsiteSignal: true,
    weakSocialPresenceSignal: true,
    opportunityScore: 81,
    fitScore: 82,
    confidenceScore: 69
  }
];

async function seedMockSearch(userId: string) {
  await prisma.export.deleteMany({ where: { userId } });
  await prisma.campaignLead.deleteMany({
    where: {
      campaign: {
        userId
      }
    }
  });
  await prisma.leadListLead.deleteMany({
    where: {
      list: {
        userId
      }
    }
  });
  await prisma.searchLead.deleteMany({
    where: {
      search: {
        userId
      }
    }
  });
  await prisma.leadScore.deleteMany({
    where: {
      search: {
        userId
      }
    }
  });
  await prisma.searchJob.deleteMany({
    where: {
      search: {
        userId
      }
    }
  });
  await prisma.parsedQuery.deleteMany({
    where: {
      search: {
        userId
      }
    }
  });
  await prisma.search.deleteMany({ where: { userId } });
  await prisma.leadSource.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.campaign.deleteMany({ where: { userId } });
  await prisma.leadList.deleteMany({ where: { userId } });

  const search = await prisma.search.create({
    data: {
      userId,
      rawPrompt: demoPrompt,
      name: "Mumbai dentists",
      status: "COMPLETE",
      resultLimit: 50,
      sortBy: "highest_opportunity",
      progressPercent: 100,
      currentMessage: "Discovery completed with mock data.",
      isSaved: true,
      startedAt: new Date(Date.now() - 5 * 60 * 1000),
      completedAt: new Date(),
      summary: {
        totalLeads: demoLeads.length,
        avgOpportunityScore: 86,
        topPainPoints: ["Outdated website", "Weak SEO", "Poor booking funnel"]
      },
      parsedQuery: {
        create: {
          rawJson: {
            industry: "dentists",
            service_need: ["website", "seo"],
            location: {
              country: "India",
              state: "Maharashtra",
              city: "Mumbai"
            },
            business_size: "small_to_mid",
            signals: ["outdated_website", "weak_seo"]
          },
          industries: ["Dentists"],
          serviceNeeds: ["Website redesign", "SEO"],
          businessSize: "small_to_mid",
          contactPreferences: ["business_email", "business_phone"],
          signals: ["outdated_website", "weak_seo", "poor_mobile_experience"],
          locationCountry: "India",
          locationState: "Maharashtra",
          locationCity: "Mumbai",
          approved: true
        }
      },
      jobs: {
        create: [
          {
            stage: "PARSE",
            status: "COMPLETE",
            progress: 100,
            message: "Prompt parsed into structured ICP."
          },
          {
            stage: "SEARCH",
            status: "COMPLETE",
            progress: 100,
            message: "Connector search finished."
          },
          {
            stage: "AUDIT",
            status: "COMPLETE",
            progress: 100,
            message: "Website audit signals generated."
          },
          {
            stage: "SCORE",
            status: "COMPLETE",
            progress: 100,
            message: "Lead opportunity scores finalized."
          }
        ]
      }
    }
  });

  for (const [index, lead] of demoLeads.entries()) {
    const createdLead = await prisma.lead.create({
      data: {
        ...lead,
        socialLinks: {
          linkedin: null,
          instagram: null
        },
        latestAudit: {
          sslEnabled: true,
          viewportTag: false,
          titleTagPresent: true,
          metaDescriptionPresent: false,
          formsPresent: index % 2 === 1
        }
      }
    });

    await prisma.leadSource.createMany({
      data: lead.sourceUrls.map((sourceUrl, sourceIndex) => ({
        leadId: createdLead.id,
        connectorName: sourceIndex === 0 ? "mock-public-directory" : "company-website",
        sourceName: lead.sourceNames[sourceIndex] ?? "mock-source",
        sourceUrl,
        fieldName: sourceIndex === 0 ? "company_name" : "website",
        fieldValue: sourceIndex === 0 ? lead.companyName : lead.website,
        fieldConfidence: sourceIndex === 0 ? 86 : 78
      }))
    });

    await prisma.searchLead.create({
      data: {
        searchId: search.id,
        leadId: createdLead.id,
        rank: index + 1
      }
    });

    await prisma.leadScore.create({
      data: {
        searchId: search.id,
        leadId: createdLead.id,
        opportunityScore: lead.opportunityScore,
        fitScore: lead.fitScore,
        confidenceScore: lead.confidenceScore,
        scoreBreakdown: {
          outdatedWebsite: lead.outdatedWebsiteSignal ? 28 : 0,
          weakSeo: Math.max(0, 100 - (lead.seoScore ?? 0)) / 2,
          mobile: Math.max(0, 100 - (lead.mobileFriendlinessScore ?? 0)) / 3,
          geoFit: 20,
          industryFit: 24
        },
        rationale: lead.aiSummary
      }
    });
  }

  const campaign = await prisma.campaign.create({
    data: {
      userId,
      name: "Mumbai dental outreach",
      slug: "mumbai-dental-outreach",
      description: "High-opportunity dentists for redesign + SEO outreach.",
      status: "ACTIVE",
      tags: ["seo", "web-redesign"]
    }
  });

  const list = await prisma.leadList.create({
    data: {
      userId,
      name: "Pilot leads",
      slug: "pilot-leads",
      description: "Starter lead list for demos."
    }
  });

  const savedLeads = await prisma.searchLead.findMany({
    where: { searchId: search.id },
    include: { lead: true },
    take: 2,
    orderBy: { rank: "asc" }
  });

  for (const item of savedLeads) {
    await prisma.campaignLead.create({
      data: {
        campaignId: campaign.id,
        leadId: item.leadId,
        addedBySearchId: search.id,
        stage: "ready",
        notes: "Seeded from mock search."
      }
    });

    await prisma.leadListLead.create({
      data: {
        listId: list.id,
        leadId: item.leadId,
        searchId: search.id
      }
    });
  }
}

async function main() {
  const passwordHash = await hash(env.LEAD_AI_DEFAULT_USER_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: env.LEAD_AI_DEFAULT_USER_EMAIL.toLowerCase() },
    update: {
      name: "Lead.ai Demo",
      timezone: "Asia/Calcutta"
    },
    create: {
      email: env.LEAD_AI_DEFAULT_USER_EMAIL.toLowerCase(),
      name: "Lead.ai Demo",
      timezone: "Asia/Calcutta",
      passwordCredential: {
        create: {
          passwordHash
        }
      }
    },
    include: {
      passwordCredential: true
    }
  });

  if (!user.passwordCredential) {
    await prisma.passwordCredential.create({
      data: {
        userId: user.id,
        passwordHash
      }
    });
  } else {
    await prisma.passwordCredential.update({
      where: { userId: user.id },
      data: { passwordHash }
    });
  }

  await prisma.leadSettings.upsert({
    where: { userId: user.id },
    update: {
      connectorToggles: {
        searchApi: true,
        googlePlaces: true,
        publicWeb: true,
        companyWebsite: true
      },
      complianceText:
        "Lead.ai only collects public business information or user-imported data. Personal emails, private profiles, and restricted sources are excluded.",
      enrichmentDepth: "standard",
      dedupeSettings: {
        domain: true,
        companyName: true,
        businessPhone: true
      },
      exportDefaults: {
        format: "CSV",
        includeSources: true
      }
    },
    create: {
      userId: user.id,
      connectorToggles: {
        searchApi: true,
        googlePlaces: true,
        publicWeb: true,
        companyWebsite: true
      },
      complianceText:
        "Lead.ai only collects public business information or user-imported data. Personal emails, private profiles, and restricted sources are excluded.",
      enrichmentDepth: "standard",
      dedupeSettings: {
        domain: true,
        companyName: true,
        businessPhone: true
      },
      exportDefaults: {
        format: "CSV",
        includeSources: true
      }
    }
  });

  if (env.LEAD_AI_ENABLE_MOCK_DATA) {
    await seedMockSearch(user.id);
  }

  console.info(`Seeded Lead.ai demo user: ${env.LEAD_AI_DEFAULT_USER_EMAIL}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
