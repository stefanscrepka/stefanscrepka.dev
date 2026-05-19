// Suspense fallback enquanto o bundle do PlaygroundPage carrega.
// Sem skeleton mockado — apenas um wrapper minimal que respeita o header dock + footer.

export default function PlaygroundLoading() {
  return (
    <section className="container-max section-pad-y" aria-busy="true" aria-live="polite">
      <p className="eyebrow">PLAYGROUND</p>
      <div className="mt-6 flex flex-col gap-4">
        <div className="h-10 w-2/3 animate-pulse rounded-md bg-(--color-surface)" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-(--color-surface)" />
        <div className="mt-8 h-[28rem] animate-pulse rounded-2xl border border-(--color-hairline) bg-(--color-surface)" />
      </div>
    </section>
  );
}
