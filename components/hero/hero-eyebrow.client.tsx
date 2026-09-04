'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Eyebrow mono do hero que "se resolve": os glifos chegam embaralhados e
// assentam da esquerda pra direita em ~700 ms, uma vez, no primeiro paint
// depois da hidratação. Padrão 21st/decrypt-text (acervo), reduzido ao
// essencial: o texto final está no HTML (SSR, SEO, leitores de tela), a
// animação só mexe num span aria-hidden, e reduced-motion nem começa.

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

interface HeroEyebrowProps {
  text: string;
  className?: string | undefined;
}

export function HeroEyebrow({ text, className }: HeroEyebrowProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const chars = Array.from(text);
    const keep = (c: string) => c === ' ' || c === '·' || c === ',' || c === '.';
    const duration = 700;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(p * chars.length);
      el.textContent = chars
        .map((c, i) =>
          i < resolved || keep(c) ? c : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? c)
        )
        .join('');
      if (p < 1) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <p
      data-slot="hero-eyebrow"
      className={cn(
        'font-mono text-2xs uppercase tracking-widest text-(--color-text-3)',
        className
      )}
    >
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </p>
  );
}
