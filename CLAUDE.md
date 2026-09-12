# KUŞ GRUP oyun deposu

Birden çok oyun, tek depo. Her oyun kendi klasöründe **bağımsızdır**: kendi
`www/index.html`, `app.config.json`, `tools/`, `store/`, `native/`, `marketing/`
ve `assets/` klasörü vardır. Ortak olan yalnızca `docs/` (GitHub Pages) ve
`.github/workflows/`.

## Değişmez kurallar

1. **Oyun mantığı tek dosyada kalır:** `<oyun>/www/index.html`. Yeni dosya açma;
   kullanıcı yazılımcı değil, tek dosyayı kopyalayarak güncelleme yapabilmeli.
2. Bir oyunda çalışırken **o oyunun kendi `CLAUDE.md`'sini oku** — denge, adalet
   garantisi ve tuzaklar orada yazılı. Bu dosya yalnızca depo düzenini anlatır.
3. Her değişiklikten sonra ilgili oyunda `node tools/check.js`. Yeşil değilse commit yok.
4. **Git commit mesajı sadece sürüm numarasıdır** (`v1.0.1`) — tek oyunu ilgilendiren
   değişikliklerde `latch: v1.0.1` biçimi de kabul.
5. Kimlik bilgileri (bundle id, e-posta, AdMob, Pages adresi) **yalnız
   `<oyun>/app.config.json`** içinde değişir, ardından `bash tools/set-identity.sh`.
6. Token tasarrufu: oyun dosyaları ~1200-1300 satırdır, tamamını okuma; `grep -n` kullan.

## GitHub Pages

Tek ayar: **Settings → Pages → `main` / `docs`**. Yayınlanan adres:

```
https://buraakkuss.github.io/kus-games/<oyun>/privacy.html
```

- `docs/.nojekyll` **silinmemeli**: Jekyll alt çizgiyle başlayan `_style.css`
  dosyasını yayınlamaz, sayfalar çıplak HTML olarak açılır.
- Ortak stil `docs/_style.css`; vurgu rengi sayfanın `<html data-game="...">`
  niteliğinden gelir. Yeni oyun için CSS'e bir satır ekle.

## Bulutta derleme

`.github/workflows/android.yml` her push'ta matristeki tüm oyunları derler:
`npx cap add android` → `tools/android-prepare.sh` → AAB + debug APK.

- **Java 21 zorunlu.** Capacitor 7 ile JDK 17 kullanırsan
  `invalid source release: 21` hatası alırsın (bu hata bir kez yaşandı).
- İmzalı AAB için 4 secret: `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`,
  `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Yoksa imzasız derler (doğrulama amaçlı).
- `tools/android-prepare.sh` native/android.md'deki tüm elle adımları otomatik
  uygular; `android/` klasörü her silindiğinde tekrar çalıştırılır.

## Yeni oyun eklemek

1. En yakın oyunun klasörünü kopyala: `cp -r latch yenioyun`
2. `yenioyun/app.config.json`: `gameId`, `appName`, `bundleId`, `pagesBaseUrl`
   (`.../kus-games/yenioyun`), `version` 1.0.0, `versionCode` 1.
3. `bash tools/set-identity.sh` (yenioyun içinde) — adresleri her yere yazar.
4. `docs/yenioyun/` klasörünü aç, `docs/latch/` sayfalarını kopyalayıp oyuna göre
   yaz; `docs/index.html` listesine kart ekle; `docs/_style.css` içine renk satırı.
5. `.github/workflows/android.yml` matrisine `- app: yenioyun / dir: yenioyun` ekle.
6. Oyunu yaz, `bash tools/gen.sh`, `node tools/check.js`.

## Bir oyunu kendi deposuna çıkarmak

```bash
cd latch && bash tools/extract-repo.sh ~/latch-game
```
Ortak `docs/latch/` sayfalarını da yanına alır ve stil yollarını düzeltir.
