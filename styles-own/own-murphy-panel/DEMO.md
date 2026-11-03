# DEMO — 生日悖论 (24 s, 1920×1080, 4 worlds)
| t | world | what happens | caption |
|---|---|---|---|
| 0–6 | W1 派对到场 | 23 guests drop onto a hex platform around a cake table; counter 「到场 23人」; HUD checklist starts | 一屋子23个人，/有两人同一天生日，几率多大？ |
| 6–13 | W2 直觉 6% | glowing blocks 直/觉; formula 23÷365≈6%; ring gauge to 6%; red ✗ stamp; checklist ticks 直觉 | 直觉会这么算：/23天÷365天，大约6%。 → 错得离谱。 |
| 13–18 | W3 253 对 | rack focus onto guests; 253 gold pair lines draw; counter 「已连线 253对」; formula 23×22÷2=253 | 但生日是两两比的：/23个人，能凑出253对。 |
| 18–24 | W4 365 天板 | 23 birthdays fill the board; collision flashes 「撞上了！」; gauge to 50.7%; title 「生日悖论」 | 253对里，只要撞上一对，/几率就过了一半：50.7%。 |
Facts: classic birthday paradox — 23 people → ≈50.7% chance of a shared birthday; naive 23/365≈6% is wrong because pairs = 23×22/2 = 253.
Build: `cd demo && sh build.sh` → test.mp4, poster/test.jpg, stills/. Readcheck: all captions and final values OK (31/31).
Music: `demo/music.py` (Fmaj7 lounge at 84 BPM + SFX synced to drops, blocks, stamp, lines, ticks, collision, gauge, dips).
