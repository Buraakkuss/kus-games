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
