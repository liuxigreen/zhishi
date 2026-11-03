# Award Scorecard · Vibe知识大赏（正式口径）

> 对照 2026-10-31 样片复盘 + **旋律虚高 Pass** 后锁定。**只用本表**；旧 /35、裸 checklist、缺字母定义的 /55、无 Pre-score Gate 的「数字过线」一律作废。
>
> 蒸馏权威：`DISTILL-MULTIDIM.md`（八维 + Mode 证据句 + 知识锚 = **九项**）。本表是评分；蒸馏是入场证。

## 一句话

每条 densest 10s（及全片验收）必须打印一行：

`Award Score: L M C N T X H D G K F = ??/55 · pass|near-pass|fail`

**且** 同目录必须有：`DISTILL-GAP.md`（逐维证据）+ `HUMAN-CHECK.md`（自审三问）+ densest 密帧/contact sheet 路径。缺任一 → **不得**标 Pass。

---

## 0 · Pre-score Gate（先过再打分）

下列任一未过 → **禁止声称 Pass**（即使事后算出来 ≥44/55）。最高 near-pass；必须补齐再复评。**G7** 仅当 densest/`STYLE-BASE` 声明了故事车道时强制。

| # | Gate | Pass 线 | 未过后果 |
|---|------|---------|----------|
| G0 | **九项蒸馏挂接** | densest 旁已贴：字阶表（D2）+ 3s 动势清单（D4）；Mode 听轨一句+密帧一句（1b）；知识锚出处/示意/易杠（1c） | 缺项 → 整片最高 near-pass；C/G/T/K 上限见 §2 |
| G1 | **crop-bottom mute** | 裁底 ~12–15% 静音看 densest 10s，机制仍可猜（`INFRAME-SHOW.md`） | fail → **G≤2、T≤3**，最高 near-pass |
| G2 | **字阶可见** | densest 静帧能指认 ≥4 级角色（kicker/hero/callout/foot），非同级糊墙 | 不可见 → **T≤3**，C/G 不得 ≥4 |
| G3 | **动势无 card-swap** | 3s 清单里无「整页换皮/同级卡片换词」；须 persist+morph / path-walk / 状态变 | 有 card-swap → **C/G≤2**，不得 Pass |
| G4 | **机制状态自证** | ≥1 个道具 **仅凭状态变化** 能让人猜到理论名（染色/位移钉死/路径走读…） | 无 → **G≤2**，不得 Pass |
| G5 | **观众划走测** | 打分者自己静音连看 densest：会不会划走？ | 会划 → 写入 HUMAN-CHECK fail → 最高 near-pass |
| G6 | **Vanity 物证** | 附 densest contact sheet **或** ≥6 张 densest 静帧路径；禁止纯散文打分 | 无物证 → 整片 **Fail**（见 §3 Vanity Pass ban） |
| G7 | **故事车道戏感** | 若 `narrative_mode` ∈ {`story_scene`,`hybrid`}：densest 旁须有 **冲突→翻盘表** + 同一角色可认回；**禁止**故事选题用纯卡墙/清单墙/只飘数字无人 | 缺表或卡墙 → **最高 near-pass**；纯卡墙硬失败 → 不得 Pass（见 §3） |

打分前在 `DISTILL-GAP.md` 顶栏写：

```
Pre-score Gate: G0..G7 = pass|fail （各一句）
crop-bottom mute: pass|fail
Mode: <听轨一句> / <密帧一句>
知识锚易杠: <已填|空→K cap>
```

---

## 1 · 11 维 · 各 1–5 · 满分 55

