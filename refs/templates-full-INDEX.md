# 自家参考片 → 完整模版族（逐帧聚类）

来源片数：**34**（不是 21）。说明见下方「为什么不是 21」。

测量：`templates-full/_analysis/measured.json`  
逐帧 contact：`templates-full/_analysis/contacts/<id>_A.jpg`（每片约 16 帧，0.5s 间隔抽样）  
Lemo 形可运行模版：`/workspace/vk-distill/styles-own/<family-id>/`

## 为什么不是 21

Adelaide 口中的「21」含若干 Lemo 借来的 base。本任务只吃**她自己视频**（抖音 top30 + 来龙/墨有/比特新语/玄奘赵云等）。去重后：

- top30 视频 23 条（`refs/douyin-top30/videos/`）
- 额外自家片：zhaoyun、xuanzang、nexo、halo、zhongshan、andy、ember、moyou-darkgold、xiaomo（=战歪）、redqueen 静帧、moyou-percolation 静帧
- 排除：dianzi（无帧）、Lemo 库内风格、信息论重复下载
- **合计 34 源**（32 有 mp4，2 仅静帧）

## 族清单（10 族；优先精做前 5）

| 族 id | 中文名 | 合并片 | 合并理由（帧证据） | 状态 |
|---|---|---|---|---|
| own-dark-gold | 暗金线描 | moyou-darkgold, xiaomo-disarm, ember-craving, moyou-percolation, halo | 炭黑底 + 细金线自发光；棒人/图标人；仪表盘道具；spotlight | **完成**（styles-own/own-dark-gold；SPEC 在 own-dark-gold/SPEC.md） |
| own-void-neon | 虚空霓虹 | 0345,1643,7098,0490,6810,8134,1521,9472,5155,3785 | 近黑虚空、细线/线框道具、自发光、低填充比 0.05–0.18 | **完成**（styles-own/own-void-neon；SPEC 在 own-void-neon/SPEC.md） |
| own-lailong-sil | 来龙剪影史 | 5918,5364,2217,3678,zhaoyun,xuanzang | 剪影/peg 人、暖褐/绛红场、历史道具（烽火/鼓/玺/马） | **完成**（styles-own/own-lailong-sil；SPEC 在 own-lailong-sil/SPEC.md） |
| own-bite-red | 比特红皇后 | redqueen,0762-entropy | 近黑底语义红；stick runner；relativeGapLock + directionFork | **搁置**（人物达不到原片，2026-11-03 停做） |
| own-emotion-ui | 情绪 UI | nexo,6571,6911（1183/2127 只借道具） | 深蓝夜间房间；胶囊人/奶白象形人/扁平小孩三套人物；视线锁定、紧张条、思绪云、气泡等 UI 叠在生活上 | **完成**（styles-own/own-emotion-ui；STYLE.md） |
| own-tao-ink | 道卷水墨 | 4550-tao-involution | 米色纸底竖屏、黑线卷轴插画 | **完成**（styles-own/own-tao-ink） |
| own-egypt-papyrus | 莎草图 | 4352-egypt-eye | 沙色纸、埃及正典平涂人物+深棕描边、藏青饰带+奶油字幕卡 | **完成**（styles-own/own-egypt-papyrus，1440×1080） |
| own-murphy-panel | 墨菲暖板 | 4630-murphy | 暖褐木屋、圆柱人、发光字块、检查单 HUD | **完成**（styles-own/own-murphy-panel） |
| own-speed-seq | 节拍序列 | 0594-speedrun | 米色+底部 sequencer、木偶人 | **完成**（styles-own/own-speed-seq，O9，1920×1080） |
| own-academy-spot | 暗室聚光 | zhongshan-learn | 顶光锥、色块 peg 人、蓝图线道具 | **完成**（styles-own/own-academy-spot；STYLE.md） |
| — | 暂缓 | andy-build | 实拍/微缩摄影感，Canvas 难 1:1；单独记入证据不硬做引擎 | 证据保留 |

## 质量条（Adelaide）

每族必须：(a) styleframe 与源静帧并排到陌生人分不出谁是参考，再写一条超越源的改进；(b) PROP GRAMMAR + ≥10 编码道具 + ≥5 道具动画模式 +「如何衍生新道具」例；(c) 宁可少做精做。

