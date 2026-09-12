# Hesap açma kiti — tek oturumda bitir

Bu üç kayıt **senin kimliğinle, bizzat** yapılır; devredilemez. Ama hazırlıklı
girersen 40 dakikada biter. Sıra önemli: **AdMob'u ilk yap**, çünkü posta ile
gelen PIN 2-4 hafta bekletiyor ve o süre diğer işlerle paralel akmalı.

## Başlamadan önce masada olsun

- [ ] Kimlik (kendin için, kimseye göndermeden — sadece doğrulama ekranına)
- [ ] Kredi/banka kartı (Apple 99 $/yıl, Play 25 $ tek sefer)
- [ ] **IBAN** ve banka adı (AdMob ödemeleri için)
- [ ] Fatura/ikamet adresi — AdMob PIN'i **bu adrese** postalanacak, doğru yaz
- [ ] Vergi durumu kararı: şahıs mı, KUŞ GRUP Ltd mi
      (fark ve gerekçe: `slot/LAUNCH-CHECKLIST.md` AŞAMA 0)

---

## 1) AdMob — ÖNCE BU (10 dk + 2-4 hafta posta)

1. admob.google.com → Google hesabınla giriş
2. Ülke: Türkiye · Saat dilimi · Para birimi seç (**para birimi sonradan değişmez**)
3. Ödemeler → **Ödeme adresini doğrula → PIN iste** ← *asıl amaç bu, atlamadan yap*
4. Vergi bilgileri: şahıssan **W-8BEN**, şirketse **W-8BEN-E**
5. Uygulama ekle → **Android** ve **iOS** için ayrı ayrı, üç oyun için altı kayıt:

| Oyun | Android app | iOS app | Reklam birimleri |
|---|---|---|---|
| Slot | com.kusgrup.slot | com.kusgrup.slot | Interstitial + Rewarded |
| Latch | com.kusgrup.latch | com.kusgrup.latch | Interstitial + Rewarded |
| Orbita | com.kusgrup.orbita | com.kusgrup.orbita | Interstitial + Rewarded |

> Uygulamalar henüz mağazada olmadığı için "Hayır, yayında değil" seçeneğini işaretle.
> Her uygulama için **App ID** + **Interstitial ID** + **Rewarded ID** üretilecek:
> oyun başına 6, toplam **18 kimlik**. Hepsini bana ver, dosyalara ben yazarım.

## 2) Google Play Console (15 dk + 1-2 gün doğrulama)

1. play.google.com/console → **25 $** tek seferlik ödeme
2. Hesap türü: şahıs / kuruluş (AŞAMA 0 kararın)
3. Kimlik doğrulama: kimlik yükleme + adres belgesi istenebilir
4. Ödemeler profili + vergi bilgileri
5. Uygulama oluştur (üç kez) — adlar:
   - `Slot: Fit the Shape`
   - `Latch: One Tap Swing`
   - `Orbita: One Tap Orbit Jump`

## 3) Apple Developer (20 dk + 1-3 gün, şirketse D-U-N-S 1-3 hafta)

1. developer.apple.com/programs → **99 $/yıl**
2. Şirketse önce **D-U-N-S numarası** al (ücretsiz, 1-3 hafta — şirket kararı verdiysen bunu da bugün başlat)
3. Kimlik doğrulama (Apple ID + iki adımlı doğrulama şart)
4. Agreements, Tax and Banking → **Paid Apps** sözleşmesi + banka + vergi formu
5. App Store Connect → yeni uygulama (üç kez), bundle id'ler yukarıdaki tabloda

---

## Her üç kayıtta da soracakları ortak bilgiler

| Alan | Değer |
|---|---|
| Destek e-postası | `t.burakkus@gmail.com` |
| Web sitesi | `https://buraakkuss.github.io/kus-games` |
| Gizlilik – Slot | `https://buraakkuss.github.io/kus-games/slot/privacy.html` |
| Gizlilik – Latch | `https://buraakkuss.github.io/kus-games/latch/privacy.html` |
| Gizlilik – Orbita | `https://buraakkuss.github.io/kus-games/orbita/privacy.html` |
| Kategori | Games → Arcade |
| Yaş hedefi | 13+ (13 yaş altını seçme) |
| Reklam içeriyor | Evet |
| Uygulama içi satın alma | Evet — `remove_ads`, tek seferlik, ~2,99 $ |

---

## Bittiğinde bana ver, gerisi bende

18 AdMob kimliğini gönder; ben `app.config.json` dosyalarına yazar,
`set-identity.sh` çalıştırır, `useTest`'i kapatır, `check.js` ile doğrularım.
Sonra imzalı AAB üretimi için 4 depo secret'ı kurarız ve mağaza gönderimine
geçeriz — metinler, görseller, form cevapları üç oyun için de hazır.

**Bana asla göndermen gerekmeyenler:** kimlik fotoğrafı, TC kimlik numarası,
kart bilgisi, IBAN, şifre, Apple/Google hesap parolası. Bunların hiçbiri
projenin hiçbir adımında gerekmiyor.
