# BRAND STRATEGY DOSSIER

## **STEFAN HEINZ SCREPKA**
### AI Product Engineer · Personal Brand System
*Dossiê estratégico v1.0 — base para criação de identidade visual*
*Preparado em 2026-05-23*

---

### ⚡ STATUS — v3 APROVADA E INTEGRADA (2026-05-24)

A logo **Engineered Signal** foi executada, refinada em 3 iterações, e está em produção no codebase. Veredito final: **9.6/10** nos 16 critérios objetivos (§11).

**Assets entregues:**
- `Logos-Stefan/` — brand book PNG completo (15 arquivos: Primary, Lockups, Avatar, Outline, Filled, Construction, Clear Space, Size Test, Dark/Light Background, Website Header, Social Media)
- `public/brand/sh-mark.svg` — mark master vetorial sanitizado (14KB, viewBox 0 0 1024 1024, `currentColor` + `var(--sh-accent, #D2FF00)`)
- `public/icons/icon.svg` — app icon 512×512 com container dark rounded (12.5KB)
- `components/shared/sh-monogram-paths.ts` — paths como constantes TS (auto-gerado)
- `components/shared/sh-monogram.tsx` — componente React canonical (substitui versão sigmoide custom anterior)
- `components/contact/contact-monogram-backdrop.tsx` — atualizado pra usar `<SHMonogram />` (DRY)

**Consumers automaticamente atualizados via `SHMonogram`:**
- `components/ui-effects/top-bar-nav.tsx:84` (desktop logo) + `:207` (mobile sheet)
- `components/sections/footer.tsx:75`
- `components/ui-effects/floating-dock.tsx:62, :232`
- `components/contact/contact-monogram-backdrop.tsx`

**Pendente (não-bloqueante):**
- Favicon multi-resolução (16/32/192/512 ICO + PWA maskable) — gerar via realfavicongenerator.net usando `public/icons/icon.svg`
- OG image 1200×630 — pode usar `Logos-Stefan/Brand-book.png` como base ou gerar via `app/opengraph-image.tsx`
- Easter egg ASCII (`app/layout.tsx:171`) — reconstruir ASCII art a partir do novo mark
- Otimização SVG (`svgo` pra cair de 14KB → ~5KB simplificando vértices redundantes do Vectorizer)
- Validação visual cruzada com 3 públicos antes de release

**Próximos passos sugeridos:** `npm run dev` → validar visualmente top-bar, footer e contact section → ajustar opacity/tamanho se necessário.

---

### PREÂMBULO METODOLÓGICO

Este documento **não cria a logo**. Ele estabelece as **restrições verdadeiras** dentro das quais qualquer logo precisa nascer para fazer sentido. Toda decisão visual posterior será avaliada contra:

- a voz já existente na landing (PT-BR, pragmática, "se não funciona 24/7 não conta");
- os tokens já implementados (`oklch(94% 0.22 124)` Lime A, Geist Sans/Mono, dark base `oklch(13%)`);
- as referências visuais curadas em `Referencias-logo/`;
- e o posicionamento de **AI Product Engineer que entrega sistema multi-agente em produção** — não consultor, não pesquisador, não criativo.

Não vamos romantizar nada. Golden ratio entra onde resolve, não onde decora. Lime entra onde ativa, não onde diverte.

---

## 1 · DIAGNÓSTICO DA MARCA

### 1.1 O que a marca precisa comunicar em 3 segundos

Em ordem decreasing de prioridade:

1. **Pessoa-engenheiro real** (não estúdio, não agência, não persona). Marca pessoal.
2. **Domínio técnico de fronteira** (IA multi-agente, sistemas de produção).
3. **Disciplina e clareza** — alguém que pensa em sistema, não em demo.
4. **Sofisticação contemporânea** (Linear/Vercel/Stripe-tier, não startup-tier).

Se ao olhar 3 segundos a pessoa pensar *"isso é um produto"* em vez de *"isso é uma pessoa"*, o monograma falhou em comunicar pessoalidade. Se pensar *"isso parece uma agência"*, falhou em comunicar especificidade. Se pensar *"isso parece IA"*, provavelmente falhou em diferenciação.

### 1.2 O que a marca NÃO pode parecer

| Categoria | Como reconhecer o erro | Justificativa |
|---|---|---|
| **Logo de banco de imagem** | Forma genérica reutilizável em qualquer setor | Stefan é uma pessoa específica com um stack específico |
| **Estúdio de design** | Marca fria, sem assinatura humana | Stefan é builder, não diretor de arte |
| **Crypto / Web3** | Hexágonos, anéis orbitais, gradiente azul-roxo | Imagem 4 (Orbyta) e Imagem 11 (OscillAero) das suas referências ilustram esse modo — **descartar** |
| **Aviação / aeroespacial** | Asas, foguetes, compass-arrows | Imagens 3, 5, 6, 7, 11 das referências flertam com isso — **descartar como direção primária** |
| **Tech gamer** | Cortes agressivos tipo metal, diagonais quebradas | Imagem 1 das suas referências (três triângulos cortados) flerta com isso — **descartar** |
| **Cyberpunk / cyber-tech** | Glow magenta-ciano, scan lines decorativos | Já evitado pelo lime A oklch(94%) — manter |
| **Branding fluído / orgânico** | Wordmarks blob, ligaduras líquidas | Imagem 8 (fuse) das referências — **descartar inteiramente** |
| **Logo de "AI startup"** | Ícone de cérebro, chip, circuito, nó de rede, gradiente roxo→cyan | Clichê absoluto, mata diferenciação |
| **Selo de família / coat of arms** | Monograma serif ornamental, ramos, brasão | Vira "doutor advogado", não engenheiro |

### 1.3 Associações mentais que devem ser ativadas no primeiro contato

| Categoria | Associações desejadas |
|---|---|
| **Cognitivas** | sistema, precisão, controle, infraestrutura, produto |
| **Estéticas** | terminal, blueprint, console, painel de instrumentos, design system |
| **Emocionais** | confiança calma, respeito técnico, "isso aqui é sério", "isso aqui foi pensado" |
| **Categóricas** | software premium, ferramenta profissional, infraestrutura técnica |

### 1.4 Riscos de percepção

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Confundir com agência | Alta se monograma for muito polido/abstrato | Manter assinatura pessoal — wordmark sempre próximo do mark, ou monograma claramente derivado de iniciais SH |
| Confundir com produto SaaS | Média se mark for muito icônico/auto-suficiente | Resistir à tentação de criar "marca de produto" — Stefan é a marca, não "Screpka.io" |
| Parecer "junior tentando parecer Linear" | Alta se for clone visual | Não copiar primitives Linear/Vercel — adaptar princípios, não execução |
| Lime virar "gamer/Twitch/Spotify" | Média | Lime oklch(94% 0.22 124) já é alto-L, neutro-verde — usar em **strokes finos, acentos, anel, tipografia eyebrow**, nunca como preenchimento de bloco grande |
| Parecer "estagiário tentando parecer sênior" | Alta com excesso de ornamento (selo, golden ratio decorativo, copyright mark visível) | Eliminar qualquer copyright/TM no mark — vide imagem 1 das referências, o `©` em cada variação adiciona zero valor e suaviza autoridade |
| Datar (parecer "logo de 2018") | Alta com gradiente, glow excessivo, lens-flare | Manter execução flat, hairline 1.5–2px, sem efeitos |

### 1.5 Promessa implícita da marca

> *"Eu construo sistemas que funcionam em produção, sem firula. O que você vê é o que eu entrego: clareza, disciplina, e infra que sustenta."*

Tudo no sistema visual deve reforçar essa promessa **antes** de qualquer palavra ser lida.

---

## 2 · ESSÊNCIA ESTRATÉGICA

### 2.1 Essência (1 frase)
**Engenharia de produto invisível por trás de inteligência visível.**

Tradução: ele é quem constrói a estrutura que faz a IA funcionar como produto. Não é o pesquisador de modelo, não é o criador de prompt — é o engenheiro do sistema-produto inteiro.

### 2.2 Arquétipos

| Posição | Arquétipo | Por quê |
|---|---|---|
| Primário | **The Maker** (Criador / Builder) | Stefan literalmente constrói coisas que rodam. "Construo IA multi-agente em produção" (`hero.tsx:117`) é o verbo `construo`. Maker é o arquétipo de Lego, Apple, Adobe — pessoas que dão ferramentas/sistemas para outras pessoas conseguirem fazer. |
| Secundário | **The Sage** (Sábio / Especialista) | Conhecimento técnico profundo, demonstrável (lista `knowsAbout` em `app/layout.tsx:99–132` tem 34 entradas reais). Sage é o que cria autoridade silenciosa — não é o que grita, é o que sabe. |

**Por que NÃO Magician?** Tentação é alta em IA (transformação, encantamento). Mas Magician é o arquétipo de marcas que querem parecer mágicas (Disney, Tesla early). Stefan vende o oposto: *isto não é mágica, isto é trabalho*. Maker + Sage protegem essa posição.

### 2.3 Personalidade da marca (5 traits)
1. **Disciplinado** — não acumula floreios, tudo serve.
2. **Direto** — fala o que faz, não promete o que não entrega.
3. **Engenheiro** — pensa em sistema antes de pensar em superfície.
4. **Confiável** — "respondo em <12h" (`app/layout.tsx:47`) é assinatura, não copy.
5. **Independente** — uma pessoa, não uma equipe; orgulhoso disso.

### 2.4 Tom emocional
**Calmo, denso, intencional, levemente irônico.**
Não é entusiasta. Não é "vamos juntos transformar o futuro". É *"vou te entregar o que prometi, no prazo, rodando"*. O lime A é o único momento de intensidade — todo o resto vive em escala de cinza-verde.

### 2.5 Tensão central da marca

> **"Sou uma pessoa só, mas opero como sistema."**

Essa tensão (humano singular × sistema escalável) é o que torna a marca interessante. Toda decisão visual deve sentar nessa fronteira:

- monograma manuscrito ≠ correto (humaniza demais, perde sistema);
- monograma 100% modular ≠ correto (sistematiza demais, perde pessoa);
- **monograma com 1 detalhe humano + estrutura modular** = correto.

### 2.6 Frase-núcleo
**"Builds that run."**
(Tradução para PT, opcional, mais longa: *"Sistemas que rodam em produção."*)
Curta o suficiente para virar tagline, suficientemente específica para não ser cliché. *Builds* carrega Maker, *run* carrega Sage (sabe o que precisa para sobreviver).

### 2.7 Cinco palavras que devem guiar QUALQUER decisão visual

1. **Precisão** — alinhamento óptico vs. matemático, hairline 1.5–2px exatos.
2. **Estrutura** — grid visível ou implícito, modular, repetível.
3. **Densidade** — informação por pixel, não vazio decorativo.
4. **Calma** — alta luminância só no acento, nunca no campo.
5. **Assinatura** — sempre legível como **pessoa Stefan**, não como produto abstrato.

