import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressLog({
  status,
  progressPercent,
  currentMessage,
  jobs
}: {
  status: string;
  progressPercent: number;
  currentMessage?: string | null;
  jobs: Array<{
    id: string;
    stage: string;
    status: string;
    progress: number;
    message?: string | null;
    connectorKey?: string | null;
  }>;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Search progress</p>
          <p className="mt-2 text-2xl font-semibold text-white">{status}</p>
        </div>
        <Badge variant={status === "COMPLETE" ? "success" : "accent"}>{status}</Badge>
      </div>
      <Progress value={progressPercent} className="mt-5" />
      <p className="mt-3 text-sm text-slate-300">{currentMessage || "Waiting for progress updates."}</p>
      <div className="mt-5 space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">
                  {job.stage.replaceAll("_", " ")}
                  {job.connectorKey ? ` · ${job.connectorKey}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-400">{job.message || "Running..."}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{job.status}</span>
            </div>
            <Progress value={job.progress} className="mt-3 h-1.5" />
          </div>
        ))}
      </div>
    </Card>
  );
}
