# 自蒸统一模板底座 · OWN-TEMPLATE-BASE

更新：2026-11-03e · **9 own done / bite-red parked**  
一句话：**导演手法用我们的多世界；长相默认 styles-own（shared-base + 四库）。Lemo 是外部菜单——锁了就工艺全跟，仅禁旁白 + 多世界镜头；不是自蒸。**

## 0 · 统一底座里有什么

路径：`lookkit/presets/_shared-base/`（`shared-base.json` + `PRESET.md`）

| 块 | 内容 |
|---|---|
| 多世界合同 | ≥20 世界 · 120–150s · 剧情换场 · 一镜 · 静音 2s · 因果同框 |
| VISUAL-7 默认 | 体量半屏意图 · ≥3 层雾 · 接触影 · 命名材质 · 定向光 · fg 遮挡 · hold≤3s 警告 |
| 字幕默认 | Noto Serif SC · ≥4.5:1 · 单字体 · 白话因果 |
| 全局 BAN | 灰底色块 · 纸偶 · 生成视频床 · 无 REF-LOCK · 抄 Lemo 剧情 |
| 真跑引擎 | 目前仅 ink-land-v3 / noir-land-v1 |

公式：

```
自有模板 = _shared-base + overrides(palette, light, material, camera, BAN_extra)
```

## 1 · bases 审计摘要（25）

| 状态 | 数量 | 说明 |
|---|---|---|
| 已补 LOOK-CARD / 可用锚 | **22**（含本轮新卡） | 见下映射表「卡」列 |
| 合并指向（不单开） | **3** | construction-sim→andy · circuit-board→pcb · zhanwai→xiaomo |
| 真残余 stub | **1** | `V-dianzi-surprisal`：语法齐、**本机静帧 TBD** |
| yingxian | 已升格 | 用 wooden-pagoda qa 静帧；全塔测绘仍 GAP |

本轮新 LOOK-CARD：bite-redqueen · countdown · desktop-flythrough · memphis · transit-map · circuit-pcb · xiaomo-disarm · lailong-person · moyou-percolation · yingxian · game-show · dianzi-surprisal(stub 卡)

## 2 · 映射表（bases → template → shared-base + overrides）

| bases folder | template id | 册 | LOOK-CARD | = shared-base + 主要 overrides |
|---|---|---|---|---|
| andy-3d-building | `S-andy-build` | S | andy-building | 移轴微缩 · 工期计数器 · 一镜建造生长 |
| andy-3d-construction-sim | → `S-andy-build` | S | （合并） | MERGE.md |
| bite-red-queen | `V-bite-redqueen` | V/E | bite-redqueen | 黑底 · 语义红 · 动能字+gadget · BANNED twins |
| chalkboard | `P-chalkboard` | P | chalkboard-lemo | 墨绿板 · 真笔顺 · 橙强调 |
| circuit-board | → `V-circuit-pcb` | V | （合并） | MERGE.md |
| circuit-board-pcb | `V-circuit-pcb` | V | circuit-pcb | 正俯视 FR-4 · 琥珀电流光 |
| countdown-split | `R-countdown` | R | countdown | 分屏墙=剪辑 · 橙钟 |
| desktop-flythrough | `S-desktop-fly` | S/R | desktop-flythrough | 点阵桌 · 钴蓝 · 一镜停顿 |
| dianzi-info-surprisal | `V-dianzi-surprisal` | V | dianzi-surprisal | **stub still** · 蓝结构/金惊奇 · 公式后置 |
| game-show | `R-game-show` | R | game-show | 单色舞台轮换 · 正面硬切 |
| isometric-picture-book | `S-iso-picturebook` | S | isometric-picture-book | 等距锁角 · 掀盖 · 地面字 |
| lailong-history-person | `H-lailong-person` | H | lailong-person | 满幅地形 · 人嵌城郭 |
| lailong-xuanzang-passport | `H-xuanzang` | H | xuan-zang REF | 旅程文牒 |
| lailong-zhaoyun-infant | `H-zhaoyun` | H | zhaoyun REF | 战阵人物 |
| memphis-diorama | `S-memphis` | S | memphis | 粉彩玩具城 · 纸框 |
| moyou-darkgold-music | `V-moyou-darkgold` | V | moyou-darkgold | 炭黑金线知识物件 |
| moyou-story-percolation | `V-moyou-percolation` | V/E | moyou-percolation | 暗金 + lattice 故事床 |
| nexo-crowd-phone | `E-nexo-crowd` | E | nexo-crowd-phone | 人群手机墙 |
| printed-long-take | `P-printed-long` | P | printed-long-take | 墨纸刮版 · 一点红 · 一镜 |
| sanhao-halo-effect | `E-halo` | E | sanhao-halo | 光环第一印象 |
| transit-map | `P-transit-map` | P | transit-map | 暖纸笔尖路网 |
| xiaomo-darkgold-disarm | `E-xiaomo-disarm` | E | xiaomo-disarm | 六层卸防暗金 HUD |
| yingxian-tenon | `S-yingxian` | S/H | yingxian | 双筒榫卯斗栱生长 |
| zhanwai-darkgold-huashu | → `E-xiaomo-disarm` | E | （合并） | MERGE.md |
| zhongshan-learn-fast | `E-zhongshan-learn` | E/V | zhongshan-learn | 学习/马太 |

### 生产全片（不在 bases/，同属 shared-base 族）

