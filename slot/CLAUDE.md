# Slot — oyun projesi

Tek dokunuşlu refleks oyunu. **Tek HTML dosyası** (`www/index.html`) + Capacitor.
Güncel sürüm: **v1.0.0**. Bu depo başka projelerden tamamen bağımsızdır.

## Çalışma kuralları

1. Oyun mantığı, arayüz, reklam ve satın alma köprüsü **tek dosyada** kalır: `www/index.html`.
   Yeni dosya açma; kullanıcı yazılımcı değil, tek dosyayı kopyalayarak güncelleme yapabilmeli.
2. Sürüm yükseltirken birlikte güncellenir: `www/index.html` içindeki `CFG.version`,
   `app.config.json` içindeki `version` ve `versionCode`, `store/*.md` sürüm notları.
   (`bash tools/set-identity.sh` bunların çoğunu kendisi yazar.)
3. **Git commit mesajı sadece sürüm numarasıdır.** Örnek: `v1.0.1`
4. Her değişiklikten sonra `node tools/check.js` çalıştırılır. Yeşil değilse commit yok.
5. Görsel değiştiyse `bash tools/gen.sh` ile tüm mağaza görselleri yeniden üretilir.
6. Reklam kimlikleri, e-posta ve bundle id **yalnız `app.config.json`** içinde değiştirilir,
   ardından `bash tools/set-identity.sh` çalıştırılır.
7. Token tasarrufu: `index.html` ~1200 satırdır, tamamını okuma; `grep -n` ile hedefe git.

## Oyun mekaniği

- Oyuncu ekranın alt üçte birinde sabit bir çokgendir (`PY = H*0.72`), yalnızca döner.
- Yukarıdan kalın duvarlar iner. Her duvarda oyuncunun **o anki şekliyle birebir aynı**,
  ama farklı açıya çevrilmiş bir delik vardır.
- Tek dokunuş = 90° saat yönünde dönüş, ~0.12 sn (`tap()`, easeOutCubic).
- Karar anı duvarın ön yüzü şeklin üstüne değdiğinde verilir (`verdict()`):
  açı hatası `DIFF.tol` içindeyse geçer, değilse `die()` → parçalanma.
