import type { Job } from "bullmq";

import { generateContentDiagnosis } from "@/modules/diagnosis/service";

export async function diagnosisProcessor(job: Job) {
  return generateContentDiagnosis(job.data);
}
