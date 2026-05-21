import path from 'node:path';
import { test } from '@playwright/test';

// Captura screenshots dos produtos reais do Stefan.
// Estetica MD: HTML estatico, abre via file://
// Os outros 3 produtos precisam de servers rodando local (config separada).

const OUT = path.resolve(process.cwd(), 'public/work-screenshots');

test.describe('Product screenshots — DPR 2x', () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
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

test.describe('STJ App — Vercel deploy', () => {
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
