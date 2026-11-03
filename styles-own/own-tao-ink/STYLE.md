# Tao Ink · 道卷水墨 (own-tao-ink)
Source: Douyin 7694885507196554550 (“道 / 内卷” Zhuangzi explainer, 1080×1920, ~95 s). One source, one family. Demo: 「庖丁解牛 · 顺着缝走」 24 s, 4 worlds.
Code: `demo/look.js` (paper, seal, header, chapter, caption, cite) · `demo/people.js` (stick, sage, ox) · `demo/props.js` (22 props) · `demo/motion.js` (M1–M11). Sheets: `stills/sheets/t_0.jpg` people · `t_1.5.jpg` props · `t_2.5.jpg` patterns.

## 1. Essence, and what it is not
A vertical scroll of rice paper. One ink stick figure, one or two props, a huge brush character or a red seal, and one sentence of plain Chinese at the bottom. Old Chinese text explains modern pain (内卷, burnout). Calm, slow, lots of white space.
It is NOT: guofeng fantasy art, gold foil, anime faces, a busy infographic, or a dark neon tech look.

## 2. Materials & rendering
- Paper: warm beige `#E4DDCD` with soft mottling, fibres and tiny flecks (cached offscreen). Night worlds use `#0F0E0C` paper with the same grain.
- Ink: flat near-black `#1D1B16`, round caps, no outlines. 飞白 dry streaks only on brush characters.
- Light washes: pine green `#54674B`/`#7E8F6E` discs, water grey-green lines, far mountains `inkSoft` at 30–60 %.
- Red `#AB2229` = seal, key word, dashed path. Never a big red area except the red sun.

## 3. Colour logic
Paper/ink do 95 % of the work. Red = "the point" (one per frame: a seal, a key word, or a path). Green = living nature. Night = struggle / the wrong way; paper = the Tao / the right way. Bright red 7-seg digits (`#D8322F` with glow) only on night worlds (modern counter).

## 4. Type & subtitles
- Caption: bold serif ('Noto Serif SC' 800) 58–62 px, centered at y≈1380, ink on paper / cream on night; key words red. Contrast ≥ 4.5:1 (ink on paper ≈ 13:1; red on paper ≈ 6:1).
- Cite line under the caption: 30 px grey, starts with 「——」, the classical quote.
- Header: tiny 知 seal + 「一分钟 · 读懂庄子」 at y≈195.
- Chapter tag top-left: red seal with 壹/贰… + 4-char title + progress dots.
- Brush characters: MaShanZheng 230–450 px with stroke weight (size·0.04), 飞白 and splatter.
- Vertical columns (竖排) for lists of time/age; last item red.

## 5. Motion quality
Slow. Things ease in over 0.5–1.5 s and then breathe (pines sway ±1.5°, water drifts). Only the chop is fast (strike lands at 0.68 of a 1.05 s cycle). Captions rise 14 px with blur → sharp; red words land 0.25 s later.

## 6. Camera grammar
Locked camera, vertical frame. No zooms. The "cut" is an ink bloom (M1) that grows from the next world's hero point.

## 7. Sound palette
Guqin plucks (Karplus-Strong) in D 宫 pentatonic, low drone, wind. SFX: wood chop + crack, ink whoosh on blooms, brush swish, seal thump, knife scrape, soft ding on gleam. No beats, no risers.

## 8. Native moves
1. 夜里蛮干 — cream figure chops on black, red digits count the cost.
2. 大字落纸 — a brush character writes itself, then a seal stamps.
3. 红线顺缝 — red dashed path traces where to go; the prop follows it.
4. 举物端详 — figure holds the prop up; gleam; vertical column of years.

## 9. Pitfalls of the medium
- Straight-stick arms read as a dead mannequin — always bend elbows/knees.
- Too many props kills the 留白. Max 3 objects + 1 text item per world.
- Brush chars below ~200 px lose the 飞白 and look like a font.
- Red everywhere = no red. One red thing per frame.

## 10. Engine
Pure Canvas2D, Lemo page contract (READY/render/DUR/TEXTS), 1080×1920, 30 fps. Fonts are local (MaShanZheng, Noto Serif SC).

## 11. Variation space
Swap the classic (庄子/老子/孙子/论语), swap the modern pain, swap the hero prop (cleaver ↔ ruler ↔ glass cup ↔ boat). Night/paper ratio can change; the 4 rules (one figure, one red, one sentence, lots of paper) can't.

## 12. CHARACTER APPEAL (first-class)
The source's people are stick figures: disc head r = 0.11 H, limbs one round-capped stroke 0.46 r wide, no face. They look good because of **pose**, not detail:
- Always a clear lean (躯干倾角) and a head angle; hands go somewhere meaningful (hip, holding a prop, up).
- Contrapposto: weight on one leg, other knee bent (`hip`, `akimbo`).
- Person = 1/4–1/3 of frame height; never centered with nothing around — give them a prop to hold or face.
- Sage = robed silhouette with top-knot and staff for "the ancient".
- One cast per world: ink on paper, cream on night.
Honest status: our figures match the source's construction, but the source's best poses (t3.5 hand-on-hip handing an object) are a bit more refined than ours.

## 13. PROP GRAMMAR (for deriving new props)
1. Silhouette first: flat ink fill, readable at 120 px.
2. One material hint only (blade grey `#D9D4C6`, wood rings, glass lines).
3. One red accent at most (spark, seal, dashed line).
4. Pivot where a hand holds it, so `stick()` hand joints can carry it.
5. Must have one "verb" animation (write-on, follow, gleam, split, settle…).
### Coded props (props.js): 1 brushChar · 2 seal (look.js) · 3 splatter · 4 inkMountains · 5 pine · 6 crookedTree · 7 redSun · 8 water · 9 glassCup · 10 cleaver · 11 ox+gaps (people.js) · 12 block · 13 chips · 14 stump · 15 boat · 16 yinYang · 17 redDigits · 18 vertColumn · 19 dashedPath · 20 moon/sheep · 21 ruler/sandStream · 22 inkBloom/reeds.
### Prop-animation patterns (motion.js; filmstrip `stills/sheets/t_2.5.jpg`)
M1 bloomWipe (R ∝ k^1.7, soft 3-layer rim) · M2 brushWrite (per-char write-on + late splatter) · M3 sealStamp (1.5× press, lands at 0.55, halo) · M4 splatBurst · M5 settle (murk 1→0) · M6 pathFollow (dashedPath returns pt+ang; prop rides it) · M7 poseAt/blendPose (chop up→down, eased in) · M8 counterAt (7-seg flips on hits) · M9 sway · M10 captionIn · M11 gleam.
### Worked example — how `cleaver` was derived
Need: "a tool that wears out vs stays new". Silhouette: rectangle blade + short handle, recognizable at 60 px. Material hint: blade grey + 1 light edge on the cutting side. Red accent: none (sparks carry red). Pivot: grip at origin, blade along +x, edge on +y → `stick()` forearm angle drives it. Verb: `gleam` (light band sweeps the blade) for "像新磨的", and `nick` for worn knives. Test on paper and on night (`night:true` swaps blade tones).

## 14. BANs
Faces/eyes on figures · gold foil or neon · more than one red element per frame · photo textures · gradient sky backgrounds · busy borders/frames · fonts other than serif + brush · camera zooms · fast cuts without bloom · English on screen.
