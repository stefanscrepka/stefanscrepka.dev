import type { MetadataRoute } from 'next';

// W-seo (2026-05-25): dates reais por rota em vez de new Date() global.
// Google desconfia de "tudo mudou hoje" — quando todas as URLs têm o mesmo
// lastModified atualizado a cada build, o sinal vira ruído. Datas const aqui
// devem refletir mudanças materiais de conteúdo da rota (atualizar manualmente
// quando rewriting copy/structure).
const ROUTE_DATES = {
  home: '2026-09-04',
  work: '2026-09-04',
  contentEngine: '2026-09-04',
  caluna: '2026-09-04',
  stark: '2026-09-04',
  esteticaMd: '2026-09-04',
  playground: '2026-05-23',
  process: '2026-05-25',
  privacidade: '2026-09-04',
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stefanscrepka.dev';

  return [
    {
      url: `${base}/`,
      lastModified: ROUTE_DATES.home,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/work`,
      lastModified: ROUTE_DATES.work,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/work/content-engine`,
      lastModified: ROUTE_DATES.contentEngine,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/work/caluna`,
      lastModified: ROUTE_DATES.caluna,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/work/stark`,
      lastModified: ROUTE_DATES.stark,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/work/estetica-md`,
      lastModified: ROUTE_DATES.esteticaMd,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${base}/playground`,
      lastModified: ROUTE_DATES.playground,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/process`,
      lastModified: ROUTE_DATES.process,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/privacidade`,
      lastModified: ROUTE_DATES.privacidade,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
