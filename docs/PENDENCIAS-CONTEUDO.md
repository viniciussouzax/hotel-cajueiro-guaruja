# Pendências — dados que só o hotel tem

> Registro vivo do que falta para o site ir ao ar completo. Tudo aqui **está
> bloqueado por informação real** que não existe no projeto — nada foi inventado
> e nenhum texto de espaço reservado foi publicado no site.
> Complementa `AUDITORIA-LANCAMENTO.md`. Atualizado em 14/09/2026.
>
> **Status em 14/09/2026:** políticas de estadia resolvidas; prova social
> resolvida com avaliações reais. A Places API ficou **desligada por decisão**
> (não foi possível ativar) — o site funciona sem ela. Pendências reais: nomes
> das suítes (§2) e os IDs de medição (§4).

---

## 1. Políticas de estadia (pré-reserva) — ✅ RESOLVIDO em 14/09/2026

Dados fornecidos pelo hotel e aplicados no site. Onde cada um entrou:

| Informação | Publicado em |
|---|---|
| **Cancelamento** (50% com 20+ dias · carta de crédito de 4 a 19 dias · nada com 3 dias ou menos) + no-show + saída antecipada | FAQ da home + `/termos` §6 (texto legal completo) |
| **Formas de pagamento** (Pix integral · 2x sem juros acima de R$ 500 · 3x sem juros acima de R$ 1.000) | FAQ da home + `/termos` §7 |
| **Crianças** (1 criança até 5 anos na cama dos pais, cortesia · sem berço · colchão extra R$ 100 por pessoa/noite) | FAQ da home + `/termos` §7 |
| **Animais** (pequeno porte, taxa R$ 100 por estadia) | FAQ da home + `/termos` §7 + `petsAllowed` no schema do hotel |
| **Faixa de preço** (R$ 200 a R$ 500 em quarto duplo · Réveillon R$ 1.200) | FAQ da home + seção de acomodações + `priceRange` no schema |
| **Capacidade** (3 suítes individuais · duplo, triplo e quádruplo) | Seção de acomodações da home, artigo de suítes, `/corporativo`, `/grupos-e-excursoes`, `/404` |

### ⚠️ Dois pontos para confirmar antes de publicar

1. **A escada do cancelamento.** O texto original usava "até 4 dias" e "até 20
   dias", que lido literalmente se sobrepõe (cancelar 2 dias antes também é
   "até 20 dias"). Publiquei a única leitura coerente, em ordem crescente de
   antecedência:
   - 20 dias ou mais → reembolso de 50%
   - 4 a 19 dias → carta de crédito (60 dias, mediante disponibilidade)
   - 3 dias ou menos → sem restituição

   **Se a intenção era outra, é trocar uma linha** — mas como é texto que gera
   direito a reembolso, vale um "confere" antes de subir.

2. **Preços envelhecem.** R$ 200–500, Réveillon R$ 1.200 e as taxas de R$ 100
   estão publicados como referência, com a ressalva de que o valor exato é o do
   buscador. Combinar uma revisão por temporada — e o `/termos` §7 já diz que
   prevalece o que é exibido na reserva.

---

## 2. Nomenclatura das suítes — 🟡 capacidade resolvida, nomes ainda pendentes

**Resolvido:** a capacidade. São 3 suítes de ocupação individual, e os quartos
vão de duplo a quádruplo. Isso corrigiu o "de casal a tripla" que aparecia em 7
lugares do site e que estava errado.

**Ainda pendente:** os *nomes* oficiais. Continuam três versões no projeto:

| Fonte | O que diz |
|---|---|
| `src/data/home.json` (publicado) | 5 nomes: com varanda, casal, dupla, dupla com varanda, tripla |
| `src/data/suites.json` (não publicado) | 3 categorias: **Suíte Luxo**, **Suíte Luxo com Sacada**, **Standard** |
| Artigo `/suites-hotel-cajueiro-guaruja` | Segue os 5 nomes da home |

A capacidade que você confirmou (individual/duplo/triplo/quádruplo) **casa com o
`suites.json`**, não com a lista de 5 nomes da home — o que reforça que a home
pode estar com nomenclatura antiga.

**Preciso de:** os nomes como aparecem no motor hbook, e qual capacidade vai com
cada nome. Com isso eu unifico home + artigo + `suites.json` numa fonte só.

---

## 3. Avaliações do Google — ⏸️ API DESLIGADA por decisão · seção funcionando

**DECISÃO EM 14/09/2026: a Places API fica desligada.** Não foi possível ativar
a API no projeto do Google Cloud (a chave respondia `PERMISSION_DENIED` mesmo
depois da ativação — provavelmente chave em outro projeto, faturamento não
vinculado ou restrição de API). A chave foi removida do `.env`, então
`/api/reviews` responde `{configured:false}` sem nem chamar o Google.

**Isso não deixou buraco no site.** A seção de avaliações passou a usar
avaliações **reais de hóspedes**, tiradas do dump oficial do GBP
(`../gbp/out/reviews.json`) e publicadas como depoimentos em
`home.json → depoimentos`, com nome abreviado e mês:

| Hóspede | Quando | Argumento que cobre |
|---|---|---|
| James P. | fev 2026 | localização + atendimento + café da manhã |
| Sabrina B. | mar 2026 | tranquilidade + proximidade da praia |
| Roberta I. | abr 2026 | hóspede recorrente + refeições |
| Alcione G. | fev 2026 | atendimento (cita o Lúcio pelo nome) |
| Amanda F. | — | piscina, limpeza, estrutura |

