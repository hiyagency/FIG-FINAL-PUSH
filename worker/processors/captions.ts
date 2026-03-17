import type { Job } from "bullmq";

import { evaluateOriginality, generateCaptionPackage } from "@/modules/captions/service";

export async function captionsProcessor(job: Job) {
  const captions = await generateCaptionPackage(job.data);
  const originality = await evaluateOriginality({
    hook: job.data.projectTitle || "",
    caption: captions.primaryCaption,
    templateName: job.data.templateName
  });

  return {
    captions,
    originality
  };
}
