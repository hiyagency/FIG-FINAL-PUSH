import { WorkspaceRole, WorkspaceType } from "@prisma/client";
import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and URL-safe."),
  description: z.string().max(240).optional(),
  type: z.nativeEnum(WorkspaceType).default(WorkspaceType.TEAM),
  role: z.nativeEnum(WorkspaceRole).default(WorkspaceRole.OWNER)
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
