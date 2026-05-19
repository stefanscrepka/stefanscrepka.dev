import { cookies, headers } from 'next/headers';

// Gotcha #1: cookies/headers async em Next 16 — sempre awaited.
// Helpers tipados pra reduzir boilerplate.

export async function getCookieValue(name: string): Promise<string | undefined> {
  const store = await cookies();
  return store.get(name)?.value;
}

export async function getHeaderValue(name: string): Promise<string | null> {
  const store = await headers();
  return store.get(name);
}

export async function getUserAgent(): Promise<string | null> {
  return getHeaderValue('user-agent');
}

export async function getPreferredLocale(): Promise<string> {
  const acceptLanguage = await getHeaderValue('accept-language');
  if (!acceptLanguage) return 'pt-BR';
  const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim();
  return primary || 'pt-BR';
}
