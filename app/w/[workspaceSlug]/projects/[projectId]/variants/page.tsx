import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ui/empty-state";
import { getLocalStudioState } from "@/modules/local-studio/store";

export default async function VariantsPage({
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
      title="No rendered variants yet"
      description={`"${project.title}" exists locally, but no reel variants have been rendered for it yet. Process this project through diagnosis and edit planning before expecting variant comparisons here.`}
    />
  );
}
