#!/usr/bin/env bash
# Bu oyunu kendi bagimsiz git deposuna tasir.
# Kullanim: bash tools/extract-repo.sh ~/slot-game
set -e
DEST="${1:?kullanim: bash tools/extract-repo.sh <hedef-klasor>}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$DEST"
rsync -a --exclude node_modules --exclude android --exclude ios "$SRC"/ "$DEST"/
# ortak docs agacindan bu oyunun sayfalarini yanina al
mkdir -p "$DEST/docs"
cp -r "$SRC/../docs/slot/"* "$DEST/docs/" 2>/dev/null || true
cp "$SRC/../docs/_style.css" "$DEST/docs/" 2>/dev/null || true
touch "$DEST/docs/.nojekyll"
sed -i 's|href="../_style.css"|href="_style.css"|g; s|<a href="../index.html">&#8592; Games</a>||g' "$DEST/docs/"*.html 2>/dev/null || true
cp -r "$SRC/../.claude" "$DEST"/ 2>/dev/null || true
cd "$DEST"
git init -q -b main
git add -A
git commit -qm "v1.0.0"
echo "Hazir: $DEST"
echo "Simdi GitHub'da 'slot-game' deposunu ac ve:"
echo "  cd $DEST"
echo "  git remote add origin https://github.com/<kullanici>/slot-game.git"
echo "  git push -u origin main"
echo "Ardindan GitHub -> Settings -> Pages -> Source: main / docs"
