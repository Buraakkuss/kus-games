import type { ArmorType, Balance, DamageType, GameData, TargetPriority, Vec } from './types.ts';
import { canHit, dist, resolveDamage } from './combat.ts';
import { mulberry32, range, type Rng } from './rng.ts';
import { buildWave, type SpawnOrder } from './waves.ts';

/* Savasin tamami burada. Phaser yok, DOM yok, zamanlayici yok:
   disaridan step(dt) cagrilir. Ekranda 60 fps ile, Node'da 20 Hz ile
   AYNI sonucu verir (tohum ayniysa). tools/sim.ts bunun uzerine kurulu. */

export interface Enemy {
  id: number; typeId: string; x: number; y: number;
  hp: number; maxHp: number; speed: number; armor: ArmorType;
  damage: number; attackRange: number; attackPeriod: number; cd: number;
  target: TargetPriority; slowUntil: number; slowPct: number;
}

export interface Tower {
  id: number; typeId: string; x: number; y: number;
  damage: number; damageType: DamageType; range: number;
  period: number; cd: number; splash: number; slowPct: number;
  hp: number; maxHp: number;
}

export interface Hero {
  x: number; y: number; hp: number; maxHp: number; speed: number;
  damage: number; damageType: DamageType; range: number;
  period: number; cd: number; alive: boolean; respawn: number;
}

/** Cizim katmaninin okuyup gostermesi icin: bu karede ne oldu. */
export interface Shot { fx: number; fy: number; tx: number; ty: number; kind: DamageType | 'hero' }

export type Phase = 'running' | 'won' | 'lost';

/** Dusmanin o an ne vurmaya gittigi — konum DEGIL, kimlik tasir. */
type Goal =
  | { kind: 'base'; x: number; y: number }
  | { kind: 'hero'; x: number; y: number }
  | { kind: 'tower'; x: number; y: number; tower: Tower };

export interface LevelPlan {
  budget: number;
  pool: string[];
  waves: number;
  waveSeconds: number;
  gapSeconds: number;
}

export class World {
  readonly bal: Balance;
  readonly data: GameData;
  readonly rng: Rng;
  readonly seed: number;

  time = 0;
  phase: Phase = 'running';
  baseHp: number;
  baseMaxHp: number;
  resources: number;
  hero: Hero;
  enemies: Enemy[] = [];
  towers: Tower[] = [];
  shots: Shot[] = [];

  /* istatistik — yenilgi/zafer ekrani ve denge simulasyonu icin */
  kills = 0;
  damageDealt = 0;
  leaked = 0;

  private plan: LevelPlan;
  private queue: SpawnOrder[] = [];
  private waveIndex = 0;
  private waveStart = 0;
  private nextId = 1;
  private spawned = 0;
  private clearedAt = -1;

  constructor(data: GameData, plan: LevelPlan, seed: number, startResources: number) {
    this.data = data;
    this.bal = data.balance;
    this.plan = plan;
    this.seed = seed;
    this.rng = mulberry32(seed);
    this.baseHp = this.baseMaxHp = this.bal.base.hp;
    this.resources = startResources;
    const h = this.bal.hero;
    this.hero = {
      x: h.x, y: h.y, hp: h.hp, maxHp: h.hp, speed: h.speed,
      damage: h.damage, damageType: h.damageType, range: h.range,
      period: h.period, cd: 0, alive: true, respawn: 0
    };
    this.startWave();
  }

  /* ---------------- kamu API ---------------- */

  /** Bos yuvaya kule kurar. Kaynak yetmezse veya yuva doluysa false doner. */
  buildTower(slot: number, typeId: string): boolean {
    const pos = this.bal.towerSlots[slot];
    const def = this.data.towers[typeId];
    if (!pos || !def) return false;
    if (this.towers.some(t => t.x === pos.x && t.y === pos.y)) return false;
    if (this.resources < def.cost) return false;
    this.resources -= def.cost;
    this.towers.push({
      id: this.nextId++, typeId, x: pos.x, y: pos.y,
      damage: def.damage, damageType: def.damageType, range: def.range,
      period: def.period, cd: 0, splash: def.splash, slowPct: def.slowPct,
      hp: 200, maxHp: 200
    });
    return true;
  }

