import path from 'node:path';
import { test } from '@playwright/test';

const OUT = path.resolve(process.cwd(), 'screenshots-2026-05-21');

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/work', name: 'work-index' },
  { path: '/work/content-engine', name: 'work-content-engine' },
  { path: '/work/nexacore', name: 'work-nexacore' },
  { path: '/work/stj-app', name: 'work-stj-app' },
  { path: '/work/estetica-md', name: 'work-estetica-md' },
  { path: '/playground', name: 'playground' },
  { path: '/design-system', name: 'design-system' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

for (const viewport of VIEWPORTS) {
  test.describe(`visual audit ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ROUTES) {
      test(`${route.name}`, async ({ page }) => {
        await page.goto(route.path, { waitUntil: 'networkidle' });
        // Aguarda mais que 1500ms — hero CTAs tem delay 0.6s + duration 0.35s, subhead delay 0.4s.
        await page.waitForTimeout(2000);
        await page.screenshot({
          path: path.join(OUT, `${viewport.name}-${route.name}-fullpage.png`),
          fullPage: true,
        });
        await page.screenshot({
          path: path.join(OUT, `${viewport.name}-${route.name}-viewport.png`),
          fullPage: false,
        });
      });
    }

    test('home-sections-scroll-stops', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const sections = ['hero', 'work', 'skills', 'manifesto', 'contato'];
      for (const id of sections) {
        await page.evaluate((el) => {
          document.getElementById(el)?.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, id);
        await page.waitForTimeout(700);
        await page.screenshot({
          path: path.join(OUT, `${viewport.name}-home-stop-${id}.png`),
          fullPage: false,
        });
      }
    });
  });
}
