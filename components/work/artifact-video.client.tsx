'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

// Vídeo curto de um artefato (ex.: a animação do hub da STARK, 5 s, Cycles).
// Só toca enquanto está na tela; em reduced-motion fica no poster. Sem
// controles: é registro, não player.

interface ArtifactVideoProps {
  webm: string;
  mp4: string;
  poster: string;
  /** Descrição pra leitores de tela. */
  label: string;
}

export function ArtifactVideo({ webm, mp4, poster, label }: ArtifactVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced !== false || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
    >
      {reduced === false ? (
        <>
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}
