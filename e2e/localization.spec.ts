import { expect, test } from '@playwright/test';

test('Hindi interface selection persists across reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('combobox', { name: 'Language / भाषा' }).selectOption('hi');

  await expect(page.getByRole('heading', { name: 'सेटिंग्स' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'पहाड़े' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'अभ्यास' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');

  await page.reload();
  await expect(page.getByRole('button', { name: 'पहाड़े' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'सेटिंग्स' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
});
