# Lull

Uykuya geçişi kolaylaştıran nefes uygulaması. **Bu bir oyun değil** — depodaki
diğer üç klasör oyundur, Lull aynı altyapıyı kullanan farklı bir üründür.

**Tarayıcıdan dene:** https://buraakkuss.github.io/kus-games/lull/play/

## Fikir

Nefes uygulamaları sana sabit bir kalıp verir (4-7-8, kutu nefesi). Nefesin
dakikada 18'ken "6'da nefes al" denirse rahatlamazsın; nefes almakta başarısız
olursun. Lull önce **senin** temponu ölçer, sonra oradan aşağı indirir.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `node tools/check.js` | Tam doğrulama (betik, self-test, görseller, sayfalar, kimlik) |
| `bash tools/gen.sh` | İkon + mağaza görselleri |
| `bash tools/film.sh` | Tanıtım videosu (`marketing/lull-tanitim.mp4`) |
| `bash tools/set-identity.sh` | `app.config.json`'daki kimliği her yere yazar |
| `bash tools/android-prepare.sh` | `npx cap add android` sonrası native ayarlar |
| `bash tools/ios-prepare.sh` | `npx cap add ios` sonrası native ayarlar |

## Dosyalar

```
www/index.html   uygulamanın tamamı (tek dosya)
app.config.json  kimlik: bundle, sürüm, AdMob, abonelik ürünleri
tools/           üretim ve doğrulama araçları
store/           Play ve App Store metinleri
native/          iOS/Android elle adımlar (betikler bunları uygular)
marketing/       tanıtım videosu ve sosyal medya metinleri
assets/          ikonlar, ekran görüntüleri, açılış ekranı
```

Kurallar ve tuzaklar: `CLAUDE.md`.
