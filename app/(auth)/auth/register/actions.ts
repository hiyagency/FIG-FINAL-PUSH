"use server";

import { redirect } from "next/navigation";

import { registerUser } from "@/modules/auth/service";

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const timezone = String(formData.get("timezone") || "UTC");

  await registerUser({
    name,
    email,
    password,
    timezone
  });

  redirect("/auth/login?registered=1");
}
