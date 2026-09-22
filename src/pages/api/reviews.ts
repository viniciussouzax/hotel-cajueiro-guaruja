/**
 * api/reviews.ts — Avaliações reais do Google (Places API New)
 *
 * POR QUE ASSIM
 * -------------
 * Caminho oficial e sancionado pelo Google para mostrar avaliações do perfil da
 * empresa num site próprio: **Places API (New) → Place Details**, campo
 * `reviews`. Devolve as avaliações públicas do local com autor, nota, texto e o
 * link canônico da avaliação no Google Maps.
 *
 * Não usamos a Google Business Profile API (ex-My Business), embora este projeto
 * já tenha acesso a ela (ver ../gbp/ na pasta-mãe, com 792 avaliações baixadas):
 * ela autentica por OAuth de usuário, não por chave, e rodar no servidor exigiria
 * guardar refresh token na Vercel — que expira em 7 dias se a tela de
 * consentimento estiver em "Testing". O GBP segue sendo a ferramenta certa para
 * ANALISAR e RESPONDER avaliações; para EXIBIR no site, Places API não expira.
 * Detalhes e a decisão completa em docs/PENDENCIAS-CONTEUDO.md §3.
 *
 * REGRAS QUE ESTE ARQUIVO RESPEITA (é o que evita penalização / quebra de ToS)
 * ---------------------------------------------------------------------------
 * 1. SEM PERSISTIR. Os termos do Maps Platform proíbem cachear conteúdo do
 *    Google, salvo exceções nomeadas (place ID é exceção; texto de avaliação
 *    NÃO é). Por isso nada é gravado em `src/data/` nem commitado no repo:
 *    a rota é on-demand e só usa cache HTTP curto (1h) na borda.
 * 2. ATRIBUIÇÃO OBRIGATÓRIA. Devolvemos nome, foto e perfil do autor, além do
 *    `googleMapsUri` de cada avaliação — o visitante tem que conseguir abrir a
 *    avaliação original no Google. O componente que renderiza usa tudo isso.
 * 3. TEXTO NÃO É EDITADO. Só filtramos quais avaliações exibir (nota mínima
 *    configurável); o conteúdo de cada uma vai como o Google devolveu.
 * 4. NADA DISSO VIRA `Review`/`AggregateRating` em JSON-LD. Avaliação sobre o
 *    hotel publicada no site do próprio hotel é "self-serving" para o Google, e
 *    agregar nota de terceiro no próprio markup é violação explícita das
 *    diretrizes de review snippet. Exibir: pode. Marcar como dado estruturado
 *    para ganhar estrela na busca: não. É exatamente aí que mora a penalização.
 *
 * CONFIGURAÇÃO
 * ------------
 * - `GOOGLE_MAPS_API_KEY` (env, nunca no repo) — chave do Google Cloud com a
 *   **Places API (New)** habilitada. Como o uso é server-side, restrinja a
 *   chave por API, não por referer.
 * - `pluginsConfig.json → googleReviews.placeId` — Place ID do hotel.
 *   O Place ID pode ser guardado indefinidamente (é a exceção dos termos).
 * - `googleReviews.minRating` / `googleReviews.max`: NAO sao mais aplicados.
 *   Filtrar por nota ou cortar a lista e' o que a politica manda divulgar —
 *   preferimos nao mexer. Place Details ja devolve no maximo 5, por relevancia.
 *
 * Sem chave ou sem placeId a rota devolve `{ configured: false }` e o site cai
 * no depoimento manual de `home.json` — nada quebra.
 */

import type { APIRoute } from 'astro';
import { readPluginsConfig, readDataFile } from '../../plugins/_server';

export const prerender = false;

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places';
const SEARCH_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
// Só os campos que a gente realmente exibe (field mask = menos custo por chamada).
const FIELD_MASK = [
  'id',
  'displayName',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews',
  // flagContentUri vem dentro de cada review; pedido explicitamente para
  // oferecer o link de denuncia de conteudo que a politica recomenda.
].join(',');

/**
 * Descobre o Place ID a partir do nome + endereço do hotel (Text Search).
 *
 * Existe para não travar a integração esperando alguém colar o Place ID na mão:
 * com a chave da API configurada, isso se resolve sozinho. O Place ID é a única
 * informação do Google que os termos permitem guardar indefinidamente, então
 * cacheamos em memória e devolvemos na resposta — basta colar uma vez em
 * `pluginsConfig.json → googleReviews.placeId` para evitar a chamada extra.
 */
let cachedPlaceId: string | null = null;

