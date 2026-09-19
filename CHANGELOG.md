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

### FAZ 2 — Onboarding, konum, namaz vakitleri

- Beş aşamalı onboarding; konum dışındaki her aşama atlanabilir.
- Konum: tek seferlik GPS okuması (sürekli izleme yok — pil kuralı §81),
  bulunan nokta çevrimdışı olarak en yakın şehre eşlenir. 81 il + 36 dünya
  şehri; hepsinin IANA saat dilimi doğrulandı.
- Türkçe arama normalizasyonu: "ISTANBUL", "istanbul", "İstanbul" ve
  "sanliurfa" aynı sonucu verir. Türkçe'nin I/İ tuzağı `toLowerCase`
  kullanılmadan, harf harf eşlemeyle çözüldü.
- Yedi hesaplama yöntemi, Hanefî/Şâfiî ikindi seçimi, vakit başına dakika
  düzeltmesi.
- `PrayerTimesProvider` soyutlaması: birincil kaynak cihazdaki hesap. Ağ
  kaynağı seçilse bile çökerse sessizce hesaba düşer — ekran boş kalmaz.
- Ana sayfa: sıradaki vakit halkası, canlı geri sayım, günün altı vakti.
  Sayaç uygulama arka plana geçince durur; astronomik hesap saniyede bir
  değil, gün dönünce yapılır.
- Aylık vakit takvimi ekranı.
- Bildirimler: vakit bazlı açma/kapama, erken uyarı dakikası, ses. Plan saf
  mantık olarak yazıldı ve sınandı: geçmiş an kurulmaz, oluşmayan vakit
  (kutup) için bildirim üretilmez, iOS'un 64 bekleyen bildirim sınırı aşılmaz.
- Çoklu kayıtlı konum: birincil konum kuralı ("her zaman tam bir birincil")
  sınamayla güvence altına alındı.

### FAZ 3 — Ana sayfa ve günlük içerik

- Ana sayfa sekiz karttan oluşuyor ve kullanıcı kartları gizleyip
  sıralayabiliyor. "Sıradaki vakit" kartı kapatılamaz. Yeni sürümde eklenen
  kart, eski kullanıcının düzenini bozmadan listenin sonuna geliyor.
- Günün içeriği seçimi: aynı gün hep aynı içerik, **herhangi** N ardışık günde
  tekrar yok. İlk çözüm tur sınırında tekrar üretiyordu (34 günlük pencerede
  34 yerine 26 farklı madde); liste uzunluğuyla aralarında asal bir adım
  kullanılarak tekrar yapısal olarak imkânsız hâle getirildi.
- 34 özgün Türkçe dua (14 kategori) ve 43 özgün bilgi maddesi (6 konu).
  Hiçbiri âyet veya hadis alıntısı değil; arayüzde de böyle belirtiliyor.
- Esmâü'l-Hüsnâ: 99 isim, arama, favori, günün esması. Arapça yazım bilerek
  boş: doğrulanmış kaynaktan gelecek.
- Hicrî takvim: bugünün tarihi, çift yönlü çevirici, ±2 gün düzeltme,
  13 dinî gün için geri sayım.
- Ay durumu: evre, aydınlanma oranı, ay yaşı, sonraki yeni ay ve dolunay.
  Model dört bilinen yeni ay anıyla karşılaştırıldı; sapma yarım günün altında.
  Arayüzde bunun rüyet yerine geçmediği yazılı.
- Birleşik favoriler: dua, esmâ ve ileride âyet/hadis aynı listede.
