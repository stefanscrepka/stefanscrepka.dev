'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

// Fibonacci comparativo — número de operações recursivas pra computar F(n).
// Naive O(2^n) em vermelho · Memoizado O(n) em lime.
// Eixo Y logarítmico (escala log10) pra acomodar gap exponencial.
// Slider n=1..40; redraw transition 400ms via Recharts isAnimationActive.

const MAX_N = 40;

// Naive Fibonacci call count: T(n) = T(n-1) + T(n-2) + 1, T(0)=T(1)=1.
// Igual à própria sequência shifted: T(n) = 2*F(n+1) - 1 onde F é Fib.
function naiveCalls(n: number): number {
  if (n < 0) return 0;
  // Iterative Fib to avoid stack overflow.
  let a = 1;
  let b = 1;
  for (let i = 0; i < n; i += 1) {
    const next = a + b;
    a = b;
    b = next;
  }
  // a = F(n+1) at this point (with F(0)=1, F(1)=1 convention).
  return 2 * a - 1;
}

// Memoized: cada subproblema 0..n computa uma vez → ~ 2n-1 chamadas no total.
function memoCalls(n: number): number {
  return Math.max(1, 2 * n - 1);
}

interface DataPoint {
  n: number;
  naive: number;
  memo: number;
}

export function FibonacciViz() {
  const [n, setN] = useState(20);

  const data = useMemo<DataPoint[]>(() => {
    const arr: DataPoint[] = [];
    for (let i = 1; i <= n; i += 1) {
      arr.push({ n: i, naive: naiveCalls(i), memo: memoCalls(i) });
    }
    return arr;
  }, [n]);

  const naiveLast = data[data.length - 1]?.naive ?? 0;
  const memoLast = data[data.length - 1]?.memo ?? 0;
  const speedup = memoLast > 0 ? Math.round(naiveLast / memoLast) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="fib-n"
            className="font-mono text-xs uppercase tracking-widest text-(--color-text-3)"
          >
            n
          </label>
          <span className="mono-stats text-sm font-semibold text-(--color-text-1)">
            {n.toString().padStart(2, '0')}
          </span>
        </div>
        <input
          id="fib-n"
          type="range"
          min={1}
          max={MAX_N}
          step={1}
          value={n}
          onChange={(e) => setN(Number.parseInt(e.target.value, 10))}
          aria-label={`Tamanho de n: ${n}`}
          aria-valuemin={1}
          aria-valuemax={MAX_N}
          aria-valuenow={n}
          className={cn(
            'w-full appearance-none bg-(--color-hairline-strong)',
            'h-1 rounded-full outline-none',
            'focus-visible:ring-2 focus-visible:ring-(--color-border-focus)',
            '[&::-webkit-slider-thumb]:size-4',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-(--color-accent)',
            '[&::-webkit-slider-thumb]:shadow-(--shadow-glow-lime-sm)',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:size-4',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-(--color-accent)',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
        />
        <p className="font-mono text-2xs text-(--color-text-3)">1—{MAX_N}</p>
      </div>

      {/* Chart */}
      <div className="h-[20rem] w-full sm:h-[22rem]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="var(--color-hairline)" strokeDasharray="2 4" />
            <XAxis
              dataKey="n"
              stroke="var(--color-text-3)"
              tick={{ fill: 'var(--color-text-3)', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-hairline-strong)' }}
              label={{
                value: 'n',
                position: 'insideBottomRight',
                offset: -4,
                fill: 'var(--color-text-3)',
                style: { fontSize: 11, fontFamily: 'monospace' },
              }}
            />
            <YAxis
              scale="log"
              domain={[1, Math.max(10, naiveLast * 1.4)]}
              allowDataOverflow
              stroke="var(--color-text-3)"
              tick={{ fill: 'var(--color-text-3)', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-hairline-strong)' }}
              tickFormatter={(v: number) => {
                if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
                if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
                if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
                return String(v);
              }}
              label={{
                value: 'chamadas (log)',
                angle: -90,
                position: 'insideLeft',
                offset: 16,
                fill: 'var(--color-text-3)',
                style: { fontSize: 11, fontFamily: 'monospace' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-overlay)',
                border: '1px solid var(--color-hairline-strong)',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-text-1)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--color-text-2)' }}
              formatter={(value) =>
                typeof value === 'number' ? value.toLocaleString('pt-BR') : String(value ?? '—')
              }
            />
            <Legend
              wrapperStyle={{ fontFamily: 'monospace', fontSize: 12, paddingTop: 8 }}
              iconType="plainline"
            />
            <Line
              type="monotone"
              dataKey="naive"
              name="Naive O(2ⁿ)"
              stroke="oklch(65% 0.20 10)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={400}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="memo"
              name="Memoizado O(n)"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={400}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stat summary */}
      <dl className="grid grid-cols-1 gap-4 border-t border-(--color-hairline) pt-5 sm:grid-cols-3">
        <Stat label="Naive — chamadas" value={naiveLast.toLocaleString('pt-BR')} tone="danger" />
        <Stat label="Memoizado — chamadas" value={memoLast.toLocaleString('pt-BR')} tone="accent" />
        <Stat
          label="Speedup"
          value={speedup > 1 ? `${speedup.toLocaleString('pt-BR')}×` : '—'}
          tone="text-1"
        />
      </dl>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'accent' | 'danger' | 'text-1';
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
        {label}
      </dt>
      <dd
        className={cn(
          'mono-stats text-lg font-semibold tabular-nums sm:text-xl',
          tone === 'accent' && 'text-(--color-accent)',
          tone === 'danger' && 'text-(--color-danger)',
          tone === 'text-1' && 'text-(--color-text-1)'
        )}
      >
        {value}
      </dd>
    </div>
  );
}
