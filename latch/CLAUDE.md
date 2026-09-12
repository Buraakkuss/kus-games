# Latch — oyun projesi

Tek dokunuşlu sarkaç/kanca oyunu. **Tek HTML dosyası** (`www/index.html`) + Capacitor.
Güncel sürüm: **v1.0.0**. Bu klasör şimdilik `slot-game` deposunda misafir;
kendi deposuna taşımak için `bash tools/extract-repo.sh ~/latch-game`.

## Çalışma kuralları

1. Oyun mantığı, arayüz, reklam ve satın alma köprüsü **tek dosyada** kalır: `www/index.html`.
2. Sürüm yükseltirken birlikte güncellenir: `CFG.version`, `app.config.json` (`version`,
   `versionCode`), `store/*.md` sürüm notları. (`bash tools/set-identity.sh` çoğunu yazar.)
3. **Git commit mesajı sadece sürüm numarasıdır.** Örnek: `v1.0.1`
4. Her değişiklikten sonra `node tools/check.js`. Yeşil değilse commit yok.
5. Görsel değiştiyse `bash tools/gen.sh`.
6. Reklam kimlikleri, e-posta ve bundle id **yalnız `app.config.json`** içinde değişir,
   ardından `bash tools/set-identity.sh`.
7. Token tasarrufu: `index.html` ~1300 satır, tamamını okuma; `grep -n` ile hedefe git.

## Oyun mekaniği

- Basılı tut → en uygun çengele ip atılır, oyuncu sarkaç gibi salınır. Bırak → o anki
  hızıyla teğet boyunca fırlar, sonra balistik.
- Sarkaçta hız daima **teğet**tir; bu yüzden bırakma açısı = konum açısı (`phiOf`).
  PERFECT penceresini ekranda **yay** olarak çizebilmemizin sebebi budur.
- PERFECT = bırakırken |φ − 45°| ≤ `DIFF.perfect` ve ileri gidiyor → çift puan.
- Puan çengel başına bir kez verilir (`a.used`); bıraktığın çengele 0.5 sn geri tutunulamaz
  (`a.cool`) — yoksa aynı çengelde sonsuza kadar salınmak mümkün olurdu.

## Adalet garantisi (bu bölümü bozma)

Bu oyunun en kırılgan yeri bölüm üretimi. Üç mekanizma birlikte çalışır:

1. **`latchBoost`** — ip tutunduğu anda salınımın 45°'ye ulaşacak enerjisi garanti edilir.
   Olmazsa oyuncu çengelin altına yakın tutunduğunda salınım pencereye hiç ulaşamaz ve
   **sonsuza kadar asılı kalır**. (Bu hata bir kez yaşandı; self-test yakaladı.)
2. **Geriye çözülmüş yerleşim** — çengel yayın "üstüne" konmaz. İstenen tutunma açısından
   geriye çözülür: `OFFS` vektörleri **birim uzunluktadır** (sin²+cos²=1), böylece seçilen
   yay noktasında mesafe tam `reach` olur ve tetik istenen açıda çalışır. Birimden kısa bir
   offset çengeli menzilin içine koyar, tetik yayın çok erken ve **sığ** bir noktasında
   çalışır, salınım enerjisiz kalır.
3. **`simChain` uçtan uca doğrulama** — aday çengel için oyunun karar döngüsü birebir
   simüle edilir (önce karar, sonra kare başına 2 × 1/120 fizik adımı — canlı oyunla aynı).
   Oyuncu adayı gerçekten yakalıyor ve sağlıklı bırakabiliyorsa aday kabul edilir.
   **Simülasyon ile canlı oyunun adım boyutu ve karar sırası aynı olmak zorundadır**;
   ayrışırsa garanti çöker (bu da bir kez yaşandı).

Ayrıca `wantNow()` ile `gapNow()` farkına dikkat: hedef, çengel-çengel mesafesi değil
**yay üzerinde alınacak yol**tur; gerçek aralık `want + 0.94*reach` olarak kendiliğinden
oluşur. İkisini karıştırmak ulaşılamayan mesafeler istenmesine yol açar.

**Hareketli çengel (`moveFrom`) v1.0'da kapalıdır (9999).** Hareket eden çengel katı ip
kısıtıyla oyuncuyu da sürükler; bu etkiyi `simChain` modelleyemiyor ve adaletsiz ölüm
üretiyordu. Modellemeden açma.

## Mimari notlar

- Durumlar: `menu · play · dead` (`G.mode`). `menu`'de oyun kendi kendini oynar (`autoPlay`).
- **Tek dünya ölçeği `SC = H/800`**: görünür dikey alan her cihazda tam 800 sanal birim,
  tüm oyun alanı (çengeller 70..300, salınım, ölüm hattı 720) ekrana sığar →
  **dikey kamera hareketi yok**, ölüm hattı hep görünür. Yatay görünür genişlik `VW = W/SC`.
  Yeni bir mesafe eklerken sanal birim kullan, çıplak piksel yazma.
- Zorluk **yalnız `DIFF`** tablosundan ayarlanır; rekorlar mod başına ayrı.
- Ses dosyası yok (WebAudio). `Ads`/`IAP` native değilse sessizce kapalı.
- `?seed=N` rastgeleliği tohumlar (mağaza görselleri ve self-test tekrarlanabilir).

## Test modları

| URL | Ne yapar |
|---|---|
| `www/index.html` | normal oyun |
| `www/index.html?selftest=1&diff=hard` | mükemmel yapay oyuncu 12000 kare oynar |
| `www/index.html?shot=1&until=arc\|win\|flight\|spike` | mağaza görseli kompozisyonu |

**Self-test kuralı:** yapay oyuncu **ölmemelidir** (`deaths=0`) ve `fallback=0` olmalıdır.
`deaths>0` → üretim adaletsiz. `fallback>0` → doğrulanmamış çengel konulmuş.
İkisi de mekaniği değil, `DIFF` tablosunu veya yerleşim mantığını düzeltmeyi gerektirir.

## Tuzaklar

- `CFG.ads.useTest` **true** ile yayına çıkarsan gelir olmaz. `tools/check.js` yakalar.
- Gerçek AdMob kimlikleriyle kendi reklamına tıklamak hesabı kapattırır.
- Android `versionCode` her yüklemede artmalı; `latch-release.jks` kaybolursa uygulama
  bir daha güncellenemez.
- Global `var top` kullanma — `window.top` ile çakışır, sessizce NaN üretir.
- Mağaza adı tek başına "Latch" olmasın ("Latch: One Tap Swing") — aramada kaybolur.
