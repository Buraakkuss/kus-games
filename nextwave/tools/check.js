#!/usr/bin/env node
/* Next Wave — yayin oncesi tek komutluk dogrulama:  node tools/check.js
   1) mimari kural  2) TypeScript  3) veri semasi  4) denge simulasyonu
   5) tarayici self-test  6) surum/kimlik tutarliligi
   Yesil degilse commit yok — depo kurali 3. */
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

/* package.json "type":"module" oldugu icin bu dosya ESM'dir. */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let fail = 0, warn = 0;
const ok = m => console.log('  \x1b[32mOK\x1b[0m   ' + m);
const bad = m => { fail++; console.log('  \x1b[31mHATA\x1b[0m ' + m); };
const wrn = m => { warn++; console.log('  \x1b[33mUYARI\x1b[0m ' + m); };
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.config.json'), 'utf8'));

const run = (cmd, opts = {}) =>
  cp.execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', ...opts });

/* ---------------------------------------------------------------- */
console.log('\n1) Mimari kural: sim/ Phaser bilmez');
{
  /* Bu kural bir zarafet tercihi degil: src/sim Phaser'a bulasirsa
     tools/sim.ts Node'da calisamaz ve denge testi komple olur. */
  const dir = path.join(ROOT, 'src/sim');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
  let dirty = 0;
  for (const f of files) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    if (/from\s+['"]phaser['"]|require\(['"]phaser['"]\)/.test(src)) {
      bad(`src/sim/${f} Phaser import ediyor - sim/ saf TypeScript kalmali`);
      dirty++;
    }
    if (/\b(document|window|navigator)\s*\./.test(src)) {
      bad(`src/sim/${f} tarayici nesnesi kullaniyor (document/window) - Node'da cokecek`);
      dirty++;
    }
  }
  if (!dirty) ok(`${files.length} dosya saf: Phaser yok, DOM yok`);
}

/* ---------------------------------------------------------------- */
console.log('\n2) TypeScript');
try { run('npx tsc --noEmit'); ok('tsc --noEmit temiz'); }
catch (e) { bad('tsc hatasi:\n' + (e.stdout || e.message).trim().split('\n').slice(0, 8).join('\n')); }

/* ---------------------------------------------------------------- */
console.log('\n3) Veri semasi');
{
  const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));
  const bal = read('balance.json'), enemies = read('enemies.json'), towers = read('towers.json');
  const ARMOR = ['light', 'heavy', 'shield', 'swarm', 'air'];
  const DMG = ['kinetic', 'explosive', 'electric', 'thermal'];

  let bugs = 0;
  for (const d of DMG) {
    if (!bal.matrix[d]) { bad(`matris ${d} satirini icermiyor`); bugs++; continue; }
    for (const a of ARMOR) {
      if (typeof bal.matrix[d][a] !== 'number') { bad(`matris ${d}/${a} sayi degil`); bugs++; }
    }
  }
  for (const [id, e] of Object.entries(enemies)) {
    if (e.id !== id) { bad(`enemies.json: "${id}" anahtari ile id alani ayni degil`); bugs++; }
    if (!ARMOR.includes(e.armor)) { bad(`${id}: bilinmeyen zirh "${e.armor}"`); bugs++; }
    if (!(e.cost > 0 && e.hp > 0)) { bad(`${id}: cost ve hp pozitif olmali`); bugs++; }
  }
  for (const [id, t] of Object.entries(towers)) {
    if (t.id !== id) { bad(`towers.json: "${id}" anahtari ile id alani ayni degil`); bugs++; }
    if (!DMG.includes(t.damageType)) { bad(`${id}: bilinmeyen hasar tipi "${t.damageType}"`); bugs++; }
  }
  /* Her dusman zirhina karsi EN AZ bir hasar tipi ise yaramali,
     yoksa o dusman hicbir kuleyle durdurulamaz. */
  for (const a of ARMOR) {
    if (!DMG.some(d => bal.matrix[d][a] > 0.9)) {
      bad(`"${a}" zirhina karsi etkili (>0.9) hicbir hasar tipi yok - gecilemez dusman`);
      bugs++;
    }
  }
  if (!bugs) ok(`${Object.keys(enemies).length} dusman, ${Object.keys(towers).length} kule, matris tutarli`);
}

