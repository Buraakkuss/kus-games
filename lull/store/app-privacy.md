# App Store Connect — App Privacy formu (kopyala-yapıştır)

App Store Connect → Uygulama → **App Privacy** → Get Started

## Ana soru

| Soru | Cevap |
|---|---|
| "Do you or your third-party partners collect data from this app?" | **No** |

Sonuç: mağaza sayfasında **"Data Not Collected"** rozeti görünür. Bu rozet bu
kategoride gerçek bir satış argümanıdır — Calm ve Headspace'te yoktur.

## Neden "No"

- Reklam SDK'sı yok → **ATT izin istemi yok**, `NSUserTrackingUsageDescription`
  Info.plist'e eklenmiyor, SKAdNetwork listesi yok
- Analitik yok, hesap yok, sunucu yok
- Ölçülen nefes temposu cihazdan çıkmaz; **HealthKit'e yazılmaz**

`tools/ios-prepare.sh`, `admob.enabled: false` olduğu için bu anahtarların
hiçbirini eklemez. Beyan ile binary tutarlı.

## Privacy Policy URL (zorunlu alan)
```
https://kusgrupgames.github.io/lull/privacy.html
```

## İleride değişirse
HealthKit entegrasyonu eklenirse **Health & Fitness** işaretlenmeli ve
`NSHealthShareUsageDescription` / `NSHealthUpdateUsageDescription` yazılmalıdır.
Abonelik eklenirse "Purchases" bölümü doldurulur.
