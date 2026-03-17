import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { marketingStats } from "@/lib/site";

export function MarketingHero() {
  return (
    <section className="page-shell relative overflow-hidden pt-8 sm:pt-12">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative">
          <Badge variant="accent" className="mb-6">
            AI reel ops for creators, brands, and agencies
          </Badge>
          <h1 className="max-w-3xl font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Turn raw footage into published short-form systems, not one-off edits.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            REEL.ai ingests media, diagnoses what will land, cuts multiple reel
            variants, generates captions and hooks, routes approvals, publishes
            to Instagram, then learns from results to improve the next batch.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg">
                Start building your content OS
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/w/demo-studio">
              <Button size="lg" variant="secondary">
                <Play className="mr-2 h-4 w-4" />
                Explore the product shell
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {marketingStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                hint="Measured across ingest, generation, approval, and scheduling loops."
              />
            ))}
          </div>
        </div>
        <Card className="glass-border relative overflow-hidden p-0">
          <div className="grid-pattern absolute inset-0 opacity-80" />
          <div className="relative space-y-6 p-6">
            <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live pipeline</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Raw footage to ready-to-post in 11 minutes</h2>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "Content diagnosis",
                  description: "Niche: fitness coaching. Best-fit: authority + organic social proof."
                },
                {
                  title: "Variant generation",
                  description: "Authority, organic, and fast-cut versions rendered with different hook strategies."
                },
                {
                  title: "Publishing intelligence",
                  description: "Instagram business account validated. Best post window: Tue/Thu, 6:30 PM local."
                }
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-slate-900/60 p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-100">
                      0{index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
