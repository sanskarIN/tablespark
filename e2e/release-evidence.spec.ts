import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const captureEnabled = process.env.CAPTURE_RELEASE_EVIDENCE === '1';
const outputDirectory = 'test-results/release-evidence';

async function prepareApp(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('tablespark.onboarding.dismissed.v1', 'true');
    localStorage.setItem('tablespark.locale.v1', 'en');
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Multiplication tables' })).toBeVisible();
}

async function selectTheme(page: Page, theme: 'light' | 'dark') {
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('combobox', { name: 'Theme' }).selectOption(theme);
  await page.getByRole('button', { name: 'Tables' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

async function capture(page: Page, filename: string) {
  await mkdir(outputDirectory, { recursive: true });
  await page.screenshot({
    path: `${outputDirectory}/${filename}`,
    fullPage: true,
    animations: 'disabled',
  });
}

test.describe('release visual evidence', () => {
  test.skip(!captureEnabled, 'Set CAPTURE_RELEASE_EVIDENCE=1 to generate browser evidence.');

  test('captures light wide layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await prepareApp(page);
    await selectTheme(page, 'light');
    await capture(page, 'tables-light-wide.png');
  });

  test('captures dark wide layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await prepareApp(page);
    await selectTheme(page, 'dark');
    await capture(page, 'tables-dark-wide.png');
  });

  test('captures light compact layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepareApp(page);
    await selectTheme(page, 'light');
    await capture(page, 'tables-light-compact.png');
  });

  test('captures dark compact layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await prepareApp(page);
    await selectTheme(page, 'dark');
    await capture(page, 'tables-dark-compact.png');
  });
});
