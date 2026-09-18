# Seher — namaz vakti, kıble, zikirmatik

Oyun değil, **araç**. Tek HTML dosyası (`www/index.html`) + Capacitor.
Güncel sürüm: **v1.0.0**.

## Çalışma kuralları

1. Tüm mantık **tek dosyada** kalır: `www/index.html`. Yeni dosya açma; kullanıcı
   yazılımcı değil, tek dosyayı kopyalayarak güncelleme yapabilmeli.
2. Sürüm yükseltirken birlikte güncellenir: `www/index.html` içindeki `CFG.version`,
   `app.config.json` içindeki `version` ve `versionCode`, `store/*.md` sürüm notları.
   (`bash tools/set-identity.sh` bunların çoğunu kendisi yazar.)
3. **Git commit mesajı sadece sürüm numarasıdır.** Örnek: `seher: v1.0.1`
4. Her değişiklikten sonra `node tools/check.js`. Yeşil değilse commit yok.
5. Görsel değiştiyse `bash tools/gen.sh` ile tüm mağaza görselleri yeniden üretilir.
6. `www/index.html` değiştiyse tarayıcıda denenen kopya da güncellenir:
   `cp www/index.html ../docs/seher/play/index.html` (check.js ikisinin aynı olmasını şart koşar).
7. Reklam kimlikleri, e-posta ve bundle id **yalnız `app.config.json`** içinde değişir,
   ardından `bash tools/set-identity.sh`.
8. Token tasarrufu: `index.html` ~1200 satırdır, tamamını okuma; `grep -n` ile hedefe git.

## Ürünün kırmızı çizgileri

Bunlar pazarlama tercihi değil, ürünün var olma sebebidir. Değiştirmeden önce iki kez düşün.

- **Vakte 10 dakikadan az kalmışken reklam gösterilmez** (`Ads.maybeInterstitial`).
  Namaz vaktinde araya giren bir reklam, uygulamanın bütün güvenini bir anda bitirir.
  `check.js` bu kapının kodda durduğunu denetliyor.
- **Kıble ekranı ve zikirmatik açıkken reklam yok.** Reklam yalnızca ikincil bir
  sekmeden Vakitler'e dönüşte denenebilir.
- **Hesap dinî bir hüküm değildir.** Arayüzde, `docs/seher/terms.html` 3. maddede ve
  mağaza metinlerinde bu açıkça yazılı. Resmî takvimlerle fark olabileceği ve dakika
  düzeltmesiyle oturtulabileceği her yerde söylenir. Bu cümleleri silme.
- **Sağlık/ibadet vaadi yok.** "Namazını kaçırmazsın" gibi kesinlik iddiası hem
  yanlıştır (bildirimler en iyi çaba ilkesiyle çalışır) hem de mağaza riski.

## Hesabın mimarisi

- Standart astronomik yöntem: Jülyen günü → güneşin deklinasyonu (`dec`) ve zaman
  denklemi (`eqt`) → istenen yükseklik açısı için saat açısı (`hourAngle`).
  Öğle = `12 - eqt - boylam/15 + tz`. Sunucu yok, tamamen çevrimdışı.
- `hourAngle` kutup bölgesinde `null` döner — o vakit astronomik olarak oluşmuyordur.
  **Bunu sayıya zorlama.** Arayüz `--:--` gösterir, `terms.html` 3. madde açıklar.
- İkindi gölge oranıyla: `asrAlt(shadow, ...)`, `shadow` 1 = Şâfiî/Diyanet, 2 = Hanefî.
- `METHODS` tablosu tek kaynaktır: fecir/yatsı açıları oradan gelir. Ümmü'l-Kurâ
  yatsıyı açıyla değil, akşamdan **90 dakika sonra** hesaplar (`ishaMinutes`).
- `S.tune` vakit başına dakika düzeltmesidir; hem ekrana hem bildirimlere uygulanır.
  Kurumların eklediği "temkin" payı bölgeye göre değiştiği için varsayılan 0'dır,
  Ayarlar'daki düğme yaklaşık bir takım uygular ve kullanıcı elle değiştirebilir.
