# FX re-distill progress · 2026-11-01

> Silent FX-only pass (D9 粒子 · D10 光影 · D11 动画曲线). Specs: `REDISTILL-AUDIT-2026-11-01.md`, `DISTILL-FX-DIMS-PROPOSAL.md`.  
> Rule: ≥2s @ source fps; `fx.measured` vs `fx.authored`; 1fps sheets ≠ evidence.

## Queue status

| # | base | status | evidence |
|---|---|---|---|
| 1 | **sanhao-halo-effect** | **COMPLETE** | `fx/MEASURED.md` + orb/streak/cta dumps |
| 2a | **lailong-history-person** (beacon flame) | **COMPLETE** | `fx/stills/flame-smoke/` 90f + MEASURED |
| 2b | **lailong-xuanzang-passport** | **COMPLETE** | 5×180f paper windows + MEASURED |
| 2c | **lailong-zhaoyun-infant** | **COMPLETE** | 5×180f dust windows + MEASURED |
| 3 | **xiaomo-darkgold-disarm** | **COMPLETE** | densest 180f + breathe 120f; zhanwai pointer |
| 3b | **zhanwai-darkgold-huashu** | **COMPLETE (shared source)** | points at xiaomo MEASURED |
| 4 | **moyou-darkgold-music** | **COMPLETE** | full30 **1198** frames |
| 5 | **nexo-crowd-phone** | **COMPLETE** | bracket-27-36 **270** frames |
| — | bite-red-queen / moyou-story / dianzi | **SKIPPED** | no local source.mp4 this run |

Douyin likes-top-30 FX study: **blocked on login** (out of band; not in this silent deliverable).

---

## Headline measured numbers (@1080 unless noted)

### sanhao-halo-effect
- moon ring r **300** / FWHM **20.6** / glow→10% **+28**; orb r **47.8**
- vignette **0.275** (CTA eye **0.108**)
- stars **47** static; mist ~**0 px/s**
- text fade **470ms**; CTA cut **33ms**; eye in **233ms**; no hold breathe

### lailong-history-person (烽火)
- flame glow→15% **300px** / →10% **345px**
- flicker period **633ms**, amp **18.7%**
- embers ~**80**; smoke grow **400ms**; vignette **0.38**

### lailong-xuanzang-passport
- ash dust **166** @ **18 px/s**; warm flecks **143** @ **7.5 px/s**
- vignette **0.23–0.44**; ignore 4k+ grain false-positives as particle budget

### lailong-zhaoyun-infant
- dust **32–420** (lantern shot **368**); speed **8–18 px/s**
- vignette **0.20–0.72**

### xiaomo / zhanwai (same 180s file)
- vignette **0.105**; glow→15% **344px** / →10% **480px**
- dust **42–180**; hold amp **8%**, **period null** (no sine breathe)
- legacy breathe token → authored myth

### moyou-darkgold-music
- D9 N/A (no discrete particles)
- gold fill 20→80 **400ms** @ t+21.10; cx **~128–482 px/s**
- vignette **0.14–0.43**

### nexo-crowd-phone
- D9 N/A
- focus width snap **33ms** @ t+31.90 (428→241 src)
- bracket appear **67ms**; spotlight ramp **~1100ms**; vignette **0.14**

---

## Deliverable paths (per completed base)

```
bases/<slug>/fx/MEASURED.md
bases/<slug>/fx/stills/...
bases/<slug>/style-base.yaml   # fx.measured + fx.authored
bases/<slug>/STYLE-BASE.md     # FX layer section
```

Probe scratch: `docs/fx-probe-2026-11-01/` (`batch-partial.json`, `xuanzang-paper.json`, `zhaoyun-dust.json`, strips).

---

## Remaining / next

1. Douyin top-30 likes FX frame study — needs login; then distill **new** bases from that list.
2. Optional deepen: xuanzang paper-tear burst if a clearer tear event is found; zhaoyun lantern radial probe (currently 估); xiaomo bubble glow px ruler.
3. Audit said 27/27 missing FX evidence — this run clears **8 bases** (incl. zhanwai share). Next FX queue from audit after Douyin list: chalk-dense, andy-building, learn-zhongshan, memphis, etc. when local mp4 exists.
4. Do **not** edit `DISTILL-MULTIDIM.md` / skills until proposal merge.

## Gate check (proposal)

| base | D9 | D10 | D11 | pass? |
|---|---|---|---|---|
| sanhao | ✓ stars/mist/motes | ✓ glow+vignette+events | ✓ ms+ease+no overshoot | YES |
| lailong-history | ✓ embers/smoke | ✓ glow+flicker+vignette | ✓ smoke 400ms | YES |
| xuanzang | ✓ ash/flecks | ✓ vignette range | ✓ drift (weak enters) | YES (D11 thin) |
| zhaoyun | ✓ dust | ✓ vignette range | ✓ drift | YES (D11 thin) |
| xiaomo | ✓ dust | ✓ vignette+radial | ✓ hold/cuts | YES |
| moyou | N/A cited | ✓ fill+vignette | ✓ fill 400ms | YES |
| nexo | N/A cited | ✓ bracket+spotlight | ✓ snap 33ms | YES |
