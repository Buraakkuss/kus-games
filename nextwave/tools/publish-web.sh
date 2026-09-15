#!/usr/bin/env bash
# Derleyip docs/ altina koyar; GitHub Pages oradan yayinlar.
# Eski hash'li paketleri TEMIZLER — yoksa her derlemede bir 1.5 MB olu dosya birikir.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/../docs/nextwave/play"
cd "$ROOT"
npm run build
mkdir -p "$DEST/assets"
find "$DEST/assets" -type f -delete
cp -r www/* "$DEST/"
echo "yayina hazir: docs/nextwave/play/ -> https://buraakkuss.github.io/kus-games/nextwave/play/"
