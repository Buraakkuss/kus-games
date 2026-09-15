/* Denge simulatoru — goruntusuz, Node'da calisir.
 *
 *   npm run sim
 *
 * Slot ve Latch'te "mukemmel oynayan yapay oyuncu olmemeli (deaths=0)" garantisi
 * var; uretilen hicbir bolumun gecilemez olmadigini KANITLIYOR. Next Wave bir
 * refleks oyunu olmadigi icin ayni test ise yaramaz. Karsiligi budur:
 * farkli politikalar binlerce kez oynatilir ve denge bir his degil, bir olcum olur.
 *
 * Iddia ettigimiz ve burada dogruladigimiz sey:
 *   - dengeli politika bolumleri gecebilmeli          -> oyun adil
 *   - hasar odakli politika savunmayi ihmal edince tikanmali -> yanlis strateji cezali
 *   - kor politika Kolay'da makul bir oranla gecmeli  -> oyun affediyor
 */
import { readFileSync } from 'node:fs';
import { World, type LevelPlan } from '../src/sim/world.ts';
import type { GameData } from '../src/sim/types.ts';

const here = new URL('.', import.meta.url);
const read = (p: string) => JSON.parse(readFileSync(new URL('../src/data/' + p, here), 'utf8'));

const DATA: GameData = {
  balance: read('balance.json'),
  enemies: read('enemies.json'),
  towers: read('towers.json')
};

/* MVP'nin ilk uc bolumu. Tam liste 0.1.0-d kesiminde levels verisine tasinacak. */
const LEVELS: LevelPlan[] = [
  { budget: 70, pool: ['piyade'], waves: 1, waveSeconds: 16, gapSeconds: 6 },
  { budget: 150, pool: ['piyade', 'kosucu'], waves: 2, waveSeconds: 16, gapSeconds: 6 },
  { budget: 300, pool: ['piyade', 'kosucu', 'zirhli'], waves: 2, waveSeconds: 18, gapSeconds: 6 }
];

type Policy = 'dengeli' | 'hasar' | 'kor';

/** Kahramani dusmana dogru suren basit bir surucu — insan oyuncunun yerine gecer. */
function heroMove(w: World): { x: number; y: number } {
  if (!w.hero.alive || w.enemies.length === 0) return { x: 0, y: 0 };
  let best = w.enemies[0]!, bd = Infinity;
  for (const e of w.enemies) {
    const d = Math.hypot(e.x - w.hero.x, e.y - w.hero.y);
    if (d < bd) { bd = d; best = e; }
  }
  /* Menzilde kal ama uste yaklasani birak, usse geri don. */
  if (bd < w.hero.range * 0.8) return { x: 0, y: 0 };
  return { x: best.x - w.hero.x, y: best.y - w.hero.y };
}

export interface Outcome { won: boolean; baseLeftPct: number; seconds: number; kills: number }

function playLevel(plan: LevelPlan, seed: number, policy: Policy, diff: string): Outcome {
  const d = DATA.balance.difficulty[diff]!;
  const scaled: LevelPlan = { ...plan, budget: Math.round(plan.budget * d.enemyBudget) };
  const w = new World(DATA, scaled, seed, Math.round(220 * d.resources));

  const dt = 1 / 30;
  let slot = 0;
  for (let i = 0; i < 30 * 180; i++) {          /* en fazla 3 dakika */
    /* --- kart/kaynak politikasi: kule kurma karari --- */
    if (slot < DATA.balance.towerSlots.length) {
      const wantsMortar = policy === 'dengeli' && w.enemies.some(e => e.armor === 'heavy');
      const pick = wantsMortar ? 'havan' : 'makineli';
      if (policy !== 'hasar' || slot === 0) {
        if (w.buildTower(slot, pick)) slot++;
      }
    }
    w.step(dt, heroMove(w));
    if (w.phase !== 'running') break;
  }
  return {
    won: w.phase === 'won',
    baseLeftPct: w.baseHp / w.baseMaxHp,
    seconds: w.time,
    kills: w.kills
  };
}

function run(policy: Policy, diff: string, runs: number): number[] {
  return LEVELS.map((plan, li) => {
    let won = 0, hp = 0, sec = 0;
    for (let r = 0; r < runs; r++) {
      const o = playLevel(plan, (li + 1) * 1000 + r, policy, diff);
      if (o.won) won++;
      hp += o.baseLeftPct; sec += o.seconds;
    }
    if (process.env.DIAG) {
      console.log(`    [tani] ${policy}/${diff} B${li + 1}: us %${((hp / runs) * 100).toFixed(0)} kaldi, ` +
                  `sure ${(sec / runs).toFixed(0)} sn`);
    }
    return won / runs;
  });
}

const RUNS = Number(process.env.RUNS ?? 200);
const pct = (v: number) => (v * 100).toFixed(0).padStart(3) + '%';

console.log(`\nNext Wave — denge simulasyonu (${RUNS} kosu/bolum)\n`);
console.log('politika      zorluk    B1    B2    B3');
console.log('------------------------------------------');
const results: Record<string, number[]> = {};
for (const [policy, diff] of [
  ['dengeli', 'normal'], ['hasar', 'normal'], ['kor', 'easy'], ['dengeli', 'hard']
] as [Policy, string][]) {
  const r = run(policy, diff, RUNS);
  results[`${policy}/${diff}`] = r;
  console.log(`${policy.padEnd(12)}  ${diff.padEnd(7)} ${r.map(pct).join(' ')}`);
}

/* --- esikler: denge artik his degil, test --- */
let fail = 0;
const assert = (ok: boolean, msg: string) => {
  console.log(`  ${ok ? '\x1b[32mOK\x1b[0m  ' : '\x1b[31mHATA\x1b[0m'} ${msg}`);
  if (!ok) fail++;
};
console.log('\nEsikler');
const dn = results['dengeli/normal']!;
const hn = results['hasar/normal']!;
const ke = results['kor/easy']!;
assert(dn.every(v => v >= 0.90), 'dengeli politika Normal\'de her bolumu >=%90 geciyor (oyun adil)');
assert(hn[2]! < dn[2]!, 'hasar odakli politika B3\'te dengeliden kotu (yanlis strateji cezali)');
assert(ke.every(v => v >= 0.60), 'kor politika Kolay\'da >=%60 geciyor (oyun affediyor)');

console.log(fail === 0 ? '\n\x1b[32mDenge esikleri tutuyor.\x1b[0m\n' : `\n\x1b[31m${fail} esik tutmuyor.\x1b[0m\n`);
process.exit(fail === 0 ? 0 : 1);
