import { cn } from '@/lib/utils';

// CodeArtifact + RegistryList — registros crus, server-rendered (F6, 2026-09-04).
//
// Substituem os SVGs "desenhados" (terminal falso, IDE falsa, círculos numa
// linha) por texto de verdade: trechos literais de código-fonte e tabelas de
// registro. Sem syntax-highlighter (uma dependência a mais pra pintar palavras
// que não precisam de cor): tudo em text-2, as linhas destacadas em text-1, o
// número da linha em text-3 (sem opacidade: a 60% media 2.69:1 e derrubava o
// Lighthouse a11y). Um elemento aceso por bloco, no máximo.

interface CodeArtifactProps {
  /** Caminho do arquivo de origem, como aparece no repositório. */
  source: string;
  lines: readonly string[];
  startLine?: number | undefined;
  /** Números de linha (absolutos) que sobem pra text-1. */
  highlight?: readonly number[] | undefined;
  /** Texto à direita da barra (ex.: "java 21", "C99"). */
  meta?: string | undefined;
  className?: string | undefined;
}

export function CodeArtifact({
  source,
  lines,
  startLine = 1,
  highlight = [],
  meta,
  className,
}: CodeArtifactProps) {
  const endLine = startLine + lines.length - 1;
  return (
    <figure
      data-slot="code-artifact"
      className={cn('relative w-full min-w-0 [contain:inline-size]', className)}
    >
      <div className="corner-ticks p-2">
        <div className="overflow-hidden rounded-[4px] border border-(--color-hairline-alpha-2) bg-(--color-surface-deep)">
          <figcaption
            className={cn(
              'flex h-7 items-center justify-between gap-3 px-3',
              'border-b border-(--color-hairline-alpha) bg-(--color-surface)',
              'font-mono text-2xs uppercase tracking-wider text-(--color-text-3)'
            )}
          >
            <span className="min-w-0 truncate normal-case">{source}</span>
            <span className="shrink-0 tabular-nums">
              {meta ? `${meta} · ` : ''}L{startLine}–{endLine}
            </span>
          </figcaption>
          {/* Linhas longas QUEBRAM (whitespace-pre-wrap) com recuo pendurado —
              pl-10 + -indent-10: a primeira linha começa no número, a
              continuação alinha com o código. Clipar (overflow-x) escondia o
              fim de cada linha nos cards estreitos e estourava a largura da
              página no mobile (min-content do <pre>). */}
          <pre className="max-w-full overflow-x-auto p-4 font-mono text-[0.75rem] leading-[1.65] text-(--color-text-2)">
            <code>
              {lines.map((line, i) => {
                const n = startLine + i;
                const lit = highlight.includes(n);
                return (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: linhas estáticas, ordem fixa
                    key={i}
                    className={cn(
                      'block whitespace-pre-wrap break-words pl-10 -indent-10',
                      lit && 'text-(--color-text-1)'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block w-10 select-none pr-3 text-right tabular-nums text-(--color-text-3)"
                    >
                      {n}
                    </span>
                    {line.length > 0 ? line : ' '}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    </figure>
  );
}

export interface RegistryRow {
  id: string;
  name: string;
  detail?: string | undefined;
}

interface RegistryListProps {
  rows: readonly RegistryRow[];
  /** `id` da linha acesa (lime) — no máximo uma por lista. */
  lit?: string | undefined;
  /** Legenda de origem, abaixo da lista. */
  source?: string | undefined;
  className?: string | undefined;
}

export function RegistryList({ rows, lit, source, className }: RegistryListProps) {
  return (
    <figure
      data-slot="registry-list"
      className={cn('w-full min-w-0 [contain:inline-size]', className)}
    >
      <ul className="divide-y divide-(--color-hairline) border-y border-(--color-hairline)">
        {rows.map((row) => {
          const isLit = row.id === lit;
          return (
            <li
              key={row.id}
              className="grid grid-cols-[3.75rem_1fr] items-baseline gap-x-3 py-2.5 font-mono text-xs leading-snug"
            >
              <span
                className={cn(
                  'tabular-nums',
                  isLit ? 'text-(--color-accent)' : 'text-(--color-text-3)'
                )}
              >
                {row.id}
              </span>
              <span className="min-w-0">
                <span className="text-(--color-text-1)">{row.name}</span>
                {row.detail ? <span className="text-(--color-text-3)"> · {row.detail}</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
      {source ? (
        <figcaption className="mt-3 font-mono text-2xs uppercase tracking-wider text-(--color-text-3)">
          {source}
        </figcaption>
      ) : null}
    </figure>
  );
}
