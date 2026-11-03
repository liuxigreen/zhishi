/** motion.js — Academy Spot named patterns. */
import { clamp, lerp } from './look.js';

export const ease = {
  out: (t) => 1 - Math.pow(1 - clamp(t), 3),
  in: (t) => Math.pow(clamp(t), 3),
  io: (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  back: (t) => { t = clamp(t); const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
export const seg = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));

/** M1 slowPush — 1% scale over hold */
export function slowPush(t, a, b) { return 1 + 0.012 * ease.io(seg(t, a, b)); }
/** M2 textRise */
export function textRise(t, a, dur = 0.45) { const k = ease.out(seg(t, a, a + dur)); return { a: k, dy: (1 - k) * 16 }; }
/** M3 breathe */
export function breathe(t, period = 4) { return Math.sin((t / period) * Math.PI * 2) * 0.006; }
/** M4 orbitSpin */
export function orbitSpin(t, speed = 0.25) { return t * speed; }
/** M5 blueprintMorph — solid→blueprint: solid fades, dash draws on */
export function blueprintMorph(t, a, dur = 1.2) {
  const u = seg(t, a, a + dur);
  return { solid: 1 - ease.io(u), blueprint: ease.out(clamp((u - 0.15) / 0.85)), glow: ease.io(clamp((u - 0.3) / 0.5)) };
}
/** M6 scaleTip — balance tip toward quality */
export function scaleTip(t, a, dur = 1.4, to = 0.22) { return lerp(0, to, ease.io(seg(t, a, a + dur))); }
/** M7 ringIgnite — concentric rings pop outer→inner */
export function ringIgnite(t, a, dur = 1.0) { return ease.out(seg(t, a, a + dur)); }
/** M8 keyWind — wind-up key rotation */
export function keyWind(t, speed = 2.2) { return t * speed; }
/** M9 dipDark — world change through void */
export function dipDark(t, a, b) {
  const mid = (a + b) / 2; const half = (b - a) / 2;
  if (t < a || t > b) return 0;
  return t < mid ? ease.in((t - a) / half) : ease.out(1 - (t - mid) / half);
}
/** M10 captionIn */
export function captionIn(t, a, b) {
  const enter = ease.out(seg(t, a, a + 0.4));
  const hold = 1 - seg(t, b - 0.25, b);
  return enter * hold;
}
/** M11 walkCycle */
export function walkCycle(t, speed = 3) { return t * speed; }
/** M12 popIn */
export function popIn(t, a, dur = 0.35) { return ease.back(seg(t, a, a + dur)); }
