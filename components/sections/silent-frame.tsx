'use client';

import { m, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// "O silêncio antes do nome" — momento arquétipo entre Hero e Featured Work.
// Frame de 70dvh com frase isolada PP Editorial italic. Scroll-cue só aparece
// após 3 segundos sentado no fold — o site recusa-se a "vender" no primeiro frame.
// Pattern: Lando Norris pausa cinematográfica + Apple "uma palavra basta".

interface SilentFrameProps {
  /** Quote pra exibir. Default = manifesto do Stefan. */
  quote?: string;
  className?: string | undefined;
}

const DEFAULT_QUOTE =
  'Construo sistemas que pensam — não produtos que apenas funcionam.';

export function SilentFrame({ quote = DEFAULT_QUOTE, className }: SilentFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -200px 0px' });
  const reduced = useReducedMotionSafe();
  const [cueVisible, setCueVisible] = useState(false);

  // Scroll-cue só aparece após 3s sentado no viewport
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCueVisible(true);
      return;
    }
    const timeout = setTimeout(() => setCueVisible(true), 3000);
    return () => clearTimeout(timeout);
  }, [inView, reduced]);

  return (
    <section
      ref={ref}
      data-slot="silent-frame"
      aria-label="Momento de pausa editorial"
      className={cn(
        'relative isolate flex min-h-[70dvh] items-center justify-center px-6',
        'border-t border-(--color-hairline)',
        className
      )}
    >
      <m.p
        initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1.2, ease: [0.165, 0.84, 0.44, 1], delay: 0.3 }}
        className={cn(
          'max-w-[22ch] text-center leading-[1.15] tracking-[-0.015em]',
          'text-2xl sm:text-3xl lg:text-[2.5rem]',
          'text-(--color-text-1)'
        )}
        style={{
          fontFamily: 'var(--font-editorial)',
          fontStyle: 'italic',
          fontWeight: 500,
        }}
      >
        {quote}
      </m.p>

      {/* Scroll cue minimal — aparece só após 3s */}
      <m.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: cueVisible ? 0.4 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)">
            scroll
          </span>
          <svg viewBox="0 0 12 16" width="12" height="16" className="text-(--color-text-3)">
            <title>continuar</title>
            <path
              d="M6 0v14M2 10l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </m.div>
    </section>
  );
}
