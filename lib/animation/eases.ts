// Single source of truth pros easings cubic-bezier do projeto.
// Espelha exatamente os tokens `--ease-*` em app/globals.css linhas 174-182.
// Use estas constantes em vez de `cubic-bezier(...)` literal em Motion 12,
// GSAP ou qualquer animacao JS — evita drift entre CSS e runtime.
//
// Em CSS use os tokens diretos: `ease-(--ease-standard)`, etc.
// Em Motion 12 props `transition.ease`: `EASES.standard`.
// Em GSAP `gsap.to(..., { ease: 'cubic-bezier(...)' })`: passar `EASES.toCss(EASES.standard)`.

export const EASES = {
  standard: [0.2, 0, 0, 1] as const,
  enter: [0.05, 0.7, 0.1, 1] as const,
  exit: [0.3, 0, 0.8, 0.15] as const,
  snappy: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.42, 0, 0.58, 1] as const,
  dramatic: [0.165, 0.84, 0.44, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  outQuint: [0.22, 1, 0.36, 1] as const,
} as const;

export type EaseTuple = readonly [number, number, number, number];

/** Converte um EaseTuple pra string CSS `cubic-bezier(a, b, c, d)`. */
export function toCss(ease: EaseTuple): string {
  return `cubic-bezier(${ease[0]}, ${ease[1]}, ${ease[2]}, ${ease[3]})`;
}
