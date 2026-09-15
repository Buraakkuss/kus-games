import type { EnemyDef } from './types.ts';
import type { Rng } from './rng.ts';

/* Oyunun ayrisma noktasi: bilginin KALITESI de bir kaynaktir.
   Sistem asla keyfi yalan soylemez — hata payi SINIRLIDIR ve ogrenilebilir. */

export type Level = 0 | 1 | 2;                 /* 0 dusuk · 1 orta · 2 yuksek */
export type Axis = 'zirh' | 'hava' | 'sayi' | 'kalkan' | 'hiz';

export const AXIS_LABEL: Record<Axis, string> = {
  zirh: 'ZIRH', hava: 'HAVA', sayi: 'SAYI', kalkan: 'KALKAN', hiz: 'HIZ'
};
export const LEVEL_LABEL = ['DÜŞÜK', 'ORTA', 'YÜKSEK'];

export interface Report {
  shown: Record<Axis, Level>;
  truth: Record<Axis, Level>;
  confidence: number;
  blackout: boolean;
  text: string;
}

/** Dalganin GERCEK bilesimini eksenlere cevirir. */
export function measure(pool: string[], enemies: Record<string, EnemyDef>, budget: number): Record<Axis, Level> {
  const defs = pool.map(id => enemies[id]!).filter(Boolean);
  const share = (pred: (e: EnemyDef) => boolean) =>
    defs.filter(pred).length / Math.max(1, defs.length);

  const armorShare = share(e => e.armor === 'heavy');
  const airShare = share(e => e.armor === 'air');
  const shieldShare = share(e => e.armor === 'shield');
  const fastShare = share(e => e.speed >= 90);
  const avgCost = defs.reduce((s, e) => s + e.cost, 0) / Math.max(1, defs.length);
  const count = budget / Math.max(1, avgCost);

  const band = (v: number, lo: number, hi: number): Level => (v <= lo ? 0 : v >= hi ? 2 : 1);
  return {
    zirh: band(armorShare, 0.15, 0.34),
    hava: band(airShare, 0.05, 0.30),
    kalkan: band(shieldShare, 0.05, 0.30),
    hiz: band(fastShare, 0.15, 0.34),
    sayi: band(count, 12, 30)
  };
}

/**
 * Olcumu oyuncuya gosterilen rapora cevirir.
 * %C olasilikla eksen dogru; (1-C) olasilikla YALNIZCA BIR KADEME kayar.
 * Asla tersine donmez — rastgele yalan soyleyen sistem ogrenilemez,
 * sinirli hata payi olan sistem okunabilir.
 */
export function report(truth: Record<Axis, Level>, confidence: number, rng: Rng, blackout: boolean): Report {
  const shown = { ...truth };
  if (!blackout) {
    for (const k of Object.keys(shown) as Axis[]) {
      if (rng() < confidence) continue;
      const dir = rng() < 0.5 ? -1 : 1;
      shown[k] = Math.max(0, Math.min(2, truth[k] + dir)) as Level;
    }
  }
  return { shown, truth, confidence, blackout, text: describe(shown, blackout) };
}

/* Metin ipucu eksenlerden TURETILIR — 100 bolum icin 100 cumle yazmak gerekmez. */
function describe(a: Record<Axis, Level>, blackout: boolean): string {
  if (blackout) return 'Radar devre dışı. Elektronik karartma altındayız — tarama yok.';
  const bits: string[] = [];
  if (a.zirh === 2) bits.push('yer sarsıntıları ve yoğun zırhlı hareket');
  else if (a.zirh === 1) bits.push('sınırlı zırhlı hareket');
  if (a.hava === 2) bits.push('alçak irtifada yoğun hava teması');
  else if (a.hava === 1) bits.push('tekil hava teması');
  if (a.kalkan >= 1) bits.push('enerji kalkanı imzaları');
  if (a.hiz === 2) bits.push('hızlı ilerleyen birlikler');
  if (a.sayi === 2) bits.push('kalabalık bir yığınak');
  else if (a.sayi === 0) bits.push('az sayıda birlik');
  if (bits.length === 0) return 'Tarama belirgin bir tehdit imzası vermiyor.';
  const head = bits.slice(0, -1).join(', ');
  const tail = bits[bits.length - 1]!;
  return 'Radar ' + (head ? head + ' ve ' + tail : tail) + ' tespit ediyor.';
}
