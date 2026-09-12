#!/usr/bin/env bash
# Bu oyunu kendi bagimsiz git deposuna tasir.
# Kullanim: bash tools/extract-repo.sh ~/latch-game
set -e
DEST="${1:?kullanim: bash tools/extract-repo.sh <hedef-klasor>}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$DEST"
rsync -a --exclude node_modules --exclude android --exclude ios "$SRC"/ "$DEST"/
cp -r "$SRC/../.claude" "$DEST"/ 2>/dev/null || true
cd "$DEST"
git init -q -b main
git add -A
git commit -qm "v1.0.0"
echo "Hazir: $DEST"
echo "Simdi GitHub'da 'latch-game' deposunu ac ve:"
echo "  cd $DEST"
echo "  git remote add origin https://github.com/<kullanici>/latch-game.git"
echo "  git push -u origin main"
echo "Ardindan GitHub -> Settings -> Pages -> Source: main / docs"
