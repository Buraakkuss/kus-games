/* Next Wave — ortak tipler.
   Bu klasordeki HICBIR dosya Phaser import etmez. Kural bu; sebebi:
   savas mantigi Node'da, goruntusuz, 1000 kez oynatilabilmeli (tools/sim.ts).
   Phaser yalnizca src/scenes ve src/render icinde bulunur. */

export type ArmorType = 'light' | 'heavy' | 'shield' | 'swarm' | 'air';
export type DamageType = 'kinetic' | 'explosive' | 'electric' | 'thermal';

/** Dusmanin neye dogru yurudugu. Hepsi kahramana kosarsa oyun TD olmaktan cikar. */
export type TargetPriority = 'nearest' | 'base' | 'towers' | 'hero';

export interface Vec { x: number; y: number }

export interface EnemyDef {
  id: string;
  name: string;
  cost: number;          /* dalga butcesinden dusen puan */
  hp: number;
  speed: number;         /* dunya birimi / saniye */
  armor: ArmorType;
  damage: number;
  attackRange: number;
  attackPeriod: number;  /* saniye */
  target: TargetPriority;
}

export interface TowerDef {
  id: string;
  name: string;
  cost: number;
  damage: number;
  damageType: DamageType;
  range: number;
  period: number;        /* atislar arasi saniye */
  splash: number;        /* 0 = tek hedef */
  slowPct: number;       /* 0 = yavaslatma yok */
}

export interface Balance {
  world: { width: number; height: number };
  base: { x: number; y: number; hp: number; radius: number };
  hero: {
    x: number; y: number; hp: number; speed: number; radius: number;
    damage: number; damageType: DamageType; range: number; period: number;
    respawnSeconds: number;
  };
  /** hasar tipi -> zirh tipi -> carpan. 0 = bu hedefe HIC vuramaz. */
  matrix: Record<DamageType, Record<ArmorType, number>>;
  /** kalkan her vurustan sabit bu kadar hasar emer */
  shieldFlat: number;
  spawn: { x: number; yMin: number; yMax: number };
  towerSlots: Vec[];
  difficulty: Record<string, { enemyBudget: number; resources: number; intelConfidence: number }>;
}

export interface GameData {
  balance: Balance;
  enemies: Record<string, EnemyDef>;
  towers: Record<string, TowerDef>;
}
