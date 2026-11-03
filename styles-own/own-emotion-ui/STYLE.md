# Emotion UI · 情绪UI (own-emotion-ui)

Our own style distilled frame-by-frame from Adelaide's references: **nexo (人群/手机/聚光灯)**, **6571 (奶白象形人·焦虑型依恋)**, **6911 (小孩扁平人·乒乓/反复确认)**; 1183 and 2127 are outliers used only as donor props (glitchText, crystalHeart).
Frame cites use `clip tSEC` (full-res grabs in `templates-full/_analysis/hi/emo/`). Technique base: Lemo Canvas2D page contract (window.READY / render(t) / DUR / TEXTS). No source plot, caption or layout is reused.

## 1. Essence, and what it is not
A deep-navy night room. One warm person (orange) under a light; around them, **interface overlays drawn on top of real life** — eyes with dashed gaze lines, focus brackets, a tension bar, call-out pills, thought clouds, chat bubbles. The feeling is made visible as UI (nexo t26.5: brackets + 紧张 bar + 「表情自然吗？」). Orange = the self / what I feel; cyan = screens and facts; grey-blue = everyone else.
It is **not**: neon cyberpunk (own-void-neon), a gold museum (own-dark-gold), paper puppets (own-lailong-sil), or a dashboard infographic. The UI always sits *on a person in a room*.

