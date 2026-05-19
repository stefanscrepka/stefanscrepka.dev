import type { Metadata } from 'next';
import { PlaygroundPage } from '@/components/playground/playground-page';

// /playground — lazy route. Three visualizations: Hanoi 3D (r3f), Fibonacci
// (Recharts naive vs memo), Parens balancing (SVG stack). Cada tab lazy-load
// independente — Hanoi vem com ~245KB r3f chunk que NÃO bate no /.
//
// Microcopy header (HANDOFF §5.A):
//   "Algoritmos C que aprendi na faculdade — visualizados."
//   Hanoi 3D · Fibonacci comparativo · Balanceamento de parênteses

export const metadata: Metadata = {
  title: 'Playground · algoritmos C visualizados',
  description:
    'Hanoi 3D, Fibonacci comparativo (O(2^n) vs O(n)) e balanceamento de parênteses. Algoritmos da Estrutura de Dados em C virando demos interativos.',
  openGraph: {
    title: 'Playground · Stefan Heinz Screpka',
    description:
      'Algoritmos da faculdade — Hanoi 3D, Fibonacci, Parênteses — virando demos interativos.',
  },
};

export default function Page() {
  return <PlaygroundPage />;
}
