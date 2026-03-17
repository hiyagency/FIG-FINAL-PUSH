"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Download,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Sparkles
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/search", label: "New search", icon: Search },
  { href: "/app/campaigns", label: "Campaigns", icon: FolderKanban },
  { href: "/app/settings", label: "Settings", icon: Settings }
];

export function LeadAppShell({
  children,
  user
}: {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
  };
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#040913] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[280px] flex-col border-r border-white/10 bg-[#07111f] px-6 py-8 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl">Lead.ai</p>
              <p className="text-sm text-slate-400">Public-source prospecting</p>
            </div>
          </div>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <Badge variant="accent">Compliance-first</Badge>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Search public business sources, inspect visible website signals, and keep every field tied to evidence.
            </p>
          </div>
          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/app" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    active
                      ? "bg-cyan-400/12 text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                {(user.name || user.email || "L").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user.name || "Lead.ai user"}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-full justify-between"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Sign out
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#040913]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Lead.ai</p>
                <h1 className="mt-1 text-lg font-semibold text-white">AI-powered B2B prospecting</h1>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/app/search"
                  className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08] sm:inline-flex"
                >
                  <Search className="mr-2 h-4 w-4" />
                  New search
                </Link>
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 md:flex">
                  <BarChart3 className="h-4 w-4 text-cyan-300" />
                  Ranked by opportunity and evidence
                </div>
                <Link
                  href="/app/campaigns"
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08]"
                >
                  <Download className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
