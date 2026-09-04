import Link from 'next/link';
import { ViewTransition } from 'react';
import { CaseStudyCover } from '@/components/work/case-study-cover';
import { cn } from '@/lib/utils';
import { CASE_STUDIES, type CaseStudy } from '@/lib/work/data';
import { FeaturedWorkRevealController } from './featured-work.client';

// Featured Work — três tiles tratados como REGISTROS, não como vitrines.
//
//   • Hero tile (Content Engine, cover-LEFT 61%) respira mais largo.
//   • Half tiles ESPELHADOS (NexaCore text-LEFT cover-RIGHT, STARK text-RIGHT
//     cover-LEFT) quebram simetria e mantêm reading rhythm.
//
// F6 (2026-09-04) — o que saiu e por quê:
//   • O cover do flagship era um diagrama SVG de caixas ("IN → S0 … E-0"). Agora
//     é uma captura do Content Engine Studio rodando (página Equipe: a caixa de
//     entrada com o pacote do dia + os agentes). Diagrama é afirmação; captura é
//     evidência.
//   • O STJ App saiu (decisão do Stefan) e entrou o STARK — passagem de turno
//     industrial, o elo entre a eletrotécnica da timeline e o software de hoje.
//   • Halos lime (60px em volta de cada mockup, 32–48px no hover dos tiles,
//     glass-panel com backdrop-blur) foram removidos. Elevação por borda: o
//     tile em hover sobe 2px, a borda clareia um degrau da escada de hairlines e
//     as marcas de corte da moldura acendem em lime — o único acento que "faz
//     algo" além do CTA.
//   • Lime só em ação: sequence label e bullets viraram text-3/text-2; o impact
//     banner perdeu o fundo lime e virou régua de 2px (acento como estrutura,
//     R4 §1.12).
//   • O SquadsStatusLine (pontinhos lime pulsando "S0 → S1 → …") saiu: simulava
//     um pipeline "vivo" que a página não lê — mesma classe das status bars de
//     INFRA removidas no F5.

