'use client';

import { AnimatePresence, m } from 'motion/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { FibonacciViz } from './fibonacci-viz';
import { ParensViz } from './parens-viz';

// Playground orchestrator: 3 tabs persistentes.
// Hanoi3D = dynamic({ ssr:false }) — ~245KB r3f chunk só carrega quando ativo.
// Tab switch: AnimatePresence 200ms fade.
// Reduced-motion: snap (sem fade).

const Hanoi3DLazy = dynamic(() => import('./hanoi-3d').then((m) => m.Hanoi3D), {
  ssr: false,
  loading: () => <HanoiSkeleton />,
});

type Tab = 'hanoi' | 'fibonacci' | 'parens';

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: 'hanoi', label: 'Hanoi 3D', subtitle: 'Recursão visualizada' },
  { id: 'fibonacci', label: 'Fibonacci', subtitle: 'O(2^n) vs O(n)' },
  { id: 'parens', label: 'Parênteses', subtitle: 'Stack balanceamento' },
];

export function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hanoi');
  const reduced = useReducedMotionSafe();

  return (
    <section className="container-max section-pad-y" data-slot="playground">
      <header className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p className="eyebrow">PLAYGROUND</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Algoritmos C que aprendi na faculdade — visualizados
        </h1>
        <p className="max-w-prose text-(--color-text-2) leading-relaxed">
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
        className="mb-8 flex flex-wrap gap-2 border-b border-(--color-hairline)"
      >
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            onSelect={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={activeTab}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
          className="rounded-2xl border border-(--color-hairline) bg-(--color-surface) p-4 sm:p-6"
        >
          {activeTab === 'hanoi' ? <Hanoi3DLazy /> : null}
          {activeTab === 'fibonacci' ? <FibonacciViz /> : null}
          {activeTab === 'parens' ? <ParensViz /> : null}
        </m.div>
      </AnimatePresence>
    </section>
  );
}

interface TabButtonProps {
  tab: { id: Tab; label: string; subtitle: string };
  active: boolean;
  onSelect: () => void;
}

function TabButton({ tab, active, onSelect }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${tab.id}`}
      aria-selected={active}
      aria-controls={`panel-${tab.id}`}
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
      <p className="font-mono text-xs uppercase tracking-widest">Carregando Three.js...</p>
    </div>
  );
}
