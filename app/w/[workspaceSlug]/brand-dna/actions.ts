"use server";

import { updateBrandDna } from "@/modules/local-studio/store";

function parseCommaSeparated(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveBrandDnaAction(formData: FormData) {
  await updateBrandDna({
    brandName: String(formData.get("brandName") || ""),
    niche: String(formData.get("niche") || ""),
    offerType: String(formData.get("offerType") || ""),
    targetAudience: String(formData.get("targetAudience") || ""),
    preferredCaptionStyle: String(formData.get("preferredCaptionStyle") || ""),
    preferredHookStyle: String(formData.get("preferredHookStyle") || ""),
    pacingStyle: String(formData.get("pacingStyle") || ""),
    subtitleStyle: String(formData.get("subtitleStyle") || ""),
    ctaTone: String(formData.get("ctaTone") || ""),
    bannedWords: parseCommaSeparated(formData.get("bannedWords")),
    preferredWords: parseCommaSeparated(formData.get("preferredWords")),
    audioVibe: String(formData.get("audioVibe") || ""),
    platformGoals: parseCommaSeparated(formData.get("platformGoals")),
    postingLanguages: parseCommaSeparated(formData.get("postingLanguages")),
    complianceNotes: String(formData.get("complianceNotes") || "")
  });
}
