---
name: vibe-suite
description: Use first for any Vibe知识大赏 episode or skill question — the stage map (topic → content → STRUCTURE scene chain → review → render → READY → critique) and which skill each stage uses.
---
# Vibe知识大赏 · 套件图

项目根：`/workspace/vk-distill/`。每集目录：`episodes/<slug>/`。

## 阶段 · 产物 · 下一步条件
| # | 阶段 | skill | 产物（episode 内） | 只读这些 doc | 进下一阶段 |
|---|---|---|---|---|---|
| S0 | 选题 | vibe-topic-pipeline | `TOPIC-LOCK.md` | CANON-CONTENT §0–1 | 四问全 Y + ≥3 角度 |
| S1 | 内容 | vibe-content-densify | `CONTENT-BOARDS.md` | CANON-CONTENT | 内容门 Pass → **只准**去 S2 |
| S2 | 参考锁 / Look | vibe-ref-lock | `REF-LOCK.md` · `qa/ref/` | **styles-own/catalog.json** · OWN-HOW · OWN-TEMPLATE-BASE · STYLE-LIBRARY-HOW · LEMO-HOW · STYLE-TEMPLATE-LIBRARY · _shared-base · CANON-VISUAL-7 | 静帧（包内真像素）+ 3 事实 +（own 四库路径 \| Lemo STYLE 全跟）齐 |
| S3 | 渲染 | vibe-knowledge-film | `qa/probe/` → `build/densest.mp4` | CANON-CRAFT · OWN-DEMO-TO-FULL · lookkit/README | 探针帧过预检才渲整条 |
| S4 | 观感门 | vibe-director-evolve | `qa/gate/*.jpg` · `GATE.md` | LOOK-GATE | 他审 Pass → **S6 交付** |
| S5 | 批评入口 | vibe-director-evolve | `CRITIQUE-n.md` + **通则写回相关 skill** | LOOK-GATE §5 | 回到被定位的阶段 |
| S6 | 交付 | （本表 + DELIVER.md） | PC 上 D: 最终路径 | **`docs/DELIVER.md`** | Desktop 英文暂存 → Move-Item 到 `D:\Vibe知识大赏-试做\…` |
| 旁路 | 拆片 | vibe-video-breakdown | `refs/<id>/LOOK-CARD.md` | vendor shot_glossary | 登记 REF-LIBRARY（Lemo 选风不要求先拆全卡） |

**判断下一步**：看这集缺哪个产物，就做那一阶段。不跳阶段。

## S2 选风（默认顺序）
1. **自有九套优先**：读 `styles-own/catalog.json`（只锁 `status=done`；`own-bite-red` = parked 禁新片）。指针 `docs/OWN-HOW.md`。  
2. 生产硬刚：水墨多世界 `P-ink-land-prod` / 暗黑钠灯 `R-noir-land-prod`。  
3. **Lemo 外部次选**：题材比任何 own 更贴 → `docs/LEMO-HOW-选风用法.md`。  
   - **全跟** Lemo：色/材/光/字/人/道具/运动语法/原生动作（**不稀释**成只抄色值）。  
   - **仅两处覆盖**：① 成片 **禁旁白/人声**（字幕 only，可无旁白配乐）；② 镜头与展示 = 我们多世界手法（剧情推动换场 · ≥20 世界 · 字幕讲故事）。  
   - **不抄** Lemo demo 剧情/镜头表；**禁止**把 Lemo 结果标成「自蒸」。  
4. 故事与 STRUCTURE **始终**按 vibe-knowledge-film；示范扩全片见 `docs/OWN-DEMO-TO-FULL.md`。

## 硬停
1. 无 `REF-LOCK.md` → 不准写/改 `film.js`。  
2. 探针帧未过 → 不准渲整条。  
3. 渲染者只能标 `READY`，不能给自己 Pass。  
4. 收到批评 → 先写 `CRITIQUE-n.md`，**并把通则写回相关 skill**；不准只改代码重渲。  
5. 纯代码出片；不用生成视频做床；灰底色块壳 BAN。  
6. 锁 `own-*` 却不加载该包四库 / 不读 §12–13 → 停。  
7. 学到的东西：改 LOOK-CARD 或替换 canon 一行；Lemo 菜单维护用 INDEX。

## canonical docs（`docs/`）
CANON-CONTENT · CANON-CRAFT · CANON-VISUAL-7 · LOOK-GATE · DIRECTOR-EVOLVE-LOG · DOUYIN-PUBLISH · **DELIVER** · **OWN-HOW** · **OWN-DEMO-TO-FULL** · OWN-TEMPLATE-BASE · STYLE-LIBRARY-HOW · LEMO-HOW-选风用法  
库表：`styles-own/catalog.json` · `refs/STYLE-TEMPLATE-LIBRARY.md`

## 命名
- 题型卡：史 · 心 · 法  
- 视觉册：H · V · S · P · E · R  
- 切型：dense · sparse · soft · stack
