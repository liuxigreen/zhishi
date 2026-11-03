"""Score for 「生日悖论」 (own-murphy-panel demo, 24 s). All synthesized in code, no voice.
Warm lounge loop in F major at 84 BPM: soft electric-piano chords (Fmaj7 Dm7 Gm7 C7), plucked upright bass, brushed hats.
SFX on picture events: 23 guest drop-in plinks (0.35+i*0.165 +0.3), glyph blocks thunk+hum 6.7/7.05, ✗ stamp 9.9,
pair-line shimmer ticks 13.3–16.6, checklist ticks 10.4/16.9/20.4/22.6, 23 calendar plinks 18.3–20.0, collision bell 20.0,
gauge rise sweep 18.6–20.8, title chord 20.55, lights-dip thumps 6/13/18.
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
rng = np.random.default_rng(11)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = np.asarray(x)[: max(0, N - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r
def ep(m, d=1.6, v=0.5):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * t) * np.exp(-t * 6)) + 0.18 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t * 9)
    return x * np.exp(-t * 1.6) * np.minimum(1, t / 0.006) * v
def bass(m, d=0.9, v=0.7):
    f = mtof(m); L = int(SR / f); buf = rng.uniform(-1, 1, L) * v; out = np.zeros(int(SR * d))
    for i in range(len(out)):
        j = i % L; out[i] = buf[j]; buf[j] = 0.994 * 0.5 * (buf[j] + buf[(j + 1) % L])
    return S.lp(out, 900)
def bell(m, d=1.6, v=0.5):
    t = tt(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t)) * np.exp(-t * 3) * v
beat = 60 / 84
CH = [([53, 57, 60, 64], 41), ([50, 53, 57, 60], 38), ([55, 58, 62, 65], 43), ([52, 55, 58, 60], 36)]   # Fmaj7 Dm7 Gm7 C7
bar = 4 * beat
for b in range(int(24 / bar) + 1):
    at0 = b * bar
    if at0 > 23.2: break
    notes, root = CH[b % 4]
    for k, n in enumerate(notes): put(ep(n, 2.4, 0.22), at0 + k * 0.012, 0.6, -0.15 + 0.1 * k)
    for k, n in enumerate(notes[1:]): put(ep(n, 1.2, 0.14), at0 + 2.5 * beat, 0.5, 0.15)
    put(bass(root, 1.0), at0, 0.7); put(bass(root + 7, 0.8), at0 + 2 * beat, 0.55)
for i in range(int(24 / (beat / 2))):
    at = i * beat / 2
    if at > 23.3: break
    h = S.bp(S.noise(0.12), 5000, 12000) * np.exp(-tt(0.12) * 35)
    put(h, at, 0.10 if i % 2 else 0.05, 0.35)
SC = [65, 67, 69, 72, 74, 77, 79, 81]
for i in range(23):
    put(bell(SC[i % 8] + 12 * (i // 16), 0.5, 0.25), 0.35 + i * 0.165 + 0.3, 0.35, -0.5 + i / 23)
for at in (6.0, 13.0, 18.0): put(S.thump(0.7, 55), at, 0.55); put(S.lp(S.noise(0.5) * np.exp(-tt(0.5) * 8), 800), at, 0.2)
for at in (6.7, 7.05):
    put(S.thump(0.5, 90), at, 0.5); t = tt(1.4); put(np.sin(2 * np.pi * 110 * t) * np.minimum(1, t / 0.3) * np.exp(-t * 1.5) * 0.25, at + 0.1, 0.6)
put(S.thump(0.6, 70), 9.9, 0.7); put(S.clack(0.8, 0.7), 9.9, 0.5)
for at in (10.4, 16.9, 20.4, 22.6): put(S.click(0.8, 0.6), at, 0.5, -0.4); put(bell(84, 0.4, 0.2), at + 0.02, 0.25, -0.4)
n = 0; at = 13.3
while at < 15.8:
    put(bell(SC[n % 8] + 12, 0.35, 0.12), at, 0.3, 0.4 * np.sin(n)); at += 0.15; n += 1
for i in range(23): put(S.click(0.5, 0.5), 18.3 + i * 1.7 / 23, 0.35, 0.2)
put(bell(77, 2.2, 0.5), 20.0, 0.55); put(bell(84, 2.0, 0.4), 20.05, 0.35)
t = tt(0.9); f = 200 + 500 * (t / 0.9) ** 1.5
put(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.1) * 0.25, 18.6, 0.5, 0.3)
for k, nn in enumerate([53, 60, 64, 69, 72]): put(ep(nn, 2.2, 0.3), 20.55 + k * 0.03, 0.6)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.2)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
