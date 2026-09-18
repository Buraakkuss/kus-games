# Seher — yayına çıkış listesi

Sırayla git. Solundaki kutu senin yapman gerekeni gösterir.
Yazılım tarafı bitti; kalan her şey hesap, imza ve gönderim işi — bunlar senin kimliğinle yapılır.

---

## AŞAMA 0 — İki karar (10 dakika)

### 0.1 · İsim kararı

Uygulamanın kod adı **Seher**, mağazalarda ad olarak
**`Seher: Namaz Vakti ve Kıble`** kullanılıyor (30 karakter sınırına sığıyor: 27).

- "Seher" tek başına aramada bulunmaz; kimse "seher" diye aramıyor. "namaz vakti",
  "ezan vakti", "kıble" diye arıyor. Ad, aranan kelimeyi içermek zorunda.
- Kategoride birinci sıradaki uygulamaların hepsi bunu yapıyor. Ad alanı,
  anahtar kelime alanının bir parçasıdır.
- **Hiçbir yerde bir kurumun resmî uygulaması olduğu izlenimi verme.** Diyanet,
  TDV, Vakıf gibi adları uygulama adında, alt başlıkta veya simgede kullanma;
  "Diyanet" yalnızca bir hesaplama **yönteminin** adı olarak geçebilir
  (`store/*.md` metinleri buna göre yazıldı). Bu, her iki mağazada da doğrudan
  kaldırma sebebidir ve marka hakkı sorunu doğurur.

### 0.2 · Hesap türü: **ŞAHIS** (karar verildi)

Kayıt gerçek kişi olarak yapıldı. Sonuçları:

- **Türkiye dağıtıma dahil.**
- **D-U-N-S numarası gerekmiyor** → Apple kaydı 1-3 günde açılır.
- **Ad ve adres mağaza sayfasında görünür.** Ev adresini yazmak istemiyorsan
  kayıttan **önce** bir sanal ofis/PTT kutusu adresi ayarla.
- **Play'de 12 testçi × 14 gün kapalı test şartı var** — yeni gerçek kişi
  hesapları için, **hesap başına tek sefer**. Bu şart Lull ile yürütülüyorsa
  Seher doğrudan üretime çıkabilir; yürütülmediyse takvimi belirleyen madde budur.

> **Vergi:** GVK mük. 20/B ile %15 banka stopajı nihai vergi olur, 2026 sınırı
> 5.300.000 TL — aşarsan istisna geriye dönük tamamen kalkar. **Bu bir vergi
> tavsiyesi değil; ilk gelir gelmeden muhasebecinle teyit et.**

---

## AŞAMA 1 — Hesaplar (paralel yürüt, bekleme süresi burada)

- [ ] Apple Developer Program kaydı (99 $/yıl)
- [ ] Google Play Console kaydı (25 $ tek sefer)
- [ ] AdMob hesabı aç ve **ödeme profilini tamamla** (ad, adres, IBAN)
- [ ] Apple: Agreements, Tax and Banking → Paid Apps sözleşmesi + banka + **W-8BEN**
- [ ] Google Play: Ödemeler profili + vergi bilgileri
- [ ] GitHub → Settings → Pages → Source: `main` / kök → sayfalar yayına girer
- [ ] `https://kusgrupgames.github.io/seher/privacy.html` açılıyor mu?
- [ ] Aynı sayfa **stilli** mi görünüyor? (`docs/.nojekyll` olmazsa Jekyll `_style.css`
      dosyasını yayınlamaz ve sayfalar çıplak HTML olarak açılır.)
- [ ] `https://kusgrupgames.github.io/seher/play/` — uygulamayı tarayıcıda dene

### 1b · Play kapalı test grubu (yalnız daha önce yapılmadıysa)

- [ ] **12 testçi bul** — hepsinin ayrı bir **Google hesabı** olmalı ve testi kabul etmeli
- [ ] Play Console → Test → Kapalı test → e-posta listesi (12+ kişi)
- [ ] Testçilere opt-in bağlantısını gönder, katıldıklarını **teyit et**
- [ ] 14 günü **kesintisiz** tamamla

> Sayılan şey kayıtlı kişi sayısı, kullanım sayısı değil. Hazır davet mesajları:
> depo kökündeki `TESTCI-DAVETI.md`.

---

## AŞAMA 2 — Reklam ve satın alma kimlikleri

