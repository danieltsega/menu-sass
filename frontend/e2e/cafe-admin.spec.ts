import { test, expect } from "@playwright/test";
import {
  loginAs,
  uniqueName,
  CAFE_ADMIN,
  resetCafePassword,
  resetCafeDescription,
  deleteMenuItemsByPrefix,
  openRowMenu,
} from "./helpers";
import path from "path";

const PREFIX = "E2E";

test.afterEach(async ({ request }) => {
  await deleteMenuItemsByPrefix(request, PREFIX).catch(() => {});
});

test.describe("cafe admin", () => {
  test("shows cafe dashboard stats", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    await expect(page.getByRole("heading", { name: "Cafe Dashboard" })).toBeVisible();
    await expect(page.getByText("Total Dishes")).toBeVisible();
    await expect(page.getByText("Categories")).toBeVisible();
    await expect(page.getByText("Available")).toBeVisible();
    await expect(page.getByText("Avg. Price")).toBeVisible();
    await expect(page.getByText("ETB")).toBeVisible();
  });

  test("shows cafe admin tabs without Cafes or Users", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    for (const label of ["Dashboard", "Menu", "Dishes", "Cafe"]) {
      await expect(page.getByRole("link", { name: label })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Cafes" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Users" })).not.toBeVisible();
  });

  test("creates, edits, and deletes a category", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    const catName = uniqueName(`${PREFIX} Cat`);
    await page.getByRole("link", { name: "Menu" }).click();
    await expect(page).toHaveURL(/\/admin\/categories/);

    await expect(page.getByText(`${PREFIX}`).first()).not.toBeVisible();

    await page.getByRole("button", { name: "+ Add Category" }).click();
    await page.getByLabel("Category Name").fill(catName);
    await page.getByRole("button", { name: "Add Category" }).click();
    await expect(page.getByText("Category added")).toBeVisible();
    await expect(page.getByText(catName)).toBeVisible();

    const editedName = uniqueName(`${PREFIX} Cat Ed`);
    const row = await openRowMenu(page, catName);
    await row.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Category Name").fill(editedName);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("Category updated")).toBeVisible();
    await expect(page.getByText(editedName)).toBeVisible();

    const delRow = await openRowMenu(page, editedName);
    await delRow.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByText("Category removed")).toBeVisible();
    await expect(page.getByText(editedName)).not.toBeVisible();
  });

  test("searches, filters, and CRUDs dishes", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    const dishName = uniqueName(`${PREFIX} Dish`);
    await page.getByRole("link", { name: "Dishes" }).click();
    await expect(page).toHaveURL(/\/admin\/dishes/);
    await expect(page.getByText("8 total dishes")).toBeVisible();

    await page.getByPlaceholder("Search dishes...").fill("Espresso");
    await expect(page.getByText("Espresso")).toBeVisible();
    await expect(page.getByText("Croissant")).not.toBeVisible();
    await page.getByPlaceholder("Search dishes...").fill("");

    await page.getByRole("button", { name: "Cold Drinks", exact: true }).click();
    await expect(page.getByText("Matcha Latte")).toBeVisible();
    await expect(page.getByText("Classic Espresso")).not.toBeVisible();
    await page.getByRole("button", { name: "All", exact: true }).click();

    await page.getByRole("button", { name: "+ Add Dish" }).click();
    await page.getByLabel("Dish Name").fill(dishName);
    await page.getByLabel("Price (ETB)").fill("12.5");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Coffee" }).click();
    await page.getByLabel("Description").fill("Created by E2E");
    await page.getByPlaceholder("Arabica beans").fill("Test ingredient");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.getByRole("button", { name: "Add Dish" }).click();
    await expect(page.getByText("Dish added")).toBeVisible();
    await expect(page.getByText(dishName)).toBeVisible();

    const dishRow = await openRowMenu(page, dishName);
    await dishRow.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Price (ETB)").fill("15");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("Dish updated")).toBeVisible();
    const updatedRow = page.getByText(dishName, { exact: true }).locator(
      "xpath=ancestor::div[contains(concat(' ', normalize-space(@class), ' '), ' bg-card ')][1]"
    );
    await expect(updatedRow).toContainText("15.00 ETB");

    const delRow = await openRowMenu(page, dishName);
    await delRow.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByText("Dish removed")).toBeVisible();
    await expect(page.getByText(dishName)).not.toBeVisible();
  });

  test("edits cafe info and uploads a logo", async ({ page }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    await page.goto("/admin/cafe");
    await expect(page).toHaveURL(/\/admin\/cafe/);
    await expect(page.getByText("Cafe Settings")).toBeVisible();

    const desc = uniqueName(`${PREFIX} desc`);
    await page.getByRole("button", { name: "Edit Cafe Info" }).click();
    await page.getByLabel("Description").fill(desc);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("Cafe info updated")).toBeVisible();
    await expect(page.getByText(desc)).toBeVisible();

    await page.getByRole("button", { name: "Edit Cafe Info" }).click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, "fixtures", "test-logo.png"));
    await expect(page.getByRole("button", { name: "Remove" })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByRole("button", { name: "Choose Image" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();

    await resetCafeDescription(page.request);
  });

  test("change password: rejects mismatch, then accepts new password", async ({ page, request }) => {
    await loginAs(page, CAFE_ADMIN.email, CAFE_ADMIN.password);
    const newPassword = uniqueName("E2EPass");

    await page.goto("/admin/cafe");
    await expect(page).toHaveURL(/\/admin\/cafe/);

    await page.getByLabel("Current Password").fill(CAFE_ADMIN.password);
    await page.getByLabel("New Password", { exact: true }).fill("aaaaaa");
    await page.getByLabel("Confirm New Password", { exact: true }).fill("bbbbbb");
    await page.getByRole("button", { name: "Update Password" }).click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    await page.getByLabel("Current Password").fill(CAFE_ADMIN.password);
    await page.getByLabel("New Password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm New Password", { exact: true }).fill(newPassword);
    await page.getByRole("button", { name: "Update Password" }).click();
    await expect(page.getByText("Password updated successfully")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/portal/);

    await page.getByLabel("Email").fill(CAFE_ADMIN.email);
    await page.getByLabel("Password").fill(CAFE_ADMIN.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();

    await page.getByLabel("Password").fill(newPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin/);

    await resetCafePassword(request, newPassword);
  });
});
