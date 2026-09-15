/* Denge simulatoru — goruntusuz, Node'da calisir.
 *
 *   npm run sim            (RUNS=... ornekmi buyutur)
 *
 * Slot ve Latch'te "mukemmel oynayan yapay oyuncu olmemeli (deaths=0)" garantisi
 * var. Next Wave bir refleks oyunu olmadigi icin ayni test ise yaramaz.
 * Karsiligi bu: GERCEK sefer akisi (istihbarat -> kart -> savas -> sonraki bolum)
 * farkli KART POLITIKALARIYLA yuzlerce kez oynatilir.
 *
 * Dogruladigimiz uc iddia:
 *   dengeli politika seferi goturebilmeli      -> oyun adil
 *   hasar odakli politika daha erken tikanmali -> yanlis strateji cezali
 *   kor politika Kolay'da ilerleyebilmeli      -> oyun affediyor
 */
import { readFileSync } from 'node:fs';
import { World } from '../src/sim/world.ts';
import { Run, type Difficulty, type LevelDef } from '../src/game/run.ts';
import type { CardDef } from '../src/sim/cards.ts';
import type { GameData } from '../src/sim/types.ts';

const here = new URL('.', import.meta.url);
const read = (p: string) => JSON.parse(readFileSync(new URL('../src/data/' + p, here), 'utf8'));

const DATA: GameData = {
  balance: read('balance.json'),
  enemies: read('enemies.json'),
  towers: read('towers.json')
};
const CARDS: Record<string, CardDef> = read('cards.json');
const LEVELS: LevelDef[] = read('levels.json');

type Policy = 'dengeli' | 'hasar' | 'kor';

/** Kart secimi — oyuncunun stratejisini temsil eder. */
function chooseCard(policy: Policy, run: Run, offer: CardDef[], rnd: number): CardDef {
  if (offer.length === 1) return offer[0]!;
  if (policy === 'kor') return offer[Math.floor(rnd * offer.length)]!;

  if (policy === 'hasar') {
    /* Savunmayi, kule acmayi ve ekonomiyi TAMAMEN yok sayar; hep en cok hasar.
       Beraberlikte RASTGELE secer — siralamanin ilk elemanini almak, teklif
       garantisi kurtarici karti basa koydugu icin bu politikayi kazara
       kurtariyordu ve "yanlis strateji cezali" iddiasini olcusuz birakiyordu. */
    const score = (c: CardDef) => (c.mods.heroDamage ?? 1) / (c.mods.heroPeriod ?? 1);
    const best = Math.max(...offer.map(score));
    const tied = offer.filter(c => score(c) === best);
    return tied[Math.floor(rnd * tied.length)]!;
  }

  /* dengeli: once eksik cevabi kapat, sonra kule ac, sonra savunma, sonra hasar */
  const missing = run.missingAnswers();
  const saver = offer.find(c => c.answers?.some(a => missing.includes(a)));
  if (saver) return saver;
  const unlock = offer.find(c => c.mods.unlock);
  if (unlock && run.loadout.unlocked.length < 2) return unlock;
  const defense = offer.find(c => (c.mods.baseHp ?? 1) > 1 || (c.mods.repair ?? 0) > 0);
  if (defense && run.index >= 2 && rnd < 0.5) return defense;
  return [...offer].sort((a, b) => (b.mods.heroDamage ?? 1) - (a.mods.heroDamage ?? 1))[0]!;
}

/** Kahramani surer — insan oyuncunun yerine gecer. */
function heroMove(w: World): { x: number; y: number } {
  if (!w.hero.alive || w.enemies.length === 0) return { x: 0, y: 0 };
  let best = w.enemies[0]!, bd = Infinity;
  for (const e of w.enemies) {
    const d = Math.hypot(e.x - w.hero.x, e.y - w.hero.y);
    if (d < bd) { bd = d; best = e; }
  }
  if (bd < w.hero.range * 0.8) return { x: 0, y: 0 };
  return { x: best.x - w.hero.x, y: best.y - w.hero.y };
}

