'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type ReactNode, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Layer 2 do 8-layer choreography: italic editorial accent + lime underline draws
// left→right via stroke-dashoffset. ease-enter (Material Emphasized) 400ms.
// Default delay 1.25s — alinha após split-text headline completar (Layer 1).
// Reduced-motion: snap drawn state.

interface EditorialAccentProps {
  children: ReactNode;
  className?: string;
  /** Segundos depois do mount pra começar a draw da underline. */
  delay?: number;
}

export function EditorialAccent({ children, className, delay = 1.25 }: EditorialAccentProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (!pathRef.current || reduced === null) return;

      const length = 100; // viewBox unit; non-scaling-stroke + pathLength=100 normalize

      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = reduced ? '0' : `${length}`;

      if (reduced) return;

      const tween = gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 0.4,
        delay,
        ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [reduced, delay] }
  );

  return (
    <span className={cn('relative inline-block', className)}>
      <em
        className="not-italic"
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'var(--color-accent)',
        }}
      >
        {children}
      </em>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute -bottom-1 left-0 h-[3px] w-full"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 0 1 L 100 1"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="square"
          pathLength={100}
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>
    </span>
  );
}
