'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MagneticCTA } from '@/components/ui-effects/magnetic-cta';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useCalModal } from '@/lib/contact/cal-modal-context';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';
import { cn } from '@/lib/utils';

// CTA group reveal — primary scroll pra #work, secondary abre Cal.com modal
// embedded (HANDOFF §97: nunca link externo). Animação stagger 50ms, 350ms
// spring tight back.out(1.6), delay 0.6s. Reduced-motion: snap final.

interface CTAGroupProps {
  className?: string;
}

export function CTAGroup({ className }: CTAGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const scroll = useAnchorScroll();
  const { openModal } = useCalModal();

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

      <Button size="lg" variant="outline" type="button" onClick={openModal} aria-haspopup="dialog">
        Conversar 15min →
      </Button>
    </div>
  );
}
