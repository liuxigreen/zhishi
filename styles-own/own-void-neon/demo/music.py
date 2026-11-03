"""Score for 「为什么突然就懂了」 (own-void-neon, 24 s). Cool pad in A minor-ish, soft ticks, magenta-ish shimmer.
SFX: wire draw 0.4, stuck chip 2.2, void dips 6/12/18, insight flash 14.2, link cascade 19.5, pops on chips."""
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
        for det in (-0.15, 0.0, 0.14):
            x += np.sin(2 * np.pi * f * (1 + det / 100) * t + np.sin(2 * np.pi * 0.15 * t) * 0.4)
    a = np.minimum(1, t / 1.4) * np.minimum(1, (d - t) / 1.6)
    return S.lp(x, 2200) * a / (len(notes) * 3)
def bell(m, d=1.8, v=0.5):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.8) + 0.35 * np.sin(2 * np.pi * f * 2.4 * t) * np.exp(-t * 3.5)
    return x * v
BAR = 60 / 78 * 4
# Am9 - Fmaj7 - Dm9 - E7sus  (cooler than dark-gold)
chords = [[45, 52, 55, 59, 62], [41, 48, 52, 56, 60], [38, 45, 48, 52, 57], [40, 47, 50, 54, 59]]
t0 = 0.0; i = 0
while t0 < DUR:
    put(pad(chords[i % 4], BAR + 1.2), t0, 0.5, 0)
    put(S.lp(np.sin(2 * np.pi * mtof(chords[i % 4][0] - 12) * tt(BAR)) * np.minimum(1, tt(BAR) / 0.9) * np.exp(-tt(BAR) * .35), 180), t0, 0.3)
    t0 += BAR; i += 1
for at, m in [(1.0, 76), (3.2, 72), (7.0, 79), (9.5, 76), (13.5, 81), (16.0, 79), (19.2, 84), (21.5, 76)]:
    put(bell(m, 2.2, .28), at, 1.0, 0.1)
put(S.whoosh(0.55) * 0.45, 0.35, 0.5)
put(S.click(1.4, 0.2), 2.2, 0.55, 0.3)
for at in (6.0, 12.0, 18.0): put(S.thump(0.45, 50), at - 0.04, 0.55)
def shimmer(d=1.8):
    t = tt(d); x = np.zeros_like(t)
    for m in (88, 91, 95, 100):
        x += np.sin(2 * np.pi * mtof(m) * t) * np.exp(-t * 2.5)
    return S.norm(x) * 0.5
put(S.whoosh(0.8) * 0.5, 14.1, 0.55)
put(shimmer(), 14.3, 0.45, 0.2)
for k, at in enumerate((19.6, 20.1, 20.6, 21.1)): put(S.pop(0.35), at, 0.55, 0.35)
put(S.ding(0.28), 22.4, 0.35, -0.15)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.5)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
