# MASTER CHECKLIST

> Şartnamedeki **her** gereksinim burada izlenir. Bir madde gerçekten
> tamamlanmadan `[x]` yapılmaz (§93). `⛔Bn` işareti, o maddenin
> `KNOWN_ISSUES.md` içindeki **Bn** engeline bağlı olduğunu gösterir:
> altyapı tamamlanır, veri/kimlik yuvası boş kalır.
**Toplam 133 madde · tamamlanan 29 · dış engele bağlı 31**


## FAZ 0 — Audit, mimari, design system, veritabanı mimarisi

- [x] Repository audit
- [x] Mimari kararları (DECISIONS.md)
- [x] PROJECT_STATE / MASTER_CHECKLIST / DECISIONS / KNOWN_ISSUES / CHANGELOG
- [x] Expo + TypeScript iskeleti
- [x] BrandConfig (§7) — tek noktadan marka yönetimi
- [x] Design token katmanı: colors, spacing, typography, radius, shadows, opacity, animations, icons (§8)
- [x] Light/Dark tema (§8)
- [x] Reusable component kütüphanesi (§8) — 29 bileşen + 32 ikonluk kendi SVG seti
- [x] Görsel dil: düşük opaklıkta geometrik motif (§9) — 5 desen, figüratif öge yok
- [x] Typography: Latin sistem yazı tipi + Amiri/Amiri Quran (OFL), RTL katmanı (§10)
- [x] Supabase şeması (§70) — 10 migration, 39 tablo, yerelde uygulanarak doğrulandı
- [x] RLS politikaları (§71) — davranış sınaması + kapsama denetimi, mutasyonla sınandı
- [x] Quality gate: tsc + lint + test + build

## FAZ 1 — Çekirdek

- [x] Navigation (§11): Ana Sayfa · Kur'an · İbadet · Keşfet · Profil — expo-router, 5 sekme
- [x] Localization altyapısı, string hardcode yok (§61) — sınamayla denetleniyor
- [x] Türkçe çeviri tam (§61) — 169 anahtar, kaynak dil
- [x] EN / AR / DE / FR temel UI çevirileri (§61) — 85 temel anahtar, eksiksizliği sınanıyor
- [x] RTL desteği (§61, §79) — saf yön katmanı + platform köprüsü + Arapça metin akışı
- [x] Persistence: SQLite + AsyncStorage + SecureStore (§5) — 3 migration, işlemli çalıştırıcı
- [x] Global Error Boundary, offline banner, retry (§82)
- [x] Network katmanı: timeout, retry, cache, fallback (§76) — bayat önbellek yedeği dahil
- [x] Production-safe logging (§83) — konum/e-posta/jeton maskeleme sınandı

## FAZ 2 — Onboarding, konum, namaz

- [x] Onboarding 5 aşama (§12) — hoş geldin · konum · yöntem · bildirim · hazır
- [ ] GPS + manuel ülke/il/ilçe (§13) — **il düzeyi tamam** (81 il + 36 dünya şehri); ilçe verisi ⛔B9
- [x] Çoklu kayıtlı konum ve aralarında geçiş (§13) — birincil konum kuralı sınandı
- [x] PrayerTimesProvider abstraction + fallback (§15) — ağ çökerse yerel hesaba düşer; yerel hesap önbellek istemez
- [x] Hesaplama yöntemleri (§15) — 7 yöntem + Hanefî/Şâfiî ikindi seçimi
- [x] Altı vakit + sıradaki vakit + canlı geri sayım (§14) — arka planda sayaç durur
- [x] Günlük ve aylık takvim ekranı + haftalık aralık işlevi (§14)
- [x] Vakit bazlı bildirim ayarları, erken uyarı dakikası (§16) — iOS 64 sınırı hesaba katıldı
- [ ] Ezan sesi altyapısı + indirme/cache (§17)  ⛔B4
- [ ] Bildirim merkezi (§65) — kurulu bildirim sayacı var, merkez ekranı FAZ 11'de

## FAZ 3 — Ana sayfa ve günlük içerik

