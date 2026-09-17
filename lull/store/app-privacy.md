# App Store Connect — App Privacy formu (kopyala-yapıştır)

App Store Connect → Uygulama → **App Privacy** → Get Started

## 1. "Do you or your third-party partners collect data from this app?"
**Yes** — yalnızca AdMob nedeniyle. Uygulamanın kendisi veri toplamaz.

## 2. Toplanan veri türleri

| Kategori | Seç | Amaç | Kimliğe bağlı | İzleme |
|---|---|---|---|---|
| **Identifiers → Device ID** | ✔ | Third-Party Advertising | Hayır | **Evet** |
| **Usage Data → Advertising Data** | ✔ | Third-Party Advertising | Hayır | **Evet** |
| Health & Fitness | ✖ | — | — | — |
| Contact Info | ✖ | — | — | — |
| User Content | ✖ | — | — | — |
| Location | ✖ | — | — | — |

> **Health & Fitness işaretlenMEmeli.** Nefes temposu ölçülür ama cihazdan çıkmaz,
> HealthKit'e yazılmaz, hiçbir sunucuya gönderilmez. HealthKit ileride eklenirse
> bu form güncellenmelidir.

## 3. Tracking (ATT)
Kişiselleştirilmiş reklam açıkken **evet**. Uygulama ilk açılışta ATT iznini ister
(`NSUserTrackingUsageDescription` metni `tools/ios-prepare.sh` içinde yazılı).
Kullanıcı reddederse AdMob kişiselleştirilmemiş reklam gösterir; uygulama çalışmaya
devam eder.

## 4. Privacy Policy URL
```
https://buraakkuss.github.io/kus-games/lull/privacy.html
```
