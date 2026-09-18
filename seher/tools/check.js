#!/usr/bin/env node
/* Yayin oncesi tek komutluk dogrulama:  node tools/check.js
   1) uygulama betigi sozdizimi   2) tarayicida gercek self-test
   3) magaza gorselleri           4) hukuki sayfalar
   5) surum/kimlik tutarliligi    6) yayin oncesi ayar uyarilari          */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
/* docs/ tek depoda koktedir: <depo>/docs/<gameId>/ */
const GAME = JSON.parse(fs.readFileSync(path.join(ROOT,'app.config.json'),'utf8')).gameId;
const DOCS = path.join(ROOT, '..', 'docs', GAME);
const DOCSROOT = path.join(ROOT, '..', 'docs');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let fail = 0, warn = 0;
const ok  = m => console.log('  \x1b[32mOK\x1b[0m   ' + m);
const bad = m => { fail++; console.log('  \x1b[31mHATA\x1b[0m ' + m); };
const wrn = m => { warn++; console.log('  \x1b[33mUYARI\x1b[0m ' + m); };

const html = fs.readFileSync(path.join(ROOT, 'www/index.html'), 'utf8');
const cfg  = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.config.json'), 'utf8'));

console.log('\n1) Uygulama betigi');
{
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m, blocks = 0, dirty = 0;
  while ((m = re.exec(html))) {
    blocks++;
    try { new Function(m[1]); } catch (e) { dirty++; bad('betik blogu ' + blocks + ': ' + e.message); }
  }
  if (!dirty) ok(blocks + ' betik blogu, sozdizimi temiz');
  /* Hesabin tek kaynagi bu tablodur; biri silinirse ayarlardaki secim bosalir. */
  ['diyanet','mwl','isna','egypt','karachi','makkah','tehran'].forEach(k => {
    if (!new RegExp('\\b' + k + ':\\s*\\{').test(html)) bad('METHODS tablosunda ' + k + ' yontemi yok');
  });
  if (/METHODS\s*=\s*\{/.test(html)) ok('METHODS yontem tablosu yerinde (aci degerleri tek yerde)');
  ['imsak','gunes','ogle','ikindi','aksam','yatsi'].forEach(k => {
    if (!new RegExp("'" + k + "'").test(html)) bad('VAKIT_SIRA icinde ' + k + ' yok');
  });
  /* Kabe koordinati: yanlis yazilirsa kible butun dunyada sessizce kayar. */
  if (!/21\.4225/.test(html) || !/39\.8262/.test(html)) bad('Kabe koordinati (21.4225 / 39.8262) kodda bulunamadi');
  else ok('Kabe koordinati yerinde');
  /* Bu urunun kirmizi cizgisi: vakte yakin reklam gosterilmez. */
  if (!/vakte 10 dakikadan az/.test(html)) bad('reklam kapisi (vakte 10 dk kala gosterme) kodda yok');
  else ok('reklam kapisi yerinde (vakte 10 dk kala reklam yok)');
  /* Global "top" window.top ile cakisir ve sessizce NaN uretir. */
  if (/\bvar\s+top\s*=/.test(html)) bad('global "var top" kullanilmis - window.top ile cakisir');
}

console.log('\n2) Tarayicida self-test');
if (!fs.existsSync(CHROME)) {
  wrn('Chrome bulunamadi (' + CHROME + '). CHROME=/yol/chrome node tools/check.js ile calistir.');
} else {
  try {
    const out = cp.execSync(
      `"${CHROME}" --headless=new --no-sandbox --disable-gpu --virtual-time-budget=30000 ` +
      `--window-size=520,900 --dump-dom "file://${path.join(ROOT, 'www/index.html')}?selftest=1" 2>/dev/null`,
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const t = (out.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    if (t.startsWith('SELFTEST OK')) ok(t.replace('SELFTEST OK ', ''));
    else bad('self-test basarisiz: ' + t);
  } catch (e) { bad('self-test calistirilamadi: ' + e.message); }
}

console.log('\n3) Magaza gorselleri');
{
  const need = {
    'assets/icon-1024.png': [1024, 1024], 'assets/icon-512.png': [512, 512],
    'assets/feature-graphic-1024x500.png': [1024, 500], 'assets/splash-2732.png': [2732, 2732]
  };
  for (let i = 1; i <= 5; i++) {
    need['assets/screenshots/android-' + i + '-1080x1920.png'] = [1080, 1920];
    need['assets/screenshots/ios69-' + i + '-1290x2796.png'] = [1290, 2796];
    need['assets/screenshots/ios65-' + i + '-1284x2778.png'] = [1284, 2778];
  }
  for (const f in need) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { bad('eksik: ' + f); continue; }
    const d = fs.readFileSync(p).subarray(0, 33);
    const w = d.readUInt32BE(16), h = d.readUInt32BE(20), ctype = d[25];
    if (w !== need[f][0] || h !== need[f][1]) bad(f + ' olcusu ' + w + 'x' + h + ', beklenen ' + need[f].join('x'));
    else if (f === 'assets/icon-1024.png' && ctype === 6) bad('App Store ikonu alfa kanali icermemeli');
    else ok(f + ' ' + w + 'x' + h);
  }
  ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi'].forEach(d => {
    if (!fs.existsSync(path.join(ROOT, 'assets/android/res/mipmap-' + d + '/ic_launcher.png')))
      bad('Android simge agaci eksik: mipmap-' + d + ' (bash tools/gen.sh)');
    /* capacitor.config.json bu adi istiyor; yoksa bildirim simgesi beyaz kare cikar. */
    if (!fs.existsSync(path.join(ROOT, 'assets/android/res/drawable-' + d + '/ic_stat_seher.png')))
      bad('bildirim simgesi eksik: drawable-' + d + '/ic_stat_seher.png (bash tools/gen.sh)');
  });
  if (fs.existsSync(path.join(ROOT, 'assets/android/res/mipmap-anydpi-v26/ic_launcher.xml')))
    ok('Android adaptive icon kaynaklari hazir');
  {
    const cc = JSON.parse(fs.readFileSync(path.join(ROOT, 'capacitor.config.json'), 'utf8'));
    const ad = cc.plugins && cc.plugins.LocalNotifications && cc.plugins.LocalNotifications.smallIcon;
    if (ad && !fs.existsSync(path.join(ROOT, 'assets/android/res/drawable-mdpi/' + ad + '.png')))
      bad('capacitor.config.json smallIcon "' + ad + '" icin drawable uretilmemis');
  }
}

