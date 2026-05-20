import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  [
    'group/card relative flex flex-col gap-6 rounded-xl',
    'transition-[border-color,box-shadow,transform] duration-(--motion-fast) ease-(--ease-standard)',
  ].join(' '),
  {
    variants: {
      variant: {
        // default: hairline outside + inset bisel (Vercel/Linear signature edge lift).
        // Inset bisel = 1px highlight stroke interior + 1px top edge highlight.
        // Em dark mode: luminance-based elevation, sem shadow plana.
        default:
          'bg-(--color-surface) border border-(--color-hairline) shadow-(--shadow-inset-bisel)',
        elevated: [
          'bg-(--color-surface-elevated) border border-(--color-hairline)',
          // ambient md shadow combinada com inset bisel pra dupla profundidade
          'shadow-[var(--shadow-md),var(--shadow-inset-bisel)]',
        ].join(' '),
        overlay: [
          'bg-(--color-surface-overlay) border border-(--color-hairline-strong)',
          'shadow-(--shadow-lg)',
          'backdrop-blur-xl',
        ].join(' '),
        tracing: [
          'bg-(--color-surface) border border-(--color-hairline)',
          'shadow-(--shadow-inset-bisel)',
          'hover:border-(--color-accent) hover:shadow-(--shadow-glow-lime-sm)',
          'hover:-translate-y-0.5',
        ].join(' '),
      },
      padding: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>;

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? 'default'}
      data-padding={padding ?? 'default'}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5',
        'has-[[data-slot=card-action]]:grid-cols-[1fr_auto]',
        '[[data-padding=none]_&]:p-6 [[data-padding=none]_&]:pb-0',
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-(--color-text-2) leading-relaxed', className)}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('flex flex-col gap-3 text-sm text-(--color-text-2)', className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center gap-3',
        '[[data-padding=none]_&]:p-6 [[data-padding=none]_&]:pt-0',
        className
      )}
      {...props}
    />
  );
}

export type { CardProps };
export { cardVariants };
