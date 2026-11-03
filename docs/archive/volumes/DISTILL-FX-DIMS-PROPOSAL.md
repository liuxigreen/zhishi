# Proposal · DISTILL-MULTIDIM appendix「D9 粒子 · D10 光影 · D11 动画曲线」· 2026-11-01

> Status: **merged into DISTILL-MULTIDIM.md §1d** · 2026-11-01.
> Why: user [t325u] wants 粒子特效 / 光影 / 动画 / 呈现方式 learned **frame by frame**. The audit (`REDISTILL-AUDIT-2026-11-01.md`) found 0/27 bases with frame-level FX evidence; existing `glow:`/`enter:` yaml values are authored defaults.
> Where it goes: insert after §1 D8 as **§1d FX 三维（逐帧）**. Add the Gate lines in §3 and the anti-patterns in §4 (bottom of this file).

---

## §1d · FX 三维（逐帧实测；缺任何一维 = FX 未蒸馏）

### Evidence rule (applies to D9–D11)

| 项 | 必填 |
|---|---|
| FX 窗口 | Each measured effect gets a window of **≥2 s at the source fps (30/60)**, saved to `refs/<slug>/fx/<effect>/f%04d.png`, with the source timecode in the filename or an `index.csv` |
| 帧号→时间 | `t = frame / fps`; every value cites `f####` or `mm:ss.fff` |
| 测量方式 | `pixel` (bbox/ruler on frames) / `probe` (script; path to the script) / `eyeball` (allowed only with a ±range and a "估" label) |
| measured vs authored | In `style-base.yaml`, `fx.measured.*` holds only values from frames; our render choices go under `fx.authored.*` |
| N/A | Flat grammars (countdown, game-show, iso…) may set `D9: N/A (ref has none @ f####–f####)`. N/A must cite the frames checked |

1 fps contact sheets **do not count** as D9–D11 evidence.

---

### D9 · 粒子系统（Particles）

Fill one row per distinct system. Common systems: dust/motes, sparks, embers/fire, smoke, snow, star field, paper shards, data dots, bokeh.

| 字段 | 单位 / 取值 | 怎么量 |
|---|---|---|
| system name / 语义 | e.g. 暖尘 = 氛围, 金火花 = 惊奇落点 | What the particles *mean* (decoration-only ≠ semantic; state which) |
| emitter | point / line / area / full-frame / attached to `<prop>` | Where new particles first appear |
| emitter position | x,y in % of the 1080p frame | bbox center |
| count on screen | median / peak (n) | Count blobs on 3 frames: hold, peak, tail |
| spawn rate | n/s | New blobs per second across ≥30 frames |
| size | px @1080 (min–max) + size-over-life (grow/shrink/const) | Ruler on frames; note the DOF-blurred size separately |
| lifetime | ms (median, range) | Track ≥5 particles from first to last frame |
| velocity | px/s + direction (deg, 0 = right, 90 = up) | Displacement between frames × fps |
| motion model | linear / gravity / noise-drift / orbit / attract-to-target / burst | Trajectory shape across frames |
| opacity curve | fade-in ms / hold / fade-out ms; max alpha | Luminance of one particle over its life |
| color | hex core + hex halo; temperature (warm/cool) | Pixel sample at the core and 1 radius out |
| blend mode | additive (core clips toward white, overlaps brighten) / screen / normal (occludes) | Check overlaps; additive overlaps go brighter than either particle |
| depth layers | n layers; parallax ratio fg:mid:bg | Speed ratio of near vs far particles during a camera move |
| trigger / sync | ambient / on-beat / on-event (`t+x` of which state change) | Align the burst frame with the argument beat |
| density budget | % of frame area covered; overlaps with type? | A particle under hero type counts as a fail unless it is masked |

**Pass:** ≥1 system has count + size + lifetime + velocity + blend measured, **and** its semantic role is stated.
**Fail:** "加点粒子" / `DustField.js` reused with no measured row.

---

### D10 · 光影（Light & shadow）