console.log('\n4) Hukuki ve destek sayfalari');
['privacy.html', 'gizlilik.html', 'terms.html', 'support.html', 'index.html']
  .forEach(f => fs.existsSync(path.join(DOCS, f)) ? ok('docs/' + GAME + '/' + f) : bad('eksik: docs/' + GAME + '/' + f));
if (fs.existsSync(path.join(DOCSROOT, '_style.css'))) ok('docs/_style.css (ortak stil)');
else bad('eksik: docs/_style.css');
/* GitHub Pages Jekyll'i alt cizgiyle baslayan dosyalari yayinlamaz -> _style.css 404 verir */
if (fs.existsSync(path.join(DOCSROOT, '.nojekyll'))) ok('docs/.nojekyll (Pages _style.css dosyasini atlamaz)');
else bad('docs/.nojekyll eksik - GitHub Pages _style.css dosyasini yayinlamaz, sayfalar stilsiz kalir');
/* Tarayicida denenen surum, gercek uygulamanin kendisi olmali. */
{
  const oyna = path.join(DOCS, 'play', 'index.html');
  if (!fs.existsSync(oyna)) bad('eksik: docs/' + GAME + '/play/index.html (cp www/index.html ile guncelle)');
  else if (fs.readFileSync(oyna, 'utf8') !== html)
    bad('docs/' + GAME + '/play/index.html, www/index.html ile ayni degil - cp www/index.html ../docs/' + GAME + '/play/index.html');
  else ok('docs/' + GAME + '/play/ guncel');
}
/* Bu urun ozelinde zorunlu ifadeler: hesap bir yardimcidir, resmi takvim degil. */
{
  const t = fs.existsSync(path.join(DOCS,'terms.html')) ? fs.readFileSync(path.join(DOCS,'terms.html'),'utf8') : '';
  if (!/not a religious authority/i.test(t))
    bad('docs/' + GAME + '/terms.html icinde "hesaplama aracidir, dini otorite degildir" uyarisi yok');
  else ok('sorumluluk sinirlari terms.html icinde yazili');
  const g = fs.existsSync(path.join(DOCS,'gizlilik.html')) ? fs.readFileSync(path.join(DOCS,'gizlilik.html'),'utf8') : '';
  const pv = fs.existsSync(path.join(DOCS,'privacy.html')) ? fs.readFileSync(path.join(DOCS,'privacy.html'),'utf8') : '';
  /* Konum ve reklam aciklamasi olmadan iki magaza da reddeder. */
  [['privacy.html',pv,/location/i],['privacy.html',pv,/AdMob/],
   ['gizlilik.html',g,/konum/i],['gizlilik.html',g,/AdMob/]].forEach(([f,s,re]) => {
    if (!re.test(s)) bad('docs/' + GAME + '/' + f + ' icinde ' + re + ' gecmiyor - magaza bunu sorar');
  });
}