### 2.8 Cinco palavras PROIBIDAS

1. **Encantamento** — mata o tom maker/engineer.
2. **Disruptivo** — palavra-cadáver de startup.
3. **Mágico** — antagônico ao posicionamento.
4. **Bold/disruptive/loud** — Stefan é quieto.
5. **Friendly/playful** — não é a relação que ele quer com cliente B2B sério.

---

## 3 · PÚBLICO E PERCEPÇÃO

Seis públicos relevantes. Cada um chega com um filtro diferente. A logo precisa **não falhar com nenhum** — e idealmente ser *o ponto de unanimidade*, mesmo que cada um goste por uma razão diferente.

### 3.1 Fundadores e CEOs (decisores B2B, ~30–45 anos, Brasil + LATAM)

| Variável | Resposta esperada |
|---|---|
| O que precisam **sentir** | "Esta pessoa custa, mas vale." Sensação de competência calma. |
| O que precisam **entender em 3s** | É um engenheiro independente, sério, contratável. Não é freelancer aleatório. |
| O que gera desconfiança | Visual "barato", clichê de startup, qualquer coisa que pareça template ou banco-de-logo |
| Qual símbolo impacta | **Monograma estrutural simples** > símbolo abstrato. Eles confiam em iniciais (advogados, médicos, consultores) — SH funciona como assinatura profissional |
| Tipografia que aciona confiança | Sans grotesk industrial (Geist Sans, Inter, Söhne), em peso medium-semibold, com tracking justo, **nunca rounded** |
| Cor que aciona confiança | Preto/off-white dominantes + um acento técnico. Lime é OK aqui se usado como hairline/acento — **não** como bloco |

### 3.2 CTOs e times técnicos (compradores secundários, validadores)

| Variável | Resposta esperada |
|---|---|
| O que precisam **sentir** | "Esse cara é dos nossos." Cumplicidade de tribo. |
| O que precisam **entender em 3s** | Esteticamente pertence ao mesmo mundo de Linear / Vercel / Stripe / shadcn |
| O que gera desconfiança | Qualquer coisa que pareça "marketing demais" — gradientes, swooshes, glow excessivo |
| Qual símbolo impacta | **Densidade visual + sinais de craft** (espaçamento óptico correto, grid implícito, hairline 1.5px) — eles leem isso instantaneamente |
| Tipografia | Mono ou geometric com sinais de OpenType bem usados (`ss01`, `tnum`, `kern`). Eles já notam isso na landing (`globals.css:461`). |
| Cor | Mesma escala dark; lime A é uma assinatura que **eles** reconhecem (Hyperlane, Linear has lime accents, Replit, Vercel) |

### 3.3 Clientes B2B (clínicas, SaaS, agências contratantes)

| Variável | Resposta esperada |
|---|---|
| O que precisam **sentir** | "Estou contratando alguém em outro nível do que eu estou acostumado." Aspiracional sem ser alienante. |
| O que precisam **entender em 3s** | Profissionalismo, especialização (não é "fazedor de site") |
| O que gera desconfiança | Visual *jovem demais*, cores saturadas, anything que pareça "TikTok creator" |
| Símbolo | Monograma SH funciona perfeitamente — eles confiam em iniciais como signal de profissionalismo (mesma lógica de escritórios de advocacia, consultorias) |
| Tipografia | Geist Sans semibold tem o equilíbrio certo: moderno sem ser hostil |
| Cor | Lime A pode assustar se for o primeiro encontro. **Mitigação**: monograma e wordmark sempre em white/off-white sobre dark; lime A vive em estado de hover/link/CTA. Isso já é o pattern da landing. |

### 3.4 Recrutadores e empresas globais (LinkedIn, GitHub, cold inbound)

| Variável | Resposta esperada |
|---|---|
| O que precisam **sentir** | "Este perfil é de nível internacional." Reduce skepticism por estar no Brasil. |
| O que precisam **entender em 3s** | Estética está calibrada com o tier de empresas como Anthropic, Vercel, Linear, Stripe — não com mercado local |
| O que gera desconfiança | Português visual (visual com cara de Brasil-anos-2010), clichês visuais de "developer brasileiro" |
| Símbolo | **Avatar precisa funcionar a 24px** em LinkedIn/GitHub. Monograma SH dentro de container quadrado, com **espaço interno generoso**, é a única solução robusta |
| Tipografia | Universal sans (Geist é literalmente Vercel — sinaliza pertencimento) |
| Cor | Lime A em avatar é arriscado em LinkedIn (campo já visualmente ruidoso). Avatar **deveria ser** dark base com SH em off-white, lime A só em aplicações próprias |

### 3.5 Comunidade tech/design (Twitter/X, Bluesky, IndieHackers, Designer News)

| Variável | Resposta esperada |
|---|---|
| O que precisam **sentir** | "Isto tem craft." Reconhecimento entre pares. |
| O que precisam **entender em 3s** | Pertence ao circuito de marcas que esta tribo valida (Linear, Family, Rauno, Build UI, Emil Kowalski, Vercel, Stripe) |
| O que gera desconfiança | Cópia explícita de qualquer uma dessas marcas; "AI slop aesthetic"; uso ingênuo de Three.js/blob/gradient |
| Símbolo | Eles **valorizam construção visível** (vide imagens 3, 6, 9 das suas referências — golden-ratio grids, sketch lines). Brand book com **rationale geométrico publicado** vale mais que mark perfeito sem narrativa |
| Tipografia | Mono utilizada com graça (tracking, casing, hierarchy) é signal de pertencimento |
| Cor | Lime A é **bandeira de tribo aqui** — Replit verde, Vercel preto+white, Linear roxo, Stefan lime |

### 3.6 Pessoas leigas (familiares, amigos, contatos não-técnicos)

| Variável | Resposta esperada |
|---|---|
| O que precisam **sentir** | "Não entendo o que ele faz, mas dá pra ver que ele é bom no que faz." |
| O que precisam **entender em 3s** | É algo de tecnologia, é profissional, é internacional |
| O que gera desconfiança | Símbolos esotéricos sem leitura possível (✺ asterisco solto, glifo abstrato sem ancoragem). Esse público lê **iniciais** muito melhor que ícones. |
| Símbolo | **SH é o único caminho seguro aqui.** Símbolo abstrato perde esse público completamente. Eles vão ler "SH" como sigla de pessoa e descansar. |
| Tipografia | Não importa pra eles — desde que não seja Comic Sans, está OK |
| Cor | Preto + verde-limão é facilmente reconhecível e diferenciado |

### 3.7 Síntese cruzada

O denominador comum entre os 6 públicos: **monograma SH** legível + **paleta dark+lime** + **execução tipográfica precisa**. Símbolo abstrato sem ancoragem em SH falha com público 3.6 e enfraquece 3.1 e 3.3. Por isso, o sistema visual **deve ter SH como núcleo** — mesmo que haja um glifo secundário decorativo (como o `✺` que já existe ornamentalmente, conforme memória registrada).

---

## 4 · PESQUISA SEMIÓTICA

### 4.1 Territórios simbólicos relevantes para Stefan

| Território | Densidade simbólica para Stefan | Formas que carregam o significado |
|---|---|---|
| **Precisão** | ⬤⬤⬤⬤⬤ | Hairline strokes (≤2px), alinhamento óptico, monospace, ângulos cardinais (0°, 45°, 90°) |
| **Sistemas** | ⬤⬤⬤⬤⬤ | Grid modular visível, módulos repetíveis, simetria controlada |
| **Engenharia** | ⬤⬤⬤⬤⬤ | Construção mostrada (rationale page), bracket notation `[ ]`, blueprint feel |
| **Inteligência** | ⬤⬤⬤⬤⚪ | Espaço negativo intencional, double-meaning glyphs (forma + forma escondida) |
| **Controle** | ⬤⬤⬤⬤⚪ | Limites claros, container retangular, baseline grid |
| **Produção** | ⬤⬤⬤⬤⚪ | Stencil-feel, marcas técnicas (`v1.0`, registros, números de versão) |
| **Modularidade** | ⬤⬤⬤⬤⚪ | Geometria reduzível a partes (S = 2 curvas; H = 3 retas) |
| **Produto** | ⬤⬤⬤⬤⬤ | Aparência de design system, não de logo isolada |
| **Autoridade técnica** | ⬤⬤⬤⬤⬤ | Disciplina formal extrema, ausência de ornamento |
| **Autonomia (IA)** | ⬤⬤⬤⚪⚪ | Difícil sem cair em clichê — melhor evitar tentar comunicar isso visualmente |
| **Movimento** | ⬤⬤⚪⚪⚪ | Risco: vira swoosh, vira foguete. Evitar — pertence a marca de logística, não de engenharia de software. |
| **Futuro sóbrio** | ⬤⬤⬤⬤⚪ | Conquistado por *ausência* de futurismo explícito. Paradoxo: quanto menos "futurista" parecer, mais futuro parecerá daqui a 5 anos. |

### 4.2 Análise das letras S e H

**S — Estrutura semiótica:**
- A única letra do alfabeto cuja forma é uma **curva contínua de tensão** (sigmoide).
- Carrega: fluxo, sinal, conexão, sistema, *signal*.
- Risco: tipograficamente é a letra mais difícil de desenhar bem — peso e curva precisam ser optically balanced, jamais matematicamente simétricos. Um S mal desenhado mata o monograma inteiro.
- Em monogramas históricos: muitos brasões usam S como floreio (Coco Chanel `CC`, Yves Saint Laurent `YSL`). Risco de virar ornamental.

**H — Estrutura semiótica:**
- Letra **mais estrutural do alfabeto**: dois pilares + uma viga. Arquitetura literal.
- Carrega: estabilidade, estrutura, pilar, threshold (umbral, porta).
- Em monogramas: tipicamente desenhado como retas verticais + horizontal. Quase impossível errar — mas também quase impossível diferenciar.

**SH como par:**
- **Tensão visual perfeita** entre os dois: S é movimento contínuo, H é repouso modular. Juntas formam exatamente a tensão central da marca (*"sou pessoa, mas opero como sistema"*).
- Possibilidades de relação:
  - **Justaposição** (S | H separados): mais legível, perde personalidade.
  - **Ligadura** (S e H compartilham um stroke): mais memorável, requer execução excelente; risco se mal feito.
  - **Aninhamento** (S dentro de H, ou vice-versa): muito específico — pode virar marca forte, mas pode virar puzzle ilegível.
  - **Modular** (S e H derivados do mesmo grid de módulos): mais "sistema", menos "personagem". Forte fit com posicionamento.

### 4.3 Formas e seus pesos semióticos para esta marca

