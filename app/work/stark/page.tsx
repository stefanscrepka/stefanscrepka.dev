import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArtifactFrame } from '@/components/work/artifact-frame';
import { CaseImpactTriad } from '@/components/work/case-impact-triad';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { CodeArtifact } from '@/components/work/code-artifact';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('stark');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'STARK'} · case study`,
  description:
    'Passagem de turno de uma linha de OSB, do Excel pro sistema: formulário digital, OEE calculado dígito a dígito contra o Excel oficial, telão de KPIs pra sala de controle, PDF e Excel. Next 16 + Prisma + Postgres 17, on-premises.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'STARK'} · case study · Stefan Heinz Screpka`,
    description:
      'Relatório de passagem de turno industrial: OEE dígito a dígito, telão de KPIs, PDF e Excel. Next 16 + Prisma + Postgres 17, on-premises, 153 testes.',
    url: '/work/stark',
  },
  alternates: { canonical: '/work/stark' },
};

// /work/stark — F6 (2026-09-04). Case novo no lugar do STJ App. Todas as
// capturas são do sistema rodando em ambiente local com o seed do projeto
// (usuário e relatório de referência do seed — nenhum dado real da fábrica).
// O cliente é anonimizado de propósito: sem autorização de uso de marca, o
// nome não vai pro site (mesma regra do portão `sem-placeholder` do projeto).

// src/lib/servicos/painel.ts (repo sk-relatorio-turno, privado) — verbatim.
const PAINEL_DOC = {
  source: 'src/lib/servicos/painel.ts',
  startLine: 80,
  lines: [
    '/**',
    ' * Agregados do periodo por COMPONENTES SOMADOS, NAO por media de OEEs: media de',
    ' * razoes nao e a razao das somas. Disponibilidade/Qualidade/Performance saem de',
    ' * somar numerador e denominador de cada um; OEE = P x Q x D dos agregados. Assim',
    ' * um turno de muito volume pesa mais que um de pouco, como no acumulado do mes.',
    ' */',
  ],
} as const;

const PAINEL_FORMULAS = {
  source: 'src/lib/servicos/painel.ts',
  startLine: 136,
  lines: [
    '  const disponibilidade = div(tempoProducao, minutos);',
    '  const qualidade = div(vol1a, volumeTotal);',
    '  const performance = div(numerador, capacidade);',
    '  const oee = performance * qualidade * disponibilidade;',
  ],
} as const;

export default function StarkPage() {
  if (!CS) notFound();
  const [painel, relatorio, lista] = CS.gallery ?? [];

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

      {/* Tour pelas telas — o telão em 16:9 full-width (é uma TV), depois o
          painel e o relatório lado a lado, e a lista. */}
      <section
        id="telas"
        aria-labelledby="stark-telas-heading"
        className="container-max scroll-mt-24 mt-16 flex flex-col gap-10 sm:mt-20"
      >
        <header className="flex flex-col gap-3">
          <p className="eyebrow">Tour pelas telas</p>
          <h2
            id="stark-telas-heading"
            className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl"
          >
            Do turno fechado ao telão.
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            {CS.client}. O supervisor fecha o turno no formulário; o sistema recalcula OEE,
            disponibilidade, performance e qualidade e publica no telão da sala de controle. As
            capturas são do sistema rodando localmente com o seed do projeto.
          </p>
        </header>

        <ArtifactFrame
          aspect={CS.cover.aspect}
          label={CS.cover.label}
          meta={CS.cover.meta}
          caption={CS.cover.caption}
        >
          <Image
            src={CS.cover.src}
            alt={CS.cover.alt}
            fill
            sizes="(min-width: 1440px) 1408px, 100vw"
            quality={95}
            className="object-cover object-top"
            loading="eager"
          />
        </ArtifactFrame>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {[painel, relatorio].map((shot) =>
            shot ? (
              <ArtifactFrame
                key={shot.src}
                aspect={shot.aspect}
                label={shot.label}
                meta={shot.meta}
                caption={shot.caption}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={95}
                  className="object-cover object-top"
                />
              </ArtifactFrame>
            ) : null
          )}
        </div>
      </section>

      {/* Motor de cálculo — o trecho do código que faz a promessa valer. */}
      <section
        id="arquitetura"
        aria-labelledby="stark-motor-heading"
        className="container-max scroll-mt-24 mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12"
      >
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Motor de cálculo</p>
          <h2
            id="stark-motor-heading"
            className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl"
          >
            Média de razões não é a razão das somas.
          </h2>
          <p className="text-reading text-(--color-text-2)">
            O painel agrega o período somando numerador e denominador de cada componente e só então
            multiplica. Um turno de muito volume pesa mais que um de pouco, como no acumulado do
            mês. As fórmulas foram fechadas contra três planilhas oficiais da fábrica, dígito a
            dígito, e ficam sob 153 testes de lógica pura.
          </p>
          <p className="font-mono text-xs leading-relaxed text-(--color-text-3)">
            Toda divisão protegida contra zero · importador dos .xlsm legados · PDF A4 e XLSX
            gerados no servidor
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <CodeArtifact
            source={PAINEL_DOC.source}
            lines={PAINEL_DOC.lines}
            startLine={PAINEL_DOC.startLine}
            meta="typescript"
          />
          <CodeArtifact
            source={PAINEL_FORMULAS.source}
            lines={PAINEL_FORMULAS.lines}
            startLine={PAINEL_FORMULAS.startLine}
            highlight={[139]}
            meta="typescript"
          />
          {lista ? (
            <ArtifactFrame
              aspect={lista.aspect}
              label={lista.label}
              meta={lista.meta}
              caption={lista.caption}
            >
              <Image
                src={lista.src}
                alt={lista.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={95}
                className="object-cover object-top"
              />
            </ArtifactFrame>
          ) : null}
        </div>
      </section>

      <section className="container-max mt-16 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Stack</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-(--color-text-2)">
            {CS.stack.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-(--color-text-3)">
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
                <span aria-hidden="true" className="text-(--color-text-3)">
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
