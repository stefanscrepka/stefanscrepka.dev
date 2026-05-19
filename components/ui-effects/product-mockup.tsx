import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Polish CSS-only para screenshots (zero modificação de pixels do produto).
// 3-layer shadow cinema + 1px hairline + glow lime ambient + perspective tilt sutil.
// Hover lift opcional via prop (defaults true). Reduced-motion mata transform global.

const mockupVariants = cva(
  [
    'group/mockup relative isolate inline-flex max-w-full overflow-hidden',
    'rounded-2xl border bg-(--color-surface)',
    'transition-[transform,box-shadow,border-color] duration-(--motion-transition) ease-(--ease-snappy)',
  ].join(' '),
  {
    variants: {
      tone: {
        lime: 'border-(--color-hairline-strong) shadow-(--shadow-cinema) hover:shadow-[var(--shadow-cinema),0_0_48px_var(--color-accent-emissive)]',
        amber:
          'border-(--color-hairline-strong) shadow-(--shadow-cinema) hover:shadow-[var(--shadow-cinema),0_0_48px_var(--color-amber-glow)]',
        neutral: 'border-(--color-hairline-strong) shadow-(--shadow-cinema)',
      },
      tilt: {
        none: '',
        subtle: '[transform-style:preserve-3d] [transform:perspective(1200px)_rotateX(2deg)]',
        deep: '[transform-style:preserve-3d] [transform:perspective(900px)_rotateX(4deg)_rotateY(-2deg)]',
      },
      lift: {
        true: 'hover:-translate-y-1',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'lime',
      tilt: 'subtle',
      lift: true,
    },
  }
);

interface ProductMockupProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof mockupVariants> {
  children: ReactNode;
  caption?: ReactNode;
}

export function ProductMockup({
  className,
  children,
  caption,
  tone,
  tilt,
  lift,
  ...props
}: ProductMockupProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        data-slot="product-mockup"
        data-tone={tone ?? 'lime'}
        className={cn(mockupVariants({ tone, tilt, lift }), className)}
        {...props}
      >
        {/* Inner highlight 1px no topo (Linear/Vercel signature) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        {children}
      </div>
      {caption ? (
        <figcaption className="text-xs text-(--color-text-3) font-mono">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export { mockupVariants };
