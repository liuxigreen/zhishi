# Bases gap audit · 2026-10-31

> Against `docs/DISTILL-MULTIDIM.md`（八维 + Mode 证据句 + 知识锚 = **九项检查**）.  
> Scores: **LOCK** / **SOFT** / **MISS**.  
> Triage: **必重蒸** / **补丁** / **挂起** / **NEW**.  
> This pass does **not** rewrite STYLE-BASE files (except confirming DISTILL-MULTIDIM already has §1b/§1c).

## DISTILL-MULTIDIM status

| Check | Result |
|---|---|
| §1 八维 | Present |
| §1b Mode 听轨一句 + 密帧一句 | **Already present** — no patch |
| §1c 知识锚 出处/示意边界/易杠/免责 | **Already present** — no patch |
| §3 Gate 自检含 Mode + 知识锚 | Already present |

## Summary counts

| Bucket | N | Slugs |
|---|---|---|
| STYLE-BASE present | 19 | see matrix |
| Stub dir (no STYLE-BASE) | 3 | `andy-3d-construction-sim` · `circuit-board` · `zhanwai-darkgold-huashu` |
| **必重蒸** | **5** | moyou · xiaomo · countdown-split · transit-map · desktop-flythrough |
| **补丁** | **8** | dianzi · nexo · sanhao · zhongshan · yingxian · lailong×2 · andy-3d-building |
| **挂起** | **6** | chalkboard · circuit-board-pcb · game-show · isometric-picture-book · memphis-diorama · printed-long-take |
| **NEW · done** | **1** | `bite-red-queen`（九项齐；sample Gate pending） |
| Stubs → 挂起/alias | 3 | construction-sim yaml-only · circuit-board yaml-only · zhanwai = xiaomo DIFF alias |

## Priority queue（必重蒸 · ≤8 · do first）

1. **moyou-darkgold-music** — melody vanity-pass root; 3s motion MISS; BANNED twin SOFT; Mode/知识锚非九项表格式  
2. **xiaomo-darkgold-disarm** — type/motion soft; same darkgold family; ladder #05 still live  
3. **countdown-split** — ladder planning-fallacy craft; Argument/Type/In-frame/Mode/知识锚 thin  
4. **transit-map** — ladder #07; multidim mostly MISS outside beat/props  
5. **desktop-flythrough** — ladder #08; palette+beat craft, no type ladder / inframe / banned / mode / 知识锚  

*(Queue stops at 5; no filler to pad to 8.)*

## Score matrix（STYLE-BASE）

Legend: A=Argument · T=Type ladder · P=Palette roles · M=3s motion · I=In-frame · R=Props · B=Beat density · D=BANNED twins · Mo=Mode evidence · K=Knowledge-anchor

