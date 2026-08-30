import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseImpactTriad } from '@/components/work/case-impact-triad';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { CONTENT_ENGINE_PANELS } from '@/components/work/content-engine-panels';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('content-engine');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'Content Engine'} — Case Study`,
  description:
    'Sistema multi-agente Claude SDK: 22 agentes em 5 squads substituem agência de 4-6 pessoas. Aprovação humana ≤10 min/dia via Telegram. Cron 03h–07h30 com GPU local subsidiando custo de inferência.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'Content Engine'} — Case Study · Stefan Heinz Screpka`,
    description:
      '22 agentes Claude SDK em 5 squads. Substitui agência inteira. HITL via Telegram em ≤10 min/dia. Stack local GPU. Anti-slop validator 14 regex PT-BR.',
    url: '/work/content-engine',
  },
  alternates: { canonical: '/work/content-engine' },
};

// /work/content-engine — W-design (2026-05-26): ScrollPinnedHorizontal removido
// (scroll-jacking 7×100vh = 700vh com sticky pin que em screenshot estático
// rendia 1 painel + 600vh de vazio). Trocado por vertical stack dos 7 panels
// como artigo editorial. Cada painel: badge + título + body + detalhe técnico
// + diagram à direita (2-col em desktop, stack em mobile). Mais legível, sem
// scroll-jacking, funciona em qualquer viewport.

export default function ContentEnginePage() {
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

      {/* Os 7 squads (intro + 5 squads + HITL) em vertical stack editorial.
          Cada painel é um <article> com 2-col: copy + diagram. */}
      <section
        aria-labelledby="ce-flow-heading"
        className="container-max mt-16 flex flex-col gap-12 sm:mt-20 sm:gap-16"
      >
        <header className="flex flex-col gap-3">
          <p className="eyebrow">Fluxo · 5 squads + HITL</p>
          <h2
            id="ce-flow-heading"
            className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl"
          >
            22 agentes, 7 etapas, um cron noturno.
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            Onboarding alimenta Inteligência que alimenta Estratégia que alimenta Criação que passa
            por Revisão Anti-Slop antes de aterrissar no Telegram pra HITL aprovar em ≤10 min/dia.
          </p>
        </header>

        <ol className="flex flex-col gap-12 sm:gap-16">
          {CONTENT_ENGINE_PANELS.map((panel, idx) => (
            <li
              key={panel.id}
              id={panel.id}
              className="scroll-mt-24 border-t border-(--color-hairline) pt-10 first:border-t-0 first:pt-0"
            >
              <article
                aria-labelledby={`ce-panel-${panel.id}`}
                className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-3">
                    <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent) tabular-nums">
                      {String(idx + 1).padStart(2, '0')} /{' '}
                      {CONTENT_ENGINE_PANELS.length.toString().padStart(2, '0')}
                    </p>
                    <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                      {panel.badge}
                    </p>
                  </div>
                  <h3
                    id={`ce-panel-${panel.id}`}
                    className="text-2xl font-semibold !leading-[1.1] !tracking-tight sm:text-3xl"
                  >
                    {panel.title}
                  </h3>
                  <p className="text-reading text-(--color-text-2)">{panel.body}</p>
                  <p className="font-mono text-xs leading-relaxed text-(--color-text-3)">
                    {panel.detail}
                  </p>
                </div>
                <div className="flex items-center justify-center">{panel.diagram}</div>
              </article>
            </li>
          ))}
        </ol>
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
          <p className="eyebrow">Squads em detalhe</p>
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
