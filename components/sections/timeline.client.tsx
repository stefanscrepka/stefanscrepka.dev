'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { TracingBeam } from '@/components/ui-effects/tracing-beam';
import { cn } from '@/lib/utils';

// Timeline client: TracingBeam vertical (Aceternity, scroll-driven) +
// 4 markers revelando sequencialmente on view (Motion 12 whileInView + stagger).
// Reduced-motion: beam estática completa, markers snap visíveis (Motion respect).

export interface TimelineMarker {
  year: string;
  place: string;
  title: string;
  body: string;
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
        className="flex flex-col gap-14 sm:gap-20"
      >
        {markers.map((marker, idx) => (
          <m.li key={marker.year} variants={itemVariants} className="relative flex flex-col gap-3">
            <MarkerDot index={idx} />

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-sm font-semibold text-(--color-accent) tabular-nums">
                {marker.year}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)">
                {marker.place}
              </span>
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-(--color-text-1) sm:text-2xl">
              {marker.title}
            </h3>

            <p className="max-w-prose text-base leading-relaxed text-(--color-text-2)">
              {marker.body}
            </p>
          </m.li>
        ))}
      </m.ol>
    </TracingBeam>
  );
}

// Decorative dot anchored to the tracing beam rail. Sequential pulse animation
// activated when marker enters viewport — pure CSS, no JS state.
function MarkerDot({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -left-12 top-1 grid size-5 place-items-center sm:-left-14',
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
