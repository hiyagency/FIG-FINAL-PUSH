import { notFound } from "next/navigation";

import { ResultsTable } from "@/components/lead-ai/results-table";
import { getServerAuthSession } from "@/lib/auth";
import { getSearchDetail } from "@/modules/lead-ai/service";

export default async function SearchResultsPage({
  params
}: {
  params: Promise<{ searchId: string }>;
}) {
  const session = await getServerAuthSession();
  const { searchId } = await params;
  const search = await getSearchDetail(session!.user.id, searchId);

  if (!search) {
    notFound();
  }

  return (
    <ResultsTable
      searchId={searchId}
      initialData={{
        id: search.id,
        status: search.status,
        progressPercent: search.progressPercent,
        currentMessage: search.currentMessage,
        summary: (search.summary as Record<string, unknown> | null) ?? null,
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
      }}
    />
  );
}
