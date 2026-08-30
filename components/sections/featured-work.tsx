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
          Três problemas resolvidos.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Content Engine resolve volume + variedade com multi-agente. NexaCore entrega produto
          inteiro pra clínicas. STJ App é cockpit operacional PWA. Cada um documentado com escopo
          real e detalhes técnicos.
        </p>
      </header>

      {/* W-audit (2026-06-10): HeroTile e a row de half-tiles agora são
          children DIRETOS do reveal — antes um <div> wrapper era filho único
          e o stagger de 80ms nunca acontecia (tudo entrava em bloco). O layout
          flex/gap migrou pra className do container Motion.
          W-mob2 #2: mobile gap-8 (era 12) reduz scroll fatigue entre 3 cards
          de 600vh+. Desktop mantém 16/20 generoso. */}
      <FeaturedWorkReveal className="flex flex-col gap-8 sm:gap-16 lg:gap-20">
        {/* Hero tile FULL-BLEED — Content Engine flagship */}
        <HeroTile caseStudy={contentEngine} sequenceIndex={1} totalCount={3} />

        {/* Half-tiles ESPELHADOS — gap-10 generoso (mobile gap-6).
            F4 (2026-08-29): os dois usam 16/10, que é a proporção NATIVA dos
            dois screenshots (nexacore-dashboard 1920×1200 e stj-app-home
            3840×2400 = 1.600). Antes eram 4/3 e 16/9 — nenhum batia com a
            imagem, então ambos cortavam (NexaCore perdia ~17% das laterais,
            STJ ~11% do topo/base) e, por serem diferentes, as capas ficavam
            com 468px vs 350px de altura. Como o CTA é `mt-auto`, essa
            diferença de 118px virava um buraco visível dentro do tile mais
            curto. Uma proporção só resolve recorte, consistência do par
            espelhado e o vazio ao mesmo tempo. */}
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          <HalfTile
            caseStudy={nexacore}
            sequenceIndex={2}
            totalCount={3}
            direction="text-left"
            aspectRatio="16/10"
          />
          <HalfTile
            caseStudy={stjApp}
            sequenceIndex={3}
            totalCount={3}
            direction="text-right"
            aspectRatio="16/10"
          />
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
  // W-audit (2026-06-10): outline-none → outline-hidden. O foco aqui é
  // indicado por border+glow (abaixo), que somem em forced-colors (Windows
  // High Contrast); outline-hidden preserva um outline transparente que o
  // sistema torna visível nesse modo.
  'group/tile relative isolate overflow-hidden rounded-2xl outline-hidden',
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

/* ============================================================
   Impact banner — outcome operacional/financeiro ACIMA dos highlights
   técnicos. Tradução de "stack" pra "valor de negócio".
   W2.1 (2026-05-23): consenso 4/4 IAs identificou que cases vendiam stack
   técnico, faltava bullet pra decisor não-dev. Metric em lime mono tabular
   + context em reading text, ambos sobre fundo lime-subtle.
   ============================================================ */

function ImpactBanner({ impact, className }: { impact: CaseStudy['impact']; className?: string }) {
  if (!impact) return null;
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border border-(--color-accent-emissive)',
        'bg-(--color-accent-subtle) px-4 py-3',
        className
      )}
    >
      <span className="font-mono text-2xs uppercase tracking-widest tabular-nums text-(--color-accent)">
        <span className="sr-only">Impacto operacional: </span>
        <span aria-hidden="true" className="mr-1.5">
          ›
        </span>
        {impact.metric}
      </span>
      <span className="text-sm leading-snug text-(--color-text-1)">{impact.context}</span>
    </div>
  );
}

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
      className={cn(
        TILE_SHELL,
        // W-mob2 #4: padding mobile p-4 (era p-5) reduz interior crunch em 343px net width.
        'grid p-4 sm:p-7 lg:p-8',
        'lg:grid-cols-[1.55fr_1fr] lg:gap-10 xl:gap-14'
      )}
    >
      {/* Cover LEFT 62% — tilt cinema, respira mais.
          F3.6 (2026-06-11): `eager` substitui o `preload` (cujo <link> no head
          competia com o hero-poster/LCP).
          HONESTIDADE (F3-review): HOJE este flagship é o Content Engine, que tem
          screenshot=null → CaseStudyCover renderiza um DIAGRAMA SVG inline (sem
          next/image, sem atributo loading). Então `eager` fica DORMENTE aqui —
          não há requisição de imagem pra adiantar. A prop está certa e só
          ativa quando o screenshot REAL do Content Engine chegar (Phase 2 /
          STEFAN-TODO #1): aí o cover vira <img> e `eager` evita o lazy pop-in
          sem furar a fila do LCP. Mantida pro handoff, não removida. */}
      <div className="relative">
        <CaseStudyCover
          caseStudy={caseStudy}
          aspectRatio="16/10"
          tilt="cinema"
          eager
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

        {/* W2.1: Impact banner ANTES dos highlights — outcome lê primeiro,
            stack lê em segundo. Caso decisor não-dev pare aqui, já tem valor. */}
        <ImpactBanner impact={caseStudy.impact} />

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

      {/* W2.1: Impact banner também nos half tiles (NexaCore + STJ App). */}
      <ImpactBanner impact={caseStudy.impact} />

      {highlights.length > 0 ? (
        <ul className="mt-1 flex flex-col gap-2 text-sm leading-snug text-(--color-text-2)">
          {highlights.map((h) => (
            <li key={h} className="flex gap-2.5">
              {/* W-design #2: bullets HalfTile usam text-3 (não lime) — lime
                  acumula em ~14% do site, ferindo regra 60/30/10. Reservado
                  pro HeroTile flagship (Content Engine) + impact banners +
                  accents pontuais. */}
              <span
                aria-hidden="true"
                className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-text-3)"
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
      className={cn(TILE_SHELL, 'flex flex-col gap-6 p-4 sm:p-7')}
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
