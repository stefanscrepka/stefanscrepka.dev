import { Children, isValidElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// W-audit (2026-06-10): substitui SplitTextHeadline (GSAP SplitText client).
//
// Por quê: o pipeline antigo era SSR pinta headline completo → GSAP carrega em
// requestIdleCallback → gsap.set(opacity:0) ESCONDE o texto já visível →
// re-anima palavra a palavra. Frames do audit (T66ms completo, T1191ms apagado)
// provaram o replay — pior em CPU lenta, onde o visitante lia por ~2s antes do
// texto sumir. Num site cuja tese é "funciona 24/7", o primeiro frame piscava.
//
// Como: split por palavra acontece NO SERVIDOR — cada palavra vira <span
// class="headline-word" style="--word-i:n">. A animação é CSS puro
// (globals.css: headline-word-in, 600ms, stagger 55ms via calc) e roda a
// partir do primeiro paint, antes de qualquer JS. Não existe estado
// "visível → escondido". Elementos React (ex: <EditorialAccent>) entram como
// palavra atômica. Bônus: gsap/SplitText saem do caminho da home (~40 KB gz
// que eram puxados no idle).
//
// Reduced-motion: media query no CSS desliga a animação — headline estático.

interface HeadlineWordRevealProps {
  children: ReactNode;
  className?: string;
}

export function HeadlineWordReveal({ children, className }: HeadlineWordRevealProps) {
  let wordIndex = 0;
  const parts: ReactNode[] = [];

  const pushWord = (content: ReactNode) => {
    parts.push(
      <span
        key={`w-${wordIndex}`}
        className="headline-word"
        style={{ ['--word-i' as string]: wordIndex }}
      >
        {content}
      </span>,
      ' '
    );
    wordIndex++;
  };

  for (const child of Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      for (const word of String(child).split(/\s+/)) {
        if (word) pushWord(word);
      }
    } else if (isValidElement(child)) {
      pushWord(child);
    }
  }

  return <h1 className={cn('headline-display text-balance', className)}>{parts}</h1>;
}
