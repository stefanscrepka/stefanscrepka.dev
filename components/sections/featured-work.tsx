import Link from 'next/link';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { SquadsStatusLine } from '@/components/work/squads-status-line';
import { cn } from '@/lib/utils';
import { CASE_STUDIES, type CaseStudy } from '@/lib/work/data';
import { FeaturedWorkReveal } from './featured-work.client';

// Featured Work — cinema premium grade. Três tiles tratados como artefatos:
//
//   • Hero tile (Content Engine, 16/10 cover-LEFT 65%) respira mais largo.
//   • Half tiles ESPELHADOS (NexaCore text-LEFT cover-RIGHT, STJ text-RIGHT
//     cover-LEFT) quebram simetria e mantêm reading rhythm.
//
// Decisões de cinema:
//   • gap-16 entre rows + gap-10 entre half tiles (mais respiração).
//   • Padding tile reduzido pra cover dominar (p-5 sm:p-7, antes p-6 sm:p-8).
//   • Borders 1px hairline + inset highlight 1px (Linear/Vercel signature).
//   • Hover lift: translateY(-2px) puro + lime glow border expand 600ms ease-smooth.
//     Sem scale (proibido por anti-pattern). Aspect ratios divergentes.
//   • Tipografia tight: tracking -0.025em, leading 1.05 em h3.
//   • CTA "Ver case →" = lime ghost com translateX(2px) no hover, NÃO scale.
//   • Sequence label "01 / 04 — NAME" mono lime tabular (Apple/Huly receipt).

export function FeaturedWorkSection() {
  const contentEngine = CASE_STUDIES['content-engine'];
  const nexacore = CASE_STUDIES.nexacore;
  const stjApp = CASE_STUDIES['stj-app'];

  return (
    <section
      id="work"
      className="container-max section-pad-y-lg border-t border-(--color-hairline)"
    >
      <header className="mb-16 flex flex-col gap-4 sm:mb-20 lg:mb-24">
        <p className="eyebrow">FEATURED WORK</p>
        <h2
          className={cn(
            'text-3xl font-semibold text-(--color-text-1) sm:text-4xl',
            // Tight cinema headline: -0.025em + leading 1.05
            '!tracking-tight !leading-[1.05] text-balance'
          )}
        >
          Três produtos.
          <br />
          Três posturas.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Content Engine resolve volume + variedade com multi-agente. NexaCore entrega produto
          inteiro pra clínicas. STJ App é cockpit operacional PWA. Cada um documentado com escopo
          real e detalhes técnicos.
        </p>
      </header>

      <FeaturedWorkReveal>
        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
          {/* Hero tile FULL-BLEED — Content Engine flagship */}
          <HeroTile caseStudy={contentEngine} sequenceIndex={1} totalCount={4} />

          {/* Half-tiles ESPELHADOS — gap-10 generoso */}
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <HalfTile
              caseStudy={nexacore}
              sequenceIndex={2}
              totalCount={4}
              direction="text-left"
              aspectRatio="4/3"
            />
            <HalfTile
              caseStudy={stjApp}
              sequenceIndex={3}
              totalCount={4}
              direction="text-right"
              aspectRatio="16/9"
            />
          </div>
        </div>
      </FeaturedWorkReveal>
    </section>
  );
}

/* ============================================================
   Sequence label — "01 / 04 — NAME" Apple/Huly receipt aesthetic
   ============================================================ */

function SequenceLabel({ index, total, label }: { index: number; total: number; label: string }) {
  return (
    <p className="font-mono text-2xs uppercase tracking-widest text-(--color-accent)">
      <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
      <span className="mx-1.5 text-(--color-text-3)">/</span>
      <span className="tabular-nums text-(--color-text-3)">{String(total).padStart(2, '0')}</span>
      <span className="mx-2.5 text-(--color-text-3)">—</span>
      <span>{label}</span>
    </p>
  );
}

/* ============================================================
   Tile shell — shared class system pra hero + half.
   Hairline 1px + inset highlight + hover glow expand 600ms ease-smooth.
   translateY(-2px) puro (zero scale).
   ============================================================ */

const TILE_SHELL = [
  'group/tile relative isolate overflow-hidden rounded-2xl outline-none',
  'border border-(--color-hairline) glass-panel',
  // Stack 2-layer at rest: ambient md shadow + inset bisel (Vercel/Linear edge lift).
  // Bisel = 1px highlight stroke + top edge luminance, applied via single token.
  'shadow-[var(--shadow-md),var(--shadow-inset-bisel)]',
  // Hover meio-termo 350ms (Stefan escolheu entre snap 200ms e cinematic 600ms).
  // Era 600ms (sluggish), 200ms snap parecia agressivo, 350ms equilibra.
  'transition-[transform,border-color,box-shadow] duration-[350ms] ease-(--ease-standard)',
  'hover:-translate-y-[2px] hover:border-(--color-accent)',
  'hover:shadow-[var(--shadow-lg),var(--shadow-inset-bisel),0_0_48px_var(--color-accent-glow)]',
  'focus-visible:-translate-y-[2px] focus-visible:border-(--color-accent)',
  'focus-visible:shadow-[var(--shadow-lg),var(--shadow-inset-bisel),0_0_48px_var(--color-accent-glow)]',
].join(' ');

/* ============================================================
   "Ver case →" CTA pill — lime ghost, lift sutil (translateX +2px).
   Anti-scale: arrow movimenta-se em vez do botão escalar.
   ============================================================ */

