import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";

declare global {
  var __s3__: S3Client | undefined;
}

export const storageClient =
  global.__s3__ ??
  new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY
    }
  });

if (process.env.NODE_ENV !== "production") {
  global.__s3__ = storageClient;
}

export async function createUploadUrl(input: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: input.key,
    ContentType: input.contentType
  });

  return getSignedUrl(storageClient, command, {
    expiresIn: input.expiresIn ?? 900
  });
}

export function getObjectUrl(key: string) {
  const base = env.S3_ENDPOINT.replace(/\/$/, "");
  return env.S3_FORCE_PATH_STYLE
    ? `${base}/${env.S3_BUCKET}/${key}`
    : `${base.replace("://", `://${env.S3_BUCKET}.`)}/${key}`;
}
