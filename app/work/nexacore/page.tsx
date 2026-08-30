import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CaseImpactTriad } from '@/components/work/case-impact-triad';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { MockupFrame } from '@/components/work/product-mockup';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('nexacore');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'NexaCore'} — Case Study`,
  description:
    'B2B SaaS multi-tenant em produção pra clínicas de estética. CRM + agenda + faturamento + IA conversacional + WhatsApp Business + analytics numa única aplicação Next + Clerk + Prisma + Socket.io.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'NexaCore'} — Case Study · Stefan Heinz Screpka`,
    description:
      'B2B SaaS multi-tenant em produção. CRM + agenda + faturamento + IA + WhatsApp num único deploy. Next + Clerk + Prisma + Redis + Socket.io + Evolution API.',
    url: '/work/nexacore',
  },
  alternates: { canonical: '/work/nexacore' },
};

// W-design (2026-05-26): MacBookScroll removido (scroll-driven 200vh com lid
// fechada em screenshot estático + duplicava o screenshot do hero). Trocado
// por "Tour pelas telas" — grid 3-col com os 3 screenshots reais do produto
// (dashboard, agenda/calendar, landing). Cada uma com MockupFrame browser
// chrome pra visual coerência.

const SCREENSHOTS = [
  {
    src: '/work-screenshots/nexacore-dashboard.avif',
    alt: 'NexaCore — dashboard admin com KPIs e gráficos do mês',
    label: 'Dashboard',
    caption: 'KPIs em tempo real · gráfico de faturamento · pipeline leads',
  },
  {
    src: '/work-screenshots/nexacore-calendar.avif',
    alt: 'NexaCore — agenda com calendário e filtros por status',
    label: 'Agenda',
    caption: 'Multi-profissional · status pipeline · timeline view',
  },
  {
    src: '/work-screenshots/nexacore-home.avif',
    alt: 'NexaCore — landing comercial striveos.shop',
    label: 'Landing',
    caption: 'Conversão pra trial · LGPD compliant · IA conversacional',
  },
];

export default function NexaCorePage() {
  if (!CS) notFound();

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCaseStudyJsonLd(CS)) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data SSR
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(CS)) }}
      />
      <CaseStudyHero cs={CS} />

      <CaseImpactTriad cs={CS} />

      {/* Tour pelas telas — 3-col grid com screenshots reais do produto */}
      <section className="container-max mt-16 flex flex-col gap-8 sm:mt-20">
        <header className="flex flex-col gap-3">
          <p className="eyebrow">Tour pelas telas</p>
          <h2 className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl">
            Três telas, um produto.
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            Admin dashboard, agenda multi-profissional e landing comercial — três das telas
            principais do NexaCore rodando em produção em{' '}
            <code className="font-mono">striveos.shop</code>.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {SCREENSHOTS.map((shot) => (
            <li key={shot.src} className="flex flex-col gap-4">
              <MockupFrame frame="browser" glow="lime">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    quality={95}
                    className="object-cover"
                  />
                </div>
              </MockupFrame>
              <div className="flex flex-col gap-1.5 px-1">
                <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent)">
                  {shot.label}
                </p>
                <p className="text-sm leading-relaxed text-(--color-text-2)">{shot.caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-max mt-16 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-accent)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="eyebrow">Detalhes que valem</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.details.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-accent)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
