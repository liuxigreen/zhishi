#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ln -sfn "$ROOT/fonts" "$ROOT/lookkit/core/fonts"
for d in "$ROOT"/styles-own/own-*; do
  [[ -d "$d/demo" ]] && ln -sfn "$ROOT/fonts" "$d/demo/fonts"
  [[ -d "$d/sheets" ]] && ln -sfn "$ROOT/fonts" "$d/sheets/fonts"
done
# lemo style demo fonts
while IFS= read -r -d '' d; do
  ln -sfn "$ROOT/fonts" "$d"
done < <(find "$ROOT/lemo/styles" -type d \( -path '*/demo/fonts' -o -path '*/demo/kit/fonts' \) -print0 2>/dev/null; true)
# recreate missing demo/fonts dirs as links
while IFS= read -r -d '' demo; do
  [[ -e "$demo/fonts" ]] || ln -sfn "$ROOT/fonts" "$demo/fonts"
done < <(find "$ROOT/styles-own" "$ROOT/lemo/styles" -type d -name demo -print0)
echo "font links fixed under $ROOT"