São 5 depoimentos onde antes havia 1. O layout renderiza o primeiro como
destaque e os outros em grade; com um só depoimento volta ao card único.

> **Distinção que vale registrar:** citar um punhado de avaliações como
> depoimento, com atribuição, é diferente de espelhar a resposta da API — a
> regra dos 30 dias do GBP fala de cachear conteúdo recuperado, não de citar
> clientes. Mesmo assim, se preferir não usar, é só limpar
> `home.json → depoimentos` no admin e o card único volta.

**A integração continua pronta e não foi removida:** se um dia a Places API for
ativada, basta pôr `GOOGLE_MAPS_API_KEY` no `.env` e nas envs da Vercel — a
seção troca os depoimentos manuais pelas avaliações ao vivo sozinha, sem tocar
em código. O passo a passo está em `APIS-GOOGLE-HABILITAR.md`.

Detalhes técnicos em `src/pages/api/reviews.ts` e
`src/components/sections/GoogleReviews.astro`.

Caminho escolhido: **Places API (New) → Place Details, campo `reviews`** — é o
método oficial do Google para exibir avaliações do perfil da empresa num site
próprio, sem scraping e sem risco de penalização.

**Preciso de uma coisa só:** a **`GOOGLE_MAPS_API_KEY`**.

Chave do Google Cloud com a **Places API (New)** habilitada. Dá para criar no
mesmo projeto que já existe (`project-f0360ee7-20ba-4c37-a63`, o do OAuth do
GBP): habilitar a "Places API (New)" → Credenciais → Criar chave de API →
restringir **por API** (não por referer, porque o uso é server-side). Vai no
`.env` local e nas Environment Variables da Vercel. **Nunca commitar.**

O **Place ID não é mais necessário**: se `googleReviews.placeId` estiver vazio,
a própria rota descobre pelo nome + endereço do hotel (Text Search) e devolve o
id na resposta — basta colar uma vez em `pluginsConfig.json` depois, para
economizar a chamada extra.

Enquanto a chave não chegar, a seção mostra o depoimento manual de `home.json` —
o site não fica com buraco.

### O que já existe na pasta do projeto (levantado em 14/09/2026)

Em `../gbp/` há uma integração **Google Business Profile** funcionando, feita
pelo caminho oficial: `gbp.py` com escopo `business.manage`, OAuth client do
projeto `project-f0360ee7-20ba-4c37-a63`, e `out/reviews.json` com **792
avaliações reais** já baixadas pela API v4 (489 nota 5, 602 com texto). Ou seja:
o acesso à API de avaliações **já está liberado** nessa conta — a parte difícil
está feita.

Mesmo assim, **não é ela que alimenta o site**, por três motivos concretos:

1. **Não existe chave de API na pasta.** Busquei por `AIza…` em tudo: nada. O
   que existe são *OAuth clients* (`credentials.json` e os `client_secret_*.json`,
   tipo `installed`, redirect `http://localhost`) — credencial que autentica
   **uma pessoa, interativamente**, não um servidor. E o `token.json` gerado pelo
   login **não está mais na pasta**, então nem o script local roda sem refazer
   `py gbp.py auth`.
2. **Refresh token de OAuth em produção é frágil aqui.** Para a Vercel chamar a
   API do GBP sozinha seria preciso guardar client id + secret + refresh token
   nas envs. Se a tela de consentimento do projeto estiver em *Testing*, o
   refresh token **expira em 7 dias** e a seção quebraria toda semana. Com uma
   chave de API da Places isso não existe.
3. **A política do GBP proíbe guardar as avaliações.** Conteúdo recuperado pela
   API "deve ser armazenado temporariamente por no máximo 30 dias" e "não pode
   ser manipulado ou agregado". Então commitar um recorte das 792 avaliações no
   repo do site está fora — e o desenho on-demand que já implementamos vale para
   as duas fontes. (Nota: o `gbp/out/reviews.json` é de 11/08/2026, já passou dos
   30 dias — vale apagar ou regerar quando for usar.)

**Onde o GBP continua sendo a ferramenta certa:** análise e *resposta* a
avaliações (é o que `analyze_reviews.py` e `build_replies.py` já fazem). Se um
dia quisermos responder avaliações pelo `/admin`, é por ali. Para *exibir* no
site, Places API é mais simples e não expira.

Se você preferir o caminho GBP no site mesmo assim (vantagem real: acesso às 792
em vez de 5, com rotação), eu implemento — só me avise, porque aí precisa do
`py gbp.py auth` refeito e das três envs de OAuth na Vercel.

### Decisões técnicas que ficaram registradas (para não serem desfeitas)

- **Não persistimos as avaliações.** Os termos do Maps Platform proíbem cachear
  conteúdo do Google fora das exceções nomeadas (Place ID é exceção; texto de
  avaliação não é). Por isso a rota é on-demand com cache HTTP de 1h na borda,
  e nada é gravado em `src/data/` nem commitado.
- **Atribuição completa é obrigatória:** nome, foto e perfil do autor + link da
  avaliação original no Google Maps. Já está implementado.
