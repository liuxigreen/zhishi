#!/bin/sh
H=$(cd "$(dirname "$0")" && pwd)
for f in look people props motion; do [ -f "$H/../demo/$f.js" ] && cp "$H/../demo/$f.js" "$H/$f.js"; done
mkdir -p "$H/fonts" && cp "$H/../demo/fonts/"* "$H/fonts/"
