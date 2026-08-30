'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HanoiControlsProps {
  n: number;
  maxN: number;
  playing: boolean;
  moveIndex: number;
  totalMoves: number;
  minTheoretical: number;
  onNChange: (next: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

export function HanoiControls({
  n,
  maxN,
  playing,
  moveIndex,
  totalMoves,
  minTheoretical,
  onNChange,
  onPlay,
  onPause,
  onStep,
  onReset,
}: HanoiControlsProps) {
  const complete = moveIndex >= totalMoves;

  return (
    <div className="flex flex-col gap-4">
      {/* Slider de discos */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="hanoi-discs"
            className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)"
          >
            Discos
          </label>
          <span className="mono-stats text-sm font-semibold text-(--color-text-1)">{n}</span>
        </div>
        <input
          id="hanoi-discs"
          type="range"
          min={1}
          max={maxN}
          step={1}
          value={n}
          onChange={(e) => onNChange(Number.parseInt(e.target.value, 10))}
          aria-label={`Quantidade de discos: ${n}`}
          aria-valuemin={1}
          aria-valuemax={maxN}
          aria-valuenow={n}
          className={cn(
            'w-full appearance-none bg-(--color-hairline-strong)',
            'h-1.5 rounded-full',
            'outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus)',
            // W-mob (2026-05-25): thumb 16px → 28px. Touch target Apple HIG
            // mínimo 24px; 28 dá folga sem ficar cartoon.
            '[&::-webkit-slider-thumb]:size-7',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-(--color-accent)',
            '[&::-webkit-slider-thumb]:shadow-(--shadow-glow-lime-sm)',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:size-7',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-(--color-accent)',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
        />
        <p className="font-mono text-2xs text-(--color-text-3)">
          1—{maxN} {maxN < 8 ? '(mobile cap)' : ''}
        </p>
      </div>

      {/* Botões controle */}
      <div className="flex flex-wrap items-center gap-2">
        {playing ? (
          <Button
            size="sm"
            variant="default"
            onClick={onPause}
            aria-label="Pausar reprodução"
            disabled={complete}
          >
            <IconPause /> Pausar
          </Button>
        ) : (
          <Button
            size="sm"
            variant="default"
            onClick={onPlay}
            aria-label={complete ? 'Reiniciar e tocar' : 'Tocar reprodução'}
          >
            <IconPlay /> {complete ? 'Reiniciar' : 'Tocar'}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onStep}
          aria-label="Avançar um passo"
          disabled={complete || playing}
        >
          <IconStep /> Passo
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          aria-label="Resetar para estado inicial"
        >
          <IconReset /> Resetar
        </Button>

        <div className="ml-auto flex flex-col items-end gap-0 font-mono text-xs text-(--color-text-3)">
          <span>
            Movimentos:{' '}
            <span className="mono-stats text-(--color-text-1)">
              {moveIndex.toString().padStart(2, '0')}
            </span>{' '}
            / <span className="text-(--color-text-2)">{totalMoves}</span>
          </span>
          <span>
            Mínimo teórico: <span className="text-(--color-text-2)">2^{n} - 1 = </span>
            <span className="mono-stats text-(--color-accent)">{minTheoretical}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// === Ícones inline ===

function IconPlay() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5" aria-hidden="true">
      <path d="M3 2v12l11-6z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" />
      <rect x="9.5" y="2" width="3.5" height="12" />
    </svg>
  );
}
function IconStep() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5" aria-hidden="true">
      <path d="M2 2v12l8-6z" />
      <rect x="11" y="2" width="2.5" height="12" />
    </svg>
  );
}
function IconReset() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-3.5"
      aria-hidden="true"
    >
      <title>reset</title>
      <path d="M2 8a6 6 0 1 0 1.5-3.97" strokeLinecap="round" />
      <path d="M2 2v3h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
