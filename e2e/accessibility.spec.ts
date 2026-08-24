import { expect, test, type Page } from '@playwright/test';

async function expectLabeledFormControls(page: Page) {
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
});

test('interactive form controls have accessible labels', async ({ page }) => {
  await page.goto('/');
  await expectLabeledFormControls(page);

  await page.getByRole('button', { name: 'Practice', exact: true }).click();
  await expectLabeledFormControls(page);

  await page.getByRole('button', { name: 'Progress', exact: true }).click();
  await expectLabeledFormControls(page);

  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expectLabeledFormControls(page);
});
