# STYLE-BASE 库存清单 · 2026-11-03b

> 目的：一眼看清「有哪些底座 / 能不能当导演锚」。  
> **统一底座：** `docs/OWN-TEMPLATE-BASE.md` · `lookkit/presets/_shared-base/`  
> **不一定抄，但有锚** —— 新画风 = shared-base + 最近邻居 overrides。

## A · bases/ 蒸馏底座（25）

| # | folder | 一句话长相 | 有静帧? | 可用度 | 建议册 | 备注 |
|---|---|---|---|---|---|---|
| 1 | `andy-3d-building` | 一镜建筑生长 | contact+kf | **可用锚** | S | LOOK-CARD |
| 2 | `andy-3d-construction-sim` | 旧桥墩 HUD | 无 | **合并** | S | → S-andy-build · MERGE.md |
| 3 | `bite-red-queen` | 黑底语义红动能字 | refs 13png | **可用锚** | V/E | LOOK-CARD 本轮补 |
| 4 | `chalkboard` | 墨绿板真笔顺 | Lemo frames | **可用锚** | P | LOOK-CARD |
| 5 | `circuit-board` | 旧暗金套绿 | 无 | **合并** | V | → V-circuit-pcb · MERGE.md |
| 6 | `circuit-board-pcb` | 正俯视 FR-4+光 | Lemo frames | **可用锚** | V | LOOK-CARD 本轮补 |
| 7 | `countdown-split` | 分屏倒计时墙 | gate_refs | **可用锚** | R | LOOK-CARD 本轮补 |
| 8 | `desktop-flythrough` | 点阵桌一镜 | Lemo frames | **可用锚** | S/R | LOOK-CARD 本轮补 |
| 9 | `dianzi-info-surprisal` | 信息论惊讶 HUD | **无** | **stub 静帧** | V | 语法卡已写；需抽帧 |
| 10 | `game-show` | 综艺扁平节拍 | Lemo frames | **可用锚** | R | LOOK-CARD 本轮补 |
| 11 | `isometric-picture-book` | 等距绘本 | Lemo frames | **可用锚** | S | LOOK-CARD |
| 12 | `lailong-history-person` | 浮雕地形历史人 | 大量 kf | **可用锚** | H | LOOK-CARD 本轮补 |
| 13 | `lailong-xuanzang-passport` | 玄奘通关 | 有 | **已入 REF** | H | H-xuanzang |
| 14 | `lailong-zhaoyun-infant` | 赵云战阵 | 有 | **已入 REF** | H | H-zhaoyun |
| 15 | `memphis-diorama` | 孟菲斯微缩城 | Lemo frames | **可用锚** | S | LOOK-CARD 本轮补 |
| 16 | `moyou-darkgold-music` | 炭黑金线暗金 | sample/stills | **可用锚** | V | LOOK-CARD |
| 17 | `moyou-story-percolation` | 渗流故事床 | refs/effort | **可用锚** | V/E | LOOK-CARD 本轮补 |
| 18 | `nexo-crowd-phone` | 人群手机 | 有 | **可用锚** | E | LOOK-CARD |
| 19 | `printed-long-take` | 刮版墨纸一镜 | Lemo frames | **可用锚** | P | LOOK-CARD |
| 20 | `sanhao-halo-effect` | 光环效应 | 有 | **可用锚** | E | LOOK-CARD |
| 21 | `transit-map` | 暖纸地铁笔尖 | Lemo frames | **可用锚** | P/S | LOOK-CARD 本轮补 |
| 22 | `xiaomo-darkgold-disarm` | 六层卸防暗金 | strip/stills | **可用锚** | E | LOOK-CARD 本轮补 |
| 23 | `yingxian-tenon` | 榫卯斗栱生长 | wooden-pagoda qa | **可用锚** | S/H | LOOK-CARD 本轮补；测绘 GAP |
| 24 | `zhanwai-darkgold-huashu` | 同六层卸防 | 无 | **合并** | E | → E-xiaomo-disarm · MERGE.md |
| 25 | `zhongshan-learn-fast` | 学得快 | 6 kf | **可用锚** | E/V | LOOK-CARD |

**bases 合计：** 25 · **可用锚 21** · **合并 3** · **真 stub 1**（dianzi 静帧）

## B · Lemo（外部菜单，非本底座）

见 `docs/LEMO-HOW-选风用法.md` · `refs/lemo-demos/INDEX.md`（68 demo）。不强制 66 张卡。

## C · 现生产 lookkit

| preset | 用途 | 成熟度 |
|---|---|---|
| **`_shared-base`** | 所有自蒸的父合同 | **规格+JSON 已锁** |
| `style-ink-land-v3` | 水墨横屏多世界 | **全片可用** |
| `style-noir-land-v1` | 暗黑钠灯横屏 | **全片可用** |
| 册 H/V/S/P/E/R + 具名 stub | 锚参数 | stub（未接引擎） |

## D · 增长路径

1. 自蒸 → `OWN-TEMPLATE-BASE` 选 id → shared-base + overrides → REF-LOCK  
2. 非自蒸长相 → LEMO-HOW + INDEX  
3. 水墨/钠灯生产 → ink / noir 直开  
4. 新画风禁止无锚从零漂
