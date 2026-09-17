# Google Play — Veri Güvenliği formu (kopyala-yapıştır)

Play Console → Politika → Uygulama içeriği → **Veri güvenliği**

## Ana soru

| Soru | Cevap |
|---|---|
| Uygulamanız kullanıcı verisi topluyor veya paylaşıyor mu? | **HAYIR** |

Form burada biter. Tek bir veri türü işaretlenmez.

## Neden "hayır"

Lull **hiçbir veri toplamaz**:

- Reklam SDK'sı **yok** → reklam kimliği (AD_ID) izni istenmiyor
- Analitik **yok**
- Hesap, giriş, e-posta **yok**
- Sunucu **yok** — gönderilecek bir yer bile bulunmuyor
- Seans geçmişi, ses tercihi ve seri sayısı yalnızca cihazdaki `localStorage`
  içinde durur; uygulama silinince onlar da gider

`tools/android-prepare.sh`, `app.config.json` içinde `admob.enabled: false`
olduğu için manifest'e **AD_ID iznini eklemez.** Bu önemli: reklam kimliği izni
beyan edip "veri toplamıyorum" demek Play'in doğrudan çelişki olarak işaretlediği
bir durumdur. İkisi tutarlı.

## Güvenlik uygulamaları
- [x] Veri aktarımda şifrelenir — *soru sorulmuyor çünkü aktarılan veri yok*
- [x] Kullanıcı veri silinmesini isteyebilir — uygulamayı silmek yeterli
- [ ] Bağımsız güvenlik denetiminden geçti — **hayır, işaretleme**

## İleride değişirse
Abonelik veya analitik eklenirse bu form **derhal** güncellenmelidir. Yanlış beyan,
uygulamanın mağazadan kaldırılma sebebidir.
