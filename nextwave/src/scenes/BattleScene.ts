import Phaser from 'phaser';
import { World, type LevelPlan } from '../sim/world.ts';
import type { GameData } from '../sim/types.ts';
import { Joystick } from '../ui/Joystick.ts';

/* Bu dosya YALNIZCA cizer ve girdi toplar. Tek bir hasar/menzil/hedef karari
   burada verilmez — hepsi src/sim icindedir. Kural bu; sebebi tools/sim.ts. */

const COL = {
  bg: 0x0a0e13, grid: 0x14202c,
  base: 0x35b9a4, hero: 0xf0a33c,
  light: 0xe0e6ec, heavy: 0x9aa7b4, air: 0x8fd3ff, shield: 0xc9a6ff, swarm: 0xffd48f,
  tower: 0x6f8cff, range: 0x2a3a4a, shot: 0xf0a33c, enemyShot: 0xe8695c
} as const;

export class BattleScene extends Phaser.Scene {
  private world!: World;
  private gfx!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Text;
  private stick!: Joystick;
  private data_!: GameData;
  private plan!: LevelPlan;
  private scaleF = 1;
  private offX = 0;
  private offY = 0;
  private buildIx = 0;
  private endText?: Phaser.GameObjects.Text;

  constructor() { super('battle'); }

  init(args: { data: GameData; plan: LevelPlan; resources: number }): void {
    this.data_ = args.data;
    this.plan = args.plan;
    this.world = new World(args.data, args.plan, Date.now() & 0xffff, args.resources);
  }

