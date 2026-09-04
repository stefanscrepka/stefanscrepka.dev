'use client';

import { AnimatePresence, m } from 'motion/react';
import { useMemo, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { EASES } from '@/lib/animation/eases';
import { cn } from '@/lib/utils';

// Balanceamento de parênteses com pilha — input PT-BR, SVG stack push/pop animado.
// Aceita (), [], {}. Caractere não-bracket é ignorado (algoritmo padrão).
// Visual: pilha vertical crescendo de baixo pra cima.
// Reduced-motion: snap push/pop sem animação.

const OPENINGS = new Set(['(', '[', '{']);
const CLOSING_MAP: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const PAIR_MAP: Record<string, string> = { '(': ')', '[': ']', '{': '}' };

type Outcome =
  | { status: 'balanced'; finalStack: string[]; processed: number }
  | {
      status: 'mismatch';
      finalStack: string[];
      processed: number;
      expected: string;
      got: string;
      at: number;
    }
  | { status: 'underflow'; finalStack: string[]; processed: number; got: string; at: number }
  | { status: 'leftover'; finalStack: string[]; processed: number };

function analyze(input: string): Outcome {
  const stack: string[] = [];
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (!ch) continue;
    if (OPENINGS.has(ch)) {
      stack.push(ch);
      continue;
    }
    if (ch in CLOSING_MAP) {
      const expectedOpen = CLOSING_MAP[ch];
      const top = stack[stack.length - 1];
      if (top === undefined) {
        return {
          status: 'underflow',
          finalStack: [...stack],
          processed: i,
          got: ch,
          at: i,
        };
      }
      if (top !== expectedOpen) {
        return {
          status: 'mismatch',
          finalStack: [...stack],
          processed: i,
          expected: PAIR_MAP[top] ?? '?',
          got: ch,
          at: i,
        };
      }
      stack.pop();
    }
  }
  if (stack.length > 0) {
    return { status: 'leftover', finalStack: [...stack], processed: input.length };
  }
  return { status: 'balanced', finalStack: [], processed: input.length };
}

const EXAMPLES = ['(()())', '([{}])', '({[)]}', 'function fn() { return arr[0]; }'];

export function ParensViz() {
  const [input, setInput] = useState<string>('');
  const reduced = useReducedMotionSafe();
  const outcome = useMemo(() => analyze(input), [input]);

  const balanced = outcome.status === 'balanced';
  const failMsg = useMemo(() => {
    switch (outcome.status) {
      case 'mismatch':
        return `posição ${outcome.at + 1}: esperava \`${outcome.expected}\`, recebeu \`${outcome.got}\``;
      case 'underflow':
        return `posição ${outcome.at + 1}: \`${outcome.got}\` fechando uma pilha vazia`;
      case 'leftover':
        return `${outcome.finalStack.length} aberturas sem fechar`;
      default:
        return null;
    }
  }, [outcome]);

  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
      {/* Input + result */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="parens-input"
            className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)"
          >
            Expressão
          </label>
          <textarea
            id="parens-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cole sua expressão"
            spellCheck={false}
            autoComplete="off"
            rows={3}
            className={cn(
              'w-full resize-y rounded-md border border-(--color-hairline-strong)',
              'bg-(--color-bg) px-3 py-2',
              'font-mono text-sm text-(--color-text-1)',
              'placeholder:text-(--color-text-3)',
              'outline-none transition-colors',
              'focus-visible:border-(--color-accent) focus-visible:ring-2 focus-visible:ring-(--color-border-focus)'
            )}
            aria-describedby="parens-status"
          />
        </div>

        <ResultBadge
          balanced={balanced}
          message={
            balanced
              ? `Pilha vazia ao final. ${outcome.processed} chars processados`
              : (failMsg ?? 'não balanceado')
          }
        />

        <div className="flex flex-col gap-2">
          <p className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
            Exemplos
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                key={ex}
                onClick={() => setInput(ex)}
                className={cn(
                  'rounded-md border border-(--color-hairline-strong)',
                  'bg-(--color-surface) px-3 py-1.5',
                  'font-mono text-xs text-(--color-text-2)',
                  'outline-none transition-colors',
                  'hover:border-(--color-accent) hover:text-(--color-text-1)',
                  'focus-visible:border-(--color-accent)'
                )}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stack viz */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)">
          Pilha (top → bottom)
        </p>
        <StackViz stack={outcome.finalStack} balanced={balanced} reduced={reduced ?? false} />
      </div>
    </div>
  );
}

interface StackVizProps {
  stack: string[];
  balanced: boolean;
  reduced: boolean;
}

function StackViz({ stack, balanced, reduced }: StackVizProps) {
  // Display from TOP (last pushed) to BOTTOM (first pushed) for visual stack.
  // Key estável: prefixa posição absoluta no stack (não muda em pushes futuros),
  // evitando React reusar items errados quando o tamanho cresce/diminui.
  const reversed = useMemo(
    () => stack.map((bracket, depth) => ({ bracket, depth })).reverse(),
    [stack]
  );

  return (
    <div
      className={cn(
        'relative flex h-[18rem] flex-col items-stretch justify-end gap-1 overflow-hidden p-3',
        'rounded-xl border border-(--color-hairline) bg-(--color-bg)'
      )}
      data-balanced={balanced ? '' : undefined}
    >
      {/* Floor line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-3 bottom-3 h-px bg-(--color-hairline-strong)"
      />
      <AnimatePresence mode="popLayout">
        {reversed.length === 0 ? (
          <m.p
            key="empty"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            className="my-auto text-center font-mono text-xs text-(--color-text-3)"
          >
            {balanced ? '✓ pilha vazia' : 'pilha vazia'}
          </m.p>
        ) : (
          reversed.map(({ bracket, depth }, idx) => (
            <m.div
              key={`stack-${depth}-${bracket}`}
              layout
              initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.9 }}
              transition={{
                duration: reduced ? 0 : 0.28,
                ease: EASES.snappy,
              }}
              className={cn(
                'flex h-9 items-center justify-between rounded-md border px-3',
                'font-mono text-sm',
                idx === 0
                  ? 'border-(--color-accent) bg-(--color-accent-subtle) text-(--color-accent)'
                  : 'border-(--color-hairline-strong) bg-(--color-surface) text-(--color-text-2)'
              )}
            >
              <span aria-hidden="true" className="font-semibold">
                {bracket}
              </span>
              <span className="text-2xs uppercase tracking-widest text-(--color-text-3)">
                {idx === 0 ? 'top' : `+${idx}`}
              </span>
            </m.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultBadge({ balanced, message }: { balanced: boolean; message: string }) {
  return (
    <div
      id="parens-status"
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center gap-3 rounded-md border px-3 py-2',
        balanced
          ? 'border-(--color-success) bg-(--color-success)/10'
          : 'border-(--color-danger) bg-(--color-danger)/10'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex size-6 items-center justify-center rounded-full font-mono text-xs font-semibold',
          balanced
            ? 'bg-(--color-success) text-(--color-text-on-accent)'
            : 'bg-(--color-danger) text-(--color-text-1)'
        )}
      >
        {balanced ? '✓' : '✕'}
      </span>
      <div className="flex flex-col gap-0">
        <span
          className={cn(
            'font-mono text-sm font-semibold',
            balanced ? 'text-(--color-success)' : 'text-(--color-danger)'
          )}
        >
          {balanced ? 'balanceado' : 'não-balanceado'}
        </span>
        <span className="text-xs text-(--color-text-2)">{message}</span>
      </div>
    </div>
  );
}
