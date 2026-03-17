import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { getCampaignsData, getDashboardData } from "@/modules/lead-ai/service";

export default async function CampaignsPage() {
  const session = await getServerAuthSession();
  const [campaigns, dashboard] = await Promise.all([
    getCampaignsData(session!.user.id),
    getDashboardData(session!.user.id)
  ]);

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Campaigns</p>
        <h2 className="mt-3 text-4xl font-display text-white">Saved lists and assigned leads</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Group leads into named campaigns, track export status, and keep prospecting segments organized by offer or market.
        </p>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[0.66fr_0.34fr]">
        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-white">Campaigns</h3>
          <div className="mt-5 space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{campaign.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{campaign.description || "No description yet."}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-200">{campaign.status}</p>
                    <p className="mt-1 text-xs text-slate-500">{campaign.leads.length} leads</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white">Recent exports</h3>
          <div className="mt-4 space-y-3">
            {dashboard.exports.map((exportJob) => (
              <div key={exportJob.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-sm font-medium text-white">{exportJob.fileName}</p>
                <p className="mt-1 text-xs text-slate-400">{exportJob.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
