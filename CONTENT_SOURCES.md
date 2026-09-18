# CONTENT SOURCES

Dinî içeriğin **tek tek** kaynağı. Şartname §73, §74, §75 ve §107 gereği:
kaynağı olmayan dinî içerik üretimde yayınlanmaz, AI âyet/hadis/dua üretmez.

## Durum tablosu

| İçerik | Kaynak | Lisans durumu | Uygulamada |
|---|---|---|---|
| Kur'an Arapça metni | [Tanzil Project](https://tanzil.net/download/) | **Kullanılabilir** — verbatim kopyalama izinli, değiştirmek yasak, atıf ve tanzil.net bağlantısı şart | İçe aktarma boruhattı kurulacak |
| Türkçe meal | — | **YOK** (B1) | Şema hazır, veri yok |
| Tefsir | — | **YOK** (B2) | Şema hazır, veri yok |
| Hadis külliyatı | — | **YOK** (B3) | Şema hazır, veri yok |
| Kıraat kayıtları | — | **YOK** (B4) | Oynatıcı hazır, ses yok |
| Esmâü'l-Hüsnâ (okunuş + Türkçe anlam) | Bu uygulama için yazıldı | Özgün | Var |
| Dua metinleri (okunuş + anlam) | Bu uygulama için yazılacak | Özgün | FAZ 7 |
| Tecvid anlatımı ve örnekleri | Bu uygulama için yazıldı | Özgün | Var (`seher/`), taşınacak |
| Terim sözlüğü | Bu uygulama için yazıldı | Özgün | Var (`seher/`), taşınacak |
| Arapça yazı tipi (Amiri, Amiri Quran) | [Amiri Project](https://github.com/aliftype/amiri) | **Kullanılabilir** — SIL Open Font License 1.1; lisans metni paketle dağıtılıyor (`sukun/assets/fonts/Amiri-OFL.txt`) | Var |
| Namaz vakti hesabı | Astronomik hesap, cihazda | Kaynak gerekmez | Var |
| Hicrî takvim | Aritmetik takvim | Kaynak gerekmez, sapma arayüzde yazılı | Var |

## Değişmez kurallar

1. **Mushaf metni ezberden dizilmez.** Tek bir harekenin yanlış olması kabul
   edilemez bir hatadır. Yalnız doğrulanmış kaynaktan içe aktarılır ve
   içe aktarma sonrası âyet sayısı + checksum doğrulanır (§74).
2. **Hadis kaynaksız yayınlanamaz.** Eser, kitap/bölüm ve numara alanları
   zorunludur; boşsa içerik `VERIFIED` olamaz (§75).
3. **Kaynak arayüzde görünür.** Meal, tefsir ve hadiste kaynak kullanıcıya
   gösterilir (§107).
4. **AI çıktısı içerik veritabanına yazılmaz** (§56).

## Lisans alınırken sorulacaklar

- Eserin adı, sürümü ve hak sahibi
- Dijital dağıtım izni kapsamı (mobil uygulama, çevrimdışı kopya)
- Ticari kullanım (reklamlı/abonelikli uygulama) izni
- Atıf metninin nasıl görünmesi gerektiği
- Süre ve fesih koşulları
