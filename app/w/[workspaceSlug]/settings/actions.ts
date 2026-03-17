"use server";

import { updateStudioProfile } from "@/modules/local-studio/store";

export async function saveStudioSettingsAction(formData: FormData) {
  await updateStudioProfile({
    name: String(formData.get("studioName") || ""),
    description: String(formData.get("description") || "")
  });
}
