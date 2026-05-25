'use client';

import dynamic from 'next/dynamic';
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

// Single global Cal.com 15min modal — controlado via context pra evitar múltiplas
// instâncias (uma no Hero CTA secundário, outra no DirectLinksRow do Contact).
// Múltiplas instâncias = múltiplos init do SDK Cal.com = duplicação de iframe +
// custo de mount/unmount toda vez que um trigger diferente é usado.
//
// W-perf #3: Modal carrega via dynamic na primeira abertura (~25-35 KB gz a
// menos no first-load de TODA rota). Após primeira abertura, fica montado
// (closed) pra evitar re-init do Cal SDK em aberturas seguintes.

const CalcomModalLazy = dynamic(
  () => import('@/components/contact/calcom-modal').then((m) => m.CalcomModal),
  { ssr: false, loading: () => null }
);

interface CalModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CalModalContext = createContext<CalModalContextValue | null>(null);

export function CalModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
    setHasOpenedOnce(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, openModal, closeModal }), [open, openModal, closeModal]);

  return (
    <CalModalContext.Provider value={value}>
      {children}
      {hasOpenedOnce ? <CalcomModalLazy open={open} onOpenChange={setOpen} /> : null}
    </CalModalContext.Provider>
  );
}

export function useCalModal(): CalModalContextValue {
  const ctx = useContext(CalModalContext);
  if (!ctx) {
    throw new Error('useCalModal deve ser usado dentro de <CalModalProvider>.');
  }
  return ctx;
}
