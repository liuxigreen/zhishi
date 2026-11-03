# Lailong Silhouette History · 来龙剪影史 (own-lailong-sil)

Distilled frame-by-frame from Adelaide's references: **5918-tang-beacon**, **5364-war-signals**, **2217-imperial-seal**, **3678-changan-drum**, **zhaoyun**, **xuanzang**.
Frame cites use `clip tSEC` (fps2 stills, t=(n-1)·0.5 s). Technique: Lemo Canvas2D page contract. No source plot, character, layout or brand reused.

## 1. Essence, and what it is not
A **warm-brown night stage**. History appears as **paper-puppet silhouettes** (cream fill, black hats, no faces) standing in **CourtLamp** or **TopoMap** beds, with **institution props** (beacon, drum, seal, scroll, horse) that **carry the argument by changing state**. Fire-gold lights what is present; mark-red lights conflict or absence.
It is **not**: dark-gold foil museum (own-dark-gold), purple void neon (own-void-neon), flat pastel infographic, cartoon faces, or modern HUD chrome on a history bed.

## 2. Materials & rendering
- **Earth void**: #100C09 → #1A120C with a soft warm vignette (5918 palette #0D0B0A/#201A12; zhaoyun warmer #302219). Sparse stars only for night exteriors.
- **Paper puppet**: flat cream #EDE6D8 / white fill, 1.2–1.6 px warm-grey outline; black hat / hair block for rank. No facial features.
- **Fire material**: layered radial gold→orange (#F5D080 → #E07030), bloom via stacked alpha discs + ember particles (5918 t7.5 / f_015).
- **Topo map bed**: embossed brown relief (#2B1D13 ridges, #3A2A1C mid), path as dashed cream/gold dots.
- **Jade / seal glow**: cool teal-white #B8D4C8 with soft bloom (2217) — the only cool accent allowed.
- **Scroll / book**: cream paper + brown ink; DualMark underline in blue or red.
- **SourceFooter**: tiny grey 「据×× · 示意」 bottom-centre every world.

## 3. Colour logic
| role | hex | rule |
|---|---|---|
| earth void | #100C09 / #1A120C | ≥60 % of every frame |
| cream paper | #F5F0E6 | hero text, puppet fill |
| fire gold | #E0B85A / #FF8C00 | lit signals, path points, motive |
| mark blue | #6BA3C9 | fact / number underline |
| mark red | #C45C4A | conflict / absence / punishment |
| jade | #B8D4C8 | seal / sacred object only |
| robe orange | #C45C2A | monk identity |
| cite grey | #8A8078 | SourceFooter |
| mute | #5A4A3A | dormant towers, unlit crowd |
Fire-gold never floods the frame; one lit cluster per beat. Mark-red is reserved for the flip.

## 4. Type & subtitles
- Hero: Noto Serif SC 700, cream, 42–56 px, **top-left** (5918 / zhaoyun grammar) — NOT bottom-centre karaoke.
- DualMark: same line, keyword painted mark-blue (fact) or mark-red (conflict) + double underline.
- Labels on props: Inter Tight / Noto Serif SC 16–20 px, cream or gold.
- SourceFooter: 14 px cite grey, bottom centre.
- Brand box top-right hairline 「知 识 大 赏」.
- Mode is `silent_text_first`: no bottom VO strip.

## 5. Motion quality
Sources hold ~60–70 % of the time (5918 static+element-motion 0.69); life = fire flicker, smoke rise, path draw, torch ladder. Ease = outCubic arrivals, inOut for paths, settle for seal land.
| pattern | id | use |
|---|---|---|
| Slow push 0.8–1.2 %/s | M1 | every hold > 2 s |
| Text rise (from below, top-left) | M2 | every hero line |
| DualMark ignite | M3 | keyword colour + underline |
| Fire flicker | M4 | every lit torch |
| Smoke rise | M5 | day tubes |
| Torch ladder (ours-ready) | M6 | 1→2→3→4 fires light in order |
| Path draw-on | M7 | topo dashed route |
| **Absent pulse (ours)** | M8 | hollow red ring where fire should be |
| Posture blend | M9 | puppet acting / prop contact |
| Dip through brown | T1 | world change |
| Fire bloom wipe | T2 | after a lit reveal |
| Match tower (silhouette→silhouette) | T3 | lonely tower ↔ ladder |

## 6. Camera grammar
Locked tripod or very slow push toward the lit prop / looking puppet. Side-on stage or slight three-quarter. Depth = void dust / mid architecture / optional foreground pillar. Cut only on a brown dip or fire bloom.

## 7. Sound palette
Warm pad in D-minor colour at 72 BPM, soft wood-block ticks, low drum; SFX = whoosh on enter, crackle on fire light, thud on seal/drum, hollow wind on absent pulse, soft chime on DualMark. No voice. Master −14 LUFS.

## 8. Native moves
1. **Lonely beacon under moon** — one tower silhouette, crescent, faint base glow (5918 t0).
2. **Torch ladder** — 1..N fires light in sequence; numerals under each (5918 f_015 / t22.5).
3. **Peace path on topo** — dashed gold dots travel border→capital; empty ring = 平安没来 (5918 t45–67).
4. **CourtLamp stage** — red pillar + standing lamp + puppet contacting a prop (zhaoyun t0 / t72).
5. **AbsentSignal (ours)** — hollow mark-red ring + chip「没来」where a fire should sit; negative evidence as a first-class prop.

## 9. Pitfalls of the medium
- Puppets must stay flat cream with ONE outline weight; shading gradients turn them into plastic toys.
- Fire bloom via layered discs, not `shadowBlur` on large fills.
- Hero text stays top-left; drifting it to bottom karaoke breaks the family.
- Do not mix magenta neon or gold foil (other families).
- SourceFooter 「示意」 must survive every world — never claim archaeological exactness.

## 10. Engine
`demo/look.js` · `demo/people.js` (puppet / court / rider / crowd) · `demo/props.js` (14 props) · `demo/motion.js` · `demo/main.js` · `demo/music.py` · `demo/build.sh` · `sheets/` character + two prop sheets.

## 11. Variation space
Any topic where **an institution or object carries the argument**: signal systems, seals of office, curfew drums, passport / paperwork, textbook vs novel, "one sentence that travels two thousand li". Swap the hero prop (beacon / seal / drum / scroll / horse); keep earth void + cream puppet + fire-gold presence + mark-red absence.

---

## 12. CHARACTER APPEAL (first-class)
**Before risk**: sticker faces and egg-heads (光环 trap). This family never draws faces.
**Why sources look right:**
1. **Paper puppets (zhaoyun / xuanzang / 2217)** — cream geometric body, black hat block for rank (mianguan beads, soldier helm, monk bump); identity without a face.
2. **Proportion** — head ≈ 1/6–1/7 of height; shoulders readable; robe A-line; not chibi.
3. **Emotion** = posture (M9) + **prop contact** (hand on chest / scroll / tray / lamp) — Prop-acting A from STYLE-BASE.
4. **Rank colour** — black hat = court; robe orange = monk; mute grey = crowd extras.
Rules: never dots or U-mouths; never frontal feature faces; extras stay mute until a light event. Sheet t=0.

## 13. PROP GRAMMAR
- **Silhouette**: closed flat shape ≤ 14 segments; architecture reads as trapezoid + crenellation.
- **Line weight**: body 1.2–1.6 px warm grey; lit rim 2 px fire-gold via glowStroke.
- **Shading**: flat fill → ONE light event (fire bloom, seal jade, lamp).
- **Detail density**: 1 secondary (ladder rung, arch door, numeral). If you need 2, split the prop.
- **Scale**: hand props 0.4 head; stage props (beacon, topo, seal close-up) dominate.
- **Enter / transform / exit**: fade-up or draw-on enter; transform = mute→fire-gold (or →mark-red for absence); exit = dim into earth.
- **Meaning**: **presence = fire-gold**. **Absence / conflict = mark-red hollow**. Fact underline = mark-blue.

### Coded props
1 beaconTower · 2 torchFire · 3 smokePlume · 4 topoMap · 5 peacePath · 6 imperialSeal · 7 nightDrum · 8 horseRider · 9 scrollBook · 10 courtLamp · 11 redLantern · 12 steelyard · 13 codeStamp · 14 **absentSignal** (+ signalChip 平安/告警/缺席).

### Prop-animation patterns
P1 fade-up · P2 fire-flicker · P3 smoke-rise · P4 torch-ladder sequence · P5 path-draw · P6 seal-land settle · P7 drum-pulse · P8 scroll-unroll · P9 lamp-breathe · P10 **absent-pulse** (ours).

### How to derive a new prop — worked example: **absentSignal**
1. Idea: "the scariest message is the one that did not arrive" (5918 t62 平安火不至). 2. Silhouette: hollow ring where a torchFire would sit, same footprint. 3. Layers: mute tower → mark-red dashed ring → chip「没来」. 4. Detail: one soft inward arrow. 5. Animation: P10 — ring breathes, chip snaps. 6. Meaning: before = expected fire, after = negative evidence. Result: props.js #14, demo world 4.
Try next: a curfew drum that stops mid-beat (silence as signal); a seal whose jade glow dies when authority leaves the hand.

## 14. BANs
- No sticker faces; no purple neon / gold foil (other families).
- No bottom VO karaoke strip; hero stays top-left.
- No more than one Absent pulse per film; no more than 3 fire clusters at rest.
- No sliding props; chips are the only outBack.
- No copying source captions, Exact《烽式》layout as a finished film (styleframe still may match a source composition for proof).
- Code draws everything; OFL/CC0/CC BY assets only. Keep SourceFooter 「示意」.
