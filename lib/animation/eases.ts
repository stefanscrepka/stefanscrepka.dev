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

/**
 * F5 (2026-09-02): avaliador JS do mesmo cubic-bezier que o CSS usa — pra
 * animações imperativas leves (rAF) sem carregar GSAP. Mesmo algoritmo do
 * WebKit/Blink (Newton-Raphson com fallback em bissecção). `t` em [0, 1].
 * Uso: `const ease = cubicBezier(EASES.dramatic); value = from + (to - from) * ease(t)`.
 */
export function cubicBezier(ease: EaseTuple): (t: number) => number {
  const [p1x, p1y, p2x, p2y] = ease;
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return t;
      const d = sampleDX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const xt = sampleX(t);
      if (Math.abs(xt - x) < 1e-6) return t;
      if (x > xt) lo = t;
      else hi = t;
      t = (hi - lo) / 2 + lo;
      if (hi - lo < 1e-7) break;
    }
    return t;
  };
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return sampleY(solveX(t));
  };
}
