# PRESET stub · 等距绘本 stub

> 参数锚，**尚未**接到统一 `lookkit/core` 渲染。真跑请用已有 `style-ink-land-v3` / `style-noir-land-v1` 或本模板对应 episode fork。
> 对齐总库：`refs/STYLE-TEMPLATE-LIBRARY.md`

```json
{
  "id": "isometric-picture-book",
  "name": "等距绘本 stub",
  "palette": [
    "warm paper ground",
    "one rule accent",
    "ink #2A2E29"
  ],
  "light": "hard purple-ish shade ok",
  "material": "flat three-tone blocks",
  "caption": "type on ground",
  "visual7_targets": "iso lock; lid-off; no faces",
  "engine": "stub",
  "ban_default": "flat grey bed + emissive caption-only + stick figures"
}
```

## 导演用法
1. vibe-ref-lock 选同册 LOOK-CARD  
2. 把本 stub 的 palette/light/material 抄进 REF-LOCK「覆盖」  
3. 若要升成可渲 preset：仿 `style-ink-land-v3` 建 film/helpers/worlds，不要空改 JSON
