'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useEffect, useRef, useState } from 'react';
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
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const panelCount = panels.length;

  // Mobile dots sync via IntersectionObserver no carrossel snap-x.
  // root = trackEl (não viewport) pra detectar painel mais visível DENTRO do
  // scroll horizontal. threshold 0.5 pega quando metade do painel cruzou o
  // center do track.
  useEffect(() => {
    const track = mobileTrackRef.current;
    if (!track || panelCount < 2) return;
    const panelEls = track.querySelectorAll<HTMLElement>('[data-mob-panel]');
    if (panelEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number(visible[0].target.getAttribute('data-mob-panel') ?? '0');
          setActiveDot(idx);
        }
      },
      { root: track, threshold: [0.5, 0.75, 1] }
    );
    panelEls.forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [panelCount]);

  const scrollToMobilePanel = (idx: number) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const panel = track.querySelector<HTMLElement>(`[data-mob-panel="${idx}"]`);
    panel?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  };

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

          // W-motion #7: era ease:'none' + scrub:1 — navegação binária 1:1
          // com scroll. AGORA scrub:1.2 absorve mais jitter de trackpad/wheel +
          // ease power1.inOut suaviza inflection point central. D'Silva: scrub
          // sempre se beneficia de easing leve, mesmo quando "linear-feel".
          const tween = gsap.to(track, {
            x: distance,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger,
              start: 'top top+=80',
              end: () => `+=${(panelCount - 1) * window.innerHeight}`,
              pin: true,
              scrub: 1.2,
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
      <div className="relative hidden h-screen overflow-hidden md:block motion-reduce:hidden">
        {/* Fade-mask top — entrada cinematográfica. Alpha 0 → 100% nos primeiros
            80px pra evitar o efeito "panel cortado pelo nav" e dar respiração
            editorial quando a section pina. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-20"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-bg) 0%, color-mix(in oklch, var(--color-bg) 60%, transparent) 60%, transparent 100%)',
          }}
        />

        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${panelCount * 100}vw` }}
        >
          {panels.map((panel, idx) => (
            <section
              // biome-ignore lint/suspicious/noArrayIndexKey: panels prop é static (case study slug-keyed), nunca reordena
              key={`pinned-${idx}`}
              className="flex h-screen w-screen shrink-0 items-center justify-center px-6 pt-24 md:px-12 lg:pt-28"
              aria-roledescription="slide"
              aria-label={`Painel ${idx + 1} de ${panelCount}`}
            >
              {panel}
            </section>
          ))}
        </div>

        {showDots ? (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            {/* W-a11y médio #4: removido role="progressbar" + aria-* (conflito
                com aria-hidden no parent). Dots são decorativos no desktop
                (scroll natural já é a progress indication real). */}
            <span aria-hidden="true" className="flex items-center gap-2">
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

      {/* W-mob (2026-05-24): Mobile motion → carrossel CSS scroll-snap-x
          horizontal. Native momentum + snap, zero JS pra scroll. Dots sync
          via IntersectionObserver. Preserve "horizontal showcase" feel sem
          GSAP pin (que conflitava com Lenis em touch). */}
      <div className="md:hidden motion-reduce:hidden">
        <div
          ref={mobileTrackRef}
          className={cn(
            'flex gap-4 overflow-x-auto px-4 py-12',
            'snap-x snap-mandatory scroll-px-4',
            'scrollbar-hide [-webkit-overflow-scrolling:touch]',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          )}
        >
          {panels.map((panel, idx) => (
            <section
              // biome-ignore lint/suspicious/noArrayIndexKey: panels prop is static
              key={`mob-${idx}`}
              data-mob-panel={idx}
              className="shrink-0 w-[88vw] max-w-[440px] snap-center"
              aria-roledescription="slide"
              aria-label={`Painel ${idx + 1} de ${panelCount}`}
            >
              {panel}
            </section>
          ))}
        </div>

        {showDots && panelCount > 1 ? (
          <div className="flex items-center justify-center gap-3 pb-8">
            {panels.map((_, idx) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: panels prop is static
                key={`mob-dot-${idx}`}
                type="button"
                onClick={() => scrollToMobilePanel(idx)}
                aria-label={`Ir para painel ${idx + 1} de ${panelCount}`}
                aria-current={activeDot === idx ? 'true' : undefined}
                className={cn(
                  'flex items-center justify-center',
                  'min-h-11 min-w-11 outline-none',
                  'focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-(--color-border-focus)'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-(--motion-fast)',
                    activeDot === idx
                      ? 'w-6 bg-(--color-accent) shadow-(--shadow-glow-lime-sm)'
                      : 'w-1.5 bg-(--color-hairline-strong)'
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Reduced-motion (qualquer viewport): vertical stack natural — zero
          motion, zero carrossel. */}
      <div className="hidden motion-reduce:flex motion-reduce:flex-col motion-reduce:gap-12 motion-reduce:px-4 motion-reduce:py-12">
        {panels.map((panel, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: panels prop is static
            key={`stack-${idx}`}
          >
            {panel}
          </div>
        ))}
      </div>

      <div id="after-pinned" aria-hidden="true" />
    </section>
  );
}
