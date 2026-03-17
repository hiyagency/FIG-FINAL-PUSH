import { Queue } from "bullmq";

import { redisConnection } from "@/lib/redis";

export const queueNames = {
  discovery: "lead-discovery",
  enrichment: "lead-enrichment",
  exports: "lead-exports",
  notifications: "lead-notifications"
} as const;

type QueueName = (typeof queueNames)[keyof typeof queueNames];

const queues = new Map<QueueName, Queue>();

export function getQueue(name: QueueName) {
  if (!queues.has(name)) {
    queues.set(
      name,
      new Queue(name, {
        connection: redisConnection,
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: 1000,
          removeOnFail: 1000,
          backoff: {
            type: "exponential",
            delay: 5000
          }
        }
      })
    );
  }

  return queues.get(name)!;
}
