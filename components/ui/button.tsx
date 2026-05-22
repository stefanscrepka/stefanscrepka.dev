import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// 8 variants conforme DoD FASE 2 (07_ROADMAP). React 19 ref-as-prop, sem forwardRef.

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'whitespace-nowrap font-medium outline-none transition-all',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    'aria-busy:cursor-progress',
    // Tactile press feedback universal — scale 0.98 em active (Linear/Vercel pattern).
    // Aplicado em todas variants pra micro-acknowledge de click sem decoracao.
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'rounded-pill bg-accent text-(--color-text-on-accent) font-semibold',
          'shadow-(--shadow-md) hover:shadow-(--shadow-glow-lime-sm)',
          'hover:bg-(--color-accent-hover)',
        ].join(' '),
        secondary:
          'rounded-md bg-(--color-surface-elevated) text-(--color-text-1) hover:bg-(--color-surface-overlay)',
        outline: [
          'rounded-md border border-(--color-hairline-strong) bg-transparent text-(--color-text-1)',
          'hover:border-(--color-accent) hover:text-(--color-accent) hover:bg-(--color-accent-subtle)',
        ].join(' '),
        ghost:
          'rounded-md bg-transparent text-(--color-text-2) hover:bg-(--color-surface) hover:text-(--color-text-1)',
        link: 'h-auto rounded-none bg-transparent px-0 text-(--color-accent) underline-offset-4 hover:underline',
        destructive:
          'rounded-md bg-(--color-danger) text-(--color-text-1) hover:opacity-90 shadow-(--shadow-sm)',
        success:
          'rounded-md bg-(--color-success) text-(--color-text-on-accent) hover:opacity-90 shadow-(--shadow-sm)',
        accent: 'rounded-md bg-transparent text-(--color-accent) hover:bg-(--color-accent-subtle)',
      },
      size: {
        default: 'h-10 px-5 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const computedClass = cn(buttonVariants({ variant, size }), className);

  // asChild branch: Slot.Root usa React.Children.only — exige UM único filho.
  // Loading spinner não combina com asChild (consumidor controla o conteúdo).
  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant ?? 'default'}
        data-size={size ?? 'default'}
        className={computedClass}
        {...props}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      data-variant={variant ?? 'default'}
      data-size={size ?? 'default'}
      data-loading={loading ? '' : undefined}
      className={computedClass}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <ButtonSpinner /> : null}
      {children}
    </button>
  );
}

function ButtonSpinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type { ButtonProps };
export { buttonVariants };
