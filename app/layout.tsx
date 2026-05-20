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
import { FloatingDock, type FloatingDockItem } from '@/components/ui-effects/floating-dock';
import { GrainOverlay } from '@/components/ui-effects/grain-overlay';
import './globals.css';

// PP Editorial New (Pangram Pangram, EULA "Free for personal use" — cobre portfolio
// pessoal). Italic usado pelo <EditorialAccent /> na palavra "multi-agente" no hero
// (único momento editorial serif do site). Regular reservado pra pull-quotes futuras.
const ppEditorial = localFont({
  src: [
    {
      path: '../public/fonts/PPEditorialNew-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPEditorialNew-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-editorial',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const navItems: FloatingDockItem[] = [
  { label: 'Work', href: '#work', icon: <WorkIcon />, subtitle: 'Três produtos em produção' },
  { label: 'Process', href: '#process', icon: <ProcessIcon />, subtitle: 'Como eu construo' },
  { label: 'Manifesto', href: '#manifesto', icon: <ManifestoIcon />, subtitle: 'Princípios' },
  { label: 'Contato', href: '#contato', icon: <ContactIcon />, subtitle: 'Respondo em <12h' },
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
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <LenisProvider>
            <FloatingDock items={navItems} />
            <main id="main" className="relative">
              {children}
            </main>
            <Footer />
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
