# CHANGELOG

Semantic versioning. Yayınlanan ilk üretim sürümü hedefi: **1.0.0**.

## [Yayınlanmadı] — 0.1.0

### FAZ 0 — Repository audit, mimari, durum dosyaları

- Repository denetlendi: 5 mevcut Capacitor ürünü, tek dosya mimarisi.
- Mimari kararlar alındı ve `DECISIONS.md` içinde gerekçelendirildi (D1–D8).
- `PROJECT_STATE.md`, `MASTER_CHECKLIST.md`, `DECISIONS.md`,
  `KNOWN_ISSUES.md`, `CHANGELOG.md` oluşturuldu.

### FAZ 0 — Design system, bileşen kütüphanesi, veritabanı

- Expo SDK 54 + React Native 0.76.5 + TypeScript (strict) iskeleti.
- `BrandConfig`, design token'ları, açık/koyu tema, reduced-motion desteği.
- 29 yeniden kullanılabilir bileşen (`src/ui/`), dış ikon paketi olmadan
  32 ikonluk kendi SVG seti.
- Geometrik motif dili: 5 desen (rub'ül hizb, girih, sekizgen petek, kemer,
  yıldız kafes), düşük opaklıkta, figüratif öge yok.
- Arapça tipografi: Amiri + Amiri Quran (SIL OFL 1.1), sabit satır aralığı
  oranı; yön katmanı saf mantık (`direction.ts`) ve platform köprüsü
  (`rtl.ts`) olarak ayrıldı.
- Supabase şeması: 10 migration, 39 tablo, tümünde RLS.
- RLS davranış sınaması + kapsama denetimi (`tools/verify-db.sh`).
- Kalite kapısı: `tsc` + `eslint` + 6 test paketi / 43 test.

### FAZ 1 — Çekirdek altyapı

- expo-router sekme düzeni: Ana Sayfa, Kuran, İbadet, Keşfet, Profil;
  bulunamayan yol için kendi ekranı.
- Yerelleştirme: Türkçe kaynak dil (169 anahtar), EN/AR/DE/FR temel arayüz
  (85 anahtar). Eksik çeviri Türkçeye düşer, anahtar adı hiç gösterilmez.
- Gömülü metin yasağı sınamayla denetleniyor: ekran dosyalarında düz metin
  bırakılırsa test kırmızı olur.
- Kalıcılık: SQLite migration çalıştırıcısı (her sürüm kendi işleminde),
  AsyncStorage anahtar-değer katmanı, SecureStore sır deposu.
- Ağ katmanı: kısa zaman aşımı, sınırlı yeniden deneme, üstel geri çekilme,
  başarısızlıkta bayat önbellek yedeği. Bozuk yanıt önbelleğe yazılmaz.
- Üretim güvenli günlükleme: konum, e-posta, telefon, jeton ve JWT her
  derinlikte maskelenir; üretimde debug/info hiç yazılmaz.
- Hata sınırı ve çevrimdışı şeridi.
- Bağımlılıklar Expo SDK 54'ün beklediği sürümlere hizalandı
  (React 19, React Native 0.81.5, expo-router 6) ve `expo export` ile
  paketlemenin çalıştığı doğrulandı.

### Düzeltilen

- `app.config.ts` marka bilgisini `.ts` dosyasından okuyordu; Expo'nun
  yapılandırma değerlendiricisi bunu çözemiyor ve `expo export` patlıyordu.
  Marka değerleri `brand.json` içine alındı, tek kaynak korundu.
- `src/app/` klasörü expo-router tarafından yönlendirme kökü sanılıyordu;
  `src/boot/` olarak yeniden adlandırıldı.
- `migrate()` kendisine verilen migration listesini yok sayıyordu
  (`pendingMigrations` her zaman genel listeyi okuyordu). Sınama yakaladı.
