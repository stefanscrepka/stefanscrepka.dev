import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind class merger — combina clsx + tailwind-merge.
 * Padrão shadcn/ui, reutilizar em todos os componentes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
