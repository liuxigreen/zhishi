/** motion.js — Bite Red Queen motion language. */
import { ease } from './look.js';
export const clamp = ease.clamp01;
export const seg = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));

export function slowPush(ctx, t, { fx = 960, fy = 540, rate = 0.01, base = 1 } = {}) {
  const s = base * (1 + rate * t);
  ctx.translate(fx, fy); ctx.scale(s, s); ctx.translate(-fx, -fy);
  return s;
}
export function textRise(t, start, i = 0, { dur = 0.5, stagger = 0.18, dist = 14 } = {}) {
  const k = ease.outCubic(seg(t, start + i * stagger, start + i * stagger + dur));
  return { a: k, dy: (1 - k) * dist };
}
export function dualMark(t, at, { dur = 0.4 } = {}) { return ease.outCubic(seg(t, at, at + dur)); }

/** Runner stride cycle — returns pose offsets */
export function stride(t, bpm = 160) {
  const ph = (t * bpm / 60) % 1;
  const swing = Math.sin(ph * Math.PI * 2);
  return {
    lean: 0.7 + 0.15 * Math.abs(swing),
    liftL: swing,
    liftR: -swing,
    armSwing: swing,
    glow: 0.9 + 0.1 * Math.abs(swing),
  };
}

/** Gap lock pulse — bar breathes while value stays 0 */
export function gapLockPulse(t, at, { dur = 1.2 } = {}) {
  const k = ease.outCubic(seg(t, at, at + dur));
  const breathe = 0.9 + 0.1 * Math.sin(Math.max(0, t - at) * 4.2);
  return { k, breathe };
}

/** Direction fork — leave track vector draws */
export function forkDraw(t, at, { dur = 1.8 } = {}) {
  return ease.inOut(seg(t, at, at + dur));
}

/** Multiplier climb 1.00 → target */
export function multClimb(t, at, target = 1.3, { dur = 2.4 } = {}) {
  const k = ease.inOut(seg(t, at, at + dur));
  return 1 + (target - 1) * k;
}

export function dipBlack(t, at, { dur = 0.35 } = {}) {
  const d = Math.abs(t - at);
  if (d > dur) return 0;
  return 1 - d / dur;
}

export function redBloom(ctx, t, at, { x = 960, y = 540, r = 420 } = {}) {
  const k = 1 - Math.min(1, Math.abs(t - at) / 0.45);
  if (k <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(226,59,59,${0.35 * k})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
}

export { POSES } from './people.js';
