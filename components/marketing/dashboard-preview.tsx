import Link from "next/link";
import { BarChart3, Clock3, FolderKanban, MessageSquareMore, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardPreview() {
  return (
    <section className="page-shell pb-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-4">Product shell</p>
          <h2 className="section-title text-slate-950">A premium control surface for every brand you operate.</h2>
        </div>
        <Link href="/w/demo-studio">
          <Button variant="outline" className="rounded-full">
            Open seeded workspace
          </Button>
        </Link>
      </div>
      <div className="light-panel glass-border grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-[24px] bg-slate-950 p-5">
          <Badge variant="accent" className="mb-5">
            demo-studio
          </Badge>
          <div className="space-y-3">
            {[
              { label: "Dashboard", icon: FolderKanban },
              { label: "Pipeline", icon: Zap },
              { label: "Calendar", icon: Clock3 },
              { label: "Analytics", icon: BarChart3 },
              { label: "Engagement", icon: MessageSquareMore }
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  <ItemIcon className="h-4 w-4 text-brand-200" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Queued renders", "12"],
              ["Approval SLAs", "2 pending"],
              ["Best performing window", "Thu 6:30 PM"]
            ].map(([label, value]) => (
              <Card key={label} className="bg-slate-950/95">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
              </Card>
            ))}
          </div>
          <Card className="bg-slate-950/95">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Content diagnosis</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">“How to stop scrolling and build authority”</h3>
              </div>
              <Badge variant="success">High confidence</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Detected niche", "Consultant-led marketing education"],
                ["Strongest angle", "Tactical authority with direct CTA"],
                ["Retention risk", "Slow setup in first 2.8 seconds"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
