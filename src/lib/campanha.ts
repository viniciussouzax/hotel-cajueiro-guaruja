/**
 * Campanha do mês — fonte ÚNICA de verdade.
 *
 * Um só arquivo (`src/data/campanha.json`) alimenta a faixa de aviso acima do
 * menu (`CampaignBar.astro`). O banner que ficava abaixo da hero foi removido:
 * a campanha vive só na faixa, e aquele espaço passou a ser da prova social.
 *
 * Aqui mora apenas a regra de "está no ar?" e "quando acaba?".
 */
import { readData } from './readData';

export interface Campanha {
  enabled?: boolean;
  titulo?: string;
  subtitulo?: string;
  terminaEm?: string;
  oferta?: { antes?: string; destaque?: string; depois?: string };
}

export interface EstadoCampanha {
  /** Campanha ligada, com data válida e ainda no ar no momento do build. */
  ativa: boolean;
  campanha: Campanha;
  /** ISO do término, ou '' se não houver data válida. */
  fim: string;
}

export function getCampanha(): EstadoCampanha {
  const c = (readData('campanha.json', {}) || {}) as Campanha;

  const enabled = c.enabled === true;
  const d = c.terminaEm ? new Date(c.terminaEm) : null;
  const valida = !!d && !isNaN(d.getTime());

  return {
    // A página é estática e fica em cache, então o build é só o primeiro filtro:
    // quem garante o vencimento em tempo real é o script no cliente.
    ativa: enabled && valida && d!.getTime() > Date.now(),
    campanha: c,
    fim: valida ? c.terminaEm! : '',
  };
}
