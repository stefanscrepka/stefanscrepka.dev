import type { CaseStudy } from './data';

// W-seo (2026-05-25): JSON-LD helpers pros case studies.
//   - SoftwareApplication: Content Engine, NexaCore, STJ App (3 produtos software)
//   - CreativeWork: Estética MD (site institucional pra cliente externo)
//   - BreadcrumbList: navegação Home › Work › Case
//
// Todos usam @id cross-link pro Person schema em app/layout.tsx (#person).
// Google's Knowledge Graph entende a relação creator → person quando ambos
// têm @id absolute URL.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stefanscrepka.dev';
const PERSON_ID = `${BASE_URL}/#person`;

// Map de slugs pra applicationCategory mais específico (vs default).
const APPLICATION_CATEGORY: Record<string, string> = {
  'content-engine': 'BusinessApplication',
  nexacore: 'BusinessApplication',
  'stj-app': 'BusinessApplication',
};

interface SoftwareApplicationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  '@id': string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  creator: { '@id': string };
  about: string[];
}

interface CreativeWorkJsonLd {
  '@context': 'https://schema.org';
  '@type': 'CreativeWork';
  '@id': string;
  name: string;
  description: string;
  url: string;
  creator: { '@id': string };
  about: string[];
}

interface BreadcrumbListJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export function buildCaseStudyJsonLd(
  cs: CaseStudy
): SoftwareApplicationJsonLd | CreativeWorkJsonLd {
  const url = `${BASE_URL}/work/${cs.slug}`;
  const id = `${url}#case-study`;
  // Descrições enriquecidas — tagline + status + impact context se houver.
  const description = [cs.tagline, cs.status, cs.impact?.context].filter(Boolean).join(' · ');

  // Tags semânticas extraídas do stack (sem duplicação verbal).
  const about = Array.from(
    new Set(
      cs.stack
        .flatMap((line) => line.split(/[·,+]/).map((s) => s.trim()))
        .filter((s) => s.length > 2 && s.length < 60)
    )
  );

  // Estética MD é site institucional pra cliente externo, não SaaS — CreativeWork.
  if (cs.slug === 'estetica-md') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': id,
      name: cs.title,
      description,
      url,
      creator: { '@id': PERSON_ID },
      about,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': id,
    name: cs.title,
    description,
    url,
    applicationCategory: APPLICATION_CATEGORY[cs.slug] ?? 'BusinessApplication',
    operatingSystem: 'Web · multi-platform',
    creator: { '@id': PERSON_ID },
    about,
  };
}

export function buildBreadcrumbJsonLd(cs: CaseStudy): BreadcrumbListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      {
        '@type': 'ListItem',
        position: 3,
        name: cs.title,
        item: `${BASE_URL}/work/${cs.slug}`,
      },
    ],
  };
}
