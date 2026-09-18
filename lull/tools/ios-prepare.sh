#!/usr/bin/env bash
# `npx cap add ios` sonrasi native/ios.md'deki TUM elle duzenlemeleri otomatik
# uygular (Info.plist anahtarlari, sadece iPhone, dikey yon, surum numaralari).
# macOS gerektirir (PlistBuddy). Kullanim: bash tools/ios-prepare.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLIST="$ROOT/ios/App/App/Info.plist"
PBX="$ROOT/ios/App/App.xcodeproj/project.pbxproj"
[ -f "$PLIST" ] || { echo "ios/ yok - once: npx cap add ios"; exit 1; }
PB=/usr/libexec/PlistBuddy
[ -x "$PB" ] || { echo "PlistBuddy yok - bu script macOS gerektirir"; exit 1; }

VER=$(node -p "require('$ROOT/app.config.json').version")
VCODE=$(node -p "require('$ROOT/app.config.json').versionCode")
APPNAME=$(node -p "require('$ROOT/app.config.json').appName")
USETEST=$(node -p "require('$ROOT/app.config.json').admob.useTest")
REALAPP=$(node -p "require('$ROOT/app.config.json').admob.real.ios.app || ''")
GAD="ca-app-pub-3940256099942544~1458002511"
# Reklam kapaliysa ATT istemi, AdMob kimligi ve SKAdNetwork listesi HIC eklenmez.
ADS_ON=$(node -p "String(require('$ROOT/app.config.json').admob.enabled !== false ? 1 : 0)")
if [ "$USETEST" = "false" ] && [ -n "$REALAPP" ]; then GAD="$REALAPP"; fi
echo "AdMob iOS app id: $GAD  (useTest=$USETEST)"

set +e
$PB -c "Delete :GADApplicationIdentifier" "$PLIST" 2>/dev/null
$PB -c "Delete :NSUserTrackingUsageDescription" "$PLIST" 2>/dev/null
$PB -c "Delete :ITSAppUsesNonExemptEncryption" "$PLIST" 2>/dev/null
$PB -c "Delete :UIRequiresFullScreen" "$PLIST" 2>/dev/null
$PB -c "Delete :UISupportedInterfaceOrientations" "$PLIST" 2>/dev/null
$PB -c "Delete :SKAdNetworkItems" "$PLIST" 2>/dev/null
set -e
if [ "$ADS_ON" = "1" ]; then
  $PB -c "Add :GADApplicationIdentifier string $GAD" "$PLIST"
  $PB -c "Add :NSUserTrackingUsageDescription string 'Your choice here only affects how relevant the ads in $APPNAME are. The app itself works exactly the same either way.'" "$PLIST"
fi
$PB -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST"
$PB -c "Add :UIRequiresFullScreen bool true" "$PLIST"
$PB -c "Add :UISupportedInterfaceOrientations array" "$PLIST"
$PB -c "Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationPortrait" "$PLIST"
# SKAdNetwork: gelir icin onemli, eksikligi reddedilme sebebi DEGIL.
# Google'in guncel tam listesi: developers.google.com/admob/ios/quick-start
if [ "$ADS_ON" = "1" ]; then
$PB -c "Add :SKAdNetworkItems array" "$PLIST"
i=0
for NET in cstr6suwn9 4fzdc2evr5 2fnua5tdw4 ydx93a7ass p78axxw29g v72qych5uu ludvb6z3bs cp8zw746q7 3sh42y64q3 c6k4g5qg8m s39g8k73mm 3qy4746246 hs6bdukanm; do
  $PB -c "Add :SKAdNetworkItems:$i dict" "$PLIST"
  $PB -c "Add :SKAdNetworkItems:$i:SKAdNetworkIdentifier string $NET.skadnetwork" "$PLIST"
  i=$((i+1))
done
else
  echo "Reklam KAPALI: GADApplicationIdentifier, ATT istemi ve SKAdNetwork listesi eklenmedi"
fi

# UYGULAMA IKONU VE ACILIS EKRANI
# Bu adim uzun sure EKSIKTI: native/ios.md bunu "Xcode'da elle yap" diye
# tarif ediyordu, betik ise otomatiklestirmemisti. Mac'siz yayinladigimiz icin
# o elle adim hic gerceklesmedi ve TestFlight'a Capacitor'in bos yer tutucu
# ikonuyla bir yapi gitti. Ikon magazada urunun yuzu; elle adim birakilamaz.
ICONSET="$ROOT/ios/App/App/Assets.xcassets/AppIcon.appiconset"
if [ -d "$ICONSET" ] && [ -f "$ROOT/assets/icon-1024.png" ]; then
  rm -f "$ICONSET"/*.png
  cp "$ROOT/assets/icon-1024.png" "$ICONSET/AppIcon-1024.png"
  cat > "$ICONSET/Contents.json" <<'JEOF'
{
  "images" : [
    {
      "filename" : "AppIcon-1024.png",
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    }
  ],
  "info" : { "author" : "xcode", "version" : 1 }
}
JEOF
  echo "uygulama ikonu yerlestirildi (1024x1024, tek boyut)"
else
  echo "UYARI: AppIcon.appiconset veya assets/icon-1024.png yok - ikon yerlestirilemedi"
fi

SPLASHSET="$ROOT/ios/App/App/Assets.xcassets/Splash.imageset"
if [ -d "$SPLASHSET" ] && [ -f "$ROOT/assets/splash-2732.png" ]; then
  for f in "$SPLASHSET"/*.png; do
    [ -f "$f" ] && cp "$ROOT/assets/splash-2732.png" "$f"
  done
  echo "acilis ekrani yerlestirildi"
fi

# sadece iPhone, dikey, surum
if [ -f "$PBX" ]; then
  # IPHONEOS_DEPLOYMENT_TARGET: Capacitor 14.0 ile geliyor. Apple 2027 baharindan
  # itibaren en az 15.0 istiyor (ITMS-90068 uyarisi bir kez geldi). Bugun engel
  # degil ama simdi cozulmezse unutulur.
  sed -i.bak -E "s/IPHONEOS_DEPLOYMENT_TARGET = [0-9.]+;/IPHONEOS_DEPLOYMENT_TARGET = 15.0;/g; \
                 s/TARGETED_DEVICE_FAMILY = \"?[0-9,]+\"?;/TARGETED_DEVICE_FAMILY = \"1\";/g; \
                 s/MARKETING_VERSION = [^;]+;/MARKETING_VERSION = $VER;/g; \
                 s/CURRENT_PROJECT_VERSION = [^;]+;/CURRENT_PROJECT_VERSION = $VCODE;/g" "$PBX"
  rm -f "$PBX.bak"
fi
IAP_ON=$(node -p "String(require('$ROOT/app.config.json').iap && require('$ROOT/app.config.json').iap.enabled === false ? 0 : 1)")
if [ "$IAP_ON" = "1" ]; then
  echo "iOS projesi hazir. Xcode'da: Signing & Capabilities -> In-App Purchase ekle."
else
  echo "iOS projesi hazir. Satin alma kapali; ek capability gerekmiyor."
fi
