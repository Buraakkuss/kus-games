import type { GameData } from '../sim/types.ts';
import type { LevelPlan } from '../sim/world.ts';
import { applyCard, emptyLoadout, hasAnswerFor, offerCards, type CardDef, type Loadout } from '../sim/cards.ts';
import { measure, report, type Report } from '../sim/intel.ts';
import { mulberry32, type Rng } from '../sim/rng.ts';
import type { ArmorType } from '../sim/types.ts';

/* Bir SEFERIN durumu: hangi bolumdeyiz, hangi kartlar alindi, ne birikti.
   Saf veri — Phaser bilmez, boylece simulasyon da ayni akisi oynatabilir. */

export interface LevelDef {
  n: number; type: string; budget: number; pool: string[];
  waves: number; waveSeconds: number; gapSeconds: number; ders: string;
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export class Run {
  readonly data: GameData;
  readonly levels: LevelDef[];
  readonly cards: Record<string, CardDef>;
  readonly diff: Difficulty;
  readonly rng: Rng;

  index = 0;
  loadout: Loadout;
  owned: string[] = [];
  debt = 0;               /* Acil Ekonomi: kalan borclu bolum sayisi */
  burst = 0;              /* bu bolume ozel tek seferlik hurda */
  baseCarry = 1;          /* us caninin yuzde kaci bir sonraki bolume tasiniyor */
  totalKills = 0;

  constructor(data: GameData, levels: LevelDef[], cards: Record<string, CardDef>, diff: Difficulty, seed: number) {
    this.data = data; this.levels = levels; this.cards = cards; this.diff = diff;
    this.rng = mulberry32(seed);
    this.loadout = emptyLoadout(data.balance);
  }

  get level(): LevelDef { return this.levels[Math.min(this.index, this.levels.length - 1)]!; }
  get finished(): boolean { return this.index >= this.levels.length; }
  private get dm() { return this.data.balance.difficulty[this.diff]!; }

  plan(): LevelPlan {
    const l = this.level;
    return {
      budget: Math.round(l.budget * this.dm.enemyBudget),
      pool: l.pool, waves: l.waves, waveSeconds: l.waveSeconds, gapSeconds: l.gapSeconds
    };
  }

  startResources(): number {
    const base = 180 + this.index * 40 + this.loadout.startResources;
    const scaled = base * this.dm.resources * (this.debt > 0 ? 0.85 : 1);
    const out = Math.round(scaled) + this.burst;
    this.burst = 0;
    return out;
  }

  /** Siradaki bolumde cevabimiz olmayan zirh tipleri. Teklif garantisi bunu kullanir. */
  missingAnswers(): ArmorType[] {
    const armors = [...new Set(this.level.pool.map(id => this.data.enemies[id]!.armor))];
    return armors.filter(a => !hasAnswerFor(
      this.loadout, a, this.data.towers, this.data.balance.hero.damage, this.data.balance.shieldFlat
    ));
  }

  intel(): Report {
    const l = this.level;
    const truth = measure(l.pool, this.data.enemies, this.plan().budget);
    const conf = Math.min(0.95, this.dm.intelConfidence + this.loadout.intel);
    return report(truth, conf, this.rng, l.type === 'karartma');
  }

  offer(): CardDef[] {
    return offerCards(this.cards, this.owned, this.rng, this.missingAnswers(), 3);
  }

  take(card: CardDef): void {
    this.owned.push(card.id);
    this.loadout = applyCard(this.loadout, card);
    if (card.mods.burstResources) this.burst += card.mods.burstResources;
    if (card.mods.debtLevels) this.debt += card.mods.debtLevels;
  }

  /** Bolum kazanildi: sonraki bolume gec, us onarimini uygula. */
  advance(baseLeftPct: number, kills: number): void {
    this.totalKills += kills;
    this.index++;
    if (this.debt > 0) this.debt--;
    this.baseCarry = Math.min(1, baseLeftPct + this.loadout.repair);
  }
}
