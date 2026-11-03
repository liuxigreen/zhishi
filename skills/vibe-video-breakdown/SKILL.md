---
name: vibe-video-breakdown
description: >-
  Use for full measured shot-tables on Douyin/来龙 refs (all clips):
  scene-detect/reuse stills, dual contacts, glossary cards, VISUAL-7+M1–M7, KEEP
  — never eyeball-only.
---
# Vibe video breakdown（2026-11-02 · skill 补全）

Sources: [video-reverse-engineering](https://github.com/whaojie797-design/video-reverse-engineering) · [reelbench video-shots](https://github.com/eternityspring/reelbench-skills) · [OpenChatCut](https://github.com/0xsline/OpenChatCut).

Local vendor: `/workspace/vk-distill/vendor-skills/` · glossary `docs/vendor-vre-references/shot_glossary.md`

## Scope
**Every** reference clip gets a folder with SHOT-TABLE + dual contacts — not only rollup INDEX. 赵云已完成；其余 top30/烽火/玄奘须同标。

## Reuse
若已有 `fx/_full_stills` / `full_events.json` / `by_t` → **禁止重抽**，直接 dual contact + 填表。

## Pipeline
1. Cuts：events 或 extract_shots；记 hard/min  
2. Dual sheets 15%/85%；frame-diff → 运镜（μ≈0=Static）  
3. 每镜 glossary：景别角度运镜构图光线色彩主体文字转场 + OpenChatCut 五问  
4. 叠 VISUAL-7 · M1–M7 · COPY-GRAMMAR（DualMark/Footer）· FX 仅可见  
5. 产出：`SHOT-TABLE.md` · `DIRECTOR-LOGIC.md` · `VISUAL-7*.md` · `COPY-GRAMMAR.md` · `KEEP-BAN.md` · contacts  
6. 更新 `breakdown-v2/INDEX.md`：`full_shot_table: yes` + 链接  
7. KEEP 回灌 film/evolve/topic + lailong STYLE-BASE（经 Jules）

## Anti
情节摘要当分镜 · 编造运镜 · 只做 INDEX 不算拉完 · UNSEEN 帧编细节