## 2. Materials & rendering
- **Room**: #080C16 → navy #111A2E vertical wash, faint wall panels, floor line ~y 860–900, floor haze gradient (nexo t26.5 measured dark navy, ~75 % of pixels).
- **Hero capsule** (nexo): pill body #F2A866 with lit side #FFC38A and shade #D98A4E, round head separate, no features; contact shadow + warm floor pool.
- **Crowd**: 3 depth layers, colours mixed toward #1C2236 (0.62 / 0.42 / 0.22), one soft echo on the middle layer only, phones are tiny cyan screens that light their owner (nexo t7.5).
- **Cream pictogram** (6571): #EEEAE0 fat torso slab, far limbs shaded #C9C4B8, cyan rim from the phone (6571 t9.5).
- **Flat kids** (6911): flat colour tops (coral #EE7D62 / denim #7F9FD8 / calm green / lilac), dark trousers, white shoes, big round head with bob/short hair, blush, simple eyes and brows (6911 t8, t31).
- **Light**: hanging pendant lamps with a feathered cone and dust (6911 t31), stage spotlight cone (nexo t26.5), phone glow (6571).
- **UI layer**: 2 px strokes, rounded pills, mono numerals; dashed gaze lines rgba(154,163,184,.55).

## 3. Colour logic
| role | hex | rule |
|---|---|---|
| void / room | #080C16 / navy #111A2E | 65–80 % of frame |
| self / feeling | hero #F2A866, orange #FF9A3C | the one person whose head we are in; belief numbers |
| screen / fact | cyan #7ABAEF | phone light, measured facts, the "real" answer |
| others | crowd #7F89A3 → #1C2236 | everyone not the subject |
| tension / calm | #E58A7A / #5FC4A8 | meter fill only |
| lamp | #FFE7B0 | pendant and spot light |
| text | #EEEAE0 / white | captions, chips |
Orange never exceeds ~15 % of the frame; cyan is reserved for screens and facts so the reversal (belief orange → fact cyan) reads at a glance.

## 4. Type & subtitles
- Caption: Noto Sans SC 700, 54 px, white, centred at y 960, on a soft navy band (≥4.5:1 guaranteed). Optional tag before the line: 32 px, orange outline pill (nexo t26.5 「自我关注」).
- Chips (topic, numbered step): small rounded pill, number dot, 24–28 px (6911 t31 「① 症状·反复确认」).
- UI labels: 20–30 px; numbers Geist Mono; cites as a small status line bottom-right.
- Reading time verified by `readcheck.mjs` (CJK 4.5 c/s). Keep chip/label text static under one id.

## 5. Motion quality
Measured: nexo cuts every 2.5–4 s with 0.3–0.4 s dip-to-navy; UI overlays enter 0.4–0.8 s after the person settles with a 0.25–0.3 s pop; 6911 bubbles stack bottom-up every 0.35–0.5 s; 6571 camera holds still, motion lives in props (steam, clock, phone glow). See `demo/motion.js`:
| pattern | id | use |
|---|---|---|
| Pop-in 0.3 s outCubic | M1 popIn | every UI element |
| Gaze lock: eyes stagger 0.18 s, lines draw 0.5 s, brackets snap last | M2 gazeLock | the native move |
| Gaze release (lock played backwards, eyes blink shut) | M3 gazeRelease | the reversal |
| Bubble stack push-up | M4 bubbleStack | chats, inner dialogue |
| Meter rise/fall with nervous jitter | M5 meter | tension |
| Lamp flicker-on | M6 lampOn | entering a lit place |
| Breath ±2.5 % | M7 breath | idle people |
| Dip to navy | M8 dip | world change |
| Dive into thought cloud | M9 dive | memory/replay |
| Count-up | M10 countUp | stat cards |
| Caption rise 14 px / 0.35 s | T1 capRise | captions |
Filmstrips of every pattern: `stills/sheets/t_2.5.jpg`.

## 6. Camera grammar
Locked, eye-level, wide. Subject on a third, crowd/other on the other third, UI floats in the gap. No push except M9 dive into a cloud. Cut on dips only.

## 7. Sound palette
A minor → C major at the reversal, 78 BPM; soft pad, plucked "phone" bells, felt piano. SFX: pops for eyes/bubbles, click for brackets, heartbeat under tension, clock ticks, flip-clock clack, whoosh on dive, lamp clicks, count ticks, reverse shimmer before the truth, ding on the final chip. −14 LUFS via mux.sh.

## 8. Native moves
1. **Gaze lock** — eyes appear, dashed lines draw to the hero, brackets snap, the meter rises (nexo t26.5). Once per film.
2. **Replay cloud** — person on a bed at night, the scene replays in a thought cloud, flip clock turns (6571 t9.5).
3. **Two lamps** — two pendant lamps, people under each, bubbles say what they don't say aloud (6911 t31).
4. **Phone out** — the hero pulls out a phone and everything else dims (nexo t7.5).

## 9. Pitfalls of the medium
- Mixing `rgb()` strings with hex in colour maths → black people. `hexRgb` parses both now.
- Crowd echoes on every layer turn into blobs: echo the middle layer only.
- Sitter: draw the bed before the sitter and put the knee past the bed edge.
- Readcheck restarts timing if a label's text changes under the same id: keep labels static.
- Sheets cannot import `../demo`; run `sh sheets/sync.sh` first.

## 10. Engine
`demo/look.js` palette, room, light, chip · `demo/people.js` pill / crowd / sitter / steam / kid · `demo/props.js` 20 props · `demo/motion.js` named patterns · `demo/main.js` demo · `demo/music.py` score · `demo/build.sh` one command · `sheets/` (still.mjs t=0 people, t=1.5 props, t=2.5 animation patterns).

## 11. Variation space
Any topic where the inside feeling and the outside reality differ: 聚光灯效应, 焦虑型依恋, 冒名顶替, 社交焦虑, 反刍思维, 已读不回. Swap cast per topic (adults in public → pill; alone at night → sitter; school/relationship scenes → kids). Use meter for any feeling quantity, stat cards for belief vs fact.

---

## 12. CHARACTER APPEAL (first-class)
Three casts, all from the sources, never mixed in one world:
1. **Pill (nexo)** — featureless capsule. Appeal comes from proportion (head ≈ 0.45 body width, slight gap between head and body), warm lit side, and **arm poses**: hip / phone / raise / chin. Emotion = pose + light + UI.
2. **Sitter (6571)** — cream pictogram, chunky torso, hunched; emotion = hunch amount + phone glow + steam.
3. **Kid (6911)** — the only cast with faces: dot eyes with highlight, brows (inner ends lift for worried/teary, drop for shout), blush, small mouth; head ≈ 1/2.6 of height. Moods: calm / happy / worried / teary / shout.
Rules: never put a face on pill or sitter; never mix casts; people stand on the floor with a contact shadow; extras are darker and smaller than the hero.
**Honest gap**: our kids are front-view only; 6911 has 3/4 head turns, bigger arm gestures and fills more of the frame. Our crowd is still a little denser than nexo. Character sheet: `stills/sheets/t_0.jpg`.

## 13. PROP GRAMMAR (for deriving new props)
- **Two kinds**: *room objects* (bed, lamp, clock, window, table) are drawn flat with one light event; *UI objects* (eye, bracket, meter, callout, card, bubble) are 2 px strokes + rounded pills floating on top.
- **Silhouette**: rounded, ≤ 10 shapes; corners radius ≥ 8 px.
- **Shading**: max 3 layers — flat fill → one darker side → one light event (glow, rim, screen).
- **Colour**: belief/self orange, fact/screen cyan, neutral cream/grey. One accent per prop.
- **Scale**: hand props 0.3–0.5 head; room props 1–3 heads; UI floats near the head it refers to, with a leader line.
- **Enter / transform / exit**: pop-in (M1) or draw-on; transform by value (meter, count-up, flip); exit by retracting (gazeRelease) or dimming.
- **Meaning**: state changes are UI changes — meter level, card number, label text, light on/off.

### Coded props (props.js): 1 phone (lock/chat/apps) · 2 chatBubble · 3 typingDots · 4 flipClock · 5 hangingLamp · 6 windowMoon · 7 wallClock · 8 bed · 9 pingTable · 10 tensionMeter · 11 focusBrackets · 12 eye · 13 gazeLine · 14 callout · 15 thoughtCloud · 16 statusLine · 17 statCard · 18 crystalHeart (donor 2127) · 19 glitchText (donor 1183) · 20 tshirtPrint (+ chip in look.js). Sheet: `stills/sheets/t_1.5.jpg`.

### Prop-animation patterns
P1 gaze lock / release (eye + gazeLine + focusBrackets) · P2 bubble stack push-up · P3 meter rise/fall with jitter · P4 lamp flicker-on · P5 count-up card · P6 flip-clock turn · P7 dive into thought cloud · P8 callout leader draw + pill pop · P9 phone light-up (crowd phones turn on). Filmstrips: `stills/sheets/t_2.5.jpg`.

### How to derive a new prop — worked example: **tensionMeter**
1. Feeling: "how nervous I am". Find a plain UI object: a vertical bar. 2. Silhouette: rounded tube + label below. 3. Layers: dark track → fill (tense #E58A7A high, calm #5FC4A8 low) → small glow on the fill top. 4. Detail: one label (紧张). 5. Animation: M5 meter — ease + jitter that grows with value. 6. Meaning: rising = feeling grows; dropping in the last world = the reversal. Next: a "seen/unseen" read-receipt tick (已读不回), a battery for social energy (社交消耗), a loading spinner that never ends (反刍).

## 14. BANs
- No faces on pill or sitter; no mixing casts in one world.
- No neon purple/magenta (own-void-neon); no gold foil (own-dark-gold).
- UI never floats without a person or object it refers to.
- Max one gaze lock per film; max 3 UI overlays on screen at once (+ caption).
- No copying source captions (「表情自然吗？」 is reused only as a generic UI label), stories or brand marks.
- No image/video generation; code draws everything.
