import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import { execa } from "execa";

import { env } from "@/lib/env";

export async function ensureParentDirectory(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true });
}

export async function probeMedia(inputPath: string) {
  const { stdout } = await execa(env.FFPROBE_PATH, [
    "-v",
    "error",
    "-print_format",
    "json",
    "-show_streams",
    "-show_format",
    inputPath
  ]);

  return JSON.parse(stdout) as {
    streams: Array<Record<string, unknown>>;
    format: Record<string, unknown>;
  };
}

export async function createProxyVideo(inputPath: string, outputPath: string) {
  await ensureParentDirectory(outputPath);

  await execa(env.FFMPEG_PATH, [
    "-y",
    "-i",
    inputPath,
    "-vf",
    "scale='min(1080,iw)':-2",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "23",
    "-c:a",
    "aac",
    outputPath
  ]);
}

export async function createThumbnail(inputPath: string, outputPath: string) {
  await ensureParentDirectory(outputPath);

  await execa(env.FFMPEG_PATH, [
    "-y",
    "-i",
    inputPath,
    "-ss",
    "00:00:01.500",
    "-vframes",
    "1",
    outputPath
  ]);
}

export async function createWaveformPng(inputPath: string, outputPath: string) {
  await ensureParentDirectory(outputPath);

  await execa(env.FFMPEG_PATH, [
    "-y",
    "-i",
    inputPath,
    "-filter_complex",
    "aformat=channel_layouts=mono,showwavespic=s=1600x240:colors=0x4464ff",
    "-frames:v",
    "1",
    outputPath
  ]);
}
