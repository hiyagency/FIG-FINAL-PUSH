"use server";

import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { createBrand } from "@/modules/brands/service";
import { createWorkspace } from "@/modules/workspaces/service";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function onboardingAction(formData: FormData) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const workspaceName = String(formData.get("workspaceName") || "");
  const brandName = String(formData.get("brandName") || "");
  const niche = String(formData.get("niche") || "");
  const audience = String(formData.get("targetAudience") || "");

  const workspace = await createWorkspace(session.user.id, {
    name: workspaceName,
    slug: slugify(workspaceName),
    type: "TEAM",
    role: "OWNER"
  });

  await createBrand(workspace.id, session.user.id, {
    name: brandName,
    slug: slugify(brandName),
    niche,
    targetAudience: audience,
    postingLanguage: "en"
  });

  redirect(`/w/${workspace.slug}`);
}
