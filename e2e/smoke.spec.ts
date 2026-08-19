import { expect, test } from '@playwright/test';

test('generate a table and complete a deterministic practice question', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Multiplication tables' })).toBeVisible();

  await page.getByRole('spinbutton', { name: 'Table start' }).fill('9');
  await expect(page.getByText('9 × 1 = 9')).toBeVisible();

  await page.getByRole('button', { name: 'Practice' }).click();
  await page.getByRole('spinbutton', { name: 'Minimum' }).fill('5');
  await page.getByRole('spinbutton', { name: 'Maximum' }).fill('5');
  await page.getByRole('spinbutton', { name: 'Questions' }).fill('1');
  await page.getByRole('button', { name: 'Start drill' }).click();
  await expect(page.getByText('5 × 5 = ?')).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Your answer' }).fill('25');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Score 1 of 1')).toBeVisible();
});

test('settings allow local profile creation and appearance controls', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('textbox', { name: 'New profile name' }).fill('Classroom');
  await page.getByRole('button', { name: 'Add profile' }).click();
  await expect(page.getByTitle('Active offline profile')).toHaveText('Classroom');
  await page.getByRole('checkbox', { name: 'Large-text classroom mode' }).check();
  await expect(page.locator('html')).toHaveClass(/large-text/);
});
