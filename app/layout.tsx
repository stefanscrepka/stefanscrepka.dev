import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AboutThisSiteModal } from '@/components/contact/about-this-site-modal';
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
  { label: 'Work', href: '/#work', icon: <WorkIcon />, subtitle: 'Três produtos em produção' },
  { label: 'Process', href: '/process', icon: <ProcessIcon />, subtitle: 'Como eu construo' },
  { label: 'Manifesto', href: '/#manifesto', icon: <ManifestoIcon />, subtitle: 'Princípios' },
  { label: 'Contato', href: '/#contato', icon: <ContactIcon />, subtitle: 'Respondo em <12h' },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stefanscrepka.dev';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Stefan Heinz Screpka — AI Product Engineer',
    template: '%s · Stefan Heinz Screpka',
  },
  description:
    'Construo IA multi-agente em produção — e o produto inteiro ao redor dela. Claude SDK + Next 16 + TypeScript. Três produtos rodando.',
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
  alternates: { canonical: baseUrl },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080A07',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Stefan Heinz Screpka',
  jobTitle: 'AI Product Engineer',
  url: baseUrl,
  email: 'stefanheinz2006@gmail.com',
  description:
    'AI Product Engineer brasileiro. Multi-agent IA com Claude SDK + product engineering full-stack. Três produtos em produção: Content Engine, NexaCore SaaS, STJ App.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ponta Grossa',
    addressRegion: 'Paraná',
    addressCountry: 'BR',
  },
  sameAs: [
    'https://github.com/stefanscrepka',
    'https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/',
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} ${ppEditorial.variable}`}
      suppressHydrationWarning
    >
      <head>
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
                console.log('%c    ____ _   _\\n   / ___| | | |\\n   \\\\___ \\\\| |_| |\\n    ___) |  _  |\\n   |____/|_| |_|\\n','%cprocurando dev?\\nwa.me/5542998592522 · stefanheinz2006@gmail.com\\nmulti-agent em producao · ✺ ponta grossa, br',st[0],st[1]);
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
              <main id="main" className="relative">
                {children}
              </main>
              <Footer />
            </CalModalProvider>
          </LenisProvider>
        </MotionProvider>
        <AboutThisSiteModal />
        <GrainOverlay />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