console.log('\n5) Surum ve kimlik tutarliligi');
{
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const capc = JSON.parse(fs.readFileSync(path.join(ROOT, 'capacitor.config.json'), 'utf8'));
  const inApp = (html.match(/version:\s*'([^']+)'/) || [])[1];
  if (inApp !== cfg.version) bad('www/index.html surumu ' + inApp + ', app.config.json ' + cfg.version + ' - bash tools/set-identity.sh');
  else ok('surum ' + cfg.version + ' her yerde ayni');
  if (pkg.version !== cfg.version) wrn('package.json surumu (' + pkg.version + ') app.config.json ile ayni degil');
  if (capc.appId !== cfg.bundleId) bad('capacitor.config.json appId (' + capc.appId + ') != ' + cfg.bundleId);
  else ok('bundle id ' + cfg.bundleId);
  if (!html.includes(cfg.bundleId)) wrn('www/index.html icindeki bundle id app.config.json ile ayni degil');
  if (!html.includes(cfg.pagesBaseUrl)) wrn('www/index.html icindeki gizlilik adresi app.config.json ile ayni degil');
  /* Destek e-postasi magaza sayfasinda herkese gorunur; yanlis kalirsa kullanici
     hicbir zaman ulasamaz. Bu yuzden UYARI degil HATA. */
  const mail = cfg.supportEmail;
  const MAILFILES = ['www/index.html','store/google-play.md','store/app-store.md',
                     'native/android.md','native/ios.md','LAUNCH-CHECKLIST.md','README.md']
      .map(f => path.join(ROOT, f))
      .concat(['index.html','privacy.html','gizlilik.html','terms.html','support.html']
      .map(f => path.join(DOCS, f)))
      .concat([path.join(DOCSROOT, 'index.html')]);
  let stale = 0;
  MAILFILES.forEach(fp => {
    if (!fs.existsSync(fp)) return;
    const found = fs.readFileSync(fp, 'utf8')
      .match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
    found.filter(a => a !== mail).forEach(a => {
      stale++;
      bad(path.relative(path.join(ROOT, '..'), fp) + ' icinde farkli e-posta: ' + a
          + ' - app.config.json duzelt, sonra bash tools/set-identity.sh');
    });
  });
  if (!stale) ok('destek e-postasi ' + mail + ' gectigi her yerde ayni');

  /* set-identity.sh, dosyalarda SU AN yazili degerleri OLD_* sabitlerinden bilir.
     Bunlar bayatlarsa betik sessizce hicbir sey degistirmez - OLD_URL bir kez
     boyle bayatladi. Betigin icindeki node programinin kendisi de gecerli olmali. */
  {
    const sh = fs.readFileSync(path.join(ROOT, 'tools/set-identity.sh'), 'utf8');
    const want = { OLD_MAIL: cfg.supportEmail, OLD_URL: cfg.pagesBaseUrl, OLD_ID: cfg.bundleId };
    let shBad = 0;
    Object.keys(want).forEach(k => {
      const got = (sh.match(new RegExp(k + '="([^"]*)"')) || [])[1];
      if (got !== want[k]) {
        shBad++;
        bad('tools/set-identity.sh ' + k + ' bayat: "' + got + '" yazili, "' + want[k] + '" olmali');
      }
    });
    const prog = (sh.match(/node -e '([\s\S]*?)'\s*"\$ROOT"/) || [])[1];
    if (!prog) { shBad++; bad('tools/set-identity.sh icindeki node programi okunamadi'); }
    else try { new Function(prog); }
         catch (e) { shBad++; bad('tools/set-identity.sh sozdizimi bozuk: ' + e.message); }
    if (!shBad) ok('tools/set-identity.sh sabitleri guncel, programi sozdizimi temiz');
  }
  /* Klasor kopyalanarak acildigi icin baska urunden kalan metin en sik hata.
     Ad aramak yetmiyor: Lull'un destek sayfasi Latch'in SSS'iydi ve "latch"
     sozcugunu hic gecirmiyordu. Bu yuzden o urunlerin SOZ DAGARCIGI taraniyor. */
  const KALINTI = /\b(hook|rope|swing|respawn|leaderboard|high score|skor tablosu|nefes al|breathe|inhale|exhale|orbit|planet|wall|duvar|cengel)\b/i;
  ['index.html','privacy.html','gizlilik.html','terms.html','support.html'].forEach(f => {
    const fp = path.join(DOCS, f);
    if (!fs.existsSync(fp)) return;   /* 4. bolum zaten HATA verdi */
    const s = fs.readFileSync(fp, 'utf8');
    ['slot','latch','orbita','lull','nakitpilot'].forEach(o => {
      if (new RegExp('\\b' + o + '\\b', 'i').test(s))
        bad('docs/' + GAME + '/' + f + ' icinde baska projeden kalan ad var: ' + o);
    });
    const kal = s.match(KALINTI);
    if (kal) bad('docs/' + GAME + '/' + f + ' icinde baska urunun sozcugu var: "' + kal[0] + '"');
  });
  /* LAUNCH-CHECKLIST.md hesap duzeyindeki isleri anlatir ve orada baska bir urunun
     adini anmak dogrudur (Play'in 12x14 kapali test sarti hesap basina tek sefer).
     Bu yuzden orada ad taranmaz, soz dagarcigi taranir. */
  const ADSIZ = new Set(['LAUNCH-CHECKLIST.md']);
  ['CLAUDE.md','README.md','LAUNCH-CHECKLIST.md','store/google-play.md','store/app-store.md',
   'store/data-safety.md','store/app-privacy.md','store/content-rating.md',
   'native/android.md','native/ios.md'].forEach(f => {
    const fp = path.join(ROOT, f);
    if (!fs.existsSync(fp)) { bad('eksik: ' + f); return; }
    const s = fs.readFileSync(fp, 'utf8');
    if (!ADSIZ.has(f)) ['slot','latch','orbita','lull'].forEach(o => {
      if (new RegExp('\\b' + o + '\\b', 'i').test(s))
        bad(f + ' icinde baska projeden kalan ad var: ' + o);
    });
    const kal = s.match(KALINTI);
    if (kal) bad(f + ' icinde baska urunun sozcugu var: "' + kal[0] + '"');
  });
}

