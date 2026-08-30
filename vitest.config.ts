import { defineConfig } from 'vitest/config';

// F4 (2026-08-29): sem config, o vitest globava TUDO — inclusive as specs do
// Playwright (tests/e2e/*.spec.ts, que nao rodam sob vitest) e os testes de
// repos de terceiros vendorizados em .agents/. `pnpm test` reportava
// "34 failed | 1 passed" com 4 testes reais passando. Escopo explicito resolve.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules/**', '.agents/**', 'tests/e2e/**', '.next/**', '_audit/**'],
    environment: 'node',
  },
});
