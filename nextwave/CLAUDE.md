# Next Wave — oyun projesi

Strateji/savunma oyunu. **Bu oyun deponun tek dosya kuralının DIŞINDADIR**
(kök `CLAUDE.md` istisnayı yazar): modüler TypeScript + Phaser 3 + Vite.
Güncel sürüm: **v0.1.0** (kesim `0.1.0-a` — oynanabilir iskelet).

Tasarım belgesi (GDD V1, onaylı): oyunun neden böyle kurulduğu orada yazılı.
Denge değiştirmeden önce §4 (istihbarat) ve §7 (kart teklif kuralları) okunmalı.

## Değişmez kurallar

1. **`src/sim/` Phaser bilmez.** Hasar, hedefleme, dalga üretimi, AI — hepsi saf
   TypeScript. Phaser yalnızca `src/scenes/` ve `src/ui/` içinde. Bu bir zarafet
   tercihi değil: `sim/` Phaser'a bulaşırsa `tools/sim.ts` Node'da çalışamaz ve
   **denge testi komple ölür.** `tools/check.js` bunu 1. adımda denetler.
2. Denge sayıları koda yazılmaz, `src/data/*.json` içinde yaşar.
3. Her değişiklikten sonra `node tools/check.js`. Yeşil değilse commit yok.
4. Reklam/kimlik bilgileri **yalnız `app.config.json`** içinde değişir.
5. Token tasarrufu: `grep -n` kullan, dosyaların tamamını okuma.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Vite geliştirme sunucusu (telefondan da açılır) |
| `npm run build` | `www/` klasörüne üretim paketi (Capacitor bunu bekler) |
| `npm run sim` | **Denge simülasyonu** — görüntüsüz, Node'da, N koşu |
| `npm run typecheck` | `tsc --noEmit` |
| `node tools/check.js` | Hepsi + tarayıcı self-test |
| `bash tools/publish-web.sh` | Derleyip `docs/nextwave/play/` altına koyar (Pages) |

Hata ayıklama: `?scene=intel&lv=7` veya `?scene=battle&lv=5` menüden geçmeden
doğrudan o ekranı açar — yerleşimi telefon oranında denetlemek için.

**Yayın elle kopyalanmaz.** `docs/nextwave/play/` bir derleme çıktısıdır; kaynak
değişip yayın adımı unutulursa oyuncular eski sürümü oynar ve kimse fark etmez.
`nextwave.yml` her push'ta bunu denetler ve bayatsa kırmızı yanar.

`RUNS=1000 npm run sim` ile örneklem büyütülür. `DIAG=1` teşhis satırlarını açar
(üs yüzde kaç kaldı, bölüm kaç saniye sürdü) — denge ayarlarken asıl işe yarayan bu.

## Denge simülatörü — bu oyunun adalet garantisi

Slot ve Latch'te "mükemmel oynayan yapay oyuncu ölmemeli (`deaths=0`)" garantisi
var. Next Wave bir refleks oyunu olmadığı için o test işe yaramaz. Karşılığı şu:
üç farklı **politika** yüzlerce kez oynatılır ve üç iddia ölçülür.

| Politika | Ne yapar | Eşik | Neyi kanıtlar |
|---|---|---|---|
| dengeli | tehdide göre kule seçer | Normal'de ≥%90 | oyun adil |
| hasar | savunmayı ihmal eder | B3'te dengeliden kötü | yanlış strateji cezalı |
| kör | rastgele | Kolay'da ≥%60 | oyun affediyor |

**Denge artık his değil, test.** Bir sayıyı değiştirdiğinde `npm run sim` çalıştır:
eşikler tutmuyorsa değişiklik yanlıştır.

## Mimari

```
src/sim/     saf TS — World.step(dt) dışarıdan çağrılır, zamanlayıcı yok
src/scenes/  Phaser — YALNIZCA çizer ve girdi toplar
src/ui/      joystick, HUD
src/data/    balance / enemies / towers JSON
tools/sim.ts başsız denge simülasyonu
```

`World` deterministiktir: aynı tohum + aynı `dt` dizisi = aynı sonuç. Ekranda
60 fps, Node'da 30 Hz çalışır; ikisi de aynı kodu kullanır.

## Hasar tipi × zırh tipi

Stratejinin çekirdeği. `src/data/balance.json` → `matrix`.
Çarpan **0 ise o hedef seçilemez bile** (havan havayı vuramaz — boşa atış yapmaz).
Kalkan ayrıca her vuruştan **sabit** `shieldFlat` kadar emer: hızlı küçük vuruşlar
emilir, tek büyük vuruş deler. "Hızlı ateş her zaman iyidir" sezgisini kıran kural budur.

## Tuzaklar

- **Phaser sahne dizisindeki ilk sahneyi kendiliğinden başlatır.** `scene: [BattleScene]`
  yazılırsa `init()` veri gelmeden çağrılır ve oyun siyah ekrana düşer. Bu hata bir kez
  yaşandı. Sahne `game.scene.add('battle', BattleScene, true, veri)` ile eklenir.
- **Telefonda konsol yok.** `main.ts` içindeki `window.onerror` kancası hatayı ekranın
  altına yazar. Silme — siyah ekranda tek bilgi kaynağı odur.
- `file://` üzerinden ES modülleri CORS'a takılır; test hep HTTP üzerinden yapılır.
- Sanal zamanlı (`--virtual-time-budget`) ekran görüntüsü Phaser'ın kare döngüsünü
  ilerletmez. Oynanışı doğrulamak için ekran görüntüsü değil `?selftest=1` kullanılır.
- Paket ~1.5 MB (345 KB gzip) — neredeyse tamamı Phaser. Faz 2'de kod bölme
  değerlendirilecek; şimdilik kabul edilebilir.

## Sonraki kesimler

`0.1.0-b` savaş çekirdeği tamamlanır (kaynak kazanımı, tamir, daha çok düşman) ·
`0.1.0-c` istihbarat + kart ekranı + sinerji · `0.1.0-d` 10 bölüm + boss + kayıt ·
`0.1.0` menü, tr/en, 3 zorluk, ses.
