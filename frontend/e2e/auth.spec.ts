import { test, expect } from "@playwright/test";
import { loginAs, loginAndLogout, SUPER_ADMIN, CAFE_ADMIN } from "./helpers";

test.describe("authentication", () => {
  test("rejects invalid credentials with an error toast", async ({ page }) => {
    await page.goto("/portal");
    await page.getByLabel("Email").fill(SUPER_ADMIN.email);
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password")).toBeVisible();
    await expect(page).toHaveURL(/\/portal/);
  });

  test("logs in as super admin and shows the super admin dashboard", async ({ page }) => {
    await loginAs(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    await expect(page.getByRole("heading", { name: "Super Admin Dashboard" })).toBeVisible();
    await expect(page.getByText(SUPER_ADMIN.email)).not.toBeVisible();
  });

  test("logs in as cafe admin and shows the cafe dashboard", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    await expect(page.getByRole("heading", { name: "Cafe Dashboard" })).toBeVisible();
    await expect(page.getByText("Cafe Owner")).toBeVisible();
  });

  test("restores the session on reload", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Cafe Dashboard" })).toBeVisible({ timeout: 15_000 });
  });

  test("redirects unauthenticated users away from admin routes", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/portal/);
  });

  test("logs out and blocks access again", async ({ page }) => {
    await loginAndLogout(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    await expect(page).toHaveURL(/\/portal/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/portal/);
  });
});
