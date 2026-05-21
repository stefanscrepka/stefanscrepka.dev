'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// CompareSlider Aceternity pattern — drag handle revelando layer top sobre bottom
// via clip-path inset.
// A11y: handle role="slider" aria-valuenow + keyboard ArrowLeft/Right/Home/End.
// Mobile: drag-only (hover é fiction em touch). touch-action: none.
// Reduced-motion: sem autoplay (não usamos autoplay aqui mesmo).

interface CompareSliderProps {
  /** Layer revelada quando handle vai pra direita (left side visível) */
  before: ReactNode;
  beforeLabel?: string;
  /** Layer base (right side visível por default) */
  after: ReactNode;
  afterLabel?: string;
  initialPercentage?: number;
  className?: string;
  ariaLabel?: string;
}

export function CompareSlider({
  before,
  beforeLabel = 'Antes',
  after,
  afterLabel = 'Depois',
  initialPercentage = 50,
  className,
  ariaLabel = 'Comparação antes / depois',
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(initialPercentage);
  const draggingRef = useRef(false);
  const reduced = useReducedMotionSafe();

  // Drag handler computa percent baseado em clientX relativo ao container
  const updateFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPercent(pct);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const handlePointerUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [updateFromClientX]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    document.body.style.cursor = 'ew-resize';
    updateFromClientX(e.clientX);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        setPercent((p) => Math.max(0, p - 5));
        e.preventDefault();
        break;
      case 'ArrowRight':
        setPercent((p) => Math.min(100, p + 5));
        e.preventDefault();
        break;
      case 'Home':
        setPercent(0);
        e.preventDefault();
        break;
      case 'End':
        setPercent(100);
        e.preventDefault();
        break;
      default:
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      data-slot="compare-slider"
      className={cn(
        'relative w-full select-none overflow-hidden rounded-xl',
        'border border-(--color-hairline-strong)',
        'shadow-(--shadow-cinema)',
        'aspect-[16/10]',
        // Touch-action none impede scroll do browser engulir gestos verticais.
        'touch-none',
        className
      )}
    >
      {/* After layer — base, sempre visível */}
      <div className="absolute inset-0">
        {after}
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 rounded-pill border border-(--color-hairline-strong) bg-(--color-base)/80 px-2 py-1 font-mono text-2xs uppercase tracking-wider text-(--color-text-2) backdrop-blur"
        >
          {afterLabel}
        </span>
      </div>

      {/* Before layer — clipped via inset (right side hidden) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - percent}% 0 0)`,
        }}
      >
        {before}
        <span
          aria-hidden="true"
          className="absolute left-3 bottom-3 rounded-pill border border-(--color-hairline-strong) bg-(--color-base)/80 px-2 py-1 font-mono text-2xs uppercase tracking-wider text-(--color-text-2) backdrop-blur"
        >
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label={ariaLabel}
        onKeyDown={handleKey}
        className={cn(
          'absolute top-0 -translate-x-1/2 cursor-ew-resize outline-none',
          'h-full w-1 bg-(--color-accent)',
          'shadow-(--shadow-glow-lime-sm)',
          'focus-visible:bg-(--color-accent-hover) focus-visible:shadow-(--shadow-glow-lime-md)',
          reduced && 'transition-[left]'
        )}
        style={{ left: `${percent}%` }}
      >
        {/* Grip pill */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2',
            'place-items-center rounded-full',
            'bg-(--color-accent) text-(--color-text-on-accent)',
            'border border-(--color-text-on-accent)/10',
            'shadow-(--shadow-glow-lime-sm)'
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-5"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 6l-4 6 4 6M16 6l4 6-4 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
