import { promises as fs } from "node:fs";

import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getExportRecord } from "@/modules/lead-ai/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ exportId: string }> }
) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { exportId } = await params;
  const exportRecord = await getExportRecord(session.user.id, exportId);

  if (!exportRecord?.storageKey) {
    return NextResponse.json({ error: "Export not ready" }, { status: 404 });
  }

  const buffer = await fs.readFile(exportRecord.storageKey);

  return new NextResponse(buffer, {
    headers: {
      "content-type":
        exportRecord.format === "XLSX"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${exportRecord.fileName}"`
    }
  });
}
