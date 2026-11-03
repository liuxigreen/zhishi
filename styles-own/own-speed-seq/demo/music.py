"""Score for 「切分 · 缝里的那一下」 (own-speed-seq demo, 24 s). Code-only, no voice.
76 BPM throughout (matches the on-screen metronome). Kick on 1+3, hihat every beat,
snare on 2+4; W4 adds syncopated guitar plucks on the off-beats (the 「缝」).
SFX: metronome clicks W1, whoosh on dips, disco sparkles W3, ding on gap bracket.
Usage: python3 <demo>/music.py  →  <demo>/out/mix.wav"""
import os, sys, wave
import numpy as np
LIB = os.environ.get('LIB', '/workspace/lemo-opuscar')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx as S
ROOT = os.path.dirname(os.path.abspath(__file__))
SR, DUR, BPM = 48000, 24.0, 76.0
N = int(SR * DUR)
mix = np.zeros((N, 2), np.float32)
BEAT = 60.0 / BPM

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = np.asarray(x, np.float32)[: max(0, N - i)]
    if len(x) == 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r

def kick(d=0.35):
    t = tt(d); f = 140 * np.exp(-t * 18) + 40
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 8) * 1.2

def snare(d=0.25):
    t = tt(d); n = S.noise(d) * np.exp(-t * 18)
    return S.bp(n, 1800, 4000) * 0.7 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 30) * 0.3

def hat(d=0.08):
    t = tt(d); return S.hp(S.noise(d), 6000) * np.exp(-t * 50) * 0.55

def bass(m, d=0.4):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 4) + 0.4 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 6)
    return S.lp(x, 600) * 0.8

def pluck(m, d=0.5):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 5)
    x += 0.35 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 7)
    return x * 0.55

def pad(notes, d):
    t = tt(d); x = np.zeros_like(t)
    for m in notes:
        f = mtof(m)
        for det in (-0.1, 0.0, 0.12):
            x += np.sin(2 * np.pi * f * (1 + det / 100) * t)
    a = np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 1.0)
    return S.lp(x, 1600) * a / (len(notes) * 3)

# chord beds per world
beds = [
    (0.0, 5.7, [45, 52, 57, 60]),      # Am — W1
    (6.0, 11.7, [48, 55, 60, 64]),     # C — W2 waltz brighter
    (12.0, 17.7, [41, 48, 53, 60]),    # F — W3 disco
    (18.0, 24.0, [45, 52, 55, 60]),    # Am7 — W4
]
for a, b, ch in beds:
    t0 = a
    while t0 < b:
        put(pad(ch, min(2.2, b - t0 + 0.3)), t0, 0.4)
        t0 += BEAT * 4

# drum pattern all the way
t = 0.0; i = 0
while t < DUR:
    put(hat(), t, 0.35, 0.2)
    if i % 2 == 0: put(kick(), t, 0.85)
    if i % 2 == 1: put(snare(), t, 0.55, -0.1)
    if i % 4 == 0: put(bass(33 if t < 18 else 36, 0.35), t, 0.55)
    # W4 syncopated guitar on the "and" of 2 and 4  →  beat+0.5 when i%4 in (1,3)
    if t >= 18.0 and i % 4 in (1, 3):
        put(pluck(64 + (i % 3) * 3, 0.4), t + BEAT * 0.5, 0.7, 0.3)
    t += BEAT; i += 1

# W1 metronome wood clicks (doubled clarity)
t = 0.0
while t < 5.6:
    put(S.click(1.8, 0.2), t, 0.55, -0.4)
    t += BEAT

# dips
for at in (5.7, 11.7, 17.7):
    put(S.whoosh(0.55), at, 0.55)
    put(S.thump(0.4, 50), at + 0.05, 0.4)

# W3 sparkle pops on beats
t = 12.0
while t < 17.5:
    put(S.pop(0.25), t, 0.25, (t * 3) % 2 - 1)
    t += BEAT

# gap bracket ding
put(S.ding(), 19.9, 0.55, 0.2)
put(S.ding(), 22.5, 0.4, -0.2)

# soft end swell
put(pad([48, 55, 60, 67], 2.5), 22.0, 0.35)

fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.5)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
out = os.path.join(ROOT, 'out', 'mix.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print('wrote', out)