/* ---------------------------------------------------------------- */
console.log('\n4) Denge simulasyonu');
try {
  const out = run('node --experimental-strip-types --no-warnings tools/sim.ts', { env: { ...process.env, RUNS: '120' } });
  out.split('\n').filter(l => /OK|HATA/.test(l)).forEach(l => console.log('  ' + l.trim()));
  if (/HATA/.test(out)) bad('denge esikleri tutmuyor (yukari bak)');
  else ok('denge esikleri tutuyor');
} catch (e) {
  const out = (e.stdout || '') + (e.stderr || '');
  out.split('\n').filter(l => /OK|HATA/.test(l)).forEach(l => console.log('  ' + l.trim()));
  bad('denge simulasyonu basarisiz');
}

/* ---------------------------------------------------------------- */
console.log('\n5) Tarayici self-test (gercek paket)');
try {
  run('npx vite build');
  ok('vite build');
  if (!fs.existsSync(CHROME)) {
    wrn('Chromium bulunamadi, tarayici testi atlandi (CHROME=... ile yol verebilirsin)');
  } else {
    const port = 8799;
    const srv = cp.spawn(process.execPath, ['--input-type=commonjs', '-e', `
      const http=require('http'),fs=require('fs'),path=require('path');
      const root=${JSON.stringify(path.join(ROOT, 'www'))};
      const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'};
      http.createServer((q,s)=>{
        const u=q.url.split('?')[0];
        const f=path.join(root,u==='/'?'index.html':u);
        fs.readFile(f,(e,d)=>e?(s.writeHead(404),s.end()):(s.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'}),s.end(d)));
      }).listen(${port});
    `], { stdio: 'ignore', detached: false });
    try {
      cp.execSync('sleep 1');
      const dom = cp.execSync(
        `"${CHROME}" --headless --no-sandbox --disable-gpu --virtual-time-budget=25000 ` +
        `--dump-dom "http://127.0.0.1:${port}/index.html?selftest=1" 2>/dev/null`,
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
      );
      const m = dom.match(/<title>([^<]*)<\/title>/);
      const title = m ? m[1] : '(baslik yok)';
      if (!title.startsWith('SELFTEST:OK')) bad('tarayici self-test: ' + title);
      else {
        const kills = Number((title.match(/olen=(\d+)/) || [])[1] || 0);
        const phase = (title.match(/faz=(\w+)/) || [])[1];
        if (phase === 'running') bad('self-test bolumu bitiremedi (sonsuz dongu riski): ' + title);
        else if (kills <= 0) bad('self-test hic dusman olduremedi - hasar hatti kopuk: ' + title);
        else ok(title.replace('SELFTEST:OK ', ''));
      }
    } finally { srv.kill(); }
  }
} catch (e) {
  bad('tarayici testi calistirilamadi: ' + String(e.message).split('\n')[0]);
}

/* ---------------------------------------------------------------- */
console.log('\n6) Surum ve kimlik');
{
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (pkg.version !== cfg.version) bad(`package.json surumu ${pkg.version}, app.config.json ${cfg.version}`);
  else ok('surum ' + cfg.version + ' her yerde ayni');
  const idx = fs.readFileSync(path.join(ROOT, 'www/index.html'), 'utf8');
  if (!/__GAME_VERSION__/.test(idx) && !idx.includes('id="ver"')) wrn('surum rozeti index.html icinde bulunamadi');
  else ok('surum rozeti yerinde (ana ekranin altinda gorunur)');
  if (cfg.admob.useTest) wrn('CFG.admob.useTest = true - TEST reklamlari. Yayindan once false yap.');
}

console.log(
  fail === 0
    ? `\n\x1b[32mHata yok\x1b[0m${warn ? `, ${warn} uyari` : ''}.\n`
    : `\n\x1b[31m${fail} hata\x1b[0m${warn ? `, ${warn} uyari` : ''}.\n`
);
process.exit(fail === 0 ? 0 : 1);
