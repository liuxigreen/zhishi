/** motion.js — Lailong silhouette motion language. */
import { ease } from './look.js';
export const clamp = ease.clamp01;
export const seg = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
export const ease2 = { ...ease };

/** M1 SLOW PUSH */
export function slowPush(ctx, t, { fx = 960, fy = 540, rate = 0.01, base = 1 } = {}) {
  const s = base * (1 + rate * t);
  ctx.translate(fx, fy); ctx.scale(s, s); ctx.translate(-fx, -fy);
  return s;
}
/** M2 TEXT RISE */
export function textRise(t, start, i = 0, { dur = 0.5, stagger = 0.18, dist = 14 } = {}) {
  const k = ease.outCubic(seg(t, start + i * stagger, start + i * stagger + dur));
  return { a: k, dy: (1 - k) * dist };
}
/** M3 DualMark ignite */
export function dualMark(t, at, { dur = 0.4 } = {}) { return ease.outCubic(seg(t, at, at + dur)); }
/** M4 FIRE FLICKER — returns scale jitter 0.92..1.08 */
export const fireFlicker = (t, amp = 0.08) => 1 + amp * Math.sin(t * 11.3) * Math.sin(t * 7.1 + 1.2);
/** M5 SMOKE RISE — offset upward */
export const smokeRise = (t, speed = 18) => -((t * speed) % 80);
/** M6 TORCH LADDER — which of N fires are lit (k 0..1) */
export function torchLadder(t, at, n = 4, { dur = 2.4 } = {}) {
  const k = seg(t, at, at + dur);
  const lit = Math.floor(k * n + 1e-6);
  const partial = (k * n) - lit;
  return { lit: Math.min(n, lit), partial, k };
}
/** M7 PATH DRAW */
export const pathDraw = (t, at, dur = 1.6) => ease.inOut(seg(t, at, at + dur));
/** M8 ABSENT PULSE — our native move */
export function absentPulse(t, at, { dur = 1.2 } = {}) {
  const k = ease.outCubic(seg(t, at, at + dur));
  const breathe = 0.85 + 0.15 * Math.sin(Math.max(0, t - at) * 3.2);
  return { k, breathe: k > 0 ? breathe : 0 };
}
/** M9 POSTURE */
export const POSES = {
  neutral: { tilt: 0, drop: 0, lean: 0, armL: 0, armR: 0 },
  look: { tilt: 0.12, drop: 0, lean: 0.08, armL: 0, armR: 0.2 },
  offer: { tilt: 0.05, drop: 0, lean: 0.1, armL: 0, armR: 0.85 },
  bow: { tilt: -0.2, drop: 0.45, lean: 0.05, armL: -0.2, armR: -0.2 },
  alarm: { tilt: 0.18, drop: 0, lean: -0.1, armL: 0.5, armR: 0.7 },
  absent: { tilt: -0.08, drop: 0.25, lean: 0, armL: 0, armR: 0.15 },
};
export function pose(a, b, k) {
  const A = POSES[a] || POSES.neutral, B = POSES[b] || POSES.neutral;
  const o = {};
  for (const key of Object.keys(A)) o[key] = A[key] + (B[key] - A[key]) * k;
  return o;
}
/** T1 DIP BROWN */
export const dipBrown = (t, at, half = 0.35) => {
  const d = Math.abs(t - at);
  return d > half ? 0 : 1 - d / half;
};
/** T2 FIRE BLOOM WIPE */
export function fireBloom(ctx, t, at, { x = 960, y = 540, dur = 0.7 } = {}) {
  const k = seg(t, at - dur / 2, at + dur / 2);
  if (k <= 0 || k >= 1) return;
  const a = Math.sin(k * Math.PI);
  const g = ctx.createRadialGradient(x, y, 0, x, y, 260 + a * 1400);
  g.addColorStop(0, `rgba(255,160,60,${0.8 * a})`);
  g.addColorStop(0.35, `rgba(224,184,90,${0.3 * a})`);
  g.addColorStop(1, 'rgba(16,12,9,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
}