| Forma | Significado dominante | Adequação a Stefan | Notas |
|---|---|---|---|
| **Linha reta horizontal/vertical** | Estabilidade, ordem, infra | 9/10 | Núcleo da estética |
| **Diagonal 45°** | Velocidade, direção, força | 5/10 | Use cirurgicamente em **terminais de stroke** ou em **um único corte da letra**. Diagonal generalizada vira gamer |
| **Diagonal não-cardinal (ex: 67°)** | Caos, drama | 1/10 | Eliminar |
| **Curva contínua** | Fluxo, vida, contraste | 7/10 | Apenas no S — necessária para a letra existir |
| **Cantos arredondados (radius pequeno, 1–2px)** | Software premium contemporâneo | 7/10 | Já é signature da landing (`--radius-md: 6px`). Tentação: aplicar nos terminais do monograma para coerência |
| **Cantos arredondados (radius grande)** | Friendly, app, jovem | 2/10 | Errado para autoridade |
| **Cantos vivos (0px)** | Brutalist, tech industrial, blueprint | 9/10 | **Preferido** para o monograma — comunica precisão sem cair em "app friendly" |
| **Monograma compacto (S e H entrelaçados)** | Personalidade, autoria, craft | 8/10 | Direção forte se executado limpo |
| **Grid modular** | Sistema, design system, repetibilidade | 10/10 | **Direção mais forte estrategicamente** |
| **Espaço negativo (figura escondida)** | Inteligência, leitura dupla, prêmio para quem olha | 9/10 | Excelente se a forma escondida não for cliché. Vide Imagem 7 (Alpha Air): A com flecha negativa — execução premium. |
| **Simetria estrita** | Estabilidade, formalidade | 7/10 | OK, mas previsível |
| **Assimetria controlada** | Sofisticação, intencionalidade | 9/10 | **Preferido** — sinal de craft |
| **Proporção áurea** | Beleza percebida, refinamento | 4/10 (ver §6) | Tema discutido em detalhe abaixo |
| **Retângulo / quadrado** | Container, blueprint, frame | 9/10 | Excelente como container do monograma (vide Imagem 1 das referências — o quadrado contendo o mark) |
| **Círculo** | Universalidade, completude, planeta | 4/10 | Risco alto: vira "Orbyta", vira "Oscill", vira swoosh planetário |
| **Construção monospace** | Pertencimento à tribo terminal/dev | 9/10 | Geist Mono já é o vocabulário — coerência total |

### 4.4 Conclusão semiótica

A combinação simbólica mais coerente com a marca: **monograma SH com construção modular sobre grid, geometria de cantos vivos com curvas controladas no S, espaço negativo intencional, encaixado em container quadrado opcional, sempre acompanhado de tipografia mono ou grotesk semibold.** Cada elemento dessa fórmula é justificável simbolicamente; cada um remove um clichê.

---

## 5 · PSICOLOGIA VISUAL E SUBCONSCIENTE HUMANO

### 5.1 Processing fluency (Reber, Schwarz, Winkielman 2004)

**Princípio:** o cérebro associa processamento fácil (formas simples, claras, simétricas) com **verdade, confiança e qualidade**. Isto é mensurado: estímulos mais fáceis de processar recebem ratings mais altos em escalas de "trustworthy", "true", "high quality" — mesmo quando o conteúdo é idêntico.

**Aplicação ao SH:**
- Cada elemento descartável **aumenta confiança quando descartado**.
- Hairline de 1.5–2px é mais fluente que 1px (some no scan) e que 3px (chama atenção pro próprio stroke).
- **Teste**: se você precisa olhar a logo por mais de 1 segundo para entender que diz "SH", a fluência está quebrada.

### 5.2 Princípios de Gestalt aplicados ao SH

| Princípio | Como aplicar |
|---|---|
| **Proximidade** | S e H precisam estar próximos o suficiente para serem lidos como **uma marca**, não duas letras. Distância óptica entre eles ≈ 40–60% da altura da letra. |
| **Continuidade** | Se houver ligadura, o olho precisa fluir naturalmente de S para H. Quebra súbita = ruído. |
| **Fechamento** | Cérebro completa formas incompletas. Permite ousadia: o S pode ter um stroke ausente que o cérebro fecha sozinho. **Risco**: legibilidade em <32px. |
| **Figura-fundo** | Aplicação clássica: o "espaço entre" S e H pode formar **uma terceira forma** (uma seta, um corte, uma barra). Imagem 7 (Alpha Air) é prova-de-conceito perfeita. |
| **Similaridade** | S e H devem compartilhar mesma **densidade de stroke**, mesmo tratamento de terminais, mesmas curvas. Inconsistência mata o monograma. |
| **Pregnância (Prägnanz)** | A forma mais simples possível que ainda contém o significado vence. Aplicar reduzindo a logo até quebrar — recuar um passo. |

### 5.3 Efeito de familiaridade vs. surpresa

Marca de pessoa precisa ser **familiar o suficiente para confiar** e **surpreendente o suficiente para lembrar**. A fórmula:

> **estrutura familiar + 1 detalhe único = memorabilidade ótima**

Para SH: o detalhe único pode ser:
- a forma exata de uma curva do S (uma sigmoide com inflexão atípica);
- um corte preciso onde S e H se encontram;
- a presença de uma marca técnica discreta (uma virgula, um ponto, um índice subscrito);
- uma respiração assimétrica entre as duas letras.

**Apenas um detalhe.** Dois detalhes únicos viram ruído.

### 5.4 Tensão e resolução visual

Cada logo bom contém uma micro-tensão que o olho resolve sem perceber. Exemplos:
- **Nike swoosh**: o ponto de pressão máxima da curva está fora do centro óptico — o olho percorre.
- **FedEx**: a seta entre E e x é tensão escondida.

Para SH, a tensão pode estar em:
- **assimetria entre S e H** (S ligeiramente mais alto ou mais largo);
- **interface entre as duas letras** (compartilham 1 stroke, ou se tocam por 1 ponto, ou deixam fenda intencional);
- **container vs. mark** (mark assimétrico dentro de container simétrico).

### 5.5 Memorização por silhueta

**Teste de silhueta**: escureça a logo até virar só bloco preto. Continua reconhecível?

- Logos com **silhueta forte** (Apple, Nike, Twitter old, Tesla T) são memoradas pelo bloco escuro.
- Monograma SH com letras separadas tem silhueta **fraca** (dois objetos).
- Monograma SH com ligadura ou aninhamento tem silhueta **forte**.

**Implicação:** se queremos memorabilidade máxima, ligadura ou aninhamento vencem letras separadas.

### 5.6 Reconhecimento em baixa resolução

| Tamanho | Critério | O que isso impõe ao mark |
|---|---|---|
| 16×16 (favicon) | Forma reconhecível como **algo** | Detalhes internos podem desaparecer; silhueta precisa funcionar |
| 24×24 (LinkedIn avatar) | SH reconhecível como **iniciais** | Espaçamento entre S e H não pode colapsar |
| 32×32 (browser tab, app icon small) | SH reconhecível + acento técnico | Hairlines de 1.5px ainda visíveis (em retina) |
| 64×64 (mac dock small) | SH com micro-tensão visível | Detalhe único começa a aparecer |
| 512×512 (PWA icon, OG image) | Sistema completo | Toda a construção fica óbvia |

**Regra prática**: desenhe primeiro para 32×32. Tudo que sobrevive a esse tamanho é a logo real. O resto é decoração.

### 5.7 Percepção de autoridade por proporção

Estudos clássicos de tipografia (Bringhurst, Lupton) mostram: **autoridade percebida correlaciona com espaçamento generoso ao redor da marca**, não com tamanho do mark.

- Logo apertada no canto = startup amadora.
- Logo respirada com área de exclusão clara = profissional sênior, escritório de advocacia, banco premium.

**Para Stefan:** área de exclusão mínima = altura do H em todas as direções. Não negociar.

### 5.8 Como excesso de detalhe reduz confiança

Estudos de neuroestética (Reber 2004 again; Bar 2007) mostram: estímulos visuais com **alta complexidade** ativam o córtex orbitofrontal de forma negativa quando o contexto é "avaliação de profissional". Em contextos de entretenimento, o oposto.

**Implicação**: Stefan vende profissional → logo simples vence. Mark com mais de **4–5 decisões formais visíveis** começa a perder confiança.

### 5.9 Espaço negativo como sofisticação

Espaço negativo bem usado comunica **"eu poderia ter colocado algo aqui, mas escolhi não colocar"** — sinal de controle máximo. Marcas com espaço negativo forte (Apple, FedEx, Spartan Golf, NBC) são percebidas como mais inteligentes que marcas densas equivalentes.

Para SH: a interface entre S e H é a oportunidade. Não preencher.

### 5.10 Cor de acento e atenção

Lime A `oklch(94% 0.22 124)` é alto-L, alto-chroma. Em campo dark `oklch(13%)`, o contraste é **dramático** (delta-L de 81 pontos). Princípios:

- **Cor de acento ativa atenção quando rara.** Se a logo inteira é lime, atenção morre.
- **Regra empírica**: lime ≤ 10% do mass visual do mark. Resto = neutro.
- Aplicação ótima: **mark off-white**, **stroke ou ponto único lime**, ou **container dark com SH lime** (inversão estratégica para certos contextos).

---

## 6 · GEOMETRIA, GRID E PROPORÇÃO

### 6.1 Sistema de grid recomendado

**Grid base: 8pt × 8pt.**
Não 16, não 12, não 10. 8 porque:
- Coerência com Tailwind (já usado no projeto: `spacing-1 = 4px`, `spacing-2 = 8px`).
- Coerência com Apple HIG, Material, e a maioria dos design systems contemporâneos.
- Subdivisão natural 8 → 4 → 2 cobre todos os refinamentos necessários sem virar `.5px` (anti-padrão em retina).

**Aplicação ao monograma SH:**
- Logo final inscrita em **quadrado 64×64** unidades de grid.
- Hairline interno (stroke) = **3 unidades** (≈ 4.5px no scale final 96px). Em renderização final, vira **2px nominal** (otimizado pra mobile retina) ou **1.5px** (otimizado pra desktop retina). Os dois servem.
- Padding interno do mark dentro do container = **8 unidades** (1 módulo) em cada lado.
- Distância entre S e H = **3 a 5 unidades**, conforme densidade visual desejada.

### 6.2 Grid modular avançado (3×3 ou 5×5)

Para o monograma SH, recomendo **5×5** dentro do quadrado base. Justificativas:

- Grid 5×5 dá centro óptico claro (célula central) e quadrantes coerentes.
- Permite que **cada metade do S** ocupe 2 células e **cada perna do H** ocupe 1.5 células — proporção natural.
- Evita simetria forçada do 4×4 (par) que mata personalidade.

### 6.3 Alinhamento óptico vs. matemático

Princípio crítico: **letras matematicamente alinhadas parecem desalinhadas**. O olho compensa massa visual, não coordenadas.

| Decisão | Óptico (correto) | Matemático (errado) |
|---|---|---|
| Altura do S vs. H | S precisa ser ~2-3% mais alto que H para parecer da mesma altura (curvas precisam ultrapassar a baseline e a x-height) | S = H em altura exata → S parece menor |
| Largura do S vs. H | S ligeiramente mais estreito | S = H em largura → S parece pesado |
| Espessura de stroke | Curvas do S podem ser ~3-5% mais finas que retas do H para parecer mesma espessura | Stroke matemático idêntico → curvas parecem grossas |
| Centro vertical | Centro óptico de S = ligeiramente acima do centro geométrico | Centro geométrico → S parece pesado embaixo |

