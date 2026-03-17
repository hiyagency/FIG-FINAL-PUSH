import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { getLeadDetail } from "@/modules/lead-ai/service";

export default async function LeadDetailPage({
  params
}: {
  params: Promise<{ leadId: string }>;
}) {
  const session = await getServerAuthSession();
  const { leadId } = await params;
  const lead = await getLeadDetail(session!.user.id, leadId);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Lead detail</p>
            <h2 className="mt-3 text-4xl font-display text-white">{lead.companyName}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{lead.aiSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lead.painPoints.map((painPoint) => (
                <Badge key={painPoint}>{painPoint}</Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Opportunity</p>
              <p className="mt-2 text-3xl font-semibold text-white">{lead.opportunityScore}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confidence</p>
              <p className="mt-2 text-3xl font-semibold text-white">{lead.confidenceScore}</p>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.66fr_0.34fr]">
        <Card className="p-6">
          <h3 className="text-2xl font-semibold text-white">Company and contact profile</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Contact", lead.contactName || "Public contact not found"],
              ["Role", lead.contactRole || "Role unavailable"],
              ["Email", lead.businessEmail || "No business email found"],
              ["Phone", lead.businessPhone || "No business phone found"],
              ["Website", lead.website || "No website"],
              [
                "Location",
                [lead.city, lead.state, lead.country].filter(Boolean).join(", ") || "Location unavailable"
              ],
              ["Industry", lead.industry || "Unknown"],
              ["Sub-industry", lead.subIndustry || "Unknown"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Outreach angle</p>
            <p className="mt-2 text-sm leading-7 text-cyan-200">{lead.outreachAngle}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Why now</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{lead.whyNow}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white">Website audit</h3>
            <div className="mt-4 space-y-3">
              {[
                ["Website quality", lead.websiteQualityScore],
                ["Mobile friendliness", lead.mobileFriendlinessScore],
                ["SEO", lead.seoScore],
                ["Branding", lead.brandingScore],
                ["Speed", lead.speedScore]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{value ?? "—"}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white">Source links</h3>
            <div className="mt-4 space-y-3">
              {lead.leadSources.map((source) => (
                <a
                  key={source.id}
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                >
                  {source.sourceName}
                </a>
              ))}
            </div>
            <Button asChild variant="secondary" className="mt-4 w-full">
              <Link href="/app/search">Run another search</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