- [ ] AdMob → Uygulama ekle (**Android**) → App ID'yi kopyala
- [ ] AdMob → Uygulama ekle (**iOS**) → App ID'yi kopyala
- [ ] Her iki uygulama için **Interstitial** ve **Rewarded** reklam birimi (4 kimlik)
- [ ] `app.config.json` → `admob.real` alanlarını doldur, `useTest: false` yap
- [ ] `bash tools/set-identity.sh`
- [ ] Play Console → Ürünler → Uygulama içi ürünler → `remove_ads` (tek seferlik, ~2,99 $)
- [ ] Play Console → Ürünler → **Abonelikler** → `seher_pro_aylik` (P1M) ve `seher_pro_yillik` (P1Y),
      ikisi de **temel planı yayınlanmış** olmalı — yayınlanmazsa uygulamada fiyat boş görünür
- [ ] App Store Connect → Uygulama içi satın alma → `remove_ads` (**Non-Consumable**)
- [ ] App Store Connect → **Abonelikler** → tek bir "Seher Pro" grubu içinde
      `seher_pro_aylik` ve `seher_pro_yillik` (**Auto-Renewable**)
- [ ] Her iki abonelik için açıklama alanına süre + otomatik yenileme + iptal yolu yaz
      (Apple 3.1.2 bunu şart koşuyor; uygulama içindeki metnin aynısı yeterli)
- [ ] `node tools/check.js` → "Hata yok, 0 uyarı" görmeden devam etme

---

## AŞAMA 3 — Derleme

- [ ] `npm install`
- [ ] `npx cap add android && npx cap add ios && npx cap sync`
- [ ] `bash tools/android-prepare.sh` (simgeler, Manifest, izinler, sürüm, imzalama)
- [ ] `bash tools/ios-prepare.sh` (Info.plist, simge, sadece iPhone, portrait, iOS 15)
- [ ] **İmza anahtarını (`seher-release.jks`) ve parolasını yedekle.** Kaybedersen
      uygulamayı bir daha güncelleyemezsin.

### Gerçek cihazda sınanacaklar (bunlar emülatörde görünmez)

- [ ] **Uçak modunda aç:** vakitler, kıble ve zikirmatik çalışmalı. Mağaza metnindeki
      "internetsiz çalışır" vaadi budur.
- [ ] **Konum iznini REDDET:** uygulama çalışmaya devam etmeli, şehir listesinden
      seçim yapılabilmeli. (App Review bunu dener.)
- [ ] **Bildirim:** bir vakti aç, saatini birkaç dakika sonrasına düşürecek şekilde
      dakika düzeltmesi ver, bildirimin geldiğini gör. Android'de ayrıca
      **pil optimizasyonu açıkken** dene.
- [ ] **Bildirim simgesi** beyaz kare değil, hilal görünmeli (`ic_stat_seher`).
- [ ] **Pusula:** gerçek cihazda dön; açı değişmeli, kıbleye dönünce titremeli.
      Pusulası olmayan cihazda kadran sabit kalmalı ama açı yazılı olmalı.
- [ ] **iOS titreşim:** `navigator.vibrate` iOS'ta yoktur; Haptics üzerinden
      titremeli. Titremiyorsa `buzz()` fonksiyonuna bak.
- [ ] **Reklam kapısı:** vakti birkaç dakika sonraya ayarla, sekmeler arasında gez —
      reklam **gelmemeli**. Bu ürünün en önemli davranışıdır.
- [ ] `remove_ads` satın alınabilmeli; satın alınca reklam tamamen kesilmeli;
      "Satın almayı geri yükle" çalışmalı.
- [ ] **Abonelik ekranı**: fiyatlar mağazadan gelmeli ("fiyat mağazadan alınıyor" yazısı
      kalıyorsa ürün mağazada yayınlanmamış demektir). Aylık ve yıllık ayrı ayrı denenmeli.
- [ ] Pro satın alınca kilitli kartlar ve dersler **anında** açılmalı, uygulama yeniden
      başlatılmadan.
- [ ] **Kart paylaşımı**: gerçek cihazda Paylaş → WhatsApp ve Instagram listede çıkmalı,
      giden görsel 1080x1350 ve köşesinde Seher işareti olmalı.
- [ ] **Kaydet**: dosyalara yazmalı ve "kaydedildi" bildirimi gelmeli.
- [ ] Küçük ekranda (SE) ve büyük ekranda (Pro Max) yerleşim taşmıyor mu?
- [ ] Gece yarısını geç: liste yeni güne dönmeli, geri sayım yarının imsakını göstermeli.

---

## AŞAMA 4 — Mağaza gönderimi

### Google Play
- [ ] Uygulama oluştur → ad: `Seher: Namaz Vakti ve Kıble`
- [ ] Mağaza girişi: `store/google-play.md` metinleri
- [ ] Grafikler: `assets/icon-512.png`, `assets/feature-graphic-1024x500.png`,
      `assets/screenshots/android-*.png`
