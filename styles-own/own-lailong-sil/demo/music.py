"""Score for 「缺席也是消息」 (own-lailong-sil, 24 s). Warm D-minor pad, wood ticks, soft drum.
SFX: whoosh enter, crackle on ladder lights, thud on path nodes, hollow wind on absent, chime DualMark."""
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
    i = int(at * SR); x = np.asarray(x, np.float32)[: max(0, N - i)]
    if len(x) == 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r
def pad(notes, d):
    t = tt(d); x = np.zeros_like(t)
    for m in notes:
        f = mtof(m)
        for det in (-0.12, 0.0, 0.11):
            x += np.sin(2 * np.pi * f * (1 + det / 100) * t + np.sin(2 * np.pi * 0.12 * t) * 0.35)
    a = np.minimum(1, t / 1.6) * np.minimum(1, (d - t) / 1.8)
    return S.lp(x, 1800) * a / (len(notes) * 3)
def bell(m, d=1.8, v=0.5):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.4) + 0.3 * np.sin(2 * np.pi * f * 2.2 * t) * np.exp(-t * 3.2)
    return x * v
def wood(d=0.08):
    t = tt(d); n = np.random.randn(len(t)).astype(np.float32)
    return S.lp(n * np.exp(-t * 60), 2400) * 0.7
def crackle(d=0.5):
    t = tt(d); n = np.random.randn(len(t)).astype(np.float32)
    env = np.exp(-t * 3) * (0.5 + 0.5 * np.sin(t * 80))
    return S.hp(S.lp(n * env, 6000), 800) * 0.35
def hollow(d=1.6):
    t = tt(d)
    x = np.sin(2 * np.pi * 90 * t) * np.exp(-t * 1.2)
    x += 0.4 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 1.5)
    noise = np.random.randn(len(t)).astype(np.float32) * np.exp(-t * 0.8) * 0.15
    return S.lp(x + noise, 600) * 0.6

BAR = 60 / 72 * 4
# Dm9 - Bbmaj7 - Gm9 - A7sus
chords = [[38, 45, 48, 53, 57], [34, 41, 45, 49, 53], [31, 38, 41, 46, 50], [33, 40, 43, 47, 52]]
t0 = 0.0; i = 0
while t0 < DUR:
    put(pad(chords[i % 4], BAR + 1.4), t0, 0.55, 0)
    put(S.lp(np.sin(2 * np.pi * mtof(chords[i % 4][0] - 12) * tt(BAR)) * np.minimum(1, tt(BAR) / 1.0) * np.exp(-tt(BAR) * .3), 160), t0, 0.32)
    t0 += BAR; i += 1
# bells
for at, m in [(1.2, 69), (3.5, 65), (7.2, 72), (9.8, 69), (13.5, 74), (16.2, 72), (19.5, 77), (21.8, 69)]:
    put(bell(m, 2.0, .26), at, 1.0, 0.05)
# wood ticks ~72bpm quarters soft
beat = 60 / 72
for i in range(int(DUR / beat)):
    if i % 4 != 3:
        put(wood(), i * beat + 0.02, 0.25 if i % 2 == 0 else 0.12, -0.2)
# SFX timeline
put(S.whoosh(0.6) * 0.5, 0.3, 0.55)
# ladder crackles at 6.6, 7.4, 8.2, 9.0
for at in (6.6, 7.4, 8.2, 9.0):
    put(crackle(0.55), at, 0.9, 0.1)
# path node ticks
for at in (13.0, 14.2, 15.4, 16.5):
    put(wood(0.1), at, 0.45, 0.0)
# absent hollow wind
put(hollow(2.0), 19.2, 1.0, 0.0)
put(bell(65, 2.5, 0.35), 19.5, 0.8)
# dips
for at in (6.0, 12.0, 18.0):
    put(S.whoosh(0.45) * 0.35, at - 0.15, 0.4)

# soft peak normalize + gentle limiter then write
peak = np.max(np.abs(mix)) + 1e-9
mix *= 0.72 / peak
# soft clip to keep true peak under -1.5 dBFS (~0.84)
mix = np.tanh(mix * 1.05) / np.tanh(1.05) * 0.70
out = os.path.join(ROOT, 'out'); os.makedirs(out, exist_ok=True)
path = os.path.join(out, 'mix.wav')
with wave.open(path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print('wrote', path, 'peak', float(peak))
