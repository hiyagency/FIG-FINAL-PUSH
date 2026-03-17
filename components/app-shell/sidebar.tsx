"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Film,
  FolderKanban,
  LayoutTemplate,
  MessageSquareMore,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud
} from "lucide-react";

import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "", icon: FolderKanban },
  { label: "Upload", href: "/upload", icon: UploadCloud },
  { label: "Diagnosis", href: "/diagnosis", icon: Sparkles },
  { label: "Variants", href: "/projects/project_demo/variants", icon: Film },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Engagement", href: "/engagement", icon: MessageSquareMore },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin", href: "/admin", icon: ShieldCheck }
] as const;

export function AppSidebar({ workspaceSlug }: { workspaceSlug: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-slate-200 bg-white/80 p-5 backdrop-blur-xl xl:block">
      <div className="mb-8 rounded-[24px] bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Workspace</p>
        <h2 className="mt-3 font-display text-2xl">REEL.ai</h2>
        <p className="mt-2 text-sm text-slate-300">Modular short-form operating system.</p>
      </div>
      <nav className="space-y-2">
        {nav.map((item) => {
          const href = `/w/${workspaceSlug}${item.href}`;
          const Icon = item.icon;
          const active = pathname === href;

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-slate-950 text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-950/5 hover:text-slate-950"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
