'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { CalcomModal } from '@/components/contact/calcom-modal';

// Single global Cal.com 15min modal — controlado via context pra evitar múltiplas
// instâncias (uma no Hero CTA secundário, outra no DirectLinksRow do Contact).
// Múltiplas instâncias = múltiplos init do SDK Cal.com = duplicação de iframe +
// custo de mount/unmount toda vez que um trigger diferente é usado.

interface CalModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CalModalContext = createContext<CalModalContextValue | null>(null);

export function CalModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, openModal, closeModal }), [open, openModal, closeModal]);

  return (
    <CalModalContext.Provider value={value}>
      {children}
      <CalcomModal open={open} onOpenChange={setOpen} />
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
