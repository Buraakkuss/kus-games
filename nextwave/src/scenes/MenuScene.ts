import Phaser from 'phaser';
import { C, FONT, button, label } from '../ui/kit.ts';
import type { Difficulty } from '../game/run.ts';

declare const __GAME_VERSION__: string;

export class MenuScene extends Phaser.Scene {
  constructor() { super('menu'); }

  create(): void {
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(C.bg);

    label(this, w / 2, h * 0.16, 'NEXT WAVE', Math.min(64, w * 0.11), C.acc, 'center')
      .setFontStyle('bold');
    label(this, w / 2, h * 0.16 + Math.min(64, w * 0.11) + 6,
      'düşmanı gör­meden ona hazırlan', 15, C.dim, 'center');

    const bw = Math.min(360, w * 0.7), bx = (w - bw) / 2;
    const opts: [Difficulty, string, string][] = [
      ['easy', 'KOLAY', 'öğretici · istihbarat %90'],
      ['normal', 'NORMAL', 'temel deneyim · %85'],
      ['hard', 'ZOR', 'agresif · istihbarat %75']
    ];
    opts.forEach(([d, name, desc], i) => {
      const y = h * 0.40 + i * 76;
      button(this, bx, y, bw, 56, name, () => this.scene.start('intel', { diff: d }),
        d === 'normal' ? C.acc : C.dim);
      label(this, w / 2, y + 58, desc, 12, C.faint, 'center');
    });

    this.add.text(w - 10, h - 20, 'V: ' + __GAME_VERSION__, {
      fontFamily: FONT, fontSize: '11px', color: C.faint
    }).setOrigin(1, 0);
  }
}
