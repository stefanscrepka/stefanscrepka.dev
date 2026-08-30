import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('estetica-md');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'Estética MD'} — Case Study`,
  description:
    'Site institucional + conversão pra Dra. Martina Dona. Clínicas premium de estética, odonto, med spa. Vanilla JS + PHP antes do React. Custom cursor, parallax trigonométrico, navbar inteligente, formulário CORS bilateral.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'Estética MD'} — Case Study · Stefan Heinz Screpka`,
    description:
      'Site institucional pra clínica premium. Vanilla JS + PHP + ScrollReveal + Typed.js. Prova de motion design antes do React. Primeiro produto em produção.',
    url: '/work/estetica-md',
  },
  alternates: { canonical: '/work/estetica-md' },
};

// /work/estetica-md — Amber accent isolated. Pattern editorial premium pra
// clínica buyer não-técnica. Hero limpo (text only) + cover no body com
// grid 2-col (cover esquerda + features texto direita).

export default function EsteticaMDPage() {
  if (!CS) notFound();

  return (
    <div data-clinic-scope className="pb-24">
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

      {/* Cover + features 2-col abaixo do hero */}
      <div className="container-max grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="order-2 lg:order-1">
          {/* F3.6/F3-review (2026-06-11): cover real (estetica-md-home.avif) é
              o LCP — fica logo abaixo do hero textual curto. Next avisava
              "LCP lazy"; `eager` adianta o fetch (aqui a prop de fato vira
              loading="eager", PATH 1 com <img>, ≠ do diagrama do flagship). */}
          <CaseStudyCover caseStudy={CS} aspectRatio="3/2" tilt="subtle" eager />
        </div>
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <p
            className="text-xl font-semibold leading-relaxed"
            style={{ color: 'var(--color-amber)' }}
          >
            Feito pra clínicas premium — estética, odonto, med spa.
          </p>
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-(--color-text-2)">
            {CS.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden="true" style={{ color: 'var(--color-amber)' }}>
                  ·
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="container-max mt-16 grid gap-8 sm:mt-20 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 font-mono text-xs leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div
          className="flex flex-col gap-3 self-start rounded-2xl p-6"
          style={{
            border: '1px solid var(--color-hairline-strong)',
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-md), 0 0 32px oklch(82% 0.18 75 / 0.12)',
          }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: 'var(--color-amber)' }}
          >
            Quer um site assim pra sua clínica?
          </p>
          <p className="text-sm leading-relaxed text-(--color-text-1)">
            Posicionamento premium. Conversão por WhatsApp. Cliente referência local. Sem template
            Shopify.
          </p>
          <p className="text-xs leading-relaxed text-(--color-text-2)">
            Conversa de 15min direto no WhatsApp ou Cal.com pra avaliar fit.
          </p>
        </div>
      </section>
    </div>
  );
}
