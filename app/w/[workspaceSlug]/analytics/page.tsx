import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function AnalyticsPage() {
  const state = await getLocalStudioState();
  const analytics = state.analytics;

  if (
    !analytics.bestWindow &&
    !analytics.bestTemplateFamily &&
    !analytics.bestCaptionLength &&
    !analytics.bestCtaFamily
  ) {
    return (
      <EmptyState
        title="No performance history yet"
        description={analytics.summary}
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="surface-panel p-6 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Growth memory</p>
        <p className="mt-4 text-sm leading-7 text-slate-300">{analytics.summary}</p>
      </div>
      <div className="light-panel p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Best post window", analytics.bestWindow || "Not learned yet"],
            ["Template family", analytics.bestTemplateFamily || "Not learned yet"],
            ["Caption length", analytics.bestCaptionLength || "Not learned yet"],
            ["CTA family", analytics.bestCtaFamily || "Not learned yet"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[22px] border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
