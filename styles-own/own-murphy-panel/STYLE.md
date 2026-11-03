# Murphy Warm Panel · 墨菲暖板 (own-murphy-panel)
Source: Douyin 4630 (warm-brown explainer boards with peg people, glowing letter-blocks, HUD checklist). One source, one family. Demo: 「生日悖论」 24 s, 4 worlds, 1920×1080.
Code: `demo/look.js` (warm room, sconces, caption bed, checklist HUD, formula, ringGauge, measureBar, mini 3D) · `demo/people.js` (peg(): capsule body + cream ball head, 8 kinds × 15 poses) · `demo/props.js` (18 props) · `demo/motion.js` (M1–M12). Sheets: `stills/sheets/t_0.jpg` people · `t_1.5.jpg` props · `t_2.5.jpg` patterns.

## 1. Essence, and what it is not
A warm wood-panelled room where tiny peg people stand on terrazzo/hex platforms next to glowing glyph blocks and a left-top HUD checklist; bold white serif captions sit on a dark bed at the bottom with one gold-underlined keyword. Everyday probability / "wait, that can't be right" stories told as a living diorama.
It is NOT: flat 2D cutouts, neon cyber HUD, chalkboard, papyrus, ink wash, or photo-real people.

## 2. Materials & rendering
- Room wall `#17120F` with soft sconces; floor warm plank `#4F2A1A` / `#6C3924` with seams; table tops pale green `#CDC877`.
- Mini 3D in Canvas2D: look-at camera, Lambert faces (LIGHT top-left), box/prism, painter's list, optional DoF blur (`dof`).
- Peg people painted in screen space at the projected base scale: capsule body gradient + cream radial head + two low close dots.
- Soft vignette + contact shadows; grain is light.

## 3. Colour logic
Bodies = low-sat sage / terra / mustard / rose / olive / plum / slate / clay. Heads always cream. Accents: gold `#EAC57E` (keywords, gauges), coral `#EC8B70` (×N, leaders), red `#D0493B` (✗, danger). HUD cream `#E8DCC0`. Glowing glyph faces are emissive cream/gold on wood blocks.

## 4. Type & subtitles
- Caption: 'Noto Serif SC' 900 ~52 px, two lines at y≈944/1010, dark gradient bed for contrast; one keyword gold-underlined.
- Italic 'Noto Serif It' for big counters and ×N (coral).
- Checklist top-left: title ~24 px + items ~30 px, states empty / current (dash) / done (tick).
- Contrast on dark bed `#0A0705`: white 17.7 · gold 12.2 · coral 8.1 · hud 14.8 · red 4.5 (all ≥ 4.5).

## 5. Motion quality
Drop-in with one squash bounce; blocks flicker then hold a steady glow; counters hop on each integer; pair lines draw one after another; checklist ticks stroke-on; gauge rises without overshoot; lightsDip dims the room across world changes instead of a hard cut; rackFocus blurs one layer into another.

## 6. Camera grammar
Locked 1920×1080; eye orbits gently within a world (W3 eye x lerp); world change = lightsDip (~0.64 s dark) not a wipe. Occasional rack focus between board and gauge.

## 7. Sound palette
Warm lounge in F major at 84 BPM: soft electric-piano Fmaj7–Dm7–Gm7–C7, plucked upright bass, brushed hats. SFX: guest plinks, block thunk+hum, ✗ stamp, pair shimmer, checklist clicks, calendar plinks, collision bell, gauge sweep, lights-dip thumps.

## 8. Native moves
1. 掉落入场 — guests/props dropIn with one bounce.
2. 字块点亮 — letterBlock glow flickers then holds.
3. 配对连线 — pairLine draws a complete graph over heads.
4. 检查单打勾 — HUD item current → tick.
5. 竖量表上涨 — gaugeBar + measureBar climb to the answer.

## 9. Pitfalls of the medium
- Pegs too thin/tall read as sticks — body half-widths ≥ 0.19/0.215, head r 0.152, h ≥ 80 in party shots.
- Affine-mapped boards skew; draw gridBoard as per-cell perspective faces.
- Cake/block glow blows out — keep emissive radius small and alpha ≤ 0.55.
- Fast counters fail readcheck — only TEXTS-push the final integer and hold ≥ 2 s.
- Caption under lightsDip gets filtered; extend the previous caption across the dip or start the next world later.

## 10. Engine
Pure Canvas2D, Lemo page contract (READY/render/DUR/TEXTS), 1920×1080, 30 fps. Local fonts Noto Serif SC VF + Noto Serif Italic. Build: `demo/build.sh`.

## 11. Variation space
Any "intuition vs math" or queue/party explainer. Swap the cast colours/hats, swap the hero prop (blocks / board / gauge / toast). Fixed: warm dark room, cream peg heads, gold keyword underline, left HUD checklist, lightsDip world changes.

## 12. CHARACTER APPEAL (first-class)
Source people work because they are chunky, glossy peg toys with cream ball heads and tiny close-set eyes:
- Capsule body (no legs); motion = tilt / bob / squash / hop / yaw.
- Head cream sphere with two dark dots low and close; optional blush.
- Distinguish people with hat (beanie / fedora / bun / party), scarf, or gold bowtie — never by drawing a face.
- Nub arms for wave / point / cheer / carry; side and back via yaw.
Honest status: our pegs match the source's silhouette, palette and eye placement and read clearly in a crowd; the source's rendered pegs are still glossier / more 3D (stronger specular, softer subsurface). We note that gap and do not claim parity on the gloss.

## 13. PROP GRAMMAR (for deriving new props)
1. Wood (or pale-green table) primary body + one low-sat accent + at most one emissive detail (screen / flame / glyph).
2. Same top-left Lambert key as the room; no second light.
3. Readable at ~80 px on `#17120F` — if not, raise the emissive or the accent, never add outlines.
4. Origin at the floor contact (or table top for cake/gift) so props sit on platforms.
5. One verb parameter: `glow`, `k` (fill 0–1), `n` (count), `t` (bob), `ry`.
### Coded props (props.js + look.js sconce): 1 hexPlatform · 2 squarePlatform · 3 roundTable · 4 table · 5 cake · 6 gift · 7 letterBlock · 8 gridBoard · 9 gaugeBar · 10 bookshelf · 11 chair · 12 balloon · 13 counter · 14 toast · 15 flagPost · 16 deskCalendar · 17 sconce · 18 pairLine. HUD helpers: checklist, ringGauge, formula, measureBar.
### Prop-animation patterns (motion.js; filmstrip `stills/sheets/t_2.5.jpg`)
M1 dropIn · M2 blockLight · M3 countUp · M4 lineDraw · M5 checkTick · M6 gaugeRise · M7 pegWalk · M8 hop · M9 rackFocus · M10 lightsDip · M11 captionIn · M12 stampIn.
### Worked example — how `letterBlock` was derived
Need: "the wrong intuition, written large". Source 4630 shows wooden cubes with a lit glyph. Silhouette: chunky cube readable at 80 px. Material: wood body + emissive glyph on the front face via `onPlane`. Verb: `glow` 0–1 (M2 flickers then holds). Origin at cube base so it drops onto a platform with M1.

## 14. BANs
Photo people · detailed faces / noses / mouths · neon cyber HUD · hard cuts between worlds (use lightsDip) · English on screen · more than two caption lines · captions without the dark bed · blown-out emissive blooms · affine-skewed boards · stick-thin pegs.