- Kıble = bulunduğun noktadan Kâbe'ye (21.4225, 39.8262) giden büyük dairenin
  **başlangıç** açısı. Mercator haritasındaki düz çizgi değildir; İstanbul için 151.6°.
- Hicrî tarih aritmetik takvimdir, hilâl gözlemiyle bir gün oynayabilir; arayüzde belirtiliyor.
- **30 günlük liste ayrı bir hesap yolu açmaz**; `hesapla()` ve `S.tune` ile aynı
  kaynaktan üretilir. Ayrı yazılsaydı iki ekran zamanla birbirinden saparadı;
  self-test ilk günün ana ekranla aynı olmasını denetliyor.

### Saat dilimi — tek çerçeve kuralı

Vakitler **seçili yerin** saat diliminde hesaplanır, "şimdi" ise **cihazdan** okunur.
İkisi aynı çerçeveden okunmazsa başka şehre bakan (veya yurt dışındaki) kullanıcının
geri sayımı saatlerce şaşar ve bu, tek bir saat diliminde test edilirken hiç görülmez.

- Şehir listesi **sabit saat farkı değil, IANA dilim adı** tutar (`'Europe/Berlin'`).
  Sabit fark yaz saati uygulayan her şehirde yılın yarısında bir saat hatalıydı.
- `zoneOffset(zone, date)` o **tarihteki** gerçek farkı `Intl` ile bulur.
- `konumSimdi()` tek kaynaktır: seçili yerin takvim günü + gün içindeki ondalık saati.
  Vakit listesi, geri sayım, sıradaki vakit ve reklam kapısı hepsi bunu okur.
  **Yeni bir yerde `new Date().getHours()` yazma** — çerçeveyi kırar.
- `mutlakAn(y,a,g,saat,ofset)` duvar saatini gerçek ana çevirir. Bildirimler bununla
  kurulur; doğrudan `new Date(y,a,g,...)` kurmak cihaz başka dilimdeyken yanlış anda çalar.
- Bildirimlerde ofset **her gün ayrı** hesaplanır: yaz saati geçişi o yedi günün
  ortasına düşerse geçişten sonraki bildirimler bir saat kayardı.
- GPS veya elle koordinatta `S.zone` null'dur ve cihazın kendi dilimi kullanılır —
  oradaysan doğrusu budur.

## Test kipleri

| URL | Ne yapar |
|---|---|
| `www/index.html` | normal uygulama |
| `www/index.html?selftest=1` | hesabı bilinen değerlerle sınar, **arayüzü de kurup DOM'u denetler**, sonucu `document.title` içine yazar |
| `www/index.html?shot=1&s=...` | mağaza karesi kompozisyonu (parametreler `tools/gen.sh` içinde); `&sayfa=ay` 30 günlük listeyi açar |
| `www/index.html?t=2026-06-21T13:00` | saati sabitler — **seçili yerin duvar saati** olarak (tüm arayüz `simdiki()` üzerinden okur) |
| `www/index.html?film=1&t=<saniye>` | tanıtım videosunun tek karesi (`tools/film.sh` birleştirir) |

**Self-test kuralı:** `SELFTEST OK` dışında her şey hatadır. Test yalnız matematiği
değil arayüzü de sınar: altı satır çiziliyor mu, sıralı mı, dakika düzeltmesi ekrana
yansıyor mu, gece yarısından sonra yarının imsakı bulunuyor mu, vakte 5 dakika kala
reklam kapısı tutuyor mu, 30 günlük liste ana ekranla aynı saatleri mi veriyor.
Yeni bir özellik eklerken karşılığını buraya da yaz.

`check.js` self-test'i **üç ayrı cihaz saat diliminde** çalıştırır (UTC, New York,
Tokyo) ve üç çıktının **birebir aynı** olmasını şart koşar. Saat dilimi hatalarının
tek dilimde test edilirken görünmemesi bu ürünün en sinsi hata sınıfıdır.

## Tuzaklar

