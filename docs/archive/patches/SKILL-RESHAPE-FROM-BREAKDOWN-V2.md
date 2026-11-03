# SKILL-RESHAPE-FROM-BREAKDOWN-V2 · 2026-11-02

> Trigger: Adelaide — 旧拆片浅；Jules 装 `vibe-video-breakdown`；本文件供 Jules `UpdateSkill`。  
> Evidence root:  
> - `refs/zhaoyun-infant/breakdown-v2/`（SHOT-TABLE / DIRECTOR-LOGIC / VISUAL-7 / COPY-GRAMMAR / KEEP-BAN / contacts）  
> - `refs/douyin-top30/breakdown-v2/INDEX.md`  
> Method skill: `vibe-video-breakdown`（scene-detect+dual contact+glossary+再叠 VISUAL-7/M1–M7）

---

## 0 · 旧拆为什么浅（anti-pattern → 新硬门）

| 旧病 | 新硬门（写入三 skill） |
|---|---|
| 凭印象写运镜 | 先 `extract_shots` / 复用 `full_events`；15↔85 frame-diff；motion≈0 禁 pan/push |
| 情节摘要当分镜 | 必须 SHOT-TABLE + 打开 still；UNSEEN 不得编 |
| VISUAL-7 全局平均 | 先锁册 H/V/S/P/E/R，再锁 H-map/stage/doc/A |
| 忽略 DualMark/脚注/纸偶比例 | COPY-GRAMMAR 列为 densest 开渲必填 |
| 只用 6 锚帧 | 全时长 hard-cut 表 + soft 态变备注 |

---

## 1 · Patch · `vibe-knowledge-film`（concrete edits）

### 1.1 §0 开渲前锁死 — 追加第 8 项
```
8. 若选题=历史人物/课本对读/命运反讽：必须声明 **H-stage 优先**（证据：赵云 hard9/249s，舞台主床；H-map 仅点缀）。
   densest 首屏禁俯视涨幅 HUD。对照 refs/zhaoyun-infant/breakdown-v2/KEEP-BAN.md
```

### 1.2 §1 七律 — 改第 5 条
旧：「永远有在变的读数」  
新：「永远有在变的 **戏内态**（道具/DualMark/缺席信号）；读数%仅当戏内道具，不得当主床。」

### 1.3 §3 切密度 C 行 — 改写
旧：C soft wipe · 烽火/长安  
新：
```
C · 来龙旅程/人物舞台：hard 稀（烽火≈0.26/min · 赵云≈2.17/min · 长安≈0.28/min）
   主语法 = Static 机位 + soft 态变（gold/red clear）+ 偶发 soft hold
   禁止：无 diff 证据写推拉；禁止用玉玺≈7.9/min / 节奏≈53切 冒充 C
```

### 1.4 新增 §3c · Prop-acting grade（来自赵云实测）
```
开渲前给床打分 A/B/C：
A = 同一语义道具可见 ≥3 态 + 纸偶与道具有接触（匣/卷/抱婴/空框/箭）
B = 有道具但人偶站桩
C = 纯图标/HUD
历史人物 densest：A 才准渲；B/C → Hold
```

### 1.5 新增 §3d · Breakdown gate
```
对标参考片或复盘自家片：先跑 vibe-video-breakdown（或复用 fx/_full_stills + full_events），
产出 SHOT-TABLE 后才许改 STYLE-BOOK / 重渲。禁止「看过剧情就能过导演门」。
```

### 1.6 Canon 链追加
- `refs/zhaoyun-infant/breakdown-v2/`  
- `refs/douyin-top30/breakdown-v2/INDEX.md`  
- `docs/vendor-vre-references/shot_glossary.md`

---

## 2 · Patch · `vibe-director-evolve`

### 2.1 Before densest checklist — 追加
```
- [ ] 若 H 人物戏：H-stage 声明？首屏仍帧是舞台不是地图？
- [ ] Prop-acting grade = A？
- [ ] DualMark 蓝/红分工写进 VISUAL-EVENT？SourceFooter 有？
- [ ] 运镜栏只写测过的词（默认 Static）？
```

### 2.2 审片勾选 — VISUAL-7 下追加 **Stage gate**
```
- [ ] 打开 densest contact：中区是纸偶+灯柱匣，还是绿柱%？
- [ ] 与赵云 t000/t072/t240 对照：有无 DualMark + 脚注 + 开书/竖卷？
- [ ] frame-diff / motion：有没有谎报推镜？
Fail 例补：sushi v6 地图棋盘；v7 空舞台微笑站桩无握锄。
```

