# STYLE-TEMPLATE-LIBRARY · 画风模板总库

> **不一定抄，但有锚。** 导演在写 STRUCTURE 之前，必须从本表选 1 个主模板（可再借 1 个动作）。
> 用法白话见 `docs/STYLE-LIBRARY-HOW.md`。静帧/LOOK-CARD 索引见 `refs/REF-LIBRARY.md`。
> 库存盘点见 `docs/STYLE-BASE-INVENTORY.md`。Lemo 全 68 条见 `refs/lemo-demos/INDEX.md`。

更新：2026-11-03e · **styles-own 九套 done + bite-red parked**（见 §7 / `styles-own/catalog.json`）· 选风默认先 own；Lemo 为外部菜单（成片禁旁白）· 桥 `docs/OWN-DEMO-TO-FULL.md` · 交付 `docs/DELIVER.md`

## 0 · 怎么读一行

| 字段 | 意思 |
|---|---|
| id | 稳定短名，写进 REF-LOCK |
| 册 | H 历史战阵 / V 虚空信息 / S 物态 / P 印刷长镜 / E 人际微剧场 / R 其它·节奏装置 |
| 3 视觉事实 | 静音 2 秒能指出来的三条（不是「氛围高级」） |
| still | 钩静帧路径；TBD = 还没抽 |
| 何时用 | 选题匹配 |
| BAN | 最容易跑偏成什么样 |
| 来源 | bases/ · lemo · 生产 fork · REF LOOK-CARD |

---

## 1 · 主目录（导演先看这里 · 32 条）

