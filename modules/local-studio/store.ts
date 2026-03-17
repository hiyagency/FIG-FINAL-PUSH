import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createId } from "@paralleldrive/cuid2";

export const LOCAL_WORKSPACE_SLUG = "private-studio";

const STUDIO_DIR = join(process.cwd(), ".reel-ai");
const STUDIO_STATE_PATH = join(STUDIO_DIR, "state.json");
export const LOCAL_UPLOADS_DIR = join(process.cwd(), "uploads", LOCAL_WORKSPACE_SLUG);

export type LocalUploadKind = "video" | "audio" | "image" | "other";

export type LocalStudioAsset = {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  kind: LocalUploadKind;
  relativePath: string;
  createdAt: string;
};

export type LocalStudioProject = {
  id: string;
  title: string;
  sourceAssetId: string;
  status: "awaiting-diagnosis" | "editing" | "scheduled" | "published";
  funnelGoal: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LocalStudioState = {
  studio: {
    slug: string;
    name: string;
    description: string;
    localMode: "single-user";
    createdAt: string;
    updatedAt: string;
  };
  brandDna: {
    brandName: string;
    niche: string;
    offerType: string;
    targetAudience: string;
    preferredCaptionStyle: string;
    preferredHookStyle: string;
    pacingStyle: string;
    subtitleStyle: string;
    ctaTone: string;
    bannedWords: string[];
    preferredWords: string[];
    audioVibe: string;
    platformGoals: string[];
    postingLanguages: string[];
    complianceNotes: string;
  };
  uploads: LocalStudioAsset[];
  projects: LocalStudioProject[];
  analytics: {
    summary: string;
    bestWindow: string | null;
    bestTemplateFamily: string | null;
    bestCaptionLength: string | null;
    bestCtaFamily: string | null;
  };
  calendar: Array<{
    id: string;
    title: string;
    scheduledFor: string;
    status: "scheduled" | "draft";
  }>;
  engagement: Array<{
    id: string;
    handle: string;
    sentiment: "positive" | "neutral" | "risky";
    status: "needs-human" | "watching" | "resolved";
    preview: string;
  }>;
};

function nowIso() {
  return new Date().toISOString();
}

function createDefaultState(): LocalStudioState {
  const now = nowIso();

  return {
    studio: {
      slug: LOCAL_WORKSPACE_SLUG,
      name: "Private Studio",
      description: "Local-first REEL.ai workspace for a single private operator.",
      localMode: "single-user",
      createdAt: now,
      updatedAt: now
    },
    brandDna: {
      brandName: "",
      niche: "",
      offerType: "",
      targetAudience: "",
      preferredCaptionStyle: "",
      preferredHookStyle: "",
      pacingStyle: "",
      subtitleStyle: "",
      ctaTone: "",
      bannedWords: [],
      preferredWords: [],
      audioVibe: "",
      platformGoals: [],
      postingLanguages: ["en"],
      complianceNotes: ""
    },
    uploads: [],
    projects: [],
    analytics: {
      summary:
        "No published history yet. Upload footage, set your Brand DNA, and start generating projects to build performance memory.",
      bestWindow: null,
      bestTemplateFamily: null,
      bestCaptionLength: null,
      bestCtaFamily: null
    },
    calendar: [],
    engagement: []
  };
}

async function ensureDirectories() {
  await mkdir(STUDIO_DIR, { recursive: true });
  await mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
}

async function writeState(state: LocalStudioState) {
  await ensureDirectories();
  const tempPath = `${STUDIO_STATE_PATH}.tmp`;
  await writeFile(tempPath, JSON.stringify(state, null, 2), "utf8");
  await rename(tempPath, STUDIO_STATE_PATH);
}

export async function getLocalStudioState() {
  await ensureDirectories();

  try {
    const raw = await readFile(STUDIO_STATE_PATH, "utf8");
    return JSON.parse(raw) as LocalStudioState;
  } catch {
    const initialState = createDefaultState();
    await writeState(initialState);
    return initialState;
  }
}

export async function updateLocalStudioState(
  updater: (current: LocalStudioState) => LocalStudioState
) {
  const current = await getLocalStudioState();
  const next = updater(current);
  next.studio.updatedAt = nowIso();
  await writeState(next);
  return next;
}

export async function updateBrandDna(
  input: Partial<LocalStudioState["brandDna"]>
) {
  return updateLocalStudioState((current) => ({
    ...current,
    brandDna: {
      ...current.brandDna,
      ...input
    }
  }));
}

export async function updateStudioProfile(input: {
  name?: string;
  description?: string;
}) {
  return updateLocalStudioState((current) => ({
    ...current,
    studio: {
      ...current.studio,
      name: input.name ?? current.studio.name,
      description: input.description ?? current.studio.description
    }
  }));
}

function guessUploadKind(mimeType: string): LocalUploadKind {
  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  return "other";
}

function createProjectTitle(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function registerUploadedAssets(
  uploads: Array<{
    originalName: string;
    storedName: string;
    mimeType: string;
    sizeBytes: number;
  }>
) {
  return updateLocalStudioState((current) => {
    const createdAt = nowIso();

    const assets = uploads.map((upload) => {
      const assetId = createId();
      const kind = guessUploadKind(upload.mimeType);

      return {
        asset: {
          id: assetId,
          originalName: upload.originalName,
          storedName: upload.storedName,
          mimeType: upload.mimeType,
          sizeBytes: upload.sizeBytes,
          kind,
          relativePath: `uploads/${LOCAL_WORKSPACE_SLUG}/${upload.storedName}`,
          createdAt
        } satisfies LocalStudioAsset,
        project:
          kind === "video" || kind === "audio"
            ? ({
                id: createId(),
                title: createProjectTitle(upload.originalName) || "Untitled project",
                sourceAssetId: assetId,
                status: "awaiting-diagnosis",
                funnelGoal: null,
                createdAt,
                updatedAt: createdAt
              } satisfies LocalStudioProject)
            : null
      };
    });

    const createdProjects: LocalStudioProject[] = assets.flatMap((entry) =>
      entry.project ? [entry.project] : []
    );

    return {
      ...current,
      uploads: [...assets.map((entry) => entry.asset), ...current.uploads],
      projects: [...createdProjects, ...current.projects]
    };
  });
}

export function getBrandDnaCompletionScore(state: LocalStudioState) {
  const fields = [
    state.brandDna.brandName,
    state.brandDna.niche,
    state.brandDna.offerType,
    state.brandDna.targetAudience,
    state.brandDna.preferredCaptionStyle,
    state.brandDna.preferredHookStyle,
    state.brandDna.pacingStyle,
    state.brandDna.subtitleStyle,
    state.brandDna.ctaTone,
    state.brandDna.audioVibe
  ];

  const completed = fields.filter((field) => field.trim().length > 0).length;
  return Math.round((completed / fields.length) * 100);
}