- [ ] Ana sayfa düzeni (§20)
- [ ] Home customization: gizle/göster/drag-drop + cloud sync (§21)
- [ ] Günün Âyeti (§22)  ⛔B1
- [ ] Günün Hadisi (§23)  ⛔B3
- [ ] Günün Duası (§24)
- [ ] Günün Bilgisi (§25)
- [ ] Esmâü'l-Hüsnâ: 99 isim, arama, favori, günün esması (§26)
- [ ] Hicri takvim + çift yönlü çevirici (§44)
- [ ] Dini günler + geri sayım (§45)
- [ ] Ay durumu: faz, aydınlanma, yaş (§46)

## FAZ 4 — Kur'an

- [ ] Kur'an ana ekranı: son okunan, sureler, cüzler, sayfalar, favoriler (§27)
- [ ] Arapça metin içe aktarma (Tanzil) + doğrulama + checksum (§74)
- [ ] Reader: Arapça / Arapça+Meal / Meal modları (§28)  ⛔B1
- [ ] Reader ayarları: font, satır aralığı, tema, scroll/page (§28)
- [ ] Âyet aksiyonları: dinle, meal, tefsir, favori, yer imi, not, kopyala, paylaş (§28)
- [ ] Son okunan + devam et (§29)
- [ ] Yer imleri: renk, etiket, not (§30)
- [ ] Favoriler + koleksiyon (§31)
- [ ] Arama: sure adı, âyet no, meal, kelime (§35)  ⛔B1
- [ ] Tefsir (§34)  ⛔B2

## FAZ 5 — Kur'an sesi

- [ ] Audio player: play/pause/prev/next/repeat/range/speed/sleep timer (§32)  ⛔B4
- [ ] Arka planda oynatma + kilit ekranı kontrolleri (§32)  ⛔B4
- [ ] Okunan âyeti otomatik vurgulama (§32)  ⛔B4
- [ ] İndirme yöneticisi + depolama göstergesi + silme (§33)  ⛔B4

## FAZ 6 — Kıble

- [ ] GPS + pusula, büyük daire hesabı (§36)
- [ ] Derece, mesafe, pusula kadranı (§36)
- [ ] Doğruluk göstergesi, kalibrasyon ve manyetik girişim uyarısı (§36)
- [ ] Hizalanınca haptic (§36)
- [ ] Pusula yalnız Kıble ekranında aktif (§81)

## FAZ 7 — Zikir, dualar, esma, hadis, bilgi

- [ ] Zikirmatik: preset 33/99/100/1000/custom, haptic, ses (§37)
- [ ] Özel zikir oluşturma (§37)
- [ ] Zikir istatistiği: günlük/haftalık/aylık (§38)
- [ ] Dua veritabanı: 14 kategori, Arapça+okunuş+anlam+kaynak (§39)
- [ ] Dua favori + arama + ses altyapısı (§39)
- [ ] Hadis kütüphanesi (§52)  ⛔B3
- [ ] İslami bilgi kütüphanesi (§53)

## FAZ 8 — İbadet rehberi ve takip

- [ ] Namaz rehberi: abdest, hazırlık, vakit vakit rekat ve okunuşlar (§40)
- [ ] Kaza namazı: 6 sayaç, toplu giriş, +/-, geçmiş, ilerleme (§41)
- [ ] İbadet/amel defteri + takvim görünümü (§42)
- [ ] Oruç takibi: Ramazan/kaza/nafile (§49)

## FAZ 9 — Zekât, Ramazan, mukabele, cuma, hac

- [ ] Zekât: nakit/döviz/altın/gümüş/yatırım/ticari/alacak/borç (§43)
- [ ] Nisap + canlı değer provider abstraction + metodoloji gösterimi (§43)
- [ ] Ramazan modu: iftar/imsak geri sayımı, 30 günlük takvim (§47)
- [ ] Mukabele: 30 cüz takibi, Reader entegrasyonu (§48)
- [ ] Cuma modu: minimal görünüm, Kehf kısayolu, salavat (§50)
- [ ] Hac/Umre rehberi + checklist + offline (§54)

## FAZ 10 — Hesap ve eşitleme

- [ ] Guest kullanım + opsiyonel hesap (§57)
- [ ] Sign in with Apple / Google / Email (§57)  ⛔B5
- [ ] Cloud sync: favoriler, yer imleri, ilerleme, zikir, ayarlar, kaza (§58)  ⛔B5
- [ ] Offline-first + çakışma çözümü (§58)
- [ ] Profil ekranı (§59) ve Settings (§60)
- [ ] Hesap silme, veri dışa aktarma, KVKK/GDPR (§69)  ⛔B5

