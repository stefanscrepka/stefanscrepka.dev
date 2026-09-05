'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// F5/R7 (2026-09-02) — WCAG 2.2.2 (Pause, Stop, Hide), nível A: o loop do hero
// toca sozinho, dura mais de 5 s e roda em paralelo com o conteúdo, então
// precisa de um mecanismo NA PÁGINA pra pausar. O gate `<source media>` por
// prefers-reduced-motion é preferência de SO, não o controle que o critério
// pede. Padrão Apple: botão redondo discreto no canto da mídia.
//
// Só renderiza quando o <video> tem source ativa (desktop sem reduced-motion);
// no mobile/reduced o elemento mostra só o poster e o botão não faz sentido.
// A escolha persiste na sessão (voltar pra home não religa o loop).

const STORAGE_KEY = 'sh:hero-video-paused';

function getVideo(): HTMLVideoElement | null {
  return document.querySelector<HTMLVideoElement>('[data-hero-video]');
}

// F8 (2026-09-05): o mesmo botão pausa a marquee de logos (WCAG 2.2.2: ela
// também anda sozinha por mais de 5 s). O atributo é lido pelo CSS
// (globals.css, [data-paused] .marquee-track).
function setMarqueePaused(paused: boolean) {
  const marquee = document.querySelector<HTMLElement>('[data-slot="partner-marquee"]');
  marquee?.toggleAttribute('data-paused', paused);
}

export function HeroVideoToggle({ className }: { className?: string }) {
  const [available, setAvailable] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = getVideo();
    if (!video) return;

    // Disponível se o vídeo tem fonte OU se existe a marquee pra pausar.
    const check = () =>
      setAvailable(
        Boolean(video.currentSrc) ||
          Boolean(document.querySelector('[data-slot="partner-marquee"]'))
      );
    check();
    video.addEventListener('loadedmetadata', check);

    let wantsPause = false;
    try {
      wantsPause = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      /* storage indisponível: fica no default (tocando) */
    }
    if (wantsPause) {
      video.pause();
      setMarqueePaused(true);
      setPaused(true);
    }

    return () => video.removeEventListener('loadedmetadata', check);
  }, []);

  const toggle = () => {
    const video = getVideo();
    if (!video) return;
    if (paused) {
      void video.play().catch(() => {});
      setMarqueePaused(false);
      setPaused(false);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    } else {
      video.pause();
      setMarqueePaused(true);
      setPaused(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* noop */
      }
    }
  };

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label="Pausar o vídeo de fundo e a faixa de logos"
      title={paused ? 'Retomar movimento' : 'Pausar movimento'}
      data-slot="hero-video-toggle"
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full',
        'border border-(--color-hairline-strong) bg-(--color-bg) text-(--color-text-3)',
        'outline-none transition-[color,border-color,background-color] duration-(--motion-fast) ease-(--ease-standard)',
        'hover:border-(--color-accent) hover:text-(--color-accent)',
        'focus-visible:border-(--color-accent) focus-visible:text-(--color-accent) focus-visible:shadow-(--shadow-glow-lime-sm)',
        className
      )}
    >
      {paused ? (
        // play
        <svg aria-hidden="true" viewBox="0 0 12 12" className="ml-px size-3 fill-current">
          <path d="M2.5 1.5v9l8-4.5z" />
        </svg>
      ) : (
        // pause
        <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 fill-current">
          <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
        </svg>
      )}
    </button>
  );
}
