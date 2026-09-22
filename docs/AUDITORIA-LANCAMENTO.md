# Auditoria pré-lançamento — Hotel Cajueiro Guarujá

> Auditoria de arquitetura, conteúdo, SEO, mobile e conversão feita com o site
> no estado do commit `a21efa1`. As correções marcadas **[FEITO]** já estão
> aplicadas no código. As marcadas **[PRECISA DO HOTEL]** dependem de informação
> real que não existe no projeto — nada foi inventado.

---

## Resposta à pergunta final

**"Se um visitante chegar hoje procurando um hotel no Guarujá, ele encontra tudo
que precisa e consegue entrar em contato para reservar?"**

Antes desta auditoria: **não.** O site apresentava bem o hotel, mas os dois
caminhos de conversão estavam quebrados:

1. O botão mais repetido do site inteiro ("Reservar agora", no CTA acima do
   rodapé de **todas** as páginas) levava para `/contato`.
2. `/contato` era só um formulário — sem telefone, sem WhatsApp, sem endereço,
   sem horários, sem mapa — e **o formulário sempre falhava**: fazia POST nativo
   para `/api/subscribe`, que espera JSON e devolvia `400 {"error":"Body inválido."}`
   na cara do visitante. Mesmo se funcionasse, o endpoint é de newsletter: a
   mensagem e o telefone eram descartados e nunca chegavam ao hotel.
3. Os CTAs "Reservar" espalhados na home (`#reservar`) rolavam para o CTA do
   rodapé, não para o buscador de datas. E os CTAs dos artigos apontavam para
   `/` (topo da home, sem levar a nada).

Ou seja: o motor de reservas (hbook/hsystem, já integrado e funcionando) era
alcançável **apenas** por quem usasse a barra de busca da home. Todo o resto do
site desembocava num beco sem saída.

