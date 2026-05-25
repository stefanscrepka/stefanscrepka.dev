# stefanscrepka.dev

Portfolio premium de Stefan Heinz Screpka — AI Product Engineer.

> Construo IA multi-agente em produção — e o produto inteiro ao redor dela.

## Stack

- **Framework**: Next.js 16 App Router · React 19.2 · TypeScript strict
- **Styling**: Tailwind CSS v4 · OKLCH tokens · Geist Sans + Geist Mono · PP Editorial New italic accent
- **Motion**: Motion 12 · GSAP 3.15 + ScrollTrigger · Lenis 1.3 · Shiki SSR
- **3D**: react-three-fiber + drei (custom, sem Spline)
- **Forms**: react-hook-form + Zod 4 + Server Actions
- **Email**: Resend + React Email
- **Observability**: Sentry · Vercel Analytics · Speed Insights
- **Tooling**: Biome 2.4 · ESLint mínimo (react-hooks) · Playwright E2E · Lighthouse CI
- **Deploy**: Vercel · Fluid Compute · Node 22 LTS

## Scripts

```bash
pnpm dev        # Dev com Turbopack
pnpm build      # Production build
pnpm start      # Production server
pnpm lint       # Biome check (lint + format)
pnpm lint:fix   # Biome auto-fix
pnpm format     # Biome format
pnpm typecheck  # tsc --noEmit
pnpm test       # Vitest unit
pnpm test:e2e   # Playwright E2E
pnpm lhci       # Lighthouse CI
pnpm analyze    # Bundle analyzer
```

## Setup local

```bash
nvm use            # Node 22 LTS
pnpm install
cp .env.example .env.local   # editar com keys reais (Sentry, Resend, Cal.com)
pnpm dev
```

## Estrutura

```
app/                Routes Next 16 App Router
components/         UI primitives + effects + sections
content/work/       MDX case studies (Phase 4)
lib/                Utilities + animation sync
hooks/              Client hooks (lenis, mounted, reduced-motion-safe)
emails/             React Email templates
public/             Static assets (fonts, screenshots, og, icons)
tests/e2e/          Playwright specs
```

## Plano completo

`C:\Users\Stefan1\Downloads\Portfolio\Plano-Portfolio\` — 8 documentos (posicionamento, IA, direção visual, stack, seções detalhadas, performance, roadmap, critérios de aceitação).

## Critical gotchas baked-in (FASE 1)

| # | Gotcha | Mitigação |
|---|---|---|
| 1 | `cookies()`/`headers()` async em Next 16 | Helpers em `lib/server-utils.ts` |
| 2 | Tailwind v4 + shadcn HSL → OKLCH | Tokens direto OKLCH em `app/globals.css` |
| 3 | GSAP + Lenis scroll sync | `lib/animation/gsap-lenis-sync.ts` |
| 4 | r3f Canvas hydration mismatch | Canvas via `dynamic({ ssr: false })` (Phase 3) |
| 5 | Server Actions FormData vs RHF JSON | `lib/server-actions/form-data-bridge.ts` |
| 6 | Biome sem `react-hooks/exhaustive-deps` | ESLint minimal em paralelo |
| 7 | `noUncheckedIndexedAccess` array undefined | Convenção: destructuring / optional chaining |
| 8 | `useReducedMotion` SSR mismatch | `useReducedMotionSafe()` wrap `useMounted` |
| 9 | Vercel Fluid cold start + Resend | Server Action direct |

## Deploy

```bash
pnpm dlx vercel link       # uma vez
pnpm dlx vercel            # preview
pnpm dlx vercel --prod     # production
```

Domain: `stefanscrepka.dev` (primário) ou `stefanscrepka.com.br` (fallback).

## Licença

MIT © Stefan Heinz Screpka
