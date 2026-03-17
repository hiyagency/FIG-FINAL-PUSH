import type { Job } from "bullmq";

import {
  createProxyVideo,
  createThumbnail,
  createWaveformPng,
  probeMedia
} from "@/modules/uploads/media-pipeline";

export async function renderProcessor(job: Job) {
  const { inputPath, proxyOutputPath, thumbnailOutputPath, waveformOutputPath } = job.data;
  const probe = await probeMedia(inputPath);

  if (proxyOutputPath) {
    await createProxyVideo(inputPath, proxyOutputPath);
  }

  if (thumbnailOutputPath) {
    await createThumbnail(inputPath, thumbnailOutputPath);
  }

  if (waveformOutputPath) {
    await createWaveformPng(inputPath, waveformOutputPath);
  }

  return {
    probe
  };
}
