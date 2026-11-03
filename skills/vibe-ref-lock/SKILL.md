---
name: vibe-ref-lock
description: Use before writing film code for a Vibe知识大赏 episode — lock the look preset, one palette, and a readable caption style (font, sizes, contrast rules); re-open after a look critique; when changing style, show several styles side by side first.
---
# 参考锁 → REF-LOCK

蒸馏进像素的唯一入口。**没有 REF-LOCK.md，不写、不改 film.js。**

只读：`styles-own/catalog.json` · `docs/OWN-HOW.md` · `docs/OWN-TEMPLATE-BASE.md` · `docs/STYLE-LIBRARY-HOW.md` · `docs/LEMO-HOW-选风用法.md` · `refs/STYLE-TEMPLATE-LIBRARY.md` · `docs/CANON-VISUAL-7.md` · `refs/REF-LIBRARY.md` · `lookkit/presets/_shared-base/`。  
输入：`TOPIC-LOCK.md` + `CONTENT-BOARDS.md`。  
原图/对原片定帧留在风格包 `refs/` 与 `stills/`，**不贴进 skill 正文**；本集只拷钩到 `qa/ref/`。

## 步骤
1. **定册**：H/V/S/P/E/R。拿不准选「中区更满」。
2. **选长相（按优先级）**  
   - **A · 自有 styles-own（默认）**：打开 `catalog.json`，只锁 `status=done`。读该包 `STYLE.md` **§12 人物观感** + **§13 道具生成语法**。记下四库绝对路径：`styles-own/<id>/demo/{look,people,props,motion}.js`（渲染必须加载/改编，禁止从零重画人/道具）。`own-bite-red` = parked → 跳过。  
   - **B · 生产硬刚**：水墨多世界 → `P-ink-land-prod`；暗黑钠灯 → `R-noir-land-prod`（= `_shared-base` + 生产覆盖）。  
   - **C · Lemo 外部次选**（仅当比任何 own 更贴题）：按 `LEMO-HOW` — INDEX 挑 slug → 读 `STYLE.md`。  
     - **全跟 Lemo**：色板、材质、光、字排、人物语言、道具与运动语法、原生动作、Pitfalls（**不要稀释**成只抄色值自己画）。  
     - **仅两处覆盖**：① 成片 **禁旁白/人声**；② 镜头/换场/展示 = 我们多世界手法（≥20 · 剧情推动换场 · 字幕 only）。  
     - **不抄** demo 剧情/镜头表；路径字段写 `lemo`，**禁止**标成自蒸。  
   - 禁跨册。理由写「3 个视觉事实」，禁止只写「氛围像」。  
   - 换风时：并排 2～3 个 styleframe（own 用包内 `stills/styleframe-vs-source.jpg`，个别包别名 `vs-5918`/`vs-5155` 视同 vs-source）给 Adelaide 再锁。
3. **拷静帧**到 `qa/ref/hook_ref.jpg`（可选 mid），**源路径必须可核对**：  
   - own → `styles-own/<id>/refs/*` 或 `stills/styleframe-vs-source.jpg`（真像素，禁止凭色值空想）  
   - Lemo → `refs/lemo-demos/frames/<slug>/styleframe.jpg`
4. **测数字**（有条件）：`python3 lookkit/tools/v7_measure.py qa/ref/*.jpg --content-crop auto > qa/ref/targets.json`。无 MEASURED 时先用 3 事实 + BAN，探针后再补测。
5. **选 kit / 代码锚**：`_shared-base` +（own 四库 \| ink/noir preset \| Lemo STYLE 参数表）。写出覆盖。
6. **逐维写落地** V1–V7。
7. **写 BAN**：本风 BAN_extra + 全局 BAN（灰底色块/生成视频床/无 REF-LOCK）。Lemo 路径另加：旁白口播床。

## REF-LOCK.md 模板
```
# REF-LOCK · <slug> · v<n>
册：      理由：
路径：ink|noir|own|lemo
template id / Lemo slug：
参考：hook_ref ← <包内真像素或 lemo styleframe 源路径>
父合同：lookkit/presets/_shared-base
own 四库：（路径=own 时必填）look.js / people.js / props.js / motion.js
Lemo 全跟：（路径=lemo 时）色材光字人道具运动原生动作 = STYLE.md；覆盖仅=禁旁白+多世界镜头
这张图的 3 个视觉事实：1… 2… 3…
targets.json：（有则填）
| V | 参考是什么 | 目标 | kit 模块/参数 |
preset / 库：…  覆盖：{ … }
BAN：
说明：STRUCTURE/故事按 Vibe 多世界；own=加载四库；lemo=工艺全跟且不稀释、不标自蒸。不抄任何 demo 剧情。
下一步：vibe-knowledge-film（先探针帧；扩世界见 OWN-DEMO-TO-FULL）
```

## V 册虚空
近黑/虚空背景只在本集选的就是 V 册参考且写了 hero 体量 + grain + 层数时合法。

## 重开（批评之后）
从 `CRITIQUE-n.md` 指名维开始：换参考或改目标，版本号 +1。不在这里改板子内容。
