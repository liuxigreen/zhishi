# Demo · 「切分 · 缝里的那一下」

- Duration: **24 s** · 1920×1080 · 30 fps · 76 BPM
- Film idea: tempo → waltz meter → disco density → syncopation in the gap
- Worlds:
  1. **0–6 s** beige board — metronome + BPM 76 + 4/4 sequencer. Caption: 拍子来得多快，叫**速度**
  2. **6–12 s** burgundy ballroom — puppet couple under spotlight, 3/4 sequencer. Caption: 华尔兹 · **强**、弱、弱
  3. **12–18 s** plum disco — candy dancers + disco ball + multi-track sequencer. Caption: 又亮又满，让人想**一直跳**
  4. **18–24 s** beige living room — three fedora puppets, guitar off-beats, **gapBracket「缝」**. Caption: 好听的，往往在**缝里**
- Improvement on screen: one continuous playhead across all four worlds; bodies flash on the beat; W4 gapBracket names the syncopation.
- Build: `sh demo/build.sh` (needs `/workspace/lemo-opuscar`)
- Outputs: `test.mp4` · `poster.jpg` · `stills/styleframe.jpg` · sheets via `still.mjs` on `sheets/` at t=0 / 1.5 / 2.5
