import { notFound, redirect } from "next/navigation";

import { PageLayout } from "@/components/app-shell/page-layout";
import {
  LOCAL_WORKSPACE_SLUG,
  getLocalStudioState
} from "@/modules/local-studio/store";

export default async function WorkspaceLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  if (workspaceSlug !== LOCAL_WORKSPACE_SLUG) {
    if (workspaceSlug === "demo-studio") {
      redirect(`/w/${LOCAL_WORKSPACE_SLUG}`);
    }

    notFound();
  }

  const state = await getLocalStudioState();

  return (
    <PageLayout
      workspaceName={state.studio.name}
      workspaceSlug={state.studio.slug}
    >
      {children}
    </PageLayout>
  );
}