async function resolvePlaceId(apiKey: string, query: string): Promise<string> {
  if (cachedPlaceId) return cachedPlaceId;
  const res = await fetch(SEARCH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'pt-BR', maxResultCount: 1 }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`searchText-${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  const id = String(data?.places?.[0]?.id || '');
  if (!id) throw new Error('place-not-found');
  cachedPlaceId = id;
  return id;
}

type NormalizedReview = {
  name: string;
  rating: number;
  text: string;
  relativeTime: string;
  authorName: string;
  authorPhoto: string;
  authorUri: string;
  googleMapsUri: string;
  flagContentUri: string;
  publishTime: string;
};

function normalizeReview(r: any): NormalizedReview | null {
  // Preferimos SEMPRE o texto original do autor. Assim nao precisamos exibir o
  // aviso de traducao da politica, e o texto vai exatamente como foi escrito.
  const text = String(r?.originalText?.text || r?.text?.text || '').trim();
  if (!text) return null;
  const author = r?.authorAttribution || {};
  return {
    name: String(r?.name || ''),
    rating: Number(r?.rating || 0),
    text,
    relativeTime: String(r?.relativePublishTimeDescription || ''),
    authorName: String(author?.displayName || ''),
    authorPhoto: String(author?.photoUri || ''),
    authorUri: String(author?.uri || ''),
    googleMapsUri: String(r?.googleMapsUri || ''),
    // Politica "Ativar denuncias de conteudo": link oficial para sinalizar.
    flagContentUri: String(r?.flagContentUri || ''),
    publishTime: String(r?.publishTime || ''),
  };
}

export const GET: APIRoute = async () => {
  const json = (data: any, status = 200, cache = 'no-store') =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': cache },
    });

  const cfg = readPluginsConfig()?.googleReviews || {};
  const placeId = String(cfg.placeId || '').trim();
  // `import.meta.env` é o que o Astro popula a partir do .env em dev; na Vercel a
  // env var chega em `process.env`. Ler os dois evita "funciona em produção,
  // não funciona local" (e vice-versa).
  const apiKey = String(
    (import.meta as any).env?.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || ''
  ).trim();
  // `minRating`: nota minima exibida. Por padrao 0 = mostra tudo que veio.
  // ATENCAO — filtrar e' escolha do dono do site, com dois efeitos que nao se
  // pode esconder: (1) a politica do Places exige DIVULGAR qualquer filtro, e e'
  // o que o `orderNotice` abaixo passa a dizer; (2) a Place Details devolve no
  // maximo 5 avaliacoes, entao exigir nota alta pode deixar a secao com duas ou
  // tres. Quem ajusta isto em `pluginsConfig.json` precisa conferir quantas
  // sobraram. `max` continua sem uso: cortar por quantidade nao tem ganho.
  const minRating = Number(cfg.minRating) || 0;

  if (cfg.enabled === false) return json({ configured: false, reason: 'disabled' });
  // A chave é o único item realmente obrigatório: sem placeId a gente descobre.
  if (!apiKey) return json({ configured: false, reason: 'missing-api-key' });

  try {
    let resolvedPlaceId = placeId;
    let autoResolved = false;
    if (!resolvedPlaceId) {
      const site = readDataFile<any>('siteConfig.json', {});
      const query = [site?.name, site?.contact?.address].filter(Boolean).join(', ');
      if (!query) return json({ configured: false, reason: 'missing-place-id' });
      resolvedPlaceId = await resolvePlaceId(apiKey, query);
      autoResolved = true;
    }

    const res = await fetch(`${PLACES_ENDPOINT}/${encodeURIComponent(resolvedPlaceId)}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
        // O Google devolve a tradução no idioma pedido e mantém `originalText`.
        'Accept-Language': 'pt-BR',
      },
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return json(
        { configured: true, error: `places-${res.status}`, detail: detail.slice(0, 300) },
        502
      );
    }

    const place = await res.json();
    // POLITICA: as avaliacoes vao na ORDEM E NA INTEGRA como o Google devolveu
    // Ordem preservada como o Google devolveu (relevancia). Descartamos a
    // avaliacao SEM TEXTO (nao ha o que renderizar) e, se `minRating` estiver
    // configurado, as abaixo da nota — e nesse caso o aviso ao pe da secao
    // passa a declarar o filtro, porque a politica exige divulga-lo.
    const todas = (Array.isArray(place?.reviews) ? place.reviews : [])
      .map(normalizeReview)
      .filter((r: NormalizedReview | null): r is NormalizedReview => !!r);
    const reviews = minRating > 0
      ? todas.filter((r) => Number(r.rating) >= minRating)
      : todas;

    return json(
      {
        configured: true,
        // Quando veio da busca automática, cole este valor em
        // pluginsConfig.json → googleReviews.placeId pra economizar a chamada.
        placeId: resolvedPlaceId,
        // Texto exigido pela política: como as avaliações estão ordenadas.
        orderNotice: minRating > 0
          ? `Avaliações publicadas no Google Maps, na ordem de relevância definida pelo Google. Exibimos aqui as de ${minRating} estrela${minRating === 1 ? '' : 's'} ou mais; o texto não é editado. A nota e o total acima consideram todas as ${Number(place?.userRatingCount || 0)} avaliações.`
          : 'Avaliações publicadas no Google Maps, na ordem de relevância definida pelo Google. Não selecionamos, filtramos nem editamos nenhuma delas.',
        minRating,
        totalDisponivel: todas.length,
        placeIdAutoResolved: autoResolved,
        rating: Number(place?.rating || 0),
        userRatingCount: Number(place?.userRatingCount || 0),
        googleMapsUri: String(place?.googleMapsUri || ''),
        reviews,
      },
      200,
      // Cache curto só na borda — sem persistência (ver regra 1 no topo).
      'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
    );
  } catch (err: any) {
    const msg = String(err?.message || 'fetch-failed');
    // 403 do Places quase sempre é projeto sem a API habilitada, sem faturamento,
    // ou chave restrita por referer (que não funciona em chamada de servidor).
    const hint = msg.includes('403')
      ? 'Chave válida, mas o projeto do Google Cloud provavelmente está sem a "Places API (New)" habilitada, sem conta de faturamento vinculada, ou a chave está restrita por referer/API errada. Ver docs/PENDENCIAS-CONTEUDO.md §3.'
      : undefined;
    return json({ configured: true, error: msg, ...(hint ? { hint } : {}) }, 502);
  }
};
