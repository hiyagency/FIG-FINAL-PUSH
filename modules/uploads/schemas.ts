import { AssetKind } from "@prisma/client";
import { z } from "zod";

export const requestUploadSchema = z.object({
  workspaceId: z.string().min(1),
  brandId: z.string().optional(),
  createdById: z.string().optional(),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  kind: z.nativeEnum(AssetKind)
});

export type RequestUploadInput = z.infer<typeof requestUploadSchema>;
