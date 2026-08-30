'use client';

import { useEffect, useRef } from 'react';
import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Partner marquee — infinite linear scroll de logos do stack/parceiros.
// Pattern Lando Norris parceiros row + AnimeJS sponsor strip.
// GSAP gsap.to translateX -50% loop seamless (mesma técnica de code-marquee-track).
// Reduced-motion: estático sem loop.
//
// W-perf (2026-05-25): GSAP carregado via dynamic import dentro do useEffect
// pra evitar leak no first-load (Hero é eager). Static `import { gsap } from
// 'gsap'` vazava 70 KB uncompressed pra toda rota do site.

interface MarqueeTween {
  kill(): void;
  pause(): void;
  resume(): void;
}

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
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<MarqueeTween | null>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (!trackRef.current || reduced === null || reduced) return;
    let cancelled = false;
    let tween: MarqueeTween | null = null;
    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled || !trackRef.current) return;
      // W-motion #1: duration lê token --motion-marquee (40s) em vez de
      // hardcoded 50s. Sincroniza com outros marquees do site (consistência).
      // Fallback 40 se var não definida.
      const root = getComputedStyle(document.documentElement);
      const raw = root.getPropertyValue('--motion-marquee').trim();
      const seconds = raw.endsWith('s') ? Number.parseFloat(raw) : 40;
      tween = gsap.to(trackRef.current, {
        x: '-50%',
        duration: Number.isFinite(seconds) && seconds > 0 ? seconds : 40,
        ease: 'none',
        repeat: -1,
      });
      animationRef.current = tween;
    })();
    return () => {
      cancelled = true;
      tween?.kill();
      animationRef.current = null;
    };
  }, [reduced]);

  return (
    <div
      data-slot="partner-marquee"
      aria-hidden="true"
      onMouseEnter={() => animationRef.current?.pause()}
      onMouseLeave={() => animationRef.current?.resume()}
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
      <div ref={trackRef} className="flex w-max items-center gap-10 will-change-transform">
        {/* Cópia 1 — key=id é único dentro da cópia (TECH_ITEMS não tem duplicates). */}
        {TECH_ITEMS.map((id) => (
          <PartnerItem key={`a-${id}`} id={id} />
        ))}
        {/* Cópia 2 — prefix 'b-' difere da cópia 1 mas dentro da cópia 2 o id é único. */}
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
