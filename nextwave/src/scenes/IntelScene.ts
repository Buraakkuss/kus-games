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

    /* Telefon yatay orani ~390px yuksekliktir: her sey oraya SIGMALI.
       Ilk surumde sabit araliklar kullanildi, kartlar tasti ve ONAYLA tusu
       kartin ustune bindi. Artik butun olculer yukseklikten turetiliyor. */
    const compact = H < 460;
    const fs = (big: number, small: number) => (compact ? small : big);

    /* ---- rapor metni ---- */
    const txt = this.add.text(16, 32, rep.text, {
      fontFamily: 'ui-monospace, Menlo, monospace', fontSize: fs(14, 12) + 'px',
      color: rep.blackout ? C.dng : C.ink, wordWrap: { width: W - 32 }
    });

    /* ---- tehdit eksenleri ---- */
    let y = txt.y + txt.height + fs(14, 8);
    const rowH = fs(20, 15);
    const barX = 88, barW = Math.min(240, W * 0.30);
    for (const ax of AXES) {
      const v = rep.shown[ax];
      label(this, 16, y, AXIS_LABEL[ax], fs(11, 10), C.dim);
      for (let i = 0; i < 3; i++) {
        const on = !rep.blackout && i <= v;
        const col = rep.blackout ? 0x2a3a4a : on ? (v === 2 ? C.dngHex : C.accHex) : 0x1f2c39;
        this.add.rectangle(barX + i * (barW / 3 + 4), y + 3, barW / 3, fs(9, 7), col).setOrigin(0, 0);
      }
      label(this, barX + barW + 20, y, rep.blackout ? 'PARAZİT' : LEVEL_LABEL[v]!, fs(11, 10),
        rep.blackout ? C.faint : v === 2 ? C.dng : C.dim);
      y += rowH;
    }

    /* ---- guven ---- */
    const confPct = Math.round(rep.confidence * 100);
    label(this, 16, y + 2, 'İSTİHBARAT GÜVENİ', fs(11, 10), C.dim);
    label(this, barX + barW + 20, y + 2, rep.blackout ? '—' : '%' + confPct, fs(13, 11),
      confPct >= 85 ? C.sig : C.dng);

    /* ---- kartlar ---- */
    const top = y + fs(30, 20);
    label(this, 16, top, 'YÜKSELTMENİ SEÇ', fs(13, 11), C.acc);
    this.offer = this.run.offer();

    const btnH = fs(48, 40);
    const cardTop = top + fs(22, 16);
    const cardH = Math.max(86, H - cardTop - btnH - 14);
    const gap = 8;
    const cardW = (W - 32 - gap * (this.offer.length - 1)) / this.offer.length;

    this.offer.forEach((c, i) => {
      const x = 16 + i * (cardW + gap);
      panel(this, x, cardTop, cardW, cardH, C.line);
      this.boxes.push({ x, y: cardTop, w: cardW, h: cardH });

      const rarCol = c.rarity === 'legendary' ? C.dng : c.rarity === 'epic' ? C.dng
        : c.rarity === 'rare' ? C.acc : c.rarity === 'uncommon' ? C.sig : C.faint;
      label(this, x + 8, cardTop + 6, c.rarity.toUpperCase(), fs(9, 8), rarCol);
      const nameT = this.add.text(x + 8, cardTop + fs(20, 17), c.name, {
        fontFamily: 'ui-monospace, Menlo, monospace', fontSize: fs(15, 12) + 'px',
        color: C.ink, wordWrap: { width: cardW - 16 }
      });

      /* Etkiler kartin ALT SINIRINA kadar yazilir; sigmayan satir yazilmaz —
         yarim kirpilmis metin okunakszlik uretir. */
      let ly = nameT.y + nameT.height + fs(8, 5);
      const limit = cardTop + cardH - 6;
      const line = (s2: string, col: string) => {
        if (ly >= limit) return;
        const t = this.add.text(x + 8, ly, s2, {
          fontFamily: 'ui-monospace, Menlo, monospace', fontSize: fs(12, 10) + 'px',
          color: col, wordWrap: { width: cardW - 16 }
        });
        if (ly + t.height > limit) { t.destroy(); ly = limit; return; }
        ly += t.height + 3;
      };
      for (const u of c.up) line('+ ' + u, C.sig);
      for (const d of c.down) line('− ' + d, C.dng);
      hit(this, x, cardTop, cardW, cardH, () => this.select(i));
    });

    /* Secim cercevesi TEK bir katman: panelleri yeniden cizmek metinlerin
       ustunu kapatiyordu. */
    this.sel = this.add.graphics().setDepth(5);

    /* ---- onay ---- */
    const bw = Math.min(280, W * 0.6);
    button(this, (W - bw) / 2, H - btnH - 8, bw, btnH, 'ONAYLA', () => {
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
