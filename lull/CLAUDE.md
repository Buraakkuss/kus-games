# Lull — uygulama projesi

**Bu bir oyun değil.** Uykuya geçişi kolaylaştıran bir nefes uygulaması.
Depodaki diğer üç klasör oyundur; Lull aynı altyapıyı (tek dosya, Capacitor,
`docs/` sayfaları, CI) kullanır ama ürün tipi farklıdır.

Tek HTML dosyası (`www/index.html`) + Capacitor. Güncel sürüm: **v1.0.0**.
Tarayıcıdan: `https://buraakkuss.github.io/kus-games/lull/play/`

## Çalışma kuralları

1. Uygulama mantığı, arayüz, reklam ve satın alma köprüsü **tek dosyada** kalır.
   Yeni dosya açma; kullanıcı yazılımcı değil.
2. Her değişiklikten sonra `node tools/check.js`. Yeşil değilse commit yok.
3. Görsel değiştiyse `bash tools/gen.sh`, tanıtım videosu için `bash tools/film.sh`.
4. Kimlik bilgileri **yalnız `app.config.json`** içinde değişir, ardından
   `bash tools/set-identity.sh` — ve betikteki `OLD_*` sabitlerine de yeni değeri yaz.
5. Token tasarrufu: `grep -n` kullan.

## Ürünün tek fikri

Piyasadaki nefes uygulamaları **sabit bir tempo dayatır** (4-7-8, kutu nefesi).
Nefesin dakikada 18'ken "6'da nefes al" denirse vücut direnir; kişi nefes almakta
başarısız olur ve daha da gerilir.

Lull önce **senin** temponu ölçer, sonra oradan aşağı indirir. Dayatma değil,
sürükleme. Bu cümle ürünün tamamıdır — bir özellik eklerken "bu, ölçüp indirme
fikrini güçlendiriyor mu?" diye sor.

## Nefes matematiği

İki eğri var ve ikisi de üründür:

| İşlev | Ne yapar | Kaybolursa |
|---|---|---|
| `measuredRate()` | Dokunuşların **ortancasından** tempo çıkarır | Kişiselleştirme biter |
| `rateAt()` | Ölçülen tempodan hedefe (`targetRate`, 6/dk) iner | Sabit tempo dayatan sıradan bir uygulama olur |
| `ratioAt()` | Veriş/alış oranını 1.0 → 1.6 büyütür | Parasempatik etki kalkar |

- **Ortanca kullanılıyor, ortalama değil:** tek bir geç dokunuş ortalamayı bozar.
- **Asıl kaldıraç yavaşlamak değil, nefes vermenin uzamasıdır.** `ratioEnd`
  düşürülürse oyun görünür ama etkisiz kalır.
- Geçişler `easeInOut` ile; doğrusal iniş "basamak" gibi hissediliyor.
- `descentShare` seansın ne kadarının iniş olduğunu söyler (0.55). Kalanı sabit tempo.

`tools/check.js` bu üç işlevin varlığını **ve** `targetRate` ile oran değerlerinin
makul aralıkta kalmasını denetler.

## Ekran yerleşimi

| Durum | Halka | Yazı |
|---|---|---|
| `home`, `sync` | yukarıda (`0.38`) | halkanın **altında** (`body.split`) |
| `breathe`, `done` | ortada (`0.5`) | halkanın **içinde** |

Halka küçükken yazı üstüne biniyordu; ayrık yerleşim bunu çözer. Nefes ve bitiş
ekranlarında yazı parlak kürenin üzerinde durduğu için `body:not(.split) .sub`
daha açık renk ve gölgelidir — sönük gri orada okunmuyordu.

## Test kipleri

| URL | Ne yapar |
|---|---|
| `www/index.html` | normal kullanım |
| `?selftest=1` | eğrileri hızlandırılmış oynatır, sonucu `document.title`'a yazar |
| `?shot=1&s=home\|sync\|breathe\|deep\|done` | mağaza karesi (`&headline=`, `&sub=` ile metin) |
| `?film=1&t=12.5` | o saniyenin karesi, tekrarlanabilir — `tools/film.sh` kullanır |

**Self-test kuralı:** tempo **inmeli**, asla artmamalı; veriş/alış oranı 1'in
altına düşmemeli; seans tam süresinde bitmeli. `check.js` ayrıca çıktıdaki
başlangıç ve bitiş temposunu okuyup gerçekten indiğini doğrular — "çalıştı"
demek yetmez.

## Tuzaklar

- **Seans sırasında reklam gösterme.** Amacı sakinleştirmek olan bir uygulamada
  bu ürünü yok eder. `Ads.maybeInterstitial` yalnızca bitiş ekranı içindir.
- **Sağlık uyarısı yasal olarak gerekli.** `docs/lull/terms.html`, `privacy.html`
  ve `gizlilik.html` içindeki "tıbbi tavsiye değildir" bölümü silinmemeli;
  baş dönmesi uyarısı ve araç kullanma yasağı mağaza incelemesinde de sorulur.
- **Ses dosyası yok** — nefes sesi WebAudio ile üretilen dar bantlı gürültüdür.
  Saf ton denendi, gece boyunca rahatsız edici oluyor.
- `tools/icon.html` içinde global `var top` kullanma — `window.top` ile çakışır.
  Bu hata depoda bir kez yaşandı.
- Headless Chromium'un **minimum viewport genişliği 500px**; gerçek telefon
  genişliğinde (390-430) ekran görüntüsü alınamaz. 500×1080 aynı orandadır.
- Film kipinde zerrecikler **tohumlanır**; yoksa her karede yer değiştirir ve
  video titrer.

## Abonelik (henüz bağlanmadı)

Ücretsiz katman **tam seansı** verir — kısıtlanan şey temel deneyim değildir.
`lull_plus_monthly` / `lull_plus_yearly` için planlanan: uzun programlar
(21 gün), geçmiş ve eğilim, ek ses dokuları, Apple Sağlık/Google Fit'e yazma.
Bunlar yazılmadan abonelik ürünü mağazada oluşturulmamalı.
