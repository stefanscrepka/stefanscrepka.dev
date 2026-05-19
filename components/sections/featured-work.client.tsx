'use client';

import { m, useInView } from 'motion/react';
import { type ReactNode, useRef } from 'react';

// Reveal stagger client wrapper pro FeaturedWorkSection.
// Pattern parecido com WhatIBuildGrid mas sem aninhar lista (preserva semantics).

interface FeaturedWorkRevealProps {
  children: ReactNode;
}

export function FeaturedWorkReveal({ children }: FeaturedWorkRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </m.div>
  );
}
