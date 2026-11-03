# Void Neon · 虚空霓虹 (own-void-neon)

Distilled frame-by-frame from Adelaide's references: **5155-keep-effort**, **0345-info-theory**, **3785-buffon**, **9472-nipt-dna**, plus supporting void stages from 1643 / 7098 / 0490 / 6810 / 8134 / 1521.
Frame cites use `clip tSEC` (fps2 stills, t=(n-1)·0.5 s). Technique: Lemo Canvas2D page contract. No source plot, character, layout or brand reused.

## 1. Essence, and what it is not
A **deep-purple / near-black void**. Ideas appear as **self-lit wire props** (monitor, number-scale, dice, DNA, circle-pyramid) and **faceless peg or particle people**. Meaning travels through **which edge or node lights up** — neon white for presence, magenta for the insight that just connected.
It is **not**: dark-gold foil museum (own-dark-gold), warm sepia history (own-lailong-sil), sticker emotion faces, flat pastel infographic, or solid-filled 3D.

## 2. Materials & rendering
- **Void**: #030108→#0B061A with a soft violet nebula (5155 t6.5 measured top clusters #030108/#130B2A; luma 36, sat 194). Sparse star dust.
- **Neon hairline**: 1.2–1.8 px @1080p, lavender-white #E8E0F4, bloom via layered strokes (never CSS filters).
- **Horizon floor**: thin glowing line + bokeh orbs along it (5155 t6.5) — signature stage for UI props.
- **Warm cream data**: #E7DDC7 for math/probability props (0345 t48 scale, 3785 wheel) sitting in the same void.
- **Bio light**: cyan outline + crimson internal paths for particle people (9472 t7).
- **Paper cards**: off-white #EDE6D8 with brown ink — the only solid fill allowed at large size (7098 / 1643 records).

## 3. Colour logic
| role | hex | rule |
|---|---|---|
| void | #030108 / #0B061A | ≥70 % of every frame |
| neon | #E8E0F4 | presence, wire, UI |
| magenta | #E87AB0 | insight / connected / key word |
| cyan | #7EC8E8 | secondary axis, particle people, probe state |
| cream | #E7DDC7 | math props (scale, wheel, tree, needles) |
| bio | #E06080 | heart / DNA / droplet |
| mute | #666072 | unlit crowd, dormant edges |
Magenta never exceeds ~10 % of the frame except during an insight flash.

## 4. Type & subtitles
- Noto Serif SC 500, #DFD8E4, 30–32 px, centred bottom y≈960–1000.
- Key word: 700 weight, magenta, ignites ~0.5 s after the line lands.
- Topic / day marks top-left (5155 「第 90 天 / DAY 90」 pattern) — serif CN + Inter Tight EN.
- Small HUD labels: Inter Tight 14–16 px, letter-spaced, mute or neon.
- Brand box top-right hairline rect 「知 识 大 赏」.

## 5. Motion quality
Sources hold ~30–60 % of the time; element-motion (draw-on arcs, waveform, cascade) is the life. Ease = outCubic arrivals, inOut for wires, outBack only for chips/wordChips.
| pattern | id | use |
|---|---|---|
| Slow push 1.0–1.2 %/s | M1 | every hold > 2 s |
| Text rise | M2 | every caption |
| Key-word ignite → magenta | M3 | one per caption |
| Wire draw-on | M4 | monitors, scales, wheels, trees |
| Breathe | M5 | heroes / pyramids |
| Orb pulse | M6 | ? mark, nodes |
| **Insight flash (ours)** | M7 | cascade k through graph + magenta bloom |
| Label snap | M8 | wordChips / tags |
| Posture blend | M9 | peg / particle acting |
| Dip through void | T1 | world change |
| Magenta+cyan bloom wipe | T2 | after insight |
| Match node (circle→circle) | T3 | pyramid ↔ cascade |

## 6. Camera grammar
Locked tripod + slow push toward the lit prop or the particle head. Subject centred or on a third; vast negative space. Depth = void dust / mid prop / optional foreground peg. Cut only on a void dip or bloom wipe.

## 7. Sound palette
Cool pad in A-minor colour at 78 BPM, soft bells, sub; SFX = whoosh on wire enter, click on chips, thump on void dips, shimmer on insight, pops on cascade nodes. No voice. Master −14 LUFS.

