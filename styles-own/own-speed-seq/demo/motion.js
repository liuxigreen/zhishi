/** Speed Seq — motion patterns. Playhead + beat-hit are the native moves. */
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const seg = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
export const ease = {
  outCubic: (k) => 1 - Math.pow(1 - clamp(k), 3),
  inOut: (k) => { k = clamp(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; },
  outBack: (k) => { k = clamp(k); const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
};

/** Continuous playhead 0..1 looping at BPM across the demo (OUR improvement: same playhead travels worlds). */
export function playheadAt(t, bpm = 76, beatsPerBar = 4, barsVisible = 4) {
  const beats = t * (bpm / 60);
  const total = beatsPerBar * barsVisible;
  return (beats % total) / total;
}
/** Beat phase 0..1 within one beat; flash envelope when near 0. */
export function beatFlash(t, bpm = 76, width = 0.12) {
  const phase = (t * (bpm / 60)) % 1;
  if (phase < width) return 1 - phase / width;
  if (phase > 1 - width * 0.3) return (phase - (1 - width * 0.3)) / (width * 0.3);
  return 0;
}
/** Which beat index (integer) at time t. */
export function beatIndex(t, bpm = 76) { return Math.floor(t * (bpm / 60)); }

export function popIn(t, at, dur = 0.35) { return ease.outCubic(seg(t, at, at + dur)); }
export function fadeOut(t, at, dur = 0.3) { return 1 - ease.inOut(seg(t, at, at + dur)); }

/** Caption rise. */
export function capRise(t, at, dur = 0.4) {
  const k = ease.outCubic(seg(t, at, at + dur));
  return { a: k, dy: lerp(16, 0, k) };
}
/** Dip through paper/stage void between worlds. */
export function dip(t, at, dur = 0.55) {
  const k = seg(t, at, at + dur);
  if (k <= 0 || k >= 1) return 0;
  return Math.sin(k * Math.PI);
}
/** Metronome swing angle from BPM. */
export function metroSwing(t, bpm = 76, amp = 0.55) {
  return Math.sin(t * (bpm / 60) * Math.PI * 2) * amp;
}
/** Dance pose alternation on beat. */
export function dancePose(t, bpm = 76, a = 'discoL', b = 'discoR') {
  return beatIndex(t, bpm) % 2 === 0 ? a : b;
}
/** Waltz step cycle 3 beats. */
export function waltzStep(t, bpm = 76) {
  const step = beatIndex(t, bpm) % 3;
  return step === 0 ? 'waltzL' : step === 1 ? 'swayR' : 'swayL';
}
