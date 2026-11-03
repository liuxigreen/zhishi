# CHANGES — own-murphy-panel (one row per decision)
| # | decision | why / cite |
|---|---|---|
| 1 | One source (4630) = one family, 1920×1080 kept | warm room + HUD + caption bed only work in the source's landscape |
| 2 | Palette measured from 4630 frames (wall, floor, table green, gold, coral) | t5 / t52 / t94 |
| 3 | Mini 3D (look-at cam, Lambert, box/prism, Scene, dof) in look.js | source is soft 3D dioramas, not flat cutouts |
| 4 | Peg body chunkier (bw0 0.215 / bw1 0.19 / hr 0.152), h ≥ 80 in party | first pegs were stick-thin vs source |
| 5 | Cake glow radius 10 / alpha 0.55 | first glow blew out the frame |
| 6 | gridBoard = per-cell perspective faces (not affine onPlane) | affine skew made the 365 board unreadable |
| 7 | Collision label above the board on a dark pill | cream board killed contrast for 「撞上了！」 |
| 8 | Gauge / ring readouts use eased exact values (50.7 / 6) | wobble showed 50.6 / 7 |
| 9 | W2/W3 boundary moved to t=13; c2b held across the dip; counters TEXTS-push only finals | readcheck: intermediate counts and short captions |
| 10 | lightsDip filter only strips `c\d*` captions, not HUD | earlier filter wiped too much during dips |
| 11 | Sheets: people (t=0), props (t=1.5), pattern filmstrip (t=2.5); cameras re-scaled so pegs/props fit cells | first sheet render cropped heads and gauges |
| 12 | OUR IMPROVEMENT: one number drives HUD + counter + lines + gauge; animated rack focus; lightsDip world changes | source DoF is fixed per shot and cuts hard between boards |
| 13 | Honest gap: pegs less glossy/3D than the source's rendered toys | specular + subsurface not matched in Canvas2D gradients |
