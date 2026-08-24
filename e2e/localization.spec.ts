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

test('Hindi compact primary navigation stays fully visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('combobox', { name: 'Language / भाषा' }).selectOption('hi');

  const buttons = page
    .getByRole('navigation', { name: 'मुख्य नेविगेशन' })
    .getByRole('button');

  for (let index = 0; index < (await buttons.count()); index += 1) {
    await expect(buttons.nth(index)).toBeInViewport({ ratio: 1 });
  }
});

test('About exposes version 2.0.12 in English and Hindi', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('2.0.12');

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('combobox', { name: 'Language / भाषा' }).selectOption('hi');
  await page.getByRole('button', { name: 'परिचय' }).click();
  await expect(page.getByRole('main')).toContainText('2.0.12');
});
