import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('renders bootstrap page with brand', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Stefan/);
    await expect(page.getByText('stefanscrepka.dev', { exact: true })).toBeVisible();
    await expect(page.getByText(/multi-agente/i)).toBeVisible();
  });

  test('has correct lang attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('pt-BR');
    await expect(page).toHaveURL('/');
  });
});