| id | 册 | 中文名 | still | 成熟 | 何时用 |
|---|---|---|---|---|---|
| `H-beacon` | H | 唐朝烽火浮雕 | `refs/lailong-beacon/frames/f_055.jpg` | LOOK-CARD | 历史路径/地形叙事 |
| `H-war-signals` | H | 打仗信号 | top30 stills | LOOK-CARD | 信号/烽火/战报 |
| `H-xuanzang` | H | 玄奘通关文牒 | xuan-zang stills | LOOK-CARD | 旅程/关卡/文牒 |
| `H-zhaoyun` | H | 赵云出师表 | zhaoyun stills | LOOK-CARD | 人物史诗/战阵 |
| `H-lailong-person` | H | 来龙历史人 | `bases/lailong-history-person/keyframes/f_015.jpg` | LOOK-CARD | 历史人+满幅地形 |
| `V-info-theory` | V | 信息论虚空 | top30 | LOOK-CARD | 信息/熵/惊讶 |
| `V-dna` | V | 无创 DNA | top30 | LOOK-CARD | 检测/生物信息 |
| `V-moyou-darkgold` | V | 墨右暗金知识 | `bases/moyou-darkgold-music/refs/motion-stills/t015_0.jpg` | LOOK-CARD | 炭黑金线知识默片 |
| `V-circuit-pcb` | V | 电路板光路径 | `refs/lemo-demos/frames/circuit-board/styleframe.jpg` | LOOK-CARD | 数据流/供应链/agent 路径 |
| `V-dianzi-surprisal` | V | 点子信息惊讶 | TBD（语法卡已写） | **stub 静帧** | 惊讶度/信息量 |
| `V-bite-redqueen` | V/E | 红皇后黑底红字 | `refs/bite-xinyu-redqueen/01-t0004.png` | LOOK-CARD | 相对适应/军备竞赛 |
| `S-buffon` | S | Buffon 运气物态 | top30 | LOOK-CARD | 概率/物理演示 |
| `S-andy-build` | S | 安迪盖楼一镜 | `bases/andy-3d-building/keyframes/g1.jpg` | LOOK-CARD | 建造/生长/工期计数 |
| `S-iso-picturebook` | S | 等距绘本 | `refs/lemo-demos/frames/isometric-picture-book/styleframe.jpg` | LOOK-CARD | 排队规则/步骤秩序 |
| `S-memphis` | S | 孟菲斯微缩城 | `refs/lemo-demos/frames/memphis-diorama/styleframe.jpg` | LOOK-CARD | 四季/场景循环 |
| `S-desktop-fly` | S/R | 桌面穿梭 | `refs/lemo-demos/frames/desktop-flythrough/styleframe.jpg` | LOOK-CARD | App/agent 工作流 |
| `S-lowpoly` | S | 低模等距岛 | `refs/lemo-demos/frames/lowpoly-island/styleframe.jpg` | 探针/Lemo | 世界建造/轻游戏感 |
| `S-yingxian` | S/H | 应县榫卯 | wooden-pagoda/qa | LOOK-CARD | 木构/古建结构 |
| `P-printed-long` | P | 印刷长镜头 | `refs/lemo-demos/frames/printed-long-take/styleframe.jpg` | LOOK-CARD | 迁徙/生态/诗意长叙事 |
| `P-chalkboard` | P | 黑板粉笔 | `refs/lemo-demos/frames/chalkboard/styleframe.jpg` | LOOK-CARD | 纠错课/词源 |
| `P-transit-map` | P | 地铁线路图 | `refs/lemo-demos/frames/transit-map/styleframe.jpg` | LOOK-CARD | 增长时间线/路网 |
| `P-ink-wash-lemo` | P | Lemo 水墨 | `refs/lemo-demos/frames/ink-wash/styleframe.jpg` | LOOK-CARD | 武侠/诗词（非我们多世界水墨） |
| `P-ink-land-prod` | P | **生产水墨横屏** | 道歉/道德许可成片帧 | **全片可用** | 多世界一镜知识片（当前主航道） |
| `E-anxious` | E | 焦虑依恋 | top30 | LOOK-CARD | 亲密关系微剧场 |
| `E-halo` | E | 光环效应 | `bases/sanhao-halo-effect/keyframes/01-hook.jpg` | LOOK-CARD | 第一印象/刻板 |
| `E-nexo-crowd` | E | 人群手机 | `bases/nexo-crowd-phone/keyframes/01-f0001.jpg` | LOOK-CARD | 从众/社会证明 |
| `E-xiaomo-disarm` | E | 小墨卸防话术 | `bases/xiaomo-darkgold-disarm/fx/strip-densest-3fps.jpg` | LOOK-CARD | 社交说服六层 |
| `E-zhongshan-learn` | E/V | 中山学得快 | `bases/zhongshan-learn-fast/keyframes/01-hook.jpg` | LOOK-CARD | 学习/马太效应 |
| `R-noir-land-prod` | R/E | **生产暗黑钠灯** | `episodes/eyewitness-wrong-face/build/noir-land-v1/f00620.jpg` | **全片可用** | 误认/审讯/记忆重建 |
| `R-countdown` | R | 倒计时分屏 | gate_refs/countdown | LOOK-CARD | 计划谬误/发射倒计时 |
| `R-game-show` | R | 综艺扁平 | lemo game-show | LOOK-CARD | 时间线盘点 |
| `R-papercut` | R/P | 红窗花剪纸 | lemo papercut-red | 探针 | 节庆民俗 |

---

## 2 · 模板卡片（主目录逐条）

### H-beacon · 唐朝烽火
- **3 事实：** ①满幅浮雕地形/建筑带 ②形体受光非自发光 UI ③路径与塔同框有遮挡雾
- **still：** `refs/lailong-beacon/frames/f_055.jpg`
- **何时用：** 历史地理、烽火传信、长路径
- **BAN：** 中区大空+细线路径条；用 dense 切冒充旅程
- **来源：** REF LOOK-CARD · bases/lailong-* 家族 · preset `H`

### H-war-signals / H-xuanzang / H-zhaoyun
- 见已有 LOOK-CARD（REF-LIBRARY 前 4 条）。同册禁跨到心理题当钩。

### H-lailong-person · 来龙历史人
- **3 事实：** ①人物嵌在满幅地形/城郭 ②建筑带占半屏以上 ③字钉在器物/文书上
- **still：** `bases/lailong-history-person/keyframes/f_015.jpg`
- **何时用：** 历史人物知识片（非纯抽象概念）
- **BAN：** 灰底色块人；无地形的口播头像感
- **来源：** `bases/lailong-history-person`

