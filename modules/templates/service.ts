import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function listWorkspaceTemplates(workspaceId: string) {
  return prisma.template.findMany({
    where: {
      OR: [{ workspaceId }, { visibility: "INTERNAL" }]
    },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function cloneTemplateFromProject(input: {
  workspaceId: string;
  brandId?: string;
  createdById: string;
  name: string;
  slug: string;
  projectVersionPayload: Record<string, unknown>;
}) {
  const templateData = input.projectVersionPayload as Prisma.InputJsonValue;

  return prisma.template.create({
    data: {
      workspaceId: input.workspaceId,
      brandId: input.brandId,
      createdById: input.createdById,
      name: input.name,
      slug: input.slug,
      visibility: "PRIVATE",
      versions: {
        create: {
          versionNumber: 1,
          data: templateData
        }
      }
    },
    include: {
      versions: true
    }
  });
}
