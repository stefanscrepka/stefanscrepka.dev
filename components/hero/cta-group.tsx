'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
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
        scale: 0.95,
        opacity: 0,
        duration: 0.35,
        stagger: 0.08,
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
        'flex flex-wrap items-center gap-3 sm:gap-4',
        // Pre-animation: invisible até GSAP kick in (evita flash). reduced-motion
        // dispensa via :where guard inline.
        className
      )}
    >
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
