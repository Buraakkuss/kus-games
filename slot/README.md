# Slot v1.0.0

Tek dokunuşlu refleks oyunu. Tek HTML dosyası + Capacitor ile iOS ve Android.
Mağazaya gönderilmeye hazır: oyun, reklamlar, satın alma, simgeler, ekran görüntüleri,
gizlilik politikası, kullanım şartları, mağaza metinleri ve içerik planı dahil.

## 30 saniyede dene
```bash
npx --yes serve www -l 5173     # sonra tarayıcıda http://localhost:5173
```
veya `www/index.html` dosyasına çift tıkla. Boşluk tuşu = dokunma.

## Oyun nasıl çalışıyor
Ekranın alt üçte birinde bir şekilsin; yerin sabit, sadece dönebiliyorsun.
Yukarıdan kalın duvarlar iniyor ve her duvarda **tam senin şeklinde** bir delik var —
ama başka bir açıya çevrilmiş. Tek dokunuş seni 90° döndürür ve dönüş bir an sürer,
o yüzden erken başlatman gerekir. Duvar geldiğinde açı tutuyorsa delikten geçersin;
tutmuyorsa parçalanırsın. Dönüşü temastan **önce** bitirirsen geçiş `CLEAN` sayılır: çift puan.

Zorluk üç şeyle artar: duvarlar hızlanır, aralıkları daralır ve şekiller simetrisini
kaybeder. Kare her açıda geçer, çubuğun iki cevabı vardır, T şeklinin tek. İlerleyen
turlarda duvarlar gözünü yanlış açıya çeken **sahte delikler** ve arka arkaya iki
katmanlı **çift duvarlar** açar.

> Adı "Slot" ama kumar oyunu değil: makine, çark, kart, jeton, sanal para, şans yok.
> "Slot" buradaki yarık demek. Mağaza adı bu yüzden **"Slot: Fit the Shape"**
> (gerekçe: `LAUNCH-CHECKLIST.md` AŞAMA 0.1).

## Klasörler
| Klasör | İçerik |
|---|---|
| `www/index.html` | **Oyunun tamamı.** Tek dosya, bağımlılık yok. Reklam ve satın alma köprüleri içinde. |
| `app.config.json` | Kimlik bilgilerinin tek kaynağı (bundle id, e-posta, AdMob kimlikleri). |
| `assets/` | Simgeler, açılış ekranı, öne çıkan grafik, 10 mağaza ekran görüntüsü — hepsi üretilmiş. |
| `docs/` | GitHub Pages ile yayına girecek gizlilik/şartlar/destek sayfaları (EN + TR). |
| `store/` | Play ve App Store metinleri, Veri Güvenliği, App Privacy ve yaş derecelendirme cevapları. |
| `native/` | Android ve iOS derleme adımları, kopyalanabilir Manifest/Info.plist parçaları. |
| `marketing/` | 15 TikTok/Reels senaryosu, story planı, hashtag setleri, yayın takvimi. |
| `tools/` | Görsel üretici, doğrulama scripti, kimlik güncelleyici. |
| `LAUNCH-CHECKLIST.md` | **Sıfırdan yayına kadar sıralı liste. Buradan başla.** |

## Komutlar
```bash
node tools/check.js          # yayın öncesi tam doğrulama (oyun + görseller + ayarlar)
bash tools/gen.sh            # tüm mağaza görsellerini yeniden üret
bash tools/set-identity.sh   # app.config.json'daki değerleri tüm dosyalara yaz
npm install && npx cap add android && npx cap add ios
```

## Denge nerede ayarlanıyor
Tek yerde: `www/index.html` içindeki **`DIFF`** tablosu. Hız, duvar aralığı, açı toleransı,
deliğin şekle göre büyüklüğü, şekil zorluk eşiği, yardım gösterimi, sahte delik ve çift duvar
eşikleri — hepsi buradan çarpan alır. Oyun çok zor geliyorsa `DIFF.normal.help` değerini
büyüt (hayalet şekil daha uzun süre görünür), mekaniğe dokunma.

## Bilinmesi gerekenler
- Kod şu an **Google'ın resmi test reklam kimlikleriyle** geliyor. AdMob hesabın açılınca
  `app.config.json` içindeki `admob.real` alanlarını doldur, `useTest`'i `false` yap,
  `bash tools/set-identity.sh` çalıştır. `node tools/check.js` bunu kontrol ediyor.
- `www/index.html` içinde `?selftest=1` otomatik oyun testi, `?shot=1` mağaza görseli modu var.
  Self-test mükemmel oynayan bir yapay oyuncu çalıştırır; **o oyuncu ölürse zorluk tablosu
  adaletsiz** demektir ve doğrulama kırmızı yanar.
- Destek e-postası şu an `t.burakkus@gmail.com`. Yayınlandığında mağaza sayfasında **herkese
  görünür.** Ayrı bir adres istiyorsan `app.config.json` içinde değiştirip `set-identity.sh` çalıştır.
