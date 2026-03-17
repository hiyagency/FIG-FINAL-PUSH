import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { getBrandDnaCompletionScore, getLocalStudioState } from "@/modules/local-studio/store";

export default async function WorkspaceDashboardPage() {
  const state = await getLocalStudioState();
  const brandCompletion = getBrandDnaCompletionScore(state);
  const latestUpload = state.uploads[0];
  const activeProject = state.projects[0];

  const stats = [
    {
      label: "Local media library",
      value: `${state.uploads.length}`,
      hint: state.uploads.length
        ? "Files are stored locally and ready for diagnosis or editing."
        : "Upload raw footage to populate your local media library."
    },
    {
      label: "Project backlog",
      value: `${state.projects.length}`,
      hint: state.projects.length
        ? "Each uploaded video or audio file creates a working project shell."
        : "Projects appear automatically after media upload."
    },
    {
      label: "Brand DNA readiness",
      value: `${brandCompletion}%`,
      hint:
        brandCompletion > 0
          ? "Continue refining voice, pacing, CTA, and compliance guidance."
          : "Set your Brand DNA once so every future generation starts aligned."
    }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} className="light-panel p-6" />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="light-panel p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Studio summary</p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">{state.studio.name}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {state.studio.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/w/${state.studio.slug}/upload`}
              className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white"
            >
              Upload media
            </Link>
            <Link
              href={`/w/${state.studio.slug}/brand-dna`}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700"
            >
              Edit Brand DNA
            </Link>
          </div>
        </div>
        <div className="light-panel p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current readiness</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[20px] border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-950">Brand DNA</p>
              <p className="mt-2 text-sm text-slate-600">
                {brandCompletion > 0
                  ? `${brandCompletion}% complete.`
                  : "Not configured yet. Add your niche, offer, audience, and style preferences."}
              </p>
            </div>
            <div className="rounded-[20px] border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-950">Latest upload</p>
              <p className="mt-2 text-sm text-slate-600">
                {latestUpload
                  ? `${latestUpload.originalName} · ${Math.round(
                      latestUpload.sizeBytes / 1024 / 1024
                    )} MB`
                  : "No uploads yet."}
              </p>
            </div>
            <div className="rounded-[20px] border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-950">Latest project</p>
              <p className="mt-2 text-sm text-slate-600">
                {activeProject
                  ? `${activeProject.title} · ${activeProject.status}`
                  : "No project shell has been created yet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {state.projects.length === 0 ? (
        <EmptyState
          title="Your private studio is ready."
          description="Upload your first video, podcast, screen recording, image set, or audio file to start building real local projects. Nothing is being faked here yet, so the rest of the workflow will unlock as your library grows."
          action={
            <Link
              href={`/w/${state.studio.slug}/upload`}
              className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white"
            >
              Upload first asset
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="light-panel p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Recent projects</p>
            <div className="mt-5 space-y-3">
              {state.projects.slice(0, 5).map((project) => (
                <div key={project.id} className="rounded-[20px] border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-slate-950">{project.title}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Created {new Date(project.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="light-panel p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Learning memory</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{state.analytics.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
