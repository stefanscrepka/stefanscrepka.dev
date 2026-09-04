# Stefan TODO — Ações humanas pré-launch

> Tudo que **você** precisa fazer (assets, configs externas, validações).
> Código já está pronto — esses itens dependem de você abrir dashboards, gravar coisas, mexer em DNS, etc.
>
> **Convenção**: 🔴 = blocker (launch quebra) · 🟠 = should-fix (launch funciona mas perde qualidade) · 🟢 = nice-to-have (pós-launch ok)
>
> **Tempo total estimado**: 3–4 horas de trabalho humano focado (sem contar gravação de screencast/screenshots, que depende de você).

---

## 🔴 F8 (2026-09-05) — decisões que ficaram com você (evidência no `ROADMAP.md` → FASE 8)

> Assinatura de volta ao scroll (sobre o ductus novo), Contact no fluxo normal como em 25/05, hero em duas colunas com o turno de hoje, card 3D com o LEVITA v4 + o hub da STARK + a peça de CAD (bola, patch, foto do Vasco e Correnteza fora), cursor de mira, e-mail copiável, pausa que também para a marquee, coordenada no rodapé. Acervo inteiro varrido (2.240 itens; fila em `_audit/f8/research-acervo-digest.md`). Commits em série na `f5/polish`, enviados.

1. **Peça de CAD**: cliente segue anonimizado. Nomear é com você.
2. **Escudos de clube**: o card diz "estudo pessoal". A memória do projeto registra a dúvida da Lei Pelé art. 87 pra venda; mostrar não é vender.
3. **Hub da STARK**: a coreografia foi medida do vídeo de referência do cliente; a legenda não diz "conceito original". Se quiser, escrevo isso no card.
4. **Cursor de mira**: se incomodar, é um componente só (`components/ui-effects/target-cursor.client.tsx`), montado no `app/layout.tsx`.
5. **Fila do acervo**: ⌘K (21st/command-menu), índice do Other Work com preview (hyperiux/hover-slider), painel Lighthouse no case (lightswind/casestudy05), ASCII no avatar (componentry/ascii-effect). Diga quais quer.
6. **Hero**: peso do H1 (600; cânone 400–510), vinheta de topo e blur da nav são três subtrações que a pesquisa recomenda e eu não fiz sem você ver o hero novo primeiro.

---

## 🔴 F7 (2026-09-04, noite) — decisões que ficaram com você (evidência no `ROADMAP.md` → FASE 7)

> Segunda passada depois do seu feedback: assinatura escrita no tempo a partir do esqueleto do fill, Contact sem invadir o manifesto, Caluna no lugar do NexaCore (rota, copy, capturas do build atual), números conferidos no código (19 agentes, 57 tabelas, 2.059 testes, 28 regex; "LGPD compliance" saiu porque não existe), zero travessão no texto visível, capturas refeitas no pixel 0 com as animações congeladas, visualizador 3D com três meshes reais, rodapé revelado no fim (acervo), bento com o ledger do cron, /privacidade pela metade. Lighthouse perf 0.98–0.99 · a11y 1.00 · CLS 0 · s10 14/14 · f4 6/6 · e2e 25/25.

1. ~~**A bola do viewer 3D**~~ — ✅ F8: você disse que não é sua; saiu. O viewer mostra o LEVITA Grêmio (cores reais do 3MF) e a peça de CAD.
2. **Peça de CAD no viewer**: cliente anonimizado ("uma fabricante de painéis"). Se puder nomear a Arauco, eu nomeio.
3. ~~**Tempo da assinatura**~~ — ✅ F8: voltou a ser guiada pelo scroll (janelas em `STROKE_TIMING`, frações do range do sticky).
4. **Commit**: F5 + F6 + F7 sem commit. `git add -A && git commit` quando quiser.

---

## 🔴 F6 (2026-09-04) — decisões que ficaram com você (evidência no `ROADMAP.md` → FASE 6)

> Feito sem commit na `f5/polish`: fumaça verde removida (tokens glow → anel, molduras sem halo/tilt, hero/contact sem blur), SVGs desenhados → capturas reais + código verbatim, STJ App → STARK, moldura `ArtifactFrame` com procedência. Lighthouse perf 0.98–0.99 · a11y 1.00 · CLS 0 · s10 14/14 · f4 6/6 · e2e 25/25.

