import type Phaser from 'phaser';

/* Sol basparmak joystick'i. Ekranin sol yarisina basildigi YERDE dogar —
   sabit bir halkaya parmak goturmek mobilde en sik sikayet edilen seydir. */

export interface Stick { x: number; y: number }

export class Joystick {
  private originX = 0;
  private originY = 0;
  private pointerId = -1;
  private cur: Stick = { x: 0, y: 0 };
  private readonly radius: number;

  constructor(private scene: Phaser.Scene, radius = 70) {
    this.radius = radius;
    scene.input.addPointer(2);
    scene.input.on('pointerdown', this.onDown, this);
    scene.input.on('pointermove', this.onMove, this);
    scene.input.on('pointerup', this.onUp, this);
    scene.input.on('pointerupoutside', this.onUp, this);
  }

  /** -1..1 araliginda yon. Hicbir sey basili degilse {0,0}. */
  get value(): Stick { return this.cur; }
  get active(): boolean { return this.pointerId >= 0; }
  get origin(): Stick { return { x: this.originX, y: this.originY }; }

  get knob(): Stick {
    return { x: this.originX + this.cur.x * this.radius, y: this.originY + this.cur.y * this.radius };
  }

  private onDown(p: Phaser.Input.Pointer): void {
    if (this.pointerId >= 0) return;
    if (p.x > this.scene.scale.width * 0.5) return;   /* sag yari: kule/yetenek */
    this.pointerId = p.id;
    this.originX = p.x; this.originY = p.y;
    this.cur = { x: 0, y: 0 };
  }

  private onMove(p: Phaser.Input.Pointer): void {
    if (p.id !== this.pointerId) return;
    const dx = p.x - this.originX, dy = p.y - this.originY;
    const len = Math.hypot(dx, dy);
    if (len <= 1) { this.cur = { x: 0, y: 0 }; return; }
    const k = Math.min(1, len / this.radius) / len;
    this.cur = { x: dx * k, y: dy * k };
  }

  private onUp(p: Phaser.Input.Pointer): void {
    if (p.id !== this.pointerId) return;
    this.pointerId = -1;
    this.cur = { x: 0, y: 0 };
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.onDown, this);
    this.scene.input.off('pointermove', this.onMove, this);
    this.scene.input.off('pointerup', this.onUp, this);
    this.scene.input.off('pointerupoutside', this.onUp, this);
  }
}
