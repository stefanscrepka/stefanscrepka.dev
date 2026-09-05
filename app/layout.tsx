import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ViewTransition } from 'react';
import { AboutThisSiteGate } from '@/components/contact/about-this-site-gate.client';
import { LenisProvider } from '@/components/providers/lenis-provider';
import { MotionProvider } from '@/components/providers/motion-provider';
import { Footer } from '@/components/sections/footer';
import { ContactIcon, ManifestoIcon, ProcessIcon, WorkIcon } from '@/components/shared/nav-icons';
import { GrainOverlay } from '@/components/ui-effects/grain-overlay';
import { TopBarNav, type TopBarNavItem } from '@/components/ui-effects/top-bar-nav';
import { CalModalProvider } from '@/lib/contact/cal-modal-context';
import './globals.css';

// PP Editorial New (Pangram Pangram, EULA "Free for personal use" — cobre portfolio
// pessoal). Italic usado pelo <EditorialAccent /> na palavra "multi-agente" no hero
// (único momento editorial serif do site).
// W0.7 (2026-05-23): Regular weight removido — zero consumidores no código,
// economiza ~58 KB de transfer + 1 font face de decode. Re-adicionar quando
// houver pull-quote serif planejado.
const ppEditorial = localFont({
  src: [
    {
      path: '../public/fonts/PPEditorialNew-Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-editorial',
  display: 'swap',
  // W2.8 (2026-05-23): "PPEditorial Fallback" é synthetic @font-face em
  // globals.css com size-adjust + ascent/descent override que aproxima
  // Georgia das métricas de PP Editorial Italic. Reduz CLS no swap.
  fallback: ['PPEditorial Fallback', 'Georgia', 'Times New Roman', 'serif'],
});

// W4.1 (2026-05-23): anchors agora são absolutos `/#...` pra funcionar em
// QUALQUER rota (case studies, /process, /privacidade, etc). Antes os links
// `#work` eram dead em páginas internas — usuário clicava e nada acontecia.
// O TopBarNav detecta pathname + faz scroll local quando estamos na home.
export const navItems: TopBarNavItem[] = [
  {
    label: 'Work',
    href: '/#work',
    icon: <WorkIcon />,
    subtitle: 'Produtos e cases',
  },
  { label: 'Process', href: '/process', icon: <ProcessIcon />, subtitle: 'Como eu construo' },
  { label: 'Manifesto', href: '/#manifesto', icon: <ManifestoIcon />, subtitle: 'Princípios' },
  { label: 'Contato', href: '/#contato', icon: <ContactIcon />, subtitle: 'Respondo em até 12h' },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stefanscrepka.dev';

// W-deploy (2026-05-25): Vercel Analytics + Speed Insights só montados em
// prod. Em dev (localhost), os scripts /_vercel/insights/script.js +
// /_vercel/speed-insights/script.js retornam 404 (servidos só pelo runtime
// Vercel deployado), poluindo o console. Em prod montam normalmente.
const IS_PROD = process.env.NODE_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Stefan Heinz Screpka · AI Product Engineer',
    template: '%s · Stefan Heinz Screpka',
  },
  description:
    'Construo IA multi-agente em produção, e o produto inteiro ao redor dela. Content Engine, Caluna, STARK, Estética MD e SK3D, com capturas reais e números conferidos no código.',
  authors: [{ name: 'Stefan Heinz Screpka' }],
  creator: 'Stefan Heinz Screpka',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    siteName: 'Stefan Heinz Screpka',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  // W-seo #7: hreflang PT-BR + x-default. Single-locale mas explicit signal pra
  // crawlers (Google prefere `alternates.languages` mesmo em monolíngue).
  alternates: {
    canonical: baseUrl,
    languages: {
      'pt-BR': baseUrl,
      'x-default': baseUrl,
    },
  },
  // W-mob/PWA (2026-05-25): apple-mobile-web-app-* metadados. Sem isso, Add-to
  // -Home-Screen no iOS abre dentro do Safari shell em vez de modo standalone.
  // Status bar dark translucent combina com theme oklch(13%) do site.
  appleWebApp: {
    capable: true,
    title: 'Stefan Screpka',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080A07',
  colorScheme: 'dark',
};

// W-seo #3: @id permite ligação cross-schema (case study SoftwareApplication.creator
// aponta pra esse Person via URI canônico). W-seo (2026-05-25): adicionado
// image (avatar usado pelo Knowledge Panel) + Cal.com em sameAs.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${baseUrl}/#person`,
  name: 'Stefan Heinz Screpka',
  jobTitle: 'AI Product Engineer',
  url: baseUrl,
  email: 'stefanheinz2006@gmail.com',
  telephone: '+55-42-99859-2522',
  image: `${baseUrl}/avatar-stefan.avif`,
  description:
    'AI Product Engineer brasileiro. Multi-agent IA com Claude SDK + product engineering full-stack. Content Engine (multi-agente), Caluna (secretária de clínica no WhatsApp), STARK (passagem de turno industrial), Estética MD e SK3D (impressão 3D).',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ponta Grossa',
    addressRegion: 'Paraná',
    addressCountry: 'BR',
  },
  sameAs: [
    'https://github.com/stefanscrepka',
    'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/',
    'https://cal.com/stefanscrepka',
    'https://wa.me/5542998592522',
  ],
  knowsAbout: [
    'AI',
    'Claude SDK',
    'Claude Code',
    'MCP',
    'Prompt Caching',
    'RAG',
    'pgvector',
    'TypeScript',
    'Next.js',
    'React',
    'Tailwind CSS',
    'Three.js',
    'r3f',
    'GSAP',
    'Motion',
    'Node.js',
    'Postgres',
    'Drizzle ORM',
    'Prisma',
    'Redis',
    'BullMQ',
    'Socket.io',
    'Stripe',
    'Asaas',
    'Evolution API',
    'WhatsApp Business',
    'Resend',
    'Vercel',
    'Sentry',
    'Langfuse',
    'Docker',
    'LGPD',
  ],
};

