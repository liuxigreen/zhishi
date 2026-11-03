# lookkit · 共享视觉底座

**规格全文：** `skill-redesign-2026-11-02/LOOK-KIT-SPEC.md`  
**统一模板合同（自蒸）：** `presets/_shared-base/` · 白话 `docs/OWN-TEMPLATE-BASE.md`

## 状态
- `_shared-base`：VISUAL-7 / 多世界 / 字幕 / 全局 BAN **已写成合同**（JSON + PRESET）
- 真跑引擎：`presets/style-ink-land-v3` · `presets/style-noir-land-v1`
- `core/` 模块 JS 仍按 SPEC 逐步补；`core/SHARED-DEFAULTS.md` 先锁行为
- 未选 preset / 无 REF-LOCK 的集禁止整条渲

## 用法（目标）
```js
import { film } from '../../lookkit/core/index.js';
import shared from '../../lookkit/presets/_shared-base/shared-base.json';
import preset from '../../lookkit/presets/ink-land/preset.json'; // or H.js …
film({ preset: { ...shared, ...preset, ...REF_LOCK.overrides }, beats: [/*…*/] });
```
不传 preset → 应抛 `LookKitError: no preset — run vibe-ref-lock`。

## 目录
- `presets/_shared-base/` — 父合同  
- `presets/{H,V,S,P,E,R,ink-land,noir-land,…}/` — 覆盖  
- `core/` — stage · light · material · …（规划）  
- `tools/v7_measure.py` · gate

## 硬规则
1. 默认长相 = 有光、材质、纵深、体量（不是灰底色块）。  
2. 禁 GenerateVideo / hybrid 生成视频床。  
3. 观感数字对 `docs/LOOK-GATE.md` + 本集 `qa/ref/targets.json`。  
4. 画风索引：`refs/STYLE-TEMPLATE-LIBRARY.md` · 用法 `docs/STYLE-LIBRARY-HOW.md`
