"""Score for 「差距锁死」 (own-bite-red, 24 s). Dark pulse, red-alert ticks, fork chime.
SFX: whoosh enter, footfall stride, lock click, stair ticks, fork whoosh + star chime."""
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
        for det in (-0.15, 0.0, 0.14):
            x += np.sin(2 * np.pi * f * (1 + det / 100) * t + np.sin(2 * np.pi * 0.18 * t) * 0.4)
    a = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.5)
    return S.lp(x, 2200) * a / (len(notes) * 3)
def pulse(d=0.12):
    t = tt(d); n = np.random.randn(len(t)).astype(np.float32)
    return S.lp(n * np.exp(-t * 40), 180) * 1.2
def tick(d=0.05):
    t = tt(d); n = np.random.randn(len(t)).astype(np.float32)
    return S.hp(S.lp(n * np.exp(-t * 80), 5000), 1200) * 0.55
def click(d=0.08):
    t = tt(d)
    x = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 50)
    return x * 0.5
def bell(m, d=1.8, v=0.5):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) + 0.28 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 3.0)
    return x * v
def alarm(d=0.35):
    t = tt(d)
    x = np.sin(2 * np.pi * 620 * t) * np.exp(-t * 4) * (0.5 + 0.5 * np.sin(t * 40))
    return x * 0.4

# Am - F - Dm - E (dark)
BAR = 60 / 78 * 4
chords = [[33, 40, 45, 48, 52], [29, 36, 41, 44, 48], [26, 33, 38, 41, 45], [28, 35, 40, 44, 47]]
t0 = 0.0; i = 0
while t0 < DUR:
    put(pad(chords[i % 4], BAR + 1.2), t0, 0.5, 0)
    put(S.lp(np.sin(2 * np.pi * mtof(chords[i % 4][0] - 12) * tt(BAR)) * np.minimum(1, tt(BAR) / 0.8) * np.exp(-tt(BAR) * .25), 140), t0, 0.28)
    t0 += BAR; i += 1

# stride footfalls world1 ~170bpm
beat = 60 / 170
for i in range(int(6.0 / beat)):
    put(pulse(0.1), i * beat + 0.05, 0.35 if i % 2 == 0 else 0.18, -0.15)

# lock click + alarm at gap reveal
put(click(), 8.1, 0.9)
put(alarm(0.4), 8.2, 0.7)
put(bell(60, 1.6, 0.28), 8.3, 0.8)

# stair ticks
for at in (12.8, 13.4, 14.0, 14.6, 15.2, 15.8, 16.4):
    put(tick(), at, 0.55, 0.1)

# fork whoosh + bright chime
put(S.whoosh(0.7) * 0.55, 19.2, 0.7)
put(bell(72, 2.4, 0.4), 19.5, 0.9, 0.15)
put(bell(76, 2.0, 0.28), 20.8, 0.7, -0.1)
put(bell(79, 2.2, 0.22), 22.0, 0.6)

# world dips
for at in (0.25, 6.0, 12.0, 18.0):
    put(S.whoosh(0.45) * 0.3, at - 0.1 if at > 0.3 else at, 0.45)

peak = np.max(np.abs(mix)) + 1e-9
mix *= 0.70 / peak
mix = np.tanh(mix * 1.05) / np.tanh(1.05) * 0.68
out = os.path.join(ROOT, 'out'); os.makedirs(out, exist_ok=True)
path = os.path.join(out, 'mix.wav')
with wave.open(path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print('wrote', path, 'peak', float(peak))
