# Speed Seq · 节拍序列 (own-speed-seq)

Our own style distilled frame-by-frame from Adelaide's reference **0594-speedrun** (速通主义 · rhythm / genre explainer).
Frame cites use `0594 tSEC` (fps2 stills in `templates-full/_analysis/frames/0594-speedrun/`, t = (n)·0.5 s).
Technique base: Lemo Canvas2D page contract (window.READY / render(t) / DUR / TEXTS). No source plot, brand (@速通主义) or exact layout is reused.

## 1. Essence, and what it is not
A **beige paper board** (or a dark stage) with a **persistent bottom sequencer**. Above: wooden-puppet people and a few music props. The playhead is the argument — what it hits is "on the beat"; what sits in the gap is syncopation.
It is **not**: neon cyberpunk (own-void-neon), gold museum psychology (own-dark-gold), emotion-UI overlays (own-emotion-ui), ink scroll (own-tao-ink), or a photoreal band video. People are geometric puppets on purpose.

## 2. Materials & rendering
- **Paper board** (0594 t18): #EDE7DA with faint vertical fibre + corner registration crosses.
- **Stage void** (0594 t91 / t146 / t529): #1A1016 / plum #2D1B33 / burgundy #2A0A16, soft vignette, floor hairline.
- **Sequencer chrome**: beige dual-rail on paper worlds; dark DAW with gold/disco neon rails on stage worlds (0594 every frame).
- **Accent**: orange-red #E85A2A for playhead, key words, active hits.
- **Puppet material**: peach/cream/brown disc head, limb strokes with **visible joint circles**, flat costume fill with a soft L→R gradient.
- **Grain**: light film grain on every world so flat vector stays tactile.

## 3. Colour logic
| role | hex | rule |
|---|---|---|
| paper | #EDE7DA | tech / explain worlds |
| ink | #1A1714 | type + puppet outline weight |
| accent | #E85A2A / hot #FF7A3C | playhead, key word, active hit ONLY |
| gold | #E8C56A | waltz / chandelier / 3/4 chip |
| candy | pink/cyan/yellow/orange/purple | disco costumes + floor tiles |
| stage | #1A1016 / #2D1B33 / #2A0A16 | performance worlds |
| seq beige | #E8DCC4 | dark-theme sequencer marks |
Accent never floods the frame — one playhead + key word + the hit under the head.

## 4. Type & subtitles
- Caption: Noto Sans SC 700, 42–44 px; ink on paper / cream on stage (stage gets a soft dark pill behind the line). Key word 800 weight in accent.
- Chapter number top-left: 01 / 02… 800 weight (0594 t18).
- Chips: time signature `3/4` / `BPM` pills.
- Sequencer labels: Geist Mono 22 px.
- Contrast: ink on paper ≈ 12:1; cream on dark pill ≥ 4.5:1. Brand watermark from source is NOT copied.

## 5. Motion quality
Source holds a scene for several seconds while the playhead runs; people shift pose on the beat. Ease = outCubic for arrivals, inOut for dips. See `demo/motion.js`:
| pattern | id | use |
|---|---|---|
| Continuous playhead 0..1 | playheadAt | every world (same BPM clock) |
| Beat flash envelope | beatFlash | joints + sequencer hit column |
| Metronome swing | metroSwing | W1 |
| Dance pose flip on beat | dancePose | disco / living |
| Waltz 3-step cycle | waltzStep | ballroom |
| Caption rise | capRise | every caption |
| Dip through void | dip | world change |
| Pop-in | popIn | props entering |

## 6. Camera grammar
Locked tripod, eye-level, wide. Sequencer owns the bottom ~30 %. Subject(s) centre or on a third; caption top-left. No handheld, no orbit. Cut only through a dip.

## 7. Sound palette
76 BPM throughout (matches on-screen metronome). Kick on 1+3, snare on 2+4, hat every beat; W4 adds syncopated guitar plucks on the off-beats. SFX: wood metronome clicks (W1), whoosh+thump on dips, disco pops (W3), ding on gap bracket. −14 LUFS-ish via music.py + mux.

## 8. Native moves
1. **Playhead travel** — one continuous playhead crosses genres (beige → waltz → disco → living). Once per film as the spine.
2. **Beat hit** — joints flash gold + sequencer column blooms when the head lands (0594 playhead language, made visible on bodies).
3. **Metronome swing** — pyramid body, arm arcs in time (0594 t18).
4. **Gap bracket** — orange 「缝」 bracket under an off-beat hit (our addition; carries the syncopation argument).

