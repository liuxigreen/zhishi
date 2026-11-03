# Re-distill audit · FX focus（粒子 · 光影 · 动画 · 呈现）· 2026-11-01

> Trigger: user ask [t325u] — 抖音「Vibe知识大赏」点赞前 30 的 **粒子特效 / 光影效果 / 动画 / 呈现方式，逐帧学习**；旧底座要不要重蒸。
> Scope: `bases/*` (27 dirs) × `refs/*` + out-of-tree ref videos (`/workspace/vk-brain-first`, `vk-emotion-shelf`, `vk-huashu`, `vk-bridge-pier`).
> Checklist: `DISTILL-MULTIDIM.md` D1–D8 + §1b/§1c/§4b — **has no particle / lighting / easing-curve dimension**. Proposed add-on: `DISTILL-FX-DIMS-PROPOSAL.md` (D9 粒子 · D10 光影 · D11 动画曲线).
> This pass edits **no** STYLE-BASE / skill files.

## 0. Bottom line

1. **No base has frame-level FX evidence.** Every ref was sampled at ≤2 fps (most 1 fps, several ~1 frame / 5–15 s). Particles, bloom pulses, light sweeps, easing and overshoot live in 3–30-frame windows, so 1 fps cannot measure them.
2. What reads like FX data in the yaml files (`glow: {blur: 10, opacity: 0.55}`, `enter: {ease: power3.out, dur: 0.45, stagger: 0.06}`) is **our authored render token**, copy-pasted across the dark families. It is **not** measured from the reference. Treat it as an unverified guess.
3. Only the 3D / Lemo-spec bases (`circuit-board-pcb`, `andy-3d-building`, `yingxian-tenon`, `desktop-flythrough`, `chalkboard`, `memphis-diorama`) describe a light rig in words or numbers. Those numbers come from Lemo's STYLE.md or our own engine, not from per-frame measurement of a Vibe知识大赏 upload. `circuit-board-pcb` `post:` / `light:` blocks are the best **format** template for D10.
4. The heuristic probe (§3) and a 10 fps strip check (`fx-probe-2026-11-01/sheet.jpg`) confirm that the FX-rich Vibe refs we already have locally are 叁号暗房 halo (bloom orb + streak sweeps), 来龙去脉 (flame flicker, smoke/fog volumes, warm/cool split), 小墨 darkgold (breathing warm radial glow, deep vignette), and NEXO (spotlight cone + focus brackets). None of their bases measure those effects.
5. The current library covers only ~12 Vibe知识大赏 Douyin uploads, and likes were captured for a few of them (墨有意思 percolation ~51.7万, 比特新语 red queen 3.9万). **It is not the top-30-by-likes set.** The new crawl should decide which of these refs stay in the top 30. Any ref that drops out is downgraded to keep/挂起 for FX.

## 1. Audit table

Legend · evidence: **NONE** = not mentioned · **WORD** = adjective/spec only, no frame+time · **TOKEN** = our yaml render token (not measured) · **SPARSE** = named in ≤1 fps stills with timestamps · **FRAME** = ≥10 fps window + timestamps + numbers (nobody reaches this).

