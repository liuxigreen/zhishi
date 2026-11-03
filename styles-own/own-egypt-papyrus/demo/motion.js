/* own-egypt-papyrus · motion patterns. The source (4352) is mostly held boards with cuts; we keep its calm
 * (no camera shake except the one shout) but add jointed figure motion + a papyrus-unroll scene change. */
import { clamp, lerp, P, LW, rgba } from './look.js';
import { blendPose, walkPose, POSES } from './people.js';
export const ease = { io: (k) => k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2, out: (k) => 1 - (1 - k) ** 3, back: (k) => { const c = 1.7; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; } };
export const seg01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

/* M1 · scrollWipe: next world unrolls left→right like papyrus; a rolled cylinder rides the edge. k 0..1 */
export function scrollWipe(ctx, k, drawNew, { W = 1440, y0 = 48, y1 = 1028 } = {}) { if (k <= 0) return; const e = ease.io(clamp(k, 0, 1)); const x = e * (W + 60) - 30;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Math.max(0, x), ctx.canvas.height); ctx.clip(); drawNew(); ctx.restore();
  if (k < 1) { ctx.save(); ctx.fillStyle = 'rgba(40,20,5,0.3)'; ctx.fillRect(x - 6, y0, 40, y1 - y0); const g = ctx.createLinearGradient(x - 28, 0, x + 28, 0); g.addColorStop(0, '#C9AE74'); g.addColorStop(0.45, '#F2E2B4'); g.addColorStop(1, '#A88A50'); ctx.fillStyle = g; ctx.strokeStyle = P.line; ctx.lineWidth = LW; ctx.fillRect(x - 26, y0, 52, y1 - y0); ctx.strokeRect(x - 26, y0, 52, y1 - y0);
    ctx.strokeStyle = rgba(P.line, 0.35); ctx.lineWidth = 1.5; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 18 + i * 12, y0); ctx.lineTo(x - 18 + i * 12, y1); ctx.stroke(); } ctx.restore(); } }

/* M2 · captionIn: card slides up (k) then each line rises 14 px + fades; returns {a, dy} for captionText */
export function captionIn(t, t0, { dur = 0.45 } = {}) { const k = ease.out(seg01(t, t0, t0 + dur)); return { a: k, dy: (1 - k) * 14 }; }

/* M3 · poseAt: keyframed pose track [[t, pose], …] → smoothly blended pose */
export function poseAt(track, t) { if (t <= track[0][0]) return P0(track[0][1]); for (let i = 0; i < track.length - 1; i++) { const [ta, pa] = track[i], [tb, pb] = track[i + 1]; if (t < tb) return blendPose(P0(pa), P0(pb), ease.io((t - ta) / (tb - ta))); } return P0(track[track.length - 1][1]); }
const P0 = (p) => typeof p === 'string' ? POSES[p] : p;

/* M4 · walk: stride cycle + travel; returns {pose, x} (ph cycles every `period` s) */
export function walk(t, { x0 = 0, speed = 120, period = 0.9 } = {}) { const ph = (t / period) % 1; return { pose: walkPose(ph), x: x0 + speed * t, bob: Math.abs(Math.sin(ph * Math.PI * 2)) * 3 }; }

/* M5 · chiselLoop: up/down pose alternation + impact flag (for dust + sfx) */
export function chiselLoop(t, { period = 0.5, ph = 0 } = {}) { const q = ((t / period) + ph) % 1; const k = q < 0.65 ? ease.io(q / 0.65) : 1 - ease.out((q - 0.65) / 0.35); return { pose: blendPose(POSES.chiselDn, POSES.chiselUp, k), hit: q > 0.97 || q < 0.03 }; }

/* M6 · countUp: integer counter t0→t1 (tally / days) with a pop on each step */
export function countUp(t, t0, t1, from, to) { const k = seg01(t, t0, t1); const v = from + (to - from) * k; const n = Math.floor(v); return { n, frac: v - n, pop: 1 + 0.25 * (1 - (v - n)) * (k < 1 ? 1 : 0) }; }

/* M7 · stampIn: name tag / glyph pops in with a back-ease scale (0→1.08→1) */
export function stampIn(t, t0, dur = 0.35) { const k = seg01(t, t0, t0 + dur); return { a: clamp(k * 2, 0, 1), s: k <= 0 ? 0 : ease.back(k) }; }

/* M8 · shout: short shake + speech-ray burst amplitude */
export function shout(t, t0, dur = 1.2) { const k = seg01(t, t0, t0 + dur); if (k <= 0 || k >= 1) return { dx: 0, dy: 0, amp: 0 }; const env = Math.sin(k * Math.PI); return { dx: Math.sin(t * 61) * 5 * env, dy: Math.cos(t * 47) * 3 * env, amp: env }; }

/* M9 · grainPour: deterministic falling grain particles from (x,y) into a container (k = time since start) */
export function grainPour(ctx, x, y, h, k, { n = 60, col = P.gold } = {}) { if (k <= 0) return; ctx.save(); ctx.fillStyle = col; for (let i = 0; i < n; i++) { const ph = (i * 0.618) % 1; const q = (k * 1.6 + ph) % 1; const yy = y + q * h, xx = x + Math.sin(i * 12.9) * 10 * q; ctx.fillRect(xx - 2, yy - 3, 4, 6); } ctx.restore(); }
export const PATTERNS = ['scrollWipe', 'captionIn', 'poseAt', 'walk', 'chiselLoop', 'countUp', 'stampIn', 'shout', 'grainPour'];
