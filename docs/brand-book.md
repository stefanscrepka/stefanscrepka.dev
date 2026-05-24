# STEFAN HEINZ SCREPKA
## Brand Book v1.0

*AI Product Engineer · Multi-Agent Systems in Production*

**Versão:** 1.0 — 2026-05-24
**Autor:** Stefan Heinz Screpka
**Status:** Aprovado para uso interno e externo
**Documento companheiro:** `dossie-de-marca.md` (estratégia, racional, território)

---

## SUMÁRIO

00. [Sobre este documento](#00--sobre-este-documento)
01. [A Marca](#01--a-marca)
02. [Logo System](#02--logo-system)
03. [Cor](#03--cor)
04. [Tipografia](#04--tipografia)
05. [Voz & Tom](#05--voz--tom)
06. [Aplicações](#06--aplicações)
07. [O que NÃO fazer](#07--o-que-não-fazer)
08. [Asset Manifest](#08--asset-manifest)
09. [Changelog](#09--changelog)

---

## 00 · SOBRE ESTE DOCUMENTO

Este Brand Book é o **manual de uso** da identidade visual e verbal da marca **Stefan Heinz Screpka**. Define como aplicar logo, cor, tipografia e tom em qualquer superfície — site, social, papelaria, slides, email signature.

**Para quem é:**
- Stefan, em qualquer momento de aplicação da marca
- Designers / parceiros contratados para extensão da identidade
- Recrutadores avaliando consistência da marca pessoal

**Para quem NÃO é:**
- Documento estratégico/racional → ver `dossie-de-marca.md` (13 seções, análise semiótica, territórios, decisões)
- Brief de novos projetos → derivar a partir deste documento

**Como usar:**
1. Buscar a seção relevante (logo, cor, etc.)
2. Aplicar **token exato** (não aproximação)
3. Quando em dúvida, conferir §07 (O que NÃO fazer)

**Source of truth:**
Toda especificação técnica neste documento espelha o código vivo em `app/globals.css` (tokens), `components/shared/sh-monogram.tsx` (mark), `Logos-Stefan/` (assets visuais). Em caso de divergência entre este doc e o código, **o código vence** — atualizar este doc.

---

## 01 · A MARCA

### 1.1 Essência (1 frase)

> **Engenharia de produto invisível por trás de inteligência visível.**

Stefan é quem constrói a estrutura que faz a IA funcionar como produto. Não é o pesquisador de modelo, não é o criador de prompt — é o engenheiro do sistema-produto inteiro.

### 1.2 Posicionamento (1 frase)

> **AI Product Engineer que entrega sistema multi-agente em produção — não consultor, não pesquisador, não criativo.**

### 1.3 Promessa implícita

> *"Eu construo sistemas que funcionam em produção, sem firula. O que você vê é o que eu entrego: clareza, disciplina, e infra que sustenta."*

### 1.4 Frase-núcleo da identidade

> **"Builds that run."**
> (PT: *"Sistemas que rodam em produção."*)

### 1.5 Tensão central

> **"Sou uma pessoa só, mas opero como sistema."**

Toda decisão visual e verbal vive nessa fronteira. Mark é monograma de PESSOA (SH) construído como SISTEMA (grid modular, single-glyph).

### 1.6 Arquétipos

| Posição | Arquétipo |
|---|---|
| Primário | **Maker** — pessoa que dá ferramentas/sistemas para outras pessoas fazerem |
| Secundário | **Sage** — autoridade silenciosa por conhecimento técnico profundo |

### 1.7 5 palavras-guia (toda decisão se mede contra essas)

1. **Precisão** — alinhamento óptico, hairline exata, tokens não aproximados
2. **Estrutura** — grid visível ou implícito, modular, repetível
3. **Densidade** — informação por pixel, não vazio decorativo
4. **Calma** — alta luminância só no acento, nunca no campo
5. **Assinatura** — sempre legível como pessoa Stefan, não como produto abstrato

### 1.8 5 palavras proibidas

| Palavra | Por quê |
|---|---|
| Encantamento | Mata tom maker/engineer |
| Disruptivo | Palavra-cadáver de startup |
| Mágico | Antagônico ao posicionamento |
| Bold/loud | Stefan é quieto |
| Friendly/playful | Não é a relação que ele quer com cliente B2B sério |

---

## 02 · LOGO SYSTEM

### 2.1 Mark primário

![Primary symbol — SH single-glyph monogram](Logos-Stefan/Primary.png)

O **monograma SH** é a marca. Construção single-glyph onde S e H se fundem por estrutura compartilhada. Um pequeno paralelogramo lime no canto inferior-direito representa o *signal point* — o "output" do sistema.

**Arquivo canônico:** `Logos-Stefan/Primary.png`

**Filosofia visual:** três camadas de leitura — primeira vista lê como UM glifo, segunda vista resolve em "SH", terceira vista revela o signal lime.

### 2.2 Lockups

#### 2.2.1 Lockup curto (Mark + STEFAN)

![Short lockup — mark + STEFAN](Logos-Stefan/Short_Lockup.png)

**Uso:** top-bar de navegação, email signature compacto, footer secundário, badges.

**Spec:**
- Mark: 32px de altura (mínimo) — 48px (preferido)
- Divisor vertical hairline `--color-hairline-strong`
- Wordmark: "STEFAN" em **Geist Sans Semibold (600)**, UPPERCASE, tracking +0.08em (`--tracking-wider`)

#### 2.2.2 Lockup completo (Mark + STEFAN HEINZ SCREPKA)

![Full lockup — mark + nome completo](Logos-Stefan/Full_Lockup.png)

**Uso:** página de contato, sobre, headers de documentos, capas formais.

**Spec:**
- Mark: 64px de altura mínima
- Wordmark em 3 linhas: STEFAN / HEINZ / SCREPKA
- **Geist Sans Semibold (600)**, UPPERCASE, tracking +0.08em
- Espaçamento mark↔wordmark: **0.75× altura do mark** (horizontal), **0.5× altura** (vertical)

#### 2.2.3 Lockup completo com tagline

![Full lockup with subtitle](Logos-Stefan/Full_Subtitle.png)

**Uso:** OG image, hero de apresentação, slide de capa, página "Sobre".

**Spec adicional:**
- Subtitle: `AI PRODUCT ENGINEER · MULTI-AGENT SYSTEMS IN PRODUCTION`
- **Geist Mono Medium (500)**, UPPERCASE, tracking +0.16em (`--tracking-widest`)
- Middle dot (·, U+00B7) como separador — **nunca usar pipe (|)**
- Cor: `--color-text-3` (`oklch(63% 0.005 130)`)

### 2.3 Variantes

#### 2.3.1 Avatar / Favicon

![Avatar — square container with mark](Logos-Stefan/Avatar-favicon.png)

**Uso:** LinkedIn, GitHub, X/Twitter, app icon, favicon high-res.

**Spec:**
- Container quadrado com cantos sutilmente arredondados (padrão iOS/Android app icon)
- Background: `--color-base` (`oklch(13%)`)
- Mark centralizado, 60% da largura do container
- Signal point lime mantido

#### 2.3.2 Outline version

![Outline version — hairline only](Logos-Stefan/Outline-version.png)

**Uso restrito:** hover states diferenciados, watermarks editoriais, overlays decorativos. **NÃO usar como avatar nem favicon** — fica magro demais em pequena escala.

#### 2.3.3 Filled version

![Filled version — solid mark](Logos-Stefan/Filled-version.png)

Idêntico ao Primary. Use quando precisar enfatizar que é a versão fill (vs outline).

### 2.4 Construção

![Construction grid — 8×8 modular](Logos-Stefan/Construction.png)

**Grid base:** 8×8 modular (cada célula = 1 unidade).

**Callouts da construção:**
- **Diagonal Flow** — conexão dinâmica S→H
- **Structural Core** — backbone vertical estável (H)
- **Signal Accent** — output/execution point (lime)

**Alinhamento:** óptico, NÃO matemático. S é ~2-3% mais alto que H para parecer da mesma altura (compensação de curva).

**Stroke uniforme:** todas as linhas têm a mesma espessura visual. Curvas do S são ~3% mais finas que retas do H para compensar massa óptica.

### 2.5 Clear space (área de exclusão)

![Clear space — 1H minimum on all sides](Logos-Stefan/Clear_space.png)

**Regra:** mínimo **1H** (altura da letra H do mark) em todas as 4 direções.

**Preferido:** 1.5H em digital, 2H em impresso.

**Por quê:** autoridade percebida correlaciona com espaçamento generoso, não com tamanho do mark. Logo apertada = startup amadora.

### 2.6 Tamanhos e redução

![Size test — 16, 32, 64, 128px](Logos-Stefan/Size-test.png)

| Tamanho | Uso | Variante recomendada |
|---|---|---|
| **16px** | Favicon legacy, tray icon | Variant simplificada (signal point colapsa) |
| **32px** | Browser tab, app icon small | Master (signal preserved) |
| **64px** | Top-bar nav, footer brand | Master |
| **128px** | OG image preview, social card | Master |
| **256-512px** | Hero, splash, brand boards | Master + ambient effects opcionais |

**Tamanho mínimo absoluto:**
- Mark isolado: **24px**
- Lockup horizontal: **96px de largura**
- Lockup com subtitle: **160px de largura**

---

## 03 · COR

### 3.1 Paleta canônica

| Papel | Token | OKLCH | HEX | Quando usar |
|---|---|---|---|---|
| **Dominante (60%)** | `--color-base` | `oklch(13% 0.005 130)` | `#0F1212` | Background principal, dark surfaces |
| **Secundária (30%)** | `--color-text-1` | `oklch(98% 0.005 130)` | `#F8F9F8` | Foreground principal, texto, mark |
| **Acento (10%)** | `--color-accent` (Lime A) | `oklch(94% 0.22 124)` | `#D2FF00` | CTAs, hover states, signal point, links ativos |
| Suporte | `--color-text-2` | `oklch(75% 0.005 130)` | `#B7B9B7` | Texto secundário, body reading |
| Suporte | `--color-text-3` | `oklch(63% 0.005 130)` | `#9A9C9A` | Microcopy, captions, taglines |
| Surface elevada | `--color-surface` | `oklch(18% 0.008 130)` | `#191D19` | Cards, painéis, modals |
| Surface deep | `--color-surface-deep` | `oklch(10% 0.005 130)` | `#0A0D0A` | Footer shelf, sections de fundo |
| Hairline | `--color-hairline` | `oklch(22% 0.010 130)` | `#1F2420` | Bordas, divisores sólidos |
| Hairline forte | `--color-hairline-strong` | `oklch(30% 0.010 130)` | `#2E342E` | Bordas em superfícies elevadas |

### 3.2 Aplicação 60/30/10

| Contexto | Dominante | Secundária | Acento |
|---|---|---|---|
| Landing page | 60% dark base | 30% off-white text/surface | 10% lime (acentos, CTAs, hover) |
| Logo sobre dark | 80% off-white | — | 20% lime (apenas no signal) |
| Logo sobre claro | 100% dark | — | 0% lime (ou opcional no signal) |
| Logo "hero" OG | 60% dark / 30% off-white / 10% lime |
| Avatar social | 100% off-white sobre dark | — | 0% lime (campo já ruidoso) |
| Favicon | 100% lime sobre dark | — | OU dark sobre lime (alert mode) |

### 3.3 Aplicação em fundo dark

![Dark background — business card mockup](Logos-Stefan/Dark-background.png)

**Spec:**
- Background: `--color-base` (`#0F1212`)
- Mark: `--color-text-1` (`#F8F9F8`)
- Wordmark: `--color-text-1`
- Tagline: `--color-text-3`
- Signal point: `--color-accent` (`#D2FF00`) preservado

### 3.4 Aplicação em fundo claro

![Light background — business card mockup](Logos-Stefan/Light-background.png)

**Spec:**
- Background: off-white (`#F8F9F8`) ou warm white (`#F5F2EC` aceitável)
- Mark: `--color-base` (`#0F1212`)
- Wordmark: `--color-base`
- Signal point: lime preservado (mesmo `#D2FF00`)

### 3.5 Acessibilidade

| Combinação | Razão | WCAG |
|---|---|---|
| `text-1` sobre `base` | 16.5:1 | AAA |
| `text-2` sobre `base` | 7.9:1 | AAA |
| `text-3` sobre `base` | 4.7:1 | AA |
| `accent` sobre `base` | 13.2:1 | AAA |

**Todas as combinações canônicas passam WCAG AAA.** Não há tradeoff de acessibilidade.

### 3.6 Cores PROIBIDAS

| Cor | Por quê |
|---|---|
| **Roxo / Magenta** | Categoria Linear, Stripe, Twitch |
| **Azul saturado** | Categoria SaaS B2B genérica |
| **Cyan / Ciano** | Categoria cyber-tech datada |
| **Vermelho saturado** | Categoria alerta, erro |
| **Amarelo neon (hue <100°)** | Pende pra amarelo warning; Lime A (hue 124°) é o limite |
| **Gradiente** | Categoria startup AI 2024 |
| **Glow excessivo** | Categoria gamer (>16px blur com alpha >0.4) |

### 3.7 5 regras absolutas pra usar Lime A

1. **Nunca preencher área grande com lime** — máximo 10% do mass visual da composição
2. **Nunca lime em texto longo** (>1 frase) — apenas CTAs, labels curtos, interação ativa
3. **Sempre acompanhado de dark base** (jamais lime sobre branco — vira semáforo)
4. **Stroke fino > área cheia** — hairline lime, borda lime, focus ring lime
5. **Quando lime aparece, deve "fazer algo"** — sinalizar interação, hover, ativo. Lime puramente decorativo perde poder.

---

## 04 · TIPOGRAFIA

### 4.1 Sistema canônico (3 famílias)

| Família | Uso | Carregamento |
|---|---|---|
| **Geist Sans** | Body, headlines, wordmark | `next/font/google` (`geist/font/sans`) |
| **Geist Mono** | Eyebrows, stats, microcopy, taglines | `next/font/google` (`geist/font/mono`) |
| **PP Editorial New Italic** | Acento serif único (1 palavra: "multi-agente" no hero) | `next/font/local` (`public/fonts/PPEditorialNew-Italic.otf`) |

**NÃO adicionar 4ª família** — sistema é Geist Sans + Geist Mono + PP Editorial Italic. Adicionar GT Sectra / Söhne / Tiempos = drift de identidade.

### 4.2 Hierarquia (Fluid Type Scale)

Escala 1.333 (perfect fourth), clamp 320→1920px.

| Token | Tamanho mín → máx | Line height | Letter spacing | Uso |
|---|---|---|---|---|
| `--text-2xs` | 11px | 1.5 | 0 | Eyebrows mono uppercase, chips, captions |
| `--text-xs` | 12 → 14px | 1.5 | 0 | Microcopy, footer links, metadata |
| `--text-sm` | 14 → 16px | 1.5 | 0 | Body small, form labels, ui text |
| `--text-base` | 16 → 18px | 1.6 | 0 | Body padrão, reading |
| `--text-lg` | 18 → 24px | 1.5 | -0.005em | Lead-in, intro |
| `--text-xl` | 24 → 32px | 1.3 | -0.01em | Subheadings |
| `--text-2xl` | 32 → 44px | 1.2 | -0.015em | H3 |
| `--text-3xl` | 44 → 60px | 1.1 | -0.02em | H2 |
| `--text-4xl` | 60 → 80px | 1.0 | -0.025em | H1 médio |
| `--text-5xl` | 80 → 108px | 0.95 | -0.025em | H1 grande |
| `--text-6xl` | 108 → 144px | 0.92 | -0.03em | Hero display |

### 4.3 Pesos disponíveis

| Família | Pesos ativos | Uso |
|---|---|---|
| Geist Sans | 400 (Regular), 500 (Medium), 600 (Semibold) | Body 400, links 500, headlines + wordmark 600 |
| Geist Mono | 500 (Medium) | Único peso usado — uniformidade nos eyebrows |
| PP Editorial New | 400 italic apenas | Uma palavra hero — nunca usar em outro lugar |

### 4.4 Tracking system

| Token | Valor | Uso |
|---|---|---|
| `--tracking-tighter` | -0.04em | Display brutalist (raríssimo) |
| `--tracking-tight` | -0.025em | Headlines (já default em h1/h2) |
| `--tracking-normal` | 0 | Body |
| `--tracking-wide` | 0.02em | Captions, contextual |
| `--tracking-wider` | 0.08em | **Wordmark uppercase** |
| `--tracking-widest` | 0.16em | **Eyebrows mono uppercase, taglines** |

### 4.5 OpenType features ativas (configuradas globalmente em `globals.css:461`)

| Feature | Efeito |
|---|---|
| `ss01` | Stylistic Set 1 — glyphs alternativos do Geist (diferenciação sutil) |
| `calt` | Contextual Alternates |
| `liga` | Ligatures padrão |
| `kern` | Kerning automático |
| `tnum` | Tabular numerals (em mono e em stats) — evita "7"/"1" com widths diferentes |
| `lnum` | Lining numerals (em `year-editorial` utility) |
| `dlig` | Discretionary ligatures (PP Editorial Italic) |

### 4.6 Utility classes canônicas (em `globals.css`)

| Class | Composição |
|---|---|
| `eyebrow` | Geist Mono Medium, UPPERCASE, 11px, tracking +0.16em, `text-3` color |
| `headline-display` | Geist Sans 600, tracking -0.025em, leading 0.95, `ss01 + calt + liga + kern` |
| `headline-editorial-accent` | PP Editorial Italic 400, `dlig + calt + kern` |
| `mono-stats` | Geist Mono, tabular-nums, `tnum + calt + zero` |
| `year-editorial` | Geist Mono, tabular + lining nums, `tnum + lnum + ss01 + calt + zero` |
| `text-reading` | 17px (Apple sweet spot), leading 1.55, tracking -0.003em |

### 4.7 Como evitar parecer genérico (mesmo usando Geist)

Geist é onipresente em portfolios técnicos. Diferenciação NÃO vem da família — vem do **tratamento**:

1. Tracking custom no wordmark (+0.08em) — não usar tracking 0
2. Casing decisão consistente (UPPERCASE wordmark + Title case mark microcopy)
3. **Kerning manual** em pares específicos: FA, AN, HE, EZ, SP de "STEFAN HEINZ SCREPKA"
4. OpenType `ss01` sempre ativo
5. Tabular nums em todo número (stats, datas, percentuais)

---

## 05 · VOZ & TOM

### 5.1 Personalidade da marca (5 traits)

1. **Disciplinado** — não acumula floreios, tudo serve
2. **Direto** — fala o que faz, não promete o que não entrega
3. **Engenheiro** — pensa em sistema antes de superfície
4. **Confiável** — "respondo em <12h" é assinatura, não copy
5. **Independente** — uma pessoa, não uma equipe; orgulhoso disso

### 5.2 Tom emocional

**Calmo, denso, intencional, levemente irônico.**

Não é entusiasta. Não é "vamos juntos transformar o futuro". É *"vou te entregar o que prometi, no prazo, rodando"*. O lime A é o único momento de intensidade visual — todo o resto vive em escala de cinza-verde.

### 5.3 Vocabulário recorrente (autêntico, usar)

| Categoria | Termos |
|---|---|
| Sistema | squads, multi-agente, orquestração, pipeline, runtime, anti-slop validator |
| Volume | 22 agentes, 5 squads, 100 testes, 162 testes runtime, 24/7 |
| Stack | Claude SDK, Next 16, TypeScript, pgvector RAG, Postgres, Drizzle, Inngest, BullMQ |
| Produção | "em produção", "rodando", "cron 24/7", "deploy", "multi-tenant", "circuit breaker" |
| Pessoal | "construo", "entrego", "≤10 min/dia humano", "1 pessoa" |
| Localidade | Ponta Grossa, Paraná, BR — não esconder |

### 5.4 Frases canônicas (já em uso, manter)

| Frase | Contexto | Arquivo |
|---|---|---|
| "Construo IA multi-agente em produção — e o produto inteiro ao redor dela." | Hero principal | `components/sections/hero.tsx:117` |
| "AI Product Engineer · Claude SDK + Next 16 + TypeScript · três produtos rodando 24/7." | Subhead hero | `components/sections/hero.tsx:122` |
| "Três produtos. Três posturas." | H2 Featured Work | `components/sections/featured-work.tsx` |
| "Se não funciona 24/7, não conta." | Closing footer | `components/sections/footer.tsx:151` |
| "Tem algo complexo demais pra virar landing genérica?" | Contact headline | `components/sections/contact.tsx` |
| "Respondo em <12h" | Nav subtitle | `app/layout.tsx:47` |

### 5.5 O que dizer / o que NÃO dizer

| ✅ Dizer | ❌ Não dizer |
|---|---|
| "Construo X em produção" | "Vou ajudar você a construir X" |
| "22 agentes Claude SDK em 5 squads" | "Tecnologia de ponta com IA disruptiva" |
| "Substitui equipe de 4-6 pessoas" | "Aumenta produtividade da sua equipe" |
| "Stack: Claude + Next 16 + TypeScript" | "Soluções modernas para seu negócio" |
| "Se não funciona 24/7, não conta" | "Garantimos qualidade e excelência" |
| "Respondo em <12h" | "Atendimento 24 horas" |
| "Ponta Grossa, Paraná · disponível" | "Operação global" |

### 5.6 Glifo ornamental ✺

O glifo `✺` (Heavy Eight Teardrop-Spoked Asterisk, U+2735) é **decoração ornamental autoral** de Stefan. **NÃO é parte da marca/logo.** Aparece em 2 contextos:

1. Footer manifesto: `Se não funciona 24/7, não conta. — stefan ✺` (`components/sections/footer.tsx:154`)
2. Easter egg console: console.log de boas-vindas a devs que abrem DevTools (`app/layout.tsx:171`)

**NÃO usar `✺` como avatar, logo, favicon ou em qualquer aplicação visual de marca.** É assinatura textual, não símbolo.

---

## 06 · APLICAÇÕES

### 6.1 Website header

![Website header — desktop layout](Logos-Stefan/Website-header.png)

**Spec:**
- Container fixed top, altura 56px (mobile) / 64px (desktop)
- Background: `--color-base` com 85% opacity + `backdrop-blur-md`
- Border-bottom: `--color-hairline-strong`
- Z-index: 50
- Layout 3-up: brand (esquerda) · nav (centro) · spacer (direita)
- Mark size: 28px
- Wordmark: `STEFAN` apenas (lockup curto)
- Nav items: Work · Process · Manifesto · Contato

**Implementação:** `components/ui-effects/top-bar-nav.tsx`

### 6.2 Avatar / favicon

![Avatar/favicon — square container](Logos-Stefan/Avatar-favicon.png)

**Spec:**
- Container: 1024×1024 quadrado com `rx="192"` (rounded ~18.75%)
- Background: `#0F1212` (dark base)
- Mark: `#F8F9F8` (off-white) centralizado, ~60% width
- Signal point: `#D2FF00` lime preservado

**Implementação:** `public/icons/icon.svg`

**Variantes a gerar:**
- `favicon.ico` (multi-resolução: 16, 32, 48)
- `apple-touch-icon.png` (180×180)
- PWA maskable (192, 512)

### 6.3 Social media (X/Twitter, LinkedIn)

![Social media — X profile mockup](Logos-Stefan/Social-media.png)

**Spec:**
- Profile pic: usar `Avatar-favicon.png` (1024×1024)
- Verified checkmark: lime A (`#D2FF00`) se aplicável
- Display name: "Stefan Heinz Screpka"
- Bio: "AI Product Engineer · Multi-Agent Systems in Production"
- Handle: `@stefan.screpka` (ou variante disponível)
- Link: `stefan.screpka.com` ou `stefanscrepka.dev`

**Cover image (opcional):** 1500×500, usar `Logos-Stefan/Brand-book.png` recortado ou criar nova com mark grande + tagline.

### 6.4 Business card

#### Dark background (preferido)

![Business card — dark background](Logos-Stefan/Dark-background.png)

**Spec:**
- 85×55mm (padrão brasileiro)
- Background: `#0F1212` (dark base)
- Front:
  - Mark esquerda, 16mm
  - Nome: "STEFAN HEINZ SCREPKA" — Geist Sans Semibold 14pt
  - Tagline: "AI PRODUCT ENGINEER" — Geist Mono Medium 8pt, tracking +0.16em
  - Tagline 2: "MULTI-AGENT SYSTEMS IN PRODUCTION" — Geist Mono Medium 7pt
  - Email: `stefan@screpka.com` — Geist Mono Medium 8pt, lime A no `@`
- Back: mark gigante centralizado, signal lime
- Acabamento sugerido: papel coated mate 350g, hot-stamping lime A no signal point (premium)

#### Light background

![Business card — light background](Logos-Stefan/Light-background.png)

**Spec:**
- Background: `#F8F9F8` (off-white)
- Mark + texto: `#0F1212` (dark base)
- Signal point: lime preservado
- Resto idêntico ao dark

### 6.5 Brand board consolidado (referência)

![Complete brand board](Logos-Stefan/Brand-book.png)

Visão geral de TODAS as variantes do sistema visual em um único board. Útil para:
- Onboarding de designer/parceiro
- Apresentação de marca a cliente
- OG image alternativa

---

## 07 · O QUE NÃO FAZER

### 7.1 Mark

| ❌ Não fazer | Por quê |
|---|---|
| Mudar proporções do mark | Construção é sobre grid 8×8 fixo |
| Trocar o signal lime por outra cor | Lime é assinatura — cor é parte da marca |
| Adicionar gradiente ao mark | Mata categoria "técnica calma" |
| Adicionar shadow externo ou glow >0.4 alpha | Vira gamer aesthetic |
| Usar mark italic / rotacionado de forma decorativa | Mark é upright sempre |
| Adicionar `®`, `™`, `©` visíveis no mark | Vira amador (vide §1.2 do dossiê) |
| Esticar / comprimir non-uniformly | Quebra alinhamento óptico |
| Usar outline em avatar/favicon | Magro demais em pequena escala |
| Inverter mark (off-white sobre lime grande) | Lime nunca preenche área grande |

### 7.2 Cor

| ❌ Não fazer | Por quê |
|---|---|
| Aproximar HEX em vez de usar OKLCH | Token é absoluto, aproximação derrapa |
| Lime sobre branco puro | Vira semáforo |
| Usar 2+ cores de acento simultaneamente | Lime é única — sub-accent amber só em `/work/estetica-md` |
| Lime em parágrafos de texto | Mata legibilidade + perde poder do acento |
| Roxo, magenta, cyan, vermelho saturado, gradiente | Categoria errada (vide §3.6) |
| Lime alpha > 0.4 em glow | Vira gamer |

### 7.3 Tipografia

| ❌ Não fazer | Por quê |
|---|---|
| Usar GT Sectra, Söhne, Tiempos, Druk | Drift do sistema (Geist + PP Editorial é canônico) |
| Comic Sans, Arial, Helvetica clássico | Categoria errada |
| Tracking 0 no wordmark | Wordmark precisa de +0.08em (`--tracking-wider`) |
| Italic generalizado | Italic é exclusivo do PP Editorial em UM momento hero |
| Mais de 3 pesos diferentes na mesma tela | Quebra hierarquia |
| Light weight (300) | Sumiu do sistema, não usar |
| Bold weight (700+) | Limite é 600 (Semibold) — mais que isso = display agressivo |

### 7.4 Voz

| ❌ Não fazer | Por quê |
|---|---|
| "Vamos transformar o futuro" | Genérico, hollow |
| "Tecnologia de ponta", "Inovação disruptiva" | Cadáver de startup |
| "Soluções customizadas para o seu negócio" | Categoria consultoria |
| "Powered by AI" | Cliché |
| Emojis em copy formal | Não é o tom (exceções: meta tags, social) |
| Frases > 25 palavras | Stefan é direto |
| Esconder localidade (Ponta Grossa, BR) | É parte da assinatura |

### 7.5 ✺ ornamental

| ❌ Não fazer | Por quê |
|---|---|
| Usar ✺ como logo | ✺ é decoração, não marca (vide §5.6) |
| Usar ✺ como avatar / favicon | Mark é SH |
| Aplicar ✺ em peças de marketing formal | Limita-se a footer + console easter egg |

---

## 08 · ASSET MANIFEST

### 8.1 Logos (raster, em `Logos-Stefan/`)

| Arquivo | Resolução | Uso |
|---|---|---|
| `Primary.png` | ~1024² | Mark master, source de truth visual |
| `Filled-version.png` | ~1024² | Idêntico ao Primary (label "filled") |
| `Outline-version.png` | ~1024² | Variant uso restrito (hover, watermark) |
| `Avatar-favicon.png` | ~1024² | Container quadrado dark com mark |
| `Short_Lockup.png` | wide | Mark + STEFAN |
| `Full_Lockup.png` | wide | Mark + STEFAN HEINZ SCREPKA |
| `Full_Subtitle.png` | wide | Lockup completo + tagline |
| `Construction.png` | wide | Grid 8×8 + callouts |
| `Clear_space.png` | wide | Demonstração 1H exclusion zone |
| `Size-test.png` | wide | 16/32/64/128px stack |
| `Dark-background.png` | wide | Mockup business card dark |
| `Light-background.png` | wide | Mockup business card light |
| `Website-header.png` | wide | Mockup header desktop |
| `Social-media.png` | wide | Mockup X/Twitter profile |
| `Brand-book.png` | square | Board consolidado todas as variantes |

### 8.2 Logos (vetor)

| Arquivo | Notas |
|---|---|
| `Primary.svg` (raiz) | Output bruto do Vectorizer.ai — tem viewBox 1254×1254 e inclui label "01. PRIMARY SYMBOL" + frame |
| `mark-isolado.svg` (raiz) | Versão limpa após crop do PNG isolado, viewBox 1024×1024, 2 cores agrupadas |

**Estado de vetorização:** ambos são intermediários gerados em sessão de iteração. Pra uso em produção, precisam ser sanitizados (trocar cores hardcoded por `currentColor` + CSS var, remover DOCTYPE/metadata, normalizar viewBox).

### 8.3 Ícones de produto

| Arquivo | Resolução | Uso |
|---|---|---|
| `public/icons/icon.svg` | 512×512 (placeholder atual) | Substituir por mark v3 com container dark rounded |

### 8.4 Referências curadas

| Pasta | Conteúdo |
|---|---|
| `Referencias-logo/` | 11 logos de inspiração inicial (geométricas, monogramas, golden ratio constructions) |
| `screenshots-lando-ontrack/` | Screenshots + metadata do `landonorris.com/on-track` (estudo do efeito helmet 3D scroll-driven) |
| `screenshots-helmet-deep/` | Frames adicionais do scroll progress 0→22% do Lando |
| `screenshots-tour/` | Tour de outros sites de referência |

### 8.5 Tokens vivos no código

| Arquivo | O que define |
|---|---|
| `app/globals.css` | Tokens OKLCH completos: surfaces, accent, text, hairlines, fonts, sizes, tracking, leading, breakpoints, radii, shadows, easings, motion durations |
| `components/shared/sh-monogram.tsx` | Componente React do mark — single source of truth visual |
| `app/layout.tsx` | Metadata SEO + schema.org JSON-LD com `knowsAbout`, `address`, `sameAs` |

### 8.6 Fontes

| Arquivo | Fonte |
|---|---|
| `next/font/google` (auto-fetched) | Geist Sans (400, 500, 600) + Geist Mono (500) |
| `public/fonts/PPEditorialNew-Italic.otf` | PP Editorial New Italic 400 (Pangram Pangram EULA "Free for personal use") |
| (Synthetic fallback em `globals.css`) | "PPEditorial Fallback" — Georgia Italic com `size-adjust 105%`, `ascent-override 92%`, `descent-override 25%` |

---

## 09 · CHANGELOG

### v1.0 — 2026-05-24

**Initial release.** Brand book completo derivado de `dossie-de-marca.md` (estratégia) + assets aprovados em `Logos-Stefan/`. 

**Inclui:**
- 9 seções (essência → asset manifest)
- 15 PNGs referenciados via markdown image
- Tokens OKLCH/HEX/HSL completos com paths para `globals.css`
- Voz canônica com frases de origem (`hero.tsx:117`, `footer.tsx:154`, etc.)
- O que NÃO fazer (5.7 categorias)

**Pendente para v1.1 (não-bloqueante):**
- SVGs sanitizados em `public/brand/` (substituir intermediários da raiz)
- Favicon multi-resolução (16/32/192/512) via realfavicongenerator.net
- OG image 1200×630 com lockup hero (gerar em `app/opengraph-image.tsx`)
- PDF version deste brand book pra envio externo
- Versão EN deste brand book pra recrutadores globais

---

## CONTATO

**Stefan Heinz Screpka**
AI Product Engineer · Multi-Agent Systems in Production
Ponta Grossa, Paraná · BR

- 📧 stefan@screpka.com
- 💼 [LinkedIn](https://www.linkedin.com/in/stefan-heinz-screpka-323ab9242/)
- 💻 [GitHub](https://github.com/stefanscrepka)
- 🌐 [stefanscrepka.dev](https://stefanscrepka.dev)
- 📱 wa.me/5542998592522

---

**Fim do Brand Book v1.0.**
*Para o documento estratégico companheiro com racional completo (semiótica, territórios, psicologia visual, benchmarks), ver `dossie-de-marca.md`.*
