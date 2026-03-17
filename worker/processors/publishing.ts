import type { Job } from "bullmq";

import { buildInstagramPublishPayload } from "@/modules/publishing/service";

export async function publishingProcessor(job: Job) {
  return buildInstagramPublishPayload(job.data);
}
