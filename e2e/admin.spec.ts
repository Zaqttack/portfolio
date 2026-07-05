import { expect, test } from '@playwright/test';

test('admin gate redirects unauthenticated to login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
});

test('admin login page shows magic link form', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('button', { name: /send/i })).toBeVisible({ timeout: 10000 });
});
