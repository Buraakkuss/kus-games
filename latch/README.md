# Latch v1.0.0

Tek dokunuşlu sarkaç oyunu. Tek HTML dosyası + Capacitor ile iOS ve Android.
Mağazaya gönderilmeye hazır: oyun, reklamlar, satın alma, simgeler, ekran görüntüleri,
gizlilik politikası, kullanım şartları, mağaza metinleri ve içerik planı dahil.

## 30 saniyede dene
```bash
npx --yes serve www -l 5173     # sonra http://localhost:5173
```
veya `www/index.html` dosyasına çift tıkla. **Boşluk tuşunu basılı tut** = ip at, bırak = fırla.

## Oyun nasıl çalışıyor
Havadasın. **Basılı tuttuğun sürece** en yakın çengele ip atılır ve sarkaç gibi savrulursun.
**Bıraktığın an** o anki hızınla teğet boyunca fırlarsın; gerisini yerçekimi halleder.
Salınım çemberinde beliren **altın yay** 45°'lik bırakma penceresidir: içinde bırakırsan
PERFECT, çift puan. Erken bırakırsan menzil yetmez; geç bırakırsan hız dikey olur,
havada asılı kalıp düşersin. Sonraki çengeli kaçırırsan aşağıdaki boşluk seni alır.

Zorluk üç şeyle artar: çengeller açılır, ip menzili daralır, PERFECT penceresi incelir.
Sonra dikenler (tembel yayı cezalandırır) ve kopan çengeller (bir saniyede fırlatır) gelir.

## Bölüm üretimi neden adil
Çengeller rastgele saçılmaz. Bir çengel konmadan önce oyun **kendi fiziğini simüle edip**
iyi zamanlayan bir oyuncunun oraya gerçekten ulaşabildiğini doğrular; her derlemede
mükemmel oynayan bir yapay oyuncu 12000 kare oynar ve **ölmesi hata sayılır**.
Detay: `CLAUDE.md` → "Adalet garantisi".

## Klasörler
| Klasör | İçerik |
|---|---|
| `www/index.html` | **Oyunun tamamı.** Tek dosya, bağımlılık yok. |
| `app.config.json` | Kimlik bilgilerinin tek kaynağı (bundle id, e-posta, AdMob kimlikleri). |
| `assets/` | Simgeler, açılış ekranı, öne çıkan grafik, 10 mağaza ekran görüntüsü. |
| `docs/` | GitHub Pages ile yayına girecek gizlilik/şartlar/destek sayfaları (EN + TR). |
| `store/` | Play ve App Store metinleri, Veri Güvenliği, App Privacy, yaş derecelendirme. |
| `native/` | Android ve iOS derleme adımları. |
| `marketing/` | 15 TikTok/Reels senaryosu, story planı, hashtag setleri, takvim. |
| `tools/` | Görsel üretici, doğrulama scripti, kimlik güncelleyici, depo ayırıcı. |
| `LAUNCH-CHECKLIST.md` | **Sıfırdan yayına sıralı liste. Buradan başla.** |

## Komutlar
```bash
node tools/check.js              # yayın öncesi tam doğrulama
bash tools/gen.sh                # mağaza görsellerini yeniden üret
bash tools/set-identity.sh       # app.config.json'daki değerleri her yere yaz
bash tools/extract-repo.sh ~/latch-game   # kendi deposuna taşı
```

## Denge nerede ayarlanıyor
Tek yerde: `www/index.html` içindeki **`DIFF`** tablosu. Oyun zor geliyorsa
`DIFF.normal.perfect` (pencere genişliği) ve `DIFF.normal.help` değerlerini büyüt,
mekaniğe dokunma. Değişiklikten sonra `node tools/check.js` — self-test dengeyi denetler.
