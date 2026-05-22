'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Spotify now playing — Dynamic Island vibe iPhone.
// Pill flutuante fixed top-center, dark glass + lime accent.
// - Album art square arredondado (Rive-able futuramente)
// - Titulo + artista escrolando se overflow
// - Music wave bars animadas (4 barras lime CSS keyframes)
// - Hover expande mostrando "Slowed + Reverb" subtitle
//
// Static por enquanto. Liga com Spotify Web API em /api/spotify/now-playing.

const STATIC_TRACK = {
  artist: 'LONOWN, riserayss',
  title: 'worry',
  variant: 'Slowed + Reverb',
};

interface SpotifyNowPlayingProps {
  className?: string;
}

export function SpotifyNowPlaying({ className }: SpotifyNowPlayingProps) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mount pra aparecer flutuando ~800ms apos load (depois das anims do hero).
    const id = window.setTimeout(() => setMounted(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-auto fixed left-1/2 z-40 -translate-x-1/2',
        'transition-[opacity,transform] duration-(--motion-page) ease-(--ease-dramatic)',
        // Dynamic island position: top center, abaixo da topbar (top-20 = 80px)
        'top-20',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      role="status"
      aria-label="Spotify tocando agora"
      data-slot="spotify-now-playing"
    >
      <button
        type="button"
        className={cn(
          'group/spotify flex items-center gap-3 rounded-pill outline-none',
          'border border-(--color-hairline-strong) backdrop-blur-xl',
          'bg-black/70',
          'transition-[width,padding,border-color,box-shadow] duration-(--motion-page)',
          'ease-(--ease-dramatic)',
          'hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm)',
          'focus-visible:border-(--color-accent) focus-visible:shadow-(--shadow-glow-lime-sm)',
          hovered ? 'px-4 py-2' : 'px-3 py-1.5'
        )}
      >
        {/* Album art placeholder — square com bg lime sutil */}
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-md',
            'border border-(--color-hairline-strong)',
            'transition-[width,height] duration-(--motion-page)',
            hovered ? 'size-8' : 'size-6'
          )}
          style={{
            background:
              'radial-gradient(circle at 30% 30%, var(--color-accent-subtle) 0%, oklch(15% 0.01 130) 70%)',
          }}
        >
          {/* Music wave bars — 4 barras lime animadas */}
          <span className="flex items-end gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                // biome-ignore lint/correctness/useUniqueElementIds: 4 bars com index estavel
                key={`wave-${i}`}
                className="block w-[2px] rounded-full bg-(--color-accent)"
                style={{
                  height: '4px',
                  animation: `spotify-wave 1.1s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </span>
        </span>

        {/* Track info */}
        <span className="flex min-w-0 items-baseline gap-2">
          <span
            aria-hidden="true"
            className="font-mono text-2xs uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}
          >
            ♫
          </span>
          <span
            className="truncate text-sm font-medium"
            style={{
              color: 'var(--color-text-1)',
              maxWidth: hovered ? '360px' : '260px',
              transition: 'max-width 600ms cubic-bezier(0.165, 0.84, 0.44, 1)',
            }}
          >
            {STATIC_TRACK.artist} — {STATIC_TRACK.title}
          </span>
          {hovered ? (
            <span
              className="hidden font-mono text-2xs uppercase tracking-widest sm:inline"
              style={{ color: 'var(--color-text-3)' }}
            >
              · {STATIC_TRACK.variant}
            </span>
          ) : null}
        </span>
      </button>

      <style>{`
        @keyframes spotify-wave {
          0% { height: 3px; }
          100% { height: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-slot="spotify-now-playing"] [style*="spotify-wave"] {
            animation: none !important;
            height: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
