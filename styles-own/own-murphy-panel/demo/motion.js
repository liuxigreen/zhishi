/** motion.js — own-murphy-panel patterns. The source keeps the camera locked and changes STATE: things light up, drop in,
 * draw on, count up, tick off. Every pattern here is a pure function of t (no state), so any frame renders alone. */
import { clamp, lerp } from './look.js';
export const seg01 = (t, a, b) => clamp((t - a) / (b - a));
export const ease = { io: k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, out: k => 1 - Math.pow(1 - k, 3), in: k => k * k * k,
  back: k => { const s = 1.70158; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2); } };
/** M1 dropIn — a prop/peg falls from above onto its spot with one small bounce + squash. returns {dy (world units up), squash, a} */
export function dropIn(t, t0, { h = 120, dur = 0.42 } = {}) { const k = seg01(t, t0, t0 + dur); if (t < t0) return { dy: h, squash: 0, a: 0 };
  if (k < 0.7) { const q = k / 0.7; return { dy: h * (1 - q * q), squash: -0.06 * q, a: clamp(q * 3) }; } const q = (k - 0.7) / 0.3; return { dy: 10 * Math.sin(q * Math.PI) * (1 - q), squash: 0.12 * Math.sin(q * Math.PI) * (1 - q * 0.5), a: 1 }; }
/** M2 blockLight — a glyph block warms up: flicker then steady glow 0..1 */
export function blockLight(t, t0, dur = 0.6) { if (t < t0) return 0; const k = seg01(t, t0, t0 + dur); const fl = k < 1 ? (Math.sin(k * 40) > 0.3 ? 1 : 0.35) : 1; return clamp(ease.out(k) * fl); }
/** M3 countUp — integer counter with a pop on each change: {n, frac, pop} */
export function countUp(t, t0, t1, a, b, e = ease.io) { const k = e(seg01(t, t0, t1)); const v = lerp(a, b, k); const n = Math.floor(v + 1e-6); const f = v - n; return { n, v, frac: f, pop: 1 + 0.12 * Math.max(0, 1 - f * 5) * (t > t0 && t < t1 + 0.1 ? 1 : 0) }; }
/** M4 lineDraw — a set of N lines drawn on one after another between t0..t1; returns k for line i */
export function lineDraw(t, t0, t1, N, i, each = 0.25) { const span = t1 - t0 - each; const s = t0 + span * (N > 1 ? i / (N - 1) : 0); return ease.out(seg01(t, s, s + each)); }
/** M5 checkTick — HUD item goes current → done with a stroke-on tick; returns {state, k} */
export function checkTick(t, tCur, tDone) { if (t < tCur) return { state: 0, k: 0 }; if (t < tDone) return { state: 1, k: 0 }; return { state: 2, k: ease.out(seg01(t, tDone, tDone + 0.35)) }; }
/** M6 gaugeRise — overshoot-free rise to a target with a settling wobble */
export function gaugeRise(t, t0, t1, to) { const k = ease.io(seg01(t, t0, t1)); return to * k + (t > t1 ? 0.006 * Math.sin((t - t1) * 14) * Math.exp(-(t - t1) * 3) : 0); }
/** M7 pegWalk — peg people waddle (no legs): travel + side tilt + bob. returns {x, tilt, bob} */
export function pegWalk(t, t0, t1, x0, x1, { period = 0.42 } = {}) { const k = seg01(t, t0, t1), moving = t > t0 && t < t1; const ph = (t - t0) / period * Math.PI * 2;
  return { x: lerp(x0, x1, ease.io(k)), tilt: moving ? Math.sin(ph) * 0.09 : 0, bob: moving ? Math.abs(Math.sin(ph)) * 0.035 : 0 }; }
/** M8 hop — a single excited hop (used for "that's me!" moments) */
export function hop(t, t0, dur = 0.45) { const k = seg01(t, t0, t0 + dur); return k > 0 && k < 1 ? Math.sin(k * Math.PI) * 0.7 : 0; }
/** M9 rackFocus — blur radius (px) for a layer as focus pulls from layer A to B over t0..t1 */
export function rackFocus(t, t0, t1, from, to) { return lerp(from, to, ease.io(seg01(t, t0, t1))); }
/** M10 lightsDip — room dims out and relights between worlds (replaces the hard cut): returns room brightness 0..1 */
export function lightsDip(t, tc, half = 0.32) { const d = Math.abs(t - tc); if (d > half) return 1; const k = d / half; return 0.12 + 0.88 * k * k * (k < 0.5 && t > tc ? (Math.sin(t * 60) > 0 ? 1 : 0.6) : 1); }
/** M11 captionIn — 0.25 s fade + 10 px rise */
export function captionIn(t, t0) { const k = ease.out(seg01(t, t0, t0 + 0.25)); return { a: k, dy: (1 - k) * 10 }; }
/** M12 stampIn — a mark (✗ / number) slams in from 1.6× with a small rotation */
export function stampIn(t, t0, dur = 0.28) { if (t < t0) return { a: 0, s: 1.6, r: 0 }; const k = ease.out(seg01(t, t0, t0 + dur)); return { a: clamp(k * 1.6), s: lerp(1.6, 1, k), r: lerp(-0.18, -0.06, k) }; }
