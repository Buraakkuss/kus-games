#!/usr/bin/env bash
# Tum magaza gorsellerini yeniden uretir.  Kullanim:  bash tools/gen.sh
set -e
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets"
FLAGS="--headless=new --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=4000"

# Headless pencere yuksekligi ile gercek viewport arasindaki fark (chrome surumune
# gore degisir) her cihaz olcegi icin ayri olculur.
PROBE="$(mktemp /tmp/vpXXXX.html)"
cat > "$PROBE" <<'PEOF'
<!doctype html><meta charset="utf-8"><title>x</title>
<script>document.title='VP:'+window.innerWidth+'x'+window.innerHeight;</script>
PEOF
delta(){  # $1 = cihaz olcegi
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor="$1" --virtual-time-budget=2000 \
    --window-size=600,800 --dump-dom "file://$PROBE" 2>/dev/null \
    | grep -o 'VP:[0-9]*x[0-9]*' | head -1 | sed 's/.*x//' | awk '{d=800-$1; print (d<0?0:d)}'
}
D1=$(delta 1)
[ -z "$D1" ] && D1=0
rm -f "$PROBE"
echo "viewport farki: ${D1}px"

TMPSHOT="$(mktemp /tmp/shotXXXX.png)"
shot(){ # $1=out  $2=W  $3=H  $4=url  $5=extra   (1:1, ikon/afis icin)
  "$CHROME" $FLAGS --force-device-scale-factor=1 $5 \
    --window-size="$2,$(( $3 + D1 ))" --screenshot="$TMPSHOT" "$4" >/dev/null 2>&1
  node "$ROOT/tools/pngcrop.js" "$TMPSHOT" "$1" "$2" "$3"
}
# Magaza ekran goruntusu. Iki tuzak birden var:
#  1) headless Chrome pencereyi 500 CSS pikselden dar acmaz -> sayfa
#     ?zw=390 ile kendini 390 piksellik telefon genisligine zoom'lar.
#  2) --window-size CSS pikselidir, ekran goruntusu bunun cihaz olcegi katidir.
phone(){ # $1=out  $2=cssW  $3=cssH  $4=olcek  $5=url
  "$CHROME" $FLAGS --force-device-scale-factor="$4" \
    --window-size="$2,$(( $3 + D1 ))" --screenshot="$TMPSHOT" "$5&zw=390" >/dev/null 2>&1
  node "$ROOT/tools/pngcrop.js" "$TMPSHOT" "$1" "$(( $2 * $4 ))" "$(( $3 * $4 ))"
}

find "$OUT/android" -mindepth 1 -delete 2>/dev/null || true
mkdir -p "$OUT/screenshots" "$OUT/android"

# --- ikonlar ---
shot "$OUT/icon-1024.png" 1024 1024 "file://$ROOT/tools/icon.html?s=1024"
shot "$OUT/icon-512.png"   512  512 "file://$ROOT/tools/icon.html?s=512"
shot "$OUT/feature-graphic-1024x500.png" 1024 500 "file://$ROOT/tools/icon.html?w=1024&h=500&wide=1"
# Android res agaci (dogrudan android/app/src/main/res icine kopyalanabilir)
set -- "mdpi 48 108 24" "hdpi 72 162 36" "xhdpi 96 216 48" "xxhdpi 144 324 72" "xxxhdpi 192 432 96"
for ENTRY in "$@"; do
  D=$(echo $ENTRY | cut -d' ' -f1); L=$(echo $ENTRY | cut -d' ' -f2)
  F=$(echo $ENTRY | cut -d' ' -f3); N=$(echo $ENTRY | cut -d' ' -f4)
  mkdir -p "$OUT/android/res/mipmap-$D" "$OUT/android/res/drawable-$D"
  shot "$OUT/android/res/mipmap-$D/ic_launcher.png" $L $L "file://$ROOT/tools/icon.html?s=$L"
  shot "$OUT/android/res/mipmap-$D/ic_launcher_round.png" $L $L \
       "file://$ROOT/tools/icon.html?s=$L&round=1" "--default-background-color=00000000"
  shot "$OUT/android/res/mipmap-$D/ic_launcher_foreground.png" $F $F \
       "file://$ROOT/tools/icon.html?s=$F&bg=0&scale=0.62" "--default-background-color=00000000"
  # bildirim simgesi: Android'in istedigi tek renk, seffaf zeminli siluet
  shot "$OUT/android/res/drawable-$D/ic_stat_seher.png" $N $N \
       "file://$ROOT/tools/icon.html?s=$N&mono=1" "--default-background-color=00000000"
