import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('tablespark.onboarding.dismissed.v1', 'true');
    localStorage.setItem('tablespark.locale.v1', 'hi');
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
});

test('table validation stays localized in Hindi', async ({ page }) => {
  await page.getByRole('spinbutton', { name: 'पहाड़ा प्रारंभ' }).fill('6');

  await expect(page.getByRole('alert')).toContainText('पहाड़े की सेटिंग्स अमान्य हैं।');
});

test('practice setup failure stays localized in Hindi', async ({ page }) => {
  await page.getByRole('button', { name: 'अभ्यास' }).click();
  await page.getByRole('spinbutton', { name: 'न्यूनतम' }).fill('20');
  await page.getByRole('spinbutton', { name: 'अधिकतम' }).fill('2');
  await page.getByRole('button', { name: 'अभ्यास शुरू करें' }).click();

  await expect(page.getByRole('status')).toContainText('अभ्यास शुरू नहीं हो सका।');
});

test('invalid backup feedback stays localized in Hindi', async ({ page }) => {
  await page.getByRole('button', { name: 'सेटिंग्स' }).click();
  page.once('dialog', async (dialog) => dialog.accept());

  await page.getByLabel('बैकअप आयात करें').setInputFiles({
    name: 'invalid-tablespark-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{invalid-json'),
  });

  await expect(page.getByRole('status')).toContainText('आयात विफल हुआ।');
});
