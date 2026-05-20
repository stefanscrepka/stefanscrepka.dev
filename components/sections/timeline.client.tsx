'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { type InstitutionId, InstitutionLogo } from '@/components/shared/institution-logo';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { cn } from '@/lib/utils';

// Timeline com proporções tipográficas DRAMÁTICAS:
//   - Year tabular-nums 96px peso bold lime (era 28px)
//   - Microdetail hairline 60px conector entre year e marker (signature editorial)
//   - Institution logos 80x80 em cards hairline outline (era inline 16px)
//   - Last marker (2026) ganha badge "NOW" + beam end glow blur (não corta seco)

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
    transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] as const },
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
          visible: { transition: { staggerChildren: 0.25, delayChildren: 0.1 } },
        }}
        className="flex flex-col gap-20 sm:gap-28"
      >
        {markers.map((marker, idx) => (
          <m.li key={marker.year} variants={itemVariants} className="relative flex flex-col gap-5">
            <MarkerDot index={idx} isCurrent={marker.isCurrent} />

            {/* Year tabular-nums GIGANTE 96px peso bold lime */}
            <div className="flex items-baseline gap-4">
              <p
                className={cn(
                  'mono-stats font-bold leading-[0.9] tabular-nums text-(--color-accent)',
                  'text-5xl sm:text-6xl lg:text-7xl'
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
                    'px-2 py-1 font-mono text-[10px] uppercase tracking-widest',
                    'text-(--color-accent)'
                  )}
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

            {/* Microdetail hairline 60px conector — signature editorial */}
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="block h-px w-16 bg-(--color-accent)"
                style={{ opacity: 0.6 }}
              />
              <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
                {marker.place}
              </p>
            </div>

            <h3 className="text-2xl font-semibold tracking-tight text-(--color-text-1) sm:text-3xl">
              {marker.title}
            </h3>

            <p className="max-w-prose text-base leading-relaxed text-(--color-text-2)">
              {marker.body}
            </p>

            {marker.institutions.length > 0 ? (
              <InstitutionLogo ids={marker.institutions} size={20} className="pt-2" />
            ) : null}
          </m.li>
        ))}
      </m.ol>

      {/* Beam end glow — soft lime blur depois do último marker (não corta seco) */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-12 ml-4 h-32 w-px"
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
        'pointer-events-none absolute -left-12 top-3 grid size-6 place-items-center sm:-left-14',
        'rounded-full border border-(--color-hairline-strong) bg-(--color-base)',
        'transition-colors duration-(--motion-transition)',
        isCurrent && 'border-(--color-accent)'
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