## 8. Native moves
1. **Monitor on horizon** — neon CRT/TV stands on the glowing floor line; CC badge; waveform (5155 t6.5).
2. **Orb on a scale** — cream number-line with a soft ? halo at the unknown (0345 t48).
3. **Circle pyramid** — 1+2+3+4 neon rings; three light magenta when the insight lands (5155 t86).
4. **Particle body with bio glow** — point-cloud silhouette, heart/brain lit (9472 t7).
5. **Insight cascade (ours)** — dormant mute nodes → cyan → magenta as edges connect in sequence.

## 9. Pitfalls of the medium
- Bloom via layered strokes, not `shadowBlur` on large fills.
- Purple void must stay dark: nebula alpha ≤ 0.35 or it turns into a purple wash.
- Peg heads are ellipses, not circles — slightly taller reads more human (7098).
- Particle silhouette needs a deterministic seed or it flickers across frames.
- Cream math props and magenta neon can coexist; never mix gold foil (other family).

## 10. Engine
`demo/look.js` · `demo/people.js` (peg / particle / crowd) · `demo/props.js` (14 props) · `demo/motion.js` · `demo/main.js` · `demo/music.py` · `demo/build.sh` · `sheets/` character + two prop sheets.

## 11. Variation space
Any topic where "something connects in the dark": information, probability, learning plateaus, biology/DNA, insight problems. Swap the hero prop (monitor / scale / pyramid / DNA / tree); keep void + neon + magenta-for-connection.

---

## 12. CHARACTER APPEAL (first-class)
**Before risk**: the same sticker-face trap as 光环效应 — frontal eggs with dots. This family never draws faces.
**Why sources look right:**
1. **Peg people (7098)** — round head + bell body, no features; emotion from lean/tilt and a pointing arm.
2. **Particle people (9472)** — recognised by silhouette + bun + internal bio light; identity without a face.
3. **Proportion** — peg head ≈ 1/7–1/8 of height; particle figure has readable shoulders and skirt A-line, not chibi.
4. **Emotion** = posture (M9) + which nodes glow (stuck mute / flash magenta).
Rules: never dots or U-mouths; never frontal feature faces; crowds stay mute until lit. Sheet t=0.

## 13. PROP GRAMMAR
- **Silhouette**: closed wire outline ≤ 12 segments; UI props double-stroke (outer + inset).
- **Line weight**: body 1.2–1.6 px neon/cream; lit edge 2–2.4 px magenta via glowStroke.
- **Shading**: void (or 3 % fill) → hairline → ONE light event (bloom node, waveform, orb).
- **Detail density**: 1 secondary (CC badge, pip, rung). If you need 2, split the prop.
- **Scale**: hand props 0.3 head; stage props (monitor, scale, pyramid) dominate the frame.
- **Enter / transform / exit**: draw-on enter; transform = mute→neon→magenta; exit = dim into void.
- **Meaning**: **connection = magenta**. Unlit = mute grey. Probe = cyan.

### Coded props
1 monitor · 2 numberScale · 3 orbMark · 4 circlePyramid · 5 dice · 6 probWheel · 7 probTree · 8 dnaHelix · 9 graphArc · 10 paperCard · 11 droplet · 12 wordChip · 13 needleBoard · 14 linkCascade (+ horizon, stateChip).

### Prop-animation patterns
P1 draw-on · P2 node-ignite (mute→magenta) · P3 orb-pulse · P4 waveform live · P5 pyramid re-light · P6 cascade sequence (ours) · P7 paper fade-up · P8 needle drop · P9 helix phase · P10 wordChip snap.

### How to derive a new prop — worked example: **linkCascade**
1. Idea: "insight = connection". 2. Silhouette: circles + segments. 3. Layers: mute stroke → cyan when approached → magenta when on. 4. Detail: one hot node with label. 5. Animation: P6 — k progresses, edges light in order. 6. Meaning: before = stuck graph, after = path. Result: props.js #14, demo world 4.
Try next: a CRT with rolling scan (learning input), a bookshelf wire that loses dust when a book is pulled (curse of knowledge inverse).

## 14. BANs
- No sticker faces; no gold foil museum language (other family).
- No saturated green/orange; magenta + cyan + cream only as accents.
- No more than one insight flash per film; no more than 3 magenta objects per frame at rest.
- No sliding props; chips/wordChips are the only outBack.
- No copying source captions, puzzles' exact wording as brand, or layouts 1:1 as a finished film (styleframe still may match a source composition for proof).
- Code draws everything; OFL/CC0/CC BY assets only.
