#!/usr/bin/env bash
# `npx cap add android` sonrasi native/android.md'deki TUM elle duzenlemeleri
# otomatik uygular. Hem CI hem yerel derleme bunu kullanir; boylece android/
# klasoru her silindiginde ayni sonucu verir (tekrarlanabilir derleme).
# Kullanim: bash tools/android-prepare.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AND="$ROOT/android"
[ -d "$AND" ] || { echo "android/ yok - once: npx cap add android"; exit 1; }

APPNAME=$(node -p "require('$ROOT/app.config.json').appName")
BUNDLE=$(node -p "require('$ROOT/app.config.json').bundleId")
VER=$(node -p "require('$ROOT/app.config.json').version")
VCODE=$(node -p "require('$ROOT/app.config.json').versionCode")
USETEST=$(node -p "require('$ROOT/app.config.json').admob.useTest")
REALAPP=$(node -p "require('$ROOT/app.config.json').admob.real.android.app || ''")
ADMOB_APP_ID="ca-app-pub-3940256099942544~3347511713"
if [ "$USETEST" = "false" ] && [ -n "$REALAPP" ]; then ADMOB_APP_ID="$REALAPP"; fi
# admob.enabled / iap.enabled yoksa (eski app.config) varsayilan ACIK kabul edilir,
# boylece diger uc urunun davranisi degismez.
ADS_ON=$(node -p "String(require('$ROOT/app.config.json').admob.enabled !== false ? 1 : 0)")
IAP_ON=$(node -p "String(require('$ROOT/app.config.json').iap && require('$ROOT/app.config.json').iap.enabled === false ? 0 : 1)")
if [ "$ADS_ON" = "1" ]; then
  echo "AdMob app id: $ADMOB_APP_ID  (useTest=$USETEST)"
else
  echo "Reklam KAPALI: AD_ID izni ve AdMob kimligi manifest'e eklenmeyecek"
fi
[ "$IAP_ON" = "1" ] || echo "Satin alma KAPALI: BILLING izni eklenmeyecek"

# 1) simgeler
if [ -d "$ROOT/assets/android/res" ]; then
  cp -r "$ROOT/assets/android/res/"* "$AND/app/src/main/res/"
fi
mkdir -p "$AND/app/src/main/res/drawable"
[ -f "$ROOT/assets/splash-2732.png" ] && cp "$ROOT/assets/splash-2732.png" "$AND/app/src/main/res/drawable/splash.png"

# 2) AndroidManifest: izinler, AdMob kimligi, dikey kilit
node - "$AND/app/src/main/AndroidManifest.xml" "$ADMOB_APP_ID" "$ADS_ON" "$IAP_ON" <<'NODEEOF'
const fs=require('fs'), [,,f,adId,adsOn,iapOn]=process.argv;
let s=fs.readFileSync(f,'utf8');
/* Izinler KOSULLU. Reklam yokken AD_ID iznini beyan etmek, Play'in Veri
   Guvenligi formuyla DOGRUDAN CELISIR: "veri toplamiyorum" deyip reklam
   kimligi izni istemek politika ihlali olarak isaretlenir. */
const perms=[];
if (adsOn === '1') perms.push('com.google.android.gms.permission.AD_ID');
if (iapOn === '1') perms.push('com.android.vending.BILLING');
for (const p of perms){
  if (!s.includes(p)) s=s.replace('<application', '<uses-permission android:name="'+p+'"/>\n\n    <application');
}
if (adsOn === '1') {
  if (!s.includes('com.google.android.gms.ads.APPLICATION_ID')){
    s=s.replace('</application>',
      '    <meta-data\n        android:name="com.google.android.gms.ads.APPLICATION_ID"\n        android:value="'+adId+'"/>\n\n    </application>');
  } else {
    s=s.replace(/(APPLICATION_ID"\s*\n\s*android:value=")[^"]*(")/, '$1'+adId+'$2');
  }
}
if (!/android:screenOrientation/.test(s)){
  s=s.replace(/(<activity[^>]*android:name="\.MainActivity")/, '$1\n            android:screenOrientation="portrait"');
}
fs.writeFileSync(f,s);
console.log('  Manifest guncellendi');
NODEEOF

# 3) strings.xml
cat > "$AND/app/src/main/res/values/strings.xml" <<XEOF
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">$APPNAME</string>
    <string name="title_activity_main">$APPNAME</string>
    <string name="package_name">$BUNDLE</string>
    <string name="custom_url_scheme">$BUNDLE</string>
</resources>
XEOF

# 4) SDK seviyeleri
if [ -f "$AND/variables.gradle" ]; then
  sed -i.bak -E 's/minSdkVersion = [0-9]+/minSdkVersion = 23/; s/compileSdkVersion = [0-9]+/compileSdkVersion = 36/; s/targetSdkVersion = [0-9]+/targetSdkVersion = 36/' "$AND/variables.gradle"
  rm -f "$AND/variables.gradle.bak"
fi

# 5) surum numaralari + imzalama (keystore.properties varsa)
node - "$AND/app/build.gradle" "$VER" "$VCODE" <<'NODEEOF'
const fs=require('fs'), [,,f,ver,vcode]=process.argv;
let s=fs.readFileSync(f,'utf8');
s=s.replace(/versionCode\s+\d+/, 'versionCode '+vcode).replace(/versionName\s+"[^"]*"/, 'versionName "'+ver+'"');
if (!s.includes('keystorePropertiesFile')){
  const sign=`
    def keystorePropertiesFile = rootProject.file("keystore.properties")
    def keystoreProperties = new Properties()
    if (keystorePropertiesFile.exists()) { keystoreProperties.load(new FileInputStream(keystorePropertiesFile)) }
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
`;
  s=s.replace(/android\s*\{/, 'android {\n'+sign);
  s=s.replace(/(buildTypes\s*\{\s*release\s*\{)/, '$1\n            if (rootProject.file("keystore.properties").exists()) { signingConfig signingConfigs.release }');
}
fs.writeFileSync(f,s);
console.log('  build.gradle guncellendi (v'+ver+' / '+vcode+')');
NODEEOF
echo "Android projesi hazir. Derlemek icin: cd android && ./gradlew bundleRelease"