- Tolerans içinde ama tam değilse şekil delige **oturtulur** (0.07 sn "klik" tween'i).
  Bu olmazsa geçiş anında şekil deliğin kenarına taşmış görünürdü.
- `CLEAN` = temas anında dönüş tamamlanmışsa (`G.rotT >= 1`) → çift puan.
- Bir duvar geçilince oyuncu **sıradaki duvarın şekline dönüşür** (morph). Bu yüzden
  ekrandaki üstteki duvarın deliği oyuncunun mevcut şeklinden farklı olabilir; bu bir hata
  değil, önizlemedir. Değişmez kural: **karar anında oyuncunun şekli = duvarın şekli.**
  Self-test bunu her karede denetler (`mismatch`).

## Mimari notlar

- Oyun döngüsü: `update(dt)` → `render()`, `requestAnimationFrame(loop)` ile.
- Durumlar: `menu · play · dead` (`G.mode`). `menu` durumunda oyun kendi kendini oynar
  (`autoTap()`), menü arka planı budur; `die()` menüde ölmez, gösteriyi yeniden başlatır.
- **Zorluk yalnız `DIFF` tablosundan ayarlanır.** `speed()`, `gapNow()`, tolerans, delik payı,
  şekil havuzu eşikleri, sahte delik ve çift duvar eşikleri hepsi bu tablodan çarpan alır.
  `hard` referans dengedir. Rekorlar mod başına ayrı tutulur (`S.best`).
- Şekiller `SHAPES` içinde; `sym` = 90°'lik dönüşlere göre simetri derecesi
  (4 = her açıda geçer, 2 = iki cevap, 1 = tek cevap). Zorluk artışının asıl motoru budur,
  hız değil. Havuzlar `TIERS` tablosunda, eşikler `DIFF.tier` ile ölçeklenir.
- **İki ölçek birimi var:** `U = min(W, H*0.58)/400` yatay (şekil, delik, duvar kalınlığı),
  `V = H/800` düşey (duvar hızı, duvar aralığı). Sadece `U` kullanılsaydı uzun ekranlarda
  tepki süresi uzar, oyun kolaylaşırdı. **Yeni bir mesafe eklerken ikisinden birini seç,
  çıplak piksel yazma.**
- Duvar kalınlığı `WT = R*2.45 + 30*U`: delik şeklin tamamını içine alabilmeli, yoksa
  delik dilimlenmiş görünür ve oyuncu açıyı okuyamaz.
- Delik `fill('evenodd')` ile deliniyor; yol önce `rect`, sonra `addPoly` ile eklenir ve
  `clip()` bandın dışına taşmayı engeller. **`addPoly` yol başlatmaz; `polyPath` başlatır.**
  (`tools/icon.html` içinde aynı hata bir kez yapıldı: `poly()` her seferinde `beginPath()`
  çağırınca duvar hiç çizilmedi.)
- Sekil değişimi (morph) sabit uzunlukta (64) örneklenmiş çokgen dizilerinin karışımı —
  `resample()`. Yeni şekil eklerken tek yapılacak `SHAPES`'e nokta listesi ve `sym` yazmak.
- `?seed=N` verilirse rastgelelik tohumlanır (`rnd()`), böylece mağaza görselleri ve
  self-test tekrarlanabilir olur.
- Ses dosyası yok; sesler WebAudio ile üretiliyor (`Snd`). Yeni ses eklenecekse yine sentezle.
- `Ads` ve `IAP` nesneleri native değilse sessizce devre dışı kalır — tarayıcıda test hep çalışır.

## Test modları

| URL | Ne yapar |
|---|---|
| `www/index.html` | normal oyun |
| `www/index.html?selftest=1&diff=hard` | mükemmel oynayan yapay oyuncu 12000 kare oynar, sonucu `document.title` içine yazar |
| `www/index.html?shot=1&...` | mağaza ekran görüntüsü kompozisyonu üretir (parametreler `tools/gen.sh` içinde) |

**Self-test kuralı:** mükemmel oyuncu **ölmemelidir** (`deaths=0`). Ölüyorsa `DIFF` tablosunda
geçilmesi imkansız bir eşik oluşmuş demektir — örneğin çift duvarın iki katmanı arasındaki
mesafe tek dokunuşa yetmiyordur. Bu durumda mekaniği değil tabloyu düzelt.

## Tuzaklar

- `tools/set-identity.sh` içindeki node programı bash'te **tek tırnak** arasında durur;
  içine düz tek tırnak yazılamaz, gereken yerde `Q` sabiti kullanılır. Bu dosyada üç hata
  bir kez birlikte yaşandı ve betik **hiç çalışmadı**: (a) `g` değişkeni iki kez tanımlandığı
  için sözdizimi hatası, (b) AdMob düzenli ifadesinde `[\\\\s\\\\S]` yazıldığı için (doğrusu `[\\s\\S]`)
  "herhangi bir karakter" yerine "ters bölü, s veya S" araması, (c) `OLD_URL` bayatlaması.
  Üçü birlikte, gerçek AdMob kimliklerinin ve `useTest: false`'un hiçbir zaman yazılmaması
  demekti. `check.js` artık betiğin sözdizimini ve sabitlerinin güncelliğini denetliyor.
- `CFG.ads.useTest` **true** ile yayına çıkılırsa hiç gelir olmaz. `tools/check.js` bunu yakalar.
- Gerçek AdMob kimlikleriyle kendi reklamına tıklamak hesabı kalıcı kapattırır.
- Android `versionCode` her yüklemede artmalı.
- `slot-release.jks` imza anahtarı kaybolursa uygulama bir daha güncellenemez.
- **İsim riski:** mağaza adı tek başına "Slot" olmamalı ("Slot: Fit the Shape"). Kumar
  çağrışımı hem aramayı hem incelemeyi vurur. Gerekçe `LAUNCH-CHECKLIST.md` AŞAMA 0.1'de,
  kumar olmadığı `docs/terms.html` madde 4 ve App Review notunda yazılı.
- Global `var top` kullanma — `window.top` ile çakışır ve sessizce NaN üretir.
- Hesap **gerçek kişi** olarak açıldı: Türkiye dağıtıma dahildir, D-U-N-S gerekmez,
  ama Play'de **12 testçi × 14 gün** kapalı test şartı var (hesap başına tek sefer).