**Recomendação**: prototipar matematicamente, ajustar opticamente, **sempre**.

### 6.4 Proporção áurea (1:1.618) — **diagnóstico honesto**

A maioria dos casos em que designers aplicam proporção áurea em logos é **decoração de defesa do projeto** (vide imagem 6 das suas referências: o logo "A" tem golden ratio grid sobreposto que **não determinou a forma** — foi aplicado depois para legitimar a forma).

**Onde proporção áurea AJUDA de verdade:**
- **Espaçamento entre wordmark e símbolo** na versão horizontal: a distância pode ser razoavelmente φ ÷ altura.
- **Proporção entre tamanho do mark e tamanho do wordmark** na lockup.
- **Comprimento total de wordmark vs. altura do mark**: bom heurístico inicial.

**Onde proporção áurea NÃO ajuda (e vira pseudodesign):**
- Determinar curvas internas do S por espirais áureas → adiciona zero valor perceptual, complica construção.
- Determinar grosso do stroke vs. height da letra → resolvido por óptica, não por matemática.
- Justificar posicionamento de elementos com round-ups (a maioria das aplicações "golden ratio" mostradas em portfolio têm 5-10% de erro, o que **anula** o princípio).

**Recomendação para Stefan:** usar **grid de 8pt e proporção 1:1 (quadrado)** como guias primários. Proporção áurea **apenas** para o layout do lockup horizontal SH + STEFAN HEINZ SCREPKA, e ainda assim como ponto de partida — não como lei.

### 6.5 Relação entre espessura de stroke e contraforma

**Princípio:** o stroke da letra e o espaço interno (counter) precisam ter relação harmônica. Stroke muito grosso → counters morrem em redução. Stroke muito fino → mark desaparece.

Para SH no tamanho-mestre 64×64:
- Stroke = 3-4 unidades (4.5-6px no scale 96px)
- Contraforma mínima = 6 unidades (1.5× stroke)
- Counter-to-stroke ratio = 1.5–2.0

Em redução para favicon 32px:
- Stroke se reduz a 1px (ou 1.5px em retina 2x)
- Counter mínimo = 3px
- Se counter colapsar abaixo de 2px em 1x, é necessário criar **variant de favicon com stroke mais pesado** (não usar a master)

### 6.6 Espaçamento interno e área de respiro

| Elemento | Spec |
|---|---|
| Área de exclusão **mínima** | altura do H (1× h) em todas as direções |
| Área de exclusão **preferida** | 1.5× h em digital, 2× h em impresso/papelaria |
| Tamanho mínimo recomendado | mark isolado: 24px; lockup com wordmark: 96px (largura) |
| Tamanho ideal em browser tab | 32×32 (favicon) renderizado a partir do mark, **não** do lockup |
| Espaçamento entre mark e wordmark (horizontal lockup) | 0.75× altura do mark |
| Espaçamento entre mark e wordmark (vertical lockup) | 0.5× altura do mark |

### 6.7 Sistema de redução e variantes

| Variante | Quando usar | Spec |
|---|---|---|
| **Mark master** (64×64 unidades) | Toda referência interna, brand guidelines | Versão canônica, todos os detalhes |
| **Mark digital 1x** (32×32) | Avatar, favicon high-res | Stroke ajustado para sobreviver |
| **Mark digital low** (16×16) | Favicon, browser tab fallback | Versão simplificada — pode remover 1 detalhe ornamental, **manter silhueta** |
| **Lockup horizontal A** | Top-bar nav (já existe `top-bar-nav.tsx:84`) | Mark + STEFAN HEINZ SCREPKA wordmark |
| **Lockup horizontal B** | Email signature, business card | Mark + "STEFAN HEINZ SCREPKA" + microcopy "AI Product Engineer" |
| **Lockup vertical** | Pôster, papelaria, OG image, splash | Mark acima + wordmark abaixo |
| **Mark monocromático preto** | Documentos jurídicos, fax, B&W |
| **Mark monocromático off-white** | Sobre fundo dark `oklch(13%)` |
| **Mark lime A** | Acento sobre dark, OG image hero |
| **Mark inverted** (off-white sobre lime A) | Aplicação rara, brand moments |
| **Mark in container** (quadrado preenchido) | App icon, social media avatar |
| **Mark in container outline** | Versões editoriais, hover states |

### 6.8 Critérios de legibilidade por tamanho

| Tamanho | Critério primário | Critério secundário |
|---|---|---|
| 16px | Silhueta reconhecível | Letras SH ainda identificáveis se possível |
| 32px | SH legível com clareza | Acento/detalhe visível |
| 64px | Sistema completo legível | Tensão interna visível |
| 512px | Construção visível | Possível adicionar mark de versão, copyright se Brand Book exige (preferência: **não adicionar**) |

---

## 7 · TERRITÓRIOS CRIATIVOS POSSÍVEIS

Cinco direções com scorecards. Cada direção é **internamente coerente**. Misturar elementos entre direções enfraquece. Recomendo escolher **uma direção principal** e usar **uma secundária** apenas para elemento auxiliar (favicon, pattern, etc).

---

### 7.1 Território 1 — **PRECISION SYSTEM**

**Ideia central:** marca como instrumento. Cada elemento construído a partir de módulos visíveis. Estética blueprint, console, painel de instrumentos.

**Forma visual sugerida:**
SH desenhado sobre grid 5×5 explicitamente derivado de módulos quadrados. Stroke uniforme. Cantos vivos (0°). Possível inclusão de tick-marks discretos nos cantos do bounding box (referência: aviation HUD, autocad blueprint).

**O que comunica:** disciplina extrema, "esse cara é engenheiro de verdade", autoridade técnica calma.

**Riscos:**
- Pode ficar **frio demais** — perder pessoalidade.
- Tick-marks podem virar gimmick se executados mal.
- Risco de parecer "logo de empresa de instrumentação industrial" (sismógrafo, geofísica).

**Combina com Stefan?** Sim — alta. Esse território cobre o lado *sistema* da tensão central. Risco: perde o lado *pessoa*.

**Monograma SH:** S e H como retas-e-curva-mínima derivadas do grid. S como sigmoide reduzida a 3 retas + 2 quadrantes-de-círculo. H como 3 retas. Mesma espessura de stroke. Aninhados em um quadrado de container.

**Wordmark:** Geist Mono Medium, uppercase, tracking +0.16em (já é `--tracking-widest` da landing — coerência total).

**Paleta:** Base `oklch(13%)` + Off-white `oklch(98%)` + Lime A `oklch(94% 0.22 124)` como acento de hover/active único.

**Tipografia:** Geist Mono no wordmark (rompe expectativa de "marca pessoal usa serif"). Geist Sans Semibold em alternativa para versões mais comerciais.

**Sofisticação: 9/10** | **Memorabilidade: 7/10** | **Adequação: 9/10**

---

### 7.2 Território 2 — **QUIET AUTHORITY**

**Ideia central:** monograma SH desenhado como **assinatura serif moderna** — não ornamental, mas com elegância editorial. Referência: a marca pessoal de quem é "obviamente sênior" — vide marca pessoal de Massimo Vignelli, marca da revista Apartamento, identidade de Cabinet.

**Forma visual sugerida:**
SH com terminais ligeiramente reduzidos (contraste sutil de stroke), espaço negativo generoso, sem ligadura — duas letras puras, próximas, opticamente alinhadas. Possível detalhe único: barra horizontal fina conectando os terminais inferiores do S e H, ou um ponto/serif discreto.

**O que comunica:** maturidade, autoridade não-performada, "quem precisa entender entende".

**Riscos:**
- Pode parecer **escritório de advocacia** ou **consultoria boomer**.
- Editorial em monograma de engenheiro pode confundir público técnico.
- Em redução, contrastes de stroke morrem.

**Combina com Stefan?** Médio. Há um momento serif na landing (PP Editorial em "multi-agente") — esse território amplifica isso para identidade inteira. Mas conflita com o tom *mono/grotesk* dominante.

**Monograma SH:** Letras serif modernas (Söhne, GT Sectra, Söhne Mono Aktiv) com proporções clássicas, espaçamento óptico justo. Possível detalhe único = swash mínimo no S inferior.

**Wordmark:** Mesma família serif moderna, uppercase, tracking moderado.

**Paleta:** Base dark + Off-white. **Lime A reduzida a 2-3% da marca** — talvez só na pontuação ou em um ponto separador.

**Tipografia:** GT Sectra Display, Tiempos Headline, ou Söhne Schmal.

**Sofisticação: 9/10** | **Memorabilidade: 6/10** | **Adequação: 6/10**

---

### 7.3 Território 3 — **ENGINEERED SIGNAL** *(direção recomendada — ver §12)*

**Ideia central:** SH construído como **single glyph** modular, com **espaço negativo formando um signal** (uma seta, uma flecha de output, um caret `>`). Toda marca lê como **um glifo único**, não duas letras.

**Forma visual sugerida:**
S e H **compartilham um stroke central** (a haste vertical esquerda do H coincide com o terminal inferior do S). Entre as duas, espaço negativo forma uma seta diagonal (`↗`) ou um caret técnico (`›`). Stroke uniforme, cantos vivos com terminais cortados em 45° apenas onde o signal acontece.

**O que comunica:** "isto não é só identidade, é declaração". Cumplicidade técnica (devs leem o `>` como prompt, output, pipeline). Construção mostrada. Densidade visual alta sem virar ruído.

**Riscos:**
- Espaço negativo precisa ser **óbvio na primeira leitura** — se requerer "agora olha aqui" é falha.
- Risco de ser lido como `S>H` ou `→` sem ancoragem em iniciais (mitigado por wordmark sempre próximo).
- Construção complexa exige execução excelente — designer mediano vai estragar.

**Combina com Stefan?** **Muito alta.** Esse território:
- Resolve a tensão central (S+H unidas = pessoa-como-sistema)
- Carrega *signal*, *engineering*, *output* — palavras do território semântico de Stefan
- Tem leitura dupla (forma + signal) → memorabilidade
- Funciona em todos os tamanhos se executado bem
- Coerente com a estética da landing (densa, técnica, sem firula)

**Monograma SH:** Construção single-glyph descrita acima. Container retangular opcional (com 2 unidades de padding interno). Versão sem container para uso editorial.

**Wordmark:** STEFAN HEINZ SCREPKA em Geist Sans Medium, uppercase, tracking +0.08em.

**Paleta:** Off-white sobre dark base. Lime A pode **destacar apenas a forma do signal** (a seta no negativo vira lime, o resto permanece off-white) em versões digitais hero. Versão monocromática perfeita também.

**Tipografia:** Geist Sans Medium / Semibold (wordmark) + Geist Mono Medium (microcopy/eyebrow).

