// Brand book MD → PDF via Chrome headless.
// DARK MODE — bg #0F1212, Geist Sans/Mono via Google Fonts, lime accent.
// Capa cinematográfica full-bleed, section openers premium, footer com pagina + brand.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const mdPath = resolve(projectRoot, 'docs/brand-book.md');
const htmlPath = resolve(projectRoot, 'brand-book.html');
const pdfPath = resolve(projectRoot, 'brand-book.pdf');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error('Chrome/Edge não encontrado.');
  process.exit(1);
}

if (!existsSync(mdPath)) {
  console.error(`brand-book.md não existe em ${mdPath}`);
  process.exit(1);
}

// ============================================================
// CSS — DARK BRAND BOOK premium (Apple/Discord/VANS tier)
// ============================================================

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Playfair+Display:ital@1&display=swap');

@page {
  size: A4;
  margin: 26mm 22mm 26mm 22mm;
}

@page :first {
  margin: 0;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: #0F1212;
  color: #F8F9F8;
}

body {
  font-family: 'Geist', -apple-system, "Segoe UI", sans-serif;
  font-size: 9.5pt;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'ss01' 1, 'calt' 1, 'liga' 1, 'kern' 1;
}

/* ============================================================
   CAPA — full-bleed dark, mark hero, hierarchy massiva
   ============================================================ */

.cover {
  width: 210mm;
  height: 297mm;
  background: #0F1212;
  color: #F8F9F8;
  padding: 28mm 22mm;
  position: relative;
  page-break-after: always;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2pt;
  background: #D2FF00;
}

.cover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.5pt;
  background: rgba(248, 249, 248, 0.15);
}

.cover-top {
  display: flex;
  justify-content: space-between;
  font-family: 'Geist Mono', monospace;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9A9C9A;
}

.cover-top .lime { color: #D2FF00; }

.cover-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 18mm 0 14mm 0;
}

.cover-mark img {
  width: 110mm;
  height: auto;
  border-radius: 0;
  background: transparent;
}

.cover-titles {
  text-align: left;
}

.cover-eyebrow {
  font-family: 'Geist Mono', monospace;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #D2FF00;
  margin: 0 0 6mm 0;
}

.cover-title {
  font-family: 'Geist', sans-serif;
  font-size: 58pt;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.92;
  margin: 0 0 8mm 0;
  color: #F8F9F8;
}

.cover-subtitle {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 16pt;
  font-weight: 400;
  margin: 0 0 14mm 0;
  color: #B7B9B7;
  line-height: 1.3;
  max-width: 140mm;
}

.cover-role {
  font-family: 'Geist Mono', monospace;
  font-size: 8.5pt;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #F8F9F8;
  margin: 0;
}

.cover-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-family: 'Geist Mono', monospace;
  font-size: 7.5pt;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #6A6F6A;
}

.cover-bottom .col {
  display: flex;
  flex-direction: column;
  gap: 1mm;
}

.cover-bottom strong {
  color: #B7B9B7;
  font-weight: 500;
}

/* ============================================================
   CONTENT — wrapper main
   ============================================================ */

main.content {
  background: #0F1212;
  color: #F8F9F8;
}

/* ============================================================
   HEADINGS
   ============================================================ */

main h1 {
  font-family: 'Geist', sans-serif;
  font-size: 28pt;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #FFFFFF;
  margin: 0 0 0.5em 0;
  page-break-after: avoid;
}

main h2 {
  font-family: 'Geist', sans-serif;
  font-size: 32pt;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1;
  color: #FFFFFF;
  margin: 0 0 1.2em 0;
  padding: 0;
  border: none;
  page-break-before: always;
  page-break-after: avoid;
}

/* Eyebrow simulation antes do h2 via ::before — não usado (MD tem "01 · ...") */

main h3 {
  font-family: 'Geist', sans-serif;
  font-size: 13pt;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #F8F9F8;
  margin: 2em 0 0.5em 0;
  page-break-after: avoid;
}

main h4 {
  font-family: 'Geist Mono', monospace;
  font-size: 8.5pt;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9A9C9A;
  margin: 1.6em 0 0.6em 0;
  page-break-after: avoid;
}

/* ============================================================
   TEXTO + INLINE
   ============================================================ */

main p {
  margin: 0 0 0.8em 0;
  color: #D6D8D5;
  orphans: 2;
  widows: 2;
}

main a {
  color: #D2FF00;
  text-decoration: none;
  border-bottom: 0.5pt solid rgba(210, 255, 0, 0.4);
  padding-bottom: 0.5pt;
}

