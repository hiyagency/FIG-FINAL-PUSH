import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function PublishPage({
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
      title="Publishing is not queued yet"
      description={`"${project.title}" has not been scheduled for publish. This local-private build keeps publishing transparent: nothing will claim to be posted until real media processing and account connectivity are configured.`}
    />
  );
}
