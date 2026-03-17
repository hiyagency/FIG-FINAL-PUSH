import { expect, test } from "@playwright/test";

test("marketing page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /private studio/i })).toBeVisible();
});

test("private workspace renders", async ({ page }) => {
  await page.goto("/w/private-studio");
  await expect(page.getByRole("heading", { name: /private studio/i })).toBeVisible();
});
