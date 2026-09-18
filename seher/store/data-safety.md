# Google Play — Veri güvenliği formu (Seher)

Play Console → İlke → Uygulama içeriği → Veri güvenliği. Aşağıdaki cevaplar
uygulamanın gerçek davranışıyla birebir uyumludur; `docs/seher/privacy.html`
ile aynı şeyi söyler. Form ile uygulama çelişirse Play uygulamayı askıya alır.

## 1. Veri toplama ve paylaşma

**Uygulamanız kullanıcı verisi topluyor veya paylaşıyor mu?** → **Evet**
(Kendi sunucumuz yok, ama reklam bileşeni veri topluyor; Play bunu da "toplama" sayar.)

**Veriler aktarım sırasında şifreleniyor mu?** → **Evet**
**Kullanıcı veri silinmesini isteyebiliyor mu?** → **Evet** (uygulama verisini temizlemek
veya uygulamayı kaldırmak, cihazdaki her şeyi siler; bizde tutulan bir kayıt yoktur)

## 2. Toplanan veri türleri

### Konum → Yaklaşık konum
- Toplanıyor mu? **Evet**
- Paylaşılıyor mu? **Evet** (reklam bileşeni IP üzerinden kaba konum çıkarır)
- İsteğe bağlı mı? **İsteğe bağlı** — kullanıcı şehir seçebilir veya koordinat yazabilir
- Amaç: **Reklamlar veya pazarlama** (reklam bileşeni), **Uygulama işlevi** (vakit hesabı)
- Not: Uygulamanın kendisi konumu cihazdan çıkarmaz; hesap cihazda yapılır.

### Konum → Kesin konum
- Toplanıyor mu? **Hayır** — uygulama `enableHighAccuracy: false` ile kaba konum ister.

### Uygulama etkinliği → Uygulama içi arama geçmişi / diğer eylemler
- **Hayır**

### Uygulama bilgileri ve performansı → Kilitlenme günlükleri, tanılama
- **Hayır** (kendi çökme bildirimi bileşenimiz yok)

### Cihaz veya diğer kimlikler → Cihaz veya diğer kimlikler
- Toplanıyor mu? **Evet** (reklam kimliği — AdMob)
- Paylaşılıyor mu? **Evet**
- İsteğe bağlı mı? **Zorunlu** (ücretsiz sürümde; satın almayla tamamen kalkar)
- Amaç: **Reklamlar veya pazarlama**

### Kişisel bilgiler (ad, e-posta, adres, telefon)
- **Hayır** — hesap yok, giriş yok, form yok.

### Finansal bilgiler
- **Hayır** — satın alma tamamen Google Play tarafından yürütülür; uygulama kart
  bilgisine hiç dokunmaz.

### Sağlık ve fitness, Mesajlar, Fotoğraf ve video, Ses, Dosyalar, Takvim, Kişiler
- **Hayır** — bu izinlerin hiçbiri istenmez.

## 3. Reklam kimliği beyanı

Play Console → Uygulama içeriği → **Reklam kimliği**:
- Reklam kimliği kullanıyor mu? → **Evet**
- Amaç: **Reklamlar**
- `AndroidManifest.xml` içinde `com.google.android.gms.permission.AD_ID` izni bulunur
  (`tools/android-prepare.sh` ekler).

## 4. Reklam beyanı

Play Console → Uygulama içeriği → **Reklamlar**:
- Uygulama reklam içeriyor mu? → **Evet**

## 5. Hedef kitle

Play Console → Uygulama içeriği → **Hedef kitle ve içerik**:
- Hedef yaş aralığı: **13-15, 16-17, 18 ve üzeri**
- Çocuklara yönelik mi? → **Hayır** (Ailelere Yönelik programına girilmez)

## 6. Uygulama erişimi

Play Console → Uygulama içeriği → **Uygulama erişimi**:
- **Tüm işlevler kısıtlama olmadan kullanılabilir.** Giriş, hesap veya kod gerekmez.

## 7. Devlet destekli uygulama / finans / sağlık

Hiçbiri: **Hayır**. Uygulama bir hesaplama aracıdır; resmî bir kurumla bağlantısı yoktur
ve öyle bir izlenim vermez (mağaza metinlerinde "Diyanet" yalnız bir hesaplama
yönteminin adı olarak geçer, kurumla ortaklık iması yoktur).