| 字段 | 单位 / 取值 | 怎么量 |
|---|---|---|
| key light position | screen-space angle (deg) + elevation guess; or "none (flat)" | Highlight side and shadow direction |
| key color temp | warm / neutral / cool + hex of the brightest non-text pixel | Pixel sample |
| fill / rim | rim yes/no, side, width px, hex | Edge luminance on the hero object |
| ambient / bg glow | radial / linear; center x,y %; radius px @1080; core hex → edge hex | Luminance profile along a line through the center |
| glow on elements | glow radius px (falloff to 10% luma); intensity = peak luma gain over the base element | Profile across one glowing stroke / text |
| bloom | threshold (luma at which bloom appears); spread px; affects text? yes/no | Compare bright vs mid elements |
| breathing / pulse | period ms; amplitude (Δluma or Δradius %); waveform (sine / ease-in-out / step) | Center luminance over ≥2 cycles (probe) |
| light sweep / glint | direction deg; width px; speed px/s (or duration ms across object); repeat interval | Track the sweep band across frames |
| vignette | corner/center luminance ratio; shape (round / oval); feather % | Probe (see `fx-probe-2026-11-01/probe.py`) |
| depth cues | DOF blur px at bg; fog/haze color + start depth; atmospheric falloff | Blur measure on fg vs bg objects |
| shadows | none / contact / cast; softness px; color hex (black vs tinted) | Edge gradient width |
| light as argument | which state change is a light event (snap on / spread / dim), at `t+` | e.g. percolation span → line lights up in N ms |
| grain / flicker | grain amplitude; flicker Hz | Frame-to-frame luma noise on a flat area |
| grade | black point hex; highlight roll-off (clip / soft); LUT feel (teal-orange / darkgold / mono) | Histogram of 3 frames |

**Pass:** key position, glow radius + intensity, vignette ratio, and ≥1 timed light event are all measured.
**Fail:** "暗金氛围 / 电影感光影" with no numbers, or a `glow: {blur, opacity}` token copied from another base.

---

### D11 · 动画曲线（Easing & timing per beat）

Fill one row per *move type*, not per instance. At least: element enter, element exit, state morph, camera move, transition between beats, emphasis pop.

| 字段 | 单位 / 取值 | 怎么量 |
|---|---|---|
| move type | enter / exit / morph / path-grow / fill / counter / camera push/pan/orbit / transition / emphasis pop | — |
| property | position / scale / opacity / blur / mask / color / stroke-dash | What changes |
| duration | ms (first moving frame → settled frame) | Frame count × (1000/fps) |
| easing type | linear / ease-out (cubic/quart/expo) / ease-in-out / back (overshoot) / spring / step | Plot property vs frame and fit the curve shape |
| overshoot | % past target; number of oscillations; settle ms | Peak vs final position |
| stagger | ms between siblings; order (L→R, center-out, random) | First-motion frame of each sibling |
| anticipation / hold | ms of pre-move or post-hold | — |
| motion blur | yes/no; smear px | Look at the fastest frame |
| persist vs replace | persists / morphs into next / cut away | Links to D4 |
| beat timing | ms from beat start (the argument state change) to the move; lead/lag vs music downbeat if audible | Align with the D7 beat table |
| camera | move type; distance (% of frame or zoom ×); duration ms; easing; parallax layers | Track 2 anchor points |
| transition | cut / match-cut / morph / wipe / zoom-through / dip; duration ms; easing | Frames across the boundary |
| per-beat timing table | beat ID → [moves with start ms, dur ms, ease] | Fill for the densest 10 s at minimum |

**Pass:** the densest 10 s has a per-beat timing table with ms + easing for every move, plus ≥1 measured overshoot or explicit "no overshoot".
**Fail:** `ease: power3.out, dur: 0.45` copied across bases without frame evidence.

---

### 呈现方式 cross-check (ties D2/D5/D6 to FX)

