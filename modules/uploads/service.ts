import { AssetSource, AssetStatus } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

import { prisma } from "@/lib/db";
import { createUploadUrl } from "@/lib/storage";
import {
  requestUploadSchema,
  type RequestUploadInput
} from "@/modules/uploads/schemas";

export async function createUploadReservation(input: RequestUploadInput) {
  const data = requestUploadSchema.parse(input);
  const assetId = createId();
  const storageKey = `workspace/${data.workspaceId}/assets/${assetId}/${data.fileName}`;

  const asset = await prisma.asset.create({
    data: {
      id: assetId,
      workspaceId: data.workspaceId,
      brandId: data.brandId,
      createdById: data.createdById,
      kind: data.kind,
      source: AssetSource.USER_UPLOAD,
      status: AssetStatus.UPLOADING,
      fileName: data.fileName,
      mimeType: data.mimeType,
      sizeBytes: BigInt(data.sizeBytes),
      storageKey
    }
  });

  if (data.kind === "RAW_VIDEO") {
    await prisma.mediaFile.create({
      data: {
        assetId: asset.id,
        ingestStatus: AssetStatus.UPLOADING
      }
    });
  }

  const uploadUrl = await createUploadUrl({
    key: storageKey,
    contentType: data.mimeType
  });

  return {
    assetId: asset.id,
    storageKey,
    uploadUrl
  };
}