| 码 | 中文 | 看什么 | 蒸馏挂接 | 1 | 3 | 5 |
|----|------|--------|----------|---|---|---|
| **L** | 光影 | 主光/辅光/轮廓是否有层次，是否「电影感」而非平涂 | D3 色板层次在帧上 | 平光/无方向 | 有冷暖或明暗分区 | 主光+轮廓+空气感，静帧可当海报 |
| **M** | 材质 | 表面是否可摸（纸/木/金属/玻璃），禁塑料糊片 | D3/D6 材质分工 | 矢量平色块 | 有噪点/微高光 | 触觉可读、材质分工清楚 |
| **C** | 镜头 | 推拉/景深/构图是否服务论证 | D4 动势 + D5 图内 | 死机位贴图 | 有缓动推近或切换 | 镜头语言帮你懂机制 |
| **N** | 道具新意 | 本集独有隐喻/gadget（相对底座 KEEP） | D6 新道具 | 皮肤换色 | 1 个新道具 | ≥2 个新寓言道具且不撞 BANNED |
| **T** | 静音字 | 关声能否读完论证；**主读点在图内**，底栏仅可选补刀 | D2 字阶 + D5 | 字小/糊底；**或只靠底栏白条讲完** | 可读但挤；底栏仍偏长 | 钩子/金句/数字在图内 callout 一眼懂；底栏≤1短句或不出现 |
| **X** | 文案吸睛 | 问句/反差数字/可截金句 | D7 钩/金句摘录 | 说明文 | 有钩无刺 | 想转述、想截图 |
| **H** | 开场 3s 钩子 | 0–3s 是否立住冲突 | D7 钩 ≤3–4s | 慢热 | 有问句或异象 | 3s 内完成「为什么看下去」 |
| **D** | 与参考距离 | 陌生人会不会喊出参考片名/作者 | D8 BANNED twin | 明显孪生 | 语法像但道具不同 | 同语法全新寓言；BANNED 全绿 |
| **G** | 机制手势 | 画面是否把理论「做出来」 | D1 论证 + D4/D5/D6 | 只贴标签；**或裁掉底栏就懵** | 有示意 | 无底栏、少字也能猜到机制名（**状态会说话**） |
| **K** | 知识锚 | 出处+关键数字在画面；禁编造 % | **1c 知识锚** | 无出处 / 易杠空 | 有作者年 | 作者年+关键数+示意边界+易杠已处理 |
| **F** | 静帧投稿感 | 任意抽 3 帧能否当封面/投稿 | D2/D3 成帧 | 车间感 | 尚可 | 像成片海报 |


### 1.0b D · moyou-story-percolation twin 例（命中 → D≤2 Fail）

底座 `bases/moyou-story-percolation/` BANNED：任意 **422/838**（或同 staging 分母墙）、**「渗到底了」+113→334**、**松手傍晚 CTA**、**1957 防毒面具脸钩**、**mini-TV 竖卡+cream+金路径 gestalt** 可被陌生人喊出墨有意思渗流片 → **D≤2 且整片 Fail**。KEEP 语法（同 stick、persist 格子 morph、计数当戏、长持+临界 snap）允许；须换生活钩 / 拓扑 / 读数 / 收束。

### 1.1 证据引用硬规则（反虚高）

**C / G / T / N / X / D** 任一维要打 **≥4**：

1. 必须在 `DISTILL-GAP.md` 写明：**densest 帧路径**（或 contact sheet 时间码）+  
2. **动了什么 / 用了哪级字阶角色 / 哪个道具状态**（对应该维）；  
3. 并标注验证了哪项蒸馏（D1–D8 / Mode / 知识锚）。

否则该维 **封顶 3**（散文描述、回忆底座、只抄 STYLE-BASE 口号 = 不算证据）。

**L / M / F ≥4** 仍要求能指静帧（光向/材质微高光/可投稿构图）；无帧则 ≤3。

**K ≥4** 要求画面可见出处锚 **且** `DISTILL-GAP` / 底座已填易杠点；易杠空 → **K≤3**。

---

## 2 · 判定

