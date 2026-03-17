import Link from "next/link";
import { ArrowRight, Download, FolderKanban, Search, Settings } from "lucide-react";

import { MetricCard } from "@/components/lead-ai/metric-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { getDashboardData } from "@/modules/lead-ai/service";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  const data = await getDashboardData(session!.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(35,192,255,0.12),transparent_35%),linear-gradient(180deg,#07111f_0%,#09182c_100%)] p-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Dashboard</p>
          <h2 className="mt-3 text-4xl font-display text-white">Prospecting workspace</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Launch new searches, review ranked lead lists, save campaign segments, and export public-source research packages.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/search">
            Run a new search
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Leads" value={String(data.leadCount)} hint="Across all saved searches" />
        <MetricCard label="Searches" value={String(data.searches.length)} hint="Recent discovery runs" />
        <MetricCard
          label="Campaigns"
          value={String(data.campaigns.length)}
          hint="Saved outreach segments"
        />
        <MetricCard label="Exports" value={String(data.exports.length)} hint="Recent export jobs" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.66fr_0.34fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recent searches</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">What you searched recently</h3>
            </div>
            <Button asChild variant="secondary">
              <Link href="/app/search">
                <Search className="mr-2 h-4 w-4" />
                New
              </Link>
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {data.searches.map((search) => (
              <Link
                key={search.id}
                href={`/app/searches/${search.id}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{search.name || "Lead search"}</p>
                    <p className="mt-1 text-sm text-slate-400">{search.rawPrompt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-200">{search.status}</p>
                    <p className="mt-1 text-xs text-slate-500">{search._count.searchLeads} leads</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-cyan-300" />
              <h3 className="text-xl font-semibold text-white">Campaigns</h3>
            </div>
            <div className="mt-4 space-y-3">
              {data.campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="font-medium text-white">{campaign.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{campaign._count.leads} assigned leads</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid gap-3">
              <Button asChild variant="secondary">
                <Link href="/app/campaigns">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Open campaigns
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/app/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/app/search">
                  <Download className="mr-2 h-4 w-4" />
                  Start export-ready search
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
