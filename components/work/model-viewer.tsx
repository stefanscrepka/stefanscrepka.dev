'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';

// Ilha que só baixa o three.js (~250 KB) quando a moldura chega perto da
// viewport, e só renderiza frames enquanto ela está visível. O Canvas em si
// vive em model-viewer.client.tsx. Várias peças: um seletor em mono troca o
// GLB sem remontar o Canvas.

const ModelViewerCanvas = dynamic(
  () => import('./model-viewer.client').then((m) => m.ModelViewerCanvas),
  { ssr: false, loading: () => null }
);

export interface ViewerModel {
  id: string;
  /** Rótulo curto do seletor. */
  label: string;
  src: string;
  /** Linha mono abaixo do seletor: o que é, tamanho real, origem. */
  note: string;
  /** Texto equivalente pra leitores de tela. */
  description: string;
}

interface ModelViewerProps {
  models: readonly ViewerModel[];
  className?: string | undefined;
}

export function ModelViewer({ models, className }: ModelViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentId, setCurrentId] = useState(models[0]?.id ?? '');
  const reduced = useReducedMotionSafe();
  const current = models.find((m) => m.id === currentId) ?? models[0];

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setNear(true);
        setVisible(entry.isIntersecting);
      },
      { rootMargin: '240px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!current) return null;

  return (
    <div ref={ref} className={cn('flex h-full min-h-0 flex-col', className)}>
      <div
        role="img"
        aria-label={current.description}
        className="relative min-h-0 flex-1 cursor-grab active:cursor-grabbing"
      >
        {near ? (
          <ModelViewerCanvas src={current.src} active={visible} autoRotate={reduced === false} />
        ) : null}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-2 font-mono text-[10px] uppercase tracking-widest text-(--color-text-3)"
        >
          arraste pra girar
        </span>
      </div>
      {models.length > 1 ? (
        <div className="flex flex-col gap-2 border-t border-(--color-hairline-alpha) px-3 py-2.5">
          <div
            role="tablist"
            aria-label="Peça exibida"
            className="flex flex-wrap gap-1.5 font-mono text-2xs uppercase tracking-wider"
          >
            {models.map((m) => {
              const active = m.id === current.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCurrentId(m.id)}
                  className={cn(
                    'rounded-md border px-2 py-1 transition-colors duration-(--motion-fast)',
                    active
                      ? 'border-(--color-accent-emissive) bg-(--color-accent-subtle) text-(--color-accent)'
                      : 'border-(--color-hairline-strong) text-(--color-text-3) hover:text-(--color-text-1)',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)'
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          {/* No mobile a nota tomava metade da moldura 4:3 e o canvas sobrava com
              ~170px; abaixo de sm fica só o seletor. */}
          <p className="hidden font-mono text-2xs leading-relaxed text-(--color-text-3) sm:block">
            {current.note}
          </p>
        </div>
      ) : null}
    </div>
  );
}
