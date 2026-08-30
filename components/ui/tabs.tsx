'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

interface TabsListProps extends ComponentProps<typeof TabsPrimitive.List> {
  variant?: 'pill' | 'line';
}

export function TabsList({ className, variant = 'line', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'group/tabs-list inline-flex items-center',
        variant === 'pill'
          ? 'h-10 rounded-pill bg-(--color-surface) p-1 gap-1'
          : 'h-11 gap-6 border-b border-(--color-hairline)',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // W-audit (2026-06-10): outline-none removido (mascarava o anel global
        // de globals.css `*:focus-visible`) e o trio focus-visible:outline-*
        // local também — redundante/conflitante com a regra global, que cobre.
        'relative inline-flex shrink-0 items-center justify-center gap-2 px-3 text-sm font-medium',
        'text-(--color-text-2)',
        'transition-colors duration-(--motion-fast) ease-(--ease-standard)',
        'hover:text-(--color-text-1)',
        'disabled:pointer-events-none disabled:opacity-50',
        // Pill variant
        'group-data-[variant=pill]/tabs-list:h-8 group-data-[variant=pill]/tabs-list:rounded-pill',
        'group-data-[variant=pill]/tabs-list:data-[state=active]:bg-(--color-accent)',
        'group-data-[variant=pill]/tabs-list:data-[state=active]:text-(--color-text-on-accent)',
        // Line variant (default) — lime underline via ::after
        'group-data-[variant=line]/tabs-list:h-full group-data-[variant=line]/tabs-list:rounded-none',
        'group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:bottom-[-1px] group-data-[variant=line]/tabs-list:after:left-0 group-data-[variant=line]/tabs-list:after:right-0',
        'group-data-[variant=line]/tabs-list:after:h-[2px] group-data-[variant=line]/tabs-list:after:bg-(--color-accent)',
        'group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:after:transition-opacity',
        'group-data-[variant=line]/tabs-list:data-[state=active]:text-(--color-text-1)',
        'group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      // W-audit (2026-06-10): outline-none removido — o painel do Radix é
      // focável (tabIndex=0) e ficava sem indicador de foco; o anel global
      // *:focus-visible cobre.
      className={className}
      {...props}
    />
  );
}
