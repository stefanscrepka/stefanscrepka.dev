import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Gotcha #3: GSAP + Lenis scroll refresh timing
// Pattern oficial: lenis.on('scroll', ScrollTrigger.update) + gsap.ticker.add com lenis.raf
// + gsap.ticker.lagSmoothing(0) pra evitar desincronizar com momentum scrolling iOS.

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

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

  const {
    duration = 1.2,
    smoothWheel = true,
    syncTouch = true, // gotcha #3 iOS momentum scrolling fix
  } = options;

  lenisInstance = new Lenis({
    duration,
    easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel,
    syncTouch,
  });

  // Sync Lenis com GSAP ticker (gotcha #3)
  lenisInstance.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add((time: number) => {
    lenisInstance?.raf(time * 1000);
  });

  // Critical: lagSmoothing(0) evita desync com Lenis raf loop
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroySmoothScroll(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getSmoothScroll(): Lenis | null {
  return lenisInstance;
}