export function FeaturedWorkSection() {
  const contentEngine = CASE_STUDIES['content-engine'];
  const caluna = CASE_STUDIES.caluna;
  const stark = CASE_STUDIES.stark;

  return (
    <section
      id="work"
      data-slot="featured-work"
      className="container-max section-pad-y-lg border-t border-(--color-hairline)"
    >
      <header className="mb-16 flex flex-col gap-4 sm:mb-20 lg:mb-24">
        <p className="eyebrow">FEATURED WORK</p>
        {/* F5 (2026-09-02): duas tonalidades por LUMINÂNCIA (text-1 / text-2),
            não por matiz — ênfase de graça saindo da própria rampa de texto,
            sem gastar um pixel de acento (R4 §1.11, resend.com). */}
        <h2
          className={cn(
            'text-3xl font-semibold text-(--color-text-1) sm:text-4xl',
            '!tracking-tight !leading-[1.05] text-balance'
          )}
        >
          Três produtos.
          <br />
          <span className="text-(--color-text-2)">Três problemas resolvidos.</span>
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          O Content Engine escreve e revisa conteúdo todo dia com uma equipe de agentes. A Caluna
          atende as clientes de uma clínica no WhatsApp. O STARK tira a passagem de turno de uma
          fábrica do Excel. Cada um com escopo real e capturas do produto rodando.
        </p>
      </header>

      {/* W-audit (2026-06-10): HeroTile e a row de half-tiles são children
          DIRETOS do reveal — o stagger de 80ms depende disso.
          F5 (2026-09-02): reveal em CSS + controlador (featured-work.client.tsx).
          Os tiles ficam na árvore RSC — condição pro morph do título via
          View Transition. `--reveal-i` = ordem do stagger (80ms). */}
      <FeaturedWorkRevealController />
      <noscript>
        <style>{`[data-slot='featured-work'] [data-reveal='pending'] [data-reveal-item]{opacity:1;transform:none}`}</style>
      </noscript>
      <div
        data-reveal-group
        data-reveal="pending"
        className="flex flex-col gap-8 sm:gap-16 lg:gap-20"
      >
        {/* Hero tile FULL-BLEED — Content Engine flagship */}
        <div data-reveal-item style={{ '--reveal-i': 0 } as React.CSSProperties}>
          <HeroTile caseStudy={contentEngine} sequenceIndex={1} totalCount={3} />
        </div>

        {/* Half-tiles ESPELHADOS. Os dois covers são 16/10 (proporção nativa
            das capturas a 2880×1800) — capas iguais, CTAs alinhados. */}
        <div
          data-reveal-item
          style={{ '--reveal-i': 1 } as React.CSSProperties}
          className="grid gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-12"
        >
          <HalfTile caseStudy={caluna} sequenceIndex={2} totalCount={3} direction="text-left" />
          <HalfTile caseStudy={stark} sequenceIndex={3} totalCount={3} direction="text-right" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Sequence label — "01 / 03 — NAME". Mono, sem lime: é metadado, não ação.
   ============================================================ */

function SequenceLabel({ index, total, label }: { index: number; total: number; label: string }) {
  return (
    <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
      <span className="tabular-nums text-(--color-text-2)">{String(index).padStart(2, '0')}</span>
      <span className="mx-1.5">/</span>
      <span className="tabular-nums">{String(total).padStart(2, '0')}</span>
      <span className="mx-2.5">·</span>
      <span className="text-(--color-text-2)">{label}</span>
    </p>
  );
}

/* ============================================================
   Tile shell — shared class system pra hero + half.
   Hairline 1px + inset bisel. Hover: sobe 2px, a borda clareia um degrau e
   as marcas de corte da moldura acendem (var --tick-color, lida pelo
   ArtifactFrame). Foco de teclado: borda cheia em lime (indicador inequívoco).
   ============================================================ */

const TILE_SHELL = [
  // W-audit (2026-06-10): outline-none → outline-hidden. O foco aqui é
  // indicado por borda (abaixo), que some em forced-colors (Windows High
  // Contrast); outline-hidden preserva um outline transparente que o sistema
  // torna visível nesse modo.
  'group/tile relative isolate overflow-hidden rounded-2xl outline-hidden',
  'border border-(--color-hairline) bg-(--color-surface)',
  'shadow-(--shadow-inset-bisel)',
  '[--tick-color:var(--color-hairline-strong)]',
  // Hover meio-termo 350ms (Stefan escolheu entre snap 200ms e cinematic 600ms).
  'transition-[transform,border-color,box-shadow,opacity] duration-[350ms] ease-(--ease-standard)',
  'hover:-translate-y-[2px] hover:border-(--color-hairline-alpha-3) hover:[--tick-color:var(--color-accent)]',
  'focus-visible:-translate-y-[2px] focus-visible:border-(--color-accent) focus-visible:[--tick-color:var(--color-accent)]',
].join(' ');

/* ============================================================
   Impact banner — outcome operacional/financeiro ACIMA dos highlights
   técnicos. Tradução de "stack" pra valor de negócio (W2.1, 2026-05-23).
   F6: era caixa com fundo lime-subtle + borda lime + métrica lime — três
   fills lime por viewport. Agora é uma régua de 2px (acento como estrutura),
   métrica em text-1.
   ============================================================ */

function ImpactBanner({ impact, className }: { impact: CaseStudy['impact']; className?: string }) {
  if (!impact) return null;
  return (
    <div className={cn('flex flex-col gap-1 border-l-2 border-(--color-accent) pl-4', className)}>
      <span className="font-mono text-2xs uppercase tracking-widest tabular-nums text-(--color-text-1)">
        <span className="sr-only">Impacto operacional: </span>
        {impact.metric}
      </span>
      <span className="text-sm leading-snug text-(--color-text-2)">{impact.context}</span>
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span
        aria-hidden="true"
        className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-(--color-text-3)"
      />
      <span>{children}</span>
    </li>
  );
}

/* ============================================================
   Hero tile — Content Engine. Cover LEFT 61%, text RIGHT 39%.
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
        'grid p-4 sm:p-7 lg:p-8',
        'lg:grid-cols-[1.55fr_1fr] lg:gap-10 xl:gap-14'
      )}
    >
      {/* Cover LEFT — captura real do Studio. `eager`: é o maior <img> acima
          da segunda dobra e o primeiro artefato real da página; sem <link
          rel=preload> (competiria com o LCP, que é o H1). */}
      <div className="relative">
        <CaseStudyCover
          caseStudy={caseStudy}
          eager
          sizes="(min-width: 1280px) 780px, (min-width: 1024px) 58vw, 100vw"
          className="relative z-10"
        />
      </div>

      {/* Copy RIGHT */}
      <div className="flex flex-col gap-6 pt-2 lg:py-6">
        <SequenceLabel index={sequenceIndex} total={totalCount} label="FLAGSHIP · CONTENT ENGINE" />

        {/* F5 (2026-09-02): título compartilhado com o <h1> do case — a View
            Transition casa os dois pelo `name` e faz o morph tile → case
            (classe `case-title-morph`, globals.css). enter/exit="none": fora
            do par (ex.: home → /process) o título some junto com a página,
            sem grupo próprio. */}
        <ViewTransition
          name={`case-title-${caseStudy.slug}`}
          share="case-title-morph"
          enter="none"
          exit="none"
        >
          <h3
            className={cn(
              'font-semibold text-(--color-text-1)',
              'text-3xl sm:text-4xl lg:text-[2.75rem]',
              '!tracking-tight !leading-[1.05]'
            )}
          >
            {caseStudy.title}
          </h3>
        </ViewTransition>

        <p className="text-reading text-(--color-text-2)">{caseStudy.tagline}</p>

        <ImpactBanner impact={caseStudy.impact} />

        <ul className="mt-1 flex flex-col gap-2.5 text-sm leading-snug text-(--color-text-2)">
          <Bullet>19 agentes Claude em 5 squads, mais 6 no onboarding</Bullet>
          <Bullet>Cron no fuso de São Paulo: inteligência às 03h, pacote pronto às 07h30</Bullet>
          <Bullet>Anti-slop com 28 regex pt-BR · 2.059 testes no runtime · 57 tabelas</Bullet>
        </ul>

        <CaseCTA className="mt-auto pt-6" />
      </div>
    </Link>
  );
}

