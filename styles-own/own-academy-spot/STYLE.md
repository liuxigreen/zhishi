# Academy Spot · 暗室聚光 (own-academy-spot)

Our own style distilled frame-by-frame from Adelaide's reference: **zhongshan-learn (中山大学学习科学公开课风 · 发条狗 / 解释深度)**.
Frame cites use `zhongshan f_NNNNN` (fps2, t=(n-1)·0.5 s) or `scene s_000N`. Technique base: Lemo Canvas2D page contract (window.READY / render(t) / DUR / TEXTS). No source plot, caption or brand is reused.

## 1. Essence, and what it is not
A darkroom stage. One warm **top-light cone** (顶光锥) picks out a subject. People are **color-block pegs** (色块 peg：圆头 + 斗篷躯干，无四肢无五官). Props speak two languages: **solid flat colour** = the surface you see; **blueprint dashed lines** (蓝图线) = the deep structure underneath. The argument is always "look past the shell."
It is **not**: neon void (own-void-neon), gold foil museum (own-dark-gold), Emotion-UI overlays on real faces (own-emotion-ui), ink wash (own-tao-ink), or chalkboard doodle.

## 2. Materials & rendering
- **Void**: #0C0B0A → #1A1816 warm charcoal with dust flecks (zhongshan f_00013, scene s_0002; ~75 % of pixels dark).
- **Floor grid**: faint perspective hairlines rgba(120,100,70,.18) below y≈680 (f_00013).
- **Top-light cone**: feathered trapezoid + elliptical floor pool, gold #E5C07B @ 18–40 % (f_00013 pendant + pool; scene s_0002 right peg).
- **Pendant lamp**: trapezoid shade + cord + inner glow (f_00013).
- **Solid props**: flat fills (dog #D8634F, books muted), soft contact shadow, one rim light.
- **Blueprint props**: 1.5–1.8 px dashed #7EB8C9 / #A8D8E4, optional soft glow; never filled solid (f_00034 dog schema).
- **Cards / chips**: dark glass rgba(40,36,30,.78) + thin gold/blue border (f_00027 orbit boxes).

## 3. Colour logic
| role | hex | rule |
|---|---|---|
| void | #0C0B0A / #1A1816 | 70–80 % of every frame |
| expert / deep / quality | gold #E5C07B / hot #F5D89A | the one who asks why; principle; quality side of the scale |
| novice / surface / quantity | blue #A8C4D8 / hot #C6DCEB | the one stuck on brand/price; shallow cards |
| blueprint | #7EB8C9 | deep structure only |
| solid accent | red #D8634F (dog), tan #C4A882 (pedestal) | surface objects |
| text | #F4F0E8 / gold key / blue key | captions ≥4.5:1 on dark band |
Gold and blue are a **duo cast**, not decoration — they never swap roles mid-film.

## 4. Type & subtitles
- Caption: Noto Serif SC 700, 40 px, white on a soft dark band at y≈990; key words gold or blue (scene s_0002).
- Topic / brand chip: Sans 22 px in a dark pill with gold hairline (top-left).
- Orbit / card labels: Serif 16–20 px, matching cast colour border.
- Citations: Serif 18 px mute, bottom-right (Graesser-style).
- Big numerals (「6」): Serif 110 px, with a small vertical gloss line beside them (f_00027).

## 5. Motion quality
Source holds are calm; motion lives in orbits, morphs and the scale. Ease = outCubic arrivals, inOut morphs, outBack only for card pops. See `demo/motion.js`:
| pattern | id | use |
|---|---|---|
| Slow push 1.2 % | M1 slowPush | holds > 2 s |
| Text rise 16 px / 0.45 s | M2 textRise | captions |
| Breathe ±0.6 % | M3 breathe | idle pegs |
| Orbit spin | M4 orbitSpin | question rings, wheels |
| Blueprint morph solid→dash | M5 blueprintMorph | **native move** |
| Scale tip | M6 scaleTip | quality outweighs quantity |
| Ring ignite outer→inner | M7 ringIgnite | concentric understanding |
| Key wind | M8 keyWind | wind-up key |
| Dip through dark | M9 dipDark | world change |
| Caption in/out | M10 captionIn | captions |
| Walk cycle | M11 walkCycle | dog legs |
| Pop-in outBack | M12 popIn | cards, chips |

## 6. Camera grammar
Locked tripod, eye-level, wide. Subject under the cone on a third; text owns the other side or the top band. Depth = dust void / lit mid / floor grid. Cut only on a dipDark.

## 7. Sound palette
Warm D pad, soft felt piano, 76-ish BPM feel. SFX: card clicks on orbit, whoosh on dips, shimmer + glass ding on blueprint morph, soft thump + ding on scale tip, climb ticks on spiral steps. No voice. −14 LUFS via mux.sh.

## 8. Native moves
1. **Blueprint morph** — a solid prop dissolves into dashed blueprint lines; a spring/gear lights gold (f_00027→f_00034). Once per film.
2. **Question orbit** — shallow questions revolve on a dashed ellipse around a surface object (f_00027).
3. **Quality scale** — eight shallow cards vs one glowing「为什么」, beam tips to quality (scene s_0004).
4. **Ring climb** — concentric rings of understanding; expert climbs spiral steps while novice stays in the outer wheel (scene s_0001 / s_0005).

## 9. Pitfalls of the medium
- `shadowBlur` on large cones is slow — build cones with linear/radial gradients (`spotCone`).
- Peg body path must close through the foot curve or the fill leaks.
- Blueprint dash + glow: draw glow with solid stroke at low alpha first, then dashed on top, or dashes look broken.
- Readcheck: keep orbit card text static under one id; don't flip labels mid-hold.
- Sheets cannot import `../demo`; run `sh sheets/sync.sh` first.

## 10. Engine
`demo/look.js` palette, darkroom, cone, type · `demo/people.js` peg / duo / tinyPeg · `demo/props.js` 22 props · `demo/motion.js` named patterns · `demo/main.js` demo · `demo/music.py` score · `demo/build.sh` one command · `sheets/` (still.mjs t=0 people, t=1.5 props, t=2.5 patterns).

## 11. Variation space
Any topic where surface ≠ structure: 解释深度错觉, 专家 vs 新手问题, 表象学习, 原理迁移, 费曼技巧, 概念转变. Swap the solid prop (dog → bike → zipper → circuit); keep blue=surface, gold=deep. Use the scale for any quality-vs-quantity beat; rings for any layered model.

---

## 12. CHARACTER APPEAL (first-class)
**Honest note**: source people ARE pegs — sphere head + cloak body, no limbs, no faces (f_00013, f_00027, scene s_0002). That is the figure language of this family, not a failed stick figure. Appeal comes from:
1. **Proportion** — head R ≈ 0.115 H, body W ≈ 0.30 H, slight gap between head and cloak, taper to feet.
2. **Volume light** — coin-shaded head, vertical lit→shade on body, soft specular, aura under the cone.
3. **Cast colour** — novice blue vs expert gold never mix; glow intensity = who "gets it."
4. **Pose without limbs** — lean, nod, kneel (squat) are the only degrees of freedom; emotion = light + tilt.
Rules: never add faces, arms or legs; never turn pegs into chibi; never put a peg in Emotion-UI's kid cast. Character sheet: `stills/sheets/t_0.jpg`.
**Gap we still own**: source sometimes seats a peg with a triangular lap (f_00013 right); our kneel is a vertical squash, not a true sit. Expert glow in source can go near-white at the crown — we keep it readable gold.

## 13. PROP GRAMMAR (for deriving new props)
- **Two materials**: *solid* (flat fill + one rim + contact shadow) = surface; *blueprint* (dashed stroke + optional glow, no fill) = deep structure. A prop may exist in both states.
- **Silhouette**: ≤ 12 primitives; instantly readable at 120 px tall.
- **Line weight**: solid edges none or 1 px dark; blueprint 1.5–1.8 px; glow via layered alpha, not filters.
- **Shading**: max 3 layers — fill → shade side → one light event (cone, pool, key glow).
- **Colour**: surface accents may be red/tan; deep accents only gold/blueprint. One accent per prop.
- **Scale**: hand props 0.3–0.5 peg-H; stage props (dog, scale, rings) 0.8–1.5 peg-H.
- **Enter / transform / exit**: pop-in or fade-rise; **transform by material** (solid → blueprint) or by light; exit by dim into void or dipDark. Never slide across frame.
- **Meaning**: surface↔deep is a material change; quality↔quantity is a colour change (gold↔blue).

### Coded props (props.js): 1 windupDog · 2 windupKey · 3 blueprintDog · 4 spring · 5 gear · 6 questionOrbit · 7 calloutCard · 8 speechBubble · 9 concentricRings · 10 balanceScale · 11 shallowBlock · 12 whyRing · 13 zipper · 14 barCompare · 15 spiralSteps · 16 decisionWheel · 17 books · 18 knowledgeGraph · 19 gapGraph · 20 labelTag · 21 pedestal · 22 pencilPaper. Sheet: `stills/sheets/t_1.5.jpg`.

### Prop-animation patterns
P1 blueprintMorph (solid→dash + spring/gear light) · P2 questionOrbit spin · P3 scaleTip · P4 ringIgnite · P5 keyWind · P6 popIn cards · P7 walkCycle dog · P8 dipDark. Filmstrips: `stills/sheets/t_2.5.jpg`.

### How to derive a new prop — worked example: **zipper** (解释深度错觉)
1. Idea: "I thought I understood it." Plain object: a zipper. 2. Silhouette: vertical tape + V open + slider. 3. Material: blueprint (it's the *structure* of the claim). 4. Layers: dashed tape → teeth ticks → slider block. 5. Animation: open amount = how much you can actually explain; pair with barCompare (belief outline vs after fill). 6. Meaning: closed zipper = illusory depth; open + low bar = the drop after explaining. Next the same way: a bicycle schema (parts labelled), a circuit board with one gold path, a Russian-doll of nested boxes (表面→机制→原理).

## 14. BANs
- No faces, arms or legs on pegs; no chibi; no Emotion-UI eye/bracket overlays.
- No neon magenta / purple void; no gold foil texture (other families).
- Max one blueprintMorph per film; max one quality-scale tip per film.
- No copying source captions (「小蓝」「小金」as names are fine as cast labels; full lines are not), stories or school brand.
- No image/video generation; code draws everything.