### V-info-theory / V-dna
- 见 REF LOOK-CARD。虚空底合法前提：hero 体量+grain+层数写进 targets。

### V-moyou-darkgold · 墨右暗金
- **3 事实：** ①近黑炭底 ②金/琥珀单点高光当信息 ③知识物件有体积阴影
- **still：** `bases/moyou-darkgold-music/refs/motion-stills/t015_0.jpg`
- **何时用：** 脑科学/音乐/抽象机制默片（旧默认生产）
- **BAN：** 只有字条发光、无物件；平涂灰底冒充暗金
- **来源：** `bases/moyou-darkgold-music` · LOOK-CARD 新补

### V-circuit-pcb · 电路板
- **3 事实：** ①永远正俯视 PCB ②信息=铜上的光 ③丝印钉在板上
- **still：** `refs/lemo-demos/frames/circuit-board/styleframe.jpg`
- **何时用：** 数据流、能源、agent 工具链路径
- **BAN：** 透视 3D 电路城；玻璃 HUD 浮层；整句上板
- **来源：** `bases/circuit-board-pcb` + Lemo

### V-dianzi-surprisal / V-bite-redqueen
- **V-bite-redqueen：** LOOK-CARD 已补（`refs/look-cards/bite-redqueen/`）· 静帧在 `refs/bite-xinyu-redqueen/`。
- **V-dianzi-surprisal：** 语法齐；LOOK-CARD 已写但 **本机静帧 TBD**（唯一真残余 stub）。

### S-buffon
- 见 REF LOOK-CARD。

### S-andy-build · 安迪盖楼
- **3 事实：** ①一镜无硬切的建造生长 ②天数/材料计数器在画内 ③CAD 线框可变成地上放线
- **still：** `bases/andy-3d-building/keyframes/g1.jpg`
- **何时用：** 工程生长、工期、从草图到实物
- **BAN：** 每段硬切换场景冒充一镜；大移轴糊成玩具（轻度 DOF 即可）
- **来源：** `bases/andy-3d-building` · LOOK-CARD 新补

### S-iso-picturebook · 等距绘本
- **3 事实：** ①等距角锁定只平移推拉 ②人物图解无脸 ③屋顶可掀盖露内部
- **still：** `refs/lemo-demos/frames/isometric-picture-book/styleframe.jpg`
- **何时用：** 排队、流程对比、空间容量规则
- **BAN：** 透视人剧情对白；地面无字的空场景
- **来源：** bases + Lemo · LOOK-CARD 新补

### S-memphis / S-desktop-fly / S-lowpoly
- LOOK-CARD：memphis · desktop-flythrough 已补；Lowpoly 仍借 Lemo 探针帧。Memphis=四季；Desktop=工作流。

### S-yingxian
- LOOK-CARD 已补（`refs/look-cards/yingxian/`）· 静帧用 `episodes/wooden-pagoda/qa/`；全塔测绘仍见 DISTILL-GAP。

### P-printed-long · 印刷长镜头
- **3 事实：** ①墨+纸刮版灰阶 ②一点红留给主体 ③每帧≥三层景深一镜穿
- **still：** `refs/lemo-demos/frames/printed-long-take/styleframe.jpg`
- **何时用：** 迁徙、生态、风景诗长叙事
- **BAN：** UI 卡片流；多色印刷；硬切拼旅程
- **来源：** bases/printed-long-take + Lemo · LOOK-CARD 新补

### P-chalkboard · 黑板
- **3 事实：** ①永远正对墨绿板 ②真笔顺写→擦→同位置改 ③一种强调色（橙）
- **still：** `refs/lemo-demos/frames/chalkboard/styleframe.jpg`
- **何时用：** 词源、纠错短课、一题一板
- **BAN：** 淡入字；第二强调色；3D 转板
- **来源：** bases/chalkboard + Lemo · LOOK-CARD 新补

### P-transit-map
- **3 事实：** ①暖纸底 ②八方向折线笔尖生长 ③换乘仓有落地重量
- **still：** lemo frames/transit-map
- **何时用：** 路网、产品路线图、双线对比
- **BAN：** 随意曲线地铁；无笔尖的「直接出现整图」

