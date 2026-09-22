# Campanha do mês — como ligar e trocar

> Uma campanha por mês, focada numa data (alta temporada, feriado, Réveillon).
> Ela aparece em **um lugar só**: a faixa escura acima do menu, em todas as
> páginas. Tudo vem de **`src/data/campanha.json`**.

---

## O que é (e o que não é)

A faixa é **só um aviso**:

- **não tem botão** e **não tem X de fechar** — ela é fixa;
- o visitante não consegue dispensá-la (e por isso não há nada gravado no
  navegador dele);
- ela some sozinha **quando a campanha vence** — isso não é dispensa, é fim de
  campanha, e acontece na hora, sem precisar republicar o site;
- o contador nunca mostra número negativo.

**Por que não tem botão:** logo abaixo da faixa ficam os dois caminhos de
reserva do site — o botão **Reservar** do menu e o **buscador de datas** da
hero. Um terceiro botão ali em cima competiria com eles.

> O visual vem do bloco *"Announcement Bar 04 — Black Friday Countdown"* do
> shadcn space, reconstruído em Astro + CSS na paleta do hotel. Não há React,
> shadcn, Radix nem NumberFlow no site.

---

## Passo a passo

Abra `src/data/campanha.json` e mude:

| Campo | O que é |
|---|---|
| **`enabled`** | `true` liga a faixa, `false` desliga |
| **`titulo`** | o nome grande, no meio da faixa (ex.: `"Réveillon 2027"`) |
| **`subtitulo`** | a linha dourada logo abaixo do nome (ex.: `"Últimos dias"`) |
| **`oferta.antes`** | a **primeira linha**, em corpo menor e branco |
| **`oferta.destaque`** | a **segunda linha**, maior e em dourado |
| **`oferta.depois`** | emendado na segunda linha, depois do destaque (normalmente vazio) |
| **`icone`** | `"cafe"` (xícara) ou `"etiqueta"`. Valor desconhecido: não desenha ícone |
| **`terminaEm`** | data e hora do fim, **com o fuso**: `"2026-12-31T23:59:59-03:00"` |

Salve e publique. É só isso — não existe mais nenhum outro passo.

---

## Quanto texto cabe na oferta

A oferta sai em **duas linhas**, não em uma:

```
Café da manhã intercontinental completo   ← oferta.antes   (branco, menor)
Grátis                                     ← oferta.destaque (dourado, maior)
```

Medido a 1280px, por linha:

| Tamanho de cada linha | Como fica | Veredito |
|---|---|---|
| até ~40 caracteres | uma linha limpa | ✅ **é o alvo** |
| ~40 a ~55 caracteres | ainda cabe, mas o grupo empurra o título para o centro | ⚠️ confira na tela |
| **mais de ~60 caracteres** | o texto é **cortado sem aviso** e o contador some pela direita | 🔴 **não use** |

> ⚠️ **Por que o corte é silencioso:** a faixa tem `overflow: hidden`, então
> texto que não cabe simplesmente desaparece — a página não ganha rolagem
> horizontal para avisar. **Confira na tela depois de trocar.**

### A segunda linha é que precisa saltar

O desenho pressupõe que o **destaque seja a informação forte** e a primeira
linha só a prepare — "Café da manhã com" / "**50% de desconto**". Se a primeira
linha for longa e o destaque muito curto ("Café da manhã intercontinental
completo" / "**Grátis**"), a hierarquia inverte: o texto pequeno domina e o
dourado vira detalhe. Funciona, mas rende menos.

Não coloque quebra de linha na mão: a quebra entre as duas linhas é do layout.

## Onde ela muda de forma

Os mesmos degraus do bloco original:

- **até 640px** — tudo empilhado e centralizado, em corpo menor;
- **de 640px** — textos e números crescem um degrau;
- **de 1280px** — tudo numa linha só, centralizada;
- **de 1536px** — o respiro entre os blocos abre até o do original.

---

## Detalhes já resolvidos

- **O menu não sai do lugar:** a altura real da faixa é medida e publicada na
  variável CSS `--campaign-h`, que o cabeçalho usa como deslocamento — inclusive
  na home e em `/suites`, onde ele é transparente sobre a foto. A medida se
  refaz quando a janela muda de tamanho, quando o celular gira e quando a fonte
  carrega.
- **Acessibilidade:** o contador é `aria-hidden` (um leitor de tela não fica
  lendo número novo a cada segundo); no lugar dele há a frase "Esta oferta vale
  até &lt;data&gt;". Contraste AA. Quem pediu menos movimento não vê a animação
  dos dígitos.
- **Sem editor no admin.** A troca é no JSON (ou pelo editor de arquivos do
  painel). Uma tela dedicada no `/admin` exigiria uma ilha React nova —
  registrado como pendência em `PENDENCIAS-CONTEUDO.md`.

---

## O que saiu, e onde foi parar

O painel bege **"Temporada 2026"**, que ficava abaixo da hero, **foi removido**:
aquele espaço passou a ser da prova social (as avaliações do Google). O dado
continua intacto em `home.json → hero.banner`, sem ser renderizado, caso se
queira de volta.

O argumento comercial que vivia nele — *reserve direto e pague a melhor tarifa*
— **não se perdeu**. Ele continua em quatro lugares:

1. a própria faixa de campanha, quando houver campanha no ar;
2. a pergunta "Como consigo o melhor preço?" na FAQ da home;
3. o cartão verde da seção de suítes e o CTA final de todas as páginas;
4. o artigo `/promocoes-hotel-cajueiro-guaruja`.

O que ele perdeu foi a **posição de destaque acima da dobra**. Se isso fizer
falta, a saída natural é ligar uma campanha — que ocupa exatamente esse papel.
