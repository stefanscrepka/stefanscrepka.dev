'use client';

import { m, useScroll, useSpring, useTransform } from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// TracingBeam vertical — SVG rail com gradiente lime que segue progress de scroll.
// Pattern Aceternity. useScroll target=ref + offsets, useTransform pra y1/y2 do
// linearGradient, useSpring pra smoothing.
// Reduced-motion: rail static + gradient drawn full (sem scroll binding).
// Mobile: mantém vertical, reduz left offset.

interface TracingBeamProps {
  children: ReactNode;
  className?: string;
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (!ref.current) return;
    const update = () => {
      if (ref.current) setSvgHeight(ref.current.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y1Raw = useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]);
  const y2Raw = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]);
  const y1 = useSpring(y1Raw, { stiffness: 500, damping: 90 });
  const y2 = useSpring(y2Raw, { stiffness: 500, damping: 90 });

  return (
    <div ref={ref} className={cn('relative w-full', className)} data-slot="tracing-beam">
      {/* Rail decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-3 sm:left-4 md:left-6"
        style={{ height: `${svgHeight}px` }}
      >
        {/* Dot inicial */}
        <span
          className={cn(
            'absolute -top-1 -left-2 grid size-4 place-items-center rounded-full',
            'border border-(--color-hairline-strong) bg-(--color-base)'
          )}
        >
          <span
            className={cn(
              'size-2 rounded-full',
              reduced ? 'bg-(--color-accent) shadow-(--shadow-glow-lime-sm)' : 'bg-(--color-text-3)'
            )}
          />
        </span>

        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          aria-hidden="true"
          focusable="false"
          className="block"
        >
          {/* Static gray path */}
          <path
            d={`M 1 0 V ${svgHeight}`}
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
            fill="none"
          />
          {/* Animated gradient path */}
          <m.path
            d={`M 1 0 V ${svgHeight}`}
            stroke="url(#tracing-beam-gradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <m.linearGradient
              id="tracing-beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={reduced ? 0 : y1}
              y2={reduced ? svgHeight : y2}
            >
              <stop stopColor="var(--color-accent)" stopOpacity="0" />
              <stop offset="0.4" stopColor="var(--color-accent)" stopOpacity="1" />
              <stop offset="0.6" stopColor="var(--color-accent)" stopOpacity="1" />
              <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
            </m.linearGradient>
          </defs>
        </svg>
      </div>

      <div className="pl-10 sm:pl-12 md:pl-14">{children}</div>
    </div>
  );
}