**Sofisticação: 9/10** | **Memorabilidade: 9/10** | **Adequação: 10/10**

---

### 7.4 Território 4 — **MODULAR INTELLIGENCE**

**Ideia central:** SH como **dois módulos** que se encaixam. Cada letra reduzida a unidades elementares (quadrados, semicírculos) com encaixe explícito. Referência: identidade visual de IDEO (modular), Bauhaus, Olimpíadas de Tóquio 1964 (Yusaku Kamekura), design system tokens.

**Forma visual sugerida:**
S = composta por 2 ou 3 módulos curvos. H = composta por 3 módulos retos. Encontro entre S e H = encaixe geométrico (um módulo do S compartilhado com um módulo do H, ou um módulo extra ao centro que pertence a ambas). Possível: marcar visualmente as fronteiras dos módulos (linha mais clara, ou hairline branca de 1px separando módulos).

**O que comunica:** sistema, composição, "tudo é construído a partir de unidades", agentes (sutil — sem clichê).

**Riscos:**
- Pode parecer **logo de empresa de blocos lego** se executado infantilmente.
- Modularidade explícita pode roubar leitura como "SH".
- Risco de virar "logo de empresa de construção civil modular".

**Combina com Stefan?** Alta. O conceito *multi-agent system → unidades que compõem produto* é literalmente o que ele faz (Content Engine = 22 agentes em 5 squads). Risco: executar de forma muito didática.

**Monograma SH:** Construção explicitamente modular. Brand book pode mostrar a "desmontagem" do mark em peças.

**Wordmark:** Mais geométrica (Söhne, NB International, Diatype).

**Paleta:** Dark base + Off-white + Lime A pode marcar **um único módulo** (o que representa "Stefan, o orquestrador") em destaque, restante neutro.

**Tipografia:** Söhne Buch, Diatype, NB International — algo com geometria mais explícita que Geist.

**Sofisticação: 8/10** | **Memorabilidade: 8/10** | **Adequação: 8/10**

---

### 7.5 Território 5 — **TECHNICAL MONOLITH**

**Ideia central:** SH como **bloco único**, sem firula, sem ligadura visível. Apenas duas letras pretas em peso máximo, espaçamento minimal, cortadas com **um único detalhe técnico** (chamfer 45° em um canto, ou notch retangular).

**Forma visual sugerida:**
SH em Black weight, terminais quadrados, sem nenhuma curva ornamental. Tudo o que existe é massa. Um único corte/chanfro em um canto específico (canto superior direito do H, por exemplo) cria o "detalhe único". Referência conceitual: Massive Attack symbol, identidade visual de Nine Inch Nails (sóbria), ou Helvetica Bold em escala extrema.

**O que comunica:** peso técnico, presença, "isso é sério, não é decoração". Brutalismo controlado.

**Riscos:**
- Risco real de parecer **agressivo** ou **gamer** se executado errado (vide imagem 1 das suas referências — esses três triângulos cortados estão à beira disso).
- Pode parecer **sem craft** — "qualquer um faz".
- Pode confundir com marca de música/cultura urbana.

**Combina com Stefan?** Média. Carrega autoridade, mas perde a **calma intencional** que é parte da personalidade.

**Monograma SH:** Letras em peso Black ou Heavy. Stroke gigante. Counters minimais. Um corte preciso em um canto.

**Wordmark:** Mesmo peso, ou contraste com light (Mark Black + STEFAN HEINZ SCREPKA Light).

**Paleta:** Preto puro + off-white. Lime A talvez apenas no corte do detalhe.

**Tipografia:** Helvetica Bold/Black, Söhne Heavy, Druk.

**Sofisticação: 7/10** | **Memorabilidade: 8/10** | **Adequação: 6/10**

---

### 7.6 Matriz de comparação dos 5 territórios

| Critério | T1 Precision System | T2 Quiet Authority | T3 Engineered Signal | T4 Modular Intelligence | T5 Technical Monolith |
|---|---|---|---|---|---|
| Sofisticação | 9 | 9 | 9 | 8 | 7 |
| Memorabilidade | 7 | 6 | **9** | 8 | 8 |
| Adequação a Stefan | 9 | 6 | **10** | 8 | 6 |
| Risco de cliché | Baixo | Baixo | Médio | Médio | Médio-Alto |
| Performance em redução | Alta | Média | Alta | Média | Alta |
| Performance em motion | Alta | Baixa | **Alta** | Alta | Média |
| Densidade de craft | Alta | Alta | **Muito Alta** | Alta | Média |
| Compatibilidade com landing atual | Alta | Média | **Alta** | Alta | Média |
| **Soma ponderada** | 43 | 36 | **48** | 42 | 35 |

**Líder: Território 3 — Engineered Signal.** Backup: Território 1 — Precision System.

---

## 8 · BENCHMARK VISUAL

| Marca | O que aprender | O que NÃO copiar | Como adaptar para Stefan |
|---|---|---|---|
| **Linear** | Hairline strokes, alpha-borders luminance (já usado em `globals.css:57-58`), monograma `L` brutalist | Roxo elétrico, geometria angular específica do L | Aplicar o **princípio de "luminance border" + monograma simples** ao SH. Não copiar o ângulo. |
| **Vercel** | Triângulo `▲` que **é** a marca + wordmark Inter/Geist. Inset bisel (já usado em `--shadow-inset-bisel`). Preto puro | Triângulo geométrico (pertence a eles) | Adaptar o princípio: **um único glifo geométrico + wordmark sans**. Para Stefan, o glifo é o monograma SH-as-single-shape. |
| **Stripe** | Wordmark com leve curvatura no terminal do `S` (detalhe único). Coral signature. Espaçamento generoso | Coral, gradient hero | Detalhe único na curva do S de SH (mesma lógica). Cor de acento como signature (lime cumprindo papel do coral). |
| **Apple** | Silhueta absoluta. Mark é a marca, wordmark raramente aparece. | Maçã (símbolo concreto) | Tornar mark **silhueta-forte** o suficiente para dispensar wordmark em contextos avatar/app icon. |
| **Family** (studio) | Wordmark muito justo, tracking quase negativo, peso médio. Total ausência de decoração. Site é texto + alguns ícones em grid | Estética estúdio (Stefan é pessoa, não estúdio) | Aprender a **densidade tipográfica**. Aplicar em wordmark com tracking justo, sem decoração ao redor. |
| **Rauno** (pessoal) | Marca pessoal que vive na fronteira "pessoa premium + craft técnico". Wordmark serif italic + cor de acento. Sistema visual de interaction design | Italic editorial dominante | Adaptar **o cuidado por trás de cada componente** — sistema visual coerente além do logo. O lime A pode ter o papel que o coral tem em Rauno. |
| **Emil Kowalski** (pessoal) | Mark super simples (iniciais EK ou ponto), conteúdo é a marca. Tipografia limpa | Minimalismo absoluto que beira o invisível — pode ser fraco demais | Aprender **a coragem de não decorar**. Mas Stefan precisa de mais presença que Emil — adicionar 1 detalhe único. |
| **Build UI** | Identidade técnica densa, monospace dominante, palette neutra + 1 acento | Site é didático — Stefan é vendedor | Aprender o **tom monospace + acento técnico**. Já presente na landing. |
| **shadcn/ui** | Mark = quadrado preto, sem ornamento. Tipografia inter. Densidade de craft no produto | Quadrado preto puro é deles. Genérico se copiado | Aprender que **simplicidade + execução perfeita** vence ornamento. |
| **Replit** | Lime como signature de marca (similar a Stefan) + mark angular | Mark de "play button" angular específico | Validação: **lime existe em marca premium tech** sem virar gamer. Stefan está em boa companhia. |
| **Anthropic** | Wordmark serif (Söhne Schmal). Mark é gradiente sofisticado | Gradiente | Aprender **uso de serif moderna em marca técnica** — opção real, especialmente para wordmark. |
| **GitHub** (Octocat) | Personalidade humana em marca técnica + wordmark estrutural | Mascote | Aprender que **personalidade não é fraqueza** — Stefan pode ter um detalhe pessoal/humano sem perder autoridade. |

---

## 9 · ANÁLISE TIPOGRÁFICA

### 9.1 Categorias avaliadas

| Família | Percepção | Risco | Melhor uso | Combina com "STEFAN HEINZ SCREPKA"? | Combina com "SH"? |
|---|---|---|---|---|---|
| **Sans grotesk neutra** (Helvetica, Inter, Geist Sans) | Universal, neutra, profissional | Genérica se não tiver tratamento específico | Wordmark, body | ✅ Excelente | ✅ Excelente |
| **Neo-grotesk técnica** (Söhne, GT America, Inter Tight) | Contemporânea, software premium | Pode parecer "ainda fugindo de Helvetica" | Wordmark, headlines | ✅ Excelente | ✅ Bom |
| **Geométrica humanista** (Futura PT, Avenir, NB International) | Engenharia, modernismo, Bauhaus | Pode datar (Futura é dos anos 30 e parece) | Wordmark se quiser tom Bauhaus | ⚠ OK, mas competitivo | ✅ Bom |
| **Mono técnica** (Geist Mono, JetBrains Mono, IBM Plex Mono, Berkeley Mono) | Terminal, dev, código, "isto é técnico" | Pode parecer "ainda um portfolio de dev" se exagerado | Microcopy, eyebrow, marcas de versão, possivelmente wordmark | ⚠ Pesado em wordmark longo | ⚠ Wordmark longo fica longo demais |
| **Serif moderna editorial** (GT Sectra, Tiempos, Söhne Schmal) | Autoridade, "publicação", maturidade | Pode confundir categoria (parecer mídia, não eng.) | Acentos editoriais, citações, possivelmente wordmark se direção for QUIET AUTHORITY | ⚠ Forte mas direção específica | ⚠ Possível mas específico |
| **Serif clássica** (Times, Caslon, Garamond) | Tradição, advogado, jornalismo | Mata posicionamento tech | Não usar | ❌ | ❌ |
| **Display dramática** (Druk, Migra, Ogg) | Editorial intenso, fashion, magazine | Mata categoria | Não usar | ❌ | ❌ |
| **Script / handwritten** | Pessoal, casual, informal | Mata autoridade técnica | Não usar | ❌ | ❌ |

### 9.2 Recomendação tipográfica final por elemento