| Base | A | T | P | M | I | R | B | D | Mo | K | Triage | Exact gaps / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| moyou-darkgold-music | LOCK | SOFT | LOCK | **MISS** | LOCK | LOCK | SOFT | SOFT | SOFT | SOFT | **必重蒸** | Add densest `t+0…` 动势; formal BANNED twin signatures (waveform/DROP/brain gestalt); Mode 两句表; 知识锚易杠 (Salimpoor 示意边界) |
| xiaomo-darkgold-disarm | LOCK | SOFT | LOCK | **MISS** | LOCK | LOCK | SOFT | SOFT | SOFT | SOFT | **必重蒸** | Same as moyou for M/D/Mo/K; harden type ladder ≥4 with weight/color/pos from densest frames |
| countdown-split | SOFT | **MISS** | SOFT | SOFT | **MISS** | LOCK | LOCK | SOFT | SOFT | **MISS** | **必重蒸** | Type ladder table; INFRAME+crop-bottom; Mode 听轨+密帧; 知识锚 for clock「示意」; Argument one-liner |
| transit-map | SOFT | **MISS** | SOFT | **MISS** | **MISS** | LOCK | LOCK | **MISS** | **MISS** | SOFT | **必重蒸** | Full multidim pass; BANNED twin; Mode; 3s motion on line-grow |
| desktop-flythrough | SOFT | **MISS** | LOCK | SOFT | **MISS** | LOCK | LOCK | **MISS** | **MISS** | **MISS** | **必重蒸** | Type; In-frame; BANNED; Mode; 知识锚 |
| dianzi-info-surprisal | LOCK | **MISS** | LOCK | **MISS** | SOFT | LOCK | SOFT | **LOCK** | **LOCK** | SOFT | **补丁** | Formal ≥4 type ladder @1080; densest 3s motion list; INFRAME crop-bottom field; 易杠点表 |
| nexo-crowd-phone | LOCK | SOFT | LOCK | SOFT | SOFT | LOCK | SOFT | SOFT | **LOCK** | SOFT | **补丁** | Timed 3s motion on densest 27–36s; INFRAME section; BANNED twin rows (pill/gaze/shield gestalt); 易杠 (Pew 数字边界) |
| sanhao-halo-effect | LOCK | SOFT | LOCK | **MISS** | SOFT | LOCK | LOCK | SOFT | SOFT | SOFT | **补丁** | 3s motion; BANNED twin (halo silhouette gestalt); Mode 听轨诚实句; 易杠 |
| zhongshan-learn-fast | LOCK | SOFT | LOCK | **MISS** | SOFT | LOCK | LOCK | SOFT | SOFT | SOFT | **补丁** | 3s motion; BANNED; Mode 两句表; 易杠 + theory-family 撞车声明 (学习科学) |
| yingxian-tenon | LOCK | SOFT | SOFT | SOFT | SOFT | LOCK | **MISS** | **MISS** | SOFT | **LOCK** | **补丁** | Beat density rules; BANNED twin (museum CGI/dougong); formal Mode; type ladder px table |
| lailong-xuanzang-passport | LOCK | SOFT | LOCK | **MISS** | SOFT | LOCK | LOCK | SOFT | SOFT | **LOCK** | **补丁** | 3s motion; BANNED twin; Mode 两句; INFRAME crop |
| lailong-zhaoyun-infant | LOCK | SOFT | LOCK | **MISS** | SOFT | LOCK | SOFT | SOFT | SOFT | **LOCK** | **补丁** | Same family gaps as xuanzang |
| andy-3d-building | SOFT | **MISS** | SOFT | **MISS** | **MISS** | LOCK | LOCK | **MISS** | SOFT | SOFT | **补丁** | Type; motion; inframe; BANNED — or demote to 挂起 if 3D path idle |
| chalkboard | **MISS** | **MISS** | LOCK | **MISS** | SOFT | SOFT | SOFT | **MISS** | **MISS** | **MISS** | **挂起** | Palette/camera craft only; no schedule |
| circuit-board-pcb | **MISS** | **MISS** | SOFT | **MISS** | **MISS** | SOFT | LOCK | SOFT | SOFT | **MISS** | **挂起** | Beat/BGM craft; unused |
| game-show | **MISS** | **MISS** | SOFT | **MISS** | **MISS** | LOCK | LOCK | **MISS** | SOFT | **MISS** | **挂起** | |
| isometric-picture-book | **MISS** | **MISS** | LOCK | SOFT | **MISS** | SOFT | LOCK | **MISS** | **MISS** | SOFT | **挂起** | |
| memphis-diorama | **MISS** | **MISS** | LOCK | **MISS** | **MISS** | LOCK | LOCK | **MISS** | **MISS** | SOFT | **挂起** | |
| printed-long-take | **MISS** | **MISS** | LOCK | **MISS** | **MISS** | **MISS** | **MISS** | **MISS** | **MISS** | SOFT | **挂起** | |

## Stubs / special

| Dir | STYLE-BASE? | Triage | Note |
|---|---|---|---|
| **bite-red-queen** | **Yes** (2026-10-31) | **NEW · done** | Full 8维+Mode+知识锚+BANNED; refs under `refs/bite-xinyu-redqueen/`; sample Gate pending |
| andy-3d-construction-sim | yaml only | **挂起** | Superseded/sibling of andy-3d-building |
| circuit-board | yaml only | **挂起** | Prefer circuit-board-pcb if ever revived |
| zhanwai-darkgold-huashu | DIFF.md only | **挂起 / alias** | Points at xiaomo-darkgold-disarm — fold into xiaomo 必重蒸, do not dual-maintain |

## Dim failure hotspots（across library）

| Dim | Dominant score | Implication |
|---|---|---|
| 3s motion | MISS/SOFT almost everywhere | Largest systemic gap post-melody |
| Type ladder | SOFT or MISS | Few bases meet ≥4-tier densest-measured table |
| BANNED twins | SOFT/MISS except dianzi | Only dianzi has Award-D-ready twin list |
| Mode evidence | SOFT unless explicit Mode lock table | dianzi + nexo are templates |
| Knowledge-anchor 易杠 | SOFT/MISS | Cite/示意 common; 易杠+免责 rare |
| In-frame | LOCK only on xiaomo/moyou patches | Others need INFRAME + crop-bottom Gate field |

## Recommended next actions（parent）

1. **bite-red-queen** STYLE-BASE done — use as nine-item template.  
2. 必重蒸 queue #1–2 (moyou → xiaomo) before any new darkgold episode.  
3. Patch dianzi + nexo (small, high ROI) so silent_text_first exemplars are Gate-clean.  
4. Leave 挂起 craft bases untouched until a UPGRADE.md names them.

