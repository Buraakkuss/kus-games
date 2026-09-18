# Seher v1.0.0

Namaz vakitleri, kıble pusulası ve zikirmatik. Tek HTML dosyası + Capacitor ile
iOS ve Android. Mağazaya gönderilmeye hazır: uygulama, reklamlar, satın alma,
simgeler, ekran görüntüleri, gizlilik politikası, kullanım şartları, mağaza
metinleri ve içerik planı dahil.

## 30 saniyede dene
```bash
npx --yes serve www -l 5173     # sonra tarayıcıda http://localhost:5173
```
veya `www/index.html` dosyasına çift tıkla. Tarayıcıda da native derlemede de
aynı dosya çalışır; reklam ve satın alma köprüleri native değilse sessizce kapanır.

## Uygulama ne yapıyor

- **Sıradaki vakte geri sayım.** Vaktin adı, saati ve kalan süre saniye saniye;
  altında içinde bulunduğun vaktin ne kadarının geçtiğini gösteren bir çubuk.
- **Günün altı vakti** — İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı — ve her biri için
  ayrı ayrı açılıp kapanan bildirimler. Bildirimler cihazda, yedi gün ileriye planlanır.
- **Kıble pusulası.** Kâbe'ye giden büyük dairenin başlangıç açısı ve Kâbe'ye uzaklık.
  Doğru yöne dönünce bir kez titrer.
- **Zikirmatik.** 33, 99 veya sınırsız; ilerleme halkası ve hedefte titreşim.
- **30 günlük liste.** Önümüzdeki otuz günün altı vakti tek ekranda — Ramazan imsakiyesinin karşılığı.
- **Tebrik kartları.** 14 grup, 158 hazır kart: kandiller, iki bayram ve arefeleri,
  Ramazan başlangıcı, Kadir Gecesi, Hicri yılbaşı, aşure ve cuma. Kart telefonda
  çizilir, paylaşırken 1080×1350 üretilir, köşesinde küçük Seher işareti vardır.
- **Kur'an elifbası.** 14 ders: harfler, harekeler, cezm, şedde, tenvin, med ve
  okuma alıştırmaları; her ders küçük bir alıştırmayla biter.
- **Esmâü'l-Hüsnâ** — doksan dokuz ismin okunuşu ve Türkçe anlamı.

Vakitler **cihazda** hesaplanır: Jülyen günü → güneşin deklinasyonu ve zaman denklemi
→ istenen yükseklik açısı için saat açısı. Sunucu yok, internet yok, hesap yok.
Yedi hesaplama yöntemi (Diyanet, MWL, ISNA, Mısır, Karaçi, Ümmü'l-Kurâ, Tahran),
ikindi için Şâfiî/Hanefî gölge oranı ve vakit başına dakika düzeltmesi var.

### İki kasıtlı sınır

- **Kart metinlerinde âyet/hadis alıntısı yok.** Doğrulanmamış bir alıntıyı yüz
  binlerce kişiye dağıtmak bu üründe kabul edilemez; `check.js` tırnak içi alıntı
  arıyor ve bulursa hata veriyor.
- **Mushaf metni bu sürümde yok.** Elifba bölümü harfleri, harekeleri ve *üretilmiş*
  okuma hecelerini öğretir. Kur'an-ı Kerim metniyle dersler, doğrulanmış bir kaynakla
  birlikte sonraki sürümde eklenecek — motor hazır, veri yok.

> **Uygulama dinî bir otorite değil, bir hesaplama aracıdır.** Kurumların eklediği
> "temkin" payı bölgeye göre değiştiği için resmî takvimlerle birkaç dakika fark
> olabilir; dakika düzeltmesi tam da bunun içindir. Bu cümle arayüzde, mağaza
> metinlerinde ve `docs/seher/terms.html` madde 3'te yazılıdır — silme.

## Klasörler
| Klasör | İçerik |
|---|---|
| `www/index.html` | **Uygulamanın tamamı.** Tek dosya (~2600 satır), bağımlılık yok. Kart çizimi, dersler, reklam ve satın alma köprüleri içinde. |
| `app.config.json` | Kimlik bilgilerinin tek kaynağı (bundle id, e-posta, AdMob kimlikleri). |
| `assets/` | Simgeler, bildirim simgesi, açılış ekranı, öne çıkan grafik, 24 mağaza ekran görüntüsü — hepsi üretilmiş. |
| `../docs/seher/` | GitHub Pages ile yayına giren gizlilik/şartlar/destek sayfaları (EN + TR) ve tarayıcıda denenecek kopya. |
| `store/` | Play ve App Store metinleri, Veri Güvenliği, App Privacy ve yaş derecelendirme cevapları. |
| `native/` | Android ve iOS derleme adımları, kopyalanabilir Manifest/Info.plist parçaları. |
| `marketing/` | TikTok/Reels senaryoları, story planı, hashtag setleri, yayın takvimi. |
| `tools/` | Görsel üretici, doğrulama betiği, kimlik güncelleyici. |
| `LAUNCH-CHECKLIST.md` | **Sıfırdan yayına kadar sıralı liste. Buradan başla.** |
| `CLAUDE.md` | Mimari, kırmızı çizgiler ve tuzaklar. Kodda çalışmadan önce oku. |

## Komutlar
```bash
node tools/check.js          # yayın öncesi tek komutluk doğrulama (self-test dahil)
bash tools/gen.sh            # tüm simge ve mağaza görsellerini yeniden üret
bash tools/set-identity.sh   # app.config.json'daki kimliği her yere yaz
```

`node tools/check.js` yeşil değilse commit yok — bu kural `../CLAUDE.md` içinde yazılı.

## Test kipleri
| URL | Ne yapar |
|---|---|
| `www/index.html?selftest=1` | hesabı bilinen değerlerle sınar, arayüzü kurup DOM'u denetler, sonucu `document.title` içine yazar |
| `www/index.html?t=2026-06-21T13:00` | saati sabitler (mağaza kareleri ve testler için) |
| `www/index.html?shot=1&s=vakit` | mağaza karesi kompozisyonu (`tools/gen.sh` kullanır) |