## 9. Pitfalls of the medium
- Limb angles are canvas-absolute (0 = right, + = clockwise with y-down). Mixing "up" poses with wrong signs makes broken elbows — use the POSES library.
- Sequencer must stay the same height across worlds or the dip feels like a jump cut.
- Puppets without joint circles read as sticks — always draw joints.
- Too many candy colours on paper worlds fights the beige board; keep candy for disco only.
- `shadowBlur` on the full playhead is fine; don't blur the whole sequencer.

## 10. Engine
`demo/look.js` palette / paper / stage · `demo/people.js` puppet / crowdRow / POSES · `demo/props.js` 20 props · `demo/motion.js` named patterns · `demo/main.js` demo · `demo/music.py` score · `demo/build.sh` one command · `sheets/` t=0 people, t=1.5 props, t=2.5 patterns.

## 11. Variation space
Any topic where **time structure is the idea**: tempo, time signature, syncopation, genre feel (waltz / disco / lo-fi / funk), polyrhythm, "why a half-speed remix calms you". Swap costumes and sequencer patterns; keep paper/stage + bottom sequencer + puppet cast.

---

## 12. CHARACTER APPEAL (first-class)
The source's people **are** wooden puppets (0594 t91 / t146 / t237 / t529): round featureless head, thin limbs, **visible joint circles**, flat costume blocks, no faces. That is the figure language — not a failure mode.
Why they look attractive in the source:
1. **Costume colour blocks** do the identity work (tuxedo, magenta dress, candy disco shirts, fedoras + suspenders).
2. **Joints read as craft** — you see the hinge, so the pose feels intentional.
3. **Pose on the beat** — lean + arm angle change every beat; stillness looks dead.
4. **Couple / group silhouette** — waltz hold, disco row, three-fedora line — readable at a glance.
Rules: never draw faces; never hide joints; never use real-anatomy proportions (head ≈ 0.10 H, torso block, limb stroke); emotion = pose + hit flash + costume. Casts may mix skin tones and hats inside one world.
**Honest gap**: source puppets have slightly more costume detail (lapels, shoe shape, dress folds) and smoother arc motion between poses; ours snap pose-to-pose on the beat. Waltz arms are readable but not as refined as 0594 t91's ballroom hold.
Character sheet: `stills/sheets/t_0.jpg`.

## 13. PROP GRAMMAR (for deriving new props)
- **Two layers**: *stage props* (metronome, disco ball, sofa, guitar…) sit in the upper scene; *sequencer marks* (dots, dashes, rings, bars) live only in the bottom band.
- **Silhouette**: ≤ 8 shapes; instantly readable at 80 px.
- **Colour**: one accent role per prop (playhead orange, candy for disco, gold for waltz). Body fills are flat + one soft gradient.
- **Scale**: hand props 0.3–0.5 head; stage props 1–2 heads; sequencer spans full width × ~30 % height.
- **Enter / transform / exit**: pop-in or fade; transform by **hit state** (dim → accent under playhead); exit by dip.
- **Meaning**: time = playhead position; importance = brightness of the hit; syncopation = marks that sit between grid lines.

### Coded props (props.js): 1 sequencer · 2 metronome · 3 bpmNum (+ footprint) · 4 discoBall · 5 discoFloor · 6 spotlight · 7 turntable · 8 domeLamp · 9 guitar · 10 kickDrum · 11 chandelier · 12 sofa · 13 rainbow · 14 archWindows · 15 star · 16 gapBracket · 17 lavaLamp · 18 chip (look) · 19 chapterNum (look) · 20 captionBlock (look). Sheet: `stills/sheets/t_1.5.jpg`.

### Prop-animation patterns
P1 playhead travel · P2 beatFlash column bloom · P3 metroSwing · P4 discoBall beam rotate · P5 turntable spin · P6 lava blob rise · P7 gapBracket pop · P8 dip world change · P9 dancePose / waltzStep on bodies · P10 spotlight dust drift. Filmstrips: `stills/sheets/t_2.5.jpg`.

### How to derive a new prop — worked example: **gapBracket** (「缝」)
1. Idea: "the good note sits between beats". Find a plain object: a dimension bracket under a gap. 2. Silhouette: three-stroke U + arrow + one character. 3. Layers: accent stroke only (no fill). 4. Detail: the single label 「缝」. 5. Animation: P7 pop-in after the viewer has seen one off-beat guitar mark. 6. Meaning: points at a sequencer hit that is NOT on the 4/4 grid. Next the same way: a loop-brace for 「循环」, a tempo ramp arrow for 「渐快」, a mute "X" over a track for 「休止」.

## 14. BANs
- No faces / eyes / mouths on puppets.
- No dropping the bottom sequencer (it is the family's spine).
- No neon-void palette (other family); no gold foil museum light (other family).
- No copying source captions verbatim as brand lines, @速通主义 watermark, or exact board layouts.
- No image/video generation; code draws everything.
- Max one gapBracket spotlight moment per film.
