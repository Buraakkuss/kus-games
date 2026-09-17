# Lull — yayına çıkış listesi

Sırayla git. Solundaki kutu senin yapman gerekeni gösterir.
Yazılım tarafı bitti; kalan her şey hesap, imza ve gönderim işi — bunlar senin kimliğinle yapılır.

---

## AŞAMA 0 — İki karar (10 dakika)

### 0.1 · Depo ve isim
Uygulama şu an `kus-games` deposunda `lull/` klasöründe. Kendi deposuna taşı:

```bash
bash tools/extract-repo.sh ~/lull-game
```

Sonra GitHub'da **`lull-game`** deposunu aç (public), uzak adresi ekle ve gönder.
Mağaza adı **`Lull: One Tap Swing`** olsun; tek başına "Lull" aramada kaybolur.
Göndermeden önce her iki mağazada "lull" aratıp çakışma var mı bak. İsim değişimi
tek yerden yapılır: `app.config.json` + `bash tools/set-identity.sh`.

### 0.2 · Hesap türü: **ŞAHIS** (karar verildi)

Kayıt gerçek kişi olarak yapılacak. Bu kararın dört somut sonucu var, üçü
lehine, biri takvimi belirliyor:

- **Türkiye dağıtıma DAHİL.** Kurumsal yolun KVK 10/1-g "münhasıran yurt dışına
  hizmet" şartı artık geçerli değil, dolayısıyla Türkiye'yi çıkarmak için bir
  sebep kalmadı. `store/*.md` bu karara göre güncellendi.
- **D-U-N-S numarası gerekmiyor** → Apple kaydı 1-3 hafta yerine 1-3 günde açılır.
- **Ad ve adres mağaza sayfasında görünür.** Play, gerçek kişi geliştiriciden
  herkese açık bir adres istiyor. Ev adresini yazmak istemiyorsan kayıttan
  **önce** bir sanal ofis/PTT kutusu adresi ayarla; sonradan değiştirmek
  doğrulamayı baştan tetikliyor.
- **Play'de 12 testçi × 14 gün kapalı test şartı var** (yeni gerçek kişi
  hesapları için, hesap başına tek sefer). Üretime çıkmadan önce 12 kişinin
  kapalı teste katılıp 14 gün **kesintisiz** kalması gerekiyor. Takvimi belirleyen
  madde budur → AŞAMA 1'de testçi toplamaya bugün başla.

> **Vergi:** GVK mük. 20/B ile %15 banka stopajı nihai vergi olur, 2026 sınırı
> 5.300.000 TL — aşarsan istisna geriye dönük tamamen kalkar. İstisnadan
> yararlanmak için uygulama gelirinin elektronik uygulama mağazaları üzerinden
> elde edilmesi ve kazancın istisna kapsamında beyan edilmesi gerekir.
> **Bu bir vergi tavsiyesi değil; ilk gelir gelmeden muhasebecinle teyit et.**

- Karar verildiği için **1-3 arası adımların hepsi yapılabilir**; hiçbiri beklemede değil.

---

## AŞAMA 0.3 · SAĞLIK UYGULAMASI OLMANIN GETİRDİKLERİ

Lull oyun değil; **Sağlık ve Fitness** kategorisinde. Bu üç şeyi değiştirir:

- [ ] **Kategori**: Play → Sağlık ve Fitness · App Store → Health & Fitness
- [ ] **Tıbbi sorumluluk reddi** mağaza açıklamasının içinde olmalı — yalnızca
      gizlilik sayfasında olması yetmez. Metinler `store/*.md` içinde hazır.
- [ ] **Sağlık iddiası yapma.** "Uykusuzluğu tedavi eder", "anksiyeteyi geçirir"
      gibi cümleler mağaza reddi sebebidir. "Gevşemene yardımcı olur" de.
- [ ] Apple, sağlık kategorisinde **App Review notunda** ne olduğunu açıkça
      sorabiliyor; not `store/app-store.md` içinde yazılı.
- [ ] Abonelik ürünlerini (`lull_plus_*`) **henüz oluşturma** — karşılığındaki
      özellikler yazılmadı. Boş abonelik satmak hem yanlış hem reddedilir.


## AŞAMA 1 — Hesaplar (paralel yürüt, bekleme süresi burada)

- [ ] Apple Developer Program kaydı (99 $/yıl) · organization ise D-U-N-S numarası
- [ ] Google Play Console kaydı (25 $ tek sefer)
- [ ] AdMob hesabı aç ve **ödeme profilini tamamla** (ad, adres, IBAN). Doğrulama
      PIN'i istenmez: kazanç 10 doları bulunca kendiliğinden postalanır, yani yayına
      değil yalnızca ödemeye engeldir.