  create(): void {
    this.gfx = this.add.graphics();
    this.hud = this.add.text(12, 10, '', {
      fontFamily: 'monospace', fontSize: '15px', color: '#dce4ec'
    }).setDepth(10);

    this.stick = new Joystick(this);
    this.fit();
    this.scale.on('resize', () => this.fit());

    /* Sag yariya dokunus = en yakin bos yuvaya kule kur.
       Surukleme yok: tek dokunus, cunku dalga gelirken menu acmak islemiyor. */
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.x <= this.scale.width * 0.5) return;
      const types = Object.keys(this.data_.towers);
      const type = types[this.buildIx % types.length]!;
      for (let s = 0; s < this.world.bal.towerSlots.length; s++) {
        if (this.world.buildTower(s, type)) { this.buildIx++; return; }
      }
    });
  }

  override update(_t: number, deltaMs: number): void {
    const dt = Math.min(deltaMs / 1000, 1 / 20);   /* sekme koruma */
    const v = this.stick.value;
    this.world.step(dt, v);
    this.draw();
    this.drawHud();
    if (this.world.phase !== 'running' && !this.endText) this.showEnd();
  }

  /* --- dunya birimi -> ekran birimi. Dunya 1600x900, ekran ne olursa olsun. --- */
  private fit(): void {
    const w = this.scale.width, h = this.scale.height;
    const bw = this.world.bal.world.width, bh = this.world.bal.world.height;
    this.scaleF = Math.min(w / bw, h / bh);
    this.offX = (w - bw * this.scaleF) / 2;
    this.offY = (h - bh * this.scaleF) / 2;
  }
  private sx(x: number): number { return this.offX + x * this.scaleF; }
  private sy(y: number): number { return this.offY + y * this.scaleF; }
  private sl(v: number): number { return v * this.scaleF; }

  private draw(): void {
    const g = this.gfx, w = this.world, b = w.bal;
    g.clear();

    /* zemin */
    g.fillStyle(COL.bg, 1).fillRect(0, 0, this.scale.width, this.scale.height);
    g.lineStyle(1, COL.grid, 1);
    for (let x = 0; x <= b.world.width; x += 200) {
      g.lineBetween(this.sx(x), this.sy(0), this.sx(x), this.sy(b.world.height));
    }
    for (let y = 0; y <= b.world.height; y += 150) {
      g.lineBetween(this.sx(0), this.sy(y), this.sx(b.world.width), this.sy(y));
    }

    /* bos kule yuvalari */
    for (const s of b.towerSlots) {
      const taken = w.towers.some(t => t.x === s.x && t.y === s.y);
      if (taken) continue;
      g.lineStyle(2, COL.range, 1).strokeCircle(this.sx(s.x), this.sy(s.y), this.sl(26));
    }

    /* us */
    const hpFrac = Math.max(0, w.baseHp / w.baseMaxHp);
    g.fillStyle(COL.base, 0.14).fillCircle(this.sx(b.base.x), this.sy(b.base.y), this.sl(b.base.radius));
    g.lineStyle(3, COL.base, 1).strokeCircle(this.sx(b.base.x), this.sy(b.base.y), this.sl(b.base.radius));
    g.fillStyle(COL.base, 1).fillRect(
      this.sx(b.base.x - 60), this.sy(b.base.y + b.base.radius + 14),
      this.sl(120 * hpFrac), this.sl(8)
    );

    /* kuleler + menzilleri */
    for (const t of w.towers) {
      g.lineStyle(1, COL.range, 0.8).strokeCircle(this.sx(t.x), this.sy(t.y), this.sl(t.range));
      g.fillStyle(COL.tower, 1).fillCircle(this.sx(t.x), this.sy(t.y), this.sl(20));
    }

    /* dusmanlar — renk ZIRH tipini soyler, oyuncu ne isine yaradigini gormeli */
    for (const e of w.enemies) {
      const c = COL[e.armor as keyof typeof COL] as number ?? COL.light;
      g.fillStyle(c, 1).fillCircle(this.sx(e.x), this.sy(e.y), this.sl(e.armor === 'heavy' ? 16 : 12));
      const f = e.hp / e.maxHp;
      g.fillStyle(0xe8695c, 1).fillRect(this.sx(e.x - 14), this.sy(e.y - 24), this.sl(28 * f), this.sl(4));
    }

    /* kahraman */
    const h = w.hero;
    if (h.alive) {
      g.fillStyle(COL.hero, 1).fillCircle(this.sx(h.x), this.sy(h.y), this.sl(b.hero.radius));
      g.lineStyle(1, COL.hero, 0.25).strokeCircle(this.sx(h.x), this.sy(h.y), this.sl(h.range));
    }

    /* bu karedeki atislar */
    for (const s of w.shots) {
      g.lineStyle(2, s.kind === 'hero' ? COL.shot : COL.tower, 0.85);
      g.lineBetween(this.sx(s.fx), this.sy(s.fy), this.sx(s.tx), this.sy(s.ty));
    }

    /* joystick */
    if (this.stick.active) {
      const o = this.stick.origin, k = this.stick.knob;
      g.lineStyle(2, 0x8695a3, 0.5).strokeCircle(o.x, o.y, 70);
      g.fillStyle(0xdce4ec, 0.65).fillCircle(k.x, k.y, 26);
    }
  }

  private drawHud(): void {
    const w = this.world;
    this.hud.setText(
      `ÜS ${Math.max(0, Math.round(w.baseHp))}/${w.baseMaxHp}   ` +
      `HURDA ${Math.round(w.resources)}   ` +
      `DÜŞMAN ${w.enemies.length}   ÖLEN ${w.kills}   ` +
      `SÜRE ${w.time.toFixed(0)}s`
    );
  }

  private showEnd(): void {
    const won = this.world.phase === 'won';
    this.endText = this.add.text(
      this.scale.width / 2, this.scale.height / 2,
      (won ? 'BÖLÜM TAMAM' : 'ÜS DÜŞTÜ') + '\n\nyeniden başlamak için dokun',
      { fontFamily: 'monospace', fontSize: '28px', color: won ? '#35b9a4' : '#e8695c', align: 'center' }
    ).setOrigin(0.5).setDepth(20);
    this.input.once('pointerdown', () => {
      this.scene.restart({ data: this.data_, plan: this.plan, resources: 220 });
    });
  }
}
