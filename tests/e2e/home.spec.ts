import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('renders headline + subhead with editorial accent', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Stefan/);
    // Headline h1 contém "multi-agente" (headline-word-reveal splita por
    // palavra em <span> no servidor; toContainText é estável independente
    // de opacity/animação).
    await expect(page.getByRole('heading', { level: 1 })).toContainText('multi-agente');
    // Subhead técnica (no hero — Footer também tem essa string, então pegue a primeira).
    await expect(page.getByText(/AI Product Engineer/i).first()).toBeVisible();
    // CTA principal — "Ver os 3 produtos →" (W-copy Sprint 5).
    await expect(page.getByRole('link', { name: /Ver os 3 produtos/ })).toBeVisible();
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
    for (const id of ['work', 'manifesto', 'contato']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });
});

test.describe('work routes', () => {
  test('work index renders 4 case studies', async ({ page }) => {
    await page.goto('/work');
    await expect(page).toHaveTitle(/Work/);
    // Links têm href /work/{slug} — busca via href attribute (mais estável que regex name)
    for (const slug of ['content-engine', 'caluna', 'stark', 'estetica-md']) {
      await expect(page.locator(`a[href="/work/${slug}"]`).first()).toBeAttached();
    }
  });

  test('each case study page returns 200 + has hero', async ({ page }) => {
    for (const slug of ['content-engine', 'caluna', 'stark', 'estetica-md']) {
      const resp = await page.goto(`/work/${slug}`);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
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
