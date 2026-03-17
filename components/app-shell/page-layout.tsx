import { AppHeader } from "@/components/app-shell/header";
import { AppSidebar } from "@/components/app-shell/sidebar";

export function PageLayout({
  workspaceName,
  workspaceSlug,
  children
}: {
  workspaceName: string;
  workspaceSlug: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <div className="flex min-h-screen">
        <AppSidebar workspaceSlug={workspaceSlug} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader workspaceName={workspaceName} workspaceSlug={workspaceSlug} />
          <main className="flex-1 px-5 py-6 sm:px-6 xl:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