- **`?selftest=1` beklenen değeri sabitlemez, değişmezi sınar.** "13:00'te sıradaki
  vakit ikindi" diye yazıldı ve testi yanlış yere kırdı (doğrusu öğleydi, 13:06).
  Sabit isim yerine "ilk büyük vakit" değişmezi denetleniyor.
- **Saat dilimi sabit sayı olarak tutulmaz.** Şehir listesi ilk yazıldığında
  `['Berlin',52.52,13.405,1]` gibi sabit fark tutuyordu; Berlin yazın UTC+2 olduğu
  için Nisan-Ekim arası bütün vakitler bir saat yanlış çıkıyordu. Artık IANA dilim
  adı tutuluyor ve fark tarihe göre hesaplanıyor.
- **`?t=` cihazın saati değil, seçili yerin duvar saatidir.** `new Date("...")`
  ile ayrıştırılırsa kareleri üreten makinenin dilimine göre kayar; mağaza kareleri
  bir kez böyle başka bir vakti gösterdi. `simdiki()` bunu `mutlakAn` ile çözüyor.
- **Esmâü'l-Hüsnâ 99 isimdir**; "Allah" lafza-i celâli listeye eklenince 100 oldu.
  `check.js` sayıyı denetliyor. Arapça hat v1'de bilerek yok: yanlış bir harf dinî
  içerikte kabul edilemez, doğrulanmış bir kaynakla eklenecek.
- **`tools/film.sh` sabit port kullanmaz — ve bu bir kez çok kötü sonuç verdi.**
  Betik kareleri kendi başlattığı `python3 -m http.server` üzerinden çekiyor.
  Port 8877'de sabitken, başka bir ürünün film.sh çalışmasından kalan sunucu
  portu tutuyordu; bu betiğin kendi sunucusu sessizce bağlanamıyor, Chrome
  **öteki ürünün sayfasını** çekiyordu. Sonuç: `seher-tanitim.mp4` baştan sona
  **Lull'u** gösteriyordu ve hiçbir aşamada hata vermedi — video üretildi,
  çıkış kodu 0'dı. Artık boş port seçiliyor ve sunucunun gerçekten **bu
  ürünün** sayfasını verdiği `appName` ile doğrulanıyor; doğrulanmazsa betik
  durur. Üretilen videoyu yine de bir kare açıp gözle kontrol et.
- **Headless Chrome pencereyi 500 CSS pikselden dar açmaz.** Mağaza kareleri bir kez
  500 piksellik yerleşimin solundan kırpılmış çıktı. `?zw=390` sayfayı `zoom` ile
  telefon genişliğine oturtuyor; `tools/gen.sh` bunu kendisi ekliyor.
- **Bildirim simgesi** tek renk, şeffaf zeminli olmalı (`?mono=1`). Renkli verilirse
  Android onu beyaz bir kare olarak çizer. `capacitor.config.json` `ic_stat_seher`
  istiyor, `check.js` dosyanın üretildiğini denetliyor.
- `navigator.vibrate` iOS'ta **yoktur**; `buzz()` Capacitor Haptics'e düşer.
  Sıra önemli: önce `navigator.vibrate` denenir, yoksa Android'de desenli titreşim kaybolur.
- `CFG.ads.useTest` **true** ile yayına çıkılırsa hiç gelir olmaz. `check.js` uyarır.
- Gerçek AdMob kimlikleriyle kendi reklamına tıklamak hesabı kalıcı kapattırır.
- Android `versionCode` her yüklemede artmalı.
- `seher-release.jks` imza anahtarı kaybolursa uygulama bir daha güncellenemez.
- Global `var top` kullanma — `window.top` ile çakışır ve sessizce NaN üretir.
- `tools/set-identity.sh` içindeki node programı bash'te **tek tırnak** arasında durur;
  içine düz tek tırnak yazılamaz, gereken yerde `Q` sabiti kullanılır. `OLD_MAIL /
  OLD_URL / OLD_ID` sabitleri bayatlarsa betik sessizce hiçbir şey değiştirmez;
  `check.js` bunu hata olarak yakalıyor.
