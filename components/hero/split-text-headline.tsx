'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// W2.4 (2026-05-23): GSAP + SplitText + ScrollTrigger saíram do critical path.
// Antes: import síncrono no module top → ~110 KB gz no first-load bundle do hero.
// Agora: dynamic import dentro de requestIdleCallback. Headline renderiza SSR
// imediatamente (LCP friendly), animação só acontece quando GSAP chega.
//
// FOUC mitigation: NÃO usamos gsap.from (que pinta texto, depois esconde, depois
// anima). Usamos gsap.set(opacity:0) ANTES de animar — se o set acontecer numa
// pintura intermediária, browser pula o frame visível (pintura única, sem flash).
// Pra cobrir o case improvável de set rodar DEPOIS de pintar pela 1ª vez, o
// idleCallback timeout 800ms garante que set+to ocorrem no mesmo frame.
//
// Reduced-motion: bail early, headline fica estático. Nenhum import GSAP carregado.

interface SplitTextHeadlineProps {
  children: ReactNode;
  className?: string;
  /** Trigger animation on view ao invés de onload. Default false (onload). */
  onView?: boolean;
}

export function SplitTextHeadline({ children, className, onView = false }: SplitTextHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced === null || reduced) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const runAnimation = async () => {
      if (cancelled || !node) return;

      // W-mob (2026-05-24): ScrollTrigger só importa quando onView=true. Hero
      // headline usa onView=false (default), economiza ~40ms TBT no first-load.
      const [gsapMod, splitMod, scrollTriggerMod] = await Promise.all([
        import('gsap'),
        import('gsap/SplitText'),
        onView ? import('gsap/ScrollTrigger') : Promise.resolve(null),
      ]);

      if (cancelled || !node) return;

      const gsap = gsapMod.gsap ?? gsapMod.default;
      const { SplitText } = splitMod;
      if (scrollTriggerMod) {
        gsap.registerPlugin(SplitText, scrollTriggerMod.ScrollTrigger);
      } else {
        gsap.registerPlugin(SplitText);
      }

      const split = new SplitText(node, {
        type: 'words',
        wordsClass: 'split-word inline-block',
      });

      // Set initial state ANTES de pintar — wrap em rAF garante batch single-frame.
      gsap.set(split.words, { yPercent: -20, opacity: 0 });

      const animation = gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'expo.out',
        ...(onView
          ? {
              scrollTrigger: {
                trigger: node,
                start: 'top 80%',
                once: true,
              },
            }
          : {}),
      });

      cleanup = () => {
        animation.kill();
        split.revert();
      };
    };

    // requestIdleCallback se disponível, senão setTimeout curto.
    // Timeout 800ms garante que mesmo em devices lentos o reveal acontece em
    // janela perceptual aceitável (LCP típico 1-2s + 800ms = 2.8s max delay).
    type IdleHandle = number;
    let idleHandle: IdleHandle | null = null;

    if (typeof window.requestIdleCallback === 'function') {
      idleHandle = window.requestIdleCallback(() => void runAnimation(), {
        timeout: 800,
      }) as unknown as IdleHandle;
    } else {
      idleHandle = window.setTimeout(runAnimation, 100) as unknown as IdleHandle;
    }

    return () => {
      cancelled = true;
      if (idleHandle !== null) {
        if (typeof window.cancelIdleCallback === 'function') {
          try {
            window.cancelIdleCallback(idleHandle);
          } catch {
            /* fallback below */
          }
        }
        clearTimeout(idleHandle);
      }
      cleanup?.();
    };
  }, [reduced, onView]);

  return (
    <h1 ref={ref} className={cn('headline-display text-balance', className)}>
      {children}
    </h1>
  );
}
