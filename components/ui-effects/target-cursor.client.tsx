'use client';

import { gsap } from 'gsap';
import { useEffect } from 'react';

// Cursor de mira (F8, 2026-09-05) — a partir de reactbits/target-cursor
// (acervo), reescrito: um ponto segue o ponteiro; sobre qualquer alvo
// clicável, quatro cantos de 12px enquadram o elemento — os mesmos 12px das
// pernas do `corner-ticks` das molduras. O cursor vira a gramática de
// interação que já existia nos cards.
//
// O que ficou de fora do original: o giro ocioso (ruído), a dependência de
// esconder o cursor sobre campos de texto (aqui o nativo volta em input,
// textarea e select), e o rAF permanente (o ponto usa gsap.quickTo).
// Só existe com ponteiro fino e sem prefers-reduced-motion; nunca em touch.
// Zero DOM no servidor: tudo é criado na hidratação.

const TARGET_SELECTOR = 'a, button, [role="button"], [role="tab"], summary, [data-cursor-target]';
const TEXT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const PAD = 6;
const LEG = 12;

export function TargetCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const root = document.createElement('div');
    root.setAttribute('data-slot', 'target-cursor');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<span data-cursor-dot></span>' +
      ['tl', 'tr', 'bl', 'br'].map((c) => `<span data-cursor-corner="${c}"></span>`).join('');
    document.body.appendChild(root);
    document.documentElement.setAttribute('data-cursor', 'custom');

    const dot = root.querySelector<HTMLElement>('[data-cursor-dot]');
    const corners = Array.from(root.querySelectorAll<HTMLElement>('[data-cursor-corner]'));
    if (!dot || corners.length !== 4) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.14, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.14, ease: 'power3.out' });
    let mouseX = -100;
    let mouseY = -100;
    let current: Element | null = null;
    let overText = false;
    gsap.set(dot, { x: mouseX, y: mouseY, opacity: 0 });
    gsap.set(corners, { x: mouseX, y: mouseY, opacity: 0 });

    const cornerPoints = (r: DOMRect) => [
      [r.left - PAD, r.top - PAD],
      [r.right + PAD - LEG, r.top - PAD],
      [r.left - PAD, r.bottom + PAD - LEG],
      [r.right + PAD - LEG, r.bottom + PAD - LEG],
    ];

    const frameTo = (el: Element, instant = false) => {
      const pts = cornerPoints(el.getBoundingClientRect());
      corners.forEach((c, i) => {
        const [x, y] = pts[i] as [number, number];
        if (instant) gsap.set(c, { x, y, opacity: 1 });
        else gsap.to(c, { x, y, opacity: 1, duration: 0.22, ease: 'power3.out', overwrite: true });
      });
      gsap.to(dot, { scale: 0.5, duration: 0.2, ease: 'power2.out', overwrite: true });
    };

    const frameOff = () => {
      corners.forEach((c) =>
        gsap.to(c, {
          x: mouseX - LEG / 2,
          y: mouseY - LEG / 2,
          opacity: 0,
          duration: 0.18,
          ease: 'power2.in',
          overwrite: true,
        })
      );
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true });
    };

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotX(mouseX);
      dotY(mouseY);
      if (!overText) gsap.to(dot, { opacity: 1, duration: 0.15, overwrite: 'auto' });
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      const text = t.closest(TEXT_SELECTOR);
      if (text) {
        overText = true;
        gsap.to(dot, { opacity: 0, duration: 0.12, overwrite: 'auto' });
      } else if (overText) {
        overText = false;
        gsap.to(dot, { opacity: 1, duration: 0.12, overwrite: 'auto' });
      }
      const target = t.closest(TARGET_SELECTOR);
      if (target && target !== current) {
        current = target;
        frameTo(target);
      } else if (!target && current) {
        current = null;
        frameOff();
      }
    };
    const onLeaveWindow = () => {
      current = null;
      gsap.to([dot, ...corners], { opacity: 0, duration: 0.15, overwrite: 'auto' });
    };
    const onScroll = () => {
      if (current) frameTo(current, true);
    };
    const onDown = () => gsap.to(dot, { scale: 0.7, duration: 0.1, overwrite: 'auto' });
    const onUp = () =>
      gsap.to(dot, { scale: current ? 0.5 : 1, duration: 0.15, overwrite: 'auto' });

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.documentElement.removeAttribute('data-cursor');
      root.remove();
    };
  }, []);

  return null;
}
