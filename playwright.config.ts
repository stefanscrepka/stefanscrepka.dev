import { defineConfig, devices } from '@playwright/test';

// F6 (2026-09-04): PLAYWRIGHT_BASE_URL aponta a suíte pra um servidor já no
// ar (ex.: `next start -p 3001`, a build de produção). Sem a var, o comportamento
// antigo: sobe `pnpm dev` em :3000. Motivo: com reuseExistingServer, QUALQUER
// coisa respondendo em :3000 (no dia, o Langfuse do Docker) era tratada como o
// site — e a suíte inteira falhava com `lang="en"` e 404 sem dizer por quê.
const EXTERNAL_BASE_URL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: process.env.CI ? ['**/product-screenshots.spec.ts', '**/visual-audit.spec.ts'] : [],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: EXTERNAL_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(EXTERNAL_BASE_URL
    ? {}
    : {
        webServer: {
          command: 'pnpm dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120 * 1000,
        },
      }),
});