1. ~~**22 agentes**~~ — ✅ F7: o site diz **19 agentes em 5 squads (mais 6 no onboarding)** em todos os pontos, como o registro do Studio.
2. **STARK · confidencialidade** — cliente anonimizado no site, mas a captura do relatório mostra o nome do produto da linha ("LP OSB APA PLUS…") e o supervisor do seed. Aprovar ou eu recorto/troco a tela.
3. ~~**NexaCore virou Caluna**~~ — ✅ F7: você confirmou; o case é `/work/caluna` (redirect do antigo), copy e capturas do build atual. Também: **striveos.shop está fora do ar (HTTP 522)** e o seed local expôs 4 bugs no produto (Agenda soma preços como string → R$ 8.001.200.180,00; Pagamentos R$ 21.800,00 vs R$ 2.180,00; "Invalid Date" no dashboard; saudação "Usuário") + drift de migração (`P2022 googleDriveEnabled`).
4. **Clerk dev** — o subagente criou o usuário de teste `stefan+clerk_test@example.com` na instância dev pra logar; apague no dashboard do Clerk se não quiser. Containers/volumes `nexacore-shots-*` também são dele (removíveis).
5. **Repo privado** — `github.com/stefanscrepka/content-engine` é privado; o CTA do case virou âncora ("Ver o produto rodando ↓"). Publicar o repo = eu volto o link.
6. **Tokens × brand book** — site renderiza `#070806` / `#CDFF35`; brand book v1 diz `#030403` / `#C7FF00` / `#F2EFEC` / `#9A9A95`. Uma fonte da verdade.
7. **Commit** — F5 + F6 estão sem commit (patch de segurança do F5 no temp). Quando quiser: `git add -A && git commit`.
8. **Servidores** que deixei rodando pra re-captura (pode matar tudo): runtime CE :4010 · Studio :3200/:3201 · STARK :3300 · Caluna :3600 · estáticos :3400/:3500/:3700 · portfolio :3001.

---

## 🟠 F5 (2026-09-02) — decisões que ficaram com você (evidência no `ROADMAP.md` → FASE 5)

