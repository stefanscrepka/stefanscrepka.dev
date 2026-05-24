'use client';

import { m } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { SHMonogram } from '@/components/shared/sh-monogram';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMounted } from '@/hooks/use-mounted';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { EASES } from '@/lib/animation/eases';
import { useAnchorScroll } from '@/lib/scroll/anchor-scroll';
import { cn } from '@/lib/utils';

// W4.1 (2026-05-23): hrefs do nav agora são `/#anchor` (absolutos) pra
// funcionar em qualquer rota. Quando estamos NA home, interceptamos o
// click e usamos Lenis smooth scroll. Quando NÃO estamos, deixa o
// browser navegar nativamente (vai pra home e o hash dispara scroll).
function extractAnchor(href: string): string | null {
  if (href.startsWith('#')) return href;
  if (href.startsWith('/#')) return href.slice(1);
  return null;
}

// Top bar full-width estilo midu.design + vercel.com — substitui o FloatingDock
// (Aceternity Apple-dock pattern) que nao casava com a hierarquia tipografica
// massiva do site. Header fixed, hairline-bottom, 64/56px, layout 3-up:
// brand left · nav center · status row right.

export interface TopBarNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  /** Subtitle exibido abaixo do label no Sheet mobile. */
  subtitle?: string;
}

interface TopBarNavProps {
  items: TopBarNavItem[];
  className?: string;
}

export function TopBarNav({ items, className }: TopBarNavProps) {
  return (
    <header
      data-slot="top-bar-nav"
      className={cn(
        'fixed inset-x-0 top-0 z-50 w-full',
        'border-b border-(--color-hairline-strong) bg-(--color-base)/85 backdrop-blur-md',
        'h-14 md:h-16',
        className
      )}
    >
      <div className="container-max flex h-full items-center justify-between gap-4">
        <NavLogo />
        <NavLinks items={items} />
        <NavMobileSheet items={items} />
        {/* Right side spacer pra centralizar links visualmente quando nav existe */}
        <span aria-hidden="true" className="hidden w-[28px] md:block lg:w-[80px]" />
      </div>
    </header>
  );
}

/* ============================================================
   <NavLogo /> — monograma SH lime + separator + nome mono uppercase
   ============================================================ */

function NavLogo() {
  return (
    // W3.x (2026-05-23): aria-label "Stefan — home" inclui o texto visível
    // ("Stefan") no início pra atender label-content-name-mismatch audit do
    // Lighthouse. Voice-control users falam "Stefan" e bate.
    <Link
      href="/"
      aria-label="Stefan — home"
      className={cn(
        'group inline-flex items-center gap-3 rounded-md outline-none',
        'transition-colors',
        'focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-base)'
      )}
    >
      <span className="text-(--color-accent) transition-colors group-hover:text-(--color-accent-hover)">
        <SHMonogram size={28} />
      </span>
      <span aria-hidden="true" className="hidden h-5 w-px bg-(--color-hairline-strong) sm:block" />
      <span className="hidden font-mono text-xs uppercase tracking-widest text-(--color-text-1) sm:inline">
        Stefan
      </span>
    </Link>
  );
}

/* ============================================================
   <NavLinks /> — horizontal stagger reveal, active underline lime
   ============================================================ */

