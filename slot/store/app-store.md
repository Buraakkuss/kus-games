# App Store Connect — mağaza girişi (kopyala-yapıştır)

> **Önce oku:** App Store araması ve inceleme ekibi için de "Slot" tek başına
> kumar çağrışımı yapar. Ad ve alt başlık bunu ilk satırda çözüyor, App Review
> notlarında da açıkça yazılı. Keywords listesine casino/slots/bet **koyma**.

## Name (max 30)
```
Slot: Fit the Shape
```

## Subtitle (max 30)
```
One tap reflex, no luck
```

## Promotional text (max 170, sürüm göndermeden değiştirilebilir)
```
One tap turns you 90 degrees. The wall already knows which way it wants you. Finish the turn before it arrives and the fit counts CLEAN — double points.
```

## Description (max 4000)
```
Slot is a one-touch reflex game with a single rule: be the right shape at the right moment.

You are a shape, fixed near the bottom of the screen. Walls fall towards you. Every wall has a hole cut in exactly your shape — but turned to a different angle. One tap turns you 90 degrees. Line up before the wall arrives and you slide straight through. Get it wrong and you shatter.

NOT A GAMBLING GAME
There is no slot machine, no wheel, no cards, no coins and no chance of any kind. "Slot" is the shaped opening you have to fit through. Every death is your own timing.

HOW IT WORKS
• One tap = 90 degrees clockwise. That is the whole control scheme.
• The turn takes a moment, so you have to start it early.
• A square fits any way up. A bar has two answers. A T shape has only one.
• Finish the turn before contact and the fit counts CLEAN — double points.
• Pick EASY, NORMAL or HARD from the menu. Each one keeps its own best score.

IT GETS MEANER
• Walls come faster and the gaps between them shrink.
• Shapes lose their symmetry, so one tap is no longer enough — you need three in a row.
• Later walls cut decoy holes to pull your eye to the wrong angle.
• Double walls stack two layers with different angles: fit, turn, fit again.

BUILT TO RESPECT YOU
• Three difficulty modes — EASY draws a ghost of the angle you need and forgives near misses, HARD forgives nothing.
• Works fully offline. No internet needed to play.
• No account. No sign-up. No e-mail. No social login.
• No forced videos between every run.
• One optional purchase removes ads forever. No subscriptions, no coins, no energy timers, no loot boxes.
• Tiny download, runs on old devices.

Free to play. Rewarded video is optional and only appears if you choose to continue a run.

How many walls can you fit through before your fingers fall behind?
```

## Keywords (max 100 karakter, virgülle, boşluksuz)
```
shape,fit,rotate,onetap,reflex,timing,arcade,endless,tap,minimal,offline,hypercasual,puzzle
```
> Dikkat: `slot`, `slots`, `casino`, `spin` gibi kelimeleri anahtar kelime olarak **kullanma**.
> Uygulama adı zaten "Slot" içeriyor; kumar kelime kümesine girmenin tek sonucu yanlış kitle ve inceleme sorusu olur.

## URL'ler
- Support URL: `https://kusgrupgames.github.io/slot/support.html`
- Marketing URL: `https://kusgrupgames.github.io/slot`
- Privacy Policy URL: `https://kusgrupgames.github.io/slot/privacy.html`

## Kategori ve derecelendirme
- Primary: **Games → Arcade**, Secondary: **Games → Puzzle**
- Age rating: **4+** (şiddet yok, korku yok, kumar yok, kullanıcılar arası etkileşim yok)
- Copyright: `2026 <mağaza hesabındaki ad>`

## Görseller
| Alan | Dosya | Ölçü |
|---|---|---|
| App Icon | `assets/icon-1024.png` | 1024×1024, **alfa kanalı yok** (doğrulandı) |
| iPhone 6.7" | `assets/screenshots/ios67-*.png` | 1290×2796, 5 adet |

> Uygulama **sadece iPhone** olarak ayarlanmalı (Xcode → General → Supported Destinations'tan iPad'i kaldır). Aksi halde App Store ayrıca iPad ekran görüntüsü ister.

## App Review notları
```
"Slot" here means the shaped opening the player must pass through. The app contains NO gambling, no simulated gambling, no slot machine, no wheel, no cards, no virtual currency and no element of chance. It is a reflex game: one tap rotates the player's shape by 90 degrees, and the shape must match the hole in the falling wall.

No account or login is required. All features are immediately available.

In-app purchase: "remove_ads" (non-consumable) removes interstitial advertising. It can be tested with a sandbox account; there is also a "Restore purchase" option under Menu -> i.

Ads: Google AdMob. Rewarded video is optional and user-initiated (the "Watch ad, continue" button after a run ends).

The app uses App Tracking Transparency; declining the prompt is fully supported and results in non-personalised ads.
```

## App Store Connect form cevapları
| Soru | Cevap |
|---|---|
| Does this app use the Advertising Identifier (IDFA)? | **Yes** → "Serve advertisements within the app" işaretle |
| Gambling / contests | **Hayır** — hiçbir kutucuk işaretlenmez |
| Export compliance (şifreleme) | **Hayır** — `ITSAppUsesNonExemptEncryption = false` Info.plist'te ayarlı, her yüklemede soru sorulmaz |
| Content rights | Uygulama üçüncü taraf içerik içermiyor |
| Sign in with Apple gerekli mi? | Hayır (hiçbir giriş yöntemi yok) |
| App Privacy (nutrition label) | `store/app-privacy.md` |
| Fiyat | Ücretsiz + IAP |
| Ülke dağıtımı | **Tüm ülkeler, Türkiye dahil** (şahıs hesabı — kısıt yok) |
