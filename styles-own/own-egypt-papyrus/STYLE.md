# Papyrus Egypt · 莎草图 (own-egypt-papyrus)
Source: Douyin 4352 (Egyptian-myth explainer “太阳神的眼睛差点毁灭了人类”, 1440×1080 4:3). One source, one family. Demo: 「史上第一次罢工」 24 s, 4 worlds, 1440×1080.
Code: `demo/look.js` (parchment, frame bands, block stripe, winged sun, eye of Horus, caption card, name tag, title pill) · `demo/people.js` (egyptian(): 8 kinds × 15 poses + walk cycle, walkPose, blendPose) · `demo/props.js` (20 props) · `demo/motion.js` (M1–M9). Sheets: `stills/sheets/t_0.jpg` people · `t_1.5.jpg` props · `t_2.5.jpg` patterns.

## 1. Essence, and what it is not
A tomb-painting come to life: flat Egyptian-canon figures (profile face, frontal eye and shoulders, profile legs) on mottled parchment or stone, framed top and bottom by a navy band with gold winged sun and a coloured block stripe; a cream caption card with two lines of bold serif and one coloured key word. History/myth told as a picture book.
It is NOT: 3D Egypt, photo textures, cartoon chibi, gold-glitter "luxury" Egypt, or neon.

## 2. Materials & rendering
- Grounds: parchment `#E2D1A8` mottled to `#B9A887` with hair-line cracks (cached); stone `#B9AE98`; dusk sky bands `#ABB5C1 → #F7DDB3`; night `#1A1C29`.
- Every shape group = flat fill + one merged dark contour `#2A1A12` (LW 3 px, drawn as 2×LW stroke under the fill → clean outer line).
- At most one shade tone per surface (skin shade, linen shade) clipped inside the body; no gradients on figures.
- Fine grain over everything (0.6) + soft vignette 0.18.

## 3. Colour logic
Men skin red-brown `#8E3B2A`, women ochre `#D5A458` (the canon). Linen white `#EFE6D0`. Jewellery = blue `#2F5C9E` / turquoise `#3E9A8C` / gold `#D9A640` only. Red `#B8392B` = sun, danger, the key word. Navy bands frame every frame. Caption key words: blue (names/places), red (the hit), green (amounts/places).

## 4. Type & subtitles
- Caption card: cream `#F1E6C8` 1272×158 at y 872–1030, gold top edge + block stripe; 'Noto Serif SC' 900 46 px, two centred lines (y 932 / 990).
- Contrast on cream: ink 12.9:1 · red `#A82A1F` 5.6:1 · blue `#24529A` 6.2:1 · green `#256B42` 5.2:1 (all ≥ 4.5).
- Name tag: vertical cream tag with dark border next to a figure's head (24 px), as in 4352 t14 「哈托尔」.
- Title pill: rounded cream capsule with gold rim at the top of the first world.
- Captions rise 14 px and fade in 0.45 s; never more than 2 lines.

## 5. Motion quality
Paper-puppet motion: joints rotate, bodies stay flat. Poses blend with ease-in-out over 0.3–0.6 s; walk cycle 0.85–0.9 s with 3 px bob; chisel loop 0.55 s. Props stamp in with a small overshoot (back-ease). Nothing wobbles or squashes.

## 6. Camera grammar
Locked 4:3 frame; the only move is a slow horizontal pan (≤ 900 px over 2.5 s) to travel along a road or wall. World change = papyrus unroll wipe (M1) with a rolled edge, 0.6 s.

## 7. Sound palette
Harp in D Hijaz (Phrygian-dominant), low drone, frame drum at 92 BPM. SFX: stone chisel taps, papyrus swish on every wipe, sand pour, tally ticks, crowd shout, cheer, soft ding for the ankh.

## 8. Native moves
1. 墙上刻字 — hieroglyph wall carves in while a worker chisels (hieroWall reveal).
2. 粮仓见底 — granary fill drops; a figure slumps.
3. 刻痕计日 — tally marks + 「第 N 天」 count up, last number red.
4. 纸草卷宣言 — a scroll stamps in with the quote in red.
5. 书吏记录 — seated scribe writes; a big scroll unrolls and writes itself.

