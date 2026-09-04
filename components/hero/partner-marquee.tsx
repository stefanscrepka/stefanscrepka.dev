'use client';

import { useEffect, useRef } from 'react';
import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { cn } from '@/lib/utils';

// Partner marquee — infinite linear scroll de logos do stack/parceiros.
// Pattern Lando Norris parceiros row + AnimeJS sponsor strip.
//
// F5 (2026-09-02): o loop virou CSS puro (`@keyframes marquee-x` em
// globals.css, `translate3d(-50%)` sobre a track com duas cópias — a mesma
// geometria do tween GSAP anterior). Motivos, medidos:
//   • GSAP core (~28 KB gz) era importado dinamicamente aqui e no CountUp em
//     toda visita, inclusive mobile — só pra mover uma faixa e contar até 100.
//   • CSS animation = compositor-only, zero JS por frame.
// Pausa no hover é `:hover` em CSS; pausa fora da viewport é o atributo
// `data-offscreen` (IntersectionObserver, única responsabilidade desta ilha).
// Reduced-motion: `@media` em globals.css desliga a animação — faixa estática.

const TECH_ITEMS: TechId[] = [
  'vercel',
  'nextjs',
  'react',
  'typescript',
  'anthropic',
  'tailwind',
  'three',
  'gsap',
  'motion',
  'postgres',
  'drizzle',
  'redis',
  'shiki',
  'supabase',
  'stripe',
  'whatsapp',
  'telegram',
  'sentry',
];

interface PartnerMarqueeProps {
  className?: string | undefined;
}

export function PartnerMarquee({ className }: PartnerMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute('data-offscreen', !(entry?.isIntersecting ?? true));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-slot="partner-marquee"
      aria-hidden="true"
      className={cn(
        'group/partner relative w-full overflow-hidden',
        'hairline-top hairline-bottom py-5',
        'bg-(--color-bg)',
        className
      )}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div className="marquee-track flex w-max items-center gap-10 will-change-transform">
        {/* Cópia 1 — key=id é único dentro da cópia (TECH_ITEMS não tem duplicates). */}
        {TECH_ITEMS.map((id) => (
          <PartnerItem key={`a-${id}`} id={id} />
        ))}
        {/* Cópia 2 — prefix 'b-' difere da cópia 1 mas dentro da cópia 2 o id é único.
            Precisa ser idêntica à cópia 1: o loop translada exatamente -50%. */}
        {TECH_ITEMS.map((id) => (
          <PartnerItem key={`b-${id}`} id={id} />
        ))}
      </div>
    </div>
  );
}

function PartnerItem({ id }: { id: TechId }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <TechLogo id={id} size={20} showLabel />
      <span aria-hidden="true" className="text-(--color-hairline-strong)">
        ·
      </span>
    </div>
  );
}