/** Bir seferi bastan sona oynar, kac bolum tamamlandigini doner. */
function playRun(policy: Policy, diff: Difficulty, seed: number): number {
  const run = new Run(DATA, LEVELS, CARDS, diff, seed);
  let done = 0;

  for (let li = 0; li < LEVELS.length; li++) {
    const offer = run.offer();
    if (offer.length > 0) run.take(chooseCard(policy, run, offer, run.rng()));

    const w = new World(DATA, run.plan(), seed * 31 + li, run.startResources(), run.loadout);
    w.baseHp = Math.max(40, Math.round(w.baseMaxHp * run.baseCarry));

    const dt = 1 / 30;
    for (let i = 0; i < 30 * 240 && w.phase === 'running'; i++) {
      /* Kaynak varsa bos yuvaya kule kur — insan oyuncu da bunu yapar. */
      for (let s = 0; s < DATA.balance.towerSlots.length; s++) {
        const type = w.lo.unlocked[s % w.lo.unlocked.length]!;
        if (w.buildTower(s, type)) break;
      }
      w.step(dt, heroMove(w));
    }
    if (w.phase !== 'won') break;
    run.advance(w.baseHp / w.baseMaxHp, w.kills);
    done++;
  }
  return done;
}

function measure(policy: Policy, diff: Difficulty, runs: number): { avg: number; full: number } {
  let sum = 0, full = 0;
  for (let r = 0; r < runs; r++) {
    const d = playRun(policy, diff, 1000 + r * 7);
    sum += d;
    if (d >= LEVELS.length) full++;
  }
  return { avg: sum / runs, full: full / runs };
}

const RUNS = Number(process.env.RUNS ?? 120);
console.log(`\nNext Wave — denge simulasyonu (${RUNS} sefer, ${LEVELS.length} bolum)\n`);
console.log('politika      zorluk    ort.bolum   tam sefer');
console.log('--------------------------------------------------');

const R: Record<string, { avg: number; full: number }> = {};
for (const [p, d] of [
  ['dengeli', 'normal'], ['hasar', 'normal'], ['kor', 'easy'], ['dengeli', 'hard']
] as [Policy, Difficulty][]) {
  const m = measure(p, d, RUNS);
  R[`${p}/${d}`] = m;
  console.log(`${p.padEnd(12)}  ${d.padEnd(7)} ${m.avg.toFixed(1).padStart(9)}   ${(m.full * 100).toFixed(0).padStart(7)}%`);
}

let fail = 0;
const assert = (ok: boolean, msg: string) => {
  console.log(`  ${ok ? '\x1b[32mOK\x1b[0m  ' : '\x1b[31mHATA\x1b[0m'} ${msg}`);
  if (!ok) fail++;
};
console.log('\nEsikler');
const dn = R['dengeli/normal']!, hn = R['hasar/normal']!, ke = R['kor/easy']!;
assert(dn.avg >= 6, `dengeli politika Normal'de ortalama >=6 bolum gecmeli (olculen ${dn.avg.toFixed(1)}) - oyun adil`);
/* Olcut ORTALAMA BOLUM degil TAM SEFER ORANI: 10 bolumluk bir dilimde ortalama
   tavana dayanip sikisiyor (9.4 vs 9.1), cezayi gizliyor. Tamamlama orani ayni
   farki net gosteriyor (%92 vs %78) — iddiayi gercekten olcen metrik budur. */
assert(hn.full < dn.full - 0.08,
  `hasar odakli politika seferi daha az tamamlamali (%${(hn.full * 100).toFixed(0)} < %${(dn.full * 100).toFixed(0)}) - yanlis strateji cezali`);
assert(ke.avg >= 3, `kor politika Kolay'da ortalama >=3 bolum gecmeli (olculen ${ke.avg.toFixed(1)}) - oyun affediyor`);

console.log(fail === 0 ? '\n\x1b[32mDenge esikleri tutuyor.\x1b[0m\n' : `\n\x1b[31m${fail} esik tutmuyor.\x1b[0m\n`);
process.exit(fail === 0 ? 0 : 1);
