/**
 * srcset das fotos de public/images a partir das variantes -480.webp/-960.webp
 * que `scripts/gerar-variantes-imagens.cjs` gera e registra em imagensVariantes.json.
 * Foto sem registro (ex.: trocada no painel e o script não rodou) devolve
 * undefined e o <img> fica só com o src original — nada quebra.
 */
import variantes from './imagensVariantes.json';

const mapa = variantes as Record<string, { w: number; variantes: number[] }>;

export function srcsetDe(src: string | undefined): string | undefined {
  const v = src ? mapa[src] : undefined;
  if (!v) return undefined;
  const base = src!.replace(/\.\w+$/, '');
  return [...v.variantes.map((w) => `${base}-${w}.webp ${w}w`), `${src} ${v.w}w`].join(', ');
}
