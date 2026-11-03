# CANON-VISUAL-7 · V1–V7 定义与分册目标（S2）
测法证据：`refs/douyin-top30/VISUAL-7-MEASURED.md` · `fx/v7_quant.json`（归档后仍在 refs）。  
不同册分记；禁全局平均数抹平。观感交付门见 `LOOK-GATE.md`。

## 1 · 定义 / 测法（v7_measure 名）/ BAN
| V | 定义 | 测法指标 | BAN |
|---|---|---|---|
| **V1 画面占比** | 主戏区与中区吃满程度 | `mid_void_frac` · `mid_fill`∈{full,half,sparse} · `mid_edge_den` | 中区大空+细线 HUD 冒充满幅史地 |
| **V2 空间纵深** | 远/中/近层与雾/透视 | `layers_est`（目标≥3）+ 目视雾/叠 | 全平面贴纸无前后 |
| **V3 物体体量** | 主物相对画幅质量 | `mass_diag_frac`；塔/城高占 H | 火柴人+细线地图 |
| **V4 材质** | 地表/纸/膜纹理 | `grain_lap_sigma`；硬/软边 | 深褐空板冒充浮雕 |
| **V5 受光** | 形体定向光与明暗面 | `light_dir_consistency`；亮面方向 | 只有 UI 发光、物体无受光面 |
| **V6 遮挡** | 前后挡与半遮 | 目视序 + fg 层；半透文书/雾 | 全部同层并排不挡 |
| **V7 镜头/转场** | 运镜与切型匹配 | push/pan/dolly/path；转场 soft|sparse|dense|stack | 史地用高频 step；深空无意义糊 dissolve |

另记：`hard_edge_p95` · `mean_luma` · `emissive_ui_frac`（最亮像素属 text/ui 的比例，门限见 LOOK-GATE）。

## 2 · 每册目标（摘自 MEASURED + v7_quant anchors）
### H · 史地旅程
- V1：地形/舞台帧中区 **full/near-full**（烽火地图 `beacon_f055` 中区非空≈**89%**、底45% fill≈78%、mid_edge≈0.17）；舞台阵底带≈98%W  
- V3：塔高约 **0.45–0.50H**；阵列 `mass_diag`≈0.89（`f_025`）  
- V4：浮雕 grain σ≈**25–35**（地形≈25.5；书卷≈35）  
- V5：定向主光+谷影；炬火可自发光照台身  
- V7：切型 **soft**（烽火 hard≈1/233s；长安≈2/426s）；H-A 玉玺高频须声明，勿冒充来龙

### V · 深空论证
- V1：`mid_void`≈**0.84** 级 **sparse 合法**，但须 **hero 体量**（数轴/点云吃中线）+ grain + 层数（裁决 C2）  
- V4–V5：近黑膜粒；自发光为主+vignette；忌假透视街抄 H  
- V7：切型 **sparse** 长 hold（信息论≈6/300s）

### S · 模拟棋盘
- V1：棋盘/秤盘中下 **half–full**；V3 计数物有质量；V5 顶侧光+接触影；堆积/清空为主

### P · 绘本 / E · 情绪 / R · 节奏
- P：满幅色带/纸纹 mid 常 full；平光；禁抄深空金线  
- E：霓虹/头像卡吃屏；短；勿当地形床  
- R：舞者层+底栏谱面；切型 **dense**（hard≈53/566s）；**禁**抄进 H/V

## 3 · 反例锚
sushi densest：bot fill≈13%、mid_edge≈0.01、grain 低 → H 观感 Fail。  
跨册 twin：V 虚空 ≠ H 地形空板；R/玉玺 dense ≠ 来龙 soft。
