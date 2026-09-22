# Adoção — 21/09/2026

Primeira sessão como project-developer neste repositório. Nenhum código de
negócio foi tocado nesta adoção.

## O que é

Site do **Hotel Cajueiro Guarujá**, gerado a partir do scaffold `msia-scaffold`
(o `package.json` ainda se chama `msia-scaffold`). Objetivo declarado pelo Bruno
em `Prompt.txt`: colocar o site **de verdade no ar** — arquitetura, conteúdo,
SEO, mobile e conversão, não só "sem bugs".

## Stack e execução

- Astro 5.1, `output: 'static'` + adapter Vercel → estático com rotas on-demand
  (`/admin/*`, `/api/*`, `/search`) marcadas `prerender = false`.
- React 18 só nas ilhas do admin. Tailwind 3. Gerenciador: Bun (mas há
  `package-lock.json` também; o build local roda com `npx astro build`).
- Dev: `.claude/launch.json` já tem a configuração `site` (porta 4321) — usar
  `preview_start {name: "site"}`, nunca `bun run dev` via shell.
- **Validação disponível: só `astro build`.** Não há teste, lint nem typecheck
  configurados no `package.json`.

## Baseline (21/09/2026, working tree sujo, antes de qualquer mudança minha)

`npx astro build` → **exit 0**, "Server built in 29.01s". Dois avisos que não são
falha: Node local 24 (a Vercel usará 22) e aviso de CRLF do Git. Sitemap gerado;
`/v2` fica fora dele e sai com `noindex, nofollow` — confirmado no HTML gerado.

## Divergências entre doc e código (código é a fonte de verdade)

- O `CLAUDE.md` da raiz é o do **scaffold**, não o do hotel: descreve "blogs com
  admin embarcado", não o site do hotel. Vale como referência técnica do motor;
  não descreve este produto.
- `CLAUDE.md`/`siteConfig.theme` falam de Fraunces + Karla; o site renderiza
  **Lora + Geist**. As fontes declaradas são peso morto (item 32 da auditoria).

## Riscos operacionais

- **Deploy é automático a partir do `master` na Vercel** — tratar `git push` no
  `master` como publicar. Não commitar nem empurrar sem pedido explícito.
- Persistência do admin em produção passa por `repoAtomicCommit` (GitHub Tree
  API) — o filesystem da Vercel é efêmero.
- Segredos em `.env` / Vercel: `ADMIN_SECRET`, `GITHUB_TOKEN`, e as chaves do
  Google ainda pendentes. Nunca exibir valores.
- O motor de reservas é externo (hbook/hsystem, `companyId 684c884a465ca753a717e043`).
  Nenhum teste de ponta a ponta foi feito por mim.
