import type { GameData } from './types.ts';
import type { Rng } from './rng.ts';

/* Dalga uretimi BUTCE tabanlidir: her bolumun bir puan butcesi vardir ve
   dusmanlar maliyetleriyle satin alinir. Zorluk artisi HP carpanindan degil,
   butcenin daha pahali ve daha cesitli dusmanlara harcanmasindan gelir. */

export interface SpawnOrder { typeId: string; at: number }

export function buildWave(
  data: GameData, rng: Rng, budget: number, pool: string[], durationSec: number
): SpawnOrder[] {
  const out: SpawnOrder[] = [];
  const affordable = () => pool.filter(id => data.enemies[id]!.cost <= budget);
  let guard = 0;
  while (budget > 0 && guard++ < 500) {
    const options = affordable();
    if (options.length === 0) break;
    const id = options[Math.floor(rng() * options.length)]!;
    budget -= data.enemies[id]!.cost;
    out.push({ typeId: id, at: 0 });
  }
  /* Zaman dagilimi KUME halindedir, esit araliklarla degil.
     Esit dagilim bir "dalga" degil bir "damlama" uretir: kahraman gelenleri
     teker teker karsilar ve hicbir zaman baski hissedilmez. Ucerli kumeler,
     varis hizini oldurme hizinin uzerine cikararak karar anini yaratir. */
  out.sort(() => rng() - 0.5);
  const perCluster = 3;
  const clusters = Math.max(1, Math.ceil(out.length / perCluster));
  out.forEach((o, i) => {
    const c = Math.floor(i / perCluster);
    const jitter = (i % perCluster) * 0.35;
    o.at = (c / clusters) * durationSec + jitter;
  });
  return out;
}