- [ ] Apple: Agreements, Tax and Banking → Paid Apps sözleşmesi + banka + vergi formları (**W-8BEN-E** kurumsal / **W-8BEN** şahıs)
- [ ] Google Play: Ödemeler profili + vergi bilgileri
- [ ] `bash tools/extract-repo.sh ~/lull-game` ile kendi deposuna taşı, GitHub'a gönder
- [ ] GitHub → Settings → Pages → Source: `main` / `docs` → gizlilik sayfaları yayına girer
- [ ] Yayına giren adresi doğrula: `https://buraakkuss.github.io/kus-games/lull/privacy.html` açılıyor mu?
- [ ] Aynı sayfa **stilli** mi görünüyor? (Depoda `docs/.nojekyll` var; olmazsa Jekyll `_style.css` dosyasını yayınlamaz ve sayfalar çıplak HTML olarak açılır.)

### 1b · Play kapalı test grubu (ŞAHIS hesabın zorunlu şartı)

- [ ] **12 testçi bul** — arkadaş, aile, iş arkadaşı olabilir; hepsinin ayrı bir
      **Google hesabı** olması ve testi **kabul etmesi** gerekiyor
- [ ] Play Console → Test → Kapalı test → e-posta listesi oluştur (12+ kişi)
- [ ] Testçilere opt-in bağlantısını gönder, katıldıklarını **teyit et**
      (katılmayan sayılmıyor; sayı 12'nin altına düşerse 14 gün baştan başlar)
- [ ] 14 günü başlat ve **kesintisiz** tamamla
- [ ] **Takvimi belirleyen madde budur** — AdMob tarafında beklenecek bir şey yok

> **Sayılan şey kayıtlı kişi sayısı, oynama sayısı değil** — kimsenin her gün
> oynaması gerekmiyor, 14 gün listede kalması yeterli. Hazır davet mesajları ve
> pratik ayrıntılar: depo kökündeki `TESTCI-DAVETI.md`.

> Üç uygulama için ayrı ayrı değil, **hesap başına bir kez**. İlk oyunda tamamlarsan
> diğer ikisi doğrudan üretime çıkabilir.

---

## AŞAMA 2 — Reklam ve satın alma kimlikleri

- [ ] AdMob → Uygulama ekle (**Android**) → App ID'yi kopyala
- [ ] AdMob → Uygulama ekle (**iOS**) → App ID'yi kopyala
- [ ] Her iki uygulama için **Interstitial** ve **Rewarded** reklam birimi oluştur (4 kimlik)
- [ ] `app.config.json` → `admob.real` alanlarını doldur, `useTest: false` yap
- [ ] `bash tools/set-identity.sh` çalıştır
- [ ] `native/android.md` adım 3'teki Manifest `APPLICATION_ID` satırını gerçek kimlikle değiştir
- [ ] `native/ios.md` adım 5'teki `GADApplicationIdentifier` satırını gerçek kimlikle değiştir
- [ ] Play Console → Ürünler → Uygulama içi ürünler → `remove_ads` (tek seferlik, ~2,99 $)
- [ ] App Store Connect → Uygulama içi satın alma → `remove_ads` (**Non-Consumable**, aynı fiyat)
- [ ] `node tools/check.js` → "Hata yok, 0 uyarı" görmeden devam etme

---

## AŞAMA 3 — Derleme

- [ ] `npm install`
- [ ] `npx cap add android && npx cap add ios && npx cap sync`
- [ ] `native/android.md` adımlarını uygula (simgeler, Manifest, imza anahtarı, versionCode)
- [ ] **İmza anahtarını (`lull-release.jks`) ve parolasını yedekle.** Kaybedersen uygulamayı bir daha güncelleyemezsin.
- [ ] `native/ios.md` adımlarını uygula (Info.plist, In-App Purchase capability, sadece iPhone, portrait)
- [ ] Gerçek Android cihazda test: reklam "Test Ad" etiketiyle gelmeli, `remove_ads` satın alınabilmeli
- [ ] Gerçek iPhone'da test: ATT istemi çıkmalı, reddedince uygulama sorunsuz çalışmalı
- [ ] Ödüllü reklam → "Continue" gerçekten devam ettiriyor mu?
- [ ] Uçak modunda aç: uygulama oynanabilmeli (offline vaadi mağaza metninde yazıyor)
- [ ] Küçük ekranda (SE) ve büyük ekranda (Pro Max) ölüm hattı ve çengeller görünüyor mu?

---

## AŞAMA 4 — Mağaza gönderimi

### Google Play
- [ ] Uygulama oluştur → ad: `Lull: One Tap Swing`
- [ ] Mağaza girişi: `store/google-play.md` içindeki metinleri yapıştır
- [ ] Grafikler: `assets/icon-512.png`, `assets/feature-graphic-1024x500.png`, `assets/screenshots/android-*.png`
- [ ] Veri güvenliği formu: `store/data-safety.md`
- [ ] İçerik derecelendirme: `store/content-rating.md`
- [ ] Hedef kitle: **13+** (13 yaş altını seçme)
- [ ] Reklam içeriyor: **Evet**
- [ ] Kategori: Health & Fitness
- [ ] Ülkeler: **Türkiye dahil tüm ülkeler** (şahıs hesabında kısıt yok)
- [ ] AAB yükle → Kapalı test → sonra Üretim

### App Store
- [ ] App Store Connect → Yeni uygulama → bundle id `com.kusgrup.lull`
- [ ] Metinler: `store/app-store.md`
- [ ] Ekran görüntüleri: `assets/screenshots/ios67-*.png` (6.7")
- [ ] App Privacy: `store/app-privacy.md`
- [ ] IDFA beyanı: **Yes → Serve advertisements within the app**
- [ ] App Review notlarını yapıştır (`store/app-store.md`) — kontrol şeması ilk paragrafta
- [ ] `remove_ads` ürününü **ilk sürümle birlikte** incelemeye gönder (yoksa 3.1.1 reddi gelir)
- [ ] GitHub → Actions → **iOS yayin** → uygulamayı seç → Run workflow
      (Mac gerekmez; imzalar, IPA üretir, App Store Connect'e yükler.
      Önce dört Apple secret'ı girilmiş olmalı — `native/ios.md` bölüm 6)
- [ ] Build işlendikten sonra (5-30 dk) sürüme ekle → Gönder

---

## AŞAMA 5 — İçerik (onay beklerken yap, boşa bekleme)

- [ ] Telefonda 6-8 dakika oyna, ekran kaydı al (`marketing/tiktok-reels.md` adım listesi)
- [ ] 15 videoyu CapCut'ta kes
- [ ] TikTok + Instagram hesaplarını aç, bio'ya link koy
- [ ] İlk gün 2 TikTok + 1 Reels + 2 story (takvim `marketing/tiktok-reels.md` sonunda)
- [ ] Her videoya kendi sabit yorumunu at


---

## AŞAMA 6 — Yayın sonrası ilk 14 gün

- [ ] Gün 1-3: yorumların hepsine cevap ver (ilk saat en kritik)
- [ ] Gün 7: Play Console → İstatistikler → **1. gün elde tutma** oranına bak
- [ ] Gün 14 kararı:
  - D1 > **%30** ve ortalama oturum > 3 dk → **büyüt** (yeni şekil, günlük hedef, içerik dalgası)
  - D1 < **%20** → **dur**, içerik üretmeyi kes, sıradaki oyuna geç (uygulama mağazada kalsın)
- [ ] Bir video 100 bin izlenmeyi geçerse 72 saat içinde güncelleme çıkar

---

## Yayından önce son kontrol

```bash
node tools/check.js
```

| Kontrol | Neden önemli |
|---|---|
| `useTest: false` | Test kimliğiyle yayına çıkarsan **hiç gelir olmaz** |
| Kodda `3940256099942544` kalmamalı | Gerçek hesapla test reklamına tıklarsan AdMob hesabın kapanır |
| Gizlilik URL'si açılıyor | Her iki mağaza da erişilemeyen URL'yi reddeder |
| `versionCode` artırıldı | Aynı numarayla ikinci kez yükleme yapılamaz |
| İmza anahtarı yedeklendi | Kaybı geri dönüşü olmayan tek hatadır |
| Self-test 3 modda da yeşil | `deaths=0` ve `fallback=0` olmalı: yapay oyuncu ölüyorsa üretim adaletsiz, fallback varsa doğrulanmamış çengel konulmuş |

## Bilinen riskler (dürüst liste)

1. **İsim.** "Lull" yaygın bir İngilizce kelime (dinginlik, uyutmak). Kumar çağrışımı
   yok ama **mağaza aramasında kaybolabilir** ve aynı adla yayınlanmış başka bir
   uygulama olabilir. Çözüm: mağaza adı `Lull: Breathe Yourself Down`. Gönderimden
   önce her iki mağazada "lull" aramasını kendin yap.
2. **İlk uygulama incelemesi uzun sürer.** Apple'da ilk gönderim 1-3 gün, bazen daha fazla.
3. **AdMob ödeme eşiği 100 $.** Altında ödeme yapılmaz, birikir.
4. **Sağlık kategorisi incelemeyi sıkılaştırır.** Tıbbi iddia içermediğinden emin ol;
   metinler `store/*.md` içinde buna göre yazıldı.
5. **Abonelik ürünleri henüz boş.** `lull_plus_*` karşılığındaki özellikler yazılmadan
   mağazada oluşturulmamalı.
