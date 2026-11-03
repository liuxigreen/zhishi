# Bite Red Queen · 比特红皇后 (own-bite-red)

Near-black stage. Semantic red marks effort-that-goes-nowhere. Stick runners and race gadgets carry the proof. White serif tells the rule.

## 1. Essence, and what it is not
A **relative-adaptation** look: you run harder, the world runs with you, the gap stays locked — until you pick a different vector. Merges 比特新语「红皇后」+「熵增」(0762) void/data-body.
It is **not** Void Neon (purple wire), not Dark Gold (warm spotlight psychology), not Lailong (paper-puppet history).

## 2. Materials & rendering
- Bed: `#0A0A0A` + fine grain; optional red radial wash (never purple, never gold-as-primary).
- Gadgets: solid enough to read at a glance (checkerboard volume, oval ring, stair blocks) — not hairline schematics pretending to be props.
- Glow: red bloom on trap/effort; white/HUD cyan only when the subject **exits** the arms race.
- 0762 gold is reserved for *work/order* accents (dust shaft, order sphere, caring spark) — never as DualMark.

## 3. Colour logic
| Role | Hex | Use |
|---|---|---|
| void | `#0A0A0A` | bed |
| red | `#E23B3B` | trap keywords, runner effort, gap lock |
| redHot | `#FF2A2A` | lock / alarm |
| white | `#F5F5F5` | body type, prey, stage figure |
| hud | `#B8D4E8` | direction fork, exit vector |
| gold | `#E0B85A` | 0762 work/order only |
| mute/cite | `#6A6A6A` / `#8A8A8A` | HUD labels, footer |

## 4. Type & subtitles
- Hero: Noto Serif SC 700, white, 42–52 px, **top-left**; DualMark red on trap words (原地 / 锁死 / 速度 / 方向).
- HUD: Inter Tight, top-right or mid panel; DISPLACEMENT goes red when ≈ 0.
- No bottom karaoke bar. Source footer bottom-left 「据××·示意」.

## 5. Motion quality
- Runner **stride** cycle (not a frozen pose).
- Oval dots orbit; multipliers climb; **relativeGapLock** breathes while value stays 0.
- Stair crowd lights one step red at a time.
- Exit: **directionFork** draws white/HUD vector; runner colour cools from red → HUD.
- Hard dips at world cuts; optional redBloom on mechanism→human cut.

## 6. Camera grammar
Static + slowPush (≤1%/s). No handheld. Density = state change of gadgets, not cut rate.

## 7. Sound palette
Dark Am pulse, stride footfalls, lock click + short alarm, stair ticks, fork whoosh + bright chime. −14 LUFS.

## 8. Native moves
1. **relativeGapLock** — gap bar locked at 0 while both sides × climb.
2. **directionFork** — leave the red track onto your own vector; displacement finally moves.
3. **zeroMarker** — dashed x=0 through the sprinting body.
4. HUD trap — DISPLACEMENT lit red at 0.00.

## 9. Pitfalls of the medium
- Copying source runner/cheetah/stairs shot 1:1 as brand twin (LOOK-CARD BAN).
- Purple void bleed from Void Neon.
- Gold DualMark (that's Dark Gold / 0762 work, not trap).
- Face dots / smile arcs on sticks.
- Bottom karaoke restating the hero.

## 10. Engine
`demo/look.js` · `demo/people.js` (stick / stairCrowd) · `demo/props.js` (17 props) · `demo/motion.js` · `demo/main.js` · `demo/music.py` · `demo/build.sh` · `sheets/`.

## 11. Variation space
Evolution arms race · credential inflation · entropy/work (0762 dust room) · “stop and look at the stars” exit · any “running to stand still” thesis.

## 12. CHARACTER APPEAL (first-class)
- **Filled data-body** matching redqueen t0:04 — solid head disc, thick neck, volumetric torso, thick limb capsules with elbows/knees. NOT a stick/line figure.
- Head ≈ 1/7–1/8 of height; shoulders wider than hips; athletic running proportions.
- Soft outer bloom + optional motion trails; **one** glow colour.
- Pose verbs: sprint / lean / lookUp / sit / fork — emotion without a face.
- Hands or feet must read against a prop (treadmill, stair, fork vector).
- Stair figures: most white, **one** red lit — hierarchy at a glance.
- BAN: thin stick limbs, emoji faces, smile arcs, random third accent colour on body.

## 13. PROP GRAMMAR
- Black stage → **one** red light event per beat.
- Trap/effort = red bloom; exit/direction = white/HUD.
- Gadgets have volume (floor tiles, stair blocks, tube glass), not only strokes.
- Derive-new: name the *invariant* (gap, stage, dust) and give it a lock/pulse state.

### Coded props
treadmillFloor · hudTelemetry · ovalTrack · racePair · relativeGapLock · speciesNet · credentialStairs · stageSpot · fossilBranch · gauseTube · titleGlyph · directionFork · dustRoom · orderSphere · workSpark · starExit · zeroMarker

### Prop-animation patterns
1. Stride-on-treadmill + HUD trap  
2. Dual climb + gap lock pulse  
3. Stair light-up cascade  
4. Fork vector draw + colour cool  
5. Dust shaft / order sphere settle (0762)

### How to derive a new prop — worked example: **relativeGapLock**
Source shows “差距 不变” as type. We promote it to a **first-class gadget**: a barred meter that refuses to fill, with a lock glyph and breath, while multipliers on both sides keep rising. Any AI reading this template can mint `salaryLock`, `rankLock`, `attentionLock` the same way — name the invariant, draw the empty meter, pulse the refusal.

## 14. BANs
- Twin of source runner/猎豹/学历楼梯 frames as brand identity.
- Purple bed, gold DualMark, bottom karaoke.
- Face features on sticks; third semantic body colour.
- Soft handheld / long dissolve as default grammar.