1. **22 vs 24 agentes** — ~~diagrama soma 24~~ (diagrama removido em F6; agora é 22 × 19+6 do registro real — ver F6 #1).
2. **"100+ testes runtime"** → número exato e datado (ex.: "117 testes · set/2026").
3. ~~**Screenshot real do Content Engine**~~ — ✅ F6: Studio real (Equipe/Hoje/Marca, marca SK3D, runtime scripted) na flagship, no índice e no case.
4. **Vídeo do hero**: manter (agora quase-mono), regravar/gradar, ou só atmosfera.
5. **INFRA**: (b) aplicado como interim (superfícies de runtime, sem ping/"ok"); (c) dado real segue em aberto.
6. **PP Editorial New**: licença ambígua → Instrument Serif Italic (OFL) ou licença web (~US$40).
7. **Tokens × brand book**: `--color-bg` #070806 vs #0F1212; accent #CDFF35 vs #D2FF00 — escolher a fonte da verdade.
8. **3D**: nada no hero; Fase 0 = redesenhar o SH (vetor limpo), Fase 1 = bake em Blender no Contact; CSP sem WASM é decisão separada.
9. **Geist subsetting** via next/font/local (~80 KB) — Google Fonts Geist perde `ss01`.

---

## 🔴 BLOCKERS — sem isso não pode lançar

### 1. Screenshots reais Content Engine + NexaCore (1–2h) — ✅ Content Engine resolvido em F6 · NexaCore = decisão F6 #3

> **F6 (2026-09-04)**: os SVGs saíram. Content Engine = capturas reais do Studio (`content-engine-{agentes,hoje,marca}.avif`). NexaCore = capturas de produção 4K (tenant vazio) enquanto você decide NexaCore × Caluna. O roteiro abaixo fica só como referência do formato.

**O que**: substituir os 2 SVG diagrams placeholder por screenshots reais dos produtos rodando.

**Por quê**: hoje a Hero tile flagship (Content Engine) é um **diagrama desenhado**, não evidência. Recruiter/cliente olha e pensa "ele tem mockup, não produto". É o maior gap visual vs Vercel/Linear-tier portfolios.

**Como fazer**:

1. **Content Engine** — escolher uma das duas:
   - **Option A (recomendado)**: gravar **screencast curto MP4 (3-5s loop)** do Telegram bot recebendo um draft + você aprovando. Use OBS Studio ou Loom. Exportar como MP4 H.264 480p (~150KB) + WebM VP9 (~120KB).
   - **Option B (mais simples)**: **screenshot PNG** do terminal rodando squads + uma captura do Telegram aberto com cards de aprovação. Captura tela completa, crop pra 16:10 (1920×1200).

2. **NexaCore** — screenshot do dashboard admin em produção:
   - Abrir `striveos.shop` em modo logado
   - **Captura DESKTOP** 1920×1200 do dashboard com dados realistas (pode mascarar nomes de clientes com gradient blur se preferir)
   - Bonus: captura mobile 390×844 do dashboard responsivo

3. **Converter pra AVIF + WebP** (já temos `ffmpeg` instalado):
   ```bash
   # PNG → AVIF (50% menor)
   ffmpeg -i content-engine-desktop.png -c:v libaom-av1 -crf 32 -still-picture 1 -cpu-used 4 content-engine-desktop.avif

   # PNG → WebP (fallback)
   ffmpeg -i content-engine-desktop.png -c:v libwebp -quality 80 content-engine-desktop.webp
   ```

4. **Salvar em**:
   - `public/work-screenshots/content-engine-desktop.avif`
   - `public/work-screenshots/content-engine-desktop.webp` (opcional fallback)
   - `public/work-screenshots/nexacore-admin.avif`
   - `public/work-screenshots/nexacore-admin.webp` (opcional)

5. **Atualizar código** (eu posso fazer quando você dropar os arquivos):
   - `lib/work/data.ts:100` → `screenshot: '/work-screenshots/content-engine-desktop.avif'`
   - `lib/work/data.ts:148` → `screenshot: '/work-screenshots/nexacore-admin.avif'`
   - Adicionar `heroAsset: { src, type: 'image', aspect: '16/10' }` em ambos

**Onde drops**: `public/work-screenshots/`

**Impacto**: maior salto visual do site. Sai de "freelancer com mockups" pra "engineer com produto rodando".

---

### 2. Avatar pro JSON-LD Person (15 min)

**O que**: foto sua quadrada (800×800 ou 1024×1024) salva como `public/avatar-stefan.avif`.

**Por quê**: o schema `Person` em `app/layout.tsx` referencia `image: ${baseUrl}/avatar-stefan.avif`. Sem isso, o Google Knowledge Panel não tem foto sua (recruiter pesquisando seu nome não vê seu rosto).

**Como fazer**:

1. Tirar/escolher foto sua frontal, profissional, fundo neutro (pode ser o mesmo da `components/sections/contact.tsx:46` se quiser reuse)
2. Crop quadrado (800×800 mínimo)
3. Converter pra AVIF:
   ```bash
   ffmpeg -i foto-original.jpg -vf scale=800:800 -c:v libaom-av1 -crf 28 -still-picture 1 -cpu-used 4 avatar-stefan.avif
   ```
4. Drop em `public/avatar-stefan.avif`

**Onde**: `public/avatar-stefan.avif`

**Impacto**: Google Knowledge Panel + rich snippets em SERP de pessoa.

---

### 3. Vercel env vars no dashboard (15 min)

**O que**: configurar todas as env vars no projeto Vercel.

**Por quê**: sem essas, contact form não envia email, Sentry não captura erros, BotID não protege.

**Como fazer**:

1. Abrir https://vercel.com/dashboard → selecionar o projeto `stefanscrepka-dev`
2. **Settings → Environment Variables**
3. Adicionar cada uma abaixo (todas pra **Production + Preview**, marcar **Sensitive** as flagged):

| Variável | Valor | Sensitive? |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | `https://stefanscrepka.dev` | ❌ |
| `NEXT_PUBLIC_SENTRY_DSN` | seu DSN público do Sentry | ❌ |
| `SENTRY_DSN` | mesmo DSN | ❌ |
| `SENTRY_AUTH_TOKEN` | token de releases (passo 5 abaixo) | ✅ |
| `SENTRY_ORG` | slug da sua org Sentry | ❌ |
| `SENTRY_PROJECT` | slug do projeto Sentry | ❌ |
| `RESEND_API_KEY` | sua API key Resend (começa com `re_`) | ✅ |
| `CONTACT_TO_EMAIL` | `stefanheinz2006@gmail.com` | ❌ |
| `CONTACT_FROM_EMAIL` | `Stefan <hello@stefanscrepka.dev>` | ❌ |
| `NEXT_PUBLIC_CAL_USERNAME` | `stefanscrepka` (ou outro slug seu Cal.com) | ❌ |
| `NEXT_PUBLIC_CAL_EVENT_TYPE` | `15min` | ❌ |

4. Salvar. Vercel rebuilda automaticamente no próximo deploy.

**Onde**: Vercel dashboard → Project Settings → Environment Variables

**Impacto**: form, Sentry, Cal.com funcionam em prod.

---

### 4. Resend — domain verified + DKIM/SPF/DMARC (30 min)

**O que**: verificar o domínio `stefanscrepka.dev` no Resend pra emails saírem do `hello@stefanscrepka.dev` sem cair em spam.

**Por quê**: sem DKIM/SPF/DMARC, Gmail/Outlook marcam os emails do contact form como spam OU bloqueiam totalmente. Sua reputação SMTP morre rápido.

**Como fazer**:

1. Login em https://resend.com/domains
2. **Add domain** → `stefanscrepka.dev`
3. Resend mostra 3 records DNS (TXT MX + DKIM CNAME + SPF TXT):
   ```
   Type    Name              Value
   MX      send              feedback-smtp.us-east-1.amazonses.com (priority 10)
   TXT     send              "v=spf1 include:amazonses.com ~all"
   TXT     resend._domainkey "p=MIGfMA0GCSq..." (key longa)
   ```
4. Ir no seu registrar de DNS (provavelmente onde stefanscrepka.dev está registrado):
   - Se DNS está na **Vercel** (recomendado): https://vercel.com/[seu-team]/[projeto]/settings/domains → DNS records → adicionar os 3.
   - Se está em registrar externo (Hostinger, Cloudflare, GoDaddy): adicionar lá.
5. Voltar no Resend → clicar **Verify**. Pode demorar 5-30min pra DNS propagar.
6. **Bonus DMARC** (recomendado): adicionar TXT no DNS:
   ```
   Type   Name    Value
   TXT    _dmarc  "v=DMARC1; p=quarantine; rua=mailto:stefanheinz2006@gmail.com"
   ```
7. Criar API key em https://resend.com/api-keys → escopo **Full access** → copiar a key (começa com `re_`) → colar no Vercel env var `RESEND_API_KEY`.

**Onde**: Resend dashboard + DNS provider

**Impacto**: emails saem com DMARC pass + chegam no inbox (não spam).

**Teste pós-config**: depois de deployar, enviar mensagem teste pelo form do site. Você deve receber 1 email (notification) + o "remetente" deve receber 1 email (auto-reply) com header `Authentication-Results: spf=pass dkim=pass dmarc=pass`.

---

### 5. Sentry project + auth token (20 min)

**O que**: criar projeto Sentry + auth token pro Vercel subir sourcemaps no build.

**Por quê**: sem isso, stack traces em prod chegam minified (`a.js:1:2840`). Impossível debugar incidente.

**Como fazer**:

1. Login em https://sentry.io (ou criar conta gratuita — free tier 5k errors/mês cobre portfolio pessoal)
2. **Create Project** → platform: **Next.js** → nome: `stefanscrepka-dev`
3. Copiar o DSN (formato `https://xxx@oXXX.ingest.us.sentry.io/YYY`) → colar nas vars `SENTRY_DSN` e `NEXT_PUBLIC_SENTRY_DSN` do Vercel (passo 3)
4. **Settings → Auth Tokens** → **Create New Token** → escopo: marcar **project:releases** + **project:read** → copiar → colar em `SENTRY_AUTH_TOKEN` do Vercel
5. Pegar `SENTRY_ORG` (slug da sua org, ex: `stefan-screpka`) e `SENTRY_PROJECT` (`stefanscrepka-dev`) → colar nas vars
6. **(Opcional)** Configurar alerts em **Alerts → Create Alert**:
   - Alert 1: `Issue is first seen` → email
   - Alert 2: `Event count > 10 in 1h` → email
   - Alert 3: Resend send failure spike → custom event, depois

**Onde**: sentry.io dashboard

**Impacto**: stack traces desminificados + alerts em produção.

---

### 6. Cal.com username (5 min)

**O que**: confirmar que `cal.com/stefanscrepka/15min` existe e funciona.

**Por quê**: o modal Cal.com no site usa essa URL. Se o slug for diferente, modal quebra.

**Como fazer**:

1. Abrir https://cal.com/stefanscrepka — confirma que carrega seu calendário
2. Confirmar que o event type `15min` existe na sua conta
3. Se o seu slug for diferente (ex: `stefan-h-screpka`), atualizar:
   - Vercel env var `NEXT_PUBLIC_CAL_USERNAME=stefan-h-screpka`
   - `app/layout.tsx` Person `sameAs` (atualmente aponta pra `cal.com/stefanscrepka`)
   - `lib/work/data.ts` qualquer link `cal.com/stefanscrepka` referenciado

**Onde**: cal.com

**Impacto**: modal Cal funciona em prod.

---

### 7. DNS — stefanscrepka.dev → Vercel (10 min + propagação até 24h)

**O que**: apontar o domínio `stefanscrepka.dev` pra Vercel.

**Por quê**: sem isso o site fica acessível só pelo URL `*.vercel.app` (não no domínio custom).

**Como fazer**:

1. Vercel dashboard → projeto → **Settings → Domains** → **Add** → digitar `stefanscrepka.dev`
2. Vercel mostra os DNS records que você precisa criar no registrar:
   - **Opção A — Apex (recomendado)**:
     ```
     Type   Name   Value
     A      @      76.76.21.21
     ```
   - **Opção B — Nameservers Vercel** (mais simples): trocar nameservers do registrar pros da Vercel
3. Adicionar `www` como redirect pro apex:
   ```
   Type    Name   Value
   CNAME   www    cname.vercel-dns.com
   ```
4. (Bonus) Configurar `stefanscrepka.com.br` como redirect 301 pra `.dev`:
   - Adicionar como secondary domain no Vercel → marcar como "Redirect to stefanscrepka.dev"

**Onde**: registrar de domínio (provavelmente Hostinger, Cloudflare, ou Vercel se já registrou lá)

**Impacto**: site acessível em `https://stefanscrepka.dev` com SSL automático.

**Teste pós-config**: `nslookup stefanscrepka.dev` deve retornar o IP Vercel (76.76.21.21).

---

### 8. Bento "22 agentes" — vídeo Telegram HITL OU diagram orbital (1h)

**O que**: substituir o número gigante "22" no Bento Skills (XL cell IA AGENTIC) por evidência real.

**Por quê**: hoje é um **stub admitido em código** (`bento-skills.client.tsx:147` comment: "Wave 1 stub: count textual mono grande. Wave 4 vai substituir por <video> real do Telegram HITL"). Lançar com dívida exposta = anti-Vercel.

**Como fazer** (escolha uma):

- **Option A — Vídeo Telegram HITL real** (recomendado):
  1. Gravar screencast curto MP4 do seu Telegram recebendo cards de aprovação (mesmo asset do item 1)
  2. Edit pra loop 4-6s sem áudio
  3. Salvar em `public/bg/bento-telegram-hitl.mp4` + `.webm` (~80-150KB cada)
  4. Me chama e eu substituo o stub no código

- **Option B — Diagram orbital SVG estático**:
  1. 5 dots em círculo (5 squads) + 22 dots menores ao redor (agentes) + 1 dot central lime (HITL human)
  2. Pode ser SVG inline ou Figma export
  3. Eu posso gerar o SVG se você descrever a estrutura
  4. Salvar em `public/diagrams/bento-orbital.svg`

**Onde**: gravar via OBS/Loom, salvar em `public/bg/`

**Impacto**: remove o último "stub admitido" do site.

---

## 🟠 SHOULD DO — antes ou logo após launch

### 9. Validar OG image em todos os canais (10 min)

**O que**: testar como o link do site aparece quando compartilhado.

**Por quê**: a OG image foi feita mas pode quebrar em Slack/Twitter/LinkedIn/WhatsApp por:
- Cache antigo
- Tamanho errado
- MIME type

**Como fazer**:

1. Deployar o site primeiro (precisa estar online em `stefanscrepka.dev`)
2. Abrir https://www.opengraph.xyz/ → colar `https://stefanscrepka.dev` → ver preview
3. Validar nos canais reais:
   - **LinkedIn**: https://www.linkedin.com/post-inspector/ → colar URL
   - **Twitter/X**: https://cards-dev.twitter.com/validator (legacy mas funciona)
   - **Slack**: cole o URL num canal de teste
   - **WhatsApp**: envie o URL pra você mesmo (pelo desktop ou web.whatsapp)
4. Validar todas as rotas:
   - `/` (home)
   - `/work` (index)
   - `/work/content-engine`
   - `/work/nexacore`
   - `/work/stj-app`
   - `/work/estetica-md`
   - `/process`
   - `/privacidade`

**Onde**: opengraph.xyz + LinkedIn Inspector + outros

**Impacto**: garante que cada link compartilhado mostra OG correta.

---

### 10. Google Search Console (10 min)

**O que**: registrar o site no Google Search Console + submeter sitemap.

**Por quê**: sem isso o Google demora 2-4 semanas a descobrir o site naturalmente. Com sitemap submitted, indexa em 24-48h.

**Como fazer**:

1. Abrir https://search.google.com/search-console
2. **Add property** → escolher **Domain property** (verifica o domínio inteiro, melhor que URL prefix)
3. Verificar via DNS record TXT (Google fornece o token):
   ```
   Type   Name   Value
   TXT    @      google-site-verification=ABC123...
   ```
4. Adicionar no DNS do Vercel/registrar → aguardar verificação
5. **Sitemaps** → adicionar `https://stefanscrepka.dev/sitemap.xml`
6. **(Opcional)** Submeter URLs específicas pra indexação manual: **URL Inspection** → colar URL → "Request indexing"

**Onde**: search.google.com/search-console

**Impacto**: SEO discovery rápido + insights de queries no Performance tab.

---

### 11. Sentry alerts no dashboard (10 min)

**O que**: configurar alertas pra você ser notificado quando algo quebra em prod.

**Por quê**: sem alerts, você descobre que algo quebrou só quando user te avisar (ou nunca).

**Como fazer**:

1. Sentry dashboard → projeto → **Alerts** → **Create Alert**
2. Configurar 3 alertas básicos:
   - **Issue Alert 1**: `When` → `A new issue is created` → `Then` → email pra você
   - **Issue Alert 2**: `When` → `The issue is unresolved and event count > 10 in 1h` → email
   - **Metric Alert**: `When` → `count(events) by route > 50 in 5min` → email + Slack se tiver

**Onde**: sentry.io → projeto → Alerts

**Impacto**: você sabe quando algo quebra em <5min após acontecer.

---

### 12. Hero video VEO — regerar sem watermark (opcional — 15 min se quiser)

**O que**: o vídeo `hero-loop.mp4`/`.webm` foi gerado pelo Google VEO e tem watermark. Eu mascarei via CSS overlay no canto inferior-direito (Sprint 3.16), mas se quiser limpar de vez:

**Por quê**: o CSS overlay funciona mas é uma "tapa-buraco". Vídeo limpo é melhor pra desktop landscape onde a watermark fica mais visível.

**Como fazer**:

1. Re-gerar o vídeo no VEO com prompt mais específico (talvez pedindo loop seamless) — testar prompts variados
2. **OU** usar `ffmpeg` pra crop a watermark physically:
   ```bash
   # Crop bottom 50px do video (remove watermark VEO típica)
   ffmpeg -i hero-loop.mp4 -filter:v "crop=in_w:in_h-50:0:0" hero-loop-cropped.mp4
   ```
3. **OU** usar ferramenta de remoção de watermark (RunwayML inpainting, etc)
4. Reencodar:
   ```bash
   ffmpeg -i hero-loop-clean.mp4 -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart hero-loop.mp4
   ffmpeg -i hero-loop-clean.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 hero-loop.webm
   ```
5. Substituir em `public/bg/`

**Onde**: ferramenta de geração + ffmpeg local

**Impacto**: hero limpo. Se preferir manter o video atual com a máscara CSS, fica ok.

---

### 13. PNG icons PWA Android (15 min — opcional)

**O que**: ícones 192×192 e 512×512 PNG pro manifest (PWA install Android).

**Por quê**: hoje o `app/manifest.ts` só tem SVG icon. Chrome Android exige PNG raster pra critério de "installability".

**Como fazer**:

1. Pegar o SHMonogram SVG do site (deve estar em `public/icons/icon.svg`)
2. Converter pra PNG:
   ```bash
   # 192×192
   ffmpeg -i icon.svg -vf scale=192:192 icon-192.png
   # 512×512
   ffmpeg -i icon.svg -vf scale=512:512 icon-512.png
   # Maskable 512 (safe area de 80% pra adaptive icons)
   # Pode usar https://maskable.app/editor pra preview + export
   ```
3. Salvar em `public/icons/icon-192.png` + `public/icons/icon-512.png` + `public/icons/icon-512-maskable.png`
4. Me chama pra atualizar `app/manifest.ts` adicionando esses entries

**Onde**: `public/icons/`

**Impacto**: Add-to-Home-Screen funciona em Android Chrome.

**Nota**: iOS já funciona com o SVG via `apple-icon.tsx`. PWA Android é só pra usuário Android instalar como app.

---

### 14. HSTS preload submission (após 30 dias — V1.1)

**O que**: submeter `stefanscrepka.dev` ao HSTS preload list pra browsers rejeitarem HTTP totalmente.

**Por quê**: você já tem `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` no header (config em `next.config.ts`). Submitir na lista oficial torna isso ainda mais hard (browser nem tenta HTTP).

**Como fazer**:

1. Esperar 30 dias de site rodando em prod sem issues HTTPS
2. Abrir https://hstspreload.org/?domain=stefanscrepka.dev → verificar critérios
3. Submeter pra lista (depois disso, voltar pra HTTP fica difícil — só faça quando tiver certeza que SSL é permanente)

**Onde**: hstspreload.org

**Impacto**: security hardening pro browser nunca aceitar HTTP.

---

## 🟢 NICE TO HAVE — pós-launch

### 15. Bing Webmaster Tools (5 min)

Mesmo padrão do Google Search Console mas pro Bing.
https://www.bing.com/webmasters → Add site → importar do Google Search Console (one-click).

### 16. Uptime monitoring (10 min)

Free tier: https://betterstack.com/uptime (10 monitors free) ou https://uptimerobot.com (50 monitors).
- Adicionar HTTPS check em `stefanscrepka.dev`
- Adicionar SSL expiry monitor
- Webhook pro seu Telegram/email quando offline

### 17. Vercel BotID Deep Analysis ($1/1000 calls — opcional)

O Basic BotID já está ativo (cobrado $0). Deep Analysis é opt-in pago.
Vercel dashboard → projeto → **Firewall** → **Rules** → enable **Vercel BotID Deep Analysis**.
Faz sentido se você começar a receber spam mesmo com Basic.

---

## ✅ Pré-launch final checklist

Quando todos os itens 🔴 estiverem feitos, antes de promover deploy production:

- [ ] Vercel build verde (sem warnings vermelhos)
- [ ] Lighthouse mobile ≥85 em `pnpm build && pnpm start`
- [ ] Lighthouse desktop ≥95
- [ ] Form de contato testado em prod (mensagem chega no email + auto-reply chega no remetente)
- [ ] Cal.com modal abre + fecha em mobile e desktop
- [ ] OG image válida em LinkedIn Inspector
- [ ] DNS apontando corretamente (`nslookup stefanscrepka.dev` → IP Vercel)
- [ ] SSL HTTPS funcional + certificado válido
- [ ] 404 page testada (`/asdasd` mostra `app/not-found.tsx`)
- [ ] Console limpo (sem 404s nem warnings)
- [ ] `robots.txt` acessível em `/robots.txt`
- [ ] `sitemap.xml` acessível em `/sitemap.xml`
- [ ] Google Search Console verificado + sitemap submitted
- [ ] Sentry capturando errors (testar com `/sentry-throw-test` fake route)

---

## Próximos passos

1. Faz os 🔴 itens 1-7 nesta ordem (você não precisa do 8 imediatamente — pode lançar com o stub se quiser)
2. Quando dropar os assets (screenshots, avatar), me chama e atualizo `lib/work/data.ts` em 2 minutos
3. Faz o deploy preview (`vercel`) primeiro pra testar — só promove production (`vercel --prod`) depois de validar
4. Roda Lighthouse no preview pra ver o score real

Qualquer item, me chama que te ajudo a executar ou troubleshootar.
