import Phaser from 'phaser';

/* Ortak arayuz parcalari. Mobil once: dokunma hedefleri >= 44px,
   yazi tipleri sistem yigininda (font dosyasi tasimiyoruz). */

export const C = {
  bg: '#0a0e13', surface: 0x111820, line: 0x1f2c39,
  ink: '#dce4ec', dim: '#8695a3', faint: '#67757f',
  acc: '#f0a33c', accHex: 0xf0a33c,
  sig: '#35b9a4', sigHex: 0x35b9a4,
  dng: '#e8695c', dngHex: 0xe8695c
} as const;

export const FONT = 'ui-monospace, Menlo, Consolas, monospace';

export function panel(
  s: Phaser.Scene, x: number, y: number, w: number, h: number,
  stroke: number = C.line, fill: number = C.surface, alpha = 1
): Phaser.GameObjects.Graphics {
  const g = s.add.graphics();
  g.fillStyle(fill, alpha).fillRoundedRect(x, y, w, h, 6);
  g.lineStyle(2, stroke, 1).strokeRoundedRect(x, y, w, h, 6);
  return g;
}

export function label(
  s: Phaser.Scene, x: number, y: number, text: string,
  size: number, color: string, align: 'left' | 'center' | 'right' = 'left'
): Phaser.GameObjects.Text {
  const t = s.add.text(x, y, text, {
    fontFamily: FONT, fontSize: size + 'px', color, align,
    wordWrap: { width: 10_000 }
  });
  if (align === 'center') t.setOrigin(0.5, 0);
  if (align === 'right') t.setOrigin(1, 0);
  return t;
}

/** Dokunulabilir dikdortgen. Gorsel kendisi degil, ustune cizilir. */
export function hit(
  s: Phaser.Scene, x: number, y: number, w: number, h: number, onTap: () => void
): Phaser.GameObjects.Rectangle {
  const r = s.add.rectangle(x + w / 2, y + h / 2, w, h, 0x000000, 0)
    .setInteractive({ useHandCursor: true });
  r.on('pointerup', onTap);
  return r;
}

export function button(
  s: Phaser.Scene, x: number, y: number, w: number, h: number,
  text: string, onTap: () => void, accent: string = C.acc
): void {
  const hex = Phaser.Display.Color.HexStringToColor(accent).color;
  panel(s, x, y, w, h, hex, hex, 0.12);
  /* Yazi boyu tus yuksekligine baglidir; sabit 20px kisa tuslarda tasiyordu. */
  const fs = Math.max(13, Math.min(20, h * 0.40));
  label(s, x + w / 2, y + (h - fs * 1.3) / 2, text, fs, accent, 'center');
  hit(s, x, y, w, h, onTap);
}
