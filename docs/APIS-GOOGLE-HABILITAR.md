# APIs do Google a habilitar — Hotel Cajueiro

> Lista levantada do código, não de memória: cada linha abaixo corresponde a um
> endpoint que o site ou as ferramentas da pasta realmente chamam.
> Levantado em 14/09/2026.

**Onde habilitar:** Google Cloud Console → *APIs e serviços* → *Biblioteca* →
busca o nome → **Ativar**. Os links diretos estão em cada item.

**Projeto:** o OAuth do GBP está em `project-f0360ee7-20ba-4c37-a63`. A chave de
API que você mandou pertence a um projeto sem nenhuma API do Maps ativada — vale
conferir se é o mesmo e, de preferência, concentrar tudo num só.

---

## 🔴 A. Obrigatório para as avaliações no site funcionarem

| # | API | Para quê | Link |
|---|---|---|---|
| 1 | **Places API (New)** | O que alimenta a seção de avaliações. Usa dois métodos: `places:searchText` (descobre o Place ID) e `places/{id}` com `reviews` (as avaliações + nota agregada) | [Ativar](https://console.cloud.google.com/apis/library/places.googleapis.com) |

**Mais duas condições, sem as quais a #1 responde 403 mesmo ativada:**

| # | Item | Detalhe |
|---|---|---|
| 2 | **Conta de faturamento vinculada ao projeto** | O Maps Platform exige cartão cadastrado **mesmo dentro da cota gratuita**. Sem isso, todo request volta `PERMISSION_DENIED` | [Faturamento](https://console.cloud.google.com/billing) |
| 3 | **Restrição da chave de API** | Em *Credenciais* → a chave → *Restrições de API*: se estiver "Restringir chave", incluir **Places API (New)**. Em *Restrições de aplicativo*: **não pode ser por referer HTTP** — a chamada sai do servidor, não do navegador. Use "Nenhuma" ou restrição por IP | [Credenciais](https://console.cloud.google.com/apis/credentials) |

> Custo: a Places API tem cota gratuita mensal e o site faz **1 chamada por
> hora no máximo** (cache de 1h na borda, resposta compartilhada entre todos os
> visitantes). Não é um item de custo relevante nesse volume.

---

## 🟡 B. Opcional — melhora o que já existe

| # | API | Para quê | Link |
|---|---|---|---|
| 4 | ~~**Maps Embed API**~~ | **DECIDIDO EM 14/09/2026: fica como está.** Os mapas do site (home, `/contato`, `/corporativo`, `/grupos-e-excursoes`) seguem na forma sem chave (`google.com/maps?q=…&output=embed`), que funciona e não custa nada. Não habilitar, não migrar | — |
| 5 | **Geocoding API** | Só se quisermos obter lat/long oficialmente para o campo `geo` do schema do hotel (ajuda em busca local). **Alternativa sem API:** você confirma a coordenada do pino olhando o Maps e eu preencho — é a localização do seu próprio hotel | [Ativar](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com) |
| 6 | **Search Console API** | O painel em `/admin/search-console` lê `webmasters/v3` (cliques, impressões, posição, consultas). Precisa da API ativada **e** da conta de serviço adicionada como usuário na propriedade do Search Console. Não tem relação com avaliações | [Ativar](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com) |
| 7 | **Generative Language API (Gemini)** | Só se você for usar o gerador de conteúdo por IA do admin (`/admin/ai`), que chama `generativelanguage.googleapis.com`. Nada a ver com o site público | [Ativar](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com) |

---

## 🟢 C. Google Business Profile — já liberado, para referência

Estas são as APIs que o `../gbp/gbp.py` chama. **Já estão funcionando** (foi
como as 792 avaliações foram baixadas), então só precisam de atenção se você
trocar de projeto ou se algo parar. Todas usam **OAuth** com o escopo
`https://www.googleapis.com/auth/business.manage` — não usam chave de API.

| API | Usada para |
|---|---|
| **Google My Business API** (v4 legada, `mybusiness.googleapis.com`) | Listar e **responder** avaliações. É a única com acesso por allowlist (formulário aprovado) — a parte difícil já foi feita nessa conta |
| **My Business Account Management API** | Listar as contas |
| **My Business Business Information API** | Localizações, atributos, categorias, horários |
| **Business Profile Performance API** | Métricas do perfil (visualizações, cliques, ligações) |
| **My Business Lodging API** | Atributos específicos de hotel (o `build_lodging.py` monta isso) |
| **My Business Q&A API** | Perguntas e respostas do perfil |
| **My Business Place Actions API** | Links de ação (ex.: "Reservar") no perfil |
| **My Business Verifications API** | Estado de verificação do perfil |

**O que falta aqui:** o `token.json` não está mais na pasta `gbp/`. Para rodar
os scripts de novo: `py gbp.py auth`.

Se um dia quisermos **responder avaliações pelo `/admin`** do site, é por este
grupo — e aí vale checar se a tela de consentimento do projeto está **"Em
produção"**, não em "Testing" (em Testing o refresh token expira em 7 dias).

---

## ⚪ D. Não são APIs — só IDs para colar

Não existe nada para "habilitar" no Cloud Console nestes; é só pegar o
identificador e colar no admin.

| Item | Onde pegar | Onde colar |
|---|---|---|
| **GA4** — `measurementId` (`G-XXXXXXX`) | Google Analytics → Admin → Fluxos de dados | `/admin/google-tag` |
| **Meta Pixel** — `pixelId` | Gerenciador de Eventos da Meta | `/admin/meta-pixel` |
| **Verificação do Search Console** — meta tag | Search Console → Propriedade → Verificação por tag HTML | `/admin/search-console` |

---

## Resumo: o caminho mais curto

Se a ideia é só **acender as avaliações no site hoje**, são três cliques, todos
no mesmo projeto:

1. Ativar **Places API (New)**
2. Vincular **conta de faturamento**
3. Conferir que a chave **não está restrita por referer** e que inclui a Places API (New)

Depois disso, `/api/reviews` para de responder 403 e a seção da home troca o
depoimento manual pelas avaliações reais sozinha — sem mexer em código.

**Para testar se destravou**, sem precisar de mim:

```bash
curl -s "https://places.googleapis.com/v1/places:searchText" -H "Content-Type: application/json" -H "X-Goog-Api-Key: SUA_CHAVE" -H "X-Goog-FieldMask: places.id,places.displayName,places.rating,places.userRatingCount" -d '{"textQuery":"Hotel Cajueiro Guaruja","languageCode":"pt-BR"}'
```

Se voltar o nome do hotel e a nota, está pronto.