## 9. Pitfalls of the medium
- Heads too small / wig too far forward hide the face — head = 1.08 u, wig front edge stops behind the eye.
- Separate boxy dress top looks like a bib — women's dress is one sheath with a diagonal bust line.
- Seated poses break easily; use the tuned `sitDown`/`write`/`sitChair` values.
- Small props vanish against parchment — props on figures need a bright fill (chisel `#E09A5C`) and ≥ 40 px.
- Too many figures in a row = a frieze with no focus; one figure acts, others hold poses.

## 10. Engine
Pure Canvas2D, Lemo page contract (READY/render/DUR/TEXTS), 1440×1080, 30 fps. Local font Noto Serif SC VF. Build: `demo/build.sh` (video, music.py, mux, readcheck, stills).

## 11. Variation space
Any ancient-civilisation story (Egypt first; Mesopotamia/Nubia with palette swaps). Swap grounds (parchment/stone/dusk/night), swap the cast (8 kinds), swap the hero prop. Fixed: frame bands, caption card, outlined flat figures, canon pose rules.

## 12. CHARACTER APPEAL (first-class)
Source people look good because they follow the canon cleanly and are elegant:
- Head large (1.08 u) with a clear almond eye + kohl line, straight nose, full lip; wig frames the face but never covers it.
- Long neck, broad frontal shoulders (0.66 sh), narrow waist (5.0 women / 5.6 men), long legs; feet flat on the ground line.
- Women: ochre skin, one-piece sheath, broad collar, long wig with headband; men: red-brown, kilt, shorter wig.
- Gods: Ra = falcon head + sun disk; Hathor = sun disk between horns + net-pattern dress.
- Always a gesture: offering hand, raised arm, carrying, chiselling — never two dead arms.
Honest status: our figures are clean, on-canon and readable, close to the source; the source's women are still slightly more graceful (thinner wrists, longer fingers), Ra's falcon head reads more like a mask than the source's, and the cross-legged scribe is only OK.

## 13. PROP GRAMMAR (for deriving new props)
1. Flat silhouette + one merged dark contour (`outlined`).
2. One material colour + at most one decorative band (gold / blue / green), like the source's jars and columns.
3. Readable at 60 px against parchment — if not, brighten the fill, never add gradients.
4. Origin at the base (or at the grip for hand-held tools) so props stand on GROUND or ride `J.hands`.
5. One verb parameter: `reveal`, `fill`, `open/write`, `n`, `t`.
### Coded props (props.js): 1 sunDisk · 2 palm · 3 papyrus · 4 column · 5 glyph/hieroWall(reveal) · 6 nile · 7 chisel · 8 mallet · 9 oilLamp · 10 granary(fill) · 11 grainSack · 12 basket · 13 scroll(open, write) · 14 reedPen · 15 palette · 16 jar · 17 bread · 18 pylon(n) · 19 temple · 20 tally · 21 ankh · 22 starSky · 23 hills. Plus look.js: wingedSun, eyeOfHorus, frameBands.
### Prop-animation patterns (motion.js; filmstrip `stills/sheets/t_2.5.jpg`)
M1 scrollWipe (papyrus unroll, rolled edge, 0.6 s) · M2 captionIn · M3 poseAt (pose keyframe track, eased) · M4 walk (cycle + travel + bob) · M5 chiselLoop (up/down + hit flag for SFX) · M6 countUp (integer + frac for tally) · M7 stampIn (back-ease scale) · M8 shout (shake envelope) · M9 grainPour (falling grain particles).
### Worked example — how `granary` was derived
Need: "wages = grain, and it runs out". Source has jars and beehive shapes; Egyptian granaries really were domed mud silos. Silhouette: rounded dome on a plinth, readable at 60 px. Material: clay `#B57A4E` + dark doorway; decorative band: none (keep it humble). Verb: `fill` 0–1 draws a gold grain level inside the hatch, so M9 grainPour and a falling level show "empty". Origin at base centre so it sits on GROUND; `n` draws 1–3 silos in a row.

## 14. BANs
3D/gradient-shaded bodies · faces turned 3/4 (always canon profile) · photo textures · neon or glitter gold · English on screen · more than two caption lines · captions off the cream card · zooms / shaky cam · hard cuts (use M1) · modern objects drawn in the same style without a reason.
