"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Copy, Download, Loader2, PlayCircle, Square, Target } from "lucide-react";
import { toast } from "sonner";

import { ProgressLog } from "@/components/lead-ai/progress-log";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SearchLeadRow = {
  id: string;
  rank: number;
  companyName: string;
  contactName?: string | null;
  contactRole?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  opportunityScore: number;
  fitScore: number;
  confidenceScore: number;
  painPoints: string[];
  outreachAngle?: string | null;
  aiSummary?: string | null;
  sourceUrls: string[];
  sourceNames: string[];
  leadId: string;
  websiteQualityScore?: number | null;
  mobileFriendlinessScore?: number | null;
  seoScore?: number | null;
  brandingScore?: number | null;
  speedScore?: number | null;
  outdatedWebsiteSignal: boolean;
  weakSocialPresenceSignal: boolean;
};

type SearchDetailPayload = {
  id: string;
  status: string;
  progressPercent: number;
  currentMessage?: string | null;
  summary?: Record<string, unknown> | null;
  jobs: Array<{
    id: string;
    stage: string;
    status: string;
    progress: number;
    message?: string | null;
    connectorKey?: string | null;
    updatedAt: string;
  }>;
  parsedQuery: {
    industries: string[];
    serviceNeeds: string[];
    signals: string[];
    locationCity?: string | null;
    locationState?: string | null;
    locationCountry?: string | null;
  } | null;
  searchLeads: Array<{
    rank: number;
    lead: {
      id: string;
      companyName: string;
      contactName?: string | null;
      contactRole?: string | null;
      businessEmail?: string | null;
      businessPhone?: string | null;
      website?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      opportunityScore: number;
      fitScore: number;
      confidenceScore: number;
      painPoints: string[];
      outreachAngle?: string | null;
      aiSummary?: string | null;
      sourceUrls: string[];
      sourceNames: string[];
      websiteQualityScore?: number | null;
      mobileFriendlinessScore?: number | null;
      seoScore?: number | null;
      brandingScore?: number | null;
      speedScore?: number | null;
      outdatedWebsiteSignal: boolean;
      weakSocialPresenceSignal: boolean;
    };
  }>;
};

function statusIsActive(status: string) {
  return ["QUEUED", "RUNNING", "PARTIAL"].includes(status);
}

