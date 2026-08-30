import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * F4 (2026-08-29) — guarda de claim↔evidência para o design system.
 *
 * A página /design-system listava `--text-7xl` e `--color-info` depois de ambos
 * terem sido removidos do `@theme` em globals.css. `fontSize: var(--text-7xl)`
 * sem valor não quebra nada visivelmente: o span simplesmente herda o tamanho do
 * pai. Resultado: a página exibia uma linha rotulada "text-7xl" renderizada no
 * tamanho do body — documentação que mente em silêncio.
 *
 * Este teste falha se qualquer token citado pela página não existir no @theme.
 */

const ROOT = join(__dirname, '..', '..');

function readThemeTokens(): Set<string> {
  const css = readFileSync(join(ROOT, 'app', 'globals.css'), 'utf8');
  const start = css.indexOf('@theme');
  expect(start, 'bloco @theme não encontrado em globals.css').toBeGreaterThan(-1);

  // varre do '{' do @theme até a chave que o fecha, contando profundidade
  const open = css.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = css.slice(open, end);
  const tokens = new Set<string>();
  for (const m of body.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
    // `--color-amber-50: initial` anula a escala default do Tailwind; não conta
    // como token disponível.
    const name = m[1];
    if (!name) continue;
    const decl = body.slice(m.index ?? 0, (m.index ?? 0) + 120);
    if (/^--[a-z0-9-]+\s*:\s*initial\s*;/i.test(decl)) continue;
    tokens.add(name);
  }
  return tokens;
}

function readReferencedTokens(): { file: string; token: string }[] {
  const files = [
    'app/design-system/_sections/tokens.tsx',
    'app/design-system/_sections/effects.tsx',
    'app/design-system/_sections/primitives.tsx',
    'app/design-system/_sections/dialogs.tsx',
  ];
  const out: { file: string; token: string }[] = [];
  for (const f of files) {
    let src: string;
    try {
      src = readFileSync(join(ROOT, f), 'utf8');
    } catch {
      continue;
    }
    // só as strings declaradas como `token: '--x'` — é assim que as tabelas do
    // design system citam tokens. Classes utilitárias do Tailwind não entram.
    for (const m of src.matchAll(/token:\s*'(--[a-z0-9-]+)'/gi)) {
      const token = m[1];
      if (token) out.push({ file: f, token });
    }
  }
  return out;
}

describe('design system ↔ @theme', () => {
  const theme = readThemeTokens();
  const referenced = readReferencedTokens();

  it('extrai tokens do @theme', () => {
    expect(theme.size).toBeGreaterThan(40);
    expect(theme.has('--color-accent')).toBe(true);
    expect(theme.has('--color-bg')).toBe(true);
  });

  it('encontra tokens citados pela página do design system', () => {
    expect(referenced.length).toBeGreaterThan(20);
  });

  it('todo token citado pela página existe no @theme', () => {
    const missing = referenced.filter((r) => !theme.has(r.token));
    const detail = missing.map((m) => `  ${m.file} cita ${m.token} (ausente no @theme)`).join('\n');
    expect(missing, `tokens fantasma:\n${detail}`).toEqual([]);
  });

  it('tokens removidos não voltam a ser citados', () => {
    // regressão explícita: estes dois causaram o bug original
    for (const dead of ['--text-7xl', '--color-info']) {
      expect(theme.has(dead), `${dead} voltou ao @theme sem revisão`).toBe(false);
      expect(
        referenced.some((r) => r.token === dead),
        `${dead} voltou a ser citado pela página do design system`
      ).toBe(false);
    }
  });
});