  /** dt saniye cinsinden. move: kahramanin -1..1 araligindaki yon girdisi. */
  step(dt: number, move: Vec = { x: 0, y: 0 }): void {
    if (this.phase !== 'running') return;
    this.time += dt;
    this.shots.length = 0;

    this.spawnDue();
    this.stepHero(dt, move);
    this.stepTowers(dt);
    this.stepEnemies(dt);
    this.cull();
    this.checkPhase();
  }

  /* ---------------- ic isleyis ---------------- */

  private startWave(): void {
    const p = this.plan;
    /* Butce dalgalara esit bolunur, son dalga biraz agir olur. */
    const share = p.budget / p.waves;
    const budget = Math.round(this.waveIndex === p.waves - 1 ? share * 1.25 : share);
    this.queue = buildWave(this.data, this.rng, budget, p.pool, p.waveSeconds);
    this.waveStart = this.time;
    this.spawned = 0;
  }

  private spawnDue(): void {
    const t = this.time - this.waveStart;
    while (this.spawned < this.queue.length && this.queue[this.spawned]!.at <= t) {
      this.spawn(this.queue[this.spawned]!.typeId);
      this.spawned++;
    }
    /* Dalga bitti mi: hepsi dogdu ve sahada dusman kalmadi.
       Aradaki bosluk oyuncunun kule kurup tamir yapmasi icin. */
    if (this.spawned >= this.queue.length && this.enemies.length === 0
        && this.waveIndex < this.plan.waves - 1) {
      if (this.clearedAt < 0) this.clearedAt = this.time;
      if (this.time - this.clearedAt >= this.plan.gapSeconds) {
        this.waveIndex++;
        this.clearedAt = -1;
        this.startWave();
      }
    }
  }

  private spawn(typeId: string): void {
    const d = this.data.enemies[typeId]!;
    const s = this.bal.spawn;
    this.enemies.push({
      id: this.nextId++, typeId, x: s.x, y: range(this.rng, s.yMin, s.yMax),
      hp: d.hp, maxHp: d.hp, speed: d.speed, armor: d.armor,
      damage: d.damage, attackRange: d.attackRange, attackPeriod: d.attackPeriod,
      cd: 0, target: d.target, slowUntil: 0, slowPct: 0
    });
  }

  private stepHero(dt: number, move: Vec): void {
    const h = this.hero;
    if (!h.alive) {
      h.respawn -= dt;
      if (h.respawn <= 0) {
        h.alive = true; h.hp = h.maxHp;
        h.x = this.bal.base.x + 60; h.y = this.bal.base.y;
      }
      return;
    }
    const len = Math.hypot(move.x, move.y);
    if (len > 0.01) {
      const nx = move.x / len, ny = move.y / len;
      h.x = clamp(h.x + nx * h.speed * dt, 0, this.bal.world.width);
      h.y = clamp(h.y + ny * h.speed * dt, 0, this.bal.world.height);
    }
    /* Otomatik ates: nisan almak oyuncunun dikkat butcesini asardi. */
    h.cd -= dt;
    if (h.cd <= 0) {
      const tgt = this.nearestEnemy(h.x, h.y, h.range, h.damageType);
      if (tgt) {
        this.hit(tgt, h.damage, h.damageType);
        this.shots.push({ fx: h.x, fy: h.y, tx: tgt.x, ty: tgt.y, kind: 'hero' });
        h.cd = h.period;
      }
    }
  }

  private stepTowers(dt: number): void {
    for (const t of this.towers) {
      t.cd -= dt;
      if (t.cd > 0) continue;
      const tgt = this.nearestEnemy(t.x, t.y, t.range, t.damageType);
      if (!tgt) continue;
      t.cd = t.period;
      this.shots.push({ fx: t.x, fy: t.y, tx: tgt.x, ty: tgt.y, kind: t.damageType });
      if (t.splash > 0) {
        for (const e of this.enemies) {
          if (dist(e.x, e.y, tgt.x, tgt.y) <= t.splash && canHit(this.bal, t.damageType, e.armor)) {
            this.hit(e, t.damage, t.damageType);
          }
        }
      } else {
        this.hit(tgt, t.damage, t.damageType);
      }
      if (t.slowPct > 0) {
        for (const e of this.enemies) {
          if (dist(e.x, e.y, t.x, t.y) <= t.range) { e.slowUntil = this.time + 1.5; e.slowPct = t.slowPct; }
        }
      }
    }
  }