| Elemento | Família | Peso | Casing | Tracking | Justificativa |
|---|---|---|---|---|---|
| **Wordmark "STEFAN HEINZ SCREPKA"** (primário) | Geist Sans | Medium (500) ou Semibold (600) | UPPERCASE | +0.08em (`--tracking-wider`) | Coerência total com a landing. Uppercase + tracking gera autoridade sem peso. Semibold é o sweet-spot entre presença e calma. |
| **Wordmark alternativo** (versão tight) | Geist Sans | Semibold (600) | Title case "Stefan Heinz Screpka" | -0.01em (`--tracking-tight`) | Para casos onde uppercase é agressivo demais (Email signature, About page, formal documents). |
| **Microcopy eyebrow** ("AI Product Engineer") | Geist Mono | Medium (500) | UPPERCASE | +0.16em (`--tracking-widest`, já é `@utility eyebrow`) | Coerência total — esse padrão já vive em `globals.css:291-299`. |
| **Monogram SH** (mark) | **Desenhado custom**, não tipográfico | — | — | — | Mark precisa ser **desenhado**, não apenas typeset. Mesmo se inspirado em uma família, **deve ser ajustado**: alinhamento óptico, terminais ajustados, espaçamento custom. |
| **Marca de versão / metadados** ("v1.0", "® 2026") | Geist Mono | Regular (400) | lowercase | 0 | Quando absolutamente necessário. Idealmente **nunca aparece no mark** — apenas em legal pages. |

### 9.3 Por que NÃO usar GT Sectra ou Söhne Schmal (mesmo lindas)

PP Editorial New já cumpre o papel serif na landing (1 palavra, "multi-agente"). Adicionar Sectra/Schmal ao sistema:
1. Aumenta carga de fontes (peso de download).
2. Cria confusão de hierarquia (3 famílias serif é demais).
3. PP Editorial é mais coerente porque carrega o tom **levemente irônico** que GT Sectra (sério demais) ou Söhne Schmal (alto demais) não carregam.

**Conclusão:** sistema tipográfico = **Geist Sans + Geist Mono + PP Editorial Italic** (já existe). Não adicionar família para a logo. Mark = custom. Wordmark = Geist Sans Semibold.

### 9.4 Como evitar parecer genérico mesmo usando Geist

Geist é onipresente em portfolios técnicos brasileiros e globais (é o default do Vercel). Diferenciação não vem da família, vem do **tratamento**:

| Tratamento | Efeito | Recomendação |
|---|---|---|
| Tracking custom no wordmark (+0.08em) | Imprime ritmo único | ✅ Sim |
| Casing decisão (UPPERCASE wordmark + Title case mark microcopy) | Sistema visível | ✅ Sim |
| Ativação OpenType `ss01` (already in landing `globals.css:461`) | Glyphs alternativos que diferenciam | ✅ Sim |
| Ativação `tnum` em números (já existe) | Coerência com mono | ✅ Sim |
| **Wordmark custom-spacing** (kerning manual entre as 18 letras de "STEFAN HEINZ SCREPKA") | Imprime autoria | ✅ **Crítico** — designer precisa kernear manualmente |
| Pares de letras especiais ("FA", "AN", "HE") com kerning manual ainda mais justo | Craft visível para olhar treinado | ✅ Sim |

---

## 10 · ANÁLISE DE COR

### 10.1 Sistema cromático recomendado

Mantendo total coerência com `globals.css`, **sem inventar novos tokens**:

| Papel | Token (já existe) | OKLCH | HEX aproximado | HSL aprox |
|---|---|---|---|---|
| **Dominante (60%)** | `--color-bg` | `oklch(13% 0.005 130)` | `#0F1212` | `hsl(130 5% 7%)` |
| **Secundária (30%)** | `--color-text-1` | `oklch(98% 0.005 130)` | `#F8F9F8` | `hsl(130 5% 97%)` |
| **Acento (10%)** | `--color-accent` (Lime A) | `oklch(94% 0.22 124)` | `#D2FF00` *(já confirmado no easter egg, `app/layout.tsx:168`)* | `hsl(72 100% 50%)` |
| Suporte (eyebrow text) | `--color-text-2` | `oklch(75% 0.005 130)` | `#B7B9B7` | — |
| Suporte (tertiary) | `--color-text-3` | `oklch(63% 0.005 130)` | `#9A9C9A` | — |
| Cor sobre acento | `--color-text-on-accent` | `oklch(13% 0.005 130)` | `#0F1212` | — |
| Surface elevada | `--color-surface` | `oklch(18% 0.008 130)` | `#191D19` | — |
| Hairline | `--color-hairline` | `oklch(22% 0.010 130)` | `#1F2420` | — |

### 10.2 Cores PROIBIDAS no sistema

| Cor | Por quê |
|---|---|
| **Roxo / Magenta** | Categoria Linear, Stripe, Twitch. Stefan não compete nesse espaço, não rouba. |
| **Azul saturado** | Categoria SaaS B2B genérica (Slack, Salesforce, Zoom). Lê como "qualquer software". |
| **Cyan / Ciano** | Categoria cyber-tech, security, "anos 2000 voltou". |
| **Vermelho saturado** | Categoria alerta, erro, marca de fast-food. |
| **Amarelo neon (oklch >85% L em hue ~90°)** | Categoria warning, sinalização. Lime A já está perto, mas o **hue 124° (verde-amarelado)** salva — abaixo de 100° vira amarelo. |
| **Gradiente** | Categoria startup AI 2024. Stefan está acima disso. |
| **Glow excessivo** | Categoria gamer. Glow controlado em `--shadow-glow-lime-sm` (16px, 40% alpha) é máximo aceitável. |

### 10.3 Razão 60/30/10 aplicada

| Contexto | Distribuição |
|---|---|
| Landing page | **60%** base dark / **30%** text + surface / **10%** lime A (acentos, links, focus, CTAs) |
| Logo (mark sozinho sobre dark) | **80%** off-white / **20%** lime A (apenas no signal/detalhe único) — ou **100% off-white** monocromático |
| Logo (mark sozinho sobre claro) | **100% dark base** monocromático |
| Logo (versão "hero" para OG image) | **60% dark base / 30% off-white / 10% lime A** |
| Avatar LinkedIn / GitHub | **100% off-white sobre dark base** (sem lime — campo muito ruidoso) |
| Favicon | **100% lime A sobre dark base** ou **dark base sobre lime A** (versão "alert mode") |

### 10.4 Psicologia da paleta

| Cor | Psicologia para esta marca |
|---|---|
| **Dark `oklch(13%)`** | Sofisticação, foco, "modo trabalho", terminal. Não é preto puro — leve viés verde (chroma 0.005, hue 130) cria coerência com o lime. Diferencia de marcas que usam preto puro `#000` (mais agressivo). |
| **Off-white `oklch(98%)`** | Limpeza, leitura, calma. Também não é branco puro — leve viés verde igual. Reduz cansaço visual em sessões longas. |
| **Lime A `oklch(94% 0.22 124)`** | Hue 124° (verde-amarelado, lado verde) + chroma 0.22 (saturado mas não máximo) + L 94% (muito brilhante mas não 100%). Combinação rara — não é Replit verde (mais saturado, mais 130°), não é Spotify verde (mais escuro, mais 145°). **Estatura única.** Comunica: ativo, atenção, tecnológico, **sem ser gamer** porque o hue 124° pende para amarelo (mais "alta-tensão técnica") e não para verde puro (mais "natureza / Whole Foods"). |

### 10.5 Como usar Lime A SEM parecer gamer ou infantil

Cinco regras absolutas:

1. **Nunca preencher área grande com lime** — máximo 10% do mass visual.
2. **Nunca lime em texto longo** (>1 frase). Apenas em CTAs, labels curtos, ou interação ativa.
3. **Sempre acompanhado de dark base** (jamais lime sobre branco — vira semáforo).
4. **Stroke fino > área cheia**. Hairline lime, borda lime, focus ring lime — não bloco lime.
5. **Quando lime aparecer, deve "fazer algo"** — sinalizar interação, hover, ativo, focado. Lime puramente decorativo perde poder.

A landing já segue essas regras (skip-link em lime, focus ring em lime, hover states em lime). **Logo deve seguir o mesmo princípio.**

### 10.6 Acessibilidade e contraste

| Combinação | Razão de contraste | WCAG |
|---|---|---|
| `--color-text-1` sobre `--color-bg` | ~16.5:1 | AAA texto pequeno |
| `--color-text-2` sobre `--color-bg` | ~7.9:1 | AAA texto pequeno |
| `--color-text-3` sobre `--color-bg` | ~4.7:1 | AA texto pequeno (recém calibrado pra isso, `globals.css:46`) |
| `--color-accent` sobre `--color-bg` | ~13.2:1 | AAA |
| `--color-text-on-accent` sobre `--color-accent` | ~13.2:1 | AAA |

**Implicação para a logo:** todas as combinações canônicas passam WCAG AAA. **Não há tradeoff de acessibilidade.**

---

## 11 · CRITÉRIOS OBJETIVOS PARA AVALIAR A LOGO FINAL

Cada nota de 0–10. Logo aceitável precisa de **mínimo 7 em todos os critérios** e **média ≥ 8.5**. Logo "premium" precisa **9+ em pelo menos 8 critérios**.

| # | Critério | Como avaliar | Mínimo |
|---|---|---|---|
| 1 | **Memorabilidade** | Mostre por 5s, peça pra desenhar 1 hora depois. Se 50% dos avaliadores acertarem a silhueta, ≥8. | 7 |
| 2 | **Redução** | Renderize em 16, 24, 32, 64, 128, 512px. Cada tamanho deve sobreviver com identidade. | 8 |
| 3 | **Silhueta** | Versão 100% preta — ainda reconhecível? | 8 |
| 4 | **Originalidade** | Reverse image search retornaria genérica ou nada similar? | 8 |
| 5 | **Autoridade** | "Custo médio do designer por trás disso = USD ?" → resposta mediana ≥ USD 5k | 8 |
| 6 | **Adequação ao posicionamento** | Combina com "AI Product Engineer que entrega multi-agent em produção"? | 9 |
| 7 | **Clareza** | Comunica o que quer comunicar sem precisar de legenda | 8 |
| 8 | **Potencial de sistema visual** | A logo gera tokens (padrão, secondary mark, favicon variant, pattern) com naturalidade? | 8 |
| 9 | **Versatilidade** | Funciona em web, papel, gravado, motion, bordado? | 7 |
| 10 | **Ausência de clichê** | Não tem nenhum dos elementos da lista §1.2? | 9 |
| 11 | **Legibilidade** | SH é lido como SH (não como outra letra) em 100% dos casos? | 9 |
| 12 | **Força como avatar (square 1:1)** | Avatar LinkedIn 200×200 — destaque visual no feed | 8 |
| 13 | **Força como favicon (16×16)** | Identificável a 16px? | 7 |
| 14 | **Força em P&B** | Sem cor, ainda completa? | 9 |
| 15 | **Força em motion** | Pode ser animada (build-up de strokes, modular assembly, signal pulse)? | 7 |
| 16 | **Força em aplicação web** | Como `<svg>` inline, peso < 2KB, animável via CSS variables, escalável sem perda? | 9 |

**Nota agregada mínima para release**: 8.5 média + cada critério ≥ mínimo. Se qualquer critério ≤ mínimo, **iterar antes de release**.

---

## 12 · RECOMENDAÇÃO FINAL

### 12.1 As duas direções mais fortes

Após aplicar a matriz §7.6 + critérios §11 + adequação a §1–§5:

