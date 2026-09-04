import path from 'node:path';
import { fileURLToPath } from 'node:url';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import { withBotId } from 'botid/next/config';
import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // F6 (2026-09-04): o case do STJ App saiu do portfólio (decisão do Stefan).
  // A rota já circulou; quem chegar por ela cai no índice, 301.
  async redirects() {
    return [
      { source: '/work/stj-app', destination: '/work', permanent: true },
      // F7 (2026-09-04): o produto foi rebatizado Caluna.
      { source: '/work/nexacore', destination: '/work/caluna', permanent: true },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
  // W-perf (2026-05-25): tree-shaking explícito pros barrel imports pesados.
  // motion/@icons-pack/radix-ui têm muitos módulos não usados que escapam
  // quando o resolver não tem hint. Economia esperada: 15-25 KB gz first-load.
  experimental: {
    optimizePackageImports: [
      'motion',
      'motion/react',
      '@icons-pack/react-simple-icons',
      'radix-ui',
    ],
    // W-audit (2026-06-10): habilita <ViewTransition> (React) pra crossfade
    // de rota — antes a navegação era corte seco. Uso em app/layout.tsx +
    // CSS ::view-transition-* em globals.css. Guia:
    // node_modules/next/dist/docs/01-app/02-guides/view-transitions.md
    viewTransition: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // W-audit (2026-06-10): Next 16 valida `quality` contra esta allowlist
    // (default [75]). CaseStudyCover usa quality={95} (screenshots de UI com
    // texto fino) — sem registrar, dev loga warning por imagem e versões
    // futuras rejeitam a URL otimizada.
    qualities: [75, 95],
    remotePatterns: [],
  },
  async headers() {
    // W-deploy (2026-05-25): CSP completo + COOP + DNS prefetch.
    // 'unsafe-inline' em script-src é necessário pros 3 dangerouslySetInnerHTML
    // em app/layout.tsx (pre-hydration, JSON-LD, easter-egg console) + manifesto
    // signature SVG inline. Pra CSP strict com nonce, ler
    // node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
    // (requer dynamic rendering — perde prerender estático).
    //
    // 'unsafe-eval' SÓ em development — React DevTools usa eval() pra
    // reconstruir callstacks. Em produção, React nunca usa eval (drop em
    // build) então o CSP fica strict.
    //
    // Hosts permitidos:
    //   - script-src: vercel-scripts (Analytics + Speed Insights), cal.com embed
    //   - connect-src: Sentry ingest, Vercel vitals, Cal.com API + websocket
    //   - frame-src: Cal.com modal iframe
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptSrcExtras = isDev ? " 'unsafe-eval'" : '';
    const connectSrcExtras = isDev ? ' ws://localhost:* http://localhost:*' : '';
    const cspDirectives = [
      "default-src 'self'",
      // blob: é necessário pros web workers do Three.js/drei (troika-text):
      // eles nascem como worker blob: e chamam importScripts(blob:) — o load
      // de script DENTRO do worker é governado por script-src (não worker-src).
      // Sem isso, /playground logava 12 erros "importScripts failed" (audit
      // 2026-06-10). Com 'unsafe-inline' já presente, blob: não amplia a
      // superfície de forma relevante.
      `script-src 'self' 'unsafe-inline' blob:${scriptSrcExtras} https://va.vercel-scripts.com https://vitals.vercel-insights.com https://app.cal.com https://embed.cal.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self' https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://va.vercel-scripts.com https://vitals.vercel-insights.com https://app.cal.com https://api.cal.com wss://app.cal.com${connectSrcExtras}`,
      'frame-src https://app.cal.com https://embed.cal.com',
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ];
    // upgrade-insecure-requests SÓ em prod (em dev, forçaria http→https
    // em localhost e quebraria recursos sobre HTTP).
    if (!isDev) {
      cspDirectives.push('upgrade-insecure-requests');
    }
    const csp = cspDirectives.join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()',
          },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      // Long-cache para assets static custom (fontes/SVG/AVIF/WebP/MP4/WebM em
      // public/). Next/Vercel já injetam Cache-Control automático em
      // /_next/static/* hasheados — não duplicar (gera warning em dev).
      {
        source: '/:path*\\.(woff2|otf|ttf|avif|webp|svg|mp4|webm)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

// W-deploy (2026-05-25):
//   - withBotId: adiciona rewrites internos pra Vercel BotID challenge (evita
//     ad-blockers identificarem o endpoint). Requer instrumentation-client.ts
//     com initBotId() listando rotas protegidas.
//   - withSentryConfig: envelope pra sourcemaps subirem ao Sentry e stack
//     traces em prod chegarem desminificados. Requer SENTRY_AUTH_TOKEN +
//     SENTRY_ORG + SENTRY_PROJECT no Vercel (escopo project:releases).
//     sourcemaps.deleteSourcemapsAfterUpload = gerados, enviados, deletados
//     do output — não publicados em /_next/static/ (preserva código fonte).
export default withSentryConfig(withBotId(withAnalyzer(withMDX(nextConfig))), {
  // Spread condicional pra exactOptionalPropertyTypes não reclamar de
  // undefined em dev local sem essas vars setadas (vão estar no Vercel).
  ...(process.env.SENTRY_ORG ? { org: process.env.SENTRY_ORG } : {}),
  ...(process.env.SENTRY_PROJECT ? { project: process.env.SENTRY_PROJECT } : {}),
  ...(process.env.SENTRY_AUTH_TOKEN ? { authToken: process.env.SENTRY_AUTH_TOKEN } : {}),
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    // Upload sourcemaps mas deleta do output após upload (não publica em
    // /_next/static/ — preserva privacidade do código fonte).
    deleteSourcemapsAfterUpload: true,
  },
  // Notas: `disableLogger` e `automaticVercelMonitors` foram removidos —
  // ambos eram webpack-only e o projeto usa Turbopack. Vercel cron monitors
  // podem ser configurados manualmente no painel Sentry se necessário.
});
