# PRESET stub · H · 历史战阵

> 参数锚，**尚未**接到统一 `lookkit/core` 渲染。真跑请用已有 `style-ink-land-v3` / `style-noir-land-v1` 或本模板对应 episode fork。
> 对齐总库：`refs/STYLE-TEMPLATE-LIBRARY.md`

```json
{
  "id": "H",
  "name": "H · 历史战阵",
  "palette": [
    "terrain ink",
    "warm stone",
    "ember accent"
  ],
  "light": "directional sun + torch rim",
  "material": "relief / stone / paper map grain",
  "caption": "DualMark on path props; ≥4.5:1",
  "visual7_targets": "mid_fill=full; layers≥3; mass_diag high; soft path",
  "engine": "stub",
  "ban_default": "flat grey bed + emissive caption-only + stick figures"
}
```

## 导演用法
1. vibe-ref-lock 选同册 LOOK-CARD  
2. 把本 stub 的 palette/light/material 抄进 REF-LOCK「覆盖」  
3. 若要升成可渲 preset：仿 `style-ink-land-v3` 建 film/helpers/worlds，不要空改 JSON
