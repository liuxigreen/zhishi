# Dark Gold Line · 暗金线描 (own-dark-gold)

Our own style distilled frame-by-frame from Adelaide's references: **halo (叁号暗房《晕轮效应》)**, moyou-darkgold, ember-craving, xiaomo-disarm, moyou-percolation.
Frame cites use `clip tSEC` (full-res grabs in `templates-full/_analysis/hi/`) or `clip f_NNNNN` (fps2 stills, t=(n-1)·0.5 s).
Technique base: Lemo Canvas2D page contract (window.READY / render(t) / DUR / TEXTS). No source plot, character or layout is reused.

## 1. Essence, and what it is not
A black stage with one warm light. A few **anatomically real, faceless people** (profile busts, thin-line standing figures) and a few **precious ordinary objects** (a ring, a cup, a glass dome) carry a psychology idea. The light *is* the argument: what the brain overvalues glows gold (halo t5 ring, t25.5 lit hair-tie under glass); what is neutral stays a grey hairline (halo t51.5 observer, t10 crowd).
It is **not**: cartoon/kawaii, frontal faces with dot eyes and U-mouths (our old 样帧14 — see §12), flat infographic, neon cyberpunk (that is own-void-neon), or coloured illustration.

## 2. Materials & rendering
- **Void**: #050608–#0A0B10 with a soft warm radial pool toward the subject (halo measured luma 17.1, top cluster #050608 = 77 % of pixels).
- **Gold foil** (hero only): base #B39663, low-contrast mottling (2 scales), fine grain, rare bright specks, top-light gradient; edge stroke rgba(232,206,150,.55). Cite halo t5 (bust), t62 (foil bust glimpsed behind screen).
- **Hairline**: 1.3–1.8 px @1080p, warm grey rgba(214,204,186,.68); fill = void so figures occlude each other (halo t10, t62 crowd).
- **Glass**: outline + 3 % fill + one vertical specular streak + rim ellipse (halo t10, t25.5).
- **Light events**: ring bloom (core #FFE3A0 + 220 ticks + radial haze), top beam (feathered trapezoid, #D9C49A @ 16–22 %), floor hairline with elliptical pool (halo t25.5), cold archive screen #4A5260→#14171C with scanlines (halo t62).
- **Data** (moyou f_00004): extruded grey bars (#3A3B40→#55575E, top #6C6E76), one hot bar in gold, orange expectation line #F0A040.

## 3. Colour logic
| role | hex | rule |
|---|---|---|
| void | #070708 | 70–80 % of every frame |
| hairline | #D6CCBA @ 60–70 % | people & neutral props |
| gold | #E8B84A / hot #F5C84A / foil #B39663 | ONLY what is overvalued, desired, or the key word |
| cold | #4A5260 / #A8C4E8 | evidence, archive, the "real" past (halo t62) |
| risk | #C45A4A | only in state chips (our addition), never on characters |
Gold never exceeds ~12 % of the frame except the hero bust shot.

## 4. Type & subtitles
- Noto Serif SC 500, white #EEEBE4, 70–72 px, line height 1.56, left block at x=150, y≈350 (halo t5) **or** centred top at y≈150 (halo t10, t51.5).
- Key word: 700 weight, gold #F5C86E, bloom 26 px, ignites 0.55 s after its line lands (halo t5 「美化」, t10 「趋之若鹜」).
- Topic block top-left: CN 40 px bold + italic EN 19 px (halo t25.5 「晕轮效应 / The Halo Effect」). Brand box top-right, letter-spaced 22 px in a hairline rect (ours reads 知 识 大 赏).
- Citations: italic serif 30 px under the evidence frame (halo t62 「Nisbett & Wilson, 1977」).

## 5. Motion quality
Measured halo ORB classes: ~71 % static holds, ~22 % slow push, ~7 % cuts. Everything breathes, nothing snaps except label pops. Ease = outCubic for arrivals, inOut for light, outBack only for tags/bubbles. See `demo/motion.js`:
| pattern | id | use |
|---|---|---|
| Slow push 1.0–1.8 %/s | M1 slowPush | every hold > 2 s |
| Text rise 18 px / 0.5 s, stagger 0.18 s | M2 textRise | every caption line |
| Key-word ignite | M3 keyIgnite | one per caption |
| Ring ignite (arc draw-on 0.8 s + flash) | M4 ringIgnite | the native move, once |
| Breathe 0.6 % / 4 s | M5 breathe | heroes never fully still |
| Lift reveal with anticipation dip | M6 liftReveal | domes, lids, curtains |
| Label snap (outBack + thread) | M7 labelSnap | tags attaching to a person |
| Crowd sway ±2° phase-shifted | M8 sway | extras (secondary motion) |
| Posture blend neutral→hopeful→enchanted / doubt→ashamed | M9 pose | character acting |
| Dip through void 0.35+0.35 s | T1 dipVoid | world change |
| Light bloom wipe from the shot's light source | T2 bloomWipe | after the native move |
| Match scale (circle→circle) | T3 matchScale | ring→clock→dial chains |
Particles: gold dust drift (M-FX1 goldDust), rising ice motes (M-FX2 crystalColumn), screen scan-roll (M-FX3 in archiveScreen).

## 6. Camera grammar
Locked tripod + slow push toward the subject's head or the lit object (halo t5→t10). No handheld, no orbit. Subject sits on a third (bust at x≈1290); text owns the other side. Depth = 3 planes: crowd foreground silhouettes (dark, occluding) / lit subject mid / void + dust back (halo t10, t62). Cut only on a light change.

## 7. Sound palette
Warm pad in D minor 76 BPM, sparse felt piano, sub swell; SFX are glass/light: shimmer on ignite, whoosh on bloom wipe, glass ding on precious objects, soft ticks on counters, low thump on void dips, pops for tags. No voice in the demo. Master −14 LUFS via mux.sh.

## 8. Native moves
1. **Halo ignite** — a ring draws itself around a head, ticks flare, the foil warms (halo t5/t12). Once per film.
2. **Museum-ing** — an ordinary object goes under a glass dome in a beam while the crowd raises lit phones (halo t10, t25.5).
3. **Veil between two people** — rising ice motes separate the plain observer and the gilded idol (halo t51.5).
4. **Archive window** — a cold scanline screen with a period figure and an italic citation (halo t62).

## 9. Pitfalls of the medium
- Canvas `shadowBlur` is slow on large fills — bloom with layered strokes (`glowStroke`).
- Head-frame vs body-frame bezier joins kink when the head scales/tilts: always join with a control point in the head frame (fixed in bustPath).
- Profile tilt sign flips with facing: `angle = tilt × f` (+tilt = chin up either way).
- Foil pattern is cached once per page — keep deterministic seeds.
- Thin hairlines alias below 1.2 px; never go under that at 1080p.

## 10. Engine
`demo/look.js` palette & light · `demo/people.js` bust/figure/crowd/tinyFigure · `demo/props.js` 19 props · `demo/motion.js` named patterns · `demo/main.js` the demo · `demo/music.py` score · `demo/build.sh` one command · `sheets/` people & prop reference sheets (render with still.mjs t=0 / t=1.5).

## 11. Variation space
Swap the idea, keep the stage: any bias where "something is overvalued" (光环, 曝光, 禀赋, 沉没成本, 锚定). Hero can be a bust, an object, a number. Gold can migrate between people/objects to show where value moves. Cold archive windows carry evidence. Data scenes use bars3d + expectation line (moyou f_00004) or clock (ember f_00002).

---

## 12. CHARACTER APPEAL (first-class)
**Before/after proof**: `stills/head-compare.jpg`, `stills/before-after-halo.jpg` (our old 样帧14 光环效应 · source halo t5 · new template).
Why the old one looked ugly: frontal egg head, two dot eyes + U smile + flat brows (sticker face), neck a rectangle, shoulders a dome — it reads as a child's icon, and the face fights the halo for attention.
Why the source looks attractive (halo t5, t51.5, t62):
1. **Profile, not frontal** — nose bump, lip notch, chin and a bun give identity with zero facial features.
2. **Real proportion** — head ≈ ½ shoulder width, cranium wider than tall at the back, short neck, trapezius slope then round deltoid; standing figures head = 1/7.6 of height, arms separated by a hairline gap.
3. **Material over features** — the hero is gold foil; extras are a single hairline. Attention goes to the light, not the face.
4. **Emotion by posture + light** — chin up into the light = enchanted; chin down + shoulders sink = doubt/shame (M9 POSES); eye (single lash arc, only when in profile) open/closed/down.
Rules: never draw dot eyes or U-mouths; never frontal faces in this family; if a close-up needs a face, use profile lash arc + brow; both eyes only in a frontal close-up and then as lash arcs with brows. `sheets/` t=0 is the character sheet (5 poses × bust, figure, crowd, tiny diagram figure).

## 13. PROP GRAMMAR (for deriving new props)
- **Silhouette**: one closed, instantly-recognisable outline in ≤ 12 bezier segments; symmetric objects drawn centred on a vertical axis.
- **Line weight**: body 1.3–1.5 px cream; lit edge 2–5 px gold via glowStroke; never more than 2 weights in one prop.
- **Shading layers** (max 3): ① void fill or 3 % glass fill → ② hairline → ③ ONE light event (bloom, specular streak, inner glow, scanline). Foil material only for hero props.
- **Detail density**: 1 secondary detail per prop (knob on dome, ticks on ring, handle on cup). If you need 2, the prop is too busy.
- **Scale vs character**: hand props 0.25–0.4 head height; stage props (dome, pedestal) 1–2 head heights; idea props (ring, screen) may exceed the head but frame it.
- **Enter / transform / exit**: enter by draw-on (dash) or fade-rise; transform by light (dim → gold, cold → warm, grey → foil) or by lift/reveal; exit by dimming into void or by bloom-wipe. Never slide props across frame.
- **Meaning / state change**: value = brightness. A prop changes meaning when its light changes (cup grey → gold under glass = "made precious"); tags/chips name the state (our addition: anticipation / peak / decay / risk / ok).

### Coded props (props.js): 1 haloRing · 2 goldDust · 3 beam · 4 floor · 5 cloche · 6 pedestal · 7 treasure(ring/cup) · 8 archiveScreen · 9 crystalColumn · 10 labelTag · 11 bars3d · 12 clock · 13 bubble · 14 frameStack · 15 counter · 16 balance (ember f_00053) · 17 drop (ember f_00040) · 18 door (xiaomo f_00070) · 19 brain (moyou f_00021) (+ stateChip in look.js). Prop sheets: `sheets/` t=1.5 (1–15) and t=2.5 (16–19 with before→after states + the value-is-light ladder 普通→在意→珍宝).

### Prop-animation patterns
P1 draw-on (ring, clock, expectation line) · P2 light-promote (grey→gold: treasure k) · P3 lift-reveal with anticipation (cloche) · P4 snap-attach with thread (labelTag) · P5 stack-accumulate (frameStack + counter) · P6 rise/drift particles (goldDust, crystalColumn) · P7 scan-roll for evidence (archiveScreen) · P8 tip/weigh (balance tilt) · P9 fill-up (drop k) · P10 hinge-open with light leak (door k) · P11 region-fire (brain k).

### How to derive a new prop — worked example: **frameStack** ("seen many times")
1. Idea: "repetition". Find the plain object: a photo card. 2. Silhouette: rounded rect. 3. Layers: void fill → hairline → gold edge on the front card only (the one that is liked). 4. Detail: offset ghosts (16 px up-right, alpha falling) — the one secondary detail. 5. Animation: P5 accumulate — the count grows with k; pair with counter. 6. Meaning: ghosts stay grey (neutral exposures), the front card turns gold (the liking). Result: `props.js` #14, used in demo world 3.
Try next the same way: a gilded key (禀赋效应), an hourglass whose sand turns gold (沉没成本), a price tag anchored by a thread (锚定).

## 14. BANs
- No cartoon faces (dot eyes, U-mouth), no frontal hero faces, no chibi proportions.
- No saturated colours other than gold; no blue/purple neon (other family).
- No more than one ring ignite per film; no more than 3 gold objects per frame.
- No sliding props, no bouncing text; tags are the only outBack.
- No copying source captions, story beats, brand (叁号暗房) or exact layouts.
- No image/video generation; code draws everything.