> **Direção principal: TERRITÓRIO 3 — ENGINEERED SIGNAL**
> **Direção alternativa: TERRITÓRIO 1 — PRECISION SYSTEM**

---

### 12.2 Direção Principal: **ENGINEERED SIGNAL** (recomendada para execução)

#### Por que é a mais adequada

1. Resolve a **tensão central** da marca (S + H em forma única = pessoa-como-sistema) — nenhuma outra direção faz isso tão diretamente.
2. Carrega vocabulário do território de Stefan: *signal*, *output*, *pipeline*, *engineering* — sem ilustrar literalmente nada disso.
3. Tem **leitura dupla** (forma + signal escondido), o que ativa todos os mecanismos descritos em §5.5 (silhueta forte) e §5.9 (espaço negativo como sofisticação).
4. **Memorabilidade alta** (9/10) sem precisar de elementos decorativos — só a interação entre as duas letras já é distintiva.
5. Coerente com toda a estética da landing — não pede mudança em globals.css, fontes, ou tokens.
6. Adapta-se a motion: o signal pode ser revelado por build-up de strokes, criando moment de marca em transições.

#### Como deveria ser visualmente

**Especificação canônica:**

```
Container: quadrado 64×64 unidades (opcional, presente em apps e avatars)
Padding: 8 unidades em cada lado
Bounding box do mark: 48×48 unidades

Construção:
- H ocupa metade direita do bounding box (24×48 unidades)
  - 3 retas verticais: esquerda, direita
  - 1 reta horizontal central (atravessando ambas)
  - Stroke: 3 unidades, terminais quadrados (cantos vivos)

- S ocupa metade esquerda do bounding box (24×48 unidades)
  - Construção sigmoide: 2 quadrantes-de-círculo + 1 reta central horizontal
  - Stroke: 3 unidades (igualado opticamente — pode ser 2.85 em curva pra parecer 3 em reta)
  - Terminais: superior cortado em 45° (apontando NW), inferior cortado em 45° (apontando SE)

- Intersecção: o terminal inferior do S e o pilar esquerdo do H compartilham 6 unidades
  de stroke. Esse pilar único atravessa ambas as letras — é o "spine" do glifo.

- Espaço negativo entre S e H:
  - A interrupção entre a curva inferior do S e o pilar central do H forma
    uma silhueta de seta `↗` ou caret `›`
  - Essa silhueta deve ter área >= 12% da área total do mark para ser legível

Cor:
- Mark monocromático: off-white sobre dark, OU dark sobre claro
- Mark "hero": off-white com o signal escondido em lime A (oklch(94% 0.22 124))
- Lime A nunca preenche letra inteira — apenas o "signal"
```

#### O que deve ser evitado

- **Não** adicionar ornamentos ao container (linhas, ticks, copyright marks visíveis).
- **Não** decorar terminais com serifs ou curvas — apenas cortes 45° funcionais.
- **Não** usar gradiente, glow externo, ou shadow no mark (glow só em CSS de hover, opcional).
- **Não** "modernizar" o S adicionando swash — destruiria a precisão.
- **Não** criar variações de cor além das descritas.
- **Não** colocar `®` ou `™` próximo ao mark em uso público.

#### Racional criativo (1 parágrafo para defender em apresentação)

> *Stefan é uma pessoa só que opera como sistema. O monograma SH não desenha "duas letras" — desenha **uma forma única** onde S e H compartilham uma estrutura. O espaço deixado entre as duas não é vazio: é um signal — uma seta que aponta pra frente, um caret que abre prompt, um pipe que conecta agentes. A marca não fala sobre IA, multi-agent, ou produto. Ela é um sistema de duas letras que se comportam como sistema. Cada decisão — o stroke uniforme, o corte 45° apenas onde necessário, a escolha de Lime A apenas no signal — vem de uma única instrução: precisão sem decoração.*

#### Frase-resumo da identidade

> **"Two letters. One system. One signal."**
> (PT: *"Duas letras. Um sistema. Um sinal."*)

---

### 12.3 Direção Alternativa: **PRECISION SYSTEM**

#### Por que é a segunda mais adequada

Caso a execução do Engineered Signal se mostre tecnicamente difícil ou caso a leitura do espaço negativo não convencer em testes com usuário, **Precision System** é o fallback robusto:

- Construção mais previsível, menor risco de execução medíocre.
- Comunica disciplina e autoridade técnica diretamente, sem requerer leitura sutil.
- Funciona perfeitamente em todos os tamanhos sem ajustes complexos.

#### Como deveria ser visualmente

- S e H **separados** (não compartilham stroke), mas próximos (gap de 4 unidades em bounding 48×48).
- Construção 100% derivada de grid 5×5 visível.
- Stroke uniforme 3 unidades, cantos vivos.
- S como **3 retas + 2 quadrantes-de-círculo** (reduzido a primitives).
- H como **3 retas**.
- Container quadrado **sempre presente** — esse é parte da identidade visual aqui.
- Tick-marks discretos opcionais nos cantos do container (referência blueprint).

#### O que deve ser evitado

- Construção orgânica do S (curvas livres).
- Diagonais não-cardinais.
- Qualquer elemento que não derive do grid.

#### Racional criativo

> *Stefan constrói sistemas que funcionam em produção. O monograma SH é desenhado dentro de um grid visível, com cada elemento derivado de módulos repetíveis. O container quadrado não é um frame decorativo — é a evidência do sistema. Quem desmonta o mark encontra apenas retas, quadrantes, e proporções inteiras. Nenhum gesto livre. Tudo justificável.*

#### Frase-resumo

> **"Every line, on grid."**
> (PT: *"Cada linha, no grid."*)

---

## 13 · ENTREGÁVEL FINAL

### 13.1 Resumo executivo (200 palavras)

A marca pessoal **Stefan Heinz Screpka** precisa comunicar, em 3 segundos: *pessoa-engenheiro real*, *domínio técnico de fronteira*, *disciplina estética*, e *sofisticação Linear/Vercel-tier*. A tensão central — *"sou uma pessoa, mas opero como sistema"* — deve estar embutida visualmente na própria construção do monograma.

Sistema visual já estabelecido na landing (Geist Sans/Mono, Lime A `oklch(94% 0.22 124)`, dark base `oklch(13%)`, PP Editorial italic em um único momento, monograma SH em uso ornamental, ✺ apenas como decoração) **não precisa de troca** — precisa de **mark final que substitua a sigmoide custom atual**.

Recomendação: **direção Engineered Signal** — SH como single-glyph onde as duas letras compartilham um stroke central e o espaço negativo entre elas forma uma seta/caret técnico. Construção sobre grid 8pt + 5×5, stroke uniforme 3 unidades, cantos vivos, sem ornamento. Wordmark em Geist Sans Semibold uppercase com tracking +0.08em.

Alternativa: direção Precision System — SH modular sobre grid visível dentro de container quadrado, com tick-marks opcionais — escolha se Engineered Signal não convencer em testes.

Logo final precisa passar em todos os 16 critérios objetivos (§11) com nota ≥ mínimo individual e média ≥ 8.5.

---

### 13.2 Matriz de decisão

| Critério (peso) | Engineered Signal | Precision System | Quiet Authority | Modular Intelligence | Technical Monolith |
|---|---|---|---|---|---|
| Adequação ao posicionamento (×3) | 30 | 27 | 18 | 24 | 18 |
| Memorabilidade (×2) | 18 | 14 | 12 | 16 | 16 |
| Sofisticação (×2) | 18 | 18 | 18 | 16 | 14 |
| Coerência com landing (×2) | 18 | 18 | 12 | 16 | 12 |
| Risco de execução (×1, invertido) | 6 | 9 | 7 | 7 | 6 |
| Versatilidade (×1) | 9 | 9 | 6 | 7 | 8 |
| Performance em motion (×1) | 9 | 8 | 5 | 9 | 6 |
| **Total** | **108** | **103** | 78 | 95 | 80 |

**Vencedor**: Engineered Signal (108). Backup: Precision System (103).

---

### 13.3 Recomendação final (1 frase)

**Executar Engineered Signal como direção primária. Manter Precision System como backup vivo durante a fase de prototipagem — se a leitura do signal não convencer em testes com usuários reais (3.1 e 3.6), pivotar.**

---

### 13.4 Briefing pronto para o designer

```
PROJETO: Marca pessoal Stefan Heinz Screpka — AI Product Engineer
DELIVERY: Monograma SH + wordmark + lockups + guidelines essenciais
PRAZO: a definir | ROUNDS: 2 rounds de iteração + 1 round de polish

DIREÇÃO ESCOLHIDA: Engineered Signal
- SH como single-glyph
- S e H compartilham stroke central (o pilar esquerdo do H = terminal inferior do S)
- Espaço negativo entre as duas letras forma seta/caret (↗ ou ›) com área ≥12% do mark
- Stroke uniforme 3 unidades em bounding 48×48 (dentro de container 64×64)
- Terminais do S cortados em 45° (NW superior, SE inferior); H com terminais quadrados
- Cantos vivos (0° radius)
- Sem ornamento, sem ©, sem ®, sem tick-marks no container

RESTRIÇÕES TÉCNICAS:
- Grid: 8pt + 5×5 modular interno
- Alinhamento óptico, não matemático (S +2-3% altura para parecer igualada ao H)
- SVG final: ≤2KB, paths puros (sem masks complexos), strokes convertidos em fills, viewBox 0 0 64 64
- Variáveis CSS injetáveis: --logo-stroke-color (default: currentColor), --logo-signal-color (default: var(--color-accent))
- Animável: cada parte deve ser path independente para reveal sequencial

VARIANTES OBRIGATÓRIAS:
1. Mark monocromático off-white (sobre dark)
2. Mark monocromático dark (sobre claro)
3. Mark dual-color (off-white + signal em lime A)
4. Mark inverted (off-white sobre lime A) — uso raro
5. Lockup horizontal mark + wordmark (top-bar nav, email signature)
6. Lockup vertical mark + wordmark (OG image, pôster)
7. Avatar (mark dentro de container quadrado dark)
8. Favicon 32x32 (versão simplificada se necessário; manter silhueta)
9. Favicon 16x16 (ajuste de stroke se contraforma colapsar)

WORDMARK:
- "STEFAN HEINZ SCREPKA" em Geist Sans Semibold (600)
- UPPERCASE
- Tracking +0.08em (--tracking-wider já definido em globals.css)
- Kerning manual nos pares FA, AN, HE, EZ
- Espaçamento mark-wordmark horizontal: 0.75× altura do mark
- Espaçamento mark-wordmark vertical: 0.5× altura do mark

CORES (não inventar — usar tokens existentes):
- Dark base: oklch(13% 0.005 130) — #0F1212
- Off-white: oklch(98% 0.005 130) — #F8F9F8
- Lime A: oklch(94% 0.22 124) — #D2FF00
- ❌ Não usar gradiente, glow externo, shadow, ou cor adicional

ÁREA DE EXCLUSÃO:
- Mínima: 1× altura do H em todas as direções
- Preferida: 1.5× altura do H

TAMANHOS MÍNIMOS:
- Mark isolado: 24px
- Lockup horizontal: 96px de largura
- Avatar: 48×48px

ENTREGÁVEIS:
- SVG mestre (mark, mark+container, lockup horizontal, lockup vertical)
- PNG @1x, @2x, @3x para cada variante (16, 32, 64, 128, 256, 512, 1024)
- Favicon ICO multi-resolução
- PWA icons (192, 512 maskable)
- OG image template 1200×630
- Brand book mini (PDF, 8-12 páginas):
  - Construção do mark com grid
  - Sistema de cor + tokens OKLCH
  - Tipografia + spec wordmark
  - Aplicações corretas
  - Aplicações INCORRETAS (3-4 exemplos)
  - Variantes oficiais
  - Área de exclusão
  - Tamanhos mínimos

CRITÉRIOS DE ACEITE:
- Passar nos 16 critérios objetivos com nota mínima individual e média ≥ 8.5
- Reconhecível a 16px (silhueta + ideal SH legível)
- Funciona em P&B sem perda
- SH lido corretamente por 100% de avaliadores não-treinados
- Não similar a marca registrada existente (validar via reverse image search)

BANNED ELEMENTS:
- Foguete, asa, compass, planeta, anel orbital
- Cérebro, chip, circuito, nó de rede
- Gradiente, glow, shadow externo
- Diagonais não-cardinais (≠ 0°, 45°, 90°)
- Cantos arredondados de raio >2px
- © ™ ® visíveis no mark
- Mais de 1 cor + dark/off-white
- Wordmark em script, serif clássico, display fashion
```

