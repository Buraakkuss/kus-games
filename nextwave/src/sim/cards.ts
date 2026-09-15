import type { ArmorType, Balance, DamageType } from './types.ts';
import type { Rng } from './rng.ts';

/* Kart etkileri ve KART TEKLIF KURALLARI. Saf TypeScript — Phaser yok. */

export interface CardDef {
  id: string; name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  up: string[]; down: string[];
  mods: Mods;
  /** Bu kart hangi zirh tipine CEVAP uretir (teklif garantisi icin). */
  answers?: ArmorType[];
}

export interface Mods {
  heroDamage?: number; heroPeriod?: number; heroSpeed?: number; heroHp?: number;
  baseHp?: number; repair?: number;
  startResources?: number; burstResources?: number; debtLevels?: number;
  intel?: number; hpDrain?: number;
  unlock?: string;
  matrix?: Partial<Record<DamageType, Partial<Record<ArmorType, number>>>>;
}

/** Secilen kartlarin BIRIKMIS etkisi. World bunu okur. */
export interface Loadout {
  heroDamage: number; heroPeriod: number; heroSpeed: number; heroHp: number;
  baseHp: number; repair: number;
  startResources: number; intel: number; hpDrain: number;
  unlocked: string[];
  matrix: Balance['matrix'];
}

export function emptyLoadout(base: Balance): Loadout {
  return {
    heroDamage: 1, heroPeriod: 1, heroSpeed: 1, heroHp: 1,
    baseHp: 1, repair: 0, startResources: 0, intel: 0, hpDrain: 0,
    /* Oyun TEK kuleyle baslar. Digerleri kart ile acilir — kule cesitliligi
       bir menu degil, bir karardir. */
    unlocked: ['makineli'],
    matrix: JSON.parse(JSON.stringify(base.matrix))
  };
}

export function applyCard(lo: Loadout, card: CardDef): Loadout {
  const m = card.mods;
  const out: Loadout = { ...lo, unlocked: [...lo.unlocked], matrix: JSON.parse(JSON.stringify(lo.matrix)) };
  if (m.heroDamage) out.heroDamage *= m.heroDamage;
  if (m.heroPeriod) out.heroPeriod *= m.heroPeriod;
  if (m.heroSpeed) out.heroSpeed *= m.heroSpeed;
  if (m.heroHp) out.heroHp *= m.heroHp;
  if (m.baseHp) out.baseHp *= m.baseHp;
  if (m.repair) out.repair += m.repair;
  if (m.startResources) out.startResources += m.startResources;
  if (m.intel) out.intel += m.intel;
  if (m.hpDrain) out.hpDrain += m.hpDrain;
  if (m.unlock && !out.unlocked.includes(m.unlock)) out.unlocked.push(m.unlock);
  if (m.matrix) {
    for (const d of Object.keys(m.matrix) as DamageType[]) {
      for (const a of Object.keys(m.matrix[d]!) as ArmorType[]) {
        out.matrix[d][a] = m.matrix[d]![a]!;
      }
    }
  }
  return out;
}

/** Elimizdeki acik kulelerle + kahramanla bu zirha anlamli hasar verebiliyor muyuz? */
export function hasAnswerFor(
  lo: Loadout, armor: ArmorType, towers: Record<string, { damage: number; damageType: DamageType }>,
  heroDamage: number, shieldFlat: number
): boolean {
  const effective = (raw: number, d: DamageType) => {
    const mult = lo.matrix[d][armor];
    if (mult <= 0) return 0;
    return Math.max(0, raw * mult - (armor === 'shield' ? shieldFlat : 0));
  };
  if (effective(heroDamage * lo.heroDamage, 'kinetic') > 0.5) return true;
  return lo.unlocked.some(id => {
    const t = towers[id];
    return t ? effective(t.damage, t.damageType) > 0.5 : false;
  });
}

/**
 * Uc kart teklif eder. GDD §7 kurallari burada YASAR:
 *  1) Siradaki bolumde cevabi olmayan bir zirh varsa, tekliflerden biri
 *     MUTLAKA o cevabi tasir. Oyuncu kilitlenemez.
 *  2) Teklifte en fazla bir RISK karti bulunur.
 *  3) Ayni kart iki kez teklif edilmez, alinmis kart tekrar cikmaz.
 */
export function offerCards(
  all: Record<string, CardDef>, owned: string[], rng: Rng,
  needAnswerFor: ArmorType[], count = 3
): CardDef[] {
  const pool = Object.values(all).filter(c => !owned.includes(c.id));
  const out: CardDef[] = [];

  /* 1) Zorunlu cevap karti */
  if (needAnswerFor.length > 0) {
    const savers = pool.filter(c => c.answers?.some(a => needAnswerFor.includes(a)));
    if (savers.length > 0) out.push(savers[Math.floor(rng() * savers.length)]!);
  }

  const isRisk = (c: CardDef) => c.tags.includes('risk');
  let riskUsed = out.some(isRisk);

  const rest = pool.filter(c => !out.includes(c)).sort(() => rng() - 0.5);
  for (const c of rest) {
    if (out.length >= count) break;
    if (isRisk(c)) {
      if (riskUsed) continue;      /* 2) teklifte tek risk */
      riskUsed = true;
    }
    out.push(c);
  }
  return out;
}
