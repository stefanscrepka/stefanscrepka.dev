import { type InstitutionId, InstitutionLogo } from '@/components/shared/institution-logo';
import { cn } from '@/lib/utils';
import { TimelineReveal } from './timeline.client';

// Section 10 — Jornada / Timeline. TracingBeam vertical (Aceternity) + 4 markers
// sequenciais. Cada marker ganha logos das instituições + year tabular-nums grande lime.
// Heritage industrial mencionado SÓ aqui (HANDOFF veta no hero).
//
// F3.2 (2026-06-11) — dieta de hidratação: o conteúdo dos markers
// (MarkerContent: year + NOW badge + place + title + body + instituições)
// é Server Component e entra na ilha TimelineReveal como children — só o
// reveal/beam/dot hidratam. Mesmo padrão do BentoSkills.
//
// Timeline editorial polish:
//   - Espaçamento vertical entre markers: 5/7/8rem (W-audit 2026-06-10)
//   - Year tabular-nums 80–96px peso bold lime (editorial)
//   - Microdetail hairline 60px conector entre year e place — signature
//   - Title h3 sans tight + body curta + institution chips com hairline
//   - MarkerDot lime emissive sobre o beam
//   - 2026 marker → NOW badge animated + glow ending no beam
//   - Lime único accent — zero AMBER

export interface TimelineMarker {
  year: string;
  place: string;
  title: string;
  body: string;
  institutions: InstitutionId[];
  /** Last marker — recebe "NOW" badge + glow ending. */
  isCurrent?: boolean;
}

const MARKERS: TimelineMarker[] = [
  {
    year: '2021 a 2023',
    place: 'SENAI Ponta Grossa',
    // F5 (2026-09-02): NBSP antes do "·" — no mobile (390px) o separador
    // abria linha ("· fundamento", "· três produtos"), mesma classe do fix
    // F4 #10 na stats row. Preso à palavra anterior, a quebra só acontece
    // DEPOIS dele.
    title: 'Eletrotécnica · fundamento',
    body: 'Diagramas elétricos, automação industrial, SolidWorks. Onde aprendi a pensar em sistemas que precisam funcionar 24/7. Tolerância zero pra "deve dar certo".',
    institutions: ['senai'],
  },
  {
    year: '2024',
    place: 'Scheffer Logística · B7Web Fullstack',
    title: 'Transição · eletromecânica + código',
    body: 'Eletromecânica de manhã, programação à noite. Primeiro produto em produção: site Estética MD (Vanilla JS + PHP + ScrollReveal). Provou que entrega importa mais que stack.',
    institutions: ['scheffer', 'b7web'],
  },
  {
    year: '2025',
    place: 'Makita do Brasil · Engenharia de Software Unicesumar',
    title: 'Profissionalização · três produtos em paralelo',
    body: 'Stack moderno: Next 15, React 19, TypeScript strict. O SaaS pra clínicas que hoje é a Caluna, o STJ App e sites de infoprodutos. Três produtos rodando ao mesmo tempo.',
    institutions: ['makita', 'unicesumar'],
  },
  {
    year: '2026',
    place: 'Content Engine · AI Product Engineer',
    title: 'Agora · multi-agente em produção',
    body: '19 agentes Claude em 5 squads, acordados por cron às 03h. Anti-slop com 28 regex pt-BR, inference local numa RTX 3070, aprovação humana em três botões no Telegram. E o STARK leva a mesma disciplina de volta ao chão de fábrica.',
    institutions: ['content-engine'],
    isCurrent: true,
  },
];

export type { InstitutionId };

export function TimelineSection() {
  return (
    <section
      id="jornada"
      className="container-narrow section-pad-y border-t border-(--color-hairline)"
      data-slot="timeline"
    >
      <header className="mb-14 flex flex-col gap-3 sm:mb-20">
        {/* Eyebrow editorial italic — raro no site (PP Editorial NAO usado aqui,
            usa Geist italic). Quebra padrao mono universal das outras sections. */}
        <p
          className="text-base italic text-(--color-text-3) sm:text-lg"
          style={{ letterSpacing: '-0.01em' }}
        >
          jornada
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl !leading-[1.05] text-balance">
          Da automação industrial pra IA multi-agente.
        </h2>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Cinco anos. Quatro estágios. Um fio condutor: construir sistemas que funcionam quando
          ninguém está olhando.
        </p>
      </header>

      <TimelineReveal
        items={MARKERS.map((marker) => ({
          key: marker.year,
          isCurrent: marker.isCurrent,
          children: <MarkerContent marker={marker} />,
        }))}
      />
    </section>
  );
}

// Conteúdo de um marker — 100% server-rendered (zero hidratação). O ping do
// NOW badge é CSS (motion-safe/reduce), sem gate JS.
function MarkerContent({ marker }: { marker: TimelineMarker }) {
  return (
    <>
      {/* Year + NOW badge row */}
      <div className="flex items-baseline gap-4">
        {/* W2.10 + W3.6 (2026-05-23): text-[2.25rem] no smallest pra
            caber "2021—2023" em 1 linha @ 320px. year-editorial substitui
            mono-stats — adiciona lining-nums + ss01 pra glyph editorial
            sem perder tabular alignment. */}
        {/* F5 (2026-09-02): ano em text-1 (era lime) e peso 600 (era 700, acima
            do teto da marca). Os quatro anos em lime eram a maior massa de
            acento do site — 2.17% de pixels cromáticos por viewport, contra
            0.06% no stepper equivalente do griffin.com (R4 §1.8) — e "lime só
            quando faz algo": o ano não faz nada; quem sinaliza progresso são o
            feixe, o marcador que acende e o badge NOW, que continuam lime. */}
        <p
          className={cn(
            'year-editorial font-semibold leading-[0.88] text-(--color-text-1)',
            'text-[2.25rem] sm:text-[4.5rem] lg:text-[5.5rem]'
          )}
          style={{ letterSpacing: '-0.04em' }}
        >
          <span className="sr-only">Ano </span>
          {marker.year}
        </p>

        {/* NOW badge — só no current marker */}
        {marker.isCurrent ? (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md',
              'border border-(--color-accent) bg-(--color-accent-subtle)',
              'px-2.5 py-1.5 font-mono text-2xs uppercase tracking-widest',
              'text-(--color-accent)'
            )}
            style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.10)' }}
          >
            <span className="relative flex size-1.5 items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping motion-reduce:hidden"
                style={{ background: 'var(--color-accent)' }}
              />
              <span
                aria-hidden="true"
                className="relative inline-flex size-1.5 rounded-full"
                style={{ background: 'var(--color-accent)' }}
              />
            </span>
            NOW
          </span>
        ) : null}
      </div>

      {/* Microdetail hairline 64px conector + place label — signature editorial */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="block h-px w-16 bg-(--color-accent)"
          style={{ opacity: 0.6 }}
        />
        <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
          {marker.place}
        </p>
      </div>

      {/* Title — sans tight, editorial */}
      <h3
        className={cn(
          'text-(--color-text-1) font-semibold tracking-tight',
          'text-2xl sm:text-3xl lg:text-[2.5rem]',
          '!leading-[1.05]'
        )}
      >
        {marker.title}
      </h3>

      {/* Body — reading pace 17px */}
      <p className="max-w-prose text-reading text-(--color-text-2)">{marker.body}</p>

      {/* Institutions — cards hairline com inset highlight */}
      {marker.institutions.length > 0 ? (
        <div className="pt-3">
          <InstitutionLogo ids={marker.institutions} size={20} />
        </div>
      ) : null}
    </>
  );
}
