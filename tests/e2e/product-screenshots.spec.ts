import path from 'node:path';
import { test } from '@playwright/test';

// Captura screenshots dos produtos reais do Stefan.
// Estetica MD: HTML estatico, abre via file://
// Os outros 3 produtos precisam de servers rodando local (config separada).
//
// IMPORTANTE (2026-05-26): STJ + NexaCore captures aqui ATINGEM A TELA DE LOGIN
// (sem sessão autenticada) — assets ruins. Captura MANUAL com sessão logada +
// seed data realista é o caminho atual. Ver `tests/e2e/seed-checklist.md`.

const OUT = path.resolve(process.cwd(), 'public/work-screenshots');

test.describe('Product screenshots — DPR 3x', () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    // DPR 3 (era 2): output 4320×2700 PNG → AVIF crf 32 ~30-50KB.
    // Justificativa: Apple Pro Display XDR + iPad Pro M-series rodam 3x.
    deviceScaleFactor: 3,
  });

  test('estetica-md desktop', async ({ page }) => {
    const filePath = path.resolve(
      'C:\\Users\\Stefan1\\Downloads\\site_estetica_md-main\\site_estetica_md-main\\index.html'
    );
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({
      path: path.join(OUT, 'estetica-md-home.png'),
      fullPage: false,
    });
  });

  test('estetica-md mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const filePath = path.resolve(
      'C:\\Users\\Stefan1\\Downloads\\site_estetica_md-main\\site_estetica_md-main\\index.html'
    );
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({
      path: path.join(OUT, 'estetica-md-mobile.png'),
      fullPage: false,
    });
  });
});

// STJ App capture DESABILITADO neste spec — requer sessão autenticada
// (Google OAuth / magic link). Captura é feita MANUALMENTE no browser do
// Stefan logado em https://stj-app.vercel.app/, e os PNGs entregues são
// convertidos pra AVIF/WebP via script sharp. Ver seed-checklist.md §STJ.
test.describe
  .skip('STJ App — Vercel deploy (requires manual capture)', () => {
    test('stj-app desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('https://stj-app.vercel.app/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3500);
      await page.screenshot({
        path: path.join(OUT, 'stj-app-desktop.png'),
        fullPage: false,
      });
    });

    test('stj-app mobile', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('https://stj-app.vercel.app/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3500);
      await page.screenshot({
        path: path.join(OUT, 'stj-app-mobile.png'),
        fullPage: false,
      });
    });
  });
