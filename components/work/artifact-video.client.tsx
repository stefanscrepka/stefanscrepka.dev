'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Vídeo curto de um artefato (ex.: a animação do hub da STARK, 5 s, Cycles).
// Só toca enquanto está na tela; em reduced-motion fica no poster. Sem barra
// de controles (é registro, não player), mas com UM botão de pausa (F9, R4
// F44): movimento em loop acima de 5 s sem mecanismo de parada na página é
// WCAG 2.2.2, e o botão do hero pausa só o vídeo de fundo e a marquee.

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
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced !== false || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !paused) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced, paused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (paused) {
      setPaused(false);
      void video.play().catch(() => {});
    } else {
      setPaused(true);
      video.pause();
    }
  };

  return (
    <>
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
      {reduced === false ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? 'Retomar a animação' : 'Pausar a animação'}
          title={paused ? 'Retomar' : 'Pausar'}
          className={cn(
            'absolute right-2 bottom-2 z-10 inline-flex size-8 items-center justify-center rounded-full',
            'border border-(--color-hairline-strong) bg-(--color-bg)/85 text-(--color-text-2)',
            'transition-[color,border-color] duration-(--motion-fast) ease-(--ease-standard)',
            'hover:border-(--color-accent) hover:text-(--color-accent)',
            'focus-visible:border-(--color-accent) focus-visible:text-(--color-accent)'
          )}
        >
          {paused ? (
            <svg aria-hidden="true" viewBox="0 0 12 12" className="ml-px size-2.5 fill-current">
              <path d="M2.5 1.5v9l8-4.5z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2.5 fill-current">
              <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
