'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// GSAP ScrollTrigger pin + horizontal translate.
// matchMedia branches:
// - desktop (≥768px + no-preference): pin + scrub + horizontal slide N panels
// - mobile / reduced: vertical stack natural scroll, sem pin
// Dots progress sincronizados via onUpdate.

interface ScrollPinnedHorizontalProps {
  panels: ReactNode[];
  /** Aria label da region. */
  ariaLabel?: string;
  className?: string;
  /** Mostra dots progress indicator. Default true. */
  showDots?: boolean;
}

export function ScrollPinnedHorizontal({
  panels,
  ariaLabel = 'Showcase horizontal',
  className,
  showDots = true,
}: ScrollPinnedHorizontalProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const panelCount = panels.length;

  useGSAP(
    () => {
      if (!triggerRef.current || !trackRef.current) return;
      if (panelCount < 2) return;

      const mm = gsap.matchMedia();

      // Desktop com motion preference → pin + scrub
      mm.add(
        {
          isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          if (!context.conditions?.isDesktop) return;

          const track = trackRef.current;
          const trigger = triggerRef.current;
          if (!track || !trigger) return;

          const distance = () => -(panelCount - 1) * window.innerWidth;

          const tween = gsap.to(track, {
            x: distance,
            ease: 'none',
            scrollTrigger: {
              trigger,
              start: 'top top',
              end: () => `+=${(panelCount - 1) * window.innerHeight}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setActiveDot(Math.round(self.progress * (panelCount - 1)));
              },
            },
          });

          return () => {
            tween.kill();
          };
        }
      );

      // Mobile ou reduced-motion → no pin, vertical stack natural
      mm.add(
        {
          isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)',
        },
        () => {
          // Apenas garante x:0 (case panel já tinha sido transladada).
          if (trackRef.current) gsap.set(trackRef.current, { x: 0 });
        }
      );

      return () => {
        mm.revert();
      };
    },
    { dependencies: [panelCount], scope: triggerRef }
  );

  return (
    <section
      ref={triggerRef}
      aria-label={ariaLabel}
      data-slot="scroll-pinned-horizontal"
      className={cn('relative w-full', className)}
    >
      <a
        href="#after-pinned"
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10',
          'focus:rounded-md focus:bg-(--color-accent) focus:px-3 focus:py-2',
          'focus:font-mono focus:text-xs focus:text-(--color-text-on-accent)'
        )}
      >
        Pular showcase
      </a>

      {/* Desktop: viewport pinned, track translates */}
      <div className="hidden h-screen overflow-hidden md:block motion-reduce:hidden">
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${panelCount * 100}vw` }}
        >
          {panels.map((panel, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: panels prop is static, never reorders
            // biome-ignore lint/a11y/useSemanticElements: role=group preserves slide semantics in pinned context
            <div
              key={`pinned-${idx}`}
              className="flex h-screen w-screen shrink-0 items-center justify-center px-6 md:px-12"
              role="group"
              aria-roledescription="slide"
              aria-label={`Painel ${idx + 1} de ${panelCount}`}
            >
              {panel}
            </div>
          ))}
        </div>

        {showDots ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <span
              aria-hidden="true"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={panelCount - 1}
              aria-valuenow={activeDot}
              className="flex items-center gap-2"
            >
              {panels.map((_, idx) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: panels prop is static
                  key={`dot-${idx}`}
                  className={cn(
                    'block size-1.5 rounded-full transition-all duration-(--motion-fast)',
                    activeDot === idx
                      ? 'w-6 bg-(--color-accent) shadow-(--shadow-glow-lime-sm)'
                      : 'bg-(--color-hairline-strong)'
                  )}
                />
              ))}
            </span>
          </div>
        ) : null}
      </div>

      {/* Mobile / reduced-motion: vertical stack natural */}
      <div className="flex flex-col gap-12 px-4 py-12 md:hidden motion-reduce:flex motion-reduce:md:flex">
        {panels.map((panel, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: panels prop is static
            key={`stack-${idx}`}
            className="snap-start"
          >
            {panel}
          </div>
        ))}
      </div>

      <div id="after-pinned" aria-hidden="true" />
    </section>
  );
}
