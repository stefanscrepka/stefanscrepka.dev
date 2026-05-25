import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Stefan Heinz Screpka — AI Product Engineer',
    short_name: 'Stefan Screpka',
    description: 'Construo IA multi-agente em produção — e o produto inteiro ao redor dela.',
    start_url: '/',
    id: '/',
    scope: '/',
    // W-deploy (2026-05-25): display 'standalone' exige service worker
    // funcional pro Chrome aceitar install prompt. Serwist nunca foi
    // implementado. Trocado pra 'browser' (manifest indexável mas sem
    // promessa quebrada). Re-promover quando SW for adotado.
    display: 'browser',
    background_color: '#080A07',
    theme_color: '#080A07',
    orientation: 'any',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['portfolio', 'developer', 'business'],
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
