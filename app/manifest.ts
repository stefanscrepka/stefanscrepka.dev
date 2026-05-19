import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Stefan Heinz Screpka — AI Product Engineer',
    short_name: 'Stefan Screpka',
    description: 'Construo IA multi-agente em produção — e o produto inteiro ao redor dela.',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#080A07',
    theme_color: '#080A07',
    orientation: 'portrait',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['portfolio', 'developer', 'productivity'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
