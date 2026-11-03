"""Score for 「问对一层 · 表面之外」 (own-academy-spot, 24 s). Warm academic pad in D, soft piano, light ticks.
W1 curious (orbit), W2 reveal shimmer (blueprint morph 7.6), W3 scale tip 13.2, W4 climb + settle.
SFX: pops for question cards, whoosh on dips, glass ding on why-ring, soft ticks on scale, sparkle on morph.
Usage: python3 <demo>/music.py → <demo>/out/mix.wav"""
import os, sys, wave
import numpy as np
LIB = os.environ.get('LIB', '/workspace/lemo-opuscar')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx as S
ROOT = os.path.dirname(os.path.abspath(__file__))
SR, DUR = 48000, 24.0
N = int(SR * DUR)
mix = np.zeros((N, 2), np.float32)
rng = np.random.default_rng(11)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = np.asarray(x)[: max(0, N - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r
def pad(m, d, bright=0.4):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(m) * k * t + rng.random()) / (k ** 1.3) for k in (1, 2, 3, 5))
    return S.lp(x, 1800 + 1200 * bright) * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.2) * 0.22
def piano(m, d=2.0, v=0.5):
    t = tt(d); f = mtof(m)
    x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t) + 0.12 * np.sin(2 * np.pi * f * 3 * t))
    env = np.exp(-t * 2.8) * np.minimum(1, t / 0.005)
    return S.lp(x * env * v, 4200)
def ding(m=88):
    t = tt(1.8); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.4 * t)) * np.exp(-t * 2.5) * 0.45
# beds
put(pad(50, 6.5, 0.3), 0, 1.0); put(pad(57, 6.5, 0.25), 0, 0.5)          # D + A
put(pad(50, 7.0, 0.45), 5.7, 1.0); put(pad(54, 7.0, 0.35), 5.7, 0.55)      # brighter for reveal
put(pad(45, 7.0, 0.35), 11.6, 0.95); put(pad(52, 7.0, 0.3), 11.6, 0.5)
put(pad(50, 7.0, 0.5), 17.6, 1.0); put(pad(57, 7.0, 0.4), 17.6, 0.55); put(pad(62, 6.5, 0.35), 18.5, 0.4)
# melody hints
mel = [(0.8, 69), (1.6, 71), (2.5, 74), (4.0, 69), (6.5, 74), (7.8, 78), (8.6, 81), (9.8, 78),
       (12.5, 69), (13.5, 71), (14.6, 74), (16.0, 76), (18.6, 74), (19.5, 78), (20.8, 81), (22.2, 86), (23.0, 81)]
for at, m in mel: put(piano(m, 2.4, 0.45), at, 0.55, 0.1)
# SFX
for i, at in enumerate([0.9, 1.15, 1.4, 1.65, 1.9, 2.15]):
    put(S.click(0.5, 0.5), at, 0.3, -0.2 + i * 0.05)
for at in (5.6, 11.6, 17.6): put(S.whoosh(0.45, 0.55) * 0.65, at, 0.5)
# blueprint morph shimmer
put(S.bp(S.noise(1.6), 2000, 6000) * np.exp(-tt(1.6) * 1.8) * 0.3, 7.6, 0.45, 0.2)
put(ding(93), 8.4, 0.35, 0.15)
# scale tip
put(S.thump(0.5, 70), 13.4, 0.35); put(ding(81), 14.0, 0.3, 0.25)
# why ring
put(ding(96), 13.7, 0.4, 0.2)
# climb ticks
for i in range(7): put(S.click(0.4, 0.35), 19.0 + i * 0.35, 0.22, 0.15)
put(ding(98), 22.0, 0.4, 0.1)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.4)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.78
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
