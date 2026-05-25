'use client';

import { m, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { MagneticCTA } from '@/components/ui-effects/magnetic-cta';
import { useCalModal } from '@/lib/contact/cal-modal-context';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';
import { cn } from '@/lib/utils';

// CTA group reveal — primary scroll pra #work, secondary abre Cal.com modal.
// Migrado de GSAP pra Motion 12 declarativo: container stagger 50ms +
// child fade-up. Reduced-motion: snap final (initial = animate).

interface CTAGroupProps {
  className?: string;
}

export function CTAGroup({ className }: CTAGroupProps) {
  const reduced = useReducedMotion();
  const scroll = useAnchorScroll();
  const { openModal } = useCalModal();

  const itemInitial = reduced ? { opacity: 1 } : { opacity: 0, y: 8 };
  const itemAnimate = { opacity: 1, y: 0 };

  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        // W-motion #5: delayChildren 0.6 → 0.3. Antes os CTAs apareciam 600ms+
        // após mount (depois do reveal headline GSAP idle), e em mobile o user
        // já scrollava antes de ver. Material spec hero CTAs: 200-400ms após LCP.
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
      }}
      className={cn('flex flex-wrap items-center gap-3 sm:gap-4', className)}
    >
      <m.div
        variants={{ hidden: itemInitial, visible: itemAnimate }}
        transition={{ duration: 0.35, ease: EASES_BACK_OUT }}
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
            <a href="#work">Ver os 3 produtos →</a>
          </Button>
        </MagneticCTA>
      </m.div>

      <m.div
        variants={{ hidden: itemInitial, visible: itemAnimate }}
        transition={{ duration: 0.35, ease: EASES_BACK_OUT }}
      >
        <Button
          size="lg"
          variant="outline"
          type="button"
          onClick={openModal}
          aria-haspopup="dialog"
        >
          Agendar 15min →
        </Button>
      </m.div>
    </m.div>
  );
}

// back.out(1.6) GSAP equivalente em cubic-bezier — overshoot leve no fim.
const EASES_BACK_OUT = [0.34, 1.56, 0.64, 1] as const;
