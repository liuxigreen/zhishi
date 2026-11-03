# DEMO — 史上第一次罢工 (24 s, 1440×1080, 4 worlds)
| t | world | what happens | caption |
|---|---|---|---|
| 0–6 | W1 帝王谷工地 | stone wall carves in, a worker chisels, another carries a grain basket; title pill 「史上第一次罢工」 | 给法老修陵墓的工匠，/ 工资不是钱，是粮食。 |
| 6–12 | W2 粮仓见底 | granary empties, worker slumps, tally + 「第 N 天」 count to 18 (red); scribe 阿蒙纳赫特 writes | 拉美西斯三世在位第29年，/ 口粮晚发了18天。 |
| 12–18 | W3 五道哨卡 | pan past 5 numbered guard posts to the temple; three workers sit down; one shouts, scroll 「我们饿了！」 | 工匠们走过五道哨卡，/ 坐到神庙后面，不干了。 |
| 18–24 | W4 纸草记下 | Nile bank; big scroll unrolls and writes 「第29年 · 工匠罢工 / “我们饿了！”」; official brings grain, crew cheers, ankh stamps | 书吏把这件事写进了都灵罢工纸草 / ——人类第一次有记载的罢工。 |
Facts: Turin Strike Papyrus, year 29 of Ramesses III (c. 1157 BC), Deir el-Medina tomb workers, scribe Amennakht; the crew passed the guard posts and sat behind the temple saying "we are hungry".
Build: `cd demo && sh build.sh` → test.mp4, poster/test.jpg, stills/. Readcheck: all captions/final values OK; only BADs are the intermediate counter numbers (by design) and a pylon number "1" passing during the pan (1.24 s, decorative).
Music: `demo/music.py` (D Hijaz harp + drone + 92 BPM drum, SFX synced to chisel, wipes, pour, ticks, shout, cheer, ding).