main strong {
  font-weight: 600;
  color: #FFFFFF;
}

main em {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  color: #F8F9F8;
}

/* ============================================================
   LISTAS
   ============================================================ */

main ul, main ol {
  margin: 0 0 1em 0;
  padding-left: 1.5em;
}

main li {
  margin-bottom: 0.35em;
  color: #D6D8D5;
}

main ul li::marker {
  color: #D2FF00;
}

main ol li::marker {
  color: #9A9C9A;
  font-family: 'Geist Mono', monospace;
  font-size: 9pt;
}

/* ============================================================
   BLOCKQUOTE — frase-núcleo, manifesto, frase canônica
   ============================================================ */

main blockquote {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 16pt;
  font-weight: 400;
  line-height: 1.35;
  margin: 1.2em 0;
  padding: 8pt 0 8pt 22pt;
  border-left: 3pt solid #D2FF00;
  color: #FFFFFF;
  page-break-inside: avoid;
}

main blockquote p {
  margin: 0 0 0.4em 0;
  color: inherit;
}

main blockquote p:last-child { margin-bottom: 0; }

main blockquote strong {
  font-family: 'Geist', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 17pt;
  letter-spacing: -0.01em;
  color: #FFFFFF;
}

main blockquote em {
  font-style: italic;
  font-family: 'Playfair Display', Georgia, serif;
}

/* ============================================================
   CODE
   ============================================================ */

main code {
  font-family: 'Geist Mono', Menlo, Consolas, monospace;
  font-size: 8.5pt;
  background: rgba(210, 255, 0, 0.08);
  padding: 1pt 5pt;
  border-radius: 2px;
  color: #D2FF00;
  word-break: break-word;
}

main pre {
  font-family: 'Geist Mono', monospace;
  font-size: 8.5pt;
  background: rgba(248, 249, 248, 0.04);
  padding: 14pt 16pt;
  border-radius: 4px;
  border: 0.5pt solid rgba(248, 249, 248, 0.1);
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin: 1em 0;
  page-break-inside: avoid;
  color: #F8F9F8;
  line-height: 1.5;
}

main pre code {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

/* ============================================================
   TABELAS — premium dark, hairlines sutis, mono pra tokens
   ============================================================ */

main table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.8em 0 1.4em 0;
  font-size: 8.8pt;
  line-height: 1.45;
}

main thead { display: table-header-group; }
main tr { page-break-inside: avoid; }

main th {
  text-align: left;
  font-family: 'Geist Mono', monospace;
  font-weight: 500;
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9A9C9A;
  padding: 7pt 10pt 7pt 0;
  border-bottom: 0.5pt solid rgba(248, 249, 248, 0.25);
  vertical-align: bottom;
}

main td {
  padding: 7pt 10pt 7pt 0;
  border-bottom: 0.3pt solid rgba(248, 249, 248, 0.08);
  vertical-align: top;
  color: #D6D8D5;
}

main td:first-child, main th:first-child { padding-left: 0; }
main td:last-child, main th:last-child { padding-right: 0; }

main tr:last-child td {
  border-bottom: 0.5pt solid rgba(248, 249, 248, 0.15);
}

main td code, main th code {
  font-size: 8pt;
  background: rgba(248, 249, 248, 0.06);
  color: #F8F9F8;
}

main td strong { color: #FFFFFF; }

/* ============================================================
   IMAGENS — assets do brand book, bg dark já matchando body
   ============================================================ */

main img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.2em auto;
  border-radius: 4px;
  page-break-inside: avoid;
  border: 0.3pt solid rgba(248, 249, 248, 0.12);
}

/* ============================================================
   HR — divisor entre subsections
   ============================================================ */

main hr {
  border: none;
  border-top: 0.5pt solid rgba(248, 249, 248, 0.15);
  margin: 2.5em 0 2em 0;
  page-break-after: avoid;
}

/* ============================================================
   SUMÁRIO — primeira lista ordenada do main
   ============================================================ */

main > ol:first-of-type {
  list-style: none;
  padding-left: 0;
  margin-top: 1em;
}

