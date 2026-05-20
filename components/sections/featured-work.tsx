import Link from 'next/link';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { cn } from '@/lib/utils';
import { CASE_STUDIES, type CaseStudy } from '@/lib/work/data';
import { FeaturedWorkReveal } from './featured-work.client';

// Featured Work — Apple tile rhythm com tiles ESPELHADOS pra quebrar grid
// uniforme. Hero tile (Content Engine) cover-LEFT 65% + text-RIGHT 35%.
// Tiles 2-3 espelhados: NexaCore text-LEFT cover-RIGHT, STJ text-RIGHT cover-LEFT.
// Aspect ratios divergentes: hero 16/10, NexaCore 4/3, STJ 16/9.
// Sequence label "01 / 04 — NAME" mono lime tabular (pattern Apple/Huly receipt aesthetic).

export function FeaturedWorkSection() {
  const contentEngine = CASE_STUDIES['content-engine'];
  const nexacore = CASE_STUDIES.nexacore;
  const stjApp = CASE_STUDIES['stj-app'];

  return (
    <section id="work" className="container-max section-pad-y border-t border-(--color-hairline)">
      <header className="mb-12 flex flex-col gap-3 sm:mb-16">
        <p className="eyebrow">FEATURED WORK</p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl !leading-[0.95]">
          Três produtos.
          <br />
          Três posturas.
        </h2>
        <p className="mt-2 max-w-prose text-(--color-text-2) leading-relaxed">
          Content Engine resolve volume + variedade com multi-agente. NexaCore entrega produto
          inteiro pra clínicas. STJ App é cockpit operacional PWA. Cada um documentado com escopo
          real e detalhes técnicos.
        </p>
      </header>

      <FeaturedWorkReveal>
        <div className="flex flex-col gap-8 sm:gap-12">
          {/* Hero tile FULL-BLEED — Content Engine flagship */}
          <HeroTile caseStudy={contentEngine} sequenceIndex={1} totalCount={4} />

          {/* Half-tile ESPELHADOS — NexaCore text-LEFT cover-RIGHT, STJ text-RIGHT cover-LEFT */}
          <div className="grid gap-8 lg:grid-cols-2">
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
    <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-accent)">
      <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
      <span className="mx-1 text-(--color-text-3)">/</span>
      <span className="tabular-nums text-(--color-text-3)">{String(total).padStart(2, '0')}</span>
      <span className="mx-2 text-(--color-text-3)">—</span>
      <span>{label}</span>
    </p>
  );
}

/* ============================================================
   Hero tile — Content Engine. Cover LEFT 65%, text RIGHT 35%.
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
        'group/hero-tile relative grid overflow-hidden rounded-2xl',
        'border border-(--color-hairline) bg-(--color-surface) p-6 outline-none',
        'transition-[border-color,transform,box-shadow] duration-(--motion-fast)',
        'hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm)',
        'focus-visible:border-(--color-accent)',
        'sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10'
      )}
    >
      {/* Cover LEFT 65% */}
      <div className="relative">
        <CaseStudyCover caseStudy={caseStudy} aspectRatio="16/10" tilt="cinema" />
      </div>

      {/* Copy RIGHT 35% */}
      <div className="flex flex-col gap-5 pt-2 lg:py-4">
        <SequenceLabel index={sequenceIndex} total={totalCount} label="FLAGSHIP · CONTENT ENGINE" />
        <h3
          className={cn(
            'text-3xl font-bold leading-[0.95] tracking-tight text-(--color-text-1)',
            'sm:text-4xl lg:text-5xl'
          )}
        >
          {caseStudy.title}
        </h3>
        <p className="text-base leading-relaxed text-(--color-text-2)">{caseStudy.tagline}</p>

        {/* Tag chips taxonomy */}
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {['Claude SDK', '22 agentes', '5 squads', 'HITL Telegram', 'pgvector'].map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-(--color-hairline-strong) bg-(--color-surface-elevated) px-2.5 py-1 font-mono text-[11px] text-(--color-text-3)"
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="mt-auto inline-flex items-center gap-2 pt-4 font-mono text-sm text-(--color-accent)">
          Ver case study completo →
        </p>
      </div>
    </Link>
  );
}

/* ============================================================
   Half tile — text-left/text-right espelhado, aspect divergente
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

  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      data-reveal
      className={cn(
        'group/half-tile relative flex flex-col gap-5 rounded-2xl',
        'border border-(--color-hairline) bg-(--color-surface) p-6 outline-none',
        'transition-[border-color,transform,box-shadow] duration-(--motion-fast)',
        'hover:-translate-y-1 hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm)',
        'focus-visible:-translate-y-1 focus-visible:border-(--color-accent)'
      )}
    >
      {/* Order toggle by direction */}
      {textFirst ? (
        <>
          <SequenceLabel index={sequenceIndex} total={totalCount} label={label} />
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-(--color-text-1) sm:text-3xl">
            {caseStudy.title}
          </h3>
          <p className="text-sm leading-relaxed text-(--color-text-2)">{caseStudy.shortLine}</p>
          <CaseStudyCover caseStudy={caseStudy} aspectRatio={aspectRatio} tilt="subtle" />
        </>
      ) : (
        <>
          <CaseStudyCover caseStudy={caseStudy} aspectRatio={aspectRatio} tilt="subtle" />
          <SequenceLabel index={sequenceIndex} total={totalCount} label={label} />
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-(--color-text-1) sm:text-3xl">
            {caseStudy.title}
          </h3>
          <p className="text-sm leading-relaxed text-(--color-text-2)">{caseStudy.shortLine}</p>
        </>
      )}

      <p className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-(--color-accent)">
        Ver case study →
      </p>
    </Link>
  );
}