### P-ink-wash-lemo vs P-ink-land-prod
- **Lemo 水墨：** 武侠河山单线叙事 demo，作气质锚。
- **生产水墨横屏：** 已跑通 ≥20 世界剧情换场（道歉/道德许可）。**新多世界知识片默认锚这个**，不是从 Lemo 重抄。
- **BAN（生产）：** 色块纸偶壳；无因果的换场；字幕对比不足 4.5:1

### E-anxious / E-halo / E-nexo-crowd / E-xiaomo-disarm / E-zhongshan-learn
- 人际/心理册。Halo=第一印象；Nexo=从众手机墙；Xiaomo=话术卸防；Zhongshan=学习曲线。各有 still 或 LOOK-CARD。

### R-noir-land-prod · 生产暗黑
- **3 事实：** ①深蓝黑底 ②钠灯琥珀单光源 ③指认/审讯道具同框因果
- **still：** `episodes/eyewitness-wrong-face/build/noir-land-v1/f00620.jpg`
- **何时用：** 误认、记忆、罪案重建、冷叙事
- **BAN：** 全面自发光 UI；水墨纸纹混进钠灯；无光源的灰雾
- **来源：** 目击者成片 · LOOK-CARD 新补 · preset `noir-land`

### R-countdown / R-game-show / R-papercut
- 节奏/节庆装置；见上表。

---

## 3 · bases/ → 本库映射（25 全挂）

| bases folder | → template id | 状态 |
|---|---|---|
| andy-3d-building | `S-andy-build` | 已卡 |
| andy-3d-construction-sim | `S-andy-build`（旧分叉） | 合并指向 |
| bite-red-queen | `V-bite-redqueen` | 已卡 |
| chalkboard | `P-chalkboard` | 已卡 |
| circuit-board | `V-circuit-pcb`（弃用旧） | 合并 |
| circuit-board-pcb | `V-circuit-pcb` | 已卡 |
| countdown-split | `R-countdown` | 已卡 |
| desktop-flythrough | `S-desktop-fly` | 已卡 |
| dianzi-info-surprisal | `V-dianzi-surprisal` | stub 静帧 |
| game-show | `R-game-show` | 已卡 |
| isometric-picture-book | `S-iso-picturebook` | 已卡 |
| lailong-history-person | `H-lailong-person` | 已卡 |
| lailong-xuanzang-passport | `H-xuanzang` | 已卡 |
| lailong-zhaoyun-infant | `H-zhaoyun` | 已卡 |
| memphis-diorama | `S-memphis` | 已卡 |
| moyou-darkgold-music | `V-moyou-darkgold` | 已卡 |
| moyou-story-percolation | `V-moyou-percolation` | 已卡 |
| nexo-crowd-phone | `E-nexo-crowd` | 已卡 |
| printed-long-take | `P-printed-long` | 已卡 |
| sanhao-halo-effect | `E-halo` | 已卡 |
| transit-map | `P-transit-map` | 已卡 |
| xiaomo-darkgold-disarm | `E-xiaomo-disarm` | 已卡 |
| yingxian-tenon | `S-yingxian` | 已卡 |
| zhanwai-darkgold-huashu | `E-xiaomo-disarm`（近亲） | stub |
| zhongshan-learn-fast | `E-zhongshan-learn` | 已卡 |

---

## 3b · 自蒸统一底座（shared-base）

全文：`docs/OWN-TEMPLATE-BASE.md`  
路径：`lookkit/presets/_shared-base/`

- **公式：** 自有模板 = `_shared-base` + overrides（palette / light / material / camera / BAN）  
- **合同：** 多世界导演手法 + VISUAL-7 默认 + 字幕对比 + 全局 BAN（禁灰底色块）  
- **生产：** ink / noir = shared-base + 生产覆盖  
- **用法白话：** `docs/STYLE-LIBRARY-HOW.md`「自蒸底座怎么用」

## 4 · Lemo 选风（菜单制 · 不强制全卡）

