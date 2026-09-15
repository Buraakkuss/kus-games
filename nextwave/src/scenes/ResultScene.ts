import Phaser from 'phaser';
import { C, button, label } from '../ui/kit.ts';
import type { Run } from '../game/run.ts';

export class ResultScene extends Phaser.Scene {
  private run!: Run;
  private won = false;
  private stats: { kills: number; seconds: number; basePct: number } = { kills: 0, seconds: 0, basePct: 0 };

  constructor() { super('result'); }

  init(a: { run: Run; won: boolean; stats: { kills: number; seconds: number; basePct: number } }): void {
    this.run = a.run; this.won = a.won; this.stats = a.stats;
  }

  create(): void {
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(C.bg);
    const campaignDone = this.won && this.run.finished;

    const head = campaignDone ? 'SEFER TAMAMLANDI' : this.won ? 'BÖLÜM TAMAM' : 'ÜS DÜŞTÜ';
    label(this, w / 2, h * 0.16, head, 38, this.won ? C.sig : C.dng, 'center').setFontStyle('bold');

    const rows = [
      ['Bölüm', String(this.won ? Math.min(this.run.index, this.run.levels.length) : this.run.level.n)],
      ['Öldürülen', String(this.stats.kills)],
      ['Süre', this.stats.seconds.toFixed(0) + ' sn'],
      ['Üs canı', Math.round(this.stats.basePct * 100) + '%'],
      ['Kartlar', this.run.owned.length ? this.run.owned.map(id => this.run.cards[id]!.name).join(' · ') : '—']
    ];
    rows.forEach(([k, v], i) => {
      const y = h * 0.34 + i * 26;
      label(this, w / 2 - 150, y, k!, 14, C.faint);
      label(this, w / 2 + 150, y, v!, 14, C.ink, 'right');
    });

    const bw = Math.min(320, w * 0.7), bx = (w - bw) / 2, by = h * 0.76;
    if (campaignDone) {
      button(this, bx, by, bw, 54, 'ANA MENÜ', () => this.scene.start('menu'), C.sig);
    } else if (this.won) {
      button(this, bx, by, bw, 54, 'DEVAM', () => this.scene.start('intel', { run: this.run }), C.sig);
    } else {
      button(this, bx, by, bw, 54, 'BÖLÜMÜ TEKRARLA',
        () => this.scene.start('battle', { run: this.run }), C.acc);
      button(this, bx, by + 66, bw, 46, 'ANA MENÜ', () => this.scene.start('menu'), C.dim);
    }
  }
}
