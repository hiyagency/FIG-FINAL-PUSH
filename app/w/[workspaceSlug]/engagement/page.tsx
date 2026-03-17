import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function EngagementPage() {
  const state = await getLocalStudioState();

  if (state.engagement.length === 0) {
    return (
      <EmptyState
        title="No engagement events yet"
        description="Comment and DM operations stay empty until you publish content and connect a supported platform workflow."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="light-panel p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Engagement inbox</p>
        <div className="mt-5 space-y-4">
          {state.engagement.map((thread) => (
            <div key={thread.id} className="rounded-[22px] border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-950">{thread.handle}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {thread.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{thread.preview}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="surface-panel p-6 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Safety controls</p>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
          <li>- Auto-replies require explicit rule approval.</li>
          <li>- Risky or spammy content should be reviewed before any outbound action.</li>
          <li>- Hot leads can be surfaced here once publishing and engagement sync are enabled.</li>
        </ul>
      </div>
    </div>
  );
}
