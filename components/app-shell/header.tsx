import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppHeader({
  workspaceName,
  workspaceSlug
}: {
  workspaceName: string;
  workspaceSlug: string;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur xl:flex-row xl:items-center xl:justify-between xl:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="font-display text-3xl text-slate-950">{workspaceName}</h1>
          <Link
            href={`/w/${workspaceSlug}/brand-dna`}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
          >
            Brand DNA
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full min-w-[240px] sm:w-[320px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-10" placeholder="Search uploads, projects, hooks, captions..." />
        </div>
        <Button variant="outline" className="rounded-2xl">
          <Bell className="mr-2 h-4 w-4" />
          Alerts
        </Button>
        <Avatar initials="RA" />
      </div>
    </header>
  );
}
