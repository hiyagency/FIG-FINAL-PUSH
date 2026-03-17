import type { ExportFormat } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { ParsedSearchIntent, SearchProgressSnapshot } from "@/modules/lead-ai/contracts";
import { slugify } from "@/modules/lead-ai/helpers";
import { parsePromptToIntent } from "@/modules/lead-ai/prompt-parser";
import { enqueueExport, enqueueSearch } from "@/modules/lead-ai/runtime";

export async function getDashboardData(userId: string) {
  const [searches, campaigns, lists, exports, leadCount] = await Promise.all([
    prisma.search.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        _count: {
          select: {
            searchLeads: true
          }
        }
      }
    }),
    prisma.campaign.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: {
        _count: {
          select: {
            leads: true
          }
        }
      }
    }),
    prisma.leadList.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: {
        _count: {
          select: {
            leads: true
          }
        }
      }
    }),
    prisma.export.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.searchLead.count({
      where: {
        search: {
          userId
        }
      }
    })
  ]);

  return {
    leadCount,
    searches,
    campaigns,
    lists,
    exports
  };
}

export async function parseSearchIntent(rawPrompt: string, overrides?: Partial<ParsedSearchIntent>) {
  return parsePromptToIntent({ rawPrompt, overrides });
}

export async function createSearch(
  userId: string,
  input: {
    rawPrompt: string;
    intent?: ParsedSearchIntent;
  }
) {
  const intent = input.intent ?? (await parsePromptToIntent({ rawPrompt: input.rawPrompt }));

  const search = await prisma.search.create({
    data: {
      userId,
      rawPrompt: input.rawPrompt,
      name: intent.industries[0]
        ? `${intent.industries[0]} ${intent.locations[0]?.city || intent.locations[0]?.country || ""}`.trim()
        : "Lead search",
      status: "QUEUED",
      resultLimit: intent.resultLimit,
      sortBy: intent.sortBy,
      progressPercent: 4,
      currentMessage: "Queued for parsing and connector fan-out.",
      parsedQuery: {
        create: {
          rawJson: intent,
          industries: intent.industries,
          serviceNeeds: intent.serviceNeeds,
          businessSize: intent.businessSize,
          contactPreferences: intent.contactPreferences,
          signals: intent.signals,
          constraints: intent.constraints,
          locationCountry: intent.locations[0]?.country,
          locationState: intent.locations[0]?.state,
          locationCity: intent.locations[0]?.city,
          approved: true
        }
      },
      jobs: {
        create: [
          {
            stage: "PARSE",
            status: "QUEUED",
            progress: 0,
            message: "Queued"
          }
        ]
      }
    }
  });

  await enqueueSearch(search.id);
  return search;
}

export async function getSearchDetail(userId: string, searchId: string) {
  return prisma.search.findFirst({
    where: {
      id: searchId,
      userId
    },
    include: {
      parsedQuery: true,
      jobs: {
        orderBy: [{ updatedAt: "desc" }]
      },
      searchLeads: {
        orderBy: {
          rank: "asc"
        },
        include: {
          lead: {
            include: {
              leadSources: true,
              leadScores: {
                where: {
                  searchId
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function getSearchProgress(
  userId: string,
  searchId: string
): Promise<SearchProgressSnapshot | null> {
  const search = await prisma.search.findFirst({
    where: {
      id: searchId,
      userId
    },
    include: {
      jobs: {
        orderBy: {
          updatedAt: "desc"
        }
      }
    }
  });

  if (!search) {
    return null;
  }

  return {
    id: search.id,
    status: search.status,
    progressPercent: search.progressPercent,
    currentMessage: search.currentMessage,
    summary: (search.summary as Record<string, unknown> | null) ?? null,
    jobs: search.jobs.map((job) => ({
      id: job.id,
      stage: job.stage,
      status: job.status,
      progress: job.progress,
      message: job.message,
      connectorKey: job.connectorKey,
      updatedAt: job.updatedAt.toISOString()
    }))
  };
}

export async function getLeadDetail(userId: string, leadId: string) {
  return prisma.lead.findFirst({
    where: {
      id: leadId,
      searchLeads: {
        some: {
          search: {
            userId
          }
        }
      }
    },
    include: {
      leadSources: true,
      searchLeads: {
        include: {
          search: true
        }
      },
      campaignLeads: {
        include: {
          campaign: true
        }
      },
      leadListLeads: {
        include: {
          list: true
        }
      }
    }
  });
}

export async function createCampaign(
  userId: string,
  input: {
    name: string;
    description?: string;
    leadIds?: string[];
    searchId?: string;
  }
) {
  return prisma.campaign.create({
    data: {
      userId,
      name: input.name,
      slug: slugify(input.name),
      description: input.description,
      leads: input.leadIds?.length
        ? {
            create: input.leadIds.map((leadId) => ({
              leadId,
              addedBySearchId: input.searchId
            }))
          }
        : undefined
    }
  });
}

export async function createLeadList(
  userId: string,
  input: {
    name: string;
    description?: string;
    leadIds?: string[];
    searchId?: string;
  }
) {
  return prisma.leadList.create({
    data: {
      userId,
      name: input.name,
      slug: slugify(input.name),
      description: input.description,
      leads: input.leadIds?.length
        ? {
            create: input.leadIds.map((leadId) => ({
              leadId,
              searchId: input.searchId
            }))
          }
        : undefined
    }
  });
}

export async function getCampaignsData(userId: string) {
  return prisma.campaign.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      leads: {
        include: {
          lead: true
        }
      }
    }
  });
}

export async function getSettingsData(userId: string) {
  const settings = await prisma.leadSettings.findUnique({
    where: { userId }
  });

  return (
    settings ??
    prisma.leadSettings.create({
      data: {
        userId,
        connectorToggles: {
          searchApi: true,
          googlePlaces: true,
          publicWeb: true,
          companyWebsite: true
        },
        complianceText:
          "Lead.ai only uses publicly available business information or user-provided imports.",
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
    })
  );
}

export async function updateSettingsData(
  userId: string,
  input: {
    connectorToggles: Record<string, boolean>;
    enrichmentDepth: string;
    complianceText: string;
    dedupeSettings: Record<string, boolean>;
    exportDefaults: Record<string, string | boolean>;
  }
) {
  return prisma.leadSettings.upsert({
    where: { userId },
    update: input,
    create: {
      userId,
      ...input
    }
  });
}

export async function createExportRecord(
  userId: string,
  input: {
    format: ExportFormat;
    searchId?: string;
    campaignId?: string;
    listId?: string;
    fileName: string;
  }
) {
  const exportRecord = await prisma.export.create({
    data: {
      userId,
      searchId: input.searchId,
      campaignId: input.campaignId,
      listId: input.listId,
      format: input.format,
      fileName: input.fileName
    }
  });

  await enqueueExport(exportRecord.id);
  return exportRecord;
}

export async function getExportRecord(userId: string, exportId: string) {
  return prisma.export.findFirst({
    where: {
      id: exportId,
      userId
    }
  });
}
