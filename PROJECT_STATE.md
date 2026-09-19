# PROJECT_STATE

> Bu dosya her oturumun **ilk okunacak** dosyasıdır. Context sıfırlanırsa
> buradan devam edilir. Her önemli adımdan sonra güncellenir.

## Ürün

| | |
|---|---|
| Kod adı | **Sükûn** (geçici marka, `BrandConfig` üzerinden tek noktadan değişir) |
| Klasör | `sukun/` |
| Sürüm | 0.1.0 (ilk üretim sürümü hedefi: 1.0.0) |
| Teknoloji | Expo SDK 54 · React Native 0.81.5 · React 19 · TypeScript (strict) · expo-router 6 |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions + RLS) |

## Mevcut faz

**FAZ 5 — Kur'an sesi** (FAZ 0–4 tamamlandı)

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

**FAZ 1 tamamlandı:**

- [x] expo-router sekme düzeni, 5 sekme + bulunamayan yol ekranı (§11)
- [x] Yerelleştirme: TR tam (169 anahtar), EN/AR/DE/FR temel (85 anahtar) (§61)
- [x] Gömülü metin yasağı — sınamayla denetleniyor (§61)
- [x] RTL: saf yön katmanı, platform köprüsü, Arapça metin akışı (§79)
- [x] Kalıcılık: SQLite migration çalıştırıcısı, AsyncStorage, SecureStore (§5)
- [x] Hata sınırı, çevrimdışı şeridi, yeniden deneme (§82)
- [x] Ağ katmanı: zaman aşımı, yeniden deneme, önbellek, bayat yedek (§76)
- [x] Üretim güvenli günlükleme + veri maskeleme (§83, §84)
- [x] `expo export` ile paketleme doğrulandı (Android paketi üretiliyor)

**FAZ 2 tamamlandı:**

- [x] 5 aşamalı onboarding (§12)
- [x] Konum: GPS + elle seçim, 81 il + 36 dünya şehri, çoklu kayıt (§13)
- [x] Türkçe arama normalizasyonu — İ/ı tuzağı dahil (§78)
- [x] 7 hesaplama yöntemi + Hanefî/Şâfiî ikindi (§15)
- [x] PrayerTimesProvider soyutlaması, ağ çökerse yerel hesaba düşer (§15)
- [x] Altı vakit, canlı geri sayım, aylık takvim ekranı (§14)
- [x] Vakit bildirimleri: vakit bazlı açma/kapama, erken uyarı dakikası (§16)

**FAZ 3 tamamlandı:**

- [x] Ana sayfa: 8 kart, gizle/göster/sırala (§20, §21)
- [x] Günün içeriği seçimi: aynı gün sabit, N ardışık günde tekrarsız (§22–§25)
- [x] 34 özgün dua (14 kategori), 43 özgün bilgi maddesi (6 konu)
- [x] Esmâü'l-Hüsnâ: 99 isim, arama, favori (§26)
- [x] Hicrî takvim, çift yönlü çevirici, gün düzeltmesi (§44)
- [x] Dinî günler + geri sayım (§45), ay durumu (§46)
- [x] Birleşik favoriler altyapısı (§63)

**FAZ 4 tamamlandı (telif engelli kısımlar hariç):**

- [x] Tanzil'den Arapça metin içe aktarma, doğrulama ve sağlama (§74)
- [x] 114 sure · 6236 âyet · 604 sayfa · 30 cüz · 15 secde âyeti
- [x] Kur'an ana ekranı: son okunan, sureler, cüzler, yer imleri (§27)
- [x] Okuyucu: Arapça metin, yazı boyutu, âyet aksiyonları (§28)
- [x] Yer imleri (renk + not), son okunan konum (§29, §30)
- [x] Arapça arama: harekesiz sorgu harekeli metinde eşleşiyor (§35, §78)
- [x] Paylaşımda kaynak künyesi her zaman gidiyor

## Devam eden

- [ ] FAZ 5 — Kur'an sesi altyapısı (kıraat lisansı ⛔B4)

## Sıradaki iş

1. Ses oynatıcı altyapısı: çalma/durdurma, tekrar, aralık, hız (§32) ⛔B4
2. Arka planda oynatma + kilit ekranı kontrolleri (§32) ⛔B4
3. İndirme yöneticisi + depolama göstergesi (§33) ⛔B4
4. FAZ 6 — kıble ekranı (§36): altyapı hazır, ekran yazılacak

## Build durumu

| | Durum |
|---|---|
| TypeScript | ✅ `tsc --noEmit` temiz |
| Lint | ✅ `eslint --max-warnings=0` temiz |
| Test | ✅ 21 suite / 227 test |
| Veritabanı | ✅ `bash sukun/tools/verify-db.sh` — migration + RLS + kapsama |
| Paketleme | ✅ `npm run bundle` — Metro paketi üretiliyor |
| iOS build | henüz denenmedi (B6 — Apple hesabı) |
| Android build | henüz denenmedi |

## Kritik kararlar (özet — ayrıntı DECISIONS.md)

- Mevcut `seher/` **silinmedi**; yeni ürün ayrı klasörde kuruluyor.
- Depo kökündeki "tek dosya" kuralı bu ürün için **belgelenmiş istisna** (D3).
- Telifli dinî içerik (meal, tefsir, hadis, kıraat) **kaynak lisansı gelmeden
  yayınlanmaz**; altyapı kurulur, veri yuvası boş bırakılır. Ayrıntı:
  `CONTENT_SOURCES.md` ve `KNOWN_ISSUES.md`.
