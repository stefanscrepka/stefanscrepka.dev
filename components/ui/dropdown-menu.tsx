'use client';

import { DropdownMenu as DropdownPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuPortal = DropdownPrimitive.Portal;
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuSub = DropdownPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup;

const contentClasses = [
  'z-50 min-w-[8rem] max-h-(--radix-dropdown-menu-content-available-height)',
  'origin-(--radix-dropdown-menu-content-transform-origin)',
  'overflow-hidden rounded-lg border border-(--color-hairline-strong)',
  'bg-(--color-surface-overlay) p-1 shadow-(--shadow-lg) backdrop-blur-xl',
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
  'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
].join(' ');

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(contentClasses, className)}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

interface DropdownMenuItemProps extends ComponentProps<typeof DropdownPrimitive.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

export function DropdownMenuItem({
  className,
  inset = false,
  variant = 'default',
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none',
        'text-(--color-text-1)',
        'transition-colors',
        'focus:bg-(--color-surface) focus:text-(--color-text-1)',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[variant=destructive]:text-(--color-danger) data-[variant=destructive]:focus:bg-(--color-danger)/10',
        'data-[inset=true]:pl-8',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.CheckboxItem>) {
  return (
    <DropdownPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md py-2 pr-2 pl-8 text-sm outline-none',
        'text-(--color-text-1)',
        'focus:bg-(--color-surface)',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
            <path
              d="M5 12l5 5L20 7"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.CheckboxItem>
  );
}

export function DropdownMenuLabel({
  className,
  inset = false,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(
        'px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-(--color-text-3)',
        'data-[inset=true]:pl-8',
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-(--color-hairline)', className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto font-mono text-xs tracking-wider text-(--color-text-3)', className)}
      {...props}
    />
  );
}

export function DropdownMenuSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none',
        'text-(--color-text-1) transition-colors',
        'focus:bg-(--color-surface) data-[state=open]:bg-(--color-surface)',
        'data-[inset=true]:pl-8',
        className
      )}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="ml-auto size-3.5 text-(--color-text-3)"
        aria-hidden="true"
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </DropdownPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubContent>) {
  return (
    <DropdownPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(contentClasses, className)}
      {...props}
    />
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md py-2 pr-2 pl-8 text-sm outline-none',
        'text-(--color-text-1)',
        'focus:bg-(--color-surface)',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <span className="size-2 rounded-full bg-(--color-accent) shadow-(--shadow-glow-lime-sm)" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.RadioItem>
  );
}
