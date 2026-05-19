'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// GSAP infinite linear translateX 40s — loop seamless via 2 cópias do snippet.
// x: -50% = exatamente uma largura do snippet → reseta pra 0 sem hitch visível.
// Pause on hover. Reduced-motion: snapshot estático (sem loop).

interface CodeMarqueeTrackProps {
  html: string;
}

export function CodeMarqueeTrack({ html }: CodeMarqueeTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (!trackRef.current || reduced === null) return;
      if (reduced) return;

      animationRef.current = gsap.to(trackRef.current, {
        x: '-50%',
        duration: 40,
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

  const handleEnter = () => animationRef.current?.pause();
  const handleLeave = () => animationRef.current?.resume();

  return (
    <div
      aria-hidden="true"
      className={cn(
        'group/marquee relative w-full overflow-hidden',
        'hairline-top hairline-bottom py-4',
        'bg-(--color-surface) font-mono text-xs'
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-16 will-change-transform">
        {/* dangerouslySetInnerHTML OK: Shiki output é trusted (build-time) */}
        <div
          className="shrink-0 [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki SSR output is sanitized
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div
          className="shrink-0 [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki SSR output is sanitized
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
