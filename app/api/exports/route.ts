import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { createExportRecord, getExportRecord } from "@/modules/lead-ai/service";

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    searchId?: string;
    campaignId?: string;
    listId?: string;
    format?: "CSV" | "XLSX";
  };

  if (!body.format) {
    return NextResponse.json({ error: "format is required" }, { status: 400 });
  }

  const exportRecord = await createExportRecord(session.user.id, {
    format: body.format,
    searchId: body.searchId,
    campaignId: body.campaignId,
    listId: body.listId,
    fileName: `lead-ai-export-${Date.now()}.${body.format.toLowerCase()}`
  });

  const latest = await getExportRecord(session.user.id, exportRecord.id);

  return NextResponse.json({
    exportId: exportRecord.id,
    status: latest?.status ?? exportRecord.status
  });
}
