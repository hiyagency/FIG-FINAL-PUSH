import type { Job } from "bullmq";

import { runExportJob } from "@/modules/lead-ai/exports";

export async function exportProcessor(job: Job<{ exportId: string }>) {
  await runExportJob(job.data.exportId);
}
