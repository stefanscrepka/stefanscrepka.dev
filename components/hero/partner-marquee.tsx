'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { type TechId, TechLogo } from '@/components/shared/tech-logo';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Partner marquee — infinite linear scroll de logos do stack/parceiros.
// Pattern Lando Norris parceiros row + AnimeJS sponsor strip.
// GSAP gsap.to translateX -50% loop seamless (mesma técnica de code-marquee-track).
// Reduced-motion: estático sem loop.

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
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (!trackRef.current || reduced === null || reduced) return;
      animationRef.current = gsap.to(trackRef.current, {
        x: '-50%',
        duration: 50,
        ease: 'none',
        repeat: -1,
      });
      return () => {
        animationRef.current?.kill();
        animationRef.current = null;
      };
    },
    { dependencies: [reduced], scope: trackRef }
  );

  return (
    <div
      data-slot="partner-marquee"
      aria-hidden="true"
      onMouseEnter={() => animationRef.current?.pause()}
      onMouseLeave={() => animationRef.current?.resume()}
      className={cn(
        'group/partner relative w-full overflow-hidden',
        'hairline-top hairline-bottom py-5',
        'bg-(--color-base)',
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
