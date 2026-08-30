# Screenshot Seed Checklist

> Plantar dados realistas nos apps ANTES de capturar é o investimento de maior
> ROI pra qualidade percebida do portfolio. Empty states + tela de login são
> os 2 sinais que separam "produto novo sem tração" de "SaaS em produção".
>
> Referências externas (Linear, Stripe, Vercel) NUNCA mostram empty state em
> hero — sempre estado "produto vivo, dados densos, gráfico subindo".

---

## NexaCore — `https://striveos.shop` (logado)

**Status atual:** 3 capturas da `/appointments` mostrando "0 / 0 / 0 / R$ 0,00"
e "Sua agenda começa aqui". **Não usar** — re-capturar após seed.

### Telas prioritárias (em ordem de impacto):

1. **`/dashboard`** ⭐ — flagship do hero. Precisa:
   - Faturamento do Mês: `R$ 47.382,00` (não R$ 0,00)
   - Gráfico Faturamento com curva ASCENDENTE últimos 30 dias
   - Agendamentos Hoje: `12` (não 0)
   - Novos Clientes: `8` (não 0)
   - Taxa de Conversão: `23%` (não 0%)
   - Lista "Agendamentos de Hoje": 4-6 entries
     - `Marina Silva · Limpeza de pele · 09h00 · Confirmado`
     - `Pedro Costa · Botox · 10h30 · Confirmado`
     - `Camila Rocha · Drenagem linfática · 14h00 · Agendado`
     - `Ana Beatriz · Peeling químico · 16h00 · Agendado`

2. **`/appointments`** — secundário pra galeria. Precisa:
   - 6-8 blocos preenchidos na timeline do dia atual
   - Status mix: 3 confirmados, 2 agendados, 2 concluídos
   - Valor do Dia: `R$ 3.840,00`
   - Filtros laterais com contagens não-zero

3. **Landing `app.nexacore.com.br` ou similar** — opcional, já temos
   `nexacore-home.avif`. Re-capturar apenas se trocar copy/hero.

### Como capturar:
- Browser em janela 1440×900 (Chrome DevTools toggle device → Responsive
  → 1440×900, DPR 3 se possível)
- Extensão GoFullPage ou Snipping Tool (Win+Shift+S) para viewport-only
- Salvar PNG raw (sem compression) na raiz do repo

---

## STJ App — `https://stj-app.vercel.app` (logado)

**Status atual:** ✅ Resolvido em 2026-05-26.

### Capturas LIVE no pipeline:
- `stj-app-home.avif` — home page logado mostrando tasks reais, streak buffer,
  task list manhã/tarde. **Esta é a screenshot principal** (substitui o
  antigo `stj-app-desktop.avif` que era tela de login).
- `stj-app-coach.avif` — Coach Lina chat interface. Disponível pra
  composição futura (MacBookScroll secondary frame ou case study scroll).

### Capturas pendentes (se quiser expandir):
- **Calendar logado com posts agendados** — a captura atual mostra
  "vazio / livre / livre". Plantar 6-10 posts agendados na semana antes
  de capturar `/calendar`.
- **Approvals kanban** — `/aprovacoes` com cards em diferentes colunas
  (Pendente, Em Revisão, Aprovado, Rejeitado).
- **Studio CV validator** — tela de validação visual com asset + spec
  side-by-side + status OK/FAIL.

### Por que NÃO usar Playwright automatizado pra STJ:
- App protegido por Supabase Auth + 2FA TOTP — login programático complexo
- Suite atual em `product-screenshots.spec.ts` está com `.describe.skip()`
- Captura manual via browser logado é mais simples + dá controle de timing

---

## Estética MD — HTML estático local

**Status atual:** ✅ Captura via Playwright file:// funciona. Aspect ratio
corrigido (16/10 → 3/2) em `lib/work/data.ts`.

### Quando re-capturar:
- Apenas se houver redesign do site (`/Downloads/site_estetica_md-main/`).
- Mobile (390×844) e desktop (1440×900) continuam servindo.

---

## Content Engine — sem screenshot atualmente

**Status:** `screenshot: null` em `lib/work/data.ts` — usa SVG diagram
(`squads`) como fallback.

### Quando criar screenshot:
- Quando houver UI visual (atualmente só rola via CLI + Telegram bot).
- Alternativa: print do Telegram bot em ação (aprovação humana), ou um
  terminal customizado mostrando logs em produção.
- Outra alternativa: Nano Banana Pro pra gerar visualização atmosférica
  "neural network of agents" como backdrop pro hero, mantendo diagram
  SVG sobreposto.

---

## Pipeline de conversão (manual via sharp)

Quando houver PNG novo na raiz:

```js
const sharp = require('sharp');
await sharp('source.png')
  // 3840 wide (era 2880): headroom pra 3x retina em Apple Pro Display XDR
  .resize(3840, null, { fit: 'inside', withoutEnlargement: true })
  // AVIF q80 + effort 9 (era q50): UI tem high-freq detail (texto, borders,
  // ícones). q50 introduz ringing visível ao redor de glyphs pequenos = aspecto
  // "pixelizado" mesmo em retina. q80 preserva crispness sem custo proibitivo.
  .avif({ quality: 80, effort: 9 })
  .toFile('public/work-screenshots/{slug}-{view}.avif');
await sharp('source.png')
  .resize(3840, null, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 92, effort: 6 })
  .toFile('public/work-screenshots/{slug}-{view}.webp');
```

Target: AVIF ~40-160KB, WebP ~80-220KB (era 25-70KB com q50 — vale o ganho
visual). Se hero LCP estourar 2.5s, reduzir resolução pra 2880 antes de mexer
em quality. Combinar SEMPRE com `quality={95}` no Next/Image (default 75 faz
2nd compression pass e re-introduz artefatos).

---

## Anti-patterns — nunca capturar:

- ❌ Empty states (`0`, `R$ 0,00`, "Sua agenda começa aqui", "Nenhum X")
- ❌ Login screens / auth flows (a menos que o auth flow SEJA o feature)
- ❌ Default macOS browser chrome com URL bar (use `frame="bare"` no
  MockupFrame quando o print já tem chrome próprio da UI)
- ❌ Lorem ipsum / `John Doe` / `test@test.com` (use nomes plausíveis)
- ❌ Datas no passado distante (use semana atual)
- ❌ Aspect ratio cortado/esticado (match o aspect nativo da captura)

---

Last updated: 2026-05-26
