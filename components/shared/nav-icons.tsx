// Ícones inline pra FloatingDock nav. Stroke 1.6, currentColor cascata.
// Todos decorativos (label vai via texto adjacente + aria-label no anchor parent).

const COMMON = {
  viewBox: '0 0 24 24',
  fill: 'none',
  className: 'h-full w-full',
} as const;

export function WorkIcon() {
  return (
    <svg {...COMMON} aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ProcessIcon() {
  return (
    <svg {...COMMON} aria-hidden="true" focusable="false">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 6h10M6 8l5 8M18 8l-5 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ManifestoIcon() {
  return (
    <svg {...COMMON} aria-hidden="true" focusable="false">
      <path
        d="M5 7h6v6a4 4 0 0 1-4 4H6m7-10h6v6a4 4 0 0 1-4 4h-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactIcon() {
  return (
    <svg {...COMMON} aria-hidden="true" focusable="false">
      <path
        d="M3 7l9 6 9-6M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
