import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  className
}: {
  label: string;
  value: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/8 bg-white/5 p-5 backdrop-blur",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</span>
        <ArrowUpRight className="h-4 w-4 text-emerald-300" />
      </div>
      <div className="mb-2 text-3xl font-semibold text-white">{value}</div>
      <p className="text-sm text-slate-300">{hint}</p>
    </div>
  );
}