| # | base | ref video local? | particle evidence | light evidence | animation timing evidence | verdict | reason |
|---|---|---|---|---|---|---|---|
| 1 | **sanhao-halo-effect** | ✅ `refs/halo-logos/source.mp4` 161.7s 1024×576 (10 stills only) | WORD (`particle_shimmer` micro) | WORD (moon halo / gray fog / gold ring, no radius or intensity) | NONE (only "单屏 2.5–5s") | **re-distill FX layer** · P1 | The FX-richest local Vibe ref: glow orb + ring + horizontal light streaks (strip @40s). Halo breathing, streak speed and fog falloff are all unmeasured. 10 stills over 162s is far too sparse. |
| 2 | **lailong-history-person** (+ `lailong-xuanzang-passport`, `lailong-zhaoyun-infant`) | ✅ beacon 233s · xuanzang 194.8s · zhaoyun 249.2s (all 1024×576/30) | WORD (`PaperScatter` 撕碎公文粒子; no count or lifetime) | WORD (路线发光, `lantern_glow`, 「京城」发光); flame/smoke not described | SPARSE (`t+…` lists exist for person; contact sheet 1/14.5 fps) | **re-distill FX layer** · P2 | Strip @90s shows flame flicker, volumetric smoke/fog clouds, a warm key vs cool ground, and a vignette (corner/center 0.51–0.55, the brightest edges of the dark family). This is the most active story family; one FX pass can cover all three bases. |
| 3 | **xiaomo-darkgold-disarm** (alias `zhanwai-darkgold-huashu`; same 180.3s file) | ✅ `/workspace/vk-emotion-shelf/ref/source.mp4` 1920×1080/30 (36 PNGs ≈ 1 per 5s) | TOKEN (`DustField.js` authored; "dust 暖度" listed as gap) | TOKEN+WORD (中心暖琥珀径向晕慢呼吸, 泡辉光; `glow blur 12 / 0.55`) | TOKEN (`power3.out`) + SPARSE densest t24–30 | **re-distill FX layer** · P3 | The darkgold family ships most episodes. The probe shows the deepest vignette in the library (corner/center **0.16**) and a slow breathing glow (37% of 0.2s steps are near-still, so the motion is glow/dust drift rather than cuts). Breathing period, glow radius and dust count/velocity are guessed. The sample still lists the 泡辉光 as thin. |
| 4 | **moyou-darkgold-music** | ✅ `/workspace/vk-brain-first/ref-full/source.mp4` 39.9s 1280×720 | TOKEN (`DustField.js`; yaml *bans* "particle soup / bokeh") | TOKEN (`glow 10/0.55`, bg_glow) | SPARSE+ (`refs/motion-stills/` timed, `t+` list; 40 dense frames at ~1s) | **re-distill FX layer** · P4 | It already has the best motion list among the dark bases. Still missing: measured gold-fill sweep speed, DROP-glow onset ms, and the brain-highlight bloom radius. The clip is short (40s), so a cheap 30 fps full pass is possible. |
| 5 | **nexo-crowd-phone** | ✅ `refs/nexo-crowd-phone/source.mp4` 60s (60 frames @1fps) | TOKEN (`DustField.js`, and yaml bans DustField as primary) | WORD (中心极淡暖晕, `glow 10/0.5`); spotlight cone not described | SPARSE (densest 27–36s at 1 fps) | **re-distill FX layer** · P5 | Strip @30s shows a top spotlight band, a focus-bracket snap and a tension bar. Bracket snap easing and spotlight intensity ramp are unmeasured. |
| 6 | **bite-red-queen** | ❌ no mp4 (13 PNG screenshots; blob URL) | WORD (Gause 试管粒子沉降, `t+0.0`) | TOKEN (`glow 10/0.4`); star-field ending not described | SPARSE (`t+` list; stills at 4–20s spacing) | **re-distill FX layer — blocked on acquiring the video** · P6 | The ending star field, particle settling in the tube and red track glow are clear FX moments, but there is nothing to step through frame by frame. |
| 7 | **moyou-story-percolation** | ❌ no mp4 (`meta.txt: local_mp4: none`; 10 stills) | NONE | WORD (卡内 vignette; dusk orange for the bike shot) | SPARSE (chapter times; 4b snap rule) | **re-distill FX layer — blocked on acquiring the video** · P7 | The highest-liked ref we hold (~51.7万). The percolation "snap" (path lights up when it spans) is a light event that needs onset/decay ms. Get the video first. |
| 8 | **dianzi-info-surprisal** | ❌ none (NavXD write-up only; "无本地密帧实测") | NONE | TOKEN (`glow 8/0.45`, 铜线发光) | TOKEN (`t+` from estimate) | **re-distill full** · P8 | Every dimension is inferred, not measured (the type ladder is labelled 约值). If it makes the top 30, download it and do a full multidim + FX pass. |
| 9 | **andy-3d-building** | ✅ `refs/andy-building/source.mp4` 60.8s (122 frames @2fps + 1s grids) | WORD (snow, fireworks, 鞭炮 = `Points` ❌ not built) | WORD+TOKEN (engine bloom/ACES/vignette/TiltShift; corner/center 0.65) | SPARSE (2 fps; brick drop-in "ease" unnamed) | **re-distill FX layer** · P9 | The source has real particle events (firecrackers, snow, fireworks). The 3D path is idle, so this is low priority. Sibling `vk-bridge-pier/ref` (64s) is in the same position. |
| 10 | **zhongshan-learn-fast** | ✅ `refs/learn-zhongshan/source.mp4` 104.9s (10 stills) | NONE | TOKEN (`glow_warm`) | NONE | **re-distill FX layer** · P10 | Strip @30s shows a warm under-glow pool and contact shadows under the props, with 18 cut-like jumps. It is lighter on FX, so this is low priority. |
| 11 | yingxian-tenon | ❌ (website `yingxian.huaye.art`, not a video) | WORD (dust on seat) | WORD (golden-hour key, cool rim, haze, vignette, restrained bloom: our spec) | WORD | **keep** | This is our own render spec, not a Douyin ref. Backfill D10 fields from the **render** when needed. |
| 12 | circuit-board-pcb | ✅ `refs/lemo-demos/circuit-board.mp4` 60s (2 frames in `frames/`) | WORD (`motes: 26`) | **TOKEN rich** (`light: blur_wide 24 / tight 5 / alpha .9/.85`, `post: dof_band, vignette .58, grain 5, key_light_drift`) | WORD (~5s per shot, camera always moving) | **keep** (挂起) | Lemo spec, not Vibe知识大赏. Use its post block as the D10 *format* template only. |
| 13 | desktop-flythrough | ✅ `lemo-demos/desktop-flythrough.mp4` 60s (1 fps) | NONE | WORD (low warm sun from back-left ~20°, DOF, slight vignette, bloom on lamps only) | WORD (~40 camera keys / 60s, back-ease pops) | **keep** (挂起; multidim 必重蒸 still open) | Lemo. Its light is described in words; it is not a top-30 Vibe ref. |
| 14 | chalkboard | ✅ `lemo-demos/chalkboard.mp4` 49.3s (57 frames @1fps) | NONE | WORD (left window warm/cool, vignette) | WORD (dolly 2–4s, whip 0.35s) | **keep** (挂起) | Lemo. Timing numbers exist but were read at 1 fps. |
| 15 | memphis-diorama | ✅ `lemo-demos/memphis-diorama.mp4` 45s/60fps | NONE | WORD (no lighting model; purple hard shadows; bans bloom/DOF) | WORD (back-out overshoot 1.6–2.8, stagger 0.05–0.3s) | **keep** (挂起) | Lemo. It is the only base with an overshoot number, but that number was never verified frame by frame. |
| 16 | transit-map | ✅ `lemo-demos/transit-map.mp4` 47s (97 frames @2fps dense) | NONE (bans particle soup) | WORD (headlight flare cut, lens vignette/tilt) | WORD (camera moves every 3–5s) | **keep** (挂起; multidim 必重蒸 still open) | Lemo. FX is minor. |
| 17 | countdown-split | ✅ `lemo-demos/countdown.mp4` 59.5s (1 fps gate refs) | NONE | NONE (explicitly no glow/shadow) | WORD (relayout easeInOutCubic 0.34s) | **keep** | Flat broadcast grammar. FX dims are N/A by design. |
| 18 | game-show | ✅ `lemo-demos/game-show.mp4` 148.8s (149 frames @1fps) | NONE | NONE (hard offset shadow only) | WORD (back-ease pop, beat punch) | **keep** (挂起) | Lemo. Flat. |
| 19 | isometric-picture-book | ✅ `lemo-demos/isometric-picture-book.mp4` 59.8s (63 frames) | NONE | WORD (no lights/shadows; fog blue) | WORD (drift zoom 0.06–0.08) | **keep** (挂起) | Lemo. Flat by design. |
| 20 | printed-long-take | ✅ `lemo-demos/printed-long-take.mp4` 60s (1 fps) | NONE | WORD (12 Hz ink flicker, vignette, no bloom/DOF) | WORD (stops 6–12s, glides 1.5–3s) | **keep** (挂起) | Lemo. |
| 21 | andy-3d-construction-sim | (shares `vk-bridge-pier/ref` 64s) | NONE | NONE | TOKEN (`power2.out 0.45`) | **keep** (stub → fold into andy-3d-building) | yaml-only stub. |
| 22 | circuit-board | (Lemo circuit-board.mp4) | NONE (bans particle soup) | TOKEN | TOKEN | **keep** (stub → circuit-board-pcb) | yaml-only stub. |
| 23 | zhanwai-darkgold-huashu | ✅ `/workspace/vk-huashu/ref/source.mp4` (same 180.3s file as xiaomo) | — | — | — | **fold into #3** | DIFF.md alias. Keep the darkgold FX in one place. |