/* ============================================================
   Half tile — text-left/text-right espelhado.
   ============================================================ */

function HalfTile({
  caseStudy,
  sequenceIndex,
  totalCount,
  direction,
}: {
  caseStudy: CaseStudy;
  sequenceIndex: number;
  totalCount: number;
  direction: 'text-left' | 'text-right';
}) {
  const textFirst = direction === 'text-left';
  const label = caseStudy.slug.toUpperCase().replace('-', ' ');
  const highlights = HIGHLIGHTS_BY_SLUG[caseStudy.slug] ?? [];

  const cover = (
    <CaseStudyCover
      caseStudy={caseStudy}
      sizes="(min-width: 1280px) 620px, (min-width: 1024px) 46vw, 100vw"
    />
  );

  const textBlock = (
    <div className="flex flex-col gap-4">
      <SequenceLabel index={sequenceIndex} total={totalCount} label={label} />
      <ViewTransition
        name={`case-title-${caseStudy.slug}`}
        share="case-title-morph"
        enter="none"
        exit="none"
      >
        <h3
          className={cn(
            'font-semibold text-(--color-text-1)',
            'text-2xl sm:text-[1.75rem] lg:text-3xl',
            '!tracking-tight !leading-[1.05]'
          )}
        >
          {caseStudy.title}
        </h3>
      </ViewTransition>
      <p className="text-sm leading-relaxed text-(--color-text-2)">{caseStudy.tagline}</p>

      <ImpactBanner impact={caseStudy.impact} />

      {highlights.length > 0 ? (
        <ul className="mt-1 flex flex-col gap-2 text-sm leading-snug text-(--color-text-2)">
          {highlights.map((h) => (
            <Bullet key={h}>{h}</Bullet>
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
   ============================================================ */

const HIGHLIGHTS_BY_SLUG: Record<string, string[]> = {
  caluna: [
    'Assistente com 11 ferramentas: consulta a agenda, marca, cobra por PIX, confirma',
    'Next 14 + Clerk + Prisma · 35 modelos, 27 com tenantId',
    'Evolution API (WhatsApp) · BullMQ · Socket.io em tempo real',
  ],
  stark: [
    'Next 16 + Prisma + Postgres 17 · on-premises, sem internet',
    'OEE dígito a dígito contra o Excel oficial · 153 testes',
    'Telão 16:9 pra TV da sala de controle · PDF + XLSX',
  ],
};
