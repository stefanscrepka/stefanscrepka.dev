'use client';

import { m, useMotionValue, useSpring } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// MagneticCTA — wrapper que move o child ±N pixels em direção do cursor
// quando proximidade <80px. Pattern Linear/Vercel/Stripe signature pra CTAs primary.
// Reduced-motion: pass-through (sem magnetic).
// IMPORTANTE: aplicar APENAS em UM ou DOIS CTAs primary por página — não em todos
// os botões (anti-Awwwards generic).

interface MagneticCTAProps {
  children: ReactNode;
  /** Pixels max de translate em direção ao cursor. Default 6. */
  strength?: number;
  /** Distância em px onde efeito ativa. Default 80. */
  range?: number;
  className?: string | undefined;
}

export function MagneticCTA({ children, strength = 6, range = 80, className }: MagneticCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.3 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced !== false || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < range) {
      // Normalized direction × strength
      const force = 1 - distance / range;
      x.set((dx / distance) * strength * force);
      y.set((dy / distance) * strength * force);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced !== false) {
    return (
      <div ref={ref} className={cn('inline-block', className)}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn('inline-block will-change-transform', className)}
    >
      {children}
    </m.div>
  );
}
