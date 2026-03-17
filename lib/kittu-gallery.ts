import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

const galleryDirectory = path.join(process.cwd(), "public", "kittu");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const naturalSort = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base"
});

export type GalleryItem = {
  alt: string;
  name: string;
  src: string;
};

function createAltText(fileName: string) {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const readable = baseName.replace(/[-_]+/g, " ").trim();

  if (!readable) {
    return "Photo memory for Kittu";
  }

  const sentence = readable.charAt(0).toUpperCase() + readable.slice(1);
  return `${sentence}, a photo memory for Kittu`;
}

export const getKittuGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  try {
    const entries = await fs.readdir(galleryDirectory, { withFileTypes: true });

    return entries
      .filter((entry) => {
        const extension = path.extname(entry.name).toLowerCase();
        return entry.isFile() && supportedExtensions.has(extension);
      })
      .sort((a, b) => naturalSort.compare(a.name, b.name))
      .map((entry) => ({
        alt: createAltText(entry.name),
        name: entry.name,
        src: `/kittu/${entry.name}`
      }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
});