**用法全文（白话）：** `docs/LEMO-HOW-选风用法.md`  
**菜单：** `refs/lemo-demos/INDEX.md`（样片+何时用）· 画廊 https://lemomo-ai.github.io/lemo-opuscar/  
**工艺：** `/workspace/lemo-opuscar/styles/<slug>/STYLE.md` · 帧 `refs/lemo-demos/frames/<slug>/styleframe.jpg`

### 原则
- **默认先** `styles-own/catalog.json`（done）；Lemo 是**外部次选**——只有比任何 own 包更贴题时才锁。  
- 锁 Lemo 后：**色/材/光/字/人/道具/运动语法/原生动作全跟**，不要稀释。我们只改两处——多世界 STRUCTURE/镜头展示，以及禁旁白。  
- **不抄** demo 剧情 / 镜头表 / 旁白口播。成片 = **字幕 only**（可无旁白配乐）。不跑 Lemo 插件。  
- **禁止**把 Lemo 拷贝标成「自蒸」。  
- **不必**先给 66 条都做 LOOK-CARD；需要时当场从 STYLE.md 抽 3 事实即可。

### 举例（册 ↔ slug）
| 册 | slug | 何时用 |
|---|---|---|
| S/R | `desktop-flythrough` | Agent / App / 工作流 |
| S | `isometric-picture-book` | 排队规则 / 步骤秩序 |
| V | `circuit-board` | 数据流 / 工具链 |
| P | `chalkboard` | 纠错课 / 词源 |
| P | `printed-long-take` | 迁徙 / 诗意长叙事 |

与 §1 重叠的 id 仍用主目录名（如 `P-chalkboard`），勿重复造号。

### 维护
- 上游增风格 → 更新 clone + `lemo-demos/INDEX.md` 即可。  
- 改风格 = 选 base + CHANGES（`MY-STYLES.md` 思路），禁止无锚从零漂。

## 5 · lookkit preset 骨架

| preset 路径 | 对齐 template |
|---|---|
| `lookkit/presets/_shared-base/` | **所有自蒸的父合同** |
| `lookkit/presets/H/PRESET.md` | H-* |
| `lookkit/presets/V/PRESET.md` | V-* |
| `lookkit/presets/S/PRESET.md` | S-* |
| `lookkit/presets/P/PRESET.md` | P-* |
| `lookkit/presets/E/PRESET.md` | E-* |
| `lookkit/presets/R/PRESET.md` | R-* |
| `lookkit/presets/ink-land/PRESET.md` | `P-ink-land-prod` |
| `lookkit/presets/noir-land/PRESET.md` | `R-noir-land-prod` |
| `lookkit/presets/printed-long-take/PRESET.md` | `P-printed-long` |
| `lookkit/presets/chalkboard/PRESET.md` | `P-chalkboard` |
| `lookkit/presets/isometric-picture-book/PRESET.md` | `S-iso-picturebook` |
| `lookkit/presets/circuit-board/PRESET.md` | `V-circuit-pcb` |
| `lookkit/presets/memphis-diorama/PRESET.md` | `S-memphis` |
| `lookkit/presets/desktop-flythrough/PRESET.md` | `S-desktop-fly` |

真跑引擎仍用现有 `style-ink-land-v3` / `style-noir-land-v1`；上表是锚参数，不是第二套渲染器。

---

## 6 · 维护

- 新拆火片 → 写 LOOK-CARD → 登记 REF-LIBRARY **和** 本表 id  
- 新 Lemo 风格 → 进 `lemo-demos/INDEX.md`；常用则在 HOW 举例表加一行  
- 批评「画风跑偏」→ 查本表是否选错册/错锚，写入 vibe-director-evolve

## 7 · 自有 Lemo 形模版（styles-own · 2026-11-03）

按 Lemo 一套流程（STYLE.md 11 节 + style.json + CHANGES + DEMO + demo 可跑 + styleframe 对源）从 Adelaide 自己的 34 条参考片蒸出来。总表 `styles-own/catalog.json`，证据 `templates-full/INDEX.md`。

