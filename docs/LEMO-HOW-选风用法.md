# 怎么用 Lemo 模板（白话 · 给导演 / Adelaide）

一句话：**故事和多世界 STRUCTURE 按我们的导演手法；Lemo 长相与工艺（色/材/光/字/人/道具/运动语法/原生动作）**全跟**；仅覆盖：禁旁白 + 我们的多世界镜头/展示。不抄 demo 剧情。Lemo 是外部次选——先扫 `styles-own/catalog.json`。**

不需要把 66 条都做成 LOOK-CARD。菜单就是 Lemo 索引；选中一条后，按下面步骤锁进 REF-LOCK 即可。

---

## 分工（别搞混）

| 我们管（仅此） | Lemo 管（其余全跟） |
|---|---|
| 选题、CONTENT 板、贯穿视觉事件 | 色板、材质、光、字排 |
| **多世界 STRUCTURE / 镜头与展示**：剧情推动换场 · ≥20 世界 · 一镜旅行 · 字幕讲故事 | 人物语言、道具与运动语法、原生动作、type、Pitfalls/BAN |
| 观感门、字幕可读、READY 交付 | styleframe + STYLE.md 作像素/工艺锚 |
| **成片禁旁白 / 人声讲解**（可无旁白配乐） | — |

**硬规矩：** 锁了某条 Lemo → **长相与工艺跟 Lemo 走，不要稀释**（别只抄色值自己重画人/道具）。  
**仅两处覆盖：** ① 不要旁白/口播床；② 镜头与换场用我们的多世界手法，**不抄** `DEMO.md` 剧情/镜头表。  
**不安装、不跑** Lemo 插件。**不把** Lemo 出片标成「自蒸」。

---

## 菜单在哪

1. 本地全表：`refs/lemo-demos/INDEX.md`（68 条样片 + 何时用）  
2. 官方画廊（可看片）：https://lemomo-ai.github.io/lemo-opuscar/  
3. 工艺原文：`/workspace/lemo-opuscar/styles/<slug>/STYLE.md`  
4. 样帧：`refs/lemo-demos/frames/<slug>/styleframe.jpg`  
5. 样片：`refs/lemo-demos/<slug>.mp4`

自有九套优先：`styles-own/catalog.json`（见 `OWN-HOW.md`）。  
生产全片锚仍可用：水墨横屏 `P-ink-land-prod`、暗黑钠灯 `R-noir-land-prod`。  
**仅当 own 与生产锚都不贴题、而某条 Lemo 更合适时**，走本篇选风路径出片。

---

## 标准流程（我们的 skill + Lemo 选锁）

1. **CONTENT 过了**（`CONTENT-BOARDS.md` Pass）——故事床先定。  
2. **定册** H/V/S/P/E/R（拿不准选中区更满的）。  
3. **打开 Lemo 菜单** `INDEX.md`，按题材挑 **1 个** slug（可再借另一个的一个原生动作）。  
4. **读该条 `STYLE.md`**（至少：Essence、Materials、Colour、Camera、Pitfalls）。把要保住的 **3 条视觉事实** 和 **BAN** 写下来。  
5. **拷钩静帧** `refs/lemo-demos/frames/<slug>/styleframe.jpg` → 本集 `qa/ref/hook_ref.jpg`（可选再拷一张 mid）。  
6. **写 `REF-LOCK.md`**（vibe-ref-lock）：册 + Lemo slug + 3 事实 + BAN + targets（能测就测）+ 用哪个 kit 册 preset。  
7. **再写 STRUCTURE / film**——多世界换场、论证板、字幕纪律全按我们的 vibe-knowledge-film；画面参数对着 REF-LOCK，不对着 demo 故事。

对齐 Lemo 自己的习惯（`AGENTS.md` Finding the style + Look）：先选风格 → 再 treatment/结构 → 用真画风检查 styleframe；我们把 treatment/结构换成自己的 CONTENT + STRUCTURE，Look 步换成 REF-LOCK。

想「改一改再用」时：对照 Lemo `MY-STYLES.md`——**选 base + 写 CHANGES**（改色/字/节奏），不要从空白漂。

---

## 举例：5 个常用选法（册 ↔ Lemo）

| 我们的册 | 题目大概长这样 | 建议 Lemo slug | 你锁住什么 |
|---|---|---|---|
| S / R | Agent、App、工作流步骤 | `desktop-flythrough` | 点阵桌面一镜；贴纸弹成体素；步骤有按压重量 |
| S | 排队、规则、步骤秩序 | `isometric-picture-book` | 等距锁定；图解人；掀盖看内部 |
| V | 数据流、工具链、系统内部 | `circuit-board` | 正俯视 PCB；信息=铜上的光 |
| P | 纠错课、词源、一题一板 | `chalkboard` | 墨绿板真笔顺；写擦改写 |
| P | 迁徙、长叙事、诗意知识 | `printed-long-take` | 墨纸刮版；一点红给主体；一镜穿景 |

更多「何时用」直接查 `INDEX.md`，不必先做卡。

---

## REF-LOCK 里最少写这些（Lemo 路径）

```
册：
Lemo slug：
钩静帧：qa/ref/hook_ref.jpg ← refs/lemo-demos/frames/<slug>/styleframe.jpg
3 视觉事实：1… 2… 3…   （从 STYLE.md Essence/Materials/Colour 抽出，禁止只写「高级感」）
BAN：                     （STYLE.md pitfalls + 本集最容易滑回去的默认长相）
preset：lookkit/presets/<册>/ …
说明：故事/STRUCTURE/镜头按 Vibe 多世界；Lemo STYLE **全跟**（色材光字人道具运动原生动作，不稀释）。不抄 demo 剧情。成片禁旁白/人声；字幕 only。路径=lemo（非自蒸）。
```

---

## 和「只用水墨/钠灯」怎么选

- 道歉、道德许可、多世界水墨横屏 → 继续 `P-ink-land-prod`（不必硬套 Lemo）。  
- 误认/审讯冷叙事 → `R-noir-land-prod`。  
- **其它新长相** → 先 own catalog；再本篇：INDEX 选 slug → STYLE.md → REF-LOCK → 再 STRUCTURE（禁旁白）。

全片渲染引擎暂时仍只有 ink / noir 硬刚；Lemo 锚先保证**不跑偏**。升到「能全片跑该材质」再开专项，不假装插件已接入。
