import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type ?? 'text'}
      data-slot="input"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base sm:text-sm',
        // W3.x (2026-05-23): placeholder usava text-3 que numa surface glass
        // (oklch 16.5% efetivo) caía pra ~3.8:1, abaixo de WCAG AA. Subindo
        // pra text-2 (oklch 75% L) — ~6:1, passa folgado.
        'border-(--color-hairline-strong) text-(--color-text-1) placeholder:text-(--color-text-2)',
        'shadow-(--shadow-inner-highlight)',
        'transition-[border-color,box-shadow,background-color] duration-(--motion-fast) ease-(--ease-standard)',
        'outline-none',
        'focus-visible:border-(--color-accent) focus-visible:shadow-(--shadow-glow-lime-sm)',
        'hover:border-(--color-hairline-strong)',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'aria-invalid:border-(--color-danger) aria-invalid:focus-visible:shadow-[0_0_16px_oklch(65%_0.20_10_/_0.4)]',
        className
      )}
      {...props}
    />
  );
}
