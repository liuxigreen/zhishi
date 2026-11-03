/** motion.js — Tao Ink motion vocabulary. Source 4550 is 11 static boards + hard cuts; these are OUR additions
 * (CHANGES row "improvement"): ink-bloom transitions and brush write-on, kept slow and calm (道 = no jitter). */
import { P, W, H, clamp, lerp, rng, seal, splatter, caption } from './look.js';
import { inkBloom } from './props.js';
import { blendPose } from './people.js';
export const ease = { out: t => 1 - Math.pow(1 - clamp(t), 3), in: t => Math.pow(clamp(t), 3), io: t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  back: t => { t = clamp(t); const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };
export const seg = (t, a, b) => clamp((t - a) / (b - a));
/* M1 inkBloomWipe — a spreading ink blot (or paper blot) covers the frame; draw the next world inside it.
 * usage: M.bloomWipe(ctx, k, x, y, drawNext, {color}) — drawNext paints full-frame and is clipped to the blot. */
export function bloomWipe(ctx, k, x, y, drawNext, { seed = 4, color = P.ink, rim = true } = {}) {
  if (k <= 0) return; if (k >= 1) { drawNext(); return; }
  const R = Math.hypot(W, H) * 1.1 * Math.pow(clamp(k), 1.7);
  const m = document.createElement('canvas'); m.width = W; m.height = H; const mx = m.getContext('2d'); inkBloom(mx, x, y, R, 1, { seed, color: '#000' });
  const n = document.createElement('canvas'); n.width = W; n.height = H; const nx = n.getContext('2d'); const save = ctx; drawNext(nx); nx.globalCompositeOperation = 'destination-in'; nx.drawImage(m, 0, 0);
  if (rim) { ctx.save(); ctx.globalAlpha = 0.22; ctx.filter = 'blur(18px)'; inkBloom(ctx, x, y, R * 1.06 + 60, 1, { seed, color }); ctx.globalAlpha = 0.55; ctx.filter = 'blur(5px)'; inkBloom(ctx, x, y, R * 1.02 + 18, 1, { seed, color }); ctx.filter = 'none'; ctx.globalAlpha = 0.9; inkBloom(ctx, x, y, R + 5, 1, { seed, color }); ctx.restore(); }
  ctx.drawImage(n, 0, 0);
}
/* M3 sealStamp — press from 1.5× with a tilt, land at k≈0.55 with a 2-frame squash + faint red halo ring. */
export function sealStamp(ctx, x, y, s, ch, k, opt = {}) { if (k <= 0) return; const land = 0.55; const kk = clamp(k / land);
  const sc = k < land ? lerp(1.5, 1, ease.in(kk)) : 1 + Math.sin(clamp((k - land) / 0.2) * Math.PI) * -0.06; const rot = (opt.rot || -0.08) * (1 - ease.out(kk));
  ctx.save(); ctx.globalAlpha = k < land ? 0.4 + 0.6 * kk : 1;
  if (k >= land) { const r = clamp((k - land) / 0.45); ctx.strokeStyle = `rgba(171,34,41,${0.35 * (1 - r)})`; ctx.lineWidth = 4; ctx.strokeRect(x - s / 2 * (1 + r * 0.5), y - s / 2 * (1 + r * 0.5), s * (1 + r * 0.5), s * (1 + r * 0.5)); }
  ctx.translate(x, y); ctx.scale(sc, sc); seal(ctx, 0, 0, s, ch, { ...opt, rot }); ctx.restore(); }
/* M4 splatBurst — splatter that flies out over ~0.4 s then stays */
export const splatBurst = (ctx, x, y, R, k, opt = {}) => splatter(ctx, x, y, R, { ...opt, k: ease.out(k) });
/* M5 settle — murk 1→0 with a slow tail (water clears); returns murk */
export const settle = (t, a, b) => 1 - ease.io(seg(t, a, b));
/* M6 follow — drive a prop along the head of a dashedPath result; returns eased draw progress */
export const follow = (t, a, b) => ease.io(seg(t, a, b));
/* M7 poseAt — keyframed pose track [[t, pose], ...] with eased blends */
export function poseAt(track, t) { if (t <= track[0][0]) return blendPose(track[0][1], track[0][1], 0); for (let i = 1; i < track.length; i++) if (t <= track[i][0]) { const [t0, p0] = track[i - 1], [t1, p1] = track[i]; return blendPose(p0, p1, ease.io((t - t0) / (t1 - t0))); } const l = track[track.length - 1][1]; return blendPose(l, l, 0); }
/* M8 counterAt — integer counter that ticks with a short drop-in per change; returns {n, drop} */
export function counterAt(t, a, b, n0, n1) { const f = seg(t, a, b), v = lerp(n0, n1, f), n = Math.floor(v + 1e-6); return { n, drop: 1 - (v - n) }; }
/* M9 sway — slow pine sway (period 4–6 s), never faster */
export const sway = (t, ph = 0) => Math.sin(t * 1.3 + ph) * 0.6 + Math.sin(t * 0.7 + ph * 2) * 0.4;
/* M10 captionIn — ink fades in from a 6 px blur and 14 px below; red words land 0.25 s later (keeps text static for readcheck) */
export function captionIn(ctx, segs, t, t0, t1, opt = {}) { const a = ease.out(seg(t, t0, t0 + 0.45)) * (1 - ease.in(seg(t, t1 - 0.3, t1))); if (a <= 0) return;
  const ar = ease.out(seg(t, t0 + 0.25, t0 + 0.7)) * (1 - ease.in(seg(t, t1 - 0.3, t1)));
  const lines = Array.isArray(segs[0]) ? segs : [segs]; const base = lines.map(l => l.map(g => ({ t: g.t, red: false, ghost: g.red })));
  caption(ctx, base.map(l => l.map(g => g.ghost ? { t: g.t, red: false } : g)), { ...opt, a: a, dy: (1 - a) * 14, blur: (1 - a) * 6, mask: true });
  // overdraw red words: draw only red segments in place
  ctx.save(); ctx.globalAlpha = 1; caption(ctx, lines.map(l => l.map(g => ({ t: g.t, red: g.red, hide: !g.red }))), { ...opt, a: ar, redOnly: true }); ctx.restore(); }
/* M11 gleam — 0..1 sweep for cleaver({gleam}) */
export const gleam = (t, a, d = 0.6) => (t < a || t > a + d) ? -1 : (t - a) / d;
