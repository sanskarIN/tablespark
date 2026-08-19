import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('tablespark.onboarding.dismissed.v1', 'true');
    localStorage.setItem('tablespark.locale.v1', 'en');
  });
  await page.goto('/');
});

test('practice worksheet keeps configured paper and columns in print mode', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Printable output' }).selectOption('worksheet');
  await page.getByRole('combobox', { name: 'Paper size' }).selectOption('letter');
  await page.getByRole('combobox', { name: 'Print columns' }).selectOption('2');

  const worksheet = page.locator('.worksheet-page');
  await expect(worksheet).toHaveAttribute('data-output', 'worksheet');
  await expect(worksheet).toHaveAttribute('data-paper-size', 'letter');
  await expect(worksheet).toHaveCSS('--worksheet-columns', '2');

  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeHidden();
  await expect(page.getByRole('heading', { name: 'TableSpark multiplication worksheet' })).toBeVisible();
  await expect(page.getByText('Name: ______________________________')).toBeVisible();
  await expect(page.getByText('Date: ______________________________')).toBeVisible();
});

test('answer key omits learner metadata in print mode', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Printable output' }).selectOption('answer-key');
  await page.emulateMedia({ media: 'print' });

  await expect(page.getByRole('heading', { name: 'TableSpark multiplication answer key' })).toBeVisible();
  await expect(page.getByText('Name: ______________________________')).toHaveCount(0);
  await expect(page.getByText('Date: ______________________________')).toHaveCount(0);
  await expect(page.getByText('2 × 1 = 2')).toBeVisible();
});
