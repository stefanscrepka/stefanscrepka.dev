'use client';

import { m, useScroll, useTransform } from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// MacBookScroll Aceternity pattern — scroll-driven lid open + scale expand.
// 200vh container; useScroll progress → 5 transforms (scaleX, scaleY, translateY,
// rotateX lid, opacity title).
// Reduced-motion: render lid open (rotateX=0) statically, screenshot full-size.
// Mobile: narrower scale ranges (window.innerWidth check).

interface MacBookScrollProps {
  title?: ReactNode;
  badge?: ReactNode;
  screen: ReactNode;
  className?: string;
}

export function MacBookScroll({ title, badge, screen, className }: MacBookScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Transforms — scale ranges narrower em mobile
  const scaleX = useTransform(scrollYProgress, [0, 0.3], isMobile ? [0.7, 1.05] : [1.2, 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], isMobile ? [0.6, 1.05] : [0.6, 1.5]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 500]);
  // Lid abre de 180° → 0° (fechado → aberto)
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [Math.PI, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className={cn('relative w-full', !reduced && 'h-[200vh] md:h-[220vh]', className)}
      data-slot="macbook-scroll"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-start overflow-hidden pt-16 lg:pt-24">
        {title ? (
          <m.div
            style={reduced ? { opacity: 1 } : { opacity: titleOpacity }}
            className="container-max mb-8 text-center"
          >
            {title}
          </m.div>
        ) : null}

        <div className="flex flex-col items-center" style={{ perspective: '800px' }}>
          {/* Lid — contains the screen */}
          <m.div
            style={
              reduced
                ? { transformOrigin: 'bottom', transformStyle: 'preserve-3d' }
                : {
                    rotateX,
                    transformOrigin: 'bottom',
                    transformStyle: 'preserve-3d',
                    scaleX,
                    scaleY,
                    translateY,
                  }
            }
            className={cn(
              'relative w-[90vw] max-w-[860px] origin-bottom rounded-t-xl',
              'border-2 border-[#222] bg-[#0a0b09]',
              'p-2 shadow-(--shadow-cinema)'
            )}
          >
            <div
              className={cn(
                'relative aspect-[16/10] w-full overflow-hidden rounded-t-md',
                'bg-(--color-surface-elevated)'
              )}
            >
              {screen}
            </div>
            {/* Notch */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-3 w-16 -translate-x-1/2 rounded-b-md bg-[#0a0b09]"
            />
          </m.div>

          {/* Base — static keyboard hint */}
          <div
            aria-hidden="true"
            className={cn(
              'relative w-[92vw] max-w-[880px] h-6',
              'rounded-b-2xl border-2 border-t-0 border-[#222]',
              'bg-gradient-to-b from-[#1a1c19] to-[#0a0b09]',
              'shadow-(--shadow-cinema)'
            )}
          >
            <div className="absolute top-1/2 left-1/2 h-1 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0b09]" />
          </div>
        </div>

        {badge ? <div className="mt-8">{badge}</div> : null}
      </div>
    </div>
  );
}
