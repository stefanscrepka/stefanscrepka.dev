import { SHMonogram } from '@/components/shared/sh-monogram';
import { cn } from '@/lib/utils';

// RSC placeholder pra screenshots reais que Stefan vai entregar em Real-screenshots/.
// Quando os PNGs chegarem, troca pra <Image src> em lib/work/data.ts.
// Visual: surface dark + grid mock + monogram lime/amber + label centro.

interface ScreenshotPlaceholderProps {
  label: string;
  caption?: string;
  tone?: 'lime' | 'amber' | 'neutral';
  aspectRatio?: '16/10' | '16/9' | '4/3' | '3/2';
  className?: string;
}

const TONE_STYLES = {
  lime: {
    accent: 'var(--color-accent)',
    glow: 'var(--color-accent-emissive)',
  },
  amber: {
    accent: 'var(--color-amber)',
    glow: 'oklch(82% 0.18 75 / 0.4)',
  },
  neutral: {
    accent: 'var(--color-text-2)',
    glow: 'transparent',
  },
} as const;

const ASPECT_CLASS = {
  '16/10': 'aspect-[16/10]',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
} as const;

export function ScreenshotPlaceholder({
  label,
  caption,
  tone = 'lime',
  aspectRatio = '16/10',
  className,
}: ScreenshotPlaceholderProps) {
  const palette = TONE_STYLES[tone];

  return (
    <div
      data-slot="screenshot-placeholder"
      data-tone={tone}
      className={cn(
        'relative isolate flex flex-col items-center justify-center overflow-hidden',
        'bg-(--color-surface-elevated) border border-(--color-hairline-strong)',
        'w-full',
        ASPECT_CLASS[aspectRatio],
        className
      )}
    >
      {/* Grid mock — simula linhas de UI */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-2 p-6 opacity-[0.18]"
      >
        {Array.from({ length: 96 }, (_, i) => {
          const filled = (i * 7) % 11 < 4;
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static grid, never reorders
              key={`mock-${i}`}
              className={cn(
                'rounded-[1px]',
                filled ? 'bg-(--color-surface-overlay)' : 'bg-transparent'
              )}
            />
          );
        })}
      </div>

      {/* Center content: monogram + label */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="grid size-14 place-items-center rounded-full border border-dashed"
          style={{
            borderColor: palette.accent,
            boxShadow: `0 0 32px ${palette.glow}`,
          }}
        >
          <span style={{ color: palette.accent }}>
            <SHMonogram size={28} />
          </span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-(--color-text-3)">
          {label}
        </p>
        {caption ? (
          <p className="max-w-[36ch] text-center text-xs text-(--color-text-3) font-mono leading-relaxed">
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  );
}
