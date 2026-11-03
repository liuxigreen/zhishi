# 画风模板库怎么用（白话）

一句话：**不一定抄，但有锚。**  
故事用我们的多世界 STRUCTURE；长相优先 **自有 styles-own 九套**（= shared-base + 该包四库）；其次生产水墨/钠灯；再次才借 **Lemo 外部菜单**（工艺全跟；仅禁旁白 + 我们多世界镜头；不抄 demo 剧情）。

## 先看哪个文件

| 你想… | 打开 |
|---|---|
| **自有九套怎么锁**（默认先看） | **`styles-own/catalog.json`** + **`docs/OWN-HOW.md`** |
| 自蒸底座合同 / bases 映射 | `docs/OWN-TEMPLATE-BASE.md` |
| 示范 24s → ≥20 世界全片 | `docs/OWN-DEMO-TO-FULL.md` |
| 统一底座参数 | `lookkit/presets/_shared-base/PRESET.md` |
| Lemo 外部菜单（次选） | `docs/LEMO-HOW-选风用法.md` · `refs/lemo-demos/INDEX.md` |
| 已命名生产/火片锚 | `refs/STYLE-TEMPLATE-LIBRARY.md` §1 / §7 |
| 交付到 D 盘 | `docs/DELIVER.md` |

## 开片怎么选长相

1. CONTENT 过了，定册 H/V/S/P/E/R。  
2. **扫** `styles-own/catalog.json`（`status=done`）— 贴题就锁 `own-*`。  
3. 心理/历史等已有 own 包时，**不要**用 Lemo 充数冒充自蒸。  
4. 无 own 匹配：水墨多世界 → `P-ink-land-prod`；暗黑钠灯 → `R-noir-land-prod`。  
5. 仍无：Lemo INDEX 选 slug（外部）→ STYLE.md **全跟**（人/道具/运动也跟）→ styleframe → REF-LOCK；**仅**禁旁白 + STRUCTURE/镜头按我们。  
6. 无 REF-LOCK 不准写 film。

## 锁 own-* 时

- 读该包 STYLE.md §12 + §13  
- 加载 `demo/look.js` · `people.js` · `props.js` · `motion.js`（改编，不重画）  
- `hook_ref` ← 包内 `refs/*` 或 `stills/styleframe-vs-source.jpg`  
- 原图留在包内

## 有锚不跑偏

| 做 | 不做 |
|---|---|
| 点名 own id / 生产 id / Lemo slug + 3 视觉事实 | 「这次高级一点」却不指模板 |
| 默认 `_shared-base` + own 四库 | 从零手画灰底人物 |
| 钩静帧钉在 `qa/ref/` 且源路径可核对 | 心理题拿烽火战阵当钩 |
| 不抄 Lemo/own demo 剧情；成片字幕 only；Lemo 工艺不稀释 | 旁白讲课；把 demo 镜头表当 STRUCTURE；只抄色值自画人 |
| 把 Lemo 结果标成 lemo 路径 | 把 Lemo 拷贝标成「自蒸」 |