> `refs/bite-xinyu-effort/`, `refs/lailong-link1/`, and `refs/lailong-zhaoyun-v2/` are **empty dirs**. Delete them, or fill them during the top-30 crawl.

## 2. Ranked FX re-distill queue

| Rank | Target | Blocker | Cheapest first step |
|---|---|---|---|
| P1 | sanhao-halo-effect | — | Dump 30 fps over the halo-orb beat (~35–50s) and the CTA eye (~150–161s), then fill D10 (glow radius, bloom, streak speed) and D9 (shimmer). |
| P2 | lailong ×3 (one family pass) | — | Beacon flame/smoke beat (~80–100s) at 30 fps, plus the xuanzang paper-tear, plus a zhaoyun timestamp stamp. Fill D9 smoke/paper particles, D10 warm key / fog depth, and D11 path-grow easing. |
| P3 | xiaomo-darkgold (+zhanwai) | — | Densest t24–30 at 30 fps, plus 2 × 10s of the breathing bg. Measure the radial glow period/amplitude, the dust field, and the bubble-glow onset. |
| P4 | moyou-darkgold-music | — | Full 40s at 30 fps: gold-fill sweep px/s, DROP glow onset, brain highlight bloom. |
| P5 | nexo-crowd-phone | — | 27–36s at 30 fps: bracket snap easing/overshoot, spotlight ramp. |
| P6 | bite-red-queen | **no mp4** | Fetch the video (blob URL, so use the in-browser capture/recording route), then do the tube particles and star-field end. |
| P7 | moyou-story-percolation | **no mp4** | Fetch the video, then do the spanning-snap light event and the vignette. |
| P8 | dianzi-info-surprisal | **no mp4, no frames** | Full re-distill only if it ranks in the top 30. |
| P9 | andy-3d-building (+bridge-pier) | 3D path idle | Firecracker/snow/firework particle counts and lifetimes at 30 fps. |
| P10 | zhongshan-learn-fast | — | Under-glow pool and contact shadow, low priority. |

