# App Store — Uygulama Gizliliği ("App Privacy") formu (Seher)

App Store Connect → Uygulama → Uygulama Gizliliği. Cevaplar `docs/seher/privacy.html`
ile birebir aynıdır. Form ile uygulama çelişirse Apple sürümü reddeder.

## 1. Bu uygulama veri topluyor mu?

**Evet.** (Kendi sunucumuz yok; ancak uygulamaya gömülü Google AdMob veri topluyor
ve Apple, üçüncü taraf bileşenin topladığını da geliştiriciye yazdırır.)

## 2. Veri türleri

### Konum → Kaba Konum (Coarse Location)
- Toplanıyor: **Evet**
- Kullanım amaçları: **Üçüncü Taraf Reklamcılığı**, **Uygulama İşlevselliği**
- Kullanıcı kimliğine bağlı mı? **Evet** (reklamcılık için)
- İzleme için kullanılıyor mu? **Evet** (reklam bileşeni)

> Uygulamanın kendisi konumu yalnız cihazda kullanır ve dışarı vermez; bu satır
> AdMob'un IP üzerinden çıkardığı kaba konum içindir. **Hassas Konum toplanmaz.**

### Tanımlayıcılar → Cihaz Kimliği (Device ID)
- Toplanıyor: **Evet**
- Amaç: **Üçüncü Taraf Reklamcılığı**
- Kimliğe bağlı: **Evet** · İzleme: **Evet**

### Kullanım Verileri → Reklam Verileri
- Toplanıyor: **Evet**
- Amaç: **Üçüncü Taraf Reklamcılığı**
- Kimliğe bağlı: **Evet** · İzleme: **Evet**

### Satın Alımlar
- Toplanıyor: **Hayır** — satın alma ve abonelik tamamen App Store tarafından yürütülür,
  uygulama yalnız "etkin mi" bilgisini okur. Fatura, kart ve hesap bilgisi uygulamaya hiç gelmez.

### Kullanıcı İçeriği (paylaşılan kartlar)
- Toplanıyor: **Hayır** — kart cihazda çizilir, geçici bir dosyaya yazılır ve
  işletim sisteminin paylaşım penceresine verilir. Hangi kartın seçildiği, kime
  gönderildiği ve gönderilip gönderilmediği uygulamaya dönmez.

### İletişim Bilgileri, Kişiler, Kullanıcı İçeriği, Arama Geçmişi, Tanılama,
### Sağlık ve Fitness, Finansal Bilgiler, Hassas Veriler
- Hepsi: **Hayır**

> **Dinî inanç** Apple'ın "Hassas Bilgiler" tanımına girer. Uygulama bunu
> **toplamaz**: hangi vakitleri açtığın, ne saydığın ve uygulamayı ne sıklıkla
> açtığın hiçbir yere gönderilmez, bize ulaşmaz ve reklam bileşenine verilmez.

## 3. İzleme (App Tracking Transparency)

- Uygulama izleme yapıyor mu? → **Evet** (yalnız reklam bileşeni aracılığıyla)
- `NSUserTrackingUsageDescription` Info.plist içinde bulunmalı.
  `tools/ios-prepare.sh` bunu yazar; metin:
  `"Sana daha uygun reklamlar gösterebilmek için izin istiyoruz. Reddedersen uygulama aynı şekilde çalışır."`
- İzin reddedilirse uygulama tamamen çalışmaya devam eder; yalnız reklamlar
  kişiselleştirilmez.

## 4. Konum izni metni

`NSLocationWhenInUseUsageDescription`:
`"Namaz vakitlerini ve kıble yönünü bulunduğun yere göre hesaplamak için konumun kullanılır. Konumun cihazından çıkmaz. İstersen izin vermeden şehir listesinden de seçebilirsin."`

## 5. Yaş sınırı

**4+** — şiddet, müstehcenlik, kumar, korku ya da ilaç/alkol içeriği yoktur.
