# zhishi · Vibe知识大赏 画风与出片全套

给其他 AI / 协作者直接用的完整可用包（纯代码出片，不靠 GenerateVideo 垫片）。

目标仓库：https://github.com/liuxigreen/zhishi

---

## 中文 · 其他 AI 怎么开始

1. **先读技能总图** → `skills/vibe-suite/SKILL.md`  
   选题 → 内容 → STRUCTURE（≥20 世界）→ 选风锁样 → 渲染 → READY → 批评回写。
2. **选画风** → `styles-own/catalog.json`  
   默认走自有九套（`own-*`；`own-bite-red` 红皇后按主人意思搁置，包仍保留）。  
   对得上的也可以用 Lemo：见 `lemo/`（原 Lemo-Opuscar）。
3. **锁风后必须加载该包的人物库 + 道具库代码**（`demo/people.js`、`demo/props.js`、`demo/look.js`、`demo/motion.js`），并对照包内 `refs/` 原图像素锚 + `stills/styleframe-vs-source*`，禁止只抄色值自己画。
4. **示范片 → 全片** → `docs/OWN-DEMO-TO-FULL.md` 与 `skills/vibe-knowledge-film/OWN-DEMO-TO-FULL.md`。
5. **共用字体**在仓库根目录 `fonts/`；各包 `demo/fonts`、`sheets/fonts` 已是指向它的符号链接。

### Lemo 用法（除下列覆盖外，其余都按他们）

- **禁旁白 / 人声解说**（可保留节奏 BGM / 音效，不要讲稿旁白）。
- **镜头与展示**改成我们的多世界一镜手法（故事推换场、≥20 世界、字幕可读），不要照搬他们 demo 的镜头床。
- 色、材质、人物、道具、动势、字形：**全跟 Lemo 包**，不要稀释。

### 自有包优先级

人物好看 + 道具衍生语法 > 空壳色板。每套 `STYLE.md` 里有道具语法，供其他 AI 衍生新道具与新演法。

### 目录

| 路径 | 内容 |
|------|------|
| `skills/vibe-*` | 出片技能（suite / topic / densify / ref-lock / knowledge-film / director-evolve / video-breakdown） |
| `docs/` | 规范、选风说明、交付、OWN-HOW、桥接全文 |
| `styles-own/` | 10 个自有 Lemo 形完整包 + `catalog.json` |
| `lookkit/` | 预设与核心 JS（字体见根 `fonts/`） |
| `lemo/` | Lemo-Opuscar 可用样式 + TECHNIQUE / MAINTAINING / styleboard 等 |
| `fonts/` | 全库共用字体 |
| `refs/` | `STYLE-TEMPLATE-LIBRARY.md`、templates-full 索引 |

每套 `styles-own/own-*/` 通常含：`STYLE.md` `style.json` `DEMO.md` `CHANGES.md` `poster.jpg` `test.mp4` `demo/`（js/html/py/sh）`refs/` `stills/`（含人物/道具表）`sheets/`。

---

## English · Start path for other AIs

1. Read **`skills/vibe-suite/SKILL.md`** (stage map).
2. Pick a style from **`styles-own/catalog.json`** (default: own packs). Matching Lemo styles live under **`lemo/`**.
3. After lock: load that pack’s **people + props + look + motion** libs; use **`refs/`** as pixel anchors (not palette-only).
4. Expand 24s demos with **`docs/OWN-DEMO-TO-FULL.md`** into ≥20-world STRUCTURE films.
5. Shared **`fonts/`** at repo root (per-pack `demo/fonts` are symlinks).

### Lemo overrides

- No voice-over / narration beds.
- Replace their demo camera with our multi-world travelling structure.
- Otherwise follow Lemo packages fully (color, materials, cast, props, motion, type).

### License notes

- Lemo tree keeps upstream `lemo/LICENSE` and font OFL files under `fonts/`.
- Own packs are Adelaide’s distillation for Vibe知识大赏; keep attribution in each `DEMO.md` / `CREDITS` when present.


---

## 打包说明 / Pack notes

- 共用字体在根目录 `fonts/`。解压后若 `demo/fonts` 丢失，运行 `bash fix-font-links.sh`。
- `NotoSerifSC-VF.otf` 若以 `.chunk01/.chunk02` 形式出现，在 `fonts/` 下 `cat` 合并。
- 本包**未**执行 `git push`；推到 https://github.com/liuxigreen/zhishi 需另一步。
