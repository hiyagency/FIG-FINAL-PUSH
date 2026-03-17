import type { Job } from "bullmq";

import { runSearchPipeline } from "@/modules/lead-ai/pipeline";

export async function discoveryProcessor(job: Job<{ searchId: string }>) {
  await runSearchPipeline(job.data.searchId);
}