- **As avaliações NÃO viram `Review`/`AggregateRating` em JSON-LD.** É aqui que
  mora o risco de penalização: avaliação sobre o hotel publicada no site do
  próprio hotel é *self-serving* para o Google, e agregar nota de terceiro no
  próprio markup viola as diretrizes de review snippet. Exibir é permitido;
  marcar como dado estruturado para ganhar estrela na SERP, não. O
  `HotelSchema.astro` foi escrito sem nota de propósito.
- **A Google Business Profile API (ex-My Business) foi descartada:** exige
  allowlist por formulário + OAuth do usuário dono do perfil (service account
  não funciona) e refresh token para rodar sem interação — muito mais peça móvel
  para o mesmo resultado visível. Se um dia quisermos responder avaliações pelo
  admin, aí sim ela é o caminho.
- **Search Console API ≠ avaliações.** A API do Search Console (que o scaffold já
  suporta em `/admin/search-console`) entrega desempenho de busca: cliques,
  impressões, posição, consultas. Não tem acesso a avaliações. São credenciais e
  APIs diferentes — vale configurar as duas, para finalidades diferentes.

---

## 4. Medição e contas — 🟡 importante

| Item | Onde configurar |
|---|---|
| **GA4** — `measurementId` vazio | `/admin/google-tag` |
| **Meta Pixel** — `pixelId` vazio | `/admin/meta-pixel` |
| **Search Console** — tag de verificação vazia; e vale plugar o `serviceAccountJson` para ver dados no admin | `/admin/search-console` |
| **Banner de cookies** — desativado. Ativar junto com GA4/Pixel (a política de privacidade já fala de cookies e LGPD) | `/admin/cookie-consent` |
| **Logotipo** — `siteConfig.logo` e `seo.orgLogo` vazios; o header usa PNG fixo. Sem isso o schema de artigo sai sem logo do publisher | `/admin/config` |

---

## 5. Formulários — 🔴 crítico

| Item | Detalhe |
|---|---|
| **Ativar formsubmit.co para `contato@hotelcajueiroguaruja.com.br`** | O serviço só passa a entregar e-mail depois de confirmar o endereço **no primeiro envio**. Até confirmar, a cópia por e-mail do formulário de `/contato` não chega (o handoff para WhatsApp funciona desde já) |
| **Confirmar `corporativo@hotelcajueiroguaruja.com.br`** | É o destino dos formulários de `/corporativo` e `/grupos-e-excursoes`. Confirmar que a caixa existe e está ativada no formsubmit |
| **Testar uma reserva ponta a ponta** | Motor hbook, `companyId 684c884a465ca753a717e043`: datas, hóspedes, idade de criança e cupom |

---

## 6. Prova social além do Google — 🟢 quando der

- **Resolvido o essencial:** a home saiu de 1 para 5 depoimentos reais (ver §3).
- Nota/selo de outras fontes (Booking, TripAdvisor) — se existirem, mesma regra:
  exibir com atribuição, sem marcar como dado estruturado.
- Fotos dos hóspedes / Instagram: `siteConfig.instagramFeed` existe e está vazio;
  o rodapé já tem a grade pronta para 6 imagens.

---

## 7. Divergência entre a auditoria e o código (levantado em 21/09/2026)

Vários itens marcados **[FEITO]** em `AUDITORIA-LANCAMENTO.md` **não estão na
árvore de trabalho**. Ou foram revertidos, ou nunca chegaram a ser aplicados.
Conferido lendo os arquivos, não o documento:

| Item da auditoria | O que o doc diz | O que o código tem | Situação agora |
|---|---|---|---|
| #11 — categorias vazias | "[FEITO] só categoria com artigo gera página; header e rodapé filtram junto" | `Footer.astro`, `Header.astro` e `categoria/[slug].astro` listavam **as 9** categorias do `categories.json` | ✅ **corrigido nesta rodada** — rodapé, submenu e `getStaticPaths` agora filtram por categoria que tem artigo. Sitemap voltou a 16 URLs |
| #15 — item "Suítes" no menu | "[FEITO] item Suítes → `/#acomodacoes`" | `src/data/menu.json` tinha 5 itens, **sem Suítes** | ✅ **resolvido em 21/09/2026** — decisão do Bruno: item "Suítes" no menu apontando para a **página própria `/suites`** (não para âncora). Ver §10 |
| #16 — cartões de "diferenciais" | "[FEITO] cartões removidos" | `home.json → diferenciais.items` ainda tem os **6 cartões** ("Sol — é sem dúvida o protagonista…", "Praia", "Varanda"…) e eles renderizam na home | 🟡 **pendente** — é conteúdo, não código: esvaziar `diferenciais.items` pelo admin. O título e o CTA do bloco ficam |
| #18 — prova social | "5 depoimentos reais de hóspedes" (§3 deste doc) | `home.json → depoimentos` tem **1 item** | 🟡 **pendente** — os 5 textos estão descritos na §3 acima; é recolar no admin |

> **Como evitar de novo:** antes de marcar `[FEITO]`, conferir no arquivo. O
> documento não é a fonte de verdade — `src/` é.

## 8. Dois caminhos de "Reservar" — ✅ RESOLVIDO em 21/09/2026

