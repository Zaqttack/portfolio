import { expect, test } from '@playwright/test';

test('admin gate blocks unauthenticated access', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('admin gate accepts correct passphrase', async ({ page }) => {
  await page.goto('/admin');
  await page.locator('input[type="password"]').fill('raptor');
  await page.keyboard.press('Enter');
  await expect(page.locator('text=Profile')).toBeVisible();
});
