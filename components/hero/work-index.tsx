import Link from 'next/link';
import { AnchorLink } from '@/components/shared/anchor-link';
import { cn } from '@/lib/utils';
import type { HeroIndexItem } from '@/lib/work/data';

// Índice do trabalho (F9, 2026-09-05) — a metade direita do hero.
//
// O que ficava aqui era o trilho do cron do Content Engine: o dia de UM
// produto, e o site inteiro lia como o site desse produto. Um portfólio põe
// na primeira tela o corpo de trabalho, e põe como lista (R1: em 12 de 26
// portfólios de pessoa a obra aparece na dobra como tabela, nome + estado,
// não como grade de capas). Cinco linhas, numeradas: nome, ano e o estado
// real (operacional, em produção, piloto, no ar, peças físicas). Nada mais:
// a primeira versão desta fase tinha a captura do item ativo, um relógio e
// uma descrição por linha, e o Stefan achou o hero mais poluído do que antes.
//
// Cada linha é um link (case ou seção). Lime só no hover/foco, na seta.
// Server Component: zero JS, zero estado; só a linha do SK3D (âncora) usa a
// ilha AnchorLink pra rolar com o Lenis.

interface WorkIndexProps {
  items: readonly HeroIndexItem[];
  className?: string | undefined;
}

const ROW_CLASS = cn(
  // F9 (R4 F19): sem margem negativa nem fundo de hover; a linha fica no
  // trilho do container e o hover é o número que clareia + a seta.
  'group/row grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-2.5'
);

export function WorkIndex({ items, className }: WorkIndexProps) {
  return (
    <nav
      aria-labelledby="hero-indice"
      data-slot="work-index"
      className={cn('flex flex-col gap-3', className)}
    >
      <p id="hero-indice" className="eyebrow">
        Índice
      </p>
      <ol className="flex flex-col border-b border-(--color-hairline)">
        {items.map((item) => {
          const isHash = item.href.startsWith('#');
          const content = (
            <>
              <span className="font-mono text-2xs tabular-nums text-(--color-text-3) transition-colors duration-(--motion-fast) group-hover/row:text-(--color-text-1) group-focus-visible/row:text-(--color-text-1)">
                {item.n}
              </span>
              <span className="min-w-0 truncate text-[15px] font-semibold !leading-[1.2] tracking-tight text-(--color-text-1)">
                {item.title}
              </span>
              <span className="flex items-baseline gap-1.5 whitespace-nowrap font-mono text-2xs uppercase tracking-wider text-(--color-text-3)">
                <span className="tabular-nums">{item.year}</span>
                <span aria-hidden="true" className="text-(--color-hairline-strong)">
                  ·
                </span>
                <span>{item.status}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-block w-3 -translate-x-1 text-(--color-accent) opacity-0',
                    'transition-[opacity,transform] duration-(--motion-fast) ease-(--ease-standard)',
                    'group-hover/row:translate-x-0 group-hover/row:opacity-100',
                    'group-focus-visible/row:translate-x-0 group-focus-visible/row:opacity-100'
                  )}
                >
                  →
                </span>
              </span>
            </>
          );
          return (
            <li key={item.href} className="border-t border-(--color-hairline)">
              {isHash ? (
                <AnchorLink href={`/${item.href}`} className={ROW_CLASS}>
                  {content}
                </AnchorLink>
              ) : (
                <Link href={item.href} className={ROW_CLASS}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
