import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</span>
        <ArrowUpRight className="h-4 w-4 text-cyan-300" />
      </div>
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </Card>
  );
}
