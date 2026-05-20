'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MagneticCTA } from '@/components/ui-effects/magnetic-cta';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';
import { cn } from '@/lib/utils';

// Layer 4 do 8-layer choreography: CTA group reveal scale 0.95→1 + opacity 0→1,
// stagger 80ms, 350ms spring tight (stiffness 300 damping 10 equiv).
// delay 0.6s (após subhead Layer 3). Reduced-motion: snap final.
// Secondary CTA "Conversar 15min →" leva pra #contato (Cal.com modal embed = FASE 6).

interface CTAGroupProps {
  className?: string;
}

export function CTAGroup({ className }: CTAGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const scroll = useAnchorScroll();

  useGSAP(
    () => {
      if (!containerRef.current || reduced === null || reduced) return;

      const buttons = containerRef.current.querySelectorAll<HTMLElement>('[data-slot="button"]');
      const tween = gsap.from(buttons, {
        // y lift em vez de scale evita anti-pattern (scale hover decoração).
        // back.out spring overshoot dá feel de spring tight stiffness 300 damping 10.
        y: 8,
        opacity: 0,
        duration: 0.35,
        // Disney overlapping action: 50ms stagger (era 80ms — tightening pra
        // ritmo "snap-snap" em vez de "tic-toc").
        stagger: 0.05,
        delay: 0.6,
        ease: 'back.out(1.6)',
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [reduced], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'anim-pre-hidden flex flex-wrap items-center gap-3 sm:gap-4',
        // Pre-animation: invisible até GSAP kick in (via .anim-pre-hidden + data-pre-hydration).
        // reduced-motion: CSS rule pula override → visível direto.
        className
      )}
    >
      {/* Primary CTA recebe magnetic hover — anti-Awwwards: APENAS 1 magnetic por viewport. */}
      <MagneticCTA strength={6} range={80}>
        <Button
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            scroll('#work');
          }}
          asChild
        >
          <a href="#work">Ver os produtos →</a>
        </Button>
      </MagneticCTA>

      <Button
        size="lg"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          scroll('#contato');
        }}
        asChild
      >
        <a href="#contato">Conversar 15min →</a>
      </Button>
    </div>
  );
}