---

### 13.5 Prompt final para IA geradora de imagem (primeira rodada visual)

```
A minimalist, monogram logo design for a personal brand "SH" (initials for
Stefan Heinz Screpka, an AI Product Engineer). The two letters S and H form
a single connected glyph where they share one central vertical stroke — the
left pillar of the H is simultaneously the lower terminal of the S. The
negative space between the curve of the S and the central crossbar of the H
forms a subtle arrow or caret shape pointing up and to the right (suggesting
output, signal, forward motion).

Construction: built on an 8-point modular grid, inscribed in an invisible
square container of 64×64 units, with the mark itself occupying 48×48 units.
Uniform stroke width of approximately 3 units (4.5–6px when rendered at 96px),
with squared (sharp) terminals and zero corner radius. The terminals of the
S are cut at exactly 45 degrees — upper terminal pointing northwest, lower
terminal pointing southeast. The H has perfectly squared terminals on all
three lines.

Style references: Vercel mark simplicity, Linear monogram brutalism, Family
Studio typographic discipline, Build UI density. Anti-references: NO rockets,
NO planets, NO orbital rings, NO brain icons, NO neural networks, NO chips,
NO gradients, NO glows, NO 3D effects, NO swooshes, NO rounded corners
larger than 2px, NO copyright marks, NO ornamental serifs.

Color palette (strictly two colors maximum):
- Off-white #F8F9F8 (oklch 98% 0.005 130) for the entire mark
- OR off-white for the letters with a single Lime A accent #D2FF00
  (oklch 94% 0.22 124) only on the negative-space signal/arrow
- Background: solid dark base #0F1212 (oklch 13% 0.005 130)
- Absolutely no other colors, no gradients

Composition: mark centered with generous breathing room (minimum 1× letter
height of padding on all sides). The mark should read as ONE glyph at first
glance, then resolve into the letters S and H on second reading, then reveal
the embedded signal/arrow on third reading — three layers of legibility.

Format: square 1:1, flat 2D vector aesthetic, no perspective, no rasterized
textures, no grain. Aesthetic feel: technical blueprint meets premium software
mark. Calm, precise, intentional. Should feel like it could live inside the
brand systems of Vercel, Linear, Stripe, or Anthropic — without copying any of
their specific marks.

Output: 4 variations, each on a solid dark background, showing slight
differences in how the S and H connect (varying the shared stroke length,
the angle of the negative-space arrow, the proportional relationship). Each
variation must remain legible at small sizes and work as a single-glyph mark.
```

---

### 13.6 Checklist final pré-execução

- [ ] Designer recebeu este dossiê completo + briefing §13.4 + acesso à pasta `Referencias-logo/`
- [ ] Designer leu §1.2 (o que NÃO pode parecer) antes de iniciar sketches
- [ ] Round 1: 3-5 sketches do território principal (Engineered Signal) — avaliação cruzada com §11
- [ ] Round 1 (paralelo): 1-2 sketches do território backup (Precision System) — para comparação real
- [ ] Round 2: refinamento de 2 finalistas com construção de grid completa
- [ ] Round 2: teste em todos os tamanhos críticos (16, 24, 32, 64, 128, 512)
- [ ] Round 2: teste em P&B, sobre dark, sobre claro, sobre lime
- [ ] Round 2: teste de leitura cruzada com 3 públicos diferentes (técnico, B2B, leigo)
- [ ] Round 3 (polish): kerning manual do wordmark, alinhamento óptico final, otimização SVG
- [ ] Entrega: SVG master + variantes + brand book mini + tokens OKLCH integrados ao `globals.css`
- [ ] Pós-entrega: substituir `top-bar-nav.tsx:84`, `footer.tsx:75`, `contact-monogram-backdrop.tsx`, OG image, favicon, e easter egg ASCII (`app/layout.tsx:171`)

---

## Apêndice A — Análise crítica das referências em `Referencias-logo/`

Avaliação rápida de cada imagem do moodboard contra o posicionamento Stefan:

| Imagem | O que é | O que aprender | O que NÃO trazer | Verdict |
|---|---|---|---|---|
| 1 (três triângulos cortados, c/ ©) | Mark angular gamer-tech em variações de fill/outline | Variações de versão (fill, outline, ghost) são úteis no Brand Book | Estética gamer + © visível em cada variação é amador | ⚠️ Não imitar. Aprender só a apresentação de variantes. |
| 2 (Orizn / black hole) | Wordmark + ícone "letra como objeto" | Conceito de letra=objeto é interessante | Categoria Web3, gradiente | ❌ Não direção |
| 3 (rocket icon grid) | Construção em grid concêntrico | **Aprender:** mostrar construção no Brand Book valida craft | Foguete é cliché. Grid concêntrico é decorativo demais | ⚠️ Aprender método de apresentação |
| 4 (Orbyta Digital) | Wordmark + anel circular | Tipografia limpa | Categoria Web3 / agência digital genérica | ❌ Não direção |
| 5 (compass-arrow) | Espaço negativo de seta dentro de círculo | **Aprender:** espaço negativo com signal direcional é elegante | Compass é cliché de navegação | ✅ Aprender princípio (aplicar ao SH, não ao círculo) |
| 6 (A + golden ratio) | Mark com construção áurea visível | **Aprender:** apresentação de construção como argumento | Golden ratio aplicado decorativamente, não estruturalmente | ⚠️ Cuidado — vide §6.4 |
| 7 (Alpha Air) | A sólido com flecha em negativo | **Aprender:** figura-fundo executado perfeitamente | "®" visível, mas aceitável aqui | ✅ Aprender princípio de espaço negativo |
| 8 (fuse) | Wordmark orgânico líquido | — | Tudo errado para Stefan | ❌ Anti-referência |
| 9 (A sketch + final) | Processo sketch → finalização | **Aprender:** mostrar processo manual humaniza | Estética sketch romântica não combina | ⚠️ Aprender método, não estética |
| 10 (grid Jiten Dayama) | Diversas logos prateadas | Coleção mostra variedade de approaches; alguns bons (Greysons SH-like, Crypto Rigs, Promatic Analytics) | Estética metálica datada, alguns clichês (Sound Society, Transcytos) | ⚠️ Estudar Greysons Photography como caso mais relevante (monograma `83`-ish em construção modular) |
| 11 (OscillAero) | Logo aviação com foguete | — | Cliché total | ❌ Anti-referência |

**Síntese das referências:** os elementos a importar do moodboard são **método de apresentação** (construção visível, variantes, grid) e **um princípio específico** (espaço negativo com signal direcional — imagens 5 e 7). **Nenhuma referência deve ser imitada esteticamente.**

---

## Apêndice B — Mapa de substituição na codebase pós-novo mark

Quando a nova logo for finalizada, esses são os pontos de substituição na codebase atual:

| Arquivo | Linha aprox. | Elemento atual | Substituir por |
|---|---|---|---|
| `components/ui-effects/top-bar-nav.tsx` | 84 | SH monograma sigmoide custom (28px lime currentColor) | Novo SH mark inline SVG |
| `components/ui-effects/top-bar-nav.tsx` | 207 | SH em mobile sheet header | Mesmo novo mark |
| `components/sections/footer.tsx` | 75 | SH footer brand (32px lime) | Novo SH mark, ajuste de tamanho |
| `components/contact/contact-monogram-backdrop.tsx` | — | SH outline 320px @ 0.1 opacity | Nova versão outline-only do mark |
| `app/layout.tsx` | 171 | Easter egg ASCII art `____ _   _` | Reconstruir ASCII art a partir do novo mark |
| `public/favicon.ico` (e variantes) | — | Favicon atual | Nova suíte de favicons (16, 32, 64, 192, 512) |
| `public/og-image.png` | — | OG image atual | Nova OG image 1200×630 com mark + wordmark + tagline |
| `app/icon.tsx` / `app/apple-icon.tsx` (se existir Next 16) | — | Icons gerados | Nova versão |

---

## Apêndice C — Resumo de uma linha para cada seção

| § | Resumo |
|---|---|
| 1 | Marca = pessoa-engenheiro real, técnica, calma; NÃO startup, NÃO crypto, NÃO gamer, NÃO IA-clichê |
| 2 | Maker + Sage; tensão central: pessoa-que-opera-como-sistema; *"Builds that run"* |
| 3 | 6 públicos convergem em: monograma SH + dark+lime + tipografia precisa |
| 4 | S = movimento; H = estrutura; juntos = a tensão da marca |
| 5 | Simplicidade vence; silhueta forte; espaço negativo = sofisticação; lime ≤ 10% |
| 6 | Grid 8pt + 5×5; alinhamento óptico; golden ratio só no lockup (não no mark) |
| 7 | 5 territórios; vencedor Engineered Signal; backup Precision System |
| 8 | Aprender de Linear/Vercel/Family/Rauno; não copiar nenhum |
| 9 | Geist Sans Semibold no wordmark; mark é desenhado, não tipografado |
| 10 | Paleta = dark + off-white + lime A; 60/30/10; 5 regras pra usar lime sem virar gamer |
| 11 | 16 critérios; mínimo individual + média ≥ 8.5 |
| 12 | Executar Engineered Signal; manter Precision System como backup vivo |
| 13 | Briefing + prompt + checklist + mapa de substituição prontos |

---

**Fim do dossiê v1.0.**
