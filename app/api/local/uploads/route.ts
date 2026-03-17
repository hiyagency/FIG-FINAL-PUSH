import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";

import {
  LOCAL_UPLOADS_DIR,
  registerUploadedAssets
} from "@/modules/local-studio/store";

function sanitizeFileName(fileName: string) {
  const clean = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
  return clean.replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No files were attached." },
      { status: 400 }
    );
  }

  await mkdir(LOCAL_UPLOADS_DIR, { recursive: true });

  const uploaded = [];

  for (const file of files) {
    const sanitized = sanitizeFileName(file.name);
    const extension = extname(sanitized);
    const storedName = `${createId()}${extension || ""}-${sanitized}`;
    const targetPath = join(LOCAL_UPLOADS_DIR, storedName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);
    uploaded.push({
      originalName: file.name,
      storedName,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size
    });
  }

  const state = await registerUploadedAssets(uploaded);

  return NextResponse.json({
    uploaded: uploaded.length,
    uploads: state.uploads.slice(0, uploaded.length)
  });
}