console.log('\n6) Yayin oncesi ayarlar');
{
  if (/useTest:\s*true/.test(html)) wrn('CFG.ads.useTest = true - TEST reklamlari aktif. Yayindan once false yap.');
  else {
    ok('gercek reklam kimlikleri aktif');
    ['android', 'ios'].forEach(p => ['app', 'interstitial', 'rewarded'].forEach(k => {
      if (!cfg.admob.real[p][k]) bad('app.config.json: admob.real.' + p + '.' + k + ' bos');
    }));
    if (/ca-app-pub-3940256099942544/.test(html)) bad('Kodda hala Google TEST reklam kimligi var!');
  }
  if (cfg.versionCode < 1 || cfg.versionCode % 1 !== 0) bad('app.config.json versionCode tam sayi olmali');
  else ok('versionCode ' + cfg.versionCode + ' (her Play yuklemesinde artmali)');
  if (!cfg.iap || !cfg.iap.removeAds || !cfg.iap.removeAds.id) bad('app.config.json: iap.removeAds.id bos');
  else if (!html.includes("removeAds: '" + cfg.iap.removeAds.id + "'"))
    bad('www/index.html icindeki satin alma kimligi app.config.json ile ayni degil');
  else ok('satin alma kimligi ' + cfg.iap.removeAds.id);
}

console.log('\n' + (fail ? '\x1b[31m' + fail + ' hata' : '\x1b[32mHata yok') + '\x1b[0m, ' + warn + ' uyari.\n');
process.exit(fail ? 1 : 0);
