/** motion.js — Dark Gold Line motion language (named patterns). STYLE.md §6 lists when to use each.
 * Measured in source: halo ORB motion = 71% static / 22% slow push / 7% cut; avg push ≈ 1.5%/s;
 * text lines enter as soft fade-rise ~0.5 s; key word lights gold after the line lands (+0.3 s);
 * ring ignites as an arc draw-on ~0.8 s with a flash; crowds breathe/sway ≤2°.
 */
import { ease } from './look.js';
export const clamp = ease.clamp01;
export const seg = (t, a, b) => clamp((t - a) / (b - a));          // 0..1 inside [a,b]
export const ease2 = {
  ...ease,
  inCubic: x => x * x * x,
  outQuint: x => 1 - Math.pow(1 - x, 5),
  // anticipation: dip back by `amt` then go forward (Disney principle #2)
  anticip: (x, amt = 0.12) => x < 0.25 ? -amt * Math.sin(x / 0.25 * Math.PI / 2) : -amt + (1 + amt) * ease.outCubic((x - 0.25) / 0.75),
  // settle with damped overshoot (secondary motion)
  settle: (x, f = 3, d = 5) => 1 - Math.exp(-d * x) * Math.cos(f * Math.PI * x),
};

/** M1 SLOW PUSH — camera dolly toward a focus point. Use for every hold > 2 s. */
export function slowPush(ctx, t, { fx = 960, fy = 540, rate = 0.015, base = 1 } = {}) {
  const s = base * (1 + rate * t);
  ctx.translate(fx, fy); ctx.scale(s, s); ctx.translate(-fx, -fy);
  return s;
}

/** M2 TEXT RISE — line fades up 18 px with 0.5 s outCubic; per-line stagger 0.18 s. Returns {a, dy}. */
export function textRise(t, start, i = 0, { dur = 0.5, stagger = 0.18, dist = 18 } = {}) {
  const k = ease.outCubic(seg(t, start + i * stagger, start + i * stagger + dur));
  return { a: k, dy: (1 - k) * dist };
}

/** M3 KEY-WORD IGNITE — after the line lands, the key word goes white→gold with bloom 0→24. */
export function keyIgnite(t, at, { dur = 0.45 } = {}) { return ease.outCubic(seg(t, at, at + dur)); }

/** M4 RING IGNITE — arc draw-on 0.8 s + 0.25 s flash. Returns {k, flash}. */
export function ringIgnite(t, at) {
  const k = ease.inOut(seg(t, at, at + 0.8));
  const fl = seg(t, at + 0.75, at + 1.0);
  return { k, flash: fl > 0 && fl < 1 ? Math.sin(fl * Math.PI) : 0 };
}

/** M5 BREATHE — idle life for heroes: 0.6% scale, 4 s period. Never fully still. */
export const breathe = (t, amp = 0.006, per = 4) => 1 + amp * Math.sin(t * Math.PI * 2 / per);

/** M6 LIFT REVEAL — anticipation dip then rise (cloche, lid, curtain). */
export const liftReveal = (t, at, dur = 1.1) => ease2.anticip(seg(t, at, at + dur), 0.06);

/** M7 LABEL SNAP — tag pops with outBack + thread draws; stagger 0.35 s. */
export const labelSnap = (t, at, i = 0, gap = 0.35) => seg(t, at + i * gap, at + i * gap + 0.4);

/** M8 CROWD SWAY — secondary motion for extras: ±2° head tilt, phase per index. */
export const sway = (t, i, amp = 0.035) => amp * Math.sin(t * 0.9 + i * 1.7);

/** M9 POSTURE BLEND — emotion is acted by posture; blend between named poses. */
export const POSES = {
  neutral: { tilt: 0, drop: 0, lean: 0 },
  hopeful: { tilt: 0.10, drop: 0, lean: 0.1 },     // chin up
  enchanted: { tilt: 0.16, drop: 0, lean: 0.2 },   // looks up into the light
  doubt: { tilt: -0.14, drop: 0.5, lean: -0.15 },   // chin down, shoulders sink
  ashamed: { tilt: -0.22, drop: 1.0, lean: -0.3 },
};
export function pose(a, b, k) {
  const A = POSES[a], B = POSES[b];
  return { tilt: A.tilt + (B.tilt - A.tilt) * k, drop: A.drop + (B.drop - A.drop) * k, lean: A.lean + (B.lean - A.lean) * k };
}

/** T1 DIP-THROUGH-VOID — transition: 0.35 s to black, 0.35 s up. Returns overlay alpha. */
export const dipVoid = (t, at, half = 0.35) => {
  const d = Math.abs(t - at);
  return d > half ? 0 : 1 - d / half;
};

/** T2 LIGHT BLOOM WIPE — the shot's light source flares to fill frame, next shot appears from it. */
export function bloomWipe(ctx, t, at, { x = 960, y = 540, dur = 0.7 } = {}) {
  const k = seg(t, at - dur / 2, at + dur / 2);
  if (k <= 0 || k >= 1) return;
  const a = Math.sin(k * Math.PI);
  const g = ctx.createRadialGradient(x, y, 0, x, y, 300 + a * 1600);
  g.addColorStop(0, `rgba(255,232,180,${0.9 * a})`);
  g.addColorStop(1, 'rgba(255,232,180,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
}

/** T3 MATCH SCALE — the circle in shot A becomes a circle in shot B (ring → clock → dial). k 0..1 */
export const matchScale = (k, r0, r1) => r0 + (r1 - r0) * ease.inOut(clamp(k));
