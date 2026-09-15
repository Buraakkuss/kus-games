import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.ts';
import { IntelScene } from './scenes/IntelScene.ts';
import { BattleScene } from './scenes/BattleScene.ts';
import { ResultScene } from './scenes/ResultScene.ts';
import { Run, type LevelDef } from './game/run.ts';
import type { GameData } from './sim/types.ts';
import type { CardDef } from './sim/cards.ts';
import balance from './data/balance.json';
import enemies from './data/enemies.json';
import towers from './data/towers.json';
import cards from './data/cards.json';
import levels from './data/levels.json';

declare const __GAME_VERSION__: string;

const DATA = { balance, enemies, towers } as unknown as GameData;
const CARDS = cards as unknown as Record<string, CardDef>;
const LEVELS = levels as unknown as LevelDef[];

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

/* Veri sahnelere registry uzerinden gecer; her sahne kendi kopyasini tasimaz. */
game.registry.set('data', DATA);
game.registry.set('cards', CARDS);
game.registry.set('levels', LEVELS);

/* Sahneler BURADA eklenir. scene:[...] yazilsaydi Phaser ilkini veri GELMEDEN
   kendiliginden baslatir, init() bos argumanla cagrilir ve oyun siyah ekrana duserdi. */
game.scene.add('intel', IntelScene, false);
game.scene.add('battle', BattleScene, false);
game.scene.add('result', ResultScene, false);
/* ?scene=intel&lv=N — gelistirme kolayligi: dogrudan istihbarat ekranini acar.
   Diger uc oyundaki ?shot=1 ile ayni fikir; ekran duzenini menuden gecmeden
   telefon oraninda denetlemek icin. */
const q = new URLSearchParams(location.search);
if (q.get('scene') === 'battle') {
  const run = new Run(DATA, LEVELS, CARDS, 'normal', 99);
  const lv = Math.max(1, Math.min(LEVELS.length, Number(q.get('lv') ?? 3)));
  for (let i = 1; i < lv; i++) {
    const o = run.offer();
    if (o.length) run.take(o[0]!);
    run.advance(0.8, 10);
  }
  const o = run.offer();
  if (o.length) run.take(o[0]!);
  game.scene.add('menu', MenuScene, false);
  game.scene.start('battle', { run });
} else if (q.get('scene') === 'intel') {
  const run = new Run(DATA, LEVELS, CARDS, 'normal', 99);
  const lv = Math.max(1, Math.min(LEVELS.length, Number(q.get('lv') ?? 1)));
  for (let i = 1; i < lv; i++) {
    const o = run.offer();
    if (o.length) run.take(o[0]!);
    run.advance(0.8, 10);
  }
  game.scene.add('menu', MenuScene, false);
  game.scene.start('intel', { run });
} else {
  game.scene.add('menu', MenuScene, true);
}

ver.textContent = 'V: ' + __GAME_VERSION__;

/* ?selftest=1 — gercek paketi, gercek veriyle, bastan sona oynatir.
   Ekran goruntusu yerine bunu kullaniyoruz: sanal zamanda Phaser'in kare
   dongusu ilerlemiyor. Sonuc document.title'a yazilir, tools/check.js okur. */
if (new URLSearchParams(location.search).get('selftest') === '1') {
  void import('./sim/world.ts').then(({ World }) => {
    try {
      const run = new Run(DATA, LEVELS, CARDS, 'normal', 4242);
      let levelsDone = 0, picks = 0;
      for (let i = 0; i < LEVELS.length; i++) {
        const offer = run.offer();
        if (offer.length === 0) break;
        run.take(offer[0]!);
        picks++;
        const w = new World(DATA, run.plan(), 1000 + i, run.startResources(), run.loadout);
        w.baseHp = Math.max(40, Math.round(w.baseMaxHp * run.baseCarry));
        for (let k = 0; k < 30 * 240 && w.phase === 'running'; k++) {
          if (k === 60) w.buildTower(0, w.lo.unlocked[0]!);
          w.step(1 / 30, { x: 0, y: 0 });
        }
        if (w.phase !== 'won') break;
        run.advance(w.baseHp / w.baseMaxHp, w.kills);
        levelsDone++;
      }
      document.title = `SELFTEST:OK bolum=${levelsDone} kart=${picks} olen=${run.totalKills}`;
    } catch (err) {
      document.title = 'SELFTEST:FAIL ' + (err as Error).message;
    }
  });
}
