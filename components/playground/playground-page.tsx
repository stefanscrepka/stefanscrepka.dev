'use client';

import { AnimatePresence, m } from 'motion/react';
import dynamic from 'next/dynamic';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { FibonacciViz } from './fibonacci-viz';
import { ParensViz } from './parens-viz';

// Playground orchestrator: 3 tabs persistentes seguindo WAI-ARIA tabs pattern
// com automatic activation (Arrow ←/→, Home/End movem foco + ativam tab).
// Hanoi3D = dynamic({ ssr:false }) — ~245KB r3f chunk só carrega 1x, mas o
// Canvas só renderiza quando a tab está ativa (panel oculto = sem useFrame).
// Tab switch: AnimatePresence 200ms fade. Reduced-motion: snap.

const Hanoi3DLazy = dynamic(() => import('./hanoi-3d').then((m) => m.Hanoi3D), {
  ssr: false,
  loading: () => <HanoiSkeleton />,
});

type Tab = 'hanoi' | 'fibonacci' | 'parens';

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: 'hanoi', label: 'Hanoi 3D', subtitle: 'Recursão visualizada' },
  { id: 'fibonacci', label: 'Fibonacci', subtitle: 'O(2ⁿ) vs O(n)' },
  { id: 'parens', label: 'Parênteses', subtitle: 'Stack balanceamento' },
];

export function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hanoi');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduced = useReducedMotionSafe();

  // WAI-ARIA tabs roving tabindex + keyboard nav.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const currentIdx = TABS.findIndex((t) => t.id === activeTab);
      let nextIdx = currentIdx;
      if (event.key === 'ArrowRight') nextIdx = (currentIdx + 1) % TABS.length;
      else if (event.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + TABS.length) % TABS.length;
      else if (event.key === 'Home') nextIdx = 0;
      else if (event.key === 'End') nextIdx = TABS.length - 1;
      else return;
      event.preventDefault();
      const next = TABS[nextIdx];
      if (!next) return;
      setActiveTab(next.id);
      // Defer focus para o próximo paint (após state propagar).
      requestAnimationFrame(() => tabRefs.current[nextIdx]?.focus());
    },
    [activeTab]
  );

  return (
    <section className="container-max section-pad-y" data-slot="playground">
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">PLAYGROUND</p>
        <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl !leading-[1.02] !tracking-[-0.025em]">
          Algoritmos C que aprendi na faculdade — visualizados.
        </h1>
        <p className="mt-2 max-w-prose text-reading text-(--color-text-2)">
          Hanoi recursivo, Fibonacci memoizado vs ingênuo, e balanceamento de parênteses com pilha.
          Saíram do repo{' '}
          <a
            href="https://github.com/stefanscrepka/estrutura-de-dados"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-(--color-accent) underline-offset-4 hover:underline"
          >
            estrutura-de-dados
          </a>{' '}
          (Estrutura de Dados I, Unicesumar).
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Visualizações de algoritmos"
        onKeyDown={handleKeyDown}
        className="mb-8 flex flex-wrap gap-2 border-b border-(--color-hairline)"
      >
        {TABS.map((tab, idx) => (
          <TabButton
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            tab={tab}
            active={activeTab === tab.id}
            onSelect={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Todos os painéis ficam montados (hidden quando inativos) pra screen readers
          terem âncoras estáveis pros aria-controls dos tabs. Hanoi r3f só monta quando
          ativo (lazy chunk evita custar 245KB se usuário nunca clicar nele). */}
      <div className="rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
          >
            {TABS.map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                hidden={activeTab !== tab.id}
              >
                {tab.id === 'hanoi' && activeTab === 'hanoi' ? <Hanoi3DLazy /> : null}
                {tab.id === 'fibonacci' && activeTab === 'fibonacci' ? <FibonacciViz /> : null}
                {tab.id === 'parens' && activeTab === 'parens' ? <ParensViz /> : null}
              </div>
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

interface TabButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
  tab: { id: Tab; label: string; subtitle: string };
  active: boolean;
  onSelect: () => void;
}

function TabButton({ ref, tab, active, onSelect }: TabButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`tab-${tab.id}`}
      aria-selected={active}
      aria-controls={`panel-${tab.id}`}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      className={cn(
        'group/tab relative -mb-px flex flex-col items-start gap-0.5 px-4 py-3',
        'border-b-2 text-left font-mono text-sm',
        'transition-colors duration-(--motion-fast)',
        'outline-none focus-visible:bg-(--color-accent-subtle)',
        active
          ? 'border-(--color-accent) text-(--color-text-1)'
          : 'border-transparent text-(--color-text-3) hover:text-(--color-text-1)'
      )}
    >
      <span className="font-semibold">{tab.label}</span>
      <span className="text-[11px] tracking-wide text-(--color-text-3)">{tab.subtitle}</span>
    </button>
  );
}

function HanoiSkeleton() {
  return (
    <div
      className="grid h-[28rem] place-items-center text-(--color-text-3)"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="font-mono text-xs uppercase tracking-widest">Carregando Three.js…</p>
    </div>
  );
}
