'use client';

import { m, useScroll, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import { useIsTouch } from '@/hooks/use-is-touch';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// MacBookScroll Aceternity pattern — scroll-driven lid open + scale expand.
// 200vh container; useScroll progress → 5 transforms (scaleX, scaleY, translateY,
// rotateX lid, opacity title).
// Reduced-motion: render lid open (rotateX=0) statically, screenshot full-size.
// W-mob (2026-05-24): touch devices renderizam versão estática compacta com
// aspect-ratio (sem container 200vh, sem motion). Preserva experiência desktop
// 100%; mobile ganha layout natural sem fake-scroll vazio.

interface MacBookScrollProps {
  title?: ReactNode;
  badge?: ReactNode;
  screen: ReactNode;
  className?: string;
}

export function MacBookScroll({ title, badge, screen, className }: MacBookScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const isTouch = useIsTouch();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Desktop scale ranges — mobile path nem renderiza estes hooks (early return)
  // W-design (2026-05-26): rotateX REMOVIDO — antes começava em Math.PI (lid
  // fechada apontando pra baixo, invisível em scrollYProgress=0). Resultava
  // em screenshot estático (Playwright/preview) mostrando moldura vazia até o
  // user scrollar 50% do range. Agora lid SEMPRE aberta; apenas o scale dá
  // o "reveal" effect. Apple Pro Display ad-style preservado via scaling.
  const scaleX = useTransform(scrollYProgress, [0, 0.3], [0.85, 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.85, 1.5]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Mobile/touch: layout estático compacto. Aspect-ratio 16/10 mimica a tela do
  // laptop; sem container 200vh, sem motion. Mantém moldura visual mas usuário
  // rola normal pela página.
  if (isTouch === true) {
    return (
      <div
        className={cn('container-max relative w-full py-12', className)}
        data-slot="macbook-scroll-static"
      >
        {title ? <div className="mb-6 text-center">{title}</div> : null}
        <div
          className={cn(
            'relative mx-auto w-full max-w-[860px] rounded-xl border-2 border-(--color-hairline-strong)',
            'bg-(--color-bg) p-2 shadow-(--shadow-cinema)'
          )}
        >
          <div
            className={cn(
              'relative aspect-[16/10] w-full overflow-hidden rounded-md',
              'bg-(--color-surface-elevated)'
            )}
          >
            {screen}
          </div>
        </div>
        {badge ? <div className="mt-6 flex justify-center">{badge}</div> : null}
      </div>
    );
  }

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
          {/* Lid — contains the screen. Always-open (rotateX=0) pra static
              snapshots ficarem visualmente complete; scaling cuida do reveal. */}
          <m.div
            style={
              reduced
                ? { transformOrigin: 'bottom', transformStyle: 'preserve-3d' }
                : {
                    transformOrigin: 'bottom',
                    transformStyle: 'preserve-3d',
                    scaleX,
                    scaleY,
                    translateY,
                  }
            }
            className={cn(
              'relative w-[90vw] max-w-[860px] origin-bottom rounded-t-xl',
              'border-2 border-(--color-hairline-strong) bg-(--color-bg)',
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
              className="absolute top-0 left-1/2 h-3 w-16 -translate-x-1/2 rounded-b-md bg-(--color-bg)"
            />
          </m.div>

          {/* Base — static keyboard hint */}
          <div
            aria-hidden="true"
            className={cn(
              'relative w-[92vw] max-w-[880px] h-6',
              'rounded-b-2xl border-2 border-t-0 border-(--color-hairline-strong)',
              'bg-gradient-to-b from-(--color-surface) to-(--color-bg)',
              'shadow-(--shadow-cinema)'
            )}
          >
            <div className="absolute top-1/2 left-1/2 h-1 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-bg)" />
          </div>
        </div>

        {badge ? <div className="mt-8">{badge}</div> : null}
      </div>
    </div>
  );
}
