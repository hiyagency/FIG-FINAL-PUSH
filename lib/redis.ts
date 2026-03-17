import IORedis from "ioredis";

import { env } from "@/lib/env";

const redisUrl = new URL(env.REDIS_URL);

declare global {
  var __redis__: IORedis | undefined;
}

export function getRedis() {
  if (!global.__redis__) {
    global.__redis__ = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableAutoPipelining: true,
      lazyConnect: true
    });
  }

  return global.__redis__;
}

export const redisConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || "6379"),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined
};
