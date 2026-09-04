import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Gotcha #3: GSAP + Lenis scroll refresh timing
// Pattern oficial: lenis.on('scroll', ScrollTrigger.update) + gsap.ticker.add com lenis.raf
// + gsap.ticker.lagSmoothing(0) pra evitar desincronizar com momentum scrolling iOS.

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let scrollTriggerConfigured = false;
let rafTickerCallback: ((time: number) => void) | null = null;
let originalLagSmoothing: { lag: number; tolerance: number } | null = null;

interface SmoothScrollOptions {
  duration?: number;
  smoothWheel?: boolean;
  syncTouch?: boolean;
}

export function initSmoothScroll(options: SmoothScrollOptions = {}): Lenis {
  if (typeof window === 'undefined') {
    throw new Error('initSmoothScroll must run in browser context');
  }

  if (lenisInstance) return lenisInstance;

  // ScrollTrigger refresh em resize/orientation change (1× por session, browser-only).
  if (!scrollTriggerConfigured) {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize,orientationchange',
    });
    scrollTriggerConfigured = true;
  }

  const {
    duration = 1.2,
    smoothWheel = true,
    // W-mob (2026-05-24): syncTouch removido do default. Lenis em touch
    // gera lag + conflito com momentum nativo iOS 17+. LenisProvider já
    // bail-eia em touch devices via useIsTouch — esse caller é desktop-only.
    syncTouch = false,
  } = options;

  lenisInstance = new Lenis({
    duration,
    easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel,
    syncTouch,
    // F5 (2026-09-02), Lenis 1.3 API (README verificado):
    //  • stopInertiaOnNavigate — mata o momentum quando um link interno é
    //    clicado; sem isso a página nova nascia ainda "deslizando" no soft-nav
    //    do Next.
    //  • prevent — avaliado no caminho do evento ANTES do smoothing: dentro de
    //    um Dialog/Sheet (Radix, role="dialog") ou de [data-lenis-prevent] a
    //    roda rola o conteúdo do overlay, não a página. Complementa (não
    //    substitui) o stop()/start() via `data-scroll-locked` no provider.
    //  • respectReducedMotion (default true) — defesa em profundidade; o
    //    provider já nem instancia Lenis sob reduced-motion.
    stopInertiaOnNavigate: true,
    prevent: (node) => !!node.closest?.('[data-lenis-prevent],[role="dialog"]'),
  });

  // Sync Lenis com GSAP ticker (gotcha #3)
  lenisInstance.on('scroll', () => {
    ScrollTrigger.update();
  });

  // Salva ref do callback pra cleanup (gotcha: gsap.ticker.add sem remove vazava em StrictMode)
  rafTickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };
  gsap.ticker.add(rafTickerCallback);

  // Critical: lagSmoothing(0) evita desync com Lenis raf loop.
  // Backup do default antes pra restaurar no destroy.
  if (originalLagSmoothing === null) {
    originalLagSmoothing = { lag: 500, tolerance: 33 }; // GSAP defaults
  }
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroySmoothScroll(): void {
  if (rafTickerCallback) {
    gsap.ticker.remove(rafTickerCallback);
    rafTickerCallback = null;
  }
  if (originalLagSmoothing) {
    gsap.ticker.lagSmoothing(originalLagSmoothing.lag, originalLagSmoothing.tolerance);
    originalLagSmoothing = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getSmoothScroll(): Lenis | null {
  return lenisInstance;
}
