import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArtifactFrame } from '@/components/work/artifact-frame';
import { CaseImpactTriad } from '@/components/work/case-impact-triad';
import { CaseStudyHero } from '@/components/work/case-study-hero';
import { getCaseStudy } from '@/lib/work/data';
import { buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/lib/work/json-ld';

const CS = getCaseStudy('caluna');

export const metadata: Metadata = {
  title: `${CS?.title ?? 'Caluna'} · case study`,
  description:
    'Caluna: a secretária de clínica de estética que atende no WhatsApp, agenda, confirma e lembra. Next 14, Prisma, Clerk, Evolution API, BullMQ. Antes chamava NexaCore.',
  openGraph: {
    type: 'article',
    title: `${CS?.title ?? 'Caluna'} · case study · Stefan Heinz Screpka`,
    description:
      'A secretária de clínica que vive no WhatsApp. Agenda, confirma, lembra e cobra por PIX, com o humano entrando só quando importa.',
    url: '/work/caluna',
  },
  alternates: { canonical: '/work/caluna' },
};

// /work/caluna — F7 (2026-09-04): o produto foi rebatizado (NexaCore → Caluna,
// commits de 31/05 e 01/06/2026) e reposicionado: de "CRM + agenda + faturamento"
// pra "a secretária que cuida do WhatsApp da clínica". As capturas são do
// build atual rodando em ambiente local com o seed do próprio repo (Postgres
// e Redis em containers descartáveis); o striveos.shop, domínio da versão
// anterior, estava fora do ar no dia da captura. /work/nexacore redireciona
// pra cá (next.config.ts).

export default function CalunaPage() {
  if (!CS) notFound();
  const gallery = CS.gallery ?? [];

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

      <section
        id="telas"
        aria-labelledby="caluna-telas-heading"
        className="container-max scroll-mt-24 mt-16 flex flex-col gap-8 sm:mt-20"
      >
        <header className="flex flex-col gap-3">
          <p className="eyebrow">O produto, hoje</p>
          <h2
            id="caluna-telas-heading"
            className="text-2xl font-semibold !leading-[1.15] !tracking-tight sm:text-3xl"
          >
            A promessa na primeira dobra. O sistema por trás.
          </h2>
          <p className="max-w-prose text-reading text-(--color-text-2)">
            A landing conversa com a dona da clínica no tom dela. Atrás da landing, o painel que a
            secretária alimenta: serviços com preço e lembrete, clientes com histórico, agenda por
            profissional, pagamentos por PIX. As capturas são do build atual com o seed do projeto.
          </p>
        </header>

        <ArtifactFrame
          variant="browser"
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

        <ul className="grid gap-8 md:grid-cols-2 md:gap-10">
          {gallery.map((shot) => (
            <li key={shot.src}>
              <ArtifactFrame
                aspect={shot.aspect}
                label={shot.label}
                meta={shot.meta}
                caption={shot.caption}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={95}
                  className="object-cover object-top"
                />
              </ArtifactFrame>
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
                <span aria-hidden="true" className="text-(--color-text-3)">
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="eyebrow">O que a secretária faz</p>
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
