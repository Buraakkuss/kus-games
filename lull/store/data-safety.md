# Google Play — Veri Güvenliği formu (kopyala-yapıştır)

Play Console → Politika → Uygulama içeriği → **Veri güvenliği**

## Veri toplama

| Soru | Cevap |
|---|---|
| Uygulamanız kullanıcı verisi topluyor veya paylaşıyor mu? | **Evet** (yalnızca reklam SDK'sı nedeniyle) |
| Aktarım sırasında şifreleniyor mu? | **Evet** |
| Kullanıcı silinmesini isteyebilir mi? | **Evet** — destek e-postası üzerinden |

> Uygulamanın **kendisi** hiçbir veri toplamaz. Seans geçmişi, ses tercihi ve seri
> sayısı yalnızca cihazdaki `localStorage` içinde durur, hiçbir yere gönderilmez.
> "Evet" cevabının tek sebebi AdMob'dur.

## Toplanan veri türleri (AdMob kaynaklı)

| Tür | Toplanır | Paylaşılır | Amaç | Zorunlu mu |
|---|---|---|---|---|
| Uygulama etkileşimleri | ✔ | ✔ | Reklam, Analiz | Hayır — reklamsız sürüm satın alınabilir |
| Cihaz veya diğer kimlikler | ✔ | ✔ | Reklam | Hayır |
| Yaklaşık konum | ✖ | ✖ | — | — |
| Kişisel bilgiler (ad, e-posta) | ✖ | ✖ | — | — |
| **Sağlık ve fitness** | ✖ | ✖ | — | — |

> **Sağlık verisi işaretlenMEmeli.** Ölçülen nefes temposu cihazdan çıkmaz ve
> hiçbir yere yazılmaz. Apple Sağlık / Google Fit entegrasyonu **yoktur**.
> İleride eklenirse bu satır değişmeli.

## Güvenlik uygulamaları
- [x] Veri aktarımda şifrelenir
- [x] Kullanıcı veri silinmesini isteyebilir
- [ ] Bağımsız güvenlik denetiminden geçti — *hayır, işaretleme*
