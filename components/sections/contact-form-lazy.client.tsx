'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// W-perf #1: ContactForm (Zod + react-hook-form + Motion = ~80 KB gz) só
// carrega quando o user chega próximo à Contact section via IntersectionObserver.
// Antes vazava no first-load de toda rota mesmo quando user nunca scrollava
// até o form.
//
// SSR-friendly: renderiza placeholder skeleton SSR + hydrate via IO. Mantém
// HTML estático no source-view, sem flash visual.

const ContactFormLazy = dynamic(
  () => import('@/components/sections/contact-form.client').then((m) => m.ContactForm),
  { ssr: false, loading: () => <FormSkeleton /> }
);

export function ContactFormLazyMount() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || shouldMount) return;

    // rootMargin generoso: começa carregar 800px ANTES de visível pra
    // evitar flash entre skeleton e form real quando user scrollar rápido.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shouldMount]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      {shouldMount ? <ContactFormLazy /> : <FormSkeleton />}
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="flex min-h-96 flex-col gap-6 sm:gap-7" aria-busy="true" aria-live="polite">
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <SkeletonField />
        <SkeletonField />
      </div>
      <div className="h-20 rounded-md bg-(--color-surface)/40" />
      <div className="h-32 rounded-md bg-(--color-surface)/40" />
      <div className="h-14 w-full rounded-pill bg-(--color-surface)/40 sm:max-w-xs" />
    </div>
  );
}

function SkeletonField() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-3 w-20 rounded bg-(--color-surface)/40" />
      <div className="h-12 rounded-md bg-(--color-surface)/40" />
    </div>
  );
}
