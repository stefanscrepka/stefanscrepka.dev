'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { type InstitutionId, InstitutionLogo } from '@/components/shared/institution-logo';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { cn } from '@/lib/utils';

// Timeline client: TracingBeam vertical (Aceternity, scroll-driven) +
// 4 markers revelando sequencialmente. Year tabular-nums GRANDE lime no início
// + institution logos abaixo do title.

export interface TimelineMarker {
  year: string;
  place: string;
  title: string;
  body: string;
  institutions: InstitutionId[];
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
          visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
        }}
        className="flex flex-col gap-16 sm:gap-24"
      >
        {markers.map((marker, idx) => (
          <m.li key={marker.year} variants={itemVariants} className="relative flex flex-col gap-4">
            <MarkerDot index={idx} />

            {/* Year tabular-nums GRANDE lime — pattern Lando hero year tags */}
            <p className="mono-stats text-3xl font-bold leading-none text-(--color-accent) tabular-nums sm:text-4xl">
              <span className="sr-only">Ano </span>
              {marker.year}
            </p>

            <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
              ↳ {marker.place}
            </p>

            <h3 className="text-xl font-semibold tracking-tight text-(--color-text-1) sm:text-2xl">
              {marker.title}
            </h3>

            <p className="max-w-prose text-base leading-relaxed text-(--color-text-2)">
              {marker.body}
            </p>

            {/* Institution logos */}
            {marker.institutions.length > 0 ? (
              <InstitutionLogo ids={marker.institutions} size={16} className="pt-1" />
            ) : null}
          </m.li>
        ))}
      </m.ol>
    </TracingBeam>
  );
}

function MarkerDot({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -left-12 top-2 grid size-5 place-items-center sm:-left-14',
        'rounded-full border border-(--color-hairline-strong) bg-(--color-base)',
        'transition-colors duration-(--motion-transition)'
      )}
      data-active={inView ? '' : undefined}
      data-marker-index={index}
    >
      <span
        className={cn(
          'block size-2.5 rounded-full transition-all duration-(--motion-modal)',
          inView ? 'bg-(--color-accent) shadow-(--shadow-glow-lime-sm)' : 'bg-(--color-text-3)'
        )}
      />
    </span>
  );
}
