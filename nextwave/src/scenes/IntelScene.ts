import Phaser from 'phaser';
import { C, button, hit, label, panel } from '../ui/kit.ts';
import { Run, type Difficulty, type LevelDef } from '../game/run.ts';
import { AXIS_LABEL, LEVEL_LABEL, type Axis } from '../sim/intel.ts';
import type { CardDef } from '../sim/cards.ts';
import type { GameData } from '../sim/types.ts';

/* Oyunun en onemli ekrani. Once TEHDIT okunur, sonra karar verilir.
   Sira onemli: kartlar once gosterilseydi oyuncu istihbarati okumadan secerdi. */

const AXES: Axis[] = ['zirh', 'hava', 'kalkan', 'hiz', 'sayi'];

export class IntelScene extends Phaser.Scene {
  private run!: Run;
  private picked = -1;
  private offer: CardDef[] = [];
  private boxes: { x: number; y: number; w: number; h: number }[] = [];
  private sel!: Phaser.GameObjects.Graphics;

  constructor() { super('intel'); }

  init(a: { run?: Run; diff?: Difficulty }): void {
    if (a.run) { this.run = a.run; return; }
    const data = this.registry.get('data') as GameData;
    const levels = this.registry.get('levels') as LevelDef[];
    const cards = this.registry.get('cards') as Record<string, CardDef>;
    this.run = new Run(data, levels, cards, a.diff ?? 'normal', (Date.now() & 0xffff) || 7);
  }

  create(): void {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.setBackgroundColor(C.bg);
    this.picked = -1; this.boxes = [];

    const rep = this.run.intel();
    const lv = this.run.level;

    /* ---- baslik ---- */
    label(this, 16, 12, 'SONRAKİ SALDIRI İSTİHBARATI', 13, C.acc);
    label(this, W - 16, 12, `BÖLÜM ${lv.n} / ${this.run.levels.length}`, 13, C.dim, 'right');

    /* ---- rapor metni ---- */
    const txt = this.add.text(16, 36, rep.text, {
      fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '14px',
      color: rep.blackout ? C.dng : C.ink, wordWrap: { width: W - 32 }
    });

    /* ---- tehdit eksenleri ---- */
    let y = txt.y + txt.height + 14;
    const barX = 92, barW = Math.min(240, W * 0.34);
    for (const ax of AXES) {
      const v = rep.shown[ax];
      label(this, 16, y, AXIS_LABEL[ax], 11, C.dim);
      for (let i = 0; i < 3; i++) {
        const on = !rep.blackout && i <= v;
        const col = rep.blackout ? 0x2a3a4a : on ? (v === 2 ? C.dngHex : C.accHex) : 0x1f2c39;
        this.add.rectangle(barX + i * (barW / 3 + 4), y + 5, barW / 3, 9, col).setOrigin(0, 0);
      }
      label(this, barX + barW + 22, y, rep.blackout ? 'PARAZİT' : LEVEL_LABEL[v]!, 11,
        rep.blackout ? C.faint : v === 2 ? C.dng : C.dim);
      y += 20;
    }

    /* ---- guven ---- */
    const confPct = Math.round(rep.confidence * 100);
    label(this, 16, y + 4, 'İSTİHBARAT GÜVENİ', 11, C.dim);
    label(this, barX + barW + 22, y + 4, rep.blackout ? '—' : '%' + confPct, 13,
      confPct >= 85 ? C.sig : C.dng);

    /* ---- kartlar ---- */
    const top = y + 34;
    label(this, 16, top, 'YÜKSELTMENİ SEÇ', 13, C.acc);
    this.offer = this.run.offer();

    const cardTop = top + 22;
    const cardH = Math.max(120, H - cardTop - 78);
    const gap = 10;
    const cardW = (W - 32 - gap * (this.offer.length - 1)) / this.offer.length;

    this.offer.forEach((c, i) => {
      const x = 16 + i * (cardW + gap);
      panel(this, x, cardTop, cardW, cardH, C.line);
      this.boxes.push({ x, y: cardTop, w: cardW, h: cardH });

      const rarCol = c.rarity === 'legendary' ? C.dng : c.rarity === 'epic' ? C.dng
        : c.rarity === 'rare' ? C.acc : c.rarity === 'uncommon' ? C.sig : C.faint;
      label(this, x + 10, cardTop + 8, c.rarity.toUpperCase(), 9, rarCol);
      this.add.text(x + 10, cardTop + 22, c.name, {
        fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '15px',
        color: C.ink, wordWrap: { width: cardW - 20 }
      });

      let ly = cardTop + 62;
      for (const u of c.up) {
        const t = this.add.text(x + 10, ly, '+ ' + u, {
          fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '12px',
          color: C.sig, wordWrap: { width: cardW - 20 }
        });
        ly += t.height + 4;
      }
      for (const d of c.down) {
        const t = this.add.text(x + 10, ly, '− ' + d, {
          fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '12px',
          color: C.dng, wordWrap: { width: cardW - 20 }
        });
        ly += t.height + 4;
      }
      hit(this, x, cardTop, cardW, cardH, () => this.select(i));
    });

    /* Secim cercevesi TEK bir katman: panelleri yeniden cizmek metinlerin
       ustunu kapatiyordu. */
    this.sel = this.add.graphics().setDepth(5);

    /* ---- onay ---- */
    const bw = Math.min(280, W * 0.6);
    button(this, (W - bw) / 2, H - 62, bw, 48, 'ONAYLA', () => {
      if (this.picked < 0) return;
      this.run.take(this.offer[this.picked]!);
      this.scene.start('battle', { run: this.run });
    }, C.sig);
  }

  private select(i: number): void {
    this.picked = i;
    const b = this.boxes[i]!;
    this.sel.clear()
      .lineStyle(3, C.accHex, 1)
      .strokeRoundedRect(b.x, b.y, b.w, b.h, 6);
  }
}
