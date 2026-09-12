#!/usr/bin/env bash
# app.config.json icindeki degerleri tum dosyalara yazar.
# Kullanim: bash tools/set-identity.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
node -e '
const fs=require("fs"),p=process.argv[1];
const c=JSON.parse(fs.readFileSync(p+"/app.config.json","utf8"));
const g=c.gameId||"latch";
const D="../docs/"+g+"/";
const files=["www/index.html",D+"index.html",D+"privacy.html",D+"gizlilik.html",
             D+"terms.html",D+"support.html","capacitor.config.json","package.json",
             "store/google-play.md","store/app-store.md","native/android.md","native/ios.md",
             "LAUNCH-CHECKLIST.md","README.md"];
const OLD_MAIL="t.burakkus@gmail.com", OLD_URL="https://buraakkuss.github.io/latch-game", OLD_ID="com.kusgrup.latch";
for(const f of files){
  const fp=p+"/"+f; if(!fs.existsSync(fp)) continue;
  let s=fs.readFileSync(fp,"utf8");
  s=s.split(OLD_MAIL).join(c.supportEmail).split(OLD_URL).join(c.pagesBaseUrl).split(OLD_ID).join(c.bundleId);
  fs.writeFileSync(fp,s);
}
let g=fs.readFileSync(p+"/www/index.html","utf8");
g=g.replace(/version: '"'"'[^'"'"']*'"'"'/, "version: '"'"'"+c.version+"'"'"'");
g=g.replace(/useTest: (true|false)/, "useTest: "+(c.admob.useTest?"true":"false"));
for(const plat of ["android","ios"]){
  for(const k of ["app","interstitial","rewarded"]){
    const v=c.admob.real[plat][k]; if(!v) continue;
    const re=new RegExp("(real:[\\\\s\\\\S]*?"+plat+":\\\\s*\\\\{[^}]*?"+k+":\\\\s*'"'"')[^'"'"']*("'"'"')");
    g=g.replace(re,"$1"+v+"$2");
  }
}
fs.writeFileSync(p+"/www/index.html",g);
const pk=JSON.parse(fs.readFileSync(p+"/package.json","utf8"));
pk.version=c.version; fs.writeFileSync(p+"/package.json", JSON.stringify(pk,null,2)+"\n");
const cc=JSON.parse(fs.readFileSync(p+"/capacitor.config.json","utf8"));
cc.appId=c.bundleId; cc.appName=c.appName; fs.writeFileSync(p+"/capacitor.config.json", JSON.stringify(cc,null,2)+"\n");
console.log("kimlik guncellendi:",c.bundleId,c.supportEmail,c.pagesBaseUrl,"v"+c.version);
' "$ROOT"