export function ResultsTable({
  searchId,
  initialData
}: {
  searchId: string;
  initialData: SearchDetailPayload;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [minScore, setMinScore] = useState("0");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["search-detail", searchId],
    queryFn: async () => {
      const response = await fetch(`/api/searches/${searchId}`);
      if (!response.ok) {
        throw new Error("Unable to load search details.");
      }

      return (await response.json()) as SearchDetailPayload;
    },
    initialData,
    refetchInterval: (current) => (current && statusIsActive(current.state.data?.status ?? "") ? 2000 : false)
  });

  const rows = useMemo<SearchLeadRow[]>(
    () =>
      query.data.searchLeads.map((item) => ({
        id: item.lead.id,
        leadId: item.lead.id,
        rank: item.rank,
        companyName: item.lead.companyName,
        contactName: item.lead.contactName,
        contactRole: item.lead.contactRole,
        businessEmail: item.lead.businessEmail,
        businessPhone: item.lead.businessPhone,
        website: item.lead.website,
        city: item.lead.city,
        state: item.lead.state,
        country: item.lead.country,
        opportunityScore: item.lead.opportunityScore,
        fitScore: item.lead.fitScore,
        confidenceScore: item.lead.confidenceScore,
        painPoints: item.lead.painPoints,
        outreachAngle: item.lead.outreachAngle,
        aiSummary: item.lead.aiSummary,
        sourceUrls: item.lead.sourceUrls,
        sourceNames: item.lead.sourceNames,
        websiteQualityScore: item.lead.websiteQualityScore,
        mobileFriendlinessScore: item.lead.mobileFriendlinessScore,
        seoScore: item.lead.seoScore,
        brandingScore: item.lead.brandingScore,
        speedScore: item.lead.speedScore,
        outdatedWebsiteSignal: item.lead.outdatedWebsiteSignal,
        weakSocialPresenceSignal: item.lead.weakSocialPresenceSignal
      })),
    [query.data.searchLeads]
  );

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const haystack = [
          row.companyName,
          row.contactName,
          row.contactRole,
          row.city,
          row.state,
          row.country,
          row.outreachAngle,
          row.aiSummary,
          row.painPoints.join(" ")
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          haystack.includes(globalFilter.toLowerCase()) &&
          row.opportunityScore >= Number(minScore || "0")
        );
      }),
    [rows, globalFilter, minScore]
  );

  const columns = useMemo<ColumnDef<SearchLeadRow>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={selectedIds.length > 0 && selectedIds.length === filteredRows.length}
            onChange={(event) =>
              setSelectedIds(event.target.checked ? filteredRows.map((row) => row.id) : [])
            }
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={(event) =>
              setSelectedIds((current) =>
                event.target.checked
                  ? [...current, row.original.id]
                  : current.filter((id) => id !== row.original.id)
              )
            }
          />
        )
      },
      {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => (
          <div>
            <Link href={`/app/leads/${row.original.leadId}`} className="font-medium text-white hover:text-cyan-200">
              {row.original.companyName}
            </Link>
            <p className="mt-1 text-xs text-slate-400">
              {[row.original.city, row.original.state, row.original.country].filter(Boolean).join(", ")}
            </p>
          </div>
        )
      },
      {
        accessorKey: "contactName",
        header: "Contact",
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-slate-200">{row.original.contactName || "Public contact not found"}</p>
            <p className="text-xs text-slate-400">{row.original.contactRole || "Role unavailable"}</p>
          </div>
        )
      },
      {
        accessorKey: "businessEmail",
        header: "Email",
        cell: ({ row }) => <span className="text-sm text-slate-300">{row.original.businessEmail || "—"}</span>
      },
      {
        accessorKey: "businessPhone",
        header: "Phone",
        cell: ({ row }) => <span className="text-sm text-slate-300">{row.original.businessPhone || "—"}</span>
      },
      {
        accessorKey: "opportunityScore",
        header: "Opportunity",
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950">
            {row.original.opportunityScore}
          </span>
        )
      },
      {
        accessorKey: "painPoints",
        header: "Pain point",
        cell: ({ row }) => (
          <span className="text-sm text-slate-300">{row.original.painPoints[0] || "No major issue detected"}</span>
        )
      },
      {
        accessorKey: "outreachAngle",
        header: "Outreach angle",
        cell: ({ row }) => <span className="text-sm text-cyan-200">{row.original.outreachAngle || "—"}</span>
      }
    ],
    [filteredRows, selectedIds]
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter
  });

  async function handleCopySelected() {
    const selectedRows = filteredRows.filter((row) => selectedIds.includes(row.id));

    if (!selectedRows.length) {
      toast.error("Select at least one lead first.");
      return;
    }

    const text = selectedRows
      .map((row) =>
        [
          row.companyName,
          row.contactName,
          row.businessEmail,
          row.businessPhone,
          row.website,
          row.outreachAngle
        ]
          .filter(Boolean)
          .join(" | ")
      )
      .join("\n");

    await navigator.clipboard.writeText(text);
    toast.success("Selected leads copied to clipboard.");
  }

  async function postSelection(endpoint: "/api/campaigns" | "/api/lists", label: string) {
    if (!selectedIds.length) {
      toast.error(`Select at least one lead to ${label}.`);
      return;
    }

    const name = window.prompt(`Name this ${label}:`);

    if (!name) {
      return;
    }

    setBusyAction(label);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          searchId,
          leadIds: selectedIds,
          name
        })
      });

      if (!response.ok) {
        throw new Error(`Unable to create ${label}.`);
      }

      toast.success(`${label} created.`);
      setSelectedIds([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Unable to create ${label}.`);
    } finally {
      setBusyAction(null);
    }
  }

  async function handleExport(format: "CSV" | "XLSX") {
    setBusyAction(format);

    try {
      const response = await fetch("/api/exports", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          searchId,
          format
        })
      });

      if (!response.ok) {
        throw new Error(`Unable to export ${format}.`);
      }

      const data = (await response.json()) as { exportId: string; status: string };

      if (data.status === "COMPLETE") {
        window.open(`/api/exports/${data.exportId}`, "_blank", "noopener,noreferrer");
      } else {
        toast.success(`${format} export queued. Download will appear in the dashboard once complete.`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Unable to export ${format}.`);
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCancelSearch() {
    setBusyAction("cancel");

    try {
      const response = await fetch(`/api/searches/${searchId}/stop`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Unable to cancel search.");
      }

      toast.success("Search canceled.");
      await query.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to cancel search.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Lead count</p>
            <p className="mt-3 text-3xl font-semibold text-white">{rows.length}</p>
            <p className="mt-2 text-sm text-slate-400">Ranked and deduped leads</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Avg opportunity</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {rows.length
                ? Math.round(rows.reduce((sum, row) => sum + row.opportunityScore, 0) / rows.length)
                : 0}
            </p>
            <p className="mt-2 text-sm text-slate-400">Best-fit revenue opportunity</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Source-backed</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {rows.filter((row) => row.sourceUrls.length >= 2).length}
            </p>
            <p className="mt-2 text-sm text-slate-400">Leads with 2+ public sources</p>
          </Card>
        </div>
        <ProgressLog
          status={query.data.status}
          progressPercent={query.data.progressPercent}
          currentMessage={query.data.currentMessage}
          jobs={query.data.jobs}
        />
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search companies, pain points, outreach angles..."
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
              className="w-full border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 sm:max-w-[160px]"
              placeholder="Min score"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleCopySelected}>
              <Copy className="mr-2 h-4 w-4" />
              Copy selected
            </Button>
            <Button variant="secondary" onClick={() => postSelection("/api/lists", "lead list")}>
              <Target className="mr-2 h-4 w-4" />
              {busyAction === "lead list" ? "Saving..." : "Save list"}
            </Button>
            <Button variant="secondary" onClick={() => postSelection("/api/campaigns", "campaign")}>
              <PlayCircle className="mr-2 h-4 w-4" />
              {busyAction === "campaign" ? "Saving..." : "Create campaign"}
            </Button>
            <Button variant="secondary" onClick={() => handleExport("CSV")}>
              {busyAction === "CSV" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export CSV
            </Button>
            <Button variant="secondary" onClick={() => handleExport("XLSX")}>
              {busyAction === "XLSX" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export XLSX
            </Button>
            {statusIsActive(query.data.status) ? (
              <Button variant="secondary" onClick={handleCancelSearch}>
                {busyAction === "cancel" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Square className="mr-2 h-4 w-4" />}
                Stop search
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/[0.03]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <>
                  <tr
                    key={row.id}
                    className="cursor-pointer border-t border-white/10 transition hover:bg-white/[0.03]"
                    onClick={() =>
                      setExpandedLeadId((current) => (current === row.original.id ? null : row.original.id))
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {expandedLeadId === row.original.id ? (
                    <tr className="border-t border-white/10 bg-white/[0.02]">
                      <td colSpan={columns.length} className="px-4 py-5">
                        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                              Lead detail
                            </div>
                            <p className="mt-3 text-base leading-7 text-slate-200">
                              {row.original.aiSummary || "No AI summary available yet."}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {row.original.painPoints.map((painPoint) => (
                                <Badge key={painPoint}>{painPoint}</Badge>
                              ))}
                            </div>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {[
                                ["Website quality", row.original.websiteQualityScore],
                                ["Mobile", row.original.mobileFriendlinessScore],
                                ["SEO", row.original.seoScore],
                                ["Branding", row.original.brandingScore],
                                ["Speed", row.original.speedScore]
                              ].map(([label, value]) => (
                                <div
                                  key={label}
                                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                                >
                                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                                  <p className="mt-2 text-lg font-semibold text-white">{value ?? "—"}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Outreach angle</p>
                              <p className="mt-2 text-sm leading-7 text-cyan-200">{row.original.outreachAngle}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sources</p>
                              <div className="mt-3 space-y-2">
                                {row.original.sourceUrls.map((sourceUrl, index) => (
                                  <a
                                    key={`${sourceUrl}-${index}`}
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-sm text-slate-300 underline decoration-white/20 underline-offset-4"
                                  >
                                    {row.original.sourceNames[index] || "Public source"}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
