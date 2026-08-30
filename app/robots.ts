import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stefanscrepka.dev';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // W-seo (2026-05-25): /design-system é noindex via metadata mas
      // crawler ainda passa por lá desperdiçando crawl budget. Disallow
      // explícito redireciona budget pra rotas que importam (cases, process).
      disallow: ['/design-system'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
