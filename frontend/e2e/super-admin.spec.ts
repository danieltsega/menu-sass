import { test, expect } from "@playwright/test";
import {
  loginAs,
  uniqueName,
  SUPER_ADMIN,
  superToken,
  deleteCafeViaApi,
  deleteUserViaApi,
  openRowMenu,
} from "./helpers";

const API_URL = "http://localhost:4000/api";
const PREFIX = "E2E";

test.afterEach(async ({ request }) => {
  const token = await superToken(request);
  const headers = { Authorization: `Bearer ${token}` };
  const cafes = (await (await request.get(`${API_URL}/cafes`, { headers })).json()).data as {
    _id: string;
    name: string;
  }[];
  for (const cafe of cafes) {
    if (cafe.name.startsWith(PREFIX)) await deleteCafeViaApi(request, cafe._id);
  }
  const users = (await (await request.get(`${API_URL}/users`, { headers })).json()).data as {
    _id: string;
    email: string;
  }[];
  for (const user of users) {
    if (user.email.toLowerCase().startsWith(PREFIX.toLowerCase())) await deleteUserViaApi(request, user._id);
  }
});

test.describe("super admin", () => {
  test("shows super admin dashboard stats", async ({ page }) => {
    await loginAs(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    await expect(page.getByRole("heading", { name: "Super Admin Dashboard" })).toBeVisible();
    await expect(page.getByText("Total Cafes")).toBeVisible();
    await expect(page.getByText("Total Dishes")).toBeVisible();
    await expect(page.getByText("Active Admins")).toBeVisible();
    await expect(page.getByRole("main").getByText("Users", { exact: true })).toBeVisible();
  });

  test("shows super admin tabs with Cafes and Users but no menu tabs", async ({ page }) => {
    await loginAs(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    for (const label of ["Dashboard", "Cafes", "Users"]) {
      await expect(page.getByRole("link", { name: label })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Menu" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Dishes" })).not.toBeVisible();
  });

  test("lists cafes with admin name and dish count", async ({ page }) => {
    await loginAs(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    await page.getByRole("link", { name: "Cafes" }).click();
    await expect(page).toHaveURL(/\/admin\/cafes/);
    await expect(page.getByText("Brew & Bean")).toBeVisible();
    await expect(page.getByText("Cafe Owner · 8 dishes")).toBeVisible();
  });

  test("creates, edits, deactivates, and deletes a cafe", async ({ page }) => {
    await loginAs(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    const cafeName = uniqueName(`${PREFIX} Cafe`);
    await page.getByRole("link", { name: "Cafes" }).click();
    await page.getByRole("button", { name: "+ Add Cafe" }).click();
    await page.getByLabel("Cafe Name").fill(cafeName);
    await page.getByLabel("Slug").fill(cafeName.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Cafe Owner" }).click();
    await page.getByRole("button", { name: "Create Cafe" }).click();
    await expect(page.getByText("Cafe created")).toBeVisible();
    await expect(page.getByText(cafeName)).toBeVisible();

    const editedName = uniqueName(`${PREFIX} Cafe Ed`);
    const row = await openRowMenu(page, cafeName);
    await row.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Cafe Name").fill(editedName);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("Cafe updated")).toBeVisible();

    const activeRow = await openRowMenu(page, editedName);
    await activeRow.getByRole("button", { name: "Deactivate" }).click();
    await expect(page.getByText("Cafe deactivated")).toBeVisible();

    const delRow = await openRowMenu(page, editedName);
    await delRow.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByText("Cafe removed")).toBeVisible();
    await expect(page.getByText(editedName)).not.toBeVisible();
  });

  test("creates, edits, deactivates, and deletes a user", async ({ page }) => {
    await loginAs(page, SUPER_ADMIN.email, SUPER_ADMIN.password);
    const userName = uniqueName(`${PREFIX}user`);
    const email = `${userName.replace(/-/g, "").toLowerCase()}@example.com`;
    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("button", { name: "+ Add User" }).click();
    await page.getByLabel("Full Name").fill(userName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Add User" }).click();
    await expect(page.getByText("User created")).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();

    const editedName = `${userName}-ed`;
    const row = await openRowMenu(page, email);
    await row.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Full Name").fill(editedName);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("User updated")).toBeVisible();
    await expect(page.getByText(editedName)).toBeVisible();

    const activeRow = await openRowMenu(page, email);
    await activeRow.getByRole("button", { name: "Deactivate" }).click();
    await expect(page.getByText("User deactivated")).toBeVisible();

    const delRow = await openRowMenu(page, email);
    await delRow.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByText("User removed")).toBeVisible();
  });
});