### 2.3 EVOLVE-LOG 强制字段
```
breakdown_ref: <path or none>
hard_cuts_per_min: <n>
declared_H_subtype: map|stage|doc|A
prop_acting: A|B|C
```

---

## 3 · Patch · `vibe-topic-pipeline`

### 3.1 题型表「历史人物一天」行 — 改默认分型
旧：H（优先 H-map/H-stage）· C · soft wipe + 满幅地形床  
新：
```
历史人物一天 / 课本对读 / 命运反讽 | **H · 默认 H-stage**（辅 H-doc；H-map 仅机制需要时） | C（Static+态变） | 灯火/柱影/颗粒 + DualMark
制度器物旅程（烽火类） | H · H-map+stage+doc | C | path morph + AbsentSignal
```

### 3.2 「人物的一天」趣味硬门 — 追加第 4 条
```
4. densest 首屏分型自检：截图必须能被判为 H-stage 或 H-doc，不能是 H-map HUD。
```

### 3.3 短名单必填 — 追加
```
14. H 分型预声明（stage/doc/map）
15. Prop-acting 候选道具三态草稿
```

---

## 4 · Patch · `bases/lailong-history-person/STYLE-BASE.md`

### 4.1 §2.5 表前加「分型选择树」
```
人物命运 / 出师表式课本对读 → **先 H-stage**，H-doc 作提问/收束，H-map ≤1–2 板。
器物制度 / 烽火路径 → H-map 可主床。
选错分型 = 观感门 Fail（苏轼 v6）。
证据：refs/zhaoyun-infant/breakdown-v2/VISUAL-7-MEASURED.md
```

### 4.2 §2.5 V7 行补赵云数
```
赵云 hard≈9/249s≈2.17/min · motionμ≈3.09 · mid_fill full 80/83 · bot45≈0.79 · grain≈17
→ C 档允许「略高于烽火 0.26」但仍是稀切；密度来自 soft 态变。
```

### 4.3 §2.3 / 道具语法 — 加 **CourtLampStage** 模板
```
CourtLampStage：侧舞台 + 落地灯火或灯笼 + 红柱框 + 几何纸偶接触道具（匣/卷/扇/托盘）
persist：灯火不灭；柱框跨幕；道具 morph
BAN：空褐地+微笑站桩；无接触的锄/灯贴纸
证据 still：zhaoyun t000 t006 t072 t096
```

### 4.4 §8 densest 10s 步骤 3 — 改
旧：一次 persist morph（LifeThread/AbsentSignal…）  
新：必须是 **CourtLampStage 或 OpenTextbook** 上的 morph；禁地图%第一次出现在 densest。

### 4.5 §7 BANNED — 保持赵云钩栈 verbatim；**KEEP 语法**允许「压军报式」结构但换人物/换物件。

---

## 5 · Patch · `vibe-video-breakdown`（已装，小补）
- 在 Pipeline §1 注明：若 `fx/_full_stills` + `full_events.json` 已存在 → **禁止重抽**，直接 dual contact。  
- Deliverables 增加 `COPY-GRAMMAR.md`（本赵云包已示范）。

---

## 6 · Jules UpdateSkill 顺序建议
1. vibe-video-breakdown（小补复用仍帧）  
2. vibe-knowledge-film（§0/§1/§3/§3c/§3d）  
3. vibe-director-evolve（checklist + Fail 例）  
4. vibe-topic-pipeline（题型表 + 硬门）  
5. STYLE-BASE.md 手改（非 skill，仓内文档）

---

## 7 · 验收
下一支苏轼 densest：开渲包必须含 `declared_H_subtype: stage`、prop A 三态表、DualMark 色词、Static 运镜栏；过 evolve 时对照 `breakdown-v2/contacts/dual_shot_contact.jpg` 赵云 S01/S05。

## Status · skill 补全（2026-11-02）

Jules UpdateSkill 完成：`vibe-knowledge-film` · `vibe-director-evolve` · `vibe-topic-pipeline` · `vibe-video-breakdown`。  
本地同步：`/workspace/deliver/vibe-knowledge-skill-git/skills/*/SKILL.md`。  
STYLE-BASE §1d 已加 Prop-acting A / DualMark / Breakdown gate。  
待全量 `full_shot_table: yes` 后若 KEEP 数字变，再热补 INDEX 锚表。
