import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm field-sizing-content',
        'border-(--color-hairline-strong) text-(--color-text-1) placeholder:text-(--color-text-3)',
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