Everything else is **keep**. The Lemo-spec bases are not Vibe知识大赏 uploads and are 挂起. Flat grammars mark D9/D10 as N/A in their yaml.

## 3. Heuristic FX probe（numbers for triage only; not D9–D11 values）

`fx-probe-2026-11-01/probe.py` samples at 5 fps, downscales to 512×288, and records:
- **specks**: small bright blobs, area ≤12px, more than 25 levels above the local mean. Text edges inflate this count, so it is not a particle count.
- **corner/center**: luminance ratio. Lower means a darker vignette or edge.
- **motion**: mean absolute frame difference. `still_frac` is the share of 0.2s steps that are nearly static, and `cut_like` counts steps with a difference above 25.

| ref | dur s | specks med/p90 | corner/center | motion mean | still_frac | cut_like |
|---|---|---|---|---|---|---|
| moyou music | 39.9 | 170/417 | 0.38 | 5.13 | 0.02 | 5 |
| xiaomo disarm (=zhanwai) | 180.3 | 254/601 | **0.16** | 1.51 | 0.37 | 0 |
| nexo crowd | 60.0 | 90/276 | 0.24 | 2.93 | 0.29 | 2 |
| sanhao halo | 161.7 | 266/491 | 0.32 | 2.33 | 0.44 | 9 |
| zhongshan | 104.9 | 145/287 | 0.26 | 4.97 | 0.19 | 18 |
| lailong beacon | 233.0 | 151/383 | 0.55 | 3.61 | 0.03 | 6 |
| lailong xuanzang | 194.8 | 111/383 | 0.53 | 8.01 | 0.00 | 50 |
| lailong zhaoyun | 249.2 | 100/221 | 0.51 | 6.27 | 0.00 | 43 |
| andy building | 60.8 | 224/529 | 0.65 | 24.82 | 0.00 | 133 |
| andy bridge-pier | 64.0 | 247/434 | 0.89 | 22.19 | 0.00 | 102 |

Reading the probe:
- The dark "darkgold / halo" refs combine a deep vignette with long near-still stretches. Their motion comes from glow, dust and breathing rather than cuts, which is the layer our bases never measured.
- 来龙去脉 is always moving (still_frac ≈ 0) and has many cut-like jumps, so camera moves, transitions and fire/smoke drive it. Measure D11 transitions there.
- The 3D andy refs are camera-driven, which matches their engine path.

Visual check at 10 fps (4 consecutive frames per ref): `fx-probe-2026-11-01/sheet.jpg` (rows: moyou, xiaomo, sanhao, nexo, beacon, zhongshan).

## 4. Process fix

- Add D9–D11 per `DISTILL-FX-DIMS-PROPOSAL.md`. Without it, "粒子/光影" will keep showing up as one adjective plus a copied `glow:` token.
- **Frame-rate rule:** FX windows must be dumped at the **source fps (30)** for ≥2s per measured effect. A 1 fps contact sheet counts toward D2/D7 only and **never** toward D9–D11.
- **Token honesty:** in `style-base.yaml`, split `measured:` from `authored:`. Today `glow:` / `enter:` values are authored defaults that look like measurements.
- For the top-30 crawl, record **likes per ref** in `caption.txt` / `meta.txt` (most refs lack them), so "top 30" can be checked.