## FAZ 11 — Arama, paylaşım, hatırlatıcı

- [ ] Akıllı global arama (§51)
- [ ] Türkçe + Arapça normalizasyon, diacritics-aware (§78)
- [ ] Share card generator: story/square/portrait, kaynak görünür (§62)
- [ ] Unified favorites (§63)
- [ ] Özel hatırlatıcılar (§64)

## FAZ 12 — Widget ve Live Activity

- [ ] iOS widget: small/medium/large (§19)  ⛔B6
- [ ] Android widget (§19)
- [ ] Günün Âyeti / Hadisi widget (§19)  ⛔B1,B3
- [ ] Live Activities: lock screen (§18)  ⛔B6
- [ ] Dynamic Island: compact/minimal/expanded (§18)  ⛔B6

## FAZ 13 — Topluluk

- [ ] Anonim dua talebi (§55)  ⛔B5
- [ ] "Dua ettim" etkileşimi (§55)  ⛔B5
- [ ] Report / block / moderation / rate limit / spam-profanity koruma (§55)  ⛔B5

## FAZ 14 — AI asistan

- [ ] Retrieval-backed mimari, onaylı kaynak havuzu (§56)  ⛔B8
- [ ] Kaynak gösterimi, ihtilaf belirtimi, fetva reddi (§56)  ⛔B8
- [ ] AI çıktısı içerik veritabanına yazmaz (§56)

## FAZ 15 — Admin panel

- [ ] Web admin paneli (§72)  ⛔B5
- [ ] İçerik yönetimi: âyet/hadis/dua/makale/dini gün/kaynak (§72)  ⛔B5
- [ ] Push kampanyaları, topluluk moderasyonu, raporlar (§72)  ⛔B5
- [ ] Rol tabanlı erişim + audit log (§72)  ⛔B5
- [ ] İçerik doğrulama akışı: DRAFT→REVIEW→VERIFIED→PUBLISHED (§73)

## FAZ 16 — Abonelik ve reklam

- [ ] Freemium dağılımı (§66)
- [ ] Aylık/yıllık abonelik, StoreKit + Play Billing (§67)  ⛔B6,B7
- [ ] Fiyat mağazadan, restore, manage, doğrulama (§67)  ⛔B6,B7
- [ ] Reklam yerleşimi kuralları (§68)
- [ ] Uygunsuz reklam kategorisi engelleme (§68)

## FAZ 17 — Erişilebilirlik, performans, güvenlik

- [ ] VoiceOver/TalkBack, Dynamic Type, kontrast, dokunma hedefleri (§79)
- [ ] Reduced motion, accessibility labels (§79)
- [ ] 60 FPS, lazy loading, sanal listeler, memoization (§80)
- [ ] Pil optimizasyonu: GPS/pusula/countdown (§81)
- [ ] Güvenlik: .env, SecureStore, input validation, rate limit (§89)
- [ ] Privacy: hassas veri analytics'e gitmez (§69, §84)
- [ ] Crash reporting + PII scrub (§85)

## FAZ 18 — Test

- [ ] Unit testler (§86)
- [ ] Integration testler (§86)
- [ ] Component testler (§86)
- [ ] E2E testler (§86)
- [ ] Kritik: namaz vakti, timezone, DST, hicri, kıble, zekât (§86)
- [ ] Kritik: Kur'an bütünlüğü, auth, RLS, abonelik, offline sync (§86)
- [ ] Edge case matrisi (§88)
- [ ] Cihaz matrisi (§87)

## FAZ 19 — Yayın

- [ ] Environment ayrımı: development/staging/production (§96)
- [ ] README / ARCHITECTURE / ROADMAP / CONTENT_SOURCES / PRIVACY_ARCHITECTURE / RELEASE_CHECKLIST (§97)
- [ ] Semantic versioning + build number (§98)
- [ ] iOS store gereklilikleri (§90)  ⛔B6
- [ ] Google Play gereklilikleri (§91)  ⛔B7
- [ ] Final audit: TODO/mock/dead UI taraması (§101)
- [ ] Release test: 5 user journey (§102)
- [ ] /final-screenshots/ (§110)