| id | 中文名 | 合并来源 | 状态 | 路径 | 何时用 | BAN |
|---|---|---|---|---|---|---|
| `own-dark-gold` | 暗金线描 | halo · moyou-darkgold · ember · xiaomo · moyou-percolation | **完成**（styleframe ≈ halo 5s） | `styles-own/own-dark-gold/` | 心理学/认知偏差/关系：「什么被高估了」 | 贴纸脸、正脸主角、金以外的饱和色、光环多次 |
| `own-void-neon` | 虚空霓虹 | 5155·0345·3785·9472 等 10 条 | **完成**（styleframe ≈ 5155 6.5s） | `styles-own/own-void-neon/` | 信息/概率/顿悟/生物粒子 | 贴纸脸、金箔博物馆语、一场多次顿悟 |
| `own-lailong-sil` | 来龙剪影史 | 烽火/战报/玉玺/鼓/赵云/玄奘 | **完成**（styleframe ≈ 5918 t0） | `styles-own/own-lailong-sil/` | 历史制度/信号/文书 | 贴纸脸、底栏口播条、紫霓虹/金箔串台 |
| `own-bite-red` | 比特红皇后 | redqueen · 0762 | **搁置**（人物达不到原片） | `styles-own/own-bite-red/` | 演化/相对适应/军备竞赛 | 紫虚空、金 DualMark、源片 twin 跑步/猎豹定妆 |
| `own-emotion-ui` | 情绪UI | nexo · 6571 · 6911（1183/2127 只借道具） | **完成**（styleframe ≈ nexo 26.5s） | `styles-own/own-emotion-ui/` | 社交心理/依恋/反刍/信念vs事实 | 胶囊人或象形人画五官、三套人物混用、紫霓虹/金箔串台、UI 不贴人 |
| `own-tao-ink` | 道卷水墨 | 4550 | **完成**（styleframe ≈ 4550 t2.5/t17.5/t70.5/t64.5，竖屏） | `styles-own/own-tao-ink/` | 国学/庄子老子/内卷/人生哲理 | 人物画五官、金箔/霓虹、一帧多处红、推拉镜头、无墨晕硬切 |
| `own-egypt-papyrus` | 莎草图 | 4352 | **完成**（styleframe ≈ 4352 t14/t134，4:3 横屏） | `styles-own/own-egypt-papyrus/` | 古代史/神话/“史上第一次”/劳动与经济史 | 3D 明暗人物、3/4 侧脸、照片纹理、霓虹/金粉、英文上屏、字幕超两行或离开奶油卡、推拉镜头、无纸草卷硬切 |
| `own-murphy-panel` | 墨菲暖板 | 4630 | **完成**（styleframe ≈ 4630 t5/t52，横屏） | `styles-own/own-murphy-panel/` | 直觉vs概率/派对日常纠错/配对谜题 | 照片人、细五官、霓虹赛博HUD、硬切换场、英文上屏、字幕超两行、过曝发光、仿射歪板、竹竿人 |
| `own-speed-seq` | 节拍序列 | 0594-speedrun | **完成**（styleframe ≈ 0594 t18/t91/t146/t237，横屏 O9） | `styles-own/own-speed-seq/` | 速度/拍号/切分/曲风体感 | 给木偶画五官、关节圈不画、竹竿细肢、底部无 sequencer、紫霓虹/金箔串台、播放头乱飞 |
| `own-academy-spot` | 暗室聚光 | zhongshan-learn | **完成**（styleframe ≈ W1 1.5s / W2 9.0s，横屏 O10） | `styles-own/own-academy-spot/` | 学习科学/提问质量/表面vs原理 | 给 peg 画五官四肢、实心蓝图硬切无溶化、冷蓝赛博底、竹竿人、无顶光锥 |

导演用法（所有 `own-*` done 包通用）：先读 STYLE.md **§12 人物** + **§13 道具生成语法** → 加载 `demo/{look,people,props,motion}.js` 进本集 renderer（禁止从零重画）→ S2 `hook_ref` 钉包内 `refs/*` 或 `stills/styleframe-vs-source.jpg`（`vs-5918` / `vs-5155` 等同 vs-source）。原图留在包 `refs/`，不贴进 skill。示范扩全片见 `docs/OWN-DEMO-TO-FULL.md`。旧 bases 行仍可作长相锚，造片优先对应 own 代码库。`own-bite-red` = **parked**，禁止新片。
