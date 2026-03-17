import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function CalendarPage() {
  const state = await getLocalStudioState();

  if (state.calendar.length === 0) {
    return (
      <EmptyState
        title="No scheduled posts yet"
        description="Scheduling remains empty until you move a real project into the publishing workflow."
      />
    );
  }

  return (
    <div className="light-panel grid gap-4 p-6 md:grid-cols-3">
      {state.calendar.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-slate-200 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.status}</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{item.scheduledFor}</p>
        </div>
      ))}
    </div>
  );
}
