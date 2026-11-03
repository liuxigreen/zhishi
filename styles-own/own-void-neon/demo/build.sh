#!/bin/sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
FILM=$(cd "$HERE/.." && pwd)
LIB=${LIB:-/workspace/lemo-opuscar}
OUT=${OUT:-$FILM}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY=python3
export PLAYWRIGHT_CHROME=${PLAYWRIGHT_CHROME:-/usr/bin/google-chrome}
cd "$LIB"
mkdir -p "$HERE/out" "$OUT/stills"
node "$LIB/core/render/video.mjs" "$HERE" --fps 30 --workers 4 --out "$HERE/out/video.mp4"
"$PY" "$HERE/music.py"
sh "$LIB/core/render/mux.sh" "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$OUT/test.mp4" 30 0
node "$LIB/core/render/readcheck.mjs" "$HERE" > "$HERE/out/readcheck.txt" && echo "readcheck ok" || echo "readcheck: see out/readcheck.txt"
ffmpeg -v error -y -ss 4.5 -i "$OUT/test.mp4" -frames:v 1 -q:v 2 "$OUT/test.jpg"
cp "$OUT/test.jpg" "$OUT/poster.jpg"
node "$LIB/core/render/still.mjs" "$HERE" 4.5 --out "$OUT/stills/_sf" && cp "$OUT/stills/_sf/t_4.5.jpg" "$OUT/stills/styleframe.jpg"
for s in w1:4.5 w2:9.5 w3:15.5 w4:22; do
  ffmpeg -v error -y -ss "${s#*:}" -i "$OUT/test.mp4" -frames:v 1 -q:v 3 -vf scale=960:-1 "$OUT/stills/frame_${s%%:*}.jpg"
done
echo "done: $OUT/test.mp4"