function NavLinks({ items }: { items: TopBarNavItem[] }) {
  const scroll = useAnchorScroll();
  const reduced = useReducedMotionSafe();
  const activeHash = useActiveHash(items);
  const pathname = usePathname();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const anchor = extractAnchor(href);
    // Só intercepta + smooth scroll quando temos um anchor E estamos na home.
    // Em qualquer outra rota, deixa o link navegar pra `/#anchor` nativamente.
    if (anchor && pathname === '/') {
      e.preventDefault();
      scroll(anchor);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', anchor);
      }
    }
  };

  // Reduced-motion: snap-final (initial = final state, sem transição).
  const initial = reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };
  const animate = { opacity: 1, y: 0 };

  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
      {items.map((item, i) => {
        // activeHash retorna "#work" / "#manifesto" etc. Comparamos com o
        // anchor extraído de href (que pode ser `#x` ou `/#x`).
        const itemAnchor = extractAnchor(item.href);
        const isActive = itemAnchor !== null && activeHash === itemAnchor;
        return (
          <m.a
            key={item.href}
            href={item.href}
            onClick={(e) => onClick(e, item.href)}
            aria-current={isActive ? 'page' : undefined}
            initial={initial}
            animate={animate}
            transition={{
              duration: reduced ? 0 : 0.25,
              delay: reduced ? 0 : i * 0.08,
              ease: EASES.standard,
            }}
            className={cn(
              'relative inline-flex h-9 items-center px-3 text-sm font-medium outline-none',
              'transition-colors',
              isActive
                ? 'text-(--color-text-1)'
                : 'text-(--color-text-2) hover:text-(--color-text-1)',
              'focus-visible:text-(--color-text-1)'
            )}
          >
            {item.label}
            {isActive ? (
              <span
                aria-hidden="true"
                className={cn('absolute inset-x-3 -bottom-px h-px bg-(--color-accent)')}
              />
            ) : null}
          </m.a>
        );
      })}
    </nav>
  );
}

/* ============================================================
   <NavMobileSheet /> — hamburger 44px + Radix Dialog drawer
   Status row removido (Stefan: "nao faz sentido na navbar").
   ============================================================ */

function NavMobileSheet({ items }: { items: TopBarNavItem[] }) {
  const [open, setOpen] = useState(false);
  const scroll = useAnchorScroll();
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Abrir menu de navegação"
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-md',
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
              <SHMonogram size={28} />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-(--color-text-1)">
              Stefan
            </span>
          </div>

          <nav className="mt-8 flex flex-col gap-1" aria-label="Navegação móvel">
            {items.map((item) => (
              <SheetClose asChild key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    const anchor = extractAnchor(item.href);
                    // Smooth scroll só quando na home. Em outras rotas, deixa
                    // o link navegar pra `/#anchor` nativamente — Sheet fecha.
                    if (anchor && pathname === '/') {
                      e.preventDefault();
                      setOpen(false);
                      requestAnimationFrame(() => scroll(anchor));
                    }
                  }}
                  className={cn(
                    'flex flex-col gap-0.5 rounded-md px-3 py-3 outline-none transition-colors',
                    'text-(--color-text-1) hover:bg-(--color-surface) hover:text-(--color-accent)',
                    'focus-visible:bg-(--color-surface) focus-visible:text-(--color-accent)'
                  )}
                >
                  <span className="text-base font-medium">{item.label}</span>
                  {item.subtitle ? (
                    <span className="font-mono text-2xs uppercase tracking-widest text-(--color-text-3)">
                      {item.subtitle}
                    </span>
                  ) : null}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ============================================================
   useActiveHash — observa scroll + sincroniza com hash atual.
   Usa IntersectionObserver pra anchor sections — single source pra
   active underline. SSR-safe (sempre null antes de mount).
   ============================================================ */

function useActiveHash(items: TopBarNavItem[]): string | null {
  const mounted = useMounted();
  const [activeHash, setActiveHash] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: items.map(.href) é estável (literal de layout) — observar `items` cria reconexão a cada render.
  useEffect(() => {
    if (!mounted) return;

    // W4.1: aceita hrefs `#x` e `/#x` (após mudança pra absolute anchors).
    const anchors = items.map((i) => extractAnchor(i.href)).filter((a): a is string => a !== null);
    const targets = anchors
      .map((h) => document.getElementById(h.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) {
      setActiveHash(window.location.hash || null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveHash(`#${visible[0].target.id}`);
        }
      },
      {
        // Trigger zone: top 96px (clear nav) -> bottom 60% (focus de cima).
        rootMargin: '-96px 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const t of targets) observer.observe(t);
    return () => observer.disconnect();
  }, [mounted]);

  return activeHash;
}
