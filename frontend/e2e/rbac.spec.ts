import { test, expect } from "@playwright/test";
import { loginAs, CAFE_ADMIN } from "./helpers";

test.describe("role-based access control", () => {
  test("cafe admin cannot access the users page", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    await page.goto("/admin/users");
    await expect(page.getByText("Access restricted to super admins.")).toBeVisible();
  });

  test("cafe admin cannot access the cafes page", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    await page.goto("/admin/cafes");
    await expect(page.getByText("Access restricted to super admins.")).toBeVisible();
  });
});