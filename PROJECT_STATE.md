# PROJECT_STATE

> Bu dosya her oturumun **ilk okunacak** dosyasıdır. Context sıfırlanırsa
> buradan devam edilir. Her önemli adımdan sonra güncellenir.

## Ürün

| | |
|---|---|
| Kod adı | **Sükûn** (geçici marka, `BrandConfig` üzerinden tek noktadan değişir) |
| Klasör | `sukun/` |
| Sürüm | 0.1.0 (ilk üretim sürümü hedefi: 1.0.0) |
| Teknoloji | Expo SDK 54 · React Native 0.76.5 · TypeScript (strict) · expo-router |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions + RLS) |

## Mevcut faz

**FAZ 1 — Çekirdek** (FAZ 0 tamamlandı)

## Tamamlanan

- [x] Repository audit (5 mevcut ürün, Capacitor tabanlı, tek dosya mimarisi)
- [x] Mimari kararı verildi ve `DECISIONS.md`'ye yazıldı (D1–D8)
- [x] Durum dosyaları oluşturuldu
- [x] `sukun/` Expo + TypeScript iskeleti kuruldu
- [x] Kalite kapısı yeşil: `npm run gate` (tsc + eslint + jest)
- [x] `BrandConfig` — marka adı, bundle id, e-posta tek noktada
- [x] Design token katmanı (renk, tipografi, spacing, radius, opaklık, süre, easing)
- [x] Açık/koyu tema (`ThemeColors` rol arayüzü üzerinden)
- [x] Saat dilimi katmanı (`src/lib/time/zone.ts`) — IANA zone, DST'ye dayanıklı
- [x] Namaz vakti çekirdeği (7 hesap yöntemi, astronomi, düzeltme, sonraki/şimdiki vakit)
- [x] Kıble çekirdeği (bearing, mesafe, pusula sapması, doğruluk sınıfı)
- [x] Hicri takvim çekirdeği + 13 dinî gün tanımı
- [x] 4 test dosyası / 32 test — hepsi yeşil
- [x] `CONTENT_SOURCES.md` — telif durumu kalem kalem yazıldı
- [x] Bileşen kütüphanesi: 29 bileşen, 32 ikonluk kendi SVG seti (§8)
- [x] Geometrik motif dili: 5 desen, figüratif öge yok (§9)
- [x] Arapça tipografi: Amiri + Amiri Quran (SIL OFL 1.1), RTL katmanı (§10)
- [x] Supabase şeması: 10 migration, 39 tablo (§70)
- [x] RLS politikaları + davranış sınaması + kapsama denetimi (§71)

**FAZ 0 tamamlandı.**

## Devam eden

- [ ] FAZ 1 — navigasyon, yerelleştirme, kalıcılık, hata sınırı, ağ katmanı

## Sıradaki iş

1. expo-router sekme düzeni: Ana Sayfa · Kur'an · İbadet · Keşfet · Profil (§11)
2. Yerelleştirme altyapısı, metin gömme yasağı, TR tam + EN/AR/DE/FR temel (§61)
3. Kalıcılık: SQLite (FTS5) + AsyncStorage + SecureStore (§5)
4. Global hata sınırı, çevrimdışı şeridi, yeniden deneme (§82)
5. Ağ katmanı: zaman aşımı, yeniden deneme, önbellek, yedek (§76)

## Build durumu

| | Durum |
|---|---|
| TypeScript | ✅ `tsc --noEmit` temiz |
| Lint | ✅ `eslint --max-warnings=0` temiz |
| Test | ✅ 6 suite / 43 test |
| Veritabanı | ✅ `bash sukun/tools/verify-db.sh` — migration + RLS + kapsama |
| iOS build | henüz denenmedi (B6 — Apple hesabı) |
| Android build | henüz denenmedi |

## Kritik kararlar (özet — ayrıntı DECISIONS.md)

- Mevcut `seher/` **silinmedi**; yeni ürün ayrı klasörde kuruluyor.
- Depo kökündeki "tek dosya" kuralı bu ürün için **belgelenmiş istisna** (D3).
- Telifli dinî içerik (meal, tefsir, hadis, kıraat) **kaynak lisansı gelmeden
  yayınlanmaz**; altyapı kurulur, veri yuvası boş bırakılır. Ayrıntı:
  `CONTENT_SOURCES.md` ve `KNOWN_ISSUES.md`.
