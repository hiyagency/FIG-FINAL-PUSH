import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function EditorPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const state = await getLocalStudioState();
  const project = state.projects.find((entry) => entry.id === projectId);

  if (!project) {
    notFound();
  }

  return (
    <EmptyState
      title="Timeline editor is waiting for a rendered edit graph"
      description={`"${project.title}" exists locally, but there is no render plan or edit decision list yet. Once diagnosis and edit planning run on real source media, this page will expose timeline controls, subtitle tracks, overlays, and cover frame selection.`}
    />
  );
}
