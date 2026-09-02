# Plano de finalização — Novo site Hotel Cajueiro

> Documento de controle para não perder contexto. Atualizar os checkboxes a cada avanço.
> Repo: `viniciussouzax/hotel-cajueiro-guaruja` (branch `master`). Dev local: porta 4399.

## Estratégia
- Menu focado no comercial: **Início, Grupos e Excursões, Corporativo, Blog, Contato**.
- Comodidade/estrutura (café, piscina, localização, o que fazer, onde comer, suítes) = **artigos do blog** usando as **URLs antigas do Wix** (preserva SEO).
- Consolidar as landings **Corporativo** e **Grupos e Excursões** DENTRO deste projeto (eram projetos Astro separados), como páginas `/corporativo` e `/grupos-e-excursoes`.

## Onda 1 — Infra + SEO (CONCLUÍDA, commits b5ab381 / f009661)
- [x] vercel.json: deploy `main` -> `master`
- [x] Remover post LifeWave + autor real (Equipe Hotel Cajueiro)
- [x] 6 artigos com URLs antigas do Wix (hotel, suites, cafe-da-manha, onde-comer, o-que-fazer, promocoes)
- [x] Reapontar CTAs da home (/hotel, /suites -> artigos)
- [x] Remover páginas-fantasma do scaffold
- [x] Redirect 301 /contato-hotel-cajueiro-guaruja -> /contato
- [x] Calendário centralizado no mobile (commit ce77b70)

## Onda 2 — Landing Corporativo (EM ANDAMENTO)
- [x] Copiar imagens do corporativo (corp-1..14.jpg)
- [x] Criar `src/pages/corporativo.astro` (hero, diferenciais, para quem é, acomodações, estrutura, galeria, onde estamos, entorno, como chegar, CTA)
- [x] Verificar build 200 e visual
- [x] Menu: item "Corporativo" -> `/corporativo` (interno, era link externo)

## Onda 3 — Landing Grupos e Excursões
- [x] Criar `src/pages/grupos-e-excursoes.astro` (conteúdo novo, mesmo padrão visual)
- [x] Menu: item "Grupos e Excursões" -> `/grupos-e-excursoes` (era 404)
- [x] Imagens (reutilizar corp-*/hero-tombo por ora; trocar por reais depois)
- [x] Verificar build 200

## Onda 4 — Fechamento
- [ ] Build geral OK (todas as rotas 200)
- [ ] Commit + push
- [ ] Atualizar memória do projeto

## Pendências para DEPOIS (fora deste ciclo)
- Fotos reais do hotel (hero e artigos usam placeholders).
- Formulário de contato /api/subscribe: confirmar envio ou apontar WhatsApp/e-mail.
- Favicon / imagem OG por página.
- Desativar/arquivar os projetos Vercel separados (corporativo landing-cnx2, grupos-excursoes-cajueiro) já que foram consolidados aqui.

## Contatos de referência
- Corporativo: e-mail corporativo@hotelcajueiroguaruja.com.br | WhatsApp 5513991439331
- Geral: (13) 3324-1331 | WhatsApp (13) 99143-9331 | contato@hotelcajueiroguaruja.com.br
- Endereço: Rua Avedis Simonian, 1177 - Guaiuba/Tombo, Guarujá/SP, CEP 11421-060
