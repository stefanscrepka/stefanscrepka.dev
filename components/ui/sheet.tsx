'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Dialog as SheetPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Sheet = Dialog em side variant. Radix unified não tem Sheet nativo (shadcn invention).
// Wrap Dialog.Root + Content positionado lateralmente com slide animations.

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  );
}

const sheetContentVariants = cva(
  [
    'fixed z-50 flex flex-col gap-6 bg-(--color-surface-overlay) shadow-(--shadow-cinema)',
    'transition-transform ease-(--ease-snappy)',
    'data-[state=open]:animate-in data-[state=open]:duration-300',
    'data-[state=closed]:animate-out data-[state=closed]:duration-200',
  ].join(' '),
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-(--color-hairline-strong) data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-(--color-hairline-strong) rounded-t-2xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r border-(--color-hairline-strong) data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right:
          'inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l border-(--color-hairline-strong) data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      },
    },
    defaultVariants: { side: 'right' },
  }
);

interface SheetContentProps
  extends ComponentProps<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  showCloseButton?: boolean;
}

export function SheetContent({
  className,
  children,
  side,
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side ?? 'right'}
        className={cn(sheetContentVariants({ side }), 'p-6', className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-md text-(--color-text-2) outline-none transition-colors hover:bg-(--color-surface) hover:text-(--color-text-1) focus-visible:ring-2 focus-visible:ring-(--color-border-focus)"
            aria-label="Fechar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-4"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 text-left', className)}
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2', className)}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'text-lg font-semibold leading-tight tracking-tight text-(--color-text-1)',
        className
      )}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm leading-relaxed text-(--color-text-2)', className)}
      {...props}
    />
  );
}