| 项 | 必填 |
|---|---|
| Layout grid | Safe margins px; hero zone %; where FX is allowed vs masked behind type |
| FX ↔ type hierarchy | Particles/glow never cross kicker/hero type; glow on keywords counts toward the D2 ≤2 highlight rule |
| FX ↔ argument | Each FX event mapped to an argument state (D1/D4). Unmapped FX = decoration and counts against the budget |
| FX budget | Max simultaneous FX systems per frame (e.g. ≤1 particle system + ≤1 light event) |

---

## Machine-readable addition to `style-base.yaml`

```yaml
fx:
  evidence_dir: refs/<slug>/fx/
  measured:
    particles:
      - name: warm_dust
        role: ambient            # or semantic: "surprise landing"
        emitter: {type: area, pos_pct: [50, 55]}
        count: {median: 0, peak: 0}
        spawn_per_s: 0
        size_px: [0, 0]
        lifetime_ms: [0, 0]
        velocity_px_s: 0
        dir_deg: 90
        motion: noise_drift
        opacity: {in_ms: 0, out_ms: 0, max: 0.0}
        color: {core: "#", halo: "#"}
        blend: additive
        layers: 1
        trigger: ambient
        frames: ["f0000-f0060"]
    light:
      key: {angle_deg: 0, temp: warm, hex: "#"}
      rim: {on: false, side: null, width_px: 0, hex: null}
      bg_glow: {shape: radial, center_pct: [50, 50], radius_px: 0, core: "#", edge: "#"}
      element_glow: {radius_px: 0, intensity_gain: 0.0}
      bloom: {threshold_luma: 0, spread_px: 0, on_text: false}
      breathe: {period_ms: 0, amp: 0.0, wave: sine}
      sweep: {dir_deg: 0, width_px: 0, speed_px_s: 0, repeat_ms: 0}
      vignette: {corner_center_ratio: 0.0, shape: oval, feather_pct: 0}
      depth: {dof_bg_blur_px: 0, fog: null}
      shadows: {type: none, softness_px: 0, hex: null}
      light_events: [{t: "+0.0", what: "", dur_ms: 0}]
      grain: {amp: 0, flicker_hz: 0}
    motion:
      moves:
        - {type: enter, prop: [opacity, y], dur_ms: 0, ease: easeOutCubic, overshoot_pct: 0, stagger_ms: 0}
      camera: [{type: push, zoom: 1.0, dur_ms: 0, ease: easeInOutSine}]
      transitions: [{type: cut, dur_ms: 0}]
      densest_timing_table: []   # beat → [{start_ms, dur_ms, ease, what}]
  authored: {}                    # our render choices; never cite these as ref evidence
```

## Tooling suggestion (non-binding)

- Dump: `ffmpeg -ss <t0> -t 2 -i source.mp4 refs/<slug>/fx/<effect>/f%04d.png` (no `fps=` filter, so every frame is kept).
- Probes to add next to `fx-probe-2026-11-01/probe.py`:
  - blob tracker for particle count, size and velocity (OpenCV connected components + nearest-neighbour tracking);
  - radial luminance profile for glow radius and vignette;
  - per-element bbox trace, then fit the ease curve and read off overshoot.
- Never take D9–D11 numbers from the 1 fps contact sheets.

## Gate additions (proposed for §3)

- [ ] D9 粒子: ≥1 system measured (count/size/lifetime/velocity/blend + role) **or** a frame-cited N/A
- [ ] D10 光影: key pos + glow radius/intensity + vignette ratio + ≥1 timed light event
- [ ] D11 动画曲线: densest 10 s per-beat timing table (ms + easing + overshoot)
- [ ] `fx.measured` vs `fx.authored` split in yaml; no copied tokens

## Anti-patterns (proposed for §4)

- Copying `glow: {blur: 10, opacity: 0.55}` / `enter: power3.out 0.45` between bases and calling it 蒸馏
- Reading FX off 1 fps contact sheets
- Particle soup with no semantic role, or particles crossing hero type
- Glow on more than 2 keywords per screen (breaks the D2 highlight rule)
- An "电影感光影" adjective with no light position or vignette number
