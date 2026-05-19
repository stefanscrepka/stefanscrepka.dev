import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Stefan Heinz Screpka — AI Product Engineer',
    short_name: 'Stefan Screpka',
    description: 'Construo IA multi-agente em produção — e o produto inteiro ao redor dela.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080A07',
    theme_color: '#080A07',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
