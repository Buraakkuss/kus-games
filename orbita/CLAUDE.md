# Orbita — oyun projesi

Tek dokunuşlu sonsuz arcade oyunu. **Tek HTML dosyası** (`www/index.html`) + Capacitor.
Güncel sürüm: **v1.0.1**. `kusgrupgames.github.io` deposunda `orbita/` klasöründe yaşar; hukuki
sayfaları depo kökündeki ortak `docs/orbita/` altındadır (Pages tek yerden yayınlanır).
Depo düzeni ve yeni oyun ekleme: kökteki `CLAUDE.md`.

## Çalışma kuralları

1. Oyun mantığı, arayüz, reklam ve satın alma köprüsü **tek dosyada** kalır: `www/index.html`.
   Yeni dosya açma; kullanıcı yazılımcı değil, tek dosyayı kopyalayarak güncelleme yapabilmeli.
2. Sürüm yükseltirken birlikte güncellenir: `www/index.html` içindeki `CFG.version`,
   `app.config.json` içindeki `version` ve `versionCode`, `store/*.md` sürüm notları.
3. **Git commit mesajı sadece sürüm numarasıdır.** Örnek: `v1.0.1`
4. Her değişiklikten sonra `node tools/check.js` çalıştırılır. Yeşil değilse commit yok.
5. Görsel değiştiyse `bash tools/gen.sh` ile tüm mağaza görselleri yeniden üretilir.
6. Reklam kimlikleri, e-posta ve bundle id **yalnız `app.config.json`** içinde değiştirilir,
   ardından `bash tools/set-identity.sh` çalıştırılır.
7. Native derleme adımları scriptlendi: `tools/android-prepare.sh` ve
   `tools/ios-prepare.sh`. Bulutta derleme depo kökündeki iş akışlarıyla yapılır.
7. Token tasarrufu: `index.html` ~950 satırdır, tamamını okuma; `grep -n` ile hedefe git.

## Mimari notlar

- Oyun döngüsü: `update(dt)` → `render()`, `requestAnimationFrame(loop)` ile.
- Durumlar: `menu · orbit · fly · dead` (`G.mode`).
- Zorluk: menüdeki üç mod (`easy · normal · hard`) `DIFF` tablosundan gelir, `DF()` ile okunur.
  Denge ayarı **yalnız `DIFF` tablosundan** yapılır — `omega()`, `flySpeed()`, `planetR()`,
  `spikeCount()`, yakalama toleransı ve PERFECT açısı hepsi bu tablodan çarpan alır.
  `hard` modu v1.0.0'ın orijinal dengesidir. Rekorlar mod başına ayrı tutulur (`S.best`).
- `easy` modunda (ve `normal`'da ilk 3 gezegende) nişan çizgisi çizilir; mekaniği öğreten şey budur.
- `U = W/400` ölçek birimi. **Tüm mesafeler `U` ile çarpılır**, yoksa zorluk cihaz genişliğine göre değişir.
- `capture()` içinde "adaletsiz iniş" koruması var: top dikenin üstüne düşerse gezegenin
  dikenleri 180° döndürülür. Bu kaldırılırsa oyun haksız ölümler üretir.
- Ses dosyası yok; sesler WebAudio ile üretiliyor (`Snd`). Yeni ses eklenecekse yine sentezle.
- `Ads` ve `IAP` nesneleri native değilse sessizce devre dışı kalır — tarayıcıda test hep çalışır.

## Test modları

| URL | Ne yapar |
|---|---|
| `www/index.html` | normal oyun |
| `www/index.html?selftest=1&diff=easy` | 9000 kare otomatik oynar, sonucu `document.title` içine yazar (`diff` isteğe bağlı) |

> **Not:** Buradaki yapay oyuncu sezgiseldir ve ölebilir; self-test yalnızca oyun
> döngüsünün çalıştığını kanıtlar. Slot ve Latch'te oyuncu mükemmeldir ve
> `deaths=0` zorunludur (orada self-test bir *denge* testidir). Aynı güvenceyi
> Orbita'ya da istiyorsan önce mükemmel oynayan bir yapay oyuncu yazılmalı.
| `www/index.html?shot=1&...` | mağaza ekran görüntüsü kompozisyonu üretir |

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
- `orbita-release.jks` imza anahtarı kaybolursa uygulama bir daha güncellenemez.
- Global `var top` kullanma — `window.top` ile çakışır, sessizce NaN üretir.
- Hesap **gerçek kişi** olarak açıldı: Türkiye dağıtıma dahildir, D-U-N-S gerekmez,
  ama Play'de **12 testçi × 14 gün** kapalı test şartı var (hesap başına tek sefer).
  Gerekçe `LAUNCH-CHECKLIST.md` Aşama 0'da.
