# Google Play — mağaza metinleri (Seher v1.0.0)

Play Console → Ana mağaza girişi. Alanlar aşağıda birebir kopyalanacak şekilde yazıldı.

## Uygulama adı (30 karakter sınırı)

```
Seher: Namaz Vakti ve Kıble
```
(27 karakter)

## Kısa açıklama (80 karakter sınırı)

```
Namaz vakitleri, kıble pusulası ve zikirmatik. İnternetsiz çalışır.
```
(66 karakter)

## Tam açıklama (4000 karakter sınırı)

```
Seher; namaz vakitlerini, kıble yönünü ve zikir sayacını tek bir sade ekranda toplar. Vakitler telefonunda hesaplanır — bir sunucuya bağlanmaz, internet gerektirmez. Uçakta, bodrumda, yurt dışında hattın yokken de çalışır.

SIRADAKİ VAKTE GERİ SAYIM
Ana ekranda bir sonraki vaktin adı, saati ve kalan süre saniye saniye görünür. İlerleme çubuğu, içinde bulunduğun vaktin ne kadarının geçtiğini gösterir.

GÜNÜN ALTI VAKTİ
İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı. İçinde bulunduğun vakit listede işaretlidir.

VAKİT BİLDİRİMLERİ
Her vakit için bildirimi ayrı ayrı açıp kapatabilirsin. Bildirimler cihazında planlanır; internet olmadan da gelir.

KIBLE PUSULASI
Bulunduğun yerden Kâbe'ye giden en kısa yolun açısı ve Kâbe'ye uzaklığın. Telefonu doğru yöne çevirdiğinde kısa bir titreşimle haber verir. Pusulası olmayan cihazlarda açı yine yazılıdır.

ZİKİRMATİK
33, 99 veya sınırsız hedef. Halka ilerledikçe dolar, hedefe ulaşınca titrer. Sayaç uygulamayı kapatsan da yerinde durur.

TEBRİK KARTLARI
Kandil, bayram, arefe, Hicri yılbaşı, aşure ve cuma için 150'den fazla hazır kart. Seç, önizle, WhatsApp veya Instagram'dan paylaş. Kartlar telefonunda çizilir; internet gerekmez.

KUR'AN ELİFBASI
Harfler, harekeler ve okuma alıştırmaları; her ders küçük bir alıştırmayla biter, ilerlemen kayıtlı kalır.

30 GÜNLÜK LİSTE
Önümüzdeki otuz günün altı vakti tek ekranda. Ramazan'da imsakiye yerine geçer; yazdırmaya gerek yok, internetsiz açılır.

ESMÂÜ'L-HÜSNÂ
Doksan dokuz ismin okunuşu ve Türkçe anlamı.

KENDİ TAKVİMİNE OTURTABİLİRSİN
Yedi hesaplama yöntemi: Diyanet, Müslüman Dünya Birliği, ISNA, Mısır, Karaçi, Ümmü'l-Kurâ, Tahran. İkindi için Şâfiî veya Hanefî gölge oranı.

Resmî takvimlerle birkaç dakika fark görebilirsin: kurumlar hesaba "temkin" adı verilen bir güvenlik payı ekler ve bu pay bölgeden bölgeye değişir. Seher'de her vakti dakika dakika kendin ayarlayabilir, bölgenin resmî takvimiyle birebir oturtabilirsin. Tek dokunuşluk bir temkin ön ayarı da var.

ÖNEMLİ
Seher bir hesaplama aracıdır, dinî bir otorite değildir. Vakitler; verdiğin konuma, seçtiğin yönteme ve cihazının saatine göre hesaplanır. Bağlayıcı olan, bağlı olduğun kurumun ya da camiinin takvimidir; Seher'i ona göre ayarlayabilirsin.

GİZLİLİK
Hesap yok, kayıt yok, giriş yok. Konumun vakitleri hesaplamak için telefonunda kullanılır ve bizim tarafımızdan hiçbir yere gönderilmez. Konum iznini hiç vermeden de kullanabilirsin: şehir listesinden seç ya da koordinatı elle yaz.

REKLAMLAR VE SEHER PRO
Uygulama ücretsizdir ve ara ara tam ekran reklam gösterir. Vakte on dakikadan az kalmışken reklam gösterilmez; kıble pusulası ve zikirmatik açıkken de gösterilmez.

Seher Pro (aylık veya yıllık abonelik) kilitli tebrik kartlarının tamamını ve elifbanın bütün derslerini açar, reklamları kaldırır. Yalnızca reklamları kaldırmak isteyenler için tek seferlik bir satın alma da vardır. Abonelik otomatik yenilenir; istediğin an Google Play hesabından iptal edebilirsin.

Boyutu küçük, hızlı açılır, arka planda çalışmaz, pilini yemez.
```

## Grafik varlıklar

| Alan | Dosya |
|---|---|
| Uygulama simgesi (512×512) | `assets/icon-512.png` |
| Öne çıkan grafik (1024×500) | `assets/feature-graphic-1024x500.png` |
| Telefon ekran görüntüleri | `assets/screenshots/android-1..6-1080x1920.png` |

## Kategori ve etiketler

- Kategori: **Yaşam Tarzı** (alternatif: Referans)
- Etiketler: namaz vakti, ezan, kıble, zikirmatik, esmaül hüsna, imsakiye, kandil mesajları, bayram tebriği, elifba
- Web sitesi: `https://kusgrupgames.github.io/seher/`
- Gizlilik politikası: `https://kusgrupgames.github.io/seher/privacy.html`
- E-posta: `kusgrupgames@gmail.com`

## Sürüm notları (v1.0.0)

```
İlk sürüm. Namaz vakitleri, geri sayım, vakit bildirimleri, 30 günlük liste, kıble pusulası, zikirmatik, Esmâü'l-Hüsnâ, tebrik kartları ve Kur'an elifbası. Tamamı internetsiz çalışır.
```

## Yayın öncesi

1. `app.config.json` içinde gerçek AdMob kimliklerini yaz ve `admob.useTest`'i `false` yap.
2. `bash tools/set-identity.sh`
3. `node tools/check.js` → hata yok.
4. `store/data-safety.md` ve `store/content-rating.md` formlarını doldur.
5. Hedef kitle: 13 yaş ve üzeri. Reklam içerir: **Evet**. Uygulama içi satın alma: **Evet**.
6. Play Console → Ürünler → **Abonelikler**: `seher_pro_aylik` (P1M) ve `seher_pro_yillik` (P1Y).
   Her ikisi de tek bir "Seher Pro" abonelik grubunda olmalı ve **temel plan** tanımlanmalı;
   plan yayınlanmazsa uygulamada fiyat boş görünür ve satın alma çalışmaz.
