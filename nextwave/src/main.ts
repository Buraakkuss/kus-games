import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene.ts';
import { World } from './sim/world.ts';
import type { GameData } from './sim/types.ts';
import balance from './data/balance.json';
import enemies from './data/enemies.json';
import towers from './data/towers.json';

declare const __GAME_VERSION__: string;

const DATA = { balance, enemies, towers } as unknown as GameData;

/* 0.1.0-a kesimi: tek bolum. Tam bolum listesi 0.1.0-d'de levels verisine gecer. */
const PLAN = { budget: 300, pool: ['piyade', 'kosucu', 'zirhli'], waves: 2, waveSeconds: 18, gapSeconds: 6 };

/* Telefonda konsol yok: hata ekranin altina YAZILIR.
   Bu satir olmadan "siyah ekran" tek bilgi kaynagi olurdu. */
const ver = document.getElementById('ver')!;
function fatal(msg: string): void {
  ver.textContent = 'HATA: ' + msg;
  ver.style.color = '#e8695c';
  ver.style.maxWidth = '90vw';
}
window.addEventListener('error', e => fatal(e.message));
window.addEventListener('unhandledrejection', e => fatal(String(e.reason)));

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0a0e13',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%'
  },
  /* Fizik motoru KULLANILMIYOR: hareket ve carpisma src/sim icinde,
     boylece ayni mantik Node'da da calisiyor. */
  scene: []
});

/* Sahne BURADA, verisiyle birlikte eklenir.
   scene:[BattleScene] yazilsaydi Phaser onu veri GELMEDEN kendiliginden
   baslatir, init() bos argumanla cagrilir ve oyun siyah ekrana duserdi. */
game.scene.add('battle', BattleScene, true, { data: DATA, plan: PLAN, resources: 220 });

ver.textContent = 'V: ' + __GAME_VERSION__;

/* ?selftest=1 — diger uc oyundaki ile ayni fikir, ama burada refleks degil
   BUTUNLUK sinaniyor: tarayicida yuklenen GERCEK paket, gercek veriyle,
   gercek World sinifini kare kare oynatabiliyor mu? Sonuc document.title'a
   yazilir, tools/check.js onu okur. Ekran goruntusu almak yerine bunu
   kullaniyoruz: sanal zamanda Phaser'in kare dongusu ilerlemiyor. */
if (new URLSearchParams(location.search).get('selftest') === '1') {
  try {
    const w = new World(DATA, PLAN, 4242, 220);
    const dt = 1 / 30;
    for (let i = 0; i < 30 * 180 && w.phase === 'running'; i++) {
      w.step(dt, { x: 0, y: 0 });
      if (i === 30) w.buildTower(0, 'makineli');
    }
    document.title = `SELFTEST:OK faz=${w.phase} olen=${w.kills} ` +
      `usHP=${Math.max(0, Math.round(w.baseHp))} sure=${w.time.toFixed(0)}`;
  } catch (err) {
    document.title = 'SELFTEST:FAIL ' + (err as Error).message;
  }
}