done

mkdir -p "$OUT/android/res/mipmap-anydpi-v26" "$OUT/android/res/values"
cat > "$OUT/android/res/mipmap-anydpi-v26/ic_launcher.xml" <<'XEOF'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
XEOF
cp "$OUT/android/res/mipmap-anydpi-v26/ic_launcher.xml" "$OUT/android/res/mipmap-anydpi-v26/ic_launcher_round.xml"
cat > "$OUT/android/res/values/ic_launcher_background.xml" <<'XEOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#071A17</color>
</resources>
XEOF

# --- acilis ekrani (splash) ---
shot "$OUT/splash-2732.png" 2732 2732 "file://$ROOT/tools/icon.html?s=2732&scale=0.34"

# --- magaza ekran goruntuleri ---
# ?t= saati sabitler: her calistirmada ayni kare cikar (tekrarlanabilir).
G="file://$ROOT/www/index.html?shot=1&t=2026-06-21T13%3A00"
declare -a SH=(
 "s=vakit&h0=G%C3%BCn%C3%BCn%20alt%C4%B1%20vakti%20%C2%B7%20geri%20say%C4%B1m%20%C2%B7%20internetsiz"
 "s=kible&yon=95&h0=Pusulayla%20k%C4%B1bleyi%20an%C4%B1nda%20bul"
 "s=kart&sayfa=kartlar&g=8&h1=Kandil%20ve%20bayrama%20haz%C4%B1r%20kartlar&h2=Se%C3%A7%2C%20payla%C5%9F%20%C2%B7%20WhatsApp%2C%20Instagram%2C%20Facebook"
 "s=kart&sayfa=onizle&g=5&k=1&h0=Tek%20dokunu%C5%9Fla%20payla%C5%9F"
 "s=ogren&h1=Elifba%2C%20tecvid%20ve%20terim%20s%C3%B6zl%C3%BC%C4%9F%C3%BC&h2=Ad%C4%B1m%20ad%C4%B1m%20dersler%20%C2%B7%20her%20ders%20bir%20al%C4%B1%C5%9Ft%C4%B1rmayla%20biter"
 "s=ogren&sayfa=ders&d=0&h0=Her%20ders%20k%C3%BC%C3%A7%C3%BCk%20bir%20al%C4%B1%C5%9Ft%C4%B1rmayla%20biter"
 "s=zikir&zikir=21&h1=Zikirmatik&h2=33%20ve%2099%20hedefi%20%C2%B7%20hedefte%20titre%C5%9Fim"
 "s=vakit&sayfa=ay&sc=0&h0=30%20g%C3%BCnl%C3%BCk%20liste%20%C2%B7%20imsakiye"
)
i=1
for Q in "${SH[@]}"; do
  phone "$OUT/screenshots/android-$i-1080x1920.png" 540 960  2 "$G&$Q"
  phone "$OUT/screenshots/ios69-$i-1290x2796.png"    645 1398 2 "$G&$Q"
  phone "$OUT/screenshots/ios65-$i-1284x2778.png"    642 1389 2 "$G&$Q"
  i=$((i+1))
done
rm -f "$TMPSHOT"
echo "Uretildi:"; find "$OUT" -name "*.png" | wc -l
