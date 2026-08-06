import { test, expect } from "@playwright/test";

test.describe("public menu", () => {
  test("renders cafe header, category chips, and dishes", async ({ page }) => {
    await page.goto("/menu/brew-and-bean");

    await expect(page.getByText("Brew & Bean").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Coffee" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Pastries" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Breakfast" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cold Drinks" })).toBeVisible();
  });

  test("switching category chips updates the visible dishes", async ({ page }) => {
    await page.goto("/menu/brew-and-bean");

    await expect(page.getByText("ETB").first()).toBeVisible();

    const breakfastCount = await page.getByText("ETB").count();
    expect(breakfastCount).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Cold Drinks" }).click();
    const coldCount = await page.getByText("ETB").count();
    expect(coldCount).toBeGreaterThan(0);
    expect(coldCount).not.toBe(breakfastCount);
  });

  test("shows fallback message for an unknown cafe slug", async ({ page }) => {
    await page.goto("/menu/does-not-exist");
    await expect(page.getByText("Menu not available for this cafe.")).toBeVisible();
  });
});