Depois das correções deste documento: **sim, com ressalvas** — as ressalvas estão
na seção [Checklist de lançamento](#4-checklist-de-lançamento), e as críticas
restantes são todas de informação que só o hotel tem.

---

## 1. Mapa atual

### Páginas públicas

| Rota | O que é | Estado |
|---|---|---|
| `/` | Home. 14 seções: hero com buscador de datas ligado ao motor hbook, banner, 3 features, intro, acomodações (5 suítes), estrutura (14 itens), galeria com lightbox, arredores, piscina + localização, diferenciais, modalidades (corporativo/grupos), depoimentos, FAQ, como chegar, CTA final | Boa base, tinha seções redundantes |
| `/corporativo` | Landing de hospedagem corporativa. Hero, diferenciais, para quem é, acomodações, estrutura, galeria, onde estamos, localização, como chegar, modal de contato → WhatsApp + formsubmit | Funcional |
| `/grupos-e-excursoes` | Landing de grupos/excursões. Mesma estrutura da corporativa | Funcional |
| `/blog` | Listagem simples dos 6 artigos (título, categoria, data, thumb) | Funcional, cru |
| `/contato` | Hero + formulário | **Estava quebrada** |
| `/[slug]` | Template de artigo. Card de reserva sticky no desktop, CTA inline distribuído no corpo, FAQ fixa do hotel convertida em accordion, CTA grande no fim, relacionados | Boa |
| `/categoria/[slug]` | Arquivo por categoria | Gerava 9 páginas, 6 vazias |
| `/privacidade`, `/termos` | Páginas legais, conteúdo real (razão social, CNPJ, cláusula de reservas) | Boas |
| `/404` | 404 com atalhos úteis + WhatsApp | Boa |
| `/search` | Busca | **Nunca devolvia resultado** (pré-renderizada, o `?q=` não chegava) e nenhuma página linkava para ela |
| `/robots.txt`, `/sitemap-index.xml` | Gerados | OK |
| `/admin/*`, `/api/*` | CMS embarcado (on-demand, fora do sitemap, bloqueado no robots) | OK |

### Artigos publicados (6)

Todos já vivem na URL de raiz solicitada e já se comportam como matéria do blog
(aparecem em `/blog` e nas categorias) — **essa parte do pedido já estava
pronta**, não havia página institucional duplicada para converter:

- `/hotel-cajueiro-guaruja` — Hospedagem
- `/suites-hotel-cajueiro-guaruja` — Hospedagem
- `/promocoes-hotel-cajueiro-guaruja` — Hospedagem
- `/cafe-da-manha-hotel-cajueiro-guaruja` — Gastronomia
- `/onde-comer-hotel-cajueiro-guaruja` — Gastronomia
- `/o-que-fazer-hotel-cajueiro-guaruja` — Turismo e Destino

`/contato-hotel-cajueiro-guaruja` já tem 301 para `/contato` (em `vercel.json` e
`redirects.json`). Correto: contato é página, não matéria.

### Conteúdo órfão encontrado (existe no projeto, nenhuma página lê)

| Arquivo | Conteúdo | Observação |
|---|---|---|
| `src/data/hotel.json` | Texto real e bom sobre o hotel: 1.500 m², três andares, piscina, bar, estacionamento, atendimento | Nenhuma rota consome |
| `src/data/suites.json` | Suítes reais com capacidade: Luxo (até 4 pessoas, single/tripla/quádrupla), Luxo com Sacada (casais), Standard | Nenhuma rota consome — **e contradiz a home** |
| `src/data/sobre.json` | Texto genérico de blog do scaffold ("Um espaço para o conteúdo que importa…") | Não publicado — e bom que não esteja |
| `localBusiness.json`, `services.json`, `locations.json`, `localHome.json`, `localTemplate.json`, `templates.json`, `nichos.json` | Sobras do scaffold — `localBusiness.json` ainda diz **"Dedetizacao SP"** | Sem rota pública; só o admin e o componente `local/LocalHome.astro` (também sem rota) leem |
| `src/pages/blog/[slug].astro`, `src/components/ReserveCTA.astro`, `src/components/layout/SEO.astro` | Código morto (a rota não gera; o `SEO.astro` não é usado pelo `BaseLayout`) | Sem impacto no site |

---

## 2. Mapa proposto

Arquitetura enxuta — nenhuma página nova criada, porque o que faltava era
**caminho** e **informação**, não página.

**Páginas principais**
- `/` — o hotel completo: o que é, onde fica, suítes, estrutura, fotos, arredores, FAQ, como chegar, e o buscador de datas no topo
- `/grupos-e-excursoes`
- `/corporativo`
- `/blog`
- `/contato` — agora com todos os canais + mapa + horários

**Páginas legais**
- `/privacidade`, `/termos`

**Blog (6 artigos, URLs preservadas)** — sem mudança de endereço

**Removidas / não criadas**
- Nenhuma página removida.
- **Nenhuma página "Quem Somos" criada.** O papel dela está coberto duas vezes:
  pela home (intro + estrutura + galeria + arredores + depoimento) e pelo artigo
  `/hotel-cajueiro-guaruja`, que é exatamente o aprofundamento institucional.
  Criar uma terceira versão do mesmo assunto geraria páginas competindo entre si
  na busca. O `sobre.json` genérico continua não publicado.
- `/search` foi **consertada, não removida** (era um bug de uma linha), mas
  segue sem link em nenhum lugar — decidir se ganha um campo de busca no `/blog`
  ou se sai do projeto.

**Navegação** — antes: Início · Grupos · Corporativo · Blog · Contato.
Um hóspede não tinha **nenhum** caminho de menu para ver quartos: tinha que
adivinhar que precisava rolar a home. Agora: **Início · Suítes · Grupos e
Excursões · Corporativo · Blog · Contato**, com "Suítes" levando à seção
`#acomodacoes` da home.

---

## 3. Matriz de decisão

| Página / seção | Decisão | Motivo |
|---|---|---|
| `/` | **REESTRUTURAR (parcial)** | Conteúdo bom, mas os CTAs de reserva não chegavam ao buscador e havia seção de preenchimento |
| Home · hero + buscador | **MANTER** | É o único caminho para preço/disponibilidade. Virou o destino de todo CTA de reserva |
| Home · 3 features | **MANTER** | Os três argumentos que importam, acima da dobra |
| Home · intro | **MANTER** | Responde "quem é o hotel" |
| Home · acomodações | **MANTER** (ver pendência de nomenclatura) | Principal dúvida de quem vai reservar |
| Home · estrutura (14 itens) | **MANTER** | Informação concreta e verificável |
| Home · galeria | **MANTER** | Prova visual — o que mais pesa na escolha de hotel |
| Home · arredores | **MANTER** | Bandeira Azul, serviços no quarteirão: diferencial real |
| Home · piscina + localização | **MANTER** | Repete parcialmente a intro, mas com imagem e função narrativa |
| Home · **diferenciais (6 cartões)** | **REMOVER os cartões, MANTER o bloco** | Os cartões eram "Sol — é sem dúvida o protagonista de qualquer viagem para o Guarujá", "Praia", "Varanda", "Restaurantes". Zero informação nova: Estrutura, Arredores e Galeria já cobrem tudo com dado concreto. O título ("Por que reservar no Cajueiro?") + o CTA são bons e ficaram |
| Home · modalidades | **MANTER** | Ponte para as duas landings |
| Home · depoimentos | **MANTER** (ver pendência) | Só 1 depoimento — prova social fraca |
| Home · FAQ | **MANTER** | Responde praia, estacionamento, café, ar-condicionado, preço |
| Home · como chegar | **MANTER** | Balsa/rodovias/vagas: dúvida real de quem vem de SP ou Santos |
| `/corporativo` | **MANTER, revisar depois** | Funciona. Mas repete 4 seções da home quase palavra por palavra ("O que o hotel oferece", "Fotos", "Praia do Tombo", "Fácil acesso pelos dois lados do porto"). Aceitável numa landing que recebe tráfego direto de anúncio; se as três páginas forem indexadas juntas, vale diferenciar |
| `/grupos-e-excursoes` | **MANTER, revisar depois** | Idem |
| `/blog` | **MANTER** | Listagem funciona. Sem filtro de categoria e sem descrição — melhoria posterior |
| `/contato` | **REESTRUTURAR** | Feito: canais visíveis, horários, mapa, endereço, e formulário que realmente entrega |
| `/[slug]` (artigos) | **MANTER** | Template forte. Só os CTAs estavam apontando para o lugar errado |
| Os 6 artigos | **MANTER como matéria** | Já estão assim. URLs preservadas |
| `/categoria/[slug]` | **REESTRUTURAR** | Só gera categoria com artigo |
| `/privacidade`, `/termos` | **MANTER** (ver pendência) | Conteúdo real e adequado; faltam políticas de estadia |
| `/404` | **MANTER** | Boa |
| `/search` | **CORRIGIR e decidir** | Consertada; segue órfã |
| "Quem Somos" | **NÃO CRIAR** | Coberta pela home e pelo artigo `/hotel-cajueiro-guaruja` |
| `sobre.json` (texto de blog genérico) | **NÃO PUBLICAR** | Boilerplate do scaffold |
| `localBusiness.json` ("Dedetizacao SP") e sobras do scaffold | **REMOVER depois** | Sem rota pública, mas polui o admin |

---

## 4. Checklist de lançamento

### 🔴 Crítico

| # | Item | Estado |
|---|---|---|
| 1 | Formulário de `/contato` fazia POST nativo em `/api/subscribe` (espera JSON) → erro 400 em JSON puro na tela; mensagem e telefone descartados | **[FEITO]** Reescrito: valida, envia cópia por e-mail (formsubmit, mesmo serviço já usado em Corporativo/Grupos) e faz handoff para o WhatsApp da recepção com a mensagem montada |
| 2 | `/contato` não mostrava telefone, WhatsApp, e-mail, endereço, horários nem mapa (as variáveis eram lidas e nunca renderizadas) | **[FEITO]** Todos visíveis, com botões "Chamar no WhatsApp" e "Ligar agora" acima da dobra no celular, cartões de canal, bloco de horários, endereço e mapa incorporado |
| 3 | CTA "Reservar agora" de **todas** as páginas levava a `/contato` (beco sem saída) | **[FEITO]** Leva a `/#reservar` = buscador de datas |
| 4 | `#reservar` apontava para o CTA do rodapé, não para o buscador | **[FEITO]** A hero com o buscador passou a ser `id="reservar"`; os 4 CTAs da home chegam lá |
| 5 | CTAs de reserva dos artigos apontavam para `/` (topo da home, sem ação) | **[FEITO]** 3 CTAs por artigo agora vão para `/#reservar` |
| 6 | **Ativar o formsubmit.co** para `contato@hotelcajueiroguaruja.com.br`: o serviço só entrega e-mail após confirmar o endereço no **primeiro envio**. Enquanto não confirmar, a cópia por e-mail não chega (o WhatsApp funciona desde já) | **[PRECISA DO HOTEL]** |
| 7 | Confirmar que `corporativo@hotelcajueiroguaruja.com.br` (destino dos formulários das landings) existe e está ativo no formsubmit | **[PRECISA DO HOTEL]** |
| 8 | Testar uma reserva de ponta a ponta no motor hbook (`companyId 684c884a465ca753a717e043`) com datas, hóspedes, idade de criança e cupom | **[PRECISA DO HOTEL]** |

### 🟡 Importante

| # | Item | Estado |
|---|---|---|
| 9 | Nenhuma página tinha `<link rel="canonical">` (o `SEO.astro` que gerava isso não é usado pelo `BaseLayout`) | **[FEITO]** Canonical auto-referente em todas as páginas |
| 10 | Nenhum dado estruturado de hotel na home — só artigos tinham JSON-LD. Perde resultado local/Maps | **[FEITO]** `Hotel` schema.org na home: nome, endereço, telefone, e-mail, imagens, check-in 14h / check-out 12h, 14 comodidades, redes sociais. Só campos que existem no projeto |
| 11 | 6 páginas de categoria vazias ("Nenhum artigo nesta categoria ainda") geradas e indexadas no sitemap; rodapé linkava todas | **[FEITO]** Só categoria com artigo gera página; header e rodapé filtram junto. Sitemap: 22 → 16 URLs, todas com conteúdo |
| 12 | `<title>` da home era só "Hotel Cajueiro Guarujá" — sem "hotel", sem "Praia do Tombo" | **[FEITO]** "Hotel Cajueiro Guarujá \| Hotel a 100 m da Praia do Tombo" |
| 13 | `/search` pré-renderizada: o `?q=` nunca chegava, resultado sempre vazio (e a rewrite `/search/:term` do `vercel.json` não podia funcionar) | **[FEITO]** `prerender = false` |
| 14 | `SearchAction` do JSON-LD apontava para `/blog?q=` (rota que não lê query) | **[FEITO]** Aponta para `/search?q=` |
| 15 | Sem menu para acomodações — hóspede tinha que descobrir a seção rolando a home | **[FEITO]** Item "Suítes" no menu → `/#acomodacoes` |
| 16 | Seção "diferenciais" com 6 cartões de preenchimento | **[FEITO]** Cartões removidos (voltam a qualquer momento preenchendo `diferenciais.items` no admin), proposta de valor e CTA mantidos |
| 17 | **Contradição de acomodações em três lugares:** home diz 5 suítes ("com varanda / casal / dupla / dupla com varanda / tripla"); `suites.json` diz Luxo, Luxo com Sacada e Standard, até 4 pessoas, quádrupla; artigos e `/grupos` dizem "62 suítes". Um hóspede comparando a home com o motor de reservas vê nomes diferentes | **[PRECISA DO HOTEL]** definir a nomenclatura oficial e a capacidade de cada tipo, e alinhar home + motor de reservas + artigo de suítes |
| 18 | Só **1 depoimento** na home, sem nota, sem fonte. Para hotel, prova social é o que mais converte | **[FEITO — falta credencial]** Integração oficial com as avaliações reais do Google (Places API New) em `/api/reviews` + `GoogleReviews.astro`, com atribuição completa e sem JSON-LD de review. Falta `GOOGLE_MAPS_API_KEY` e o Place ID — ver `PENDENCIAS-CONTEUDO.md` §3 |
| 19 | GA4, Meta Pixel e verificação do Search Console **todos vazios**. Subir sem medição é lançar às cegas | **[PRECISA DO HOTEL]** IDs → admin (`/admin/google-tag`, `/admin/meta-pixel`, `/admin/search-console`) |
| 20 | Banner de cookies desativado. Assim que GA4/Pixel entrarem, ativar (a política de privacidade já fala de cookies e LGPD) | **[PRECISA DO HOTEL]** decisão + `/admin/cookie-consent` |
| 21 | **Informação que falta para decidir a reserva, e que nenhum lugar do site responde** (rastreado em `PENDENCIAS-CONTEUDO.md` §1)**:** política de cancelamento, formas de pagamento, aceita crianças / berço / cama extra (e cobrança), aceita animais, faixa de preço da diária, capacidade exata por tipo de suíte | **[PRECISA DO HOTEL]** sugestão: entrar na FAQ da home (`home.json → faq`), que já é a peça que responde dúvidas pré-reserva |
| 22 | Páginas legais não cobrem política de estadia (cancelamento, no-show, check-in antecipado/late check-out, crianças, animais). O jurídico existente está bom e não foi tocado | **[PRECISA DO HOTEL]** texto real; nada foi inventado |
| 23 | Nenhum logotipo em `siteConfig.logo` (o header usa PNG fixo) e `seo.orgLogo` vazio → schema de artigo sai sem logo do publisher | **[PRECISA DO HOTEL]** apontar o arquivo do logo |

### 🟢 Melhoria posterior

| # | Item |
|---|---|
| 24 | `/corporativo` e `/grupos-e-excursoes` repetem 4 seções da home quase literalmente. Diferenciar (ou reduzir) para as três páginas não competirem na busca |
| 25 | `/blog` é uma lista crua: sem filtro por categoria, sem destaque do artigo principal, sem descrição na listagem |
| 26 | O botão "Reservar" do header (o CTA mais visível no celular) vai para o **WhatsApp**, enquanto a hero vai para o motor de reservas. Decidir qual é o caminho principal — hoje o site tem dois, e isso divide a conversão |
| 27 | FAQ fixa de 4 perguntas (check-in, café, estacionamento, distância da praia) repetida no fim de **todos** os artigos, inclusive em "Onde comer". Útil para o leitor, mas é bloco idêntico em 6 URLs |
| 28 | Imagens em JPG não otimizado, até 272 KB, sem `webp`/`avif` nem variantes de largura. Hero de 163 KB como background CSS |
| 29 | Limpar dados do scaffold que sobraram no admin (`localBusiness.json` = "Dedetizacao SP", `services.json`, `locations.json`, `templates.json`, `nichos.json`, `sobre.json`) e o código morto (`blog/[slug].astro`, `ReserveCTA.astro`, `SEO.astro`, `local/LocalHome.astro`) |
| 30 | `hotel.json` e `suites.json` guardam texto bom e real que nenhuma página publica. Considerar aproveitar no artigo de suítes ou na home |
| 31 | Número de WhatsApp e e-mail corporativo estão **hardcoded** em `corporativo.astro` e `grupos-e-excursoes.astro`, fora do `siteConfig` — se o número mudar, muda em 3 lugares |
| 32 | Fontes Fraunces e Karla estão em `/public/fonts` e declaradas no `siteConfig.theme`, mas o site usa Lora + Geist. Peso morto (e o `CLAUDE.md` documenta errado) |
| 33 | Decidir o destino de `/search`: ganhar um campo de busca no `/blog` ou sair |

---

## O que mudou no código

| Arquivo | Mudança |
|---|---|
| `src/pages/contato.astro` | Reescrita: canais visíveis, horários, endereço, mapa, região, CTA de reserva; formulário → e-mail + WhatsApp |
| `src/layouts/BaseLayout.astro` | `<link rel="canonical">` auto-referente |
| `src/components/layout/HotelSchema.astro` | **novo** — JSON-LD `Hotel` para a home |
| `src/pages/index.astro` | Hero virou `id="reservar"`; `<HotelSchema />`; título SEO próprio; cartões de "diferenciais" fora |
| `src/components/CtaFinal.astro` | Botão → `/#reservar`; alternativa de WhatsApp; deixou de sequestrar o id `reservar` |
| `src/pages/[slug].astro` | 3 CTAs de reserva → `/#reservar` (breadcrumb "início" intacto) |
| `src/components/ReserveCTA.astro` | CTA → `/#reservar` |
| `src/pages/categoria/[slug].astro` | Só gera categoria com artigo |
| `src/components/layout/Footer.astro`, `Header.astro` | Listam só tópicos com artigo |
| `src/pages/search.astro` | `prerender = false` |
| `src/plugins/seo/SchemaMarkup.astro` | `SearchAction` → `/search?q=` |
| `src/data/menu.json` | Item "Suítes" |
| `src/data/siteConfig.json` | `seo.title` da home |
| `src/data/home.json` | `diferenciais.items` esvaziado |
| `.claude/launch.json` | **novo** — conveniência de dev |

Build de produção validado: `astro build` exit 0, sitemap com 16 URLs (todas com
conteúdo), canonical e JSON-LD conferidos no HTML gerado, `/contato` verificada
no navegador em viewport de celular (375×812).

---

## Pendências rastreadas

O que depende de informação real do hotel está registrado em
[`PENDENCIAS-CONTEUDO.md`](./PENDENCIAS-CONTEUDO.md), com o destino de cada dado
já mapeado — é o documento a abrir ao retomar o projeto.