  private stepEnemies(dt: number): void {
    const b = this.bal.base;
    for (const e of this.enemies) {
      const goal = this.goalFor(e);
      const d = dist(e.x, e.y, goal.x, goal.y);
      const slowed = this.time < e.slowUntil ? 1 - e.slowPct : 1;
      /* Usse fiziken girmis dusman, hedefi ne olursa olsun usse vurur. */
      const inBase = dist(e.x, e.y, b.x, b.y) <= b.radius;

      if (d > e.attackRange && !inBase) {
        const sp = e.speed * slowed * dt;
        e.x += ((goal.x - e.x) / d) * sp;
        e.y += ((goal.y - e.y) / d) * sp;
        continue;
      }
      /* cd TEK yerde azaltilir; iki kez azaltmak atis hizini ikiye katliyordu. */
      e.cd -= dt;
      if (e.cd > 0) continue;
      e.cd = e.attackPeriod;
      if (inBase && goal.kind !== 'base') { this.baseHp -= e.damage; this.leaked++; }
      else this.applyEnemyDamage(e, goal);
    }
  }

  private applyEnemyDamage(e: Enemy, goal: Goal): void {
    switch (goal.kind) {
      case 'base':
        this.baseHp -= e.damage; this.leaked++;
        return;
      case 'hero':
        this.hero.hp -= e.damage;
        if (this.hero.hp <= 0) {
          this.hero.alive = false;
          this.hero.respawn = this.bal.hero.respawnSeconds;
        }
        return;
      case 'tower':
        goal.tower.hp -= e.damage;
        if (goal.tower.hp <= 0) this.towers = this.towers.filter(t => t !== goal.tower);
        return;
    }
  }

  /** Dusmanin hedef onceligi burada ETIKETLI hedefe cevrilir.
      Etiket sart: koordinat karsilastirmasi, ust uste binen nesnelerde yanlis
      hedefe vurdururdu. */
  private goalFor(e: Enemy): Goal {
    const b = this.bal.base;
    const base: Goal = { kind: 'base', x: b.x, y: b.y };
    const heroGoal = (): Goal => ({ kind: 'hero', x: this.hero.x, y: this.hero.y });
    switch (e.target) {
      case 'base': return base;
      case 'hero': return this.hero.alive ? heroGoal() : base;
      case 'towers': {
        const t = this.nearestTower(e.x, e.y);
        return t ? { kind: 'tower', x: t.x, y: t.y, tower: t } : base;
      }
      default: {
        const hd = this.hero.alive ? dist(e.x, e.y, this.hero.x, this.hero.y) : Infinity;
        const t = this.nearestTower(e.x, e.y);
        const td = t ? dist(e.x, e.y, t.x, t.y) : Infinity;
        const bd = dist(e.x, e.y, b.x, b.y);
        if (hd <= td && hd <= bd) return heroGoal();
        if (td <= bd && t) return { kind: 'tower', x: t.x, y: t.y, tower: t };
        return base;
      }
    }
  }

  private nearestTower(x: number, y: number): Tower | null {
    let best: Tower | null = null, bd = Infinity;
    for (const t of this.towers) {
      const d = dist(x, y, t.x, t.y);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  /** Vurulamayan zirhi (havan vs hava) hedef olarak SECMEZ — bosa atis yapmaz. */
  private nearestEnemy(x: number, y: number, rng: number, dmg: DamageType): Enemy | null {
    let best: Enemy | null = null, bd = Infinity;
    for (const e of this.enemies) {
      if (!canHit(this.bal, dmg, e.armor)) continue;
      const d = dist(x, y, e.x, e.y);
      if (d <= rng && d < bd) { bd = d; best = e; }
    }
    return best;
  }

  private hit(e: Enemy, raw: number, dmg: DamageType): void {
    const real = resolveDamage(this.bal, raw, dmg, e.armor);
    e.hp -= real;
    this.damageDealt += real;
  }

  private cull(): void {
    const before = this.enemies.length;
    this.enemies = this.enemies.filter(e => e.hp > 0);
    this.kills += before - this.enemies.length;
  }

  private checkPhase(): void {
    if (this.baseHp <= 0) { this.phase = 'lost'; return; }
    const lastWave = this.waveIndex >= this.plan.waves - 1;
    if (lastWave && this.spawned >= this.queue.length && this.enemies.length === 0) {
      this.phase = 'won';
    }
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