**Decisão do Bruno: um funil só, tudo para o motor de reservas.** O botão
"Reservar" do cabeçalho deixou de abrir o WhatsApp e passou a apontar para
`/#reservar`, igual ao resto do site. O WhatsApp continua disponível como canal
de atendimento, sempre com rótulo próprio ("Falar no WhatsApp", "Falar com
consultor", "Prefere falar? WhatsApp") — **nunca mais com o rótulo "Reservar"**.

O diagnóstico que gerou a decisão, para registro:

- O botão **"Reservar" do cabeçalho** (o CTA mais visível, fixo em todas as
  páginas e o único acima da dobra no celular) abre o **WhatsApp**
  — `src/components/layout/Header.astro`.
- **Todo o resto do site** (hero, suítes, artigos, CTA final) leva ao
  **motor de reservas** em `/#reservar`.

São dois funis concorrendo pelo mesmo clique. Precisa de uma decisão: ou o
cabeçalho passa a levar ao buscador de datas (e o WhatsApp vira o caminho
secundário, como já é em `/contato`), ou assume-se o WhatsApp como principal e
o resto do site se alinha a ele. **Não mexi** porque muda o funil comercial.

## 9. Acabamentos de frontend ainda em aberto (não bloqueiam lançamento)

| Onde | O quê |
|---|---|
| Home · `/corporativo` · `/grupos-e-excursoes` | As 4 seções repetidas quase palavra por palavra entre as três páginas (estrutura, fotos, Praia do Tombo, como chegar). Aceitável para tráfego de anúncio; ruim se as três forem indexadas juntas |
| `/categoria/*` | Usa o `PostCard` do scaffold (blocos de cor chapada) — linguagem visual que não existe em nenhuma outra página do hotel. Vale migrar para o cartão branco usado agora em `/blog` |
| Rodapé | Linha de copyright e os links "privacidade / termos" saem em Geist Mono minúsculo — resquício do scaffold, destoa do resto |
| Home · Estrutura | 14 comodidades numa grade de 4 colunas deixam a última fila com 2 itens e um vão grande à direita |
| Imagens | JPG não otimizado, até 272 KB, sem `webp`/`avif` nem variantes de largura (item #28 da auditoria, segue aberto) |
| `/search` | Continua funcionando e continua órfã: nenhuma página linka para ela (item #33) |

---

## 10. Página `/suites` (criada em 21/09/2026) — o que ainda falta de conteúdo

A página de produto das acomodações existe e está no menu. Ela lê **`home.json`**
(`suitesTeaser`, `estrutura.itens`, `faq`) de propósito: é a mesma fonte da home,
então não existe uma quarta lista de nomes de suíte para desencontrar. Editar no
admin muda a home e a `/suites` juntas.

| O que falta | Detalhe |
|---|---|
| **Nomes oficiais das suítes** (§2, segue aberto) | A `/suites` herda os 5 nomes da home. Quando o hotel confirmar a nomenclatura do motor hbook, muda em `home.json → suitesTeaser.suites` e a página inteira acompanha |
| **Capacidade por tipo** | Hoje a página diz a capacidade só no texto geral ("de individual a quádrupla"). Cada suíte poderia exibir "até X pessoas" — falta o dado por tipo |
| **Texto real que está parado em `suites.json`** | O `src/data/suites.json` (não publicado) tem copy real e melhor: andar de cada categoria, vista interna/pátio, **Smart TV de 32"**, bancada, camas box. Não usei porque os *nomes* ali (Luxo / Luxo com Sacada / Standard) contradizem os 5 da home. Resolvida a §2, esse texto é o melhor conteúdo para enriquecer a `/suites` |
| **Fotos** | Uma foto por tipo, reaproveitadas da home (`/images/suite-2..6.jpg`). Uma galeria por suíte exigiria fotos novas |

### Ponto de atenção de SEO

Agora existem duas páginas sobre suítes: `/suites` (produto, transacional) e o
artigo `/suites-hotel-cajueiro-guaruja` (editorial, guarda a URL antiga do Wix e
a autoridade dela). Foram diferenciadas de propósito — título, intenção e
conteúdo distintos, e `/suites` linka para o artigo. **Vale acompanhar no Search
Console** se as duas começarem a disputar a mesma consulta; se acontecer, a
saída é canonicalizar uma para a outra, não apagar (a URL antiga tem histórico).

---

## 11. Arredores — pauta pronta de artigo (saiu da home em 21/09/2026)

A seção "O que você tem por perto" saiu da home por decisão do Bruno ("deveria
ser matéria de blog"). **Nada foi apagado:** o conteúdo continua íntegro em
`src/data/home.json → entorno` (só não é mais renderizado) e está transcrito
aqui para virar artigo.

**Por que não criei o artigo agora:** o `src/content/config.ts` do scaffold não
tem campo `draft` — todo `.md` em `src/content/blog/` é publicado, entra em
`/blog`, nas categorias e no sitemap. Criar o arquivo significaria publicar um
artigo de quatro parágrafos ou inventar o resto do texto. Registrei a pauta em
vez disso. (Se quiserem o artigo, o caminho limpo é adicionar `draft` ao schema
e filtrar nos três lugares que leem a coleção — é uma tarefa própria.)

### Material (todos os fatos, como estavam publicados)

> **Chapéu:** Arredores · **Título:** O que você tem por perto
> **Linha de apoio:** A Praia do Tombo é uma área residencial arborizada, com
> serviço e comércio no mesmo quarteirão.

| Argumento | Texto publicado |
|---|---|
| **A 100 m do mar** | Cerca de 3 minutos a pé até a faixa de areia da Praia do Tombo. |
| **Praia Bandeira Azul** | O Tombo é a única praia de São Paulo com o selo internacional Bandeira Azul, há 16 temporadas seguidas. |
| **Serviços no quarteirão** | Farmácia, mercado, restaurantes e pronto-socorro 24h a poucos minutos. |
| **Região tranquila** | Uma das praias mais seguras do litoral paulista, segundo dados da SSP-SP. |

**Destino sugerido:** enriquecer o artigo existente
`/o-que-fazer-hotel-cajueiro-guaruja` (Turismo e Destino) com esses quatro
blocos — ele já fala do entorno e tem a URL antiga do Wix. Alternativa: artigo
novo "Como é a região da Praia do Tombo".

⚠️ **Verificar antes de republicar:** "16 temporadas seguidas" de Bandeira Azul
envelhece a cada ano, e o dado da SSP-SP precisa de data/fonte. Nenhum dos dois
foi inventado aqui — vieram do conteúdo já publicado —, mas nenhum dos dois foi
verificado por mim.

---

## 12. Prova social — a home ficou SEM depoimento até a chave do Google chegar

Decisão do Bruno em 21/09/2026: a seção de depoimentos manuais saiu e foi
substituída por um **slider de avaliações reais do Google** (Places API).

**Estado real hoje:** `/api/reviews` responde `{configured:false,
reason:"missing-api-key"}`, então o slider **não renderiza** — e a home ficou
sem nenhuma prova social. É o comportamento pedido (melhor um vazio do que
depoimento inventado), mas é bom saber que o item que mais converte em site de
hotel está fora do ar.

**Para ligar, falta uma coisa só:** a env `GOOGLE_MAPS_API_KEY`, com a
**Places API (New)** habilitada no projeto do Google Cloud e faturamento
vinculado, restrita **por API** (não por referer — a chamada é do servidor).
Passo a passo em `APIS-GOOGLE-HABILITAR.md`. O Place ID é opcional: sem ele a
rota descobre pelo nome + endereço e devolve o id na resposta, para colar em
`pluginsConfig.json → googleReviews.placeId`.

Os textos de depoimento reais dos hóspedes continuam registrados na §3 deste
documento, caso se decida voltar atrás e publicá-los manualmente.

---

## 13. Fotos que faltam (levantado na varredura de layout de 21/09/2026)

A regra "nenhuma seção com duas colunas de texto" foi aplicada. Onde a seção
virou texto + foto, usei **apenas fotos que já existem** em `public/images/`.
Onde a foto certa não existe, a seção ficou em coluna única.

| Seção | O que usei | Foto que o hotel poderia mandar |
|---|---|---|
| Home · "Relaxe depois de um dia de praia" | `corp-11.jpg` (piscina com mesas e guarda-sóis) | nenhuma — a foto casa exatamente com o texto |
| Home · "Localização perfeita, apenas 1 quadra da praia" | `hero-tombo.jpg` | **uma foto da Praia do Tombo ao nível do chão** (areia, quiosques, morro dos Andrades). Hoje repetimos a mesma aérea usada de fundo na hero da própria home |
| Home · "Hotel Cajueiro na Praia do Tombo" (1º do trio) | `corp-1.jpg` (fachada com a placa do hotel) | resolvido por ora. Uma foto de **recepção ou área comum** daria mais calor humano que a fachada vazia |
| `/suites` | uma foto por tipo, reaproveitadas da home | **galeria por tipo de suíte** (hoje é uma foto por categoria) |

Enquanto não chegarem, nada quebra: as seções sem foto ficam em coluna única com
medida de leitura controlada.

---

## 14. Barra de campanha — desligada por decisão (21/09/2026)

A barra acima do menu está implementada e **`enabled: false`** a pedido do Bruno
("remova por hora o aviso do topo, deixe desativado"). Desativada ela não
renderiza nada: sem faixa, sem espaço reservado, e `--campaign-h` volta a `0px`,
então o menu encosta no topo como antes.

O **banner abaixo da hero não é afetado**: sem campanha ativa ele mostra o
conteúdo padrão ("Temporada 2026 — Aproveite o melhor do Guarujá com o melhor
preço"), de `home.json → hero.banner`. Esse é o estado atual do site.

Como ligar quando quiser rodar a primeira campanha: **`CAMPANHA-DO-MES.md`**.

**Pendência menor:** a campanha é editada no JSON (`src/data/campanha.json`), não
por uma tela do admin. Um editor visual exigiria uma ilha React nova em
`/admin` — não fiz para não inflar o escopo.

---

## 15. Legendas erradas na galeria da home — corrigido em 21/09/2026

Abrindo os arquivos de `public/images/` um a um para escolher a foto do trio
texto+foto, descobri que **quatro legendas da galeria descreviam outra foto**.
Como a legenda também é o `alt` da imagem, era um defeito de acessibilidade:
quem usa leitor de tela ouvia "Suíte com varanda" numa foto de jardim.

| Foto | Legenda que estava | O que a foto realmente mostra (corrigido) |
|---|---|---|
| `corp-9.jpg` | "Suíte confortável" | Café da manhã servido no bufê |
| `corp-11.jpg` | "A caminho da praia" | Piscina com mesas e guarda-sóis |
| `corp-12.jpg` | "Suíte com varanda" | Área de convivência com pergolado e jardim |
| `corp-13.jpg` | "Quartos para a família toda" | Deck com espreguiçadeiras e vista para o morro |

As legendas novas descrevem só o que se vê na imagem — nenhum fato do hotel foi
inventado. **Vale o hotel conferir**, porque a galeria ficou sem nenhuma foto de
suíte: as que tinham legenda de quarto não eram de quarto. Se quiserem suítes na
galeria, mandem as fotos (ou aproveitem `suite-2` a `suite-6`, hoje usadas só na
seção de acomodações e em `/suites`).

`corp-11.jpg` aparece em dois lugares da home: na galeria e como foto do bloco
"Relaxe depois de um dia de praia". É proposital — é a única foto do acervo que
mostra as mesas à beira da piscina que o texto descreve.

---

## 16. Bloco "Testimonial 07" do shadcn space — DECISÃO DO BRUNO NECESSÁRIA

Pedido: usar o bloco **"Testimonial 07 - Multi Platform Testimonials"** do
shadcn space na seção de depoimentos. Investiguei antes de decidir e **não
instalei nem copiei** — os dois caminhos esbarram numa regra que não é minha
para quebrar.

### O que eu confirmei

| Fato | Onde confirmei |
|---|---|
| A instalação é `npx shadcn@latest add @shadcn-space/testimonial-07` e **exige `components.json`** para saber o estilo (base ou radix) | `getBlockInstall` no MCP `shadcnspace-mcp` |
| O fornecedor proíbe explicitamente: *"You are NOT allowed to recreate, rewrite, or approximate this component."* | mesma resposta do MCP |
| **Este projeto não tem `components.json`** | `ls` na raiz |
| React e Radix: React existe (para o admin), Radix **não** | `package.json` |
| O bloco é React + shadcn, com os tokens do shadcn (`--background`, `--primary`…), não com a paleta Café-da-Tarde | natureza do registry |
| O bloco é **"Multi Platform"** — organizado em torno de várias fontes (G2, Capterra, Trustpilot). Nós temos **uma só**: o Google | título e descrição do bloco |

Não consegui ver o código nem o preview: a rede do ambiente bloqueia
`shadcn.space`. Ou seja, eu **nem teria como** aproximar o layout com fidelidade.

### O conflito, curto

- **Instalar de verdade** quebra o `CLAUDE.md`: *"Admin = ilhas React; site
  público = Astro estático. Não misturar: nada de React no frontend do blog
  (peso de bundle)."* Traria React + shadcn + Radix + um segundo sistema de
  tokens para a home — a página mais visitada do site.
- **Portar o layout para Astro** quebra a regra do fornecedor ("not allowed to
  recreate, rewrite, or approximate").

Não existe terceira porta que entregue *aquele bloco específico* sem quebrar uma
das duas.

### O que fiz

Mantive o **slider em Astro puro** que já está pronto, com as avaliações reais do
Google e todas as regras da Places API (§ do `GoogleReviews.astro`), e **movi a
seção para logo abaixo da hero**, que era a outra metade do pedido — essa parte
não dependia do componente.

### O que o Bruno precisa decidir

1. **Fica como está** (Astro, sem React, nossa paleta) — recomendação. O que o
   bloco entrega a mais é o agrupamento por plataforma, e nós temos só o Google:
   a ideia central dele fica vazia aqui.
2. **Abrir exceção no `CLAUDE.md`** e aceitar React + shadcn + Radix numa ilha da
   home. Aí eu instalo pelo caminho oficial, crio o `components.json` e mapeio os
   tokens do shadcn para os nossos OKLCH. Custo: bundle na home e dois design
   systems convivendo.
3. **Escolher outro bloco** do mesmo catálogo mais adequado a uma fonte só —
   `testimonial-02` (slider com foto e controles) ou `testimonial-14` (carrossel
   horizontal) são mais próximos do que já temos. O conflito com o React continua.

Enquanto não decidir, o site funciona: com a chave da Places API, o slider atual
entra no ar sozinho.

---

## 17. FAQ da home — removida em 21/09/2026, conteúdo preservado aqui

Decisão do Bruno: *"Remova a FAQ. As dúvidas devem virar matéria de blog
depois, então deixe uma nota para lembrar disso."* — **esta é a nota.**

A seção "Perguntas frequentes" saiu de `src/pages/index.astro`. **Nada foi
apagado:** as 10 perguntas continuam íntegras em `src/data/home.json → faq`,
só não são mais renderizadas na home. Continuam alimentando:

- **`/suites`** — a seção "Antes de reservar" lê 6 delas de `home.faq` (não foi
  removida; ver ressalva no fim desta seção);
- **`/v2`** — a home alternativa, que também lê de `home.faq`.

Ou seja: **apagar `home.faq` quebraria a `/suites`.** Não apague; é só a home
que deixou de mostrar.

### Como transformar em matéria

**Recomendação: distribuir por artigo temático, não criar um artigo único de
FAQ.** Motivo: cinco das dez perguntas já têm um artigo que é exatamente o lugar
delas (café da manhã, suítes, promoções, institucional). Enfiar todas num
"Dúvidas frequentes" criaria uma página que compete com esses artigos pela mesma
consulta — o mesmo problema de canibalização que já registramos na §10. As
cinco que sobram (políticas de estadia: cancelamento, pagamento, crianças,
animais, preço) não têm artigo hoje e rendem **um** artigo próprio, algo como
"Como funciona a hospedagem no Cajueiro: pagamento, cancelamento e políticas".

### O conteúdo, íntegro

**1. O hotel fica perto da praia?**

Sim. O Hotel Cajueiro fica a apenas 100 metros (cerca de 1 quadra) da Praia do Tombo, uma das praias mais tranquilas do Guarujá.

*Destino sugerido:* `/hotel-cajueiro-guaruja` (institucional)

**2. O hotel tem estacionamento?**

Oferecemos 15 vagas rotativas aos hóspedes. Você também pode usar o estacionamento em frente com desconto exclusivo, ou parar na calçada do hotel.

*Destino sugerido:* `/hotel-cajueiro-guaruja` (institucional)

**3. O café da manhã está incluso?**

Sim, servimos um café da manhã delicioso, preparado artesanalmente todos os dias.

*Destino sugerido:* `/cafe-da-manha-hotel-cajueiro-guaruja`

**4. As suítes têm ar-condicionado?**

Todas as suítes contam com ar-condicionado, frigobar, camas box confortáveis, bancada e Smart TV de 32".

*Destino sugerido:* `/suites-hotel-cajueiro-guaruja`

**5. Como consigo o melhor preço?**

Reservando direto pelo nosso site você sempre garante o melhor preço, sem intermediários.

*Destino sugerido:* `/promocoes-hotel-cajueiro-guaruja`

**6. Qual é a política de cancelamento?**

Depende da antecedência. Com 20 dias ou mais antes do check-in, há reembolso de 50% do valor pago. De 4 a 19 dias, emitimos carta de crédito para usar em até 60 dias, conforme disponibilidade. Com 3 dias ou menos, não há restituição. Não comparecer sem avisar (no-show) ou sair antes do previsto também não geram reembolso. A política completa está na página de Termos.

*Destino sugerido:* artigo novo de dúvidas frequentes

**7. Quais são as formas de pagamento?**

Pix, com pagamento integral, ou cartão de crédito. Reservas acima de R$ 500 podem ser divididas em 2x sem juros e, acima de R$ 1.000, em 3x sem juros.

*Destino sugerido:* artigo novo de dúvidas frequentes

**8. Crianças pagam? Vocês têm berço ou cama extra?**

Uma criança de até 5 anos, dormindo na mesma cama dos pais, é cortesia. Não trabalhamos com berço. Colchão extra tem custo de R$ 100 por pessoa, por noite.

*Destino sugerido:* artigo novo de dúvidas frequentes

**9. Posso levar meu animal de estimação?**

Sim. Aceitamos animais de pequeno porte, com taxa de R$ 100 por estadia.

*Destino sugerido:* artigo novo de dúvidas frequentes

**10. Quanto custa a diária?**

Em quarto duplo, a diária vai de R$ 200 a R$ 500, variando conforme a época do ano — as tarifas mais baixas ficam nos meses de menor movimento e durante a semana. No Réveillon, a diária é R$ 1.200. Para o valor exato das suas datas, consulte no buscador aqui no site, onde você garante sempre a melhor tarifa.

*Destino sugerido:* artigo novo de dúvidas frequentes

### Ressalva — o que NÃO foi mexido

O pedido foi sobre a FAQ da **home** (foi o print que o Bruno mandou). Seguem
intactas, para ele decidir separadamente:

| Onde | O que é | Por que é diferente |
|---|---|---|
| **`/suites`** — "Antes de reservar" | 6 perguntas escolhidas de `home.faq`: ar-condicionado, preço da diária, crianças, animais, cancelamento, melhor preço | Não é FAQ institucional: é o bloco que destrava a **decisão do quarto**, no meio do funil de reserva, logo antes do CTA |
| **`/[slug]`** (template de artigo) | Não tem FAQ própria: é um **script** que converte um trecho "Perguntas frequentes" escrito dentro do markdown em acordeão | Mexer aqui afetaria os 6 artigos, não a home |
| **`/v2`** | A home alternativa tem a mesma FAQ, lendo de `home.faq` | Página `noindex`, fora do sitemap, que o Bruno decidiu não promover |

Nenhum dado estruturado foi afetado: a FAQ nunca alimentou `FAQPage`/`mainEntity`
no `SchemaMarkup.astro`. Também não havia âncora `#faq`, link de menu nem
`scroll-mt` apontando para a seção — conferido com `grep` em todo o `src/`.

---

## 18. "Viaja a trabalho ou em grupo?" — removida em 21/09/2026

Decisão do Bruno: *"essa seção não precisa existir"*. A seção de modalidades
saiu de `src/pages/index.astro`. **O dado continua íntegro** em
`src/data/home.json → modalidades`, só não é mais renderizado.

### O conteúdo, para constar

> **Chapéu:** Outras formas de se hospedar
> **Título:** Viaja a trabalho ou em grupo?
> **Apoio:** O Cajueiro tem condições próprias para equipes de empresas e para
> excursões, com tarifa e configuração de suítes sob medida.

| Cartão | Texto | Botão |
|---|---|---|
| **Hospedagem corporativa** | Tarifa para estadias de trabalho, café da manhã incluso, jantar à la carte opcional e recepção 24h. | Ver condições corporativas → `/corporativo` |
| **Grupos e excursões** | Suítes próximas umas das outras, café da manhã para o grupo todo e apoio na organização da viagem. | Ver condições para grupos → `/grupos-e-excursoes` |

### ⚠️ O que se perdeu, e o que não

Conferido no HTML renderizado da home:

- **Links para `/corporativo` e `/grupos-e-excursoes` no corpo da home: 0.**
- **No rodapé: 1 e 1** — as duas aparecem em "Navegação", que lista o menu.
- **No cabeçalho:** as duas, em todas as páginas.

**Descoberta não foi prejudicada:** as duas páginas continuam a um clique de
qualquer página do site, pelo menu e pelo rodapé.

**O que se perdeu foi a persuasão.** A seção era o único lugar do site que
*explicava* o que cada modalidade oferece — "tarifa para estadias de trabalho,
café incluso, jantar à la carte", "suítes próximas umas das outras". Um item de
menu escrito "Corporativo" não vende; aquele cartão vendia. Quem chega pela
home e não é hóspede de lazer agora precisa adivinhar que aquelas páginas
existem e o que têm.

**Não criei nada no lugar.** Se o Bruno quiser recuperar o argumento sem a
seção, a saída mais barata é uma linha no rodapé ou um parágrafo no bloco
institucional — mas é decisão dele.

---

## §19 — `/suites` removida: vira matéria de blog

Decisão do Bruno: a página `/suites` não deve existir; o assunto é **matéria de
blog**. A página foi removida e tudo que apontava para ela passou a apontar para
o artigo já existente `/suites-hotel-cajueiro-guaruja`.

### O que a página tinha (223 linhas, `src/pages/suites.astro`)

1. **Hero com foto + buscador de datas** (`BookingBar`). Era o único lugar do
   site, fora da home, com buscador — foi o argumento que justificou criar a
   página em vez de uma âncora.
2. **As 5 suítes em linhas alternadas**, foto grande + nome + descrição, cada uma
   com CTA "Ver datas e preço". Lidas de `home.json → suitesTeaser`.
3. **Cartão verde de destaque** com CTA de reserva, no meio da grade.
4. **"O que vem em toda suíte"** — 8 comodidades filtradas de
   `home.json → estrutura.itens` pelo campo `icon`.
5. **"Dúvidas de quem vai escolher o quarto"** — 6 perguntas lidas de
   `home.json → faq` (ar-condicionado, preço da diária, crianças, animais,
   cancelamento, melhor preço). **Este bloco morreu junto com a página.**
6. **Cartão de aprofundamento** linkando para o artigo.

### Nenhum dado foi perdido

A página não tinha conteúdo próprio: lia tudo de `home.json`
(`suitesTeaser`, `estrutura.itens`, `faq`), que continua intacto. O que se
perdeu foi a **composição** — a montagem daqueles blocos numa página de produto.

### O que levar para o artigo

O artigo `suites-hotel-cajueiro-guaruja.md` já cobre "Suítes para todos os
perfis", "Tudo o que você precisa no quarto", "Descanso perto do mar" e "Não
encontrou a suíte ideal?". O que ele **não** tem e valeria absorver:

- as **6 perguntas de decisão do quarto** (item 5 acima), que eram o diferencial
  da página e não existem em nenhum outro lugar renderizado hoje;
- a lista explícita de **o que vem em toda suíte**.

### Atenção

- `home.json → faq` **continua sendo necessário**: além do artigo, alimenta a
  `/v2`. Não apagar.
- Com a `/suites` fora, **não há mais buscador de datas fora da home**. Quem
  chega pelo artigo precisa voltar à home para consultar datas.


---

## 20. Barra de campanha — por que parecia "distante do shadcn" (21/09/2026)

A geometria estava idêntica ao bloco (94,4px, gaps de 41px, caixas 60×61,6,
todos os tamanhos de fonte conferidos no preview oficial). O que estava
diferente era **contraste e saturação** — e é isso que se vê na tela.

Medido nos dois, lado a lado:

| | Bloco oficial | Nossa barra (antes) | Nossa barra (agora) |
|---|---|---|---|
| fundo da faixa | quase-preto (Lab L = 1,9) | `#2f3d22` (L = 22) | `#1b2414` (L ≈ 14) |
| contraste texto/fundo | **16,5:1** | 10:1 | **13,8:1** |
| contraste acento/fundo | **13,9:1** | **6,5:1** | **10,5:1** |
| acento | `amber-300` vivo e claro | `#d8c07a` dessaturado | `#F2CE6A` |

O `#2f3d22` é o verde dos **cartões** do site. Numa faixa de largura total ele
fica claro demais: o creme e o dourado não descolam do fundo e a barra lê como
lavada. O acento era o pior caso — **menos da metade** do contraste do bloco.

**O que mudou:** fundo para um verde do mesmo matiz, bem mais profundo, e o
dourado para um tom vivo e claro. Continua Café-da-Tarde — não virou o
preto + amarelo de Black Friday, que o próprio Bruno rejeitou no começo.

**Efeito colateral bom:** o degradê do título (creme → creme 20%) dava contraste
1,74 contra o fundo antigo; contra o novo dá 1,80, praticamente o do bloco
(1,63). **Por isso NÃO apliquei o ajuste para 35% que eu tinha sugerido** — ele
compensava o fundo lavado, e a causa raiz foi corrigida. O degradê segue fiel ao
bloco.

**Observação, não defeito:** com `terminaEm` em 31/12/2026, a caixa "Dias"
mostra **3 dígitos** ("101"), mais densa que as outras. Cabe nos 60px, mas o
bloco original nunca passa de 2. Some sozinho quando a data ficar mais perto.
