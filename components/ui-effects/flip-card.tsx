'use client';

import { m } from 'motion/react';
import { type KeyboardEvent, type ReactNode, useState } from 'react';
import { useIsTouch } from '@/hooks/use-is-touch';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Animate UI FlipCard pattern — 3D rotateY (default) ou rotateX.
// Spring tight (stiffness 280 damping 20). Backface-hidden faces.
// A11y: <div role="button" tabIndex={0}> wrapper aria-pressed. Enter/Space toggle.
// Reduced-motion: crossfade opacity entre faces sem rotation.
//
// W-mob/a11y (2026-05-25):
//   1. Trocado <button> wrapper por <div role="button" tabIndex={0}> pra evitar
//      HTML inválido (back face contém <a> e <button>, nested interactive).
//   2. trigger="auto" detecta touch via useIsTouch: touch → click toggle,
//      desktop → hover. Antes trigger="hover" deixava Estética MD literalmente
//      unreachable em mobile (onClick=undefined).
//   3. onKeyDown manual pra Enter/Space funcionar como botão real (div com
//      role="button" precisa de keyboard handler explícito).

type FlipAxis = 'y' | 'x';
type TriggerMode = 'hover' | 'click' | 'auto';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  axis?: FlipAxis;
  trigger?: TriggerMode;
  /** Tom do glow halo no card */
  tone?: 'lime' | 'amber';
  className?: string;
  ariaLabel?: string;
}

const TONE_GLOW = {
  lime: 'var(--color-accent-glow)',
  amber: 'oklch(82% 0.18 75 / 0.15)',
} as const;

export function FlipCard({
  front,
  back,
  axis = 'y',
  trigger = 'auto',
  tone = 'lime',
  className,
  ariaLabel = 'Virar card',
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotionSafe();
  const isTouch = useIsTouch();

  // Trigger resolvido em runtime: auto → touch usa click, desktop usa hover.
  const effectiveTrigger: 'hover' | 'click' =
    trigger === 'auto' ? (isTouch === true ? 'click' : 'hover') : trigger;

  const toggle = () => setFlipped((prev) => !prev);

  // Keyboard a11y: Enter/Space toggleia (div com role=button precisa explicito).
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  const rotation = flipped ? 180 : 0;
  const rotateAxis = axis === 'y' ? { rotateY: rotation } : { rotateX: rotation };

  // Reduced-motion: simple opacity crossfade
  if (reduced) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <button> não pode envolver <a>/<button> (nested interactive). Back face do FlipCard tem CTAs — usar <div role="button"> com keyboard handler manual evita HTML inválido.
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-pressed={flipped}
        aria-label={ariaLabel}
        data-slot="flip-card"
        data-tone={tone}
        className={cn(
          'group/flip relative isolate block w-full cursor-pointer rounded-2xl text-left',
          'border border-(--color-hairline-strong) bg-(--color-surface)',
          'transition-shadow duration-(--motion-fast)',
          'hover:shadow-(--shadow-lg) focus-visible:shadow-(--shadow-lg)',
          // F3-residuo (2026-06-11): trio outline local removido — anel global
          // 3px de globals.css cobre (mesma razão do fix no button.tsx).
          className
        )}
        style={{ boxShadow: `0 0 32px ${TONE_GLOW[tone]}` }}
      >
        {/* W3.x (2026-05-23): inert atribuído junto com aria-hidden — Lighthouse
            aria-hidden-focus audit exige que focáveis dentro de aria-hidden
            sejam removidos do tab order. inert faz isso nativamente. */}
        <div
          className={cn('relative', flipped ? 'sr-only' : '')}
          aria-hidden={flipped}
          inert={flipped || undefined}
        >
          {front}
        </div>
        <div
          className={cn('relative', flipped ? '' : 'sr-only')}
          aria-hidden={!flipped}
          inert={!flipped || undefined}
        >
          {back}
        </div>
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: <button> não pode envolver <a>/<button> (nested interactive). Back face do FlipCard tem CTAs — usar <div role="button"> com keyboard handler manual evita HTML inválido.
    <div
      role="button"
      tabIndex={0}
      onClick={effectiveTrigger === 'click' ? toggle : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={effectiveTrigger === 'hover' ? () => setFlipped(true) : undefined}
      onMouseLeave={effectiveTrigger === 'hover' ? () => setFlipped(false) : undefined}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      aria-pressed={flipped}
      aria-label={ariaLabel}
      data-slot="flip-card"
      data-tone={tone}
      className={cn(
        'group/flip relative isolate block w-full cursor-pointer rounded-2xl text-left',
        '[perspective:1200px]',
        className
      )}
    >
      {/* W-motion #8: anticipation + squash-stretch sutil. Antes flip era
          rotação pura 550ms outQuint. AGORA mid-rotation o card "afina"
          (scale 0.98) — Disney Squash & Stretch dá peso de papel, ducto
          curve easeInOut quartic. Duration 700ms (vs 550ms) compensa o
          mid-frame visual extra. */}
      <m.div
        animate={{ ...rotateAxis, scale: flipped ? [1, 0.98, 1] : [1, 0.98, 1] }}
        transition={{
          duration: 0.7,
          ease: [0.65, 0, 0.35, 1],
          scale: { duration: 0.7, times: [0, 0.5, 1] },
        }}
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face — inert quando virado (sai do tab order). */}
        <div
          className={cn(
            'relative rounded-2xl',
            'border border-(--color-hairline-strong) bg-(--color-surface)',
            'shadow-(--shadow-md)'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `var(--shadow-md), 0 0 32px ${TONE_GLOW[tone]}`,
          }}
          aria-hidden={flipped}
          inert={flipped || undefined}
        >
          {front}
        </div>

        {/* Back face — inert quando NÃO virado (botão "Agendar consulta" + WhatsApp
            deeplink ficariam tabuláveis dentro de aria-hidden sem isso). */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl',
            'border border-(--color-hairline-strong) bg-(--color-surface-elevated)',
            'shadow-(--shadow-md)'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: axis === 'y' ? 'rotateY(180deg)' : 'rotateX(180deg)',
            boxShadow: `var(--shadow-md), 0 0 32px ${TONE_GLOW[tone]}`,
          }}
          aria-hidden={!flipped}
          inert={!flipped || undefined}
        >
          {back}
        </div>
      </m.div>
    </div>
  );
}
