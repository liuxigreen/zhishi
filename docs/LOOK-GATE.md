# LOOK-GATE · 观感门与批评入口（S3 探针 · S4 交付 · S5 批评）
执行：`vibe-knowledge-film`（探针预检）· `vibe-director-evolve`（交付门/批评）。

## 1 · 时间点
1. **探针预检**：整条之前，3 张探针帧（钩/中/尾）vs `qa/ref/`。  
2. **交付门**：交 Adelaide 前，钩帧/中段帧 vs `qa/ref/`。  
同格式 `side_by_side.jpg`；参考与本片**同册**、只比内容区。

## 2 · 数字硬项（相对 `qa/ref/targets.json`；初值可校准）
| 指标 | 通过 |
|---|---|
| mid_fill | 不低于参考档（ref full/half → 本片不得 sparse）；V 例外见 §4 |
| mass_diag_frac | ≥ 参考 × 0.8 |
| grain_lap_sigma | ≥ 参考 × 0.6 |
| layers_est | ≥ 3 且 ≥ 参考 − 1 |
| light_dir_consistency | ≥ 0.6 |
| emissive_ui_frac | ≤ 0.3 |
| 单色背景占比 | ≤ 40% |

## 3 · 观感硬门（全部 Y）
1. 静音 + 裁掉底部字幕区看 10s，不想划走。  
2. 钩帧单独截出能当封面。  
3. 中段主体 ≥ 半屏。  
4. 没有靠「换题/换说法」救场。  
5. 看完能说出一个记得的具体画面。

## 4 · V 册虚空
近黑/虚空仅当 REF-LOCK 选 V 册参考，且 targets 含 hero 体量 + grain + 层数时合法；mid_fill 可 sparse，但 mass_diag / grain / layers 照常判。

## 5 · 否决词
评语、residual、REF-LOCK、屏上自述出现：**示意 · 色块 · 图解 · 玩偶 · 说明书 · 仪表壳 · UI 壳 · 火柴人** → 最高 Hold，不能 Pass。  
屏上简化用「简化模型」/「据××」。

## 6 · 谁能 Pass
- 渲染者只能写 **READY**。  
- Pass 必须附 `qa/gate/side_by_side.jpg` + 一句「为何不划走」并指名一个画面。  
- **自审 Pass 无效。** 生成视频床、纸偶壳 = Fail（不论观感）。

## 7 · 批评入口
Fail / Hold / 用户批评 → 先写 `CRITIQUE-n.md`（模板见 vibe-director-evolve），未写不准开下一版。  
归层：选题 · 内容 · 参考锁 · look-kit · 运动/节拍。只改那一层。  
同层连续 2 次 Fail 或多集同病 → 改 look-kit 共享模块。  
**禁止补丁：** 放大 bbox、加角标/HUD、加顶栏字、换配色而不换参考。

## 8 · 证据（archive，按需打开）
- `archive/reflect/REFLECT-WHY-LOOK-FAILS-2026-11-02.md` §C–E  
- `archive/reflect/REFLECT-VS-HOT20-2026-11-02.md`  
- 静帧例：`refs/lailong-beacon/breakdown-v2/stills/by_t/t036.jpg` · `refs/douyin-top30/breakdown-v2/7699762655526915364/stills/by_t/t006.jpg`  
- 反例：`episodes/gorilla-pass/qa/hook_vs_hot_v4.jpg` · apology `qa/contact_densest_v2.jpg`
