import { expect, test } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'zaquariah.dev', exact: true })).toBeVisible();
});

test('projects page loads or is disabled', async ({ page }) => {
  const res = await page.goto('/projects');
  if (res?.status() === 404) return;
  await expect(page.locator('h1')).toContainText('Projects');
});

test('writing page loads or is disabled', async ({ page }) => {
  const res = await page.goto('/writing');
  // writing_enabled may be false in the test DB — 404 is the correct behavior
  if (res?.status() === 404) return;
  await expect(page.locator('h1')).toContainText('Writing');
});

test('experience page loads', async ({ page }) => {
  await page.goto('/experience');
  await expect(page.locator('h1')).toContainText('Experience');
});
