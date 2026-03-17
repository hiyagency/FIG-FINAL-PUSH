import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function CaptionsPage({
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
      title="No caption package generated yet"
      description={`"${project.title}" is waiting for caption and discovery generation. Once the AI planning pipeline runs on your real media, this page will show main captions, short/long variants, hashtags, CTA text, and originality feedback.`}
    />
  );
}