function CaseCTA({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-sm text-(--color-accent)',
        'transition-[gap,color] duration-(--motion-transition) ease-(--ease-smooth)',
        'group-hover/tile:gap-3 group-hover/tile:text-(--color-accent-hover)',
        'group-focus-visible/tile:gap-3 group-focus-visible/tile:text-(--color-accent-hover)',
        className
      )}
    >
      Ver case
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-(--motion-transition) ease-(--ease-smooth) group-hover/tile:translate-x-[2px] group-focus-visible/tile:translate-x-[2px]"
      >
        →
      </span>
    </span>
  );
}

/* ============================================================
   Hero tile — Content Engine. Cover LEFT 65%, text RIGHT 35%.
   Padding tighter no copy (p-7 lg:p-10) deixa cover respirar.
   ============================================================ */

function HeroTile({
  caseStudy,
  sequenceIndex,
  totalCount,
}: {
  caseStudy: CaseStudy;
  sequenceIndex: number;
  totalCount: number;
}) {
  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      data-reveal
      className={cn(
        TILE_SHELL,
        'grid p-5 sm:p-7 lg:p-8',
        'lg:grid-cols-[1.55fr_1fr] lg:gap-10 xl:gap-14'
      )}
    >
      {/* Cover LEFT 62% — tilt cinema, respira mais */}
      <div className="relative">
        <CaseStudyCover
          caseStudy={caseStudy}
          aspectRatio="16/10"
          tilt="cinema"
          className="relative z-10"
        />
      </div>

      {/* Copy RIGHT 38% — padding generoso vertical, tighter horizontal */}
      <div className="flex flex-col gap-6 pt-2 lg:py-6">
        <SequenceLabel index={sequenceIndex} total={totalCount} label="FLAGSHIP · CONTENT ENGINE" />

        <h3
          className={cn(
            'font-semibold text-(--color-text-1)',
            // Cinema tight headline: -0.025em + leading 1.05
            'text-3xl sm:text-4xl lg:text-[2.75rem]',
            '!tracking-tight !leading-[1.05]'
          )}
        >
          {caseStudy.title}
        </h3>

        <p className="text-reading text-(--color-text-2)">{caseStudy.tagline}</p>

        {/* 3 highlights compactos — substituí chips ruidosos por bullets clean */}
        <ul className="mt-1 flex flex-col gap-2.5 text-sm leading-snug text-(--color-text-2)">
          <li className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
            />
            <span>22 agentes Claude SDK em 5 squads + HITL Telegram</span>
          </li>
          <li className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
            />
            <span>Aprovação humana ≤10 min/dia · cron 03h–07h30</span>
          </li>
          <li className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
            />
            <span>Anti-slop validator · 100 tests runtime · pgvector RAG</span>
          </li>
        </ul>

        {/* Squads status line — pulse loop S0 → S1 → ... → E-0 HITL.
            Camada de "produto vivo" sem aumentar peso visual. */}
        <SquadsStatusLine className="mt-3" />

        <CaseCTA className="mt-auto pt-6" />
      </div>
    </Link>
  );
}

/* ============================================================
   Half tile — text-left/text-right espelhado, aspect divergente.
   Padding interno tighter (p-5 sm:p-7) deixa cover dominar.
   ============================================================ */

function HalfTile({
  caseStudy,
  sequenceIndex,
  totalCount,
  direction,
  aspectRatio,
}: {
  caseStudy: CaseStudy;
  sequenceIndex: number;
  totalCount: number;
  direction: 'text-left' | 'text-right';
  aspectRatio: '16/10' | '16/9' | '4/3' | '3/2' | '1/1';
}) {
  const textFirst = direction === 'text-left';
  const label = caseStudy.slug.toUpperCase().replace('-', ' ');

  // Highlights condensados por case — 2-3 bullets crisp.
  const highlights = HIGHLIGHTS_BY_SLUG[caseStudy.slug] ?? [];

  const cover = <CaseStudyCover caseStudy={caseStudy} aspectRatio={aspectRatio} tilt="subtle" />;

  const textBlock = (
    <div className="flex flex-col gap-4">
      <SequenceLabel index={sequenceIndex} total={totalCount} label={label} />
      <h3
        className={cn(
          'font-semibold text-(--color-text-1)',
          'text-2xl sm:text-[1.75rem] lg:text-3xl',
          '!tracking-tight !leading-[1.05]'
        )}
      >
        {caseStudy.title}
      </h3>
      <p className="text-sm leading-relaxed text-(--color-text-2)">{caseStudy.tagline}</p>

      {highlights.length > 0 ? (
        <ul className="mt-1 flex flex-col gap-2 text-sm leading-snug text-(--color-text-2)">
          {highlights.map((h) => (
            <li key={h} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-accent)"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      data-reveal
      className={cn(TILE_SHELL, 'flex flex-col gap-6 p-5 sm:p-7')}
    >
      {textFirst ? (
        <>
          {textBlock}
          {cover}
        </>
      ) : (
        <>
          {cover}
          {textBlock}
        </>
      )}

      <CaseCTA className="mt-auto" />
    </Link>
  );
}

/* ============================================================
   Highlights por slug — 2-3 bullets crisp por half-tile.
   Single source of truth pra microcopy técnica condensada.
   ============================================================ */

const HIGHLIGHTS_BY_SLUG: Record<string, string[]> = {
  nexacore: [
    'Next 14 + Clerk JWT + Prisma · multi-tenant por subdomínio',
    'Real-time Socket.io + Redis adapter · BullMQ workers',
    'WhatsApp Evolution + Asaas/Stripe dual gateway',
  ],
  'stj-app': [
    'Next 15.3.9 + Supabase Auth + Claude Haiku 4.5 streaming',
    'Prompt cache 2 camadas · vision validator multi-modal',
    '162 testes · pgvector RAG · Inngest workflows',
  ],
};