// W-seo (2026-05-25): WebSite schema com publisher cross-link pro Person.
// Permite o Google entender o site como entidade própria (separa "obra"
// de "autor") + abre porta pra SearchAction futuro se adicionar busca.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  url: baseUrl,
  name: 'Stefan Heinz Screpka',
  description:
    'Portfolio de Stefan Heinz Screpka, AI Product Engineer. Content Engine (multi-agente Claude), Caluna (secretária de clínica no WhatsApp) e STARK (passagem de turno industrial), com capturas reais e detalhes técnicos abertos.',
  inLanguage: 'pt-BR',
  publisher: { '@id': `${baseUrl}/#person` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} ${ppEditorial.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* W-audit (2026-06-10): preload do hero-poster MOVIDO pra
            components/sections/hero.tsx (React 19 iça <link> de RSC pro head).
            Aqui no root layout, TODAS as rotas internas pré-carregavam um
            asset que só a home usa — warning "preloaded but not used" no
            console de cada página + ~47 KB desperdiçados por navegação. */}
        {/* W-perf (2026-05-25 revert): preconnect Cal.com causava Lighthouse
            "unused preconnect" penalty porque o iframe só carrega quando user
            abre o modal (decisão deferred). dns-prefetch only é mais barato
            (apenas resolução DNS, sem TLS handshake idle) e ainda economiza
            ~50-100ms no first modal open vs nada.
            crossOrigin é deliberadamente omitido em dns-prefetch (não aplica). */}
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        {/* Pre-hydration FOUC gate — seta atributo ANTES de paint inicial.
            Script roda síncrono em <head>, antes do body renderizar. CSS rule
            em globals.css `html[data-pre-hydration] .anim-pre-hidden { opacity: 0 }`
            esconde elementos animados. MotionProvider remove o attr após mount. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-hydration boot script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.dataset.preHydration='1'",
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Easter egg console — dev abre DevTools, entra no clube. ASCII SH + contato.
            Print direto no console com %c CSS styled. Production only (NODE_ENV) pra
            nao poluir dev console do proprio Stefan. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: easter egg console.log autoral
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(typeof window==='undefined')return;
                var st=[
                  'color:#D2FF00;font-family:monospace;font-size:12px;line-height:1.3;font-weight:bold',
                  'color:#A8A8A8;font-family:monospace;font-size:11px;line-height:1.5'
                ];
                console.log('%c    ____ _   _\\n   / ___| | | |\\n   \\\\___ \\\\| |_| |\\n    ___) |  _  |\\n   |____/|_| |_|\\n','%cprocurando dev?\\nWhatsApp (42) 99859-2522 · stefanheinz2006@gmail.com\\nmulti-agente em produção · ponta grossa, BR',st[0],st[1]);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <LenisProvider>
            <CalModalProvider>
              <TopBarNav items={navItems} />
              {/* F7 (2026-09-04): z-10 + fundo opaco — o rodapé é fixo atrás
                  (md+) e é revelado quando o conteúdo termina (footer.tsx). */}
              <main id="main" className="relative z-10 bg-(--color-bg)">
                {/* W-audit (2026-06-10): crossfade de rota via View Transitions.
                    Antes a navegação era corte seco. Só o conteúdo do <main>
                    participa do grupo "page-fade" (CSS em globals.css) — nav e
                    footer ficam fora e persistem estáveis. Reduced-motion:
                    kill explícito em globals.css.
                    F3.3 (2026-06-11): os loading.tsx de /work e /process foram
                    removidos — em páginas estáticas o Suspense boundary servia
                    o conteúdo num <div hidden> revelado por JS (CLS 0.534). Sem
                    eles, o conteúdo estático vem inteiro no HTML (CLS 0) e este
                    page-fade segura a navegação soft sem flash branco (a página
                    anterior fica visível até o conteúdo novo resolver — instante
                    num estático — e então faz crossfade). É a única transição
                    de página. */}
                <ViewTransition default="page-fade">{children}</ViewTransition>
              </main>
              <Footer />
            </CalModalProvider>
          </LenisProvider>
        </MotionProvider>
        <AboutThisSiteGate />
        <GrainOverlay />
        {IS_PROD ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