- [ ] Veri güvenliği formu: `store/data-safety.md` (**konum ve reklam kimliği "Evet"**)
- [ ] Reklam kimliği beyanı: **Evet** · Reklam içeriyor: **Evet**
- [ ] İçerik derecelendirme: `store/content-rating.md` — abonelik olduğu için
      "dijital satın alma" sorusuna **evet**
- [ ] Hedef kitle: **13+**
- [ ] Kategori: **Yaşam Tarzı**
- [ ] Ülkeler: **Türkiye dahil tüm ülkeler**
- [ ] AAB yükle → (gerekiyorsa Kapalı test) → Üretim

### App Store
- [ ] App Store Connect → Yeni uygulama → bundle id `com.kusgrup.seher`
- [ ] Metinler: `store/app-store.md`
- [ ] Ekran görüntüleri: `assets/screenshots/ios69-*.png` (6.9") ve `ios65-*.png` (6.5") — altı kare
- [ ] App Privacy: `store/app-privacy.md` — **konum: kaba, izleme: evet**
- [ ] IDFA beyanı: **Yes → Serve advertisements within the app**
- [ ] App Review notlarını yapıştır (`store/app-store.md` sonunda)
- [ ] **"Sign-in required" kutusunu İŞARETLEME** — uygulamada hesap yok
- [ ] `remove_ads` ürününü **ilk sürümle birlikte** incelemeye gönder (yoksa 3.1.1 reddi)
- [ ] **AB Dijital Hizmetler Yasası tacir beyanı** — doldurulmadan AB'de dağıtılmaz
- [ ] GitHub → Actions → **iOS yayin** → `seher` → Run workflow
      (Mac gerekmez; imzalar, IPA üretir, App Store Connect'e yükler.
      Dört Apple secret girilmiş olmalı — `native/ios.md`)
- [ ] Build işlendikten sonra (5-30 dk) sürüme ekle → Gönder

---

## AŞAMA 5 — İçerik (onay beklerken yap, boşa bekleme)

- [ ] Telefonda ekran kaydı al (`marketing/tiktok-reels.md` çekim listesi)
- [ ] Videoları kes, `marketing/` içindeki metinleri kullan
- [ ] TikTok + Instagram hesaplarını aç, bio'ya link koy
- [ ] İlk gün 2 TikTok + 1 Reels + 2 story (takvim `marketing/tiktok-reels.md` sonunda)
- [ ] `marketing/hashtags.md` içindeki **yasak liste**ye uy — dinî içerikte en küçük
      abartı bile geri teper

---

## AŞAMA 6 — Yayın sonrası ilk 14 gün

- [ ] Gün 1-3: yorumların hepsine cevap ver. **"Vakitler yanlış" yorumu en sık gelen
      yorumdur ve neredeyse her zaman temkin farkıdır.** Hazır cevap
      `docs/seher/support.html` içinde; kullanıcıyı dakika düzeltmesine yönlendir.
- [ ] Gün 7: Play Console → İstatistikler → **1. gün elde tutma**
- [ ] Gün 14 kararı:
  - D1 > **%35** → büyüt (widget, aylık imsakiye, ezan sesi seçimi)
  - D1 < **%20** → dur, içerik üretmeyi kes (uygulama mağazada kalsın)
- [ ] Ramazan yaklaşırken güncelle: bu kategorinin indirmesi Ramazan'da katlanır,
      güncellemeyi **Ramazan'dan üç hafta önce** yayınla.

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
| Self-test yeşil | Vakit sıralaması, dakika düzeltmesi ve reklam kapısı sınanır |
| `docs/seher/play/index.html` güncel | Tarayıcıda denenen sürüm, gönderilen sürümle aynı olmalı |

## Kur'an metni, meal, tefsir ve ses — içerik kaynağı kararı

Uygulamada şu an **mushaf metni, meal, tefsir, sözlük alıntısı ve kıraat sesi
YOKTUR.** Bu bir eksiklik değil, bilinçli bir karar: bunların hepsi başkasının
telifli eseridir ve izinsiz taşınırsa sonucu uygulamanın kaldırılmasıyla
sınırlı kalmaz, **geliştirici hesabının tamamı kapanabilir** — Slot, Latch,
Orbita ve Lull da o hesapta duruyor.

### Alınamayacak olan

