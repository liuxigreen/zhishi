# core · 共享默认（对接 `_shared-base`）

实现仍按 LOOK-KIT-SPEC 逐步补 JS；**参数合同先锁在这里**，film 不得绕过。

| 模块 | 默认行为（自蒸） |
|---|---|
| stage | ≥3 层 + 雾 + 视差；禁单色整屏 fill >40%（debug 报警） |
| light | 定向主光开；emissive 仅白名单 |
| material | 必须点名材质；grain 开 |
| figure/prop | 明暗面 + 接触影；禁细线胶囊人 |
| camera | hold>3s 警告；多世界默认 path/soft |
| text | DualMark ≤2 色；对比合同见 shared-base.caption_defaults |
| palette | 全片锁定「颜色=词汇」 |
| debug | ID/深度通道供 gate |

入口目标 API：`film({ preset, overrides, beats })` — 无 preset 抛错。
