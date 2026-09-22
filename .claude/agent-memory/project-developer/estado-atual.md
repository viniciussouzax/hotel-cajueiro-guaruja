# Estado atual — 21/09/2026

## Commitado (`master`, HEAD `a21efa1`)

Site estruturado e funcional: home com buscador ligado ao motor hbook, landings
`/corporativo` e `/grupos-e-excursoes`, `/blog` + 6 artigos em URL de raiz,
`/contato`, legais, 404, busca.

## Working tree sujo — trabalho em andamento, NÃO é meu

24 arquivos modificados + 15 novos, todos do ciclo de auditoria pré-lançamento.
São trabalho do Bruno/da sessão anterior: **não reverter, não sobrescrever, não
incluir em commit meu sem perguntar.** Blocos principais:

1. **Correções da auditoria** (`docs/AUDITORIA-LANCAMENTO.md`, itens marcados
   [FEITO]): `/contato` reescrita com canais + mapa + formulário que entrega,
   canonical em todas as páginas, `HotelSchema.astro` (JSON-LD `Hotel` na home),
   CTAs de reserva todos apontando para `/#reservar`, categorias vazias fora do
   sitemap, `/search` com `prerender = false`.
2. **Avaliações do Google** — `src/pages/api/reviews.ts` +
   `components/sections/GoogleReviews.astro`. Decisões de arquitetura na memória
   de usuário `google-reviews-sem-schema-cajueiro`: nada persistido, sem JSON-LD
   de review. Falta só a credencial.
3. **Campanha do mês** — `CampaignBar.astro` + `src/data/campanha.json` +
   `src/lib/campanha.ts`. Faixa acima do menu, sem botão e sem X, some sozinha
   quando `terminaEm` vence. Manual: `docs/CAMPANHA-DO-MES.md`.
4. **Home v2 (experimento)** — `src/pages/v2.astro` + `src/data/homeV2.json` +
   `BookingBar.astro` + `TextoFoto.astro`. Rota `/v2`, `noindex`, fora do
   sitemap. De 14 seções para 10. **Ainda não decidido se substitui a home.**

## O que trava o lançamento

Tudo rastreado em `docs/PENDENCIAS-CONTEUDO.md` (674 linhas, com o destino de
cada dado já mapeado) e resumido em `docs/AUDITORIA-LANCAMENTO.md` §4.

- **Dado que só o hotel tem:** política de cancelamento, formas de pagamento,
  crianças/berço/cama extra, animais, faixa de preço, capacidade por suíte, e a
  **nomenclatura oficial das suítes** (hoje contraditória entre `home.json`,
  `suites.json` e os artigos).
- **Credencial:** `GOOGLE_MAPS_API_KEY` + Place ID, GA4, Meta Pixel, Search
  Console, ativação do formsubmit.co para `contato@` e `corporativo@`.

Ao retomar: abrir `PENDENCIAS-CONTEUDO.md` e perguntar ao Bruno o que já tem.
