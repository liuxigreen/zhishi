# PRESET stub · 生产水墨横屏

> 参数锚，**尚未**接到统一 `lookkit/core` 渲染。真跑请用已有 `style-ink-land-v3` / `style-noir-land-v1` 或本模板对应 episode fork。
> 对齐总库：`refs/STYLE-TEMPLATE-LIBRARY.md`

```json
{
  "id": "ink-land",
  "name": "生产水墨横屏",
  "palette": [
    "xuan paper",
    "ink wash",
    "vermilion emphasis"
  ],
  "light": "paper band behind captions; world-local ink light",
  "material": "ink wash + soft paper caption band",
  "caption": "Noto Serif SC 66/34; ≥5:1; diagonal wipe",
  "visual7_targets": "≥20 worlds; muted 2s test; continuous camera",
  "engine": "stub",
  "ban_default": "flat grey bed + emissive caption-only + stick figures"
}
```

## 导演用法
1. vibe-ref-lock 选同册 LOOK-CARD  
2. 把本 stub 的 palette/light/material 抄进 REF-LOCK「覆盖」  
3. 若要升成可渲 preset：仿 `style-ink-land-v3` 建 film/helpers/worlds，不要空改 JSON
