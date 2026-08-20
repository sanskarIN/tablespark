import { expect, test } from '@playwright/test';

async function expectLabeledFormControls(page: import('@playwright/test').Page) {
  const unlabeled = await page.locator('input, select, textarea').evaluateAll((elements) =>
    elements
      .filter((element) => {
        const control = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const hasAriaLabel = Boolean(control.getAttribute('aria-label'));
        const labelledBy = control.getAttribute('aria-labelledby');
        const hasAriaLabelledBy = Boolean(labelledBy && document.getElementById(labelledBy));
        const hasNativeLabel = control.labels !== null && control.labels.length > 0;
        return !hasAriaLabel && !hasAriaLabelledBy && !hasNativeLabel;
      })
      .map((element) => element.outerHTML),
  );

  expect(unlabeled).toEqual([]);
}

test('primary landmarks and skip navigation remain accessible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
    'href',
    '#main-content',
  );
  await expectLabeledFormControls(page);
});

test('major views keep labeled controls and one main landmark', async ({ page }) => {
  await page.goto('/');

  for (const view of ['Practice', 'Progress', 'Settings', 'About']) {
    await page.getByRole('button', { name: view }).click();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expectLabeledFormControls(page);
  }
});

test('images expose alt attributes and the shortcut reference is keyboard reachable', async ({ page }) => {
  await page.goto('/');

  const imagesWithoutAlt = await page.locator('img').evaluateAll((images) =>
    images.filter((image) => !image.hasAttribute('alt')).map((image) => image.outerHTML),
  );
  expect(imagesWithoutAlt).toEqual([]);

  await page.keyboard.press('Shift+/');
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toHaveCount(0);
});
