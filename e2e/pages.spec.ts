import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'zaquariah.dev' })).toBeVisible();
});

test('work page loads', async ({ page }) => {
  await page.goto('/work');
  await expect(page.locator('h1')).toContainText('Work');
});

test('writing page loads', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.locator('h1')).toContainText('Writing');
});

test('experience page loads', async ({ page }) => {
  await page.goto('/experience');
  await expect(page.locator('h1')).toContainText('Experience');
});
