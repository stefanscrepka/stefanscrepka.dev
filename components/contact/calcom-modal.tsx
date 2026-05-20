'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Cal.com 15min modal embedded — HANDOFF §97: "Cal.com como link externo
// = perde contexto. Sempre modal embedded via @calcom/embed-react".
// Tema dark+lime via cssVarsPerTheme do Cal.

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

  // Cal.com embed inicializa via SDK quando o container monta.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: 'stefan-15min' });
        if (cancelled) return;
        // Cal.com SDK exige hex strings literais via cssVarsPerTheme — não
        // resolve var(--token). Esses valores SÃO os tokens OKLCH convertidos
        // pra sRGB pra cross-browser consistency dentro do iframe Cal.com:
        //   cal-brand     = var(--color-accent)
        //   cal-bg        = var(--color-base) raised
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
        // Cal API falhou (ex: network). Fallback aparece via DialogDescription.
      }
    })();
    return () => {
      cancelled = true;
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
              className="text-(--color-accent) underline-offset-4 hover:underline"
            >
              cal.com/{calLink}
            </a>
          </DialogDescription>
        </div>
        <div className="flex-1 overflow-auto bg-(--color-base)">
          <div ref={containerRef} className="h-full w-full" data-cal-modal-container />
        </div>
      </DialogContent>
    </Dialog>
  );
}
