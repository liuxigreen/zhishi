"""Score for 「庖丁解牛 · 顺着缝走」 (own-tao-ink demo, 24 s). All synthesized in code, no voice.
D 宫 pentatonic, 72 BPM feel: plucked qin-like string (Karplus-Strong) + low drone + soft wind; W1 is tense (hacks on a dry
wood clack + low thump, minor 3rd colour), from W2 open pentatonic. SFX on picture events: chops 1.21+n·1.05 s (W1),
ink-bloom whooshes 5.35/11.35/17.35, brush swish 6.3/21.3, seal thumps 8.59/12.33/18.33, knife follows 13–16 (soft scrape),
ox parts fall 16.3 (low thud), blade gleams 20.5/23.1 (glass ding).
Usage (from the library root): python3 <demo>/music.py  →  <demo>/out/mix.wav"""
import os, sys, wave
import numpy as np
LIB = os.environ.get('LIB', '/workspace/lemo-opuscar')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx as S
ROOT = os.path.dirname(os.path.abspath(__file__))
SR, DUR = 48000, 24.0
N = int(SR * DUR)
mix = np.zeros((N, 2), np.float32)
rng = np.random.default_rng(3)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = np.asarray(x)[: max(0, N - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r
def qin(m, d=3.0, v=0.6, bright=0.5):
    """Karplus-Strong pluck with a slow pitch slide-in (吟猱 feel)."""
    f = mtof(m); L = int(SR / f); buf = rng.uniform(-1, 1, L) * v; out = np.zeros(int(SR * d)); dec = 0.996 + 0.003 * (1 - bright)
    for i in range(len(out)):
        j = i % L; out[i] = buf[j]; buf[j] = dec * 0.5 * (buf[j] + buf[(j + 1) % L])
    return S.lp(out, 3200) * np.minimum(1, tt(d) / 0.003)
def drone(m, d):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(m) * k * t) / k ** 1.5 for k in (1, 2, 3))
    return S.lp(x, 600) * np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5) * 0.25
def wind(d):
    return S.bp(S.noise(d), 300, 1200) * np.minimum(1, tt(d) / 2) * np.minimum(1, (d - tt(d)) / 2) * 0.05
def ding(m=93):
    t = tt(2.2); f = mtof(m); return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 2.2) * .5
put(drone(38, 6.2), 0, 0.9); put(drone(41, 6.2), 0, 0.35)           # D + F (minor colour) under the hacking
put(drone(38, 18.2), 5.8, 0.9); put(drone(45, 18.2), 5.8, 0.4)       # D + A open fifth from W2
put(wind(24), 0, 1.0)
D5 = [62, 64, 66, 69, 71, 74, 76, 78, 81]                            # D 宫: D E F# A B
mel = [(6.3, 69), (6.9, 74), (7.6, 71), (8.6, 69), (9.6, 66), (10.6, 64), (12.4, 62), (13.0, 66), (14.0, 69), (15.0, 71), (16.3, 74),
       (18.4, 69), (19.2, 71), (20.1, 74), (21.3, 76), (22.0, 74), (22.9, 78), (23.2, 81)]
for at, m in mel: put(qin(m, 2.8, 0.55), at, 0.6, 0.15)
for at, m in [(0.4, 50), (2.5, 53), (4.6, 50)]: put(qin(m, 2.2, 0.5, 0.2), at, 0.5, -0.2)
c = 0.5 + 0.68 * 1.05
while c < 5.6:
    put(S.clack(0.8, 0.9), c, 0.65, 0.1); put(S.thump(0.6, 60), c, 0.45); c += 1.05
for at in (5.35, 11.35, 17.35): put(S.whoosh(0.5, 0.6) * 0.7, at, 0.55)
for at in (6.3, 21.3): put(S.lp(S.bp(S.noise(1.0), 900, 4000) * np.exp(-tt(1.0) * 3) * np.minimum(1, tt(1.0) / 0.05), 5000), at, 0.25, -0.1)
for at in (8.59, 12.33, 18.33): put(S.thump(0.8, 85), at, 0.55); put(S.click(0.6, 0.4), at, 0.3)
for k in range(3): put(S.bp(S.noise(0.9), 2500, 7000) * np.exp(-tt(0.9) * 2.5) * 0.25, 13.0 + k, 0.35, 0.3)
put(S.thump(1.0, 48), 16.3, 0.7); put(S.thump(0.6, 52), 16.5, 0.5)
for at in (20.5, 23.1): put(ding(93), at, 0.35, 0.25)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.5)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
