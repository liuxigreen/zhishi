# `_shared-base` · 自蒸统一模板底座

> **每一个自有画风 = 本底座 + 覆盖（色板 / 材质 / 相机）。**  
> 不是第二套渲染器；是防止漂回「灰底色块 UI」的默认合同。

## 必守（继承到 ink / noir / 未来册）
1. **有光、有材质、有纵深、有体量**（LOOK-KIT-SPEC §0）
2. **多世界旅行默认：** ≥20 世界、剧情推动换场、一镜穿、静音 2 秒可读、因果同框
3. **字幕：** 单字体、对比 ≥4.5:1（争取 5:1）、白话因果句
4. **禁：** 平涂灰底、纸偶壳、生成视频床、无 REF-LOCK 写 film

## 怎么用
```
shared-base  →  册/具名 overrides（palette, light, material, camera, BAN）  →  REF-LOCK
```
- 生产全片：`P-ink-land-prod` / `R-noir-land-prod` = shared-base + 各自 preset.json  
- 其它自蒸锚：查 `docs/OWN-TEMPLATE-BASE.md` 映射表  
- 非自蒸长相：Lemo 菜单（`docs/LEMO-HOW-选风用法.md`），仍继承 shared-base 的多世界/字幕/BAN

## 文件
- `shared-base.json` — 机器可读默认  
- 规格长文：`docs/OWN-TEMPLATE-BASE.md`  
- 模块规划：`skill-redesign-2026-11-02/LOOK-KIT-SPEC.md`
