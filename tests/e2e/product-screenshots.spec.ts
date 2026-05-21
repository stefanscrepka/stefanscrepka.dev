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

// STJ App + NexaCore + Content Engine dashboard precisam de servers locais.
// Pra cada um: rodar `PORT=X pnpm dev` em terminal separado, depois rodar este spec
// com env var `STJ_URL=http://localhost:3001` etc apontando pra ele.
test.describe('STJ App — se servidor ativo', () => {
  test.skip(!process.env.STJ_URL, 'STJ_URL nao fornecida, skip');

  test('stj-app dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(process.env.STJ_URL || 'http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({
      path: path.join(OUT, 'stj-app-dashboard.png'),
      fullPage: false,
    });
  });
});
