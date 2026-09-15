import Phaser from 'phaser';
import { C, FONT, button, label } from '../ui/kit.ts';
import type { Difficulty } from '../game/run.ts';

declare const __GAME_VERSION__: string;

export class MenuScene extends Phaser.Scene {
  constructor() { super('menu'); }

  create(): void {
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(C.bg);

    /* Yerlesim YUKSEKLIGE gore hesaplanir. Sabit piksel araliklariyla yazilmisti
       ve telefon yatay oraninda (844x390) alt baslik tusun ustune biniyor,
       ZOR ekrandan tasiyordu. */
    const titleSize = Math.min(w * 0.10, h * 0.17);
    let y = Math.max(8, h * 0.05);
    label(this, w / 2, y, 'NEXT WAVE', titleSize, C.acc, 'center').setFontStyle('bold');
    y += titleSize + 6;
    label(this, w / 2, y, 'düşmanı görmeden ona hazırlan', Math.min(14, h * 0.037), C.dim, 'center');
    y += Math.min(14, h * 0.037) + 14;

    const opts: [Difficulty, string, string][] = [
      ['easy', 'KOLAY', 'öğretici · istihbarat %90'],
      ['normal', 'NORMAL', 'temel deneyim · %85'],
      ['hard', 'ZOR', 'agresif · istihbarat %75']
    ];
    const bw = Math.min(360, w * 0.7), bx = (w - bw) / 2;
    const slot = (h - y - 14) / opts.length;
    const descSize = Math.min(12, h * 0.032);
    const btnH = Math.max(40, Math.min(56, slot - descSize - 10));

    opts.forEach(([d, name, desc], i) => {
      const by = y + i * slot;
      button(this, bx, by, bw, btnH, name, () => this.scene.start('intel', { diff: d }),
        d === 'normal' ? C.acc : C.dim);
      label(this, w / 2, by + btnH + 3, desc, descSize, C.faint, 'center');
    });

    this.add.text(w - 10, h - 20, 'V: ' + __GAME_VERSION__, {
      fontFamily: FONT, fontSize: '11px', color: C.faint
    }).setOrigin(1, 0);
  }
}