main > ol:first-of-type li {
  font-family: 'Geist Mono', monospace;
  font-size: 11pt;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 0.6em;
  padding-bottom: 0.5em;
  border-bottom: 0.3pt solid rgba(248, 249, 248, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #F8F9F8;
}

main > ol:first-of-type li a {
  color: #F8F9F8;
  border: none;
  flex: 1;
}

main > ol:first-of-type li::marker {
  font-family: 'Geist Mono', monospace;
  color: #D2FF00;
  font-size: 10pt;
}

/* ============================================================
   PRINT-SPECIFIC
   ============================================================ */

@media print {
  main a[href]:not([href^="#"])::after {
    content: "";  /* Não mostrar URL inline — fica feio em dark */
  }
}
`;

// ============================================================
// Pre-process MD — extrair header/título da capa, manter resto
// ============================================================

marked.setOptions({ gfm: true, breaks: false, pedantic: false });

console.log('→ Parsing brand-book.md...');
const md = readFileSync(mdPath, 'utf-8');

// Identifica o final do header (primeira linha `---` standalone)
const lines = md.split('\n');
let splitIdx = -1;
for (let i = 0; i < Math.min(20, lines.length); i++) {
  if (lines[i].trim() === '---' && i > 5) {
    splitIdx = i;
    break;
  }
}

const bodyMd = splitIdx >= 0 ? lines.slice(splitIdx + 1).join('\n') : md;

const bodyHtml = marked.parse(bodyMd);

// ============================================================
// Capa custom HTML — full-bleed dark com mark hero
// ============================================================

const coverHtml = `
<section class="cover">
  <div class="cover-top">
    <span><span class="lime">●</span>&nbsp;&nbsp;Brand Book · v1.0</span>
    <span>2026-05-24</span>
  </div>

  <div class="cover-mark">
    <img src="brand-source/Logos-Stefan/Primary.png" alt="SH monogram">
  </div>

  <div class="cover-titles">
    <p class="cover-eyebrow">Identidade Visual + Voz</p>
    <h1 class="cover-title">STEFAN<br>HEINZ<br>SCREPKA</h1>
    <p class="cover-subtitle">A marca de quem constrói sistemas multi-agente em produção — e o produto inteiro ao redor deles.</p>
    <p class="cover-role">AI Product Engineer · Multi-Agent Systems in Production</p>
  </div>

  <div class="cover-bottom">
    <div class="col">
      <span><strong>Volume 01</strong></span>
      <span>Logo · Cor · Tipografia · Voz</span>
    </div>
    <div class="col" style="text-align: right;">
      <span><strong>Ponta Grossa · BR</strong></span>
      <span>stefan.screpka.com</span>
    </div>
  </div>
</section>
`;

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Brand Book — Stefan Heinz Screpka</title>
<style>${CSS}</style>
</head>
<body>
${coverHtml}
<main class="content">
${bodyHtml}
</main>
</body>
</html>
`;

writeFileSync(htmlPath, html);
console.log(`→ HTML escrito: ${htmlPath}`);

// ============================================================
// Footer template Chrome — page number lime + brand mini
// (Capa não tem porque @page :first { margin: 0 } elimina)
// ============================================================

const footerTemplate =
  '<div style="font-family:Geist,Helvetica,sans-serif;font-size:7pt;color:#9A9C9A;width:100%;padding:0 22mm 4mm 22mm;display:flex;justify-content:space-between;align-items:center;background:#0F1212;">' +
  '<span style="letter-spacing:0.14em;text-transform:uppercase;">stefan heinz screpka &middot; brand book</span>' +
  '<span style="color:#D2FF00;font-weight:500;"><span class="pageNumber"></span>&nbsp;/&nbsp;<span class="totalPages"></span></span>' +
  '</div>';

const headerTemplate = '<div style="display:none;"></div>';

console.log(`→ Renderizando PDF via ${chromePath.includes('msedge') ? 'Edge' : 'Chrome'}...`);

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--virtual-time-budget=20000',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfPath}`,
  `--header-template=${headerTemplate}`,
  `--footer-template=${footerTemplate}`,
  `file:///${htmlPath.replace(/\\/g, '/')}`,
];

const proc = spawn(chromePath, args, { stdio: ['ignore', 'inherit', 'inherit'] });

proc.on('close', (code) => {
  if (code === 0 && existsSync(pdfPath)) {
    const sizeKB = Math.round(readFileSync(pdfPath).length / 1024);
    console.log(`✓ PDF gerado: ${pdfPath} (${sizeKB} KB)`);
    try {
      unlinkSync(htmlPath);
      console.log('✓ HTML temp removido');
    } catch (e) {
      console.warn(`Aviso: ${e.message}`);
    }
  } else {
    console.error(`✗ Chrome exit code: ${code}`);
    process.exit(1);
  }
});
