'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { type InstitutionId, InstitutionLogo } from '@/components/shared/institution-logo';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { EASES } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// Timeline editorial polish:
//   - Espaçamento vertical generoso entre markers (min 12rem)
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

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASES.dramatic },
  },
};

interface TimelineMarkersProps {
  markers: TimelineMarker[];
}

export function TimelineMarkers({ markers }: TimelineMarkersProps) {
  return (
    <TracingBeam>
      <m.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        variants={{
          hidden: {},
          // Disney overlapping action: 50ms stagger (era 220ms — lento demais pra
          // sequência editorial). Tightening dá ritmo sem perder leitura.
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
        }}
        className="flex flex-col gap-[8rem] sm:gap-[12rem] lg:gap-[14rem]"
      >
        {markers.map((marker, idx) => (
          <m.li key={marker.year} variants={itemVariants} className="relative flex flex-col gap-6">
            <MarkerDot index={idx} isCurrent={marker.isCurrent} />

            {/* Year + NOW badge row */}
            <div className="flex items-baseline gap-4">
              <p
                className={cn(
                  'mono-stats font-bold leading-[0.88] tabular-nums text-(--color-accent)',
                  'text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem]'
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
                      className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
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
          </m.li>
        ))}
      </m.ol>

      {/* Beam end glow — soft lime blur depois do último marker (não corta seco) */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-16 ml-3 h-32 w-px sm:ml-4 md:ml-6"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-accent) 0%, oklch(94% 0.22 124 / 0.4) 40%, transparent 100%)',
          filter: 'blur(2px)',
          boxShadow: '0 0 24px var(--color-accent-emissive)',
        }}
      />
    </TracingBeam>
  );
}

function MarkerDot({ index, isCurrent }: { index: number; isCurrent?: boolean | undefined }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        // Position: align with TracingBeam left rail (left-3 sm:left-4 md:left-6).
        // Negative offsets from the .pl-10/.pl-12/.pl-14 wrapper.
        'pointer-events-none absolute top-3 grid size-7 place-items-center',
        '-left-[1.875rem] sm:-left-[2rem] md:-left-[2.125rem]',
        'rounded-full border bg-(--color-base)',
        'transition-[border-color,box-shadow,transform] duration-(--motion-transition)',
        // Ring vira lime emissive quando marker entra no viewport (sinaliza
        // progresso ao longo do scroll, nao "está sempre off").
        inView ? 'border-(--color-accent)' : 'border-(--color-hairline-strong)',
        isCurrent && 'border-(--color-accent) shadow-(--shadow-glow-lime-sm)'
      )}
      data-active={inView ? '' : undefined}
      data-marker-index={index}
    >
      <span
        className={cn(
          'block size-3 rounded-full transition-all duration-(--motion-modal)',
          inView ? 'bg-(--color-accent) shadow-(--shadow-glow-lime-sm)' : 'bg-(--color-text-3)',
          isCurrent && 'animate-pulse'
        )}
      />
    </span>
  );
}
