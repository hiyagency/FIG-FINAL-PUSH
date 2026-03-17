import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function DiagnosisPage() {
  const state = await getLocalStudioState();
  const pendingProjects = state.projects.filter(
    (project) => project.status === "awaiting-diagnosis"
  );

  if (pendingProjects.length === 0) {
    return (
      <EmptyState
        title="No projects are waiting for diagnosis"
        description="Upload a video or audio file and REEL.ai will create a project shell here. Diagnosis can then operate on real media instead of sample content."
      />
    );
  }

  return (
    <div className="grid gap-6">
      {pendingProjects.map((project) => (
        <div key={project.id} className="light-panel p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Awaiting diagnosis</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">{project.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This local project has been created from your uploaded asset. The
            next production step is to run transcription, scene analysis, and
            content diagnosis against the real source media.
          </p>
        </div>
      ))}
    </div>
  );
}
