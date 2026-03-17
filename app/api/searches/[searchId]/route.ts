import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getSearchDetail } from "@/modules/lead-ai/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ searchId: string }> }
) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchId } = await params;
  const search = await getSearchDetail(session.user.id, searchId);

  if (!search) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: search.id,
    status: search.status,
    progressPercent: search.progressPercent,
    currentMessage: search.currentMessage,
    summary: search.summary,
    jobs: search.jobs.map((job) => ({
      id: job.id,
      stage: job.stage,
      status: job.status,
      progress: job.progress,
      message: job.message,
      connectorKey: job.connectorKey,
      updatedAt: job.updatedAt.toISOString()
    })),
    parsedQuery: search.parsedQuery
      ? {
          industries: search.parsedQuery.industries,
          serviceNeeds: search.parsedQuery.serviceNeeds,
          signals: search.parsedQuery.signals,
          locationCity: search.parsedQuery.locationCity,
          locationState: search.parsedQuery.locationState,
          locationCountry: search.parsedQuery.locationCountry
        }
      : null,
    searchLeads: search.searchLeads.map((item) => ({
      rank: item.rank,
      lead: item.lead
    }))
  });
}
