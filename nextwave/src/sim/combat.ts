import type { ArmorType, Balance, DamageType } from './types.ts';

/* Hasar hesabinin TEK yeri. Kule de kahraman da buradan gecer,
   boylece "neden bu kule ise yaramiyor" sorusunun cevabi tek dosyada kalir. */

/** Bu hasar tipi bu zirhi hedefleyebilir mi? 0 carpan = hic vuramaz (havan/hava). */
export function canHit(bal: Balance, dmg: DamageType, armor: ArmorType): boolean {
  return bal.matrix[dmg][armor] > 0;
}

/**
 * Ham hasari zirha gore gercek hasara cevirir.
 * Iki kademe vardir ve sirasi onemlidir:
 *   1) tip carpani  (matris)
 *   2) kalkanin SABIT emilimi
 * Sira bu yuzden onemli: kalkan sabit emdigi icin, saniyede 20 kucuk vurus
 * yapan makineli neredeyse hic hasar gecirmez; tek seferde 90 vuran havan
 * kalkani deler. "Hizli ates her zaman iyidir" sezgisini kiran kural budur.
 */
export function resolveDamage(bal: Balance, raw: number, dmg: DamageType, armor: ArmorType): number {
  const mult = bal.matrix[dmg][armor];
  if (mult <= 0) return 0;
  let out = raw * mult;
  if (armor === 'shield') out -= bal.shieldFlat;
  return out > 0 ? out : 0;
}

export function dist(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx, dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}
