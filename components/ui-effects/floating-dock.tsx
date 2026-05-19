'use client';

import {
  AnimatePresence,
  type MotionValue,
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import Link from 'next/link';
import { type ReactNode, useRef, useState } from 'react';
import { SHMonogram } from '@/components/shared/sh-monogram';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';
import { cn } from '@/lib/utils';

export interface FloatingDockItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** Subtitle aparece em hover tooltip + abaixo do label no mobile Sheet. */
  subtitle?: string;
}

interface FloatingDockProps {
  items: FloatingDockItem[];
  brand?: ReactNode;
  className?: string;
}

const SPRING_CONFIG = { mass: 0.12, stiffness: 160, damping: 14 } as const;

export function FloatingDock({ items, brand, className }: FloatingDockProps) {
  return (
    <header
      className={cn(
        'pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4',
        className
      )}
    >
      <div
        data-slot="floating-dock"
        className={cn(
          'pointer-events-auto inline-flex max-w-full items-center gap-1 rounded-pill',
          'border border-(--color-hairline-strong) bg-(--color-surface-overlay)/80',
          'px-2 py-1.5 shadow-(--shadow-lg) shadow-(--shadow-inner-highlight) backdrop-blur-xl'
        )}
      >
        <Link
          href="/"
          aria-label="Stefan Heinz Screpka — voltar à home"
          className={cn(
            'ml-0.5 flex size-9 items-center justify-center rounded-full text-(--color-accent)',
            'outline-none transition-colors',
            'hover:bg-(--color-accent-subtle)',
            'focus-visible:bg-(--color-accent-subtle)'
          )}
        >
          {brand ?? <SHMonogram size={22} />}
        </Link>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-(--color-hairline-strong)" />
        <FloatingDockDesktop items={items} />
        <FloatingDockMobile items={items} />
      </div>
    </header>
  );
}

/* ============================================================
   Desktop — magnify icon on mouse proximity (Motion 12)
   ============================================================ */

function FloatingDockDesktop({ items }: { items: FloatingDockItem[] }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <nav
      aria-label="Navegação principal"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className="hidden items-center gap-0.5 md:flex"
    >
      {items.map((item) => (
        <DockItemMagnify key={item.href} mouseX={mouseX} item={item} />
      ))}
    </nav>
  );
}

function DockItemMagnify({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: FloatingDockItem;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotionSafe();
  const scroll = useAnchorScroll();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const iconSizeRaw = useTransform(distance, [-140, 0, 140], [16, 26, 16]);
  const iconSize = useSpring(iconSizeRaw, SPRING_CONFIG);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href.startsWith('#')) {
      e.preventDefault();
      scroll(item.href);
    }
  };

  // Reduced-motion → plain anchor, sem motion components/loop.
  if (reduced) {
    return (
      <a
        ref={ref}
        href={item.href}
        aria-label={item.subtitle ? `${item.label} — ${item.subtitle}` : item.label}
        onClick={onClick}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium',
          'text-(--color-text-2) outline-none transition-colors',
          'hover:bg-(--color-surface) hover:text-(--color-text-1)',
          'focus-visible:bg-(--color-surface) focus-visible:text-(--color-text-1)'
        )}
      >
        <span className="grid size-4 place-items-center">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <m.a
      ref={ref}
      href={item.href}
      aria-label={item.subtitle ? `${item.label} — ${item.subtitle}` : item.label}
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={cn(
        'relative inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium',
        'text-(--color-text-2) outline-none transition-colors',
        'hover:bg-(--color-surface) hover:text-(--color-text-1)',
        'focus-visible:bg-(--color-surface) focus-visible:text-(--color-text-1)'
      )}
    >
      <m.span
        style={{ width: iconSize, height: iconSize }}
        className="grid place-items-center text-current"
        aria-hidden="true"
      >
        {item.icon}
      </m.span>
      <span>{item.label}</span>

      <AnimatePresence>
        {active && item.subtitle ? (
          <m.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 2 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
            className={cn(
              'pointer-events-none absolute left-1/2 top-full -translate-x-1/2',
              'mt-3 whitespace-nowrap rounded-md border border-(--color-hairline-strong)',
              'bg-(--color-surface-overlay) px-2 py-1 font-mono text-[11px] tracking-wide',
              'text-(--color-text-3) shadow-(--shadow-md)'
            )}
            role="tooltip"
          >
            {item.subtitle}
          </m.span>
        ) : null}
      </AnimatePresence>
    </m.a>
  );
}

/* ============================================================
   Mobile — hamburger trigger + Sheet drawer (right side)
   Hamburger size-11 (44px) atende WCAG 2.5.5 tap target.
   ============================================================ */

function FloatingDockMobile({ items }: { items: FloatingDockItem[] }) {
  const [open, setOpen] = useState(false);
  const scroll = useAnchorScroll();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Abrir menu de navegação"
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-full',
              'text-(--color-text-1) outline-none transition-colors',
              'hover:bg-(--color-surface)',
              'focus-visible:bg-(--color-surface) focus-visible:ring-2 focus-visible:ring-(--color-border-focus)'
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 sm:w-80">
          <div className="flex items-center gap-3">
            <span className="text-(--color-accent)">
              <SHMonogram size={24} />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-(--color-text-3)">
              Navegação
            </span>
          </div>
          <nav className="mt-8 flex flex-col gap-1" aria-label="Navegação móvel">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                    setOpen(false);
                    requestAnimationFrame(() => scroll(item.href));
                  } else {
                    setOpen(false);
                  }
                }}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium',
                  'text-(--color-text-1) outline-none transition-colors',
                  'hover:bg-(--color-surface) hover:text-(--color-accent)',
                  'focus-visible:bg-(--color-surface) focus-visible:text-(--color-accent)'
                )}
              >
                <span className="grid size-5 place-items-center text-(--color-text-2)">
                  {item.icon}
                </span>
                <span className="flex flex-col">
                  <span>{item.label}</span>
                  {item.subtitle ? (
                    <span className="font-mono text-[11px] text-(--color-text-3)">
                      {item.subtitle}
                    </span>
                  ) : null}
                </span>
              </a>
            ))}
          </nav>
          <p className="mt-auto pt-8 text-xs text-(--color-text-3) font-mono leading-relaxed">
            Construo IA multi-agente em produção — e o produto inteiro ao redor dela.
          </p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
