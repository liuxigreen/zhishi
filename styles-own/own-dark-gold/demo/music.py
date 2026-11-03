"""Score for 「为什么越看越顺眼」 (own-dark-gold demo, 24 s). All synthesized in code, no voice.
D minor, 76 BPM: warm pad (Dm9 – Bbmaj7 – Gm9 – A7sus) + sparse felt-piano + sub swell.
SFX on the picture's events: ring ignite 1.2 s (shimmer), bloom wipe 6 s (whoosh+swell), cloche glow 9.6 s (glass ding),
counter ticks 12.8–16.2 s, void dips 12/18 s (low thump), three label pops 19.6/19.95/20.3 s, risk chip 22.2 s.
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
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = x[: max(0, N - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r
def pad(notes, d):
    t = tt(d); x = np.zeros_like(t)
    for m in notes:
        f = mtof(m)
        for det in (-0.12, 0.0, 0.11):
            x += np.sin(2 * np.pi * f * (1 + det / 100) * t + np.sin(2 * np.pi * 0.2 * t) * 0.3)
    a = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.4)
    return S.lp(x, 1800) * a / (len(notes) * 3)
def piano(m, d=2.5, v=0.6):
    t = tt(d); f = mtof(m)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.6 + k * 0.9)) for k, a in [(1, 1), (2, .45), (3, .2), (4, .08)])
    return x * np.minimum(1, t / 0.004) * v
def shimmer(d=1.6):
    t = tt(d); x = np.zeros_like(t)
    for m in (86, 89, 93, 98, 101):
        x += np.sin(2 * np.pi * mtof(m) * t) * np.exp(-t * 2.2) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t))
    return S.norm(x) * 0.5
def glass(m=96):
    t = tt(2.0); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 2.5) * .5
BAR = 60 / 76 * 4  # 3.16 s
chords = [[50, 57, 60, 64, 65], [46, 53, 57, 62, 65], [43, 50, 53, 57, 62], [45, 52, 55, 59, 64]]
t0 = 0.0; i = 0
while t0 < DUR:
    put(pad(chords[i % 4], BAR + 1.2), t0, 0.55, 0)
    put(S.lp(np.sin(2 * np.pi * mtof(chords[i % 4][0] - 12) * tt(BAR)) * np.minimum(1, tt(BAR) / 0.8) * np.exp(-tt(BAR) * .4), 200), t0, 0.35)
    t0 += BAR; i += 1
mel = [(0.8, 74), (2.4, 72), (3.95, 69), (6.3, 77), (7.9, 76), (9.5, 74), (12.6, 69), (14.2, 72), (15.8, 74), (18.4, 76), (20.0, 77), (21.6, 74), (23.0, 74)]
for at, m in mel: put(piano(m, 3.0, .32), at, 1.0, 0.15)
# SFX
put(shimmer(), 1.2, 0.5, 0.3)
put(S.whoosh(0.7) * 0.5, 5.65, 0.6)
put(glass(), 9.6, 0.45, 0.1)
for k in range(24):
    put(S.click(1.6, 0.18), 12.8 + k * (3.4 / 24), 0.5, 0.2)
for at in (12.0, 18.0): put(S.thump(0.5, 55), at - 0.05, 0.6)
for k, at in enumerate((19.6, 19.95, 20.3)): put(S.pop(0.4), at, 0.6, 0.4)
put(S.ding(0.3), 22.2, 0.35, -0.2)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.5)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
