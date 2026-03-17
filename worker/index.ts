import { Worker } from "bullmq";

import { logger } from "@/lib/logger";
import { queueNames } from "@/lib/queues";
import { redisConnection } from "@/lib/redis";
import { exportProcessor } from "@/worker/processors/lead-export";
import { discoveryProcessor } from "@/worker/processors/lead-search";

const workers = [
  new Worker(queueNames.discovery, discoveryProcessor, { connection: redisConnection }),
  new Worker(queueNames.exports, exportProcessor, { connection: redisConnection })
];

workers.forEach((worker) => {
  worker.on("ready", () => logger.info({ queue: worker.name }, "Worker ready"));
  worker.on("failed", (job, error) =>
    logger.error({ queue: worker.name, jobId: job?.id, error }, "Worker job failed")
  );
});

logger.info("Lead.ai workers online");
