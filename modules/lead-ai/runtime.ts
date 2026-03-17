import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getQueue, queueNames } from "@/lib/queues";
import { runExportJob } from "@/modules/lead-ai/exports";
import { runSearchPipeline } from "@/modules/lead-ai/pipeline";

export async function enqueueSearch(searchId: string) {
  if (env.LEAD_AI_DISABLE_QUEUE) {
    void runSearchPipeline(searchId).catch((error) =>
      logger.error({ searchId, error }, "Inline search pipeline failed")
    );
    return;
  }

  await getQueue(queueNames.discovery).add("run-search", { searchId });
}

export async function enqueueExport(exportId: string) {
  if (env.LEAD_AI_DISABLE_QUEUE) {
    try {
      await runExportJob(exportId);
      return;
    } catch (error) {
      logger.error({ exportId, error }, "Inline export job failed");
      throw error;
    }
  }

  await getQueue(queueNames.exports).add("run-export", { exportId });
}