| 结果 | 条件 |
|------|------|
| **Pass** | Pre-score Gate **G0–G7 全 pass**；总分 **≥44**；**N≥4、X≥4、D≥4**；**L≥4、M≥4、F≥4**；无 BANNED 命中；**HUMAN-CHECK 三问无 No**；无硬失败项 |
| **Near-pass** | 总分 **33–43**；**或** 总分≥44 但 L/M/F 任一 ≤3；**或** H/G/K 任一 ≤2 但 N/X/D 仍 ≥4；**或** Gate / HUMAN-CHECK / Vanity 规则把 Pass 打落 |
| **Fail** | 总分 **<33**；**或** N/X/D **任一 ≤2**；**或** 命中底座 BANNED twin；**或** Vanity Pass ban（无物证灌分） |

### 2.1 L/M 软顶（防「丑片灌分过 44」）

若 **L≤3 或 M≤3**：

- **N / X / H / G / K** 默认 **封顶 4**（不可为凑 ≥44 而打到 5）；  
- 唯一例外：densest 帧上 **逐条写出** 该维的可见证据（金句截图位、状态自证道具、易杠脚注上屏等）——有帧证才允许 5。  
- 意图：美观未过时，禁止用文案/知识维虚高把总分抬过线。

### 2.2 Vanity Pass ban（2026-10-31 · 旋律）

同时满足下列 → **强制 Fail**（不是 near-pass）：

1. 报表总分 ≥44，且  
2. **C 或 G 或 T** 的 ≥4 分仅来自散文/底座复述、**未**附 densest 帧路径 + 动势/字阶引用，或  
3. 未附 contact sheet / densest 静帧物证。

口诀：**无密帧、不 Pass。**

### 2.3 自动流水线

