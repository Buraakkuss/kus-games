# DECISIONS

Kalıcı mimari kararlar. Her karar: **ne**, **neden**, **alternatif neden seçilmedi**.

---

## D1 — Yeni ürün ayrı klasörde kurulur, `seher/` silinmez

**Karar:** Yeni uygulama `sukun/` klasöründe sıfırdan kurulur. Mevcut `seher/`
olduğu gibi kalır ve yayına çıkabilir.

**Neden:** `seher/` çalışıyor, testleri yeşil, CI'da hem Android hem iOS
derleniyor ve mağazaya gönderilmeye hazır. Onu silmek doğrulanmış işi çöpe
atmak olurdu. İki ürün bir süre yan yana yaşar; yeni ürün olgunlaşınca
`seher/` arşivlenebilir.

**Alternatif:** `seher/` üzerine yazmak. Reddedildi: geri dönüşü olmayan kayıp,
kazancı yok.

---

## D2 — Expo SDK 57 + React Native 0.87 + TypeScript + expo-router

**Karar:** Uygulama Expo (managed → development build) üzerinde TypeScript ile
yazılır, yönlendirme `expo-router` ile dosya tabanlıdır.

**Neden:** Şartname widget, Live Activity, arka planda ses, indirilebilir ses
yönetimi ve 6.000+ âyetlik sanal listeler istiyor. Bunların hiçbiri tek dosyalık
bir WebView uygulamasında düzgün yapılamaz. Expo, native modül gerektiğinde
development build ile native koda açılır; saf RN'e göre kurulum, OTA güncelleme
ve CI tarafı çok daha az bakım ister.

**Alternatif:** Capacitor üzerinde devam. Reddedildi: Live Activities, widget ve
arka plan ses oynatıcısı için zaten native uzantı yazmak gerekecekti; o noktada
Capacitor'un tek avantajı kalmıyor.

---

## D3 — Depo kökündeki "tek dosya" kuralına belgelenmiş istisna

**Karar:** Kök `CLAUDE.md` madde 1 ("Ürün mantığı tek dosyada kalır") bu ürün
için geçerli değildir. Kural, `slot/latch/orbita/lull/seher` için aynen durur.

**Neden:** O kural, kullanıcının yazılımcı olmaması ve tek dosyayı kopyalayarak
güncelleyebilmesi için konmuştu. Bu şartnamedeki kapsam (Supabase, RLS, admin
paneli, native uzantılar, test piramidi) tek dosyaya sığmaz. Kuralın amacı
—kullanıcının ürünü tek başına sürdürebilmesi— burada **belgelenmiş kurulum ve
sürüm akışıyla** karşılanır.

**Sonuç:** Kök `CLAUDE.md` bu istisnayı yazacak şekilde güncellenir.

---

## D4 — Telifli dinî içerik lisans gelmeden yayınlanmaz

**Karar:** Kur'an-ı Kerim **Arapça metni** Tanzil Project'ten (verbatim
kopyalama izinli, atıf şartlı) içe aktarılır. **Meal, tefsir, hadis metinleri ve
kıraat kayıtları** lisans alınmadan depoya konmaz; şema, içe aktarma boruhattı,
doğrulama ve arayüz hazır edilir, veri yuvası boş kalır.

**Neden:** Şartnamenin kendi maddeleri bunu emrediyor (§73, §74, §75, §107):
kaynağı olmayan dinî içerik yayınlanamaz, AI âyet/hadis üretemez. Telifli
metni izinsiz taşımak ayrıca App Store 5.2 ve Play IP politikasında doğrudan
kaldırma sebebi ve geliştirici hesabının tamamını riske atar.

**Sonuç:** Bu, §103'teki "yayına hazır" kriterini **insan eylemine bağlı**
kılar. `KNOWN_ISSUES.md` ve `RELEASE_CHECKLIST.md` içinde açıkça izlenir.

---

## D5 — Durum yönetimi

**Karar:** İstemci durumu **Zustand**, sunucu durumu/önbellek **TanStack Query**,
kalıcı yerel depo **expo-sqlite** (Kur'an ve büyük veri) + **AsyncStorage**
(tercihler) + **expo-secure-store** (oturum anahtarları).

**Neden:** Kur'an metni ve arama indeksi ilişkisel ve büyüktür; AsyncStorage'a
sığdırmak hem yavaş hem bellek düşmanıdır. SQLite tam metin aramayı (FTS5) da
çözer (§78).

---

## D6 — Offline-first, Supabase ikincil

**Karar:** Uygulamanın çekirdeği (namaz vakti hesabı, Kur'an, dualar, zikir,
takipler) **internetsiz** çalışır. Supabase yalnız hesap, bulut yedeği, çoklu
cihaz eşitleme, topluluk ve admin içeriği için kullanılır.

**Neden:** Bu ürünün en güçlü farkı çevrimdışı çalışması. Namaz vaktini
sunucuya bağlamak, kategorinin en sık şikâyetini (vakit gelmiyor/yanlış) satın
almak demektir.

---

## D7 — Namaz vakti: hesap birincil, sağlayıcı ikincil

**Karar:** `PrayerTimesProvider` soyutlaması kurulur. **Birincil**: cihazda
astronomik hesap (güneş deklinasyonu + zaman denklemi), yöntem seçilebilir.
**İkincil**: ağ sağlayıcısı, yalnız kullanıcı isterse ve önbellekli.

**Neden:** `seher/` içinde bu hesap yazıldı, üç ayrı saat diliminde doğrulandı
ve bilinen değerlerle karşılaştırıldı. Çalışan ve sınanmış kod taşınır.

---

## D8 — Marka adı

**Karar:** Geçici marka **Sükûn**. Mağaza adı `Sükûn: Namaz Vakti ve Kur'an`.
Tümü `src/config/brand.ts` içinde tek noktadan yönetilir.

**Neden:** Ürün felsefesi "çok özellik, az karmaşa, huzurlu". "Sükûn" bunu
karşılıyor, Türkçede kolay okunuyor ve mağaza aramasında tekil. Mağaza adı ayrıca
aranan kelimeleri taşıyor.
