import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('renders headline + subhead with editorial accent', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Stefan/);
    // Headline h1 contém "multi-agente" (SplitText pode wrappear em divs durante anim;
    // toContainText é estável independente de opacity/animação).
    await expect(page.getByRole('heading', { level: 1 })).toContainText('multi-agente');
    // Subhead técnica (no hero — Footer também tem essa string, então pegue a primeira).
    await expect(page.getByText(/AI Product Engineer/i).first()).toBeVisible();
    // CTA principal — Ver os produtos.
    await expect(page.getByRole('link', { name: /Ver os produtos/ })).toBeVisible();
  });

  test('has correct lang attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('pt-BR');
    await expect(page).toHaveURL('/');
  });

  test('floating dock + footer rendered globally', async ({ page }) => {
    await page.goto('/');
    // FloatingDock = <nav> com aria-label="Navegação principal"
    await expect(page.getByRole('navigation', { name: /Navegação principal/i })).toBeVisible();
    // Footer contém domínio (parcial match)
    await expect(page.getByText(/stefanscrepka\.dev/)).toBeVisible();
  });

  test('anchor sections placeholder exist', async ({ page }) => {
    await page.goto('/');
    // 4 anchors esperados pelo dock.
    for (const id of ['work', 'process', 'manifesto', 'contato']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });
});

test.describe('design-system', () => {
  test('renders showcase route with 4 sections', async ({ page }) => {
    await page.goto('/design-system');
    await expect(page).toHaveTitle(/Design System/);
    for (const id of ['tokens', 'primitives', 'dialogs', 'effects']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });
});