| İçerik | Durum |
|---|---|
| Kur'an Yolu Meal ve Tefsiri | DİB yayını, **her hakkı saklıdır**, adı geçen bir heyetin eseri |
| kuran.diyanet.gov.tr üzerindeki meal/tefsir/sözlük metinleri | aynı şekilde telifli |
| Sitedeki kıraat kayıtları | hem icra hem yapım hakkı var |
| Diyanet'in elifba/tecvid anlatımı ve görselleri | telifli |
| Diyanet adı, logosu, sayfa tasarımı | ayrıca marka ve "resmî uygulama izlenimi" riski |

**Bir kurumun içeriğini taşımak, o kurumun uygulamasıymış izlenimi verir.**
Bu, App Store 5.2 ve Play "Impersonation / Intellectual Property" politikalarının
doğrudan kaldırma sebebidir.

### Alınabilecek olan (sırayla dene)

1. **Arapça mushaf metni — Tanzil Project (tanzil.net).**
   Şartı açık: *"Permission is granted to copy and distribute verbatim copies of
   the Quran text provided here, but changing the text is not allowed."* Kaynağın
   Tanzil olduğu belirtilmeli ve tanzil.net'e bağlantı verilmeli. Metin **hiç
   değiştirilmeden** taşınmalı.
2. **Meal.** Telifsiz bir meal yok sayılır; üç yol var:
   - DİB'e **yazılı izin başvurusu** (kurumun izin süreci vardır; eserin adı,
     kullanılacağı uygulama, ticari model ve atıf şekli yazılarak istenir),
   - hak sahibiyle doğrudan lisans anlaşması yapılabilen bir meal,
   - ya da meal hiç konmaz; uygulama "okuma ve öğrenme" aracı olarak kalır.
3. **Kıraat sesi ve kelime kelime takip (ok takip).** Kayıtların yeniden
   dağıtım izni okuyucudan/yapımcıdan alınmalı. Kelime zamanlaması olmadan
   "ok takip" yapılamaz; zamanlama verisi de ayrı bir kaynaktır.
4. **Quran Foundation API (api-docs.quran.foundation).** Kayıt ve uygulama
   kimliği gerekiyor; şartları başvuru sırasında okunmalı. Çevrimiçi çalışır —
   uygulamanın "internetsiz" vaadiyle çelişmemesi için bu bölüm ayrı tutulmalı.

- [ ] Hangi yolun seçileceğine karar ver (izin başvurusu / lisans / hiç koyma)
- [ ] Seçilen kaynağın lisans metnini `seher/store/` altına kaydet
- [ ] Atıf cümlesini uygulama içine ve `docs/seher/terms.html` içine ekle
- [ ] İzin yazısı gelmeden **tek satır** metin taşıma

> Bu arada uygulamanın **kendi** öğrenme içeriği (elifba, tecvid, terim sözlüğü)
> tamamen özgün yazıldı ve hiçbir izne bağlı değil.

## Bilinen riskler (dürüst liste)

1. **"Vakitler yanlış" yorumları.** Kesin: gelecekler. Hesap doğru ama resmî
   takvimler temkin payı ekliyor. Savunma iki katmanlı: dakika düzeltmesi
   (tek dokunuşluk temkin ön ayarı dahil) ve her yerde yazılı açıklama.
   Yorumu düzeltmeye çalışma, ayarı göster.
2. **Kurum izlenimi vermek.** Uygulama adında, simgesinde veya ekran
   görüntülerinde bir kurumun adını/logosunu kullanmak doğrudan kaldırma sebebi.
   Şu an hiçbirinde yok; öyle kalsın.
3. **Bildirimler Android'de üretici kısıtlarına takılır.** Xiaomi, Huawei, Oppo,
   Samsung agresif şekilde arka plan alarmlarını keser. Destek sayfasında adım
   adım anlatılıyor; yorumlarda bu bağlantıyı ver.
4. **Kutup bölgeleri.** Yüksek enlemlerde fecir/yatsı astronomik olarak oluşmaz;
   uygulama `--:--` gösterir. Sayı uydurmak yanlış olurdu. Bu bir hata değil,
   `terms.html` madde 3'te yazılı.
5. **AdMob ödeme eşiği 100 $.** Altında ödeme yapılmaz, birikir.
6. **Telifli içerik taşıma isteği.** En büyük hukuki risk bu. Bir kurumun
   meal/tefsir metnini "nasılsa herkes kullanıyor" diyerek almak, hesabın
   tamamını riske atar. Yukarıdaki bölüm bunun yolunu yazıyor.
7. **Rekabet çok yoğun.** Kategoride on milyon indirmeli uygulamalar var. Ayrışma
   noktan üç şey: internetsiz çalışması, vakitte reklam göstermemesi ve
   kendi takvimine dakika dakika oturtulabilmesi. Mağaza metninde bu üçünü öne çıkar.
