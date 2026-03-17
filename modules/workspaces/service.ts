import { WorkspaceRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { hasRequiredRole } from "@/modules/common/rbac";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput
} from "@/modules/workspaces/schemas";

export async function createWorkspace(userId: string, input: CreateWorkspaceInput) {
  const data = createWorkspaceSchema.parse(input);

  return prisma.workspace.create({
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      type: data.type,
      ownerUserId: userId,
      members: {
        create: {
          userId,
          role: data.role
        }
      }
    },
    include: {
      members: true
    }
  });
}

export async function listUserWorkspaces(userId: string) {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
          status: "ACTIVE"
        }
      }
    },
    include: {
      members: {
        where: { userId },
        take: 1
      },
      brands: {
        take: 3
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function requireWorkspace(slug: string, userId: string, minimumRole = WorkspaceRole.VIEWER) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId },
        take: 1
      },
      brands: {
        include: {
          dnaProfile: true
        }
      }
    }
  });

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const membership = workspace.members[0];

  if (!membership || !hasRequiredRole(membership.role, minimumRole)) {
    throw new Error("You do not have access to this workspace.");
  }

  return {
    workspace,
    membership
  };
}
