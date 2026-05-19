interface SuspenseFallbackProps {
  label?: string;
}

export function SuspenseFallback({ label }: SuspenseFallbackProps) {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center">
      <output
        className="font-mono text-sm"
        style={{ color: 'var(--color-text-3)' }}
        aria-live="polite"
      >
        {label ?? 'Carregando…'}
      </output>
    </div>
  );
}
