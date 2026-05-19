'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-5 shrink-0 rounded-full border outline-none',
        'border-(--color-hairline-strong) bg-transparent',
        'shadow-(--shadow-inner-highlight)',
        'transition-[border-color,box-shadow] duration-(--motion-fast) ease-(--ease-standard)',
        'hover:border-(--color-accent)',
        'focus-visible:border-(--color-accent) focus-visible:shadow-(--shadow-glow-lime-sm)',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-(--color-accent)',
        'aria-invalid:border-(--color-danger)',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex h-full w-full items-center justify-center after:block after:size-2 after:rounded-full after:bg-(--color-accent) after:shadow-(--shadow-glow-lime-sm)"
      />
    </RadioGroupPrimitive.Item>
  );
}
