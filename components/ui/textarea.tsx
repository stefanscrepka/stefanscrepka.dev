import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base sm:text-sm field-sizing-content',
        // W3.x: placeholder text-3 → text-2 (mesma razão do Input).
        'border-(--color-hairline-strong) text-(--color-text-1) placeholder:text-(--color-text-2)',
        'shadow-(--shadow-inner-highlight)',
        'transition-[border-color,box-shadow] duration-(--motion-fast) ease-(--ease-standard)',
        'outline-none',
        'focus-visible:border-(--color-accent) focus-visible:shadow-(--shadow-glow-lime-sm)',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-(--color-danger)',
        className
      )}
      {...props}
    />
  );
}
