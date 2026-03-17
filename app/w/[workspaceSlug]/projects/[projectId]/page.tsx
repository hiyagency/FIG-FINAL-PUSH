import Link from "next/link";
import { notFound } from "next/navigation";

import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function ProjectPage({
  params
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;
  const state = await getLocalStudioState();
  const project = state.projects.find((entry) => entry.id === projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Project overview</p>
        <h2 className="mt-3 text-3xl font-semibold">{project.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          This project was created locally from one of your uploaded assets.
          Diagnosis, variant generation, captions, and publish scheduling will
          become available as you process real media through the pipeline.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/w/${workspaceSlug}/projects/${project.id}/variants`}
            className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-white"
          >
            Open variants
          </Link>
          <Link
            href={`/w/${workspaceSlug}/projects/${project.id}/captions`}
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
          >
            Open captions
          </Link>
        </div>
      </div>
    </div>
  );
}
