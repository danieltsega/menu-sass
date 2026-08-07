import { expect, type Page, type APIRequestContext } from "@playwright/test";

export const API_URL = "http://localhost:4000/api";
export const SUPER_ADMIN = { email: "danieltsega6658@gmail.com", password: "password123" };
export const CAFE_ADMIN = { email: "cafe@brewbean.com", password: "password123" };

export function uniqueName(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function apiLogin(request: APIRequestContext, email: string, password: string) {
  const res = await request.post(`${API_URL}/auth/login`, {
    data: { email, password },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.data as {
    user: { _id: string; name: string; email: string; role: string };
    tokens: { accessToken: string; refreshToken: string };
  };
}

export async function superToken(request: APIRequestContext): Promise<string> {
  return (await apiLogin(request, SUPER_ADMIN.email, SUPER_ADMIN.password)).tokens.accessToken;
}

export async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/portal");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
}

export async function loginAndLogout(page: Page, email: string, password: string) {
  await loginAs(page, email, password);
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/portal/);
}

export async function deleteCafeViaApi(request: APIRequestContext, cafeId: string) {
  const token = await superToken(request);
  await request.delete(`${API_URL}/cafes/${cafeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteUserViaApi(request: APIRequestContext, userId: string) {
  const token = await superToken(request);
  await request.delete(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function resetCafePassword(request: APIRequestContext, newPassword: string) {
  const token = (await apiLogin(request, CAFE_ADMIN.email, newPassword)).tokens.accessToken;
  const res = await request.post(`${API_URL}/auth/change-password`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { currentPassword: newPassword, newPassword: CAFE_ADMIN.password },
  });
  expect(res.status()).toBe(200);
}

export async function cafeIdOf(request: APIRequestContext): Promise<string> {
  const token = (await apiLogin(request, CAFE_ADMIN.email, CAFE_ADMIN.password)).tokens.accessToken;
  const res = await request.get(`${API_URL}/cafes/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.data._id as string;
}

export async function resetCafeDescription(request: APIRequestContext) {
  const token = (await apiLogin(request, CAFE_ADMIN.email, CAFE_ADMIN.password)).tokens.accessToken;
  const res = await request.put(`${API_URL}/cafes/me`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { description: "" },
  });
  expect(res.status()).toBe(200);
}

export async function deleteMenuItemsByPrefix(request: APIRequestContext, prefix: string) {
  const cafeId = await cafeIdOf(request);
  const token = (await apiLogin(request, CAFE_ADMIN.email, CAFE_ADMIN.password)).tokens.accessToken;
  const headers = { Authorization: `Bearer ${token}` };

  const dishesRes = await request.get(`${API_URL}/cafes/${cafeId}/dishes`, { headers });
  const dishes = (await dishesRes.json()).data as { _id: string; name: string }[];
  for (const dish of dishes) {
    if (dish.name.startsWith(prefix)) {
      await request.delete(`${API_URL}/cafes/${cafeId}/dishes/${dish._id}`, { headers });
    }
  }

  const catsRes = await request.get(`${API_URL}/cafes/${cafeId}/categories`, { headers });
  const cats = (await catsRes.json()).data as { _id: string; name: string }[];
  for (const cat of cats) {
    if (cat.name.startsWith(prefix)) {
      await request.delete(`${API_URL}/cafes/${cafeId}/categories/${cat._id}`, { headers });
    }
  }
}

export async function openRowMenu(page: Page, name: string) {
  const row = page.getByText(name, { exact: true }).locator(
    "xpath=ancestor::div[contains(concat(' ', normalize-space(@class), ' '), ' bg-card ')][1]"
  );
  await row.getByRole("button").click();
  return row;
}
