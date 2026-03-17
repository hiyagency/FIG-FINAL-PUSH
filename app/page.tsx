import Link from "next/link";
import { ArrowRight, BadgeCheck, BrainCircuit, Building2, Globe, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { marketingStats, siteConfig } from "@/lib/site";

const demoPrompts = [
  "Find dentists in Mumbai with outdated websites and weak SEO",
  "Find restaurants in Indore without modern online ordering systems",
  "Find real estate agencies in Dubai with poor mobile website experience",
  "Find coaching institutes in Bhopal that could benefit from CRM automation",
  "Find hotels in Goa with weak direct booking funnel"
];

const features = [
  {
    title: "Natural-language prospecting",
    copy: "Describe your ICP in plain English, then approve the parsed filters before discovery begins.",
    icon: BrainCircuit
  },
  {
    title: "Public-source discovery engine",
    copy: "Fan out across approved APIs, public business listings, official websites, and lawful website analysis.",
    icon: Globe
  },
  {
    title: "Audit-driven lead scoring",
    copy: "Rank prospects by opportunity, fit, and confidence with source-backed explanations for every key field.",
    icon: Building2
  },
  {
    title: "Compliance-first exports",
    copy: "Keep outreach research clean with public-only contacts, audit logs, and reusable campaign lists.",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <section className="page-shell relative py-8 sm:py-10">
        <div className="surface-panel glass-border overflow-hidden px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Lead discovery for modern teams</p>
              <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                Find your next best clients with AI.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {siteConfig.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app">
                  Open dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/auth/register">Create account</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {marketingStats.map((stat) => (
                  <Card key={stat.label} className="p-5">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                  </Card>
                ))}
              </div>
              <div className="rounded-[30px] border border-white/10 bg-[#050c18]/80 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                      Demo prompts
                    </p>
                    <p className="mt-2 text-lg text-white">
                      Start with proven outbound and market-research queries.
                    </p>
                  </div>
                  <BadgeCheck className="h-8 w-8 text-cyan-300" />
                </div>
                <div className="mt-5 grid gap-3">
                  {demoPrompts.map((prompt) => (
                    <div
                      key={prompt}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid-pattern rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="rounded-[30px] border border-white/10 bg-slate-950/80 p-6 shadow-panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Search preview
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Restaurants in Indore
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    68 results found
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      name: "The Curry Ledger",
                      score: 92,
                      pain: "Outdated mobile ordering flow",
                      angle: "Redesign + local SEO sprint"
                    },
                    {
                      name: "Copper Tandoor House",
                      score: 88,
                      pain: "No direct reservations CTA",
                      angle: "Booking funnel optimization"
                    },
                    {
                      name: "Green Basil Bistro",
                      score: 83,
                      pain: "Weak title/meta and slow load",
                      angle: "Technical SEO and speed uplift"
                    }
                  ].map((lead) => (
                    <div
                      key={lead.name}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-white">{lead.name}</p>
                          <p className="mt-2 text-sm text-slate-400">{lead.pain}</p>
                        </div>
                        <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950">
                          {lead.score}
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-cyan-200">{lead.angle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="page-shell py-12 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Platform</p>
          <h2 className="section-title mt-4">A serious prospecting workflow from prompt to export.</h2>
          <p className="section-copy mt-4">
            Lead.ai turns messy prospecting briefs into scored lead lists with verified source evidence,
            website audits, and campaign-ready outreach angles.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Icon className="h-6 w-6 text-cyan-200" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.copy}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="page-shell py-12 sm:py-16">
        <Card className="p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-4">
            {[
              ["1", "Prompt", "Describe your ICP, market segment, and signal hints in plain language."],
              ["2", "Parse", "Review structured filters, locations, service needs, and outreach preferences."],
              ["3", "Discover", "Run compliant connector fan-out, website auditing, enrichment, and dedupe."],
              ["4", "Export", "Save lists, assign campaigns, and export CSV or XLSX with evidence."]
            ].map(([step, title, copy]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">{step}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="pricing" className="page-shell pb-20 pt-8">
        <Card className="flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-4 text-3xl font-display text-white sm:text-4xl">
              Ship the workflow now, tune the commercial model later.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The MVP includes pricing placeholders, role-aware auth, and a queue-backed architecture so
              you can launch pilot users quickly and evolve packaging as you learn.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/auth/register">Start building lists</Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}