| id | overrides 要点 | 引擎 |
|---|---|---|
| `P-ink-land-prod` | 宣纸水墨 · 朱红强调 · 纸带字幕 · ≥20 世界 | `style-ink-land-v3` |
| `R-noir-land-prod` | 深蓝黑 · 钠灯琥珀 · 湿沥青/雾 | `style-noir-land-v1` |

## 3 · 导演怎么选（自蒸路径 · 默认优先 styles-own）

1. CONTENT 过门 → 定册  
2. **先扫** `styles-own/catalog.json`（`status=done`）— 有匹配就锁 `own-*`（见 §6 / `OWN-HOW.md`）  
3. 无合适 own 包时再看本表 bases 映射或生产 `P-ink-land-prod` / `R-noir-land-prod`  
4. 默认带上 `_shared-base`（多世界+字幕+VISUAL-7+BAN）  
5. 写 REF-LOCK：3 视觉事实 + overrides + BAN_extra；own 路径还要写清四库路径与 hook 源像素  
6. STRUCTURE 仍按 vibe-knowledge-film（剧情推动换场 · ≥20 世界）  
7. 若 Lemo 更贴题 → `LEMO-HOW-选风用法.md`（外部菜单）：**STYLE 工艺全跟、不稀释**；**仅**禁旁白/人声 + 多世界镜头/展示；**绝不**把 Lemo 冒充「自蒸」

## 4 · 和 Lemo 的边界

| 自蒸（styles-own + bases + `_shared-base`） | Lemo（外部菜单） |
|---|---|
| 默认优先；`catalog.json` status=done | 题材更贴时可锁，**不是**自蒸 |
| 完整四库代码可加载进全片 | **长相与工艺全跟** STYLE.md（色/材/光/字/人/道具/运动/原生动作）；不要稀释成「只抄色值」 |
| 原图在包 `refs/` | styleframe 作钩；**不抄** demo 剧情/镜头表 |
| 示范可有配乐床 | **仅覆盖两处：** 成片禁旁白/人声；镜头与展示 = 我们多世界手法（≥20 · 剧情换场 · 字幕） |

## 5 · 残余 stub / 待补

| id | 缺什么 |
|---|---|
| `V-dianzi-surprisal` | 本机 densest 静帧 |
| 册 preset H/V/S/P/E/R.js | 仍是 stub；数字合同已在 shared-base + 各 LOOK-CARD |
| yingxian 全塔测绘 | 有意 out-of-scope（DISTILL-GAP） |

## 6 · 自有 Lemo 形模版（styles-own · 2026-11-03 收齐）

**权威目录：** `styles-own/catalog.json`（`status=done` 可锁；`parked` 禁止新片）。  
证据：`templates-full/INDEX.md`。白话指针：`docs/OWN-HOW.md`。示范→全片桥：`docs/OWN-DEMO-TO-FULL.md`。

`styles-own/<id>/` = Lemo 形完整包：STYLE.md（11 节 + **§12 人物观感** + **§13 道具生成语法** + §14 BAN）、style.json、CHANGES.md、DEMO.md、`demo/{look,people,props,motion}.js` + main.js + music.py + build.sh、`stills/styleframe.jpg`、`stills/styleframe-vs-source.jpg`（对源定帧；个别包原名 `styleframe-vs-5918.jpg` / `vs-5155.jpg` 已统一别名）、`refs/` 原图像素锚（**原图留在包内，不贴进 skill 正文**）、`sheets/` 人物表与道具表。

| id | 中文 | 状态 | 路径 | 备注 |
|---|---|---|---|---|
| `own-dark-gold` | 暗金线描 | **done** | `styles-own/own-dark-gold/` | O1 · 心理/认知偏差 |
| `own-void-neon` | 虚空霓虹 | **done** | `styles-own/own-void-neon/` | O2 · 信息/概率 |
| `own-lailong-sil` | 来龙剪影史 | **done** | `styles-own/own-lailong-sil/` | O3 · 历史制度 |
| `own-bite-red` | 比特红皇后 | **parked** | `styles-own/own-bite-red/` | O4 · Adelaide 搁置，禁止新片 |
| `own-emotion-ui` | 情绪UI | **done** | `styles-own/own-emotion-ui/` | O5 · 社交心理 |
| `own-tao-ink` | 道卷水墨 | **done** | `styles-own/own-tao-ink/` | O6 · 国学哲理 |
| `own-egypt-papyrus` | 莎草图 | **done** | `styles-own/own-egypt-papyrus/` | O7 · 古代史/神话 |
| `own-murphy-panel` | 墨菲暖板 | **done** | `styles-own/own-murphy-panel/` | O8 · 直觉 vs 概率 |
| `own-speed-seq` | 节拍序列 | **done** | `styles-own/own-speed-seq/` | O9 · 节奏/曲风 |
| `own-academy-spot` | 暗室聚光 | **done** | `styles-own/own-academy-spot/` | O10 · 学习科学 |

**九套 done 已齐；bite-red 搁置。** 锁 `own-*` 时必须：读 STYLE §12–13；加载该包 `demo/look.js` · `people.js` · `props.js` · `motion.js`（改编进本集 renderer，禁止从零重画人物/道具）；S2 `hook_ref` 必须引用包内真像素（`refs/*` 或 `stills/styleframe-vs-source.jpg`）。

一键示范：`LIB=/workspace/lemo-opuscar sh styles-own/<id>/demo/build.sh`。全片 ≥20 世界不照抄 24s demo 剧情——见 `OWN-DEMO-TO-FULL.md`。

