# KUŞ GRUP — oyunlar

Tek dokunuşlu arcade oyunları. Her oyun kendi klasöründe, tek HTML dosyası +
Capacitor ile iOS ve Android. Hepsi mağazaya gönderilmeye hazır durumda tutulur.

| Oyun | Klasör | Ne | Durum |
|---|---|---|---|
| **Slot: Fit the Shape** | `slot/` | Şekli 90° döndür, inen duvardaki deliğe otur | v1.0.0 hazır |
| **Latch: One Tap Swing** | `latch/` | Basılı tut, sarkaç gibi savrul, 45°'de bırak | v1.0.0 hazır |

## Neden tek depo
- Yeni oyun = yeni klasör. GitHub'da yeni depo açmak, Pages'i tekrar ayarlamak yok.
- **GitHub Pages bir kez** ayarlanır (`main` / `docs`), tüm oyunların gizlilik
  sayfaları oradan yayınlanır: `docs/<oyun>/privacy.html`.
- Derleme iş akışı (`.github/workflows/android.yml`) tüm oyunları birlikte derler.
- `tools/` scriptleri her oyunda aynı; birinde düzelen hata hepsinde düzelir.
- Bir oyun kendi deposunu hak ederse: `cd <oyun> && bash tools/extract-repo.sh ~/<oyun>-game`
  — sayfalarıyla birlikte bağımsız depoya çıkar.

## Yapı
```
docs/                 GitHub Pages kaynağı (TEK ayar)
  index.html          oyunların listesi
  _style.css          ortak stil (vurgu rengi oyun başına)
  slot/  latch/       oyun başına gizlilik, şartlar, destek (EN + TR)
slot/  latch/         oyunun kendisi: www, assets, store, native, marketing, tools
.github/workflows/    bulutta Android derlemesi
```

## Bir oyunda çalışmak
```bash
cd latch
node tools/check.js          # yayın öncesi tam doğrulama (self-test dahil)
bash tools/gen.sh            # mağaza görsellerini yeniden üret
bash tools/set-identity.sh   # app.config.json'daki değerleri her yere yaz
npx --yes serve www -l 5173  # tarayıcıda dene
```

## Yeni oyun eklemek
`CLAUDE.md` → "Yeni oyun eklemek" bölümü. Özetle: en yakın oyunun klasörünü
kopyala, `app.config.json` içindeki `gameId`/`appName`/`bundleId`/`pagesBaseUrl`
değerlerini değiştir, `docs/<yeni>/` klasörünü aç, CI matrisine bir satır ekle.
