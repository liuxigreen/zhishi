"""Score for 「史上第一次罢工」 (own-egypt-papyrus demo, 24 s). All synthesized in code, no voice.
D Hijaz mode (D Eb F# G A Bb C) on a plucked harp (Karplus-Strong) over a low drone; frame-drum pulse at 92 BPM.
SFX on picture events: chisel taps every 0.55 s (W1), papyrus-unroll swishes 5.4/11.4/17.4/18.5, granary empties (low
sand pour 6.6–8.6), day tally ticks (18 ticks 7.6–9.6), march drum W3 12.2–15, crowd shout 15.3, cheer 20.6, ankh ding 22.2.
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
rng = np.random.default_rng(7)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = np.asarray(x)[: max(0, N - i)]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(x), 0] += x * g * l; mix[i:i + len(x), 1] += x * g * r
def harp(m, d=2.2, v=0.6):
    f = mtof(m); L = int(SR / f); buf = rng.uniform(-1, 1, L) * v; out = np.zeros(int(SR * d))
    for i in range(len(out)):
        j = i % L; out[i] = buf[j]; buf[j] = 0.997 * 0.5 * (buf[j] + buf[(j + 1) % L])
    return S.lp(out, 4200)
def drone(m, d):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(m) * k * t) / k ** 1.4 for k in (1, 2, 3, 4))
    return S.lp(x, 700) * np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / 1.0) * 0.22
put(drone(38, 24), 0, 1.0); put(drone(45, 24), 0, 0.35)
beat = 60 / 92
for i in range(int(24 / beat)):
    at = i * beat
    if at > 23.4: break
    put(S.thump(0.5, 70 if i % 4 == 0 else 95), at, 0.42 if i % 4 == 0 else 0.22, -0.1)
HJ = [62, 63, 66, 67, 69, 70, 72, 74, 75, 78]          # D Eb F# G A Bb C D Eb F#
mel = [0, 1, 2, 1, 0, None, 4, 3, 2, 1, 2, None, 4, 5, 4, 3, 2, 1, 0, None, 2, 3, 4, 7, 6, 4, 2, 3, 4, None, 7, 9, 7, 6, 7]
for i, n in enumerate(mel):
    if n is None: continue
    at = 0.3 + i * beat * 0.75
    if at > 23: break
    put(harp(HJ[n], 2.0, 0.5), at, 0.5, 0.2)
c = 0.55
while c < 5.4:
    put(S.click(0.9, 0.6), c, 0.5, 0.25); put(S.clack(0.5, 0.9), c, 0.25, 0.25); c += 0.55
for at in (5.4, 11.4, 17.4, 18.5): put(S.lp(S.bp(S.noise(0.7), 600, 3500) * np.sin(np.linspace(0, np.pi, int(SR * 0.7))) ** 2, 4000), at, 0.45, -0.2)
put(S.bp(S.noise(2.0), 300, 2500) * np.minimum(1, tt(2.0) / 0.2) * np.minimum(1, (2.0 - tt(2.0)) / 0.5) * 0.35, 6.6, 0.6)
put(S.thump(0.9, 50), 8.6, 0.6)
for k in range(18): put(S.click(0.5, 0.5), 7.6 + (k + 1) * 2.0 / 18, 0.45, 0.3)
for k in range(8): put(S.thump(0.4, 80), 12.2 + k * 0.4, 0.35)
crowd = sum(S.bp(S.noise(1.4), 250 + 90 * j, 1400 + 120 * j) for j in range(4)) * np.exp(-tt(1.4) * 1.5) * np.minimum(1, tt(1.4) / 0.05) * 0.5
put(crowd, 15.3, 0.9); put(S.thump(0.8, 60), 15.3, 0.6)
put(crowd * 0.8, 20.6, 0.7)
t = tt(2.5); f = mtof(86); put((np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 2) * .5, 22.2, 0.4, 0.2)
fade = np.minimum(1, (DUR - np.arange(N) / SR) / 1.5)[:, None]
mix *= fade
mix = mix / max(1e-6, np.abs(mix).max()) * 0.8
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
with wave.open(os.path.join(ROOT, 'out', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('mix.wav ok')