1. Pre-score Gate G0–G7 → 未过则停，补蒸馏/密帧  
2. densest 10s → 打分（§1.1 证据）→ `DISTILL-GAP.md`  
3. 打印 Award 一行后 **必须** 写 `HUMAN-CHECK.md`（§4）  
4. Near-pass / Fail：先按最低分维迭代（优先 L/M/F，再 C/G/T）→ 复评  
5. 达到 Pass，**或** near-pass 已迭代一轮仍卡美观：拉全片 + `D:\Vibe知识大赏-试做\<中文夹>\` 三件套  
6. 全片再打一行 Score（可略严）+ 更新 HUMAN-CHECK（全片划走测）

---

## 3 · 硬失败项（命中 → 该维 ≤2，整片不得 Pass）

| 码 | 硬失败 |
|----|--------|
| **T** | 叙事字/底字/主标题 **频闪、闪边、颗粒压字、按拍 blink**；稳态段底字亮度 std 明显抖动；换句硬切叠字 |
| **C / G** | **翻页感**；每句换全新版面；音乐片未「沿波形/音符路径走读」；**PPT 清单墙**（纯竖排编号、无错位/无逐层动势）；**故事选题（story_scene/hybrid）用纯卡墙/清单墙/只飘数字无人**（STORY-SCENE 反模版 · 与 G7 联动） |
| **C / H** | 单句英雄字 dwell **≈20s**（加时长≠放慢） |
| **F** | 静帧抽检半透明叠字、双标题残影、粒噪吃掉笔画 |
| **G / T** | 故事 **只靠底栏** 可读；裁底栏 mute fail（INFRAME）；**图内字 + 底白同义复读**（六层反馈：人看不过来） |
| **D** | 陌生人指静帧能喊出原作名/作者（BANNED twin） |
| **K** | 编造 % / 把示意写成定论且无边界 |

### 补救（重做默认）

1. 底字/主标题 reveal 后 **α≥0.95 锁死**；换句交叉淡入 ≥0.5s。  
2. 胶片颗粒 **不得叠文字安全带**。  
3. 暗金音乐族：WaveformBed / 谱线 / DROP **persist + morph**；播放头走读——禁整页跳场。  
4. densest 一眼：**静音 10s 字稳不闪、主图连续不翻页、裁底栏仍懂。**

### 渲染 / 时长

- 截帧带 `?norun`（禁 RAF 与截帧同开）。  
- 全片时长 **随论证拍数**（Douyin silent 故事常约 45s–3min）；**禁为凑 5/6/8/15 分钟灌水**（沉没成本 7:00 反例）。densest 仍 ~10s。  
- 钩 ≤3–4s；叙事拍 ≤4–6s；机制段 6–10s 须持续状态变。

权威细则：`INFRAME-SHOW.md` · `DISTILL-MULTIDIM.md` · `PROGRESS-LADDER.md`。

---

## 4 · Self-review · HUMAN-CHECK.md（强制）

打印 Award 数字行 **之后**，打分者必须再看 densest（若已出全片则再看全片），写三行（可中英）：

```
1. 我会划走吗？     Yes划走 / No留下
2. 静音能懂机制吗？ Yes / No   （可与 crop-bottom 合并结论）
3. 有一个新道具吗？ Yes / No   （相对底座 KEEP 的 novel prop）
```

### 4.1 可选 · 故事戏感三问（`narrative_mode` ∈ story_scene / hybrid 时 **必填**）

来自 `docs/STORY-SCENE-CRAFT.md`：

```
S1. 谁跟谁较劲？           说得出角色关系 / No
S2. 10s 内局势变了吗？     有可见状态翻盘 / No
S3. 换文案同一道具还能演吗？ 能=故事底座 / No=换皮PPT
```

规则：

- 通用三问任一题答 **划走 / No** → 整片 **最高 near-pass**（即使数字行本可 Pass）。  
- 故事片：**戏感三问任一 No** → 整片 **最高 near-pass**（与 G7 联动）。  
- 文件路径：`episodes/<slug>/qa/HUMAN-CHECK.md`（densest 阶段）或同集 `DISTILL-GAP.md` 末节。  
- 禁止事后改数字来「圆」HUMAN-CHECK；应改片或降级判定。

---

## 5 · 打分纪律（摘要）

1. 每维半句证据 + 帧路径（§1.1）；禁只写数字。  
2. **D** 对照底座 `BANNED` 逐条勾；勾不上最高 3。  
3. **K** 数字须能在 `facts.md` / 知识锚表找到；编造 = K≤1 且 Fail。  
4. 2D canvas 默认 L/M 常 3–4；冲 Pass 需光影层/材质/景深或 3D 混合。  
5. `tools/rubric.py`（/100 流量）**不替代**本表；双绿才算选题+成片都过。  
6. `tools/award_score_check.py` 只校验数字门槛；**Pass 仍以本表 Gate + HUMAN-CHECK 为准**（脚本过 ≠ 可宣称获奖级）。

---

## 6 · 与旧口径 / 复盘

| 旧 | 处理 |
|----|------|
| /35、/45、裸 checklist | **作废**；必须 11 维一行 |
| 总分≥44 却 near-pass | **合法**：L/M/F≤3、Gate 未过、HUMAN-CHECK No |
| 旋律「获奖级」虚高 | → Pre-score Gate + 证据封顶 + Vanity ban + HUMAN-CHECK |

| 片 | 暴露 | 本表改动 |
|----|------|----------|
| 电梯 / 越学越快 / 第一印象 | 维不全、美观未过 | /55 + L/M/F≥4 |
| 规划六层 / 旋律 | 频闪、翻页、清单墙、~20s dwell、色板≠蒸馏 | 硬失败 + INFRAME + **九项 Gate** + Vanity ban |

---

## 7 · 工具

| 工具 | 职责 |
|------|------|
| `tools/award_score_check.py` | 数字行 → pass/near-pass/fail；支持 `--gate-fail` / `--human-fail` / `--no-evidence-cap` 强制降级 |
| `tools/rubric.py` | 流量 /100；**非** Award |
| 本 Markdown | **唯一**获奖级口径 |
