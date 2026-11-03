/** motion.js — Void Neon motion language. */
import { ease } from './look.js';
export const clamp = ease.clamp01;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease2 = {
  ...ease,
  inCubic: x => x * x * x,
  outQuint: x => 1 - Math.pow(1 - x, 5),
  anticip: (x, amt = 0.12) => x < 0.25 ? -amt * Math.sin(x / 0.25 * Math.PI / 2) : -amt + (1 + amt) * ease.outCubic((x - 0.25) / 0.75),
  settle: (x, f = 3, d = 5) => 1 - Math.exp(-d * x) * Math.cos(f * Math.PI * x),
};

/** M1 SLOW PUSH */
export function slowPush(ctx, t, { fx = 960, fy = 540, rate = 0.012, base = 1 } = {}) {
  const s = base * (1 + rate * t);
  ctx.translate(fx, fy); ctx.scale(s, s); ctx.translate(-fx, -fy);
  return s;
}
/** M2 TEXT RISE */
export function textRise(t, start, i = 0, { dur = 0.5, stagger = 0.18, dist = 16 } = {}) {
  const k = ease.outCubic(seg(t, start + i * stagger, start + i * stagger + dur));
  return { a: k, dy: (1 - k) * dist };
}
/** M3 KEY IGNITE — white→magenta */
export function keyIgnite(t, at, { dur = 0.45 } = {}) { return ease.outCubic(seg(t, at, at + dur)); }
/** M4 WIRE DRAW-ON */
export const wireDraw = (t, at, dur = 0.9) => ease.inOut(seg(t, at, at + dur));
/** M5 BREATHE */
export const breathe = (t, amp = 0.008, per = 3.6) => 1 + amp * Math.sin(t * Math.PI * 2 / per);
/** M6 ORB PULSE — soft halo breathe for ? / nodes */
export const orbPulse = (t, amp = 0.15) => 0.85 + amp * Math.sin(t * 2.2);
/** M7 INSIGHT FLASH — our native move: cascade k 0..1 through graph */
export function insightFlash(t, at, { dur = 1.1 } = {}) {
  const k = ease.outCubic(seg(t, at, at + dur));
  const fl = seg(t, at + 0.15, at + 0.45);
  return { k, flash: fl > 0 && fl < 1 ? Math.sin(fl * Math.PI) : (k > 0.2 ? 0.15 : 0) };
}
/** M8 LABEL SNAP */
export const labelSnap = (t, at, i = 0, gap = 0.3) => seg(t, at + i * gap, at + i * gap + 0.35);
/** M9 POSTURE */
export const POSES = {
  neutral: { tilt: 0, drop: 0, lean: 0 },
  curious: { tilt: 0.12, drop: 0, lean: 0.1 },
  stuck: { tilt: -0.1, drop: 0.4, lean: -0.1 },
  flash: { tilt: 0.18, drop: 0, lean: 0.15 },
};
export function pose(a, b, k) {
  const A = POSES[a], B = POSES[b];
  return { tilt: A.tilt + (B.tilt - A.tilt) * k, drop: A.drop + (B.drop - A.drop) * k, lean: A.lean + (B.lean - A.lean) * k };
}
/** T1 DIP VOID */
export const dipVoid = (t, at, half = 0.35) => {
  const d = Math.abs(t - at);
  return d > half ? 0 : 1 - d / half;
};
/** T2 MAGENTA BLOOM WIPE */
export function bloomWipe(ctx, t, at, { x = 960, y = 540, dur = 0.7 } = {}) {
  const k = seg(t, at - dur / 2, at + dur / 2);
  if (k <= 0 || k >= 1) return;
  const a = Math.sin(k * Math.PI);
  const g = ctx.createRadialGradient(x, y, 0, x, y, 280 + a * 1500);
  g.addColorStop(0, `rgba(232,122,176,${0.85 * a})`);
  g.addColorStop(0.4, `rgba(126,200,232,${0.25 * a})`);
  g.addColorStop(1, 'rgba(3,1,8,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
}
/** T3 MATCH NODE — circle→circle */
export const matchScale = (k, r0, r1) => r0 + (r1 - r0) * ease.inOut(clamp(k));
