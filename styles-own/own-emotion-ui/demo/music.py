"""Score for 「聚光灯效应 · 你没那么显眼」 (own-emotion-ui demo, 24 s). All synthesized in code, no voice.
A minor → C major at the reversal, 78 BPM: soft lo-fi pad + plucked "phone" bells + heartbeat under W1 tension.
SFX on picture events: eyes pop 1.4/1.58/1.76 s, brackets snap ~2.4 s, heartbeat 2.7–5.6 s (speeds up with the meter),
dips 6/18 s (thump), clock ticks 8.4–11 s, flip 10.6 s, cloud dive 11.2 s (whoosh), lamp flicker 12.15/12.35 s (click),
count-ups 13.6/14.5 s (ticks), chip 15.4 s (pop), gaze release 18.5 s (reverse shimmer), phones 19.3 s (pops), end chip 21.8 s (ding).
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
BAR = 60 / 78 * 4
chords = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 64], [43, 50, 55, 59, 62], [40, 47, 52, 56, 59],      # Am Fmaj7 G E (W1–W3)
          [48, 55, 60, 64, 67], [41, 48, 57, 60, 64], [43, 50, 55, 62, 67], [48, 55, 60, 64, 72]]      # C F G C (reversal)
t0 = 0.0; i = 0
while t0 < DUR:
    ch = chords[i % 4] if t0 < 17.5 else chords[4 + i % 4]
    put(pad(ch, BAR + 1.2), t0, 0.5, 0)
    put(S.lp(np.sin(2 * np.pi * mtof(ch[0] - 12) * tt(BAR)) * np.minimum(1, tt(BAR) / 0.8) * np.exp(-tt(BAR) * .4), 200), t0, 0.3)
    t0 += BAR; i += 1
mel = [(0.5, 76), (1.3, 72), (6.4, 76), (7.2, 74), (8.0, 72), (9.6, 69), (12.4, 72), (13.2, 74), (14.0, 76), (18.6, 79), (19.4, 76), (20.2, 72), (21.0, 74), (21.8, 76), (22.8, 72)]
for at, m in mel: put(piano(m, 2.6, .28), at, 1.0, 0.2)
for k, at in enumerate((1.4, 1.58, 1.76)): put(S.pop(0.35), at, 0.45, -0.4 + k * 0.2)
put(S.click(2.2, 0.3), 2.42, 0.6, 0.3)
hb = 2.7
while hb < 5.6:
    put(S.heartbeat(), hb, 0.55); hb += max(0.42, 0.85 - (hb - 2.7) * 0.15)
for at in (6.0, 18.0): put(S.thump(0.5, 55), at - 0.05, 0.6)
for k in range(10): put(S.click(1.6, 0.15), 8.4 + k * 0.26, 0.35, -0.3)
put(S.click(1.0, 0.35), 10.62, 0.6, 0.3)
put(S.whoosh(0.8) * 0.6, 11.15, 0.7)
for at in (12.15, 12.23, 12.35, 12.43): put(S.click(3.0, 0.2), at, 0.4, 0.1)
for base in (13.4, 14.0):
    for k in range(12): put(S.click(2.4, 0.1), base + k * 0.07, 0.3, 0.3)
put(S.pop(0.4), 15.0, 0.6, 0.2)
sh = shimmer(); put(sh[::-1].copy(), 17.9, 0.45, -0.2)
for k in range(6): put(S.pop(0.3), 19.3 + k * 0.09, 0.3, -0.6 + k * 0.15)
put(S.ding(0.3), 21.0, 0.35, 0.2)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.5)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
