'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Cal.com 15min modal embedded — HANDOFF §97: "Cal.com como link externo
// = perde contexto. Sempre modal embedded via @calcom/embed-react".
// Tema dark+lime via cssVarsPerTheme do Cal.
//
// F3.8 (2026-06-11): skeleton de calendário enquanto o iframe carrega.
// Antes: ~2–3s de void escuro (só sr-only + aria-busy). Agora um skeleton
// month-view (meta do evento + grid 7×5 + coluna de slots) segura a
// percepção até o evento `linkReady` do embed SDK; fallback de 10s garante
// que o skeleton nunca mascara um iframe quebrado (o link direto na
// DialogDescription continua sendo a saída de emergência).

interface CalcomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calLink?: string;
}

const DEFAULT_LINK =
  process.env.NEXT_PUBLIC_CAL_USERNAME && process.env.NEXT_PUBLIC_CAL_EVENT_TYPE
    ? `${process.env.NEXT_PUBLIC_CAL_USERNAME}/${process.env.NEXT_PUBLIC_CAL_EVENT_TYPE}`
    : 'stefanscrepka/15min';

export function CalcomModal({ open, onOpenChange, calLink = DEFAULT_LINK }: CalcomModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calReady, setCalReady] = useState(false);

  // Cal.com embed inicializa via SDK quando o container monta.
  useEffect(() => {
    if (!open) {
      setCalReady(false);
      return;
    }
    let cancelled = false;
    let calApi: Awaited<ReturnType<typeof getCalApi>> | null = null;
    const markReady = () => {
      if (!cancelled) setCalReady(true);
    };
    // Fallback: se linkReady nunca disparar (network/iframe quebrado), o
    // skeleton sai do caminho e o fallback link da DialogDescription resolve.
    const failsafe = window.setTimeout(markReady, 10_000);
    (async () => {
      try {
        const cal = await getCalApi({ namespace: 'stefan-15min' });
        if (cancelled) return;
        calApi = cal;
        // Cal.com SDK exige hex strings literais via cssVarsPerTheme — não
        // resolve var(--token). Esses valores SÃO os tokens OKLCH convertidos
        // pra sRGB pra cross-browser consistency dentro do iframe Cal.com:
        //   cal-brand     = var(--color-accent)
        //   cal-bg        = var(--color-bg) raised
        //   cal-bg-emphasis = var(--color-surface)
        //   cal-text/emphasis = var(--color-text-1)
        //   cal-text-muted    = var(--color-text-2)
        //   cal-border / emphasis = var(--color-hairline) / strong
        const darkVars = {
          'cal-brand': '#D2FF00',
          'cal-bg': '#0F1310',
          'cal-bg-emphasis': '#1D2319',
          'cal-text': '#FAFAFA',
          'cal-text-emphasis': '#FFFFFF',
          'cal-text-muted': '#8C8E8B',
          'cal-border': '#1D2319',
          'cal-border-emphasis': '#2A2F26',
        };
        cal('ui', {
          theme: 'dark',
          cssVarsPerTheme: {
            light: darkVars,
            dark: darkVars,
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
        // linkReady = iframe carregou e pintou o booker — hora de tirar o
        // skeleton. API de eventos do embed SDK (action/callback).
        cal('on', { action: 'linkReady', callback: markReady });
        const container = containerRef.current;
        if (!container) return;
        cal('inline', {
          elementOrSelector: container,
          calLink,
          config: {
            theme: 'dark',
          },
        });
      } catch {
        // Cal API falhou (ex: network). Failsafe timer remove o skeleton;
        // fallback aparece via DialogDescription.
      }
    })();
    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      // Sem off, cada ciclo abrir/fechar acumularia um callback no namespace.
      calApi?.('off', { action: 'linkReady', callback: markReady });
    };
  }, [open, calLink]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'sm:max-w-3xl lg:max-w-4xl',
          'h-[min(90vh,800px)] max-h-[90vh] overflow-hidden p-0'
        )}
      >
        <div className="flex flex-col gap-2 border-b border-(--color-hairline) px-6 pt-6 pb-4">
          <DialogTitle>Agendar 15min</DialogTitle>
          <DialogDescription>
            Cal.com embed · sem ida-e-volta. Escolhe horário e confirma. Se algo travar, link
            direto:{' '}
            <a
              href={`https://cal.com/${calLink}`}
              target="_blank"
              rel="noreferrer"
              className="text-(--color-accent) underline underline-offset-4 decoration-(--color-accent)/50 transition-[text-decoration-color] hover:decoration-(--color-accent)"
            >
              cal.com/{calLink}
            </a>
          </DialogDescription>
        </div>
        {/* W-a11y médio #5: aria-live + aria-busy + sr-only label até Cal SDK
            inicializar. aria-busy agora desliga quando linkReady dispara. */}
        <div
          className="relative flex-1 overflow-auto bg-(--color-bg)"
          aria-live="polite"
          aria-busy={open && !calReady}
        >
          {!calReady ? <span className="sr-only">Carregando calendário Cal.com…</span> : null}
          <CalendarSkeleton ready={calReady} />
          <div ref={containerRef} className="h-full w-full" data-cal-modal-container />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton month-view ecoando a anatomia do booker Cal (meta do evento à
// esquerda, calendário ao centro, slots à direita em desktop). Neutro —
// surface + hairline + animate-pulse, zero lime (lime só quando "faz algo",
// regra de marca). Fade-out 200ms quando o iframe assume; permanece no DOM
// invisível (pointer-events-none) pra transição não cortar seco.
function CalendarSkeleton({ ready }: { ready: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 z-10 grid gap-6 bg-(--color-bg) p-6',
        'sm:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_140px]',
        'pointer-events-none transition-opacity duration-(--motion-fast) ease-(--ease-standard)',
        ready ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* Meta do evento — avatar + título + duração */}
      <div className="hidden flex-col gap-3 sm:flex">
        <span className="size-9 animate-pulse rounded-full bg-(--color-surface)" />
        <span className="h-3 w-24 animate-pulse rounded-sm bg-(--color-surface)" />
        <span className="h-4 w-36 animate-pulse rounded-sm bg-(--color-surface-elevated)" />
        <span className="h-3 w-20 animate-pulse rounded-sm bg-(--color-surface)" />
        <span className="mt-2 h-3 w-28 animate-pulse rounded-sm bg-(--color-surface)" />
      </div>

      {/* Calendário month-view — header mês + 7 colunas × 5 linhas */}
      <div className="flex flex-col gap-4 sm:border-l sm:border-(--color-hairline) sm:pl-6">
        <div className="flex items-center justify-between">
          <span className="h-4 w-28 animate-pulse rounded-sm bg-(--color-surface-elevated)" />
          <span className="flex gap-2">
            <span className="size-6 animate-pulse rounded-md bg-(--color-surface)" />
            <span className="size-6 animate-pulse rounded-md bg-(--color-surface)" />
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: grid decorativo estático
              key={i}
              className="aspect-square animate-pulse rounded-md bg-(--color-surface)"
              style={{ animationDelay: `${(i % 7) * 60}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Coluna de slots (desktop) */}
      <div className="hidden flex-col gap-2.5 lg:flex">
        <span className="h-3 w-16 animate-pulse rounded-sm bg-(--color-surface)" />
        {Array.from({ length: 6 }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: lista decorativa estática
            key={i}
            className="h-9 w-full animate-pulse rounded-md border border-(--color-hairline) bg-(--color-surface)"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
