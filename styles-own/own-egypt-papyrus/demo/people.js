/** people.js — Papyrus Egypt figures, drawn the way 4352 draws them: Egyptian canon (profile head with a FRONTAL almond eye,
 * frontal shoulders, profile legs striding), flat fills, one merged 3 px dark-brown outline per body group, bob/long black wig,
 * usekh collar bands, white linen kilt or sheath. Men terracotta, women ochre-gold. Faces: eye-liner + brow + lips; women get blush.
 * egyptian(ctx, {x, y, H, pose, f, kind, ...}) → {hands:[[x,y],[x,y]], hang:[a0,a1], head:[x,y], top}  (world coords).
 * Pose = {lean, head, arms:[[sh,el],[sh,el]], legs:[[hip,knee],[hip,knee]], drop, cross}; angles in degrees from straight down,
 * + = toward the facing side. arms[0]/legs[0] = far side, [1] = near side. */
import { P, LW, outlined, rgba, mix, clamp, lerp } from './look.js';
const R = Math.PI / 180;
const V = (a, l) => [Math.sin(a * R) * l, Math.cos(a * R) * l];
export const POSES = {
  stand:   { lean: 0, head: 0, arms: [[6, 4], [-4, 6]], legs: [[-6, 2], [10, 4]] },
  stride:  { lean: 2, head: 0, arms: [[-14, 6], [16, 10]], legs: [[-14, 4], [18, 6]] },
  offer:   { lean: 4, head: -2, arms: [[40, 70], [58, 46]], legs: [[-8, 2], [12, 4]] },
  raise:   { lean: -4, head: 8, arms: [[150, 20], [165, 12]], legs: [[-8, 2], [12, 4]] },
  shout:   { lean: 6, head: 6, arms: [[120, 40], [150, 30]], legs: [[-16, 4], [16, 6]] },
  point:   { lean: 3, head: 0, arms: [[4, 8], [84, 6]], legs: [[-8, 2], [14, 4]] },
  chiselUp:{ lean: 8, head: -4, arms: [[62, 18], [150, 60]], legs: [[-16, 4], [16, 10]] },
  chiselDn:{ lean: 12, head: -6, arms: [[64, 16], [86, 6]], legs: [[-16, 4], [18, 12]] },
  carry:   { lean: -2, head: 0, arms: [[8, 6], [160, 140]], legs: [[-12, 4], [14, 6]] },
  holdBack:{ lean: 0, head: 0, arms: [[40, 90], [-4, 6]], legs: [[-6, 2], [10, 4]] },
  write:   { lean: 10, head: -12, arms: [[40, 60], [52, 48]], legs: [[96, 172], [100, 176]], drop: 45, cross: true },
  sitDown: { lean: 10, head: -6, arms: [[60, 60], [70, 52]], legs: [[118, 150], [124, 158]], drop: 46 },
  sitChair:{ lean: 0, head: 0, arms: [[30, 50], [40, 40]], legs: [[88, 90], [92, 92]], drop: 26 },
  slump:   { lean: 18, head: -16, arms: [[10, 4], [14, 6]], legs: [[-4, 2], [8, 6]] },
  cheer:   { lean: -2, head: 10, arms: [[140, 10], [-30, 60]], legs: [[-10, 4], [14, 4]] },
};
export function blendPose(a, b, k) { a = typeof a === 'string' ? POSES[a] : a; b = typeof b === 'string' ? POSES[b] : b; const l = (x, y) => lerp(x, y, k);
  return { lean: l(a.lean, b.lean), head: l(a.head || 0, b.head || 0), drop: l(a.drop || 0, b.drop || 0), cross: k < 0.5 ? a.cross : b.cross,
    arms: a.arms.map((s, i) => [l(s[0], b.arms[i][0]), l(s[1], b.arms[i][1])]), legs: a.legs.map((s, i) => [l(s[0], b.legs[i][0]), l(s[1], b.legs[i][1])]) }; }
/* walk cycle (phase 0..1), Egyptian stride: long legs, arms swing opposite */
export function walkPose(ph, { swing = 1 } = {}) { const s = Math.sin(ph * Math.PI * 2), c = Math.cos(ph * Math.PI * 2);
  return { lean: 3, head: 0, drop: Math.abs(c) * -1.2, arms: [[-18 * s * swing + 2, 10], [18 * s * swing + 2, 12]], legs: [[22 * s, 8 + 14 * Math.max(0, -c)], [-22 * s, 8 + 14 * Math.max(0, c)]] }; }

/* tapered limb segment with round caps (filled or stroked as one path) */
function seg(ctx, ax, ay, bx, by, wa, wb) { const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; const a = Math.atan2(dy, dx);
  ctx.moveTo(ax + nx * wa / 2, ay + ny * wa / 2); ctx.lineTo(bx + nx * wb / 2, by + ny * wb / 2); ctx.arc(bx, by, wb / 2, a + Math.PI / 2, a - Math.PI / 2, true); ctx.lineTo(ax - nx * wa / 2, ay - ny * wa / 2); ctx.arc(ax, ay, wa / 2, a - Math.PI / 2, a + Math.PI / 2, true); ctx.closePath(); }
const paint = (ctx, mode) => { if (mode === 'stroke') ctx.stroke(); else if (mode === 'fill') ctx.fill(); };

/* ── the head (profile facing +x, origin = jaw/neck point, unit u) ── */
function face(ctx, u, mode, kind) { ctx.beginPath(); const m = (x, y) => ctx.moveTo(x * u, y * u), l = (x, y) => ctx.lineTo(x * u, y * u), q = (cx, cy, x, y) => ctx.quadraticCurveTo(cx * u, cy * u, x * u, y * u);
  const fem = kind === 'woman';
  m(-3.5, 1.5); l(-4.5, -9); q(-3, -15.5, 1.5, -15.2); q(4.4, -14.6, 4.9, -11.6); // skull + forehead
  q(5.1, -10.4, 5.0, -9.8); q(fem ? 6.0 : 6.6, -7.6, fem ? 6.5 : 7.0, -6.3); q(fem ? 6.2 : 6.6, -5.6, 5.5, -5.4); // brow → nose tip → under nose
  q(5.9, -5.0, 5.7, -4.5); q(5.25, -4.15, 5.6, -3.7); q(5.7, -3.0, 5.0, -2.7); // lips
  q(5.2, -1.4, 4.1, -0.7); q(2.2, 0.4, 0.2, 0.2); l(-0.5, 2.5); ctx.closePath(); paint(ctx, mode); }
function faceDetail(ctx, u, kind, o = {}) { const fem = kind === 'woman';
  // brow
  ctx.strokeStyle = P.line; ctx.lineCap = 'round'; ctx.lineWidth = u * 0.55; ctx.beginPath(); ctx.moveTo(1.4 * u, -10.4 * u); ctx.quadraticCurveTo(3.2 * u, -11.3 * u, 4.7 * u, -10.4 * u); ctx.stroke();
  // frontal almond eye with liner + cosmetic tail
  const ex = 3.0 * u, ey = -8.5 * u, ew = 1.85 * u, eh = (o.blink ? 0.12 : 0.78) * u;
  ctx.fillStyle = '#F7F1E2'; ctx.beginPath(); ctx.moveTo(ex - ew, ey); ctx.quadraticCurveTo(ex, ey - eh * 1.5, ex + ew, ey - 0.05 * u); ctx.quadraticCurveTo(ex, ey + eh * 1.3, ex - ew, ey); ctx.fill();
  if (!o.blink) { ctx.fillStyle = '#1B120D'; ctx.beginPath(); ctx.arc(ex + 0.55 * u, ey - 0.05 * u, 0.62 * u, 0, 7); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ex + 0.75 * u, ey - 0.3 * u, 0.17 * u, 0, 7); ctx.fill(); }
  ctx.strokeStyle = '#120C08'; ctx.lineWidth = u * 0.42; ctx.beginPath(); ctx.moveTo(ex + ew + 0.1 * u, ey - 0.05 * u); ctx.quadraticCurveTo(ex, ey - eh * 1.55, ex - ew, ey); ctx.lineTo(ex - ew - 1.6 * u, ey + 0.35 * u); ctx.stroke();
  ctx.lineWidth = u * 0.22; ctx.beginPath(); ctx.moveTo(ex - ew, ey + 0.05 * u); ctx.quadraticCurveTo(ex, ey + eh * 1.3, ex + ew, ey); ctx.stroke();
  // lips colour + mouth line; women: blush
  ctx.fillStyle = fem ? '#B5503C' : rgba('#5A1E14', 0.55); ctx.beginPath(); ctx.moveTo(5.0 * u, -4.55 * u); ctx.quadraticCurveTo(5.75 * u, -4.6 * u, 5.62 * u, -4.2 * u); ctx.quadraticCurveTo(5.4 * u, -3.95 * u, 5.0 * u, -4.0 * u); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(5.0 * u, -3.75 * u); ctx.quadraticCurveTo(5.75 * u, -3.6 * u, 5.55 * u, -3.0 * u); ctx.quadraticCurveTo(5.2 * u, -2.85 * u, 4.9 * u, -3.3 * u); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.line, 0.9); ctx.lineWidth = u * 0.22; ctx.beginPath(); if (o.open) { ctx.fillStyle = '#3A1510'; ctx.ellipse(5.1 * u, -3.85 * u, 0.55 * u, 0.42 * u * o.open + 0.1 * u, 0, 0, 7); ctx.fill(); } else { ctx.moveTo(4.6 * u, -3.9 * u); ctx.lineTo(5.6 * u, -3.85 * u); ctx.stroke(); }
  if (fem) { const g = ctx.createRadialGradient(3.6 * u, -6.0 * u, 0, 3.6 * u, -6.0 * u, 1.9 * u); g.addColorStop(0, 'rgba(200,80,60,0.35)'); g.addColorStop(1, 'rgba(200,80,60,0)'); ctx.fillStyle = g; ctx.fillRect(1.5 * u, -8 * u, 4.2 * u, 4.2 * u); }
  // nostril
  ctx.strokeStyle = rgba(P.line, 0.6); ctx.lineWidth = u * 0.2; ctx.beginPath(); ctx.moveTo(5.3 * u, -5.9 * u); ctx.quadraticCurveTo(5.0 * u, -5.6 * u, 5.4 * u, -5.45 * u); ctx.stroke(); }
function wigPath(ctx, u, type) { ctx.beginPath(); const m = (x, y) => ctx.moveTo(x * u, y * u), l = (x, y) => ctx.lineTo(x * u, y * u), q = (cx, cy, x, y) => ctx.quadraticCurveTo(cx * u, cy * u, x * u, y * u);
  if (type === 'bob') { m(4.4, -12.8); q(3.6, -16.8, -1.5, -17.0); q(-7.4, -16.4, -8.0, -9.5); l(-7.8, -0.8); q(-4.4, 0.0, -1.2, -0.8); l(-0.8, -6.0); q(-0.7, -10.6, 1.6, -12.2); q(2.9, -12.9, 4.4, -12.8); }
  else if (type === 'long') { m(4.5, -12.6); q(3.9, -17.2, -1.6, -17.4); q(-8.0, -16.8, -8.6, -9.5); l(-8.4, 8.5); q(-5.2, 9.2, -2.6, 8.6); l(-1.6, 1.5); l(-0.9, 9.6); l(1.0, 9.3); l(0.2, -5.0); q(-0.4, -10.6, 1.8, -12.2); q(3.1, -12.8, 4.5, -12.6); }
  else if (type === 'short') { m(4.6, -12.6); q(3.8, -16.4, -1.0, -16.4); q(-6.4, -15.8, -6.2, -7.0); q(-5.0, -4.6, -2.6, -5.0); q(-1.6, -9.8, 1.6, -11.9); q(3.1, -12.6, 4.6, -12.6); }
  ctx.closePath(); }
function nemes(ctx, u) { // striped royal headcloth: blue/gold, lappet in front of shoulder, uraeus
  const path = () => { ctx.beginPath(); const m = (x, y) => ctx.moveTo(x * u, y * u), l = (x, y) => ctx.lineTo(x * u, y * u), q = (cx, cy, x, y) => ctx.quadraticCurveTo(cx * u, cy * u, x * u, y * u);
    m(4.8, -12.6); q(4.2, -17.8, -1.4, -18.0); q(-6.5, -17.6, -8.6, -10.0); l(-10.5, 2.5); l(-5.5, 2.0); l(-2.4, -2.0); l(-0.2, 9.0); l(2.6, 9.0); l(1.8, -4.6); q(1.0, -10.6, 2.6, -12.2); ctx.closePath(); };
  ctx.save(); path(); ctx.strokeStyle = P.line; ctx.lineWidth = LW * 2; ctx.stroke(); ctx.fillStyle = P.gold; ctx.fill(); ctx.clip();
  ctx.strokeStyle = P.lapis; ctx.lineWidth = u * 0.9; for (let i = -22; i < 14; i += 2.1) { ctx.beginPath(); ctx.moveTo(-14 * u, i * u); ctx.lineTo(8 * u, (i - 3) * u); ctx.stroke(); } ctx.restore();
  ctx.fillStyle = P.gold; ctx.strokeStyle = P.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(4.2 * u, -13 * u); ctx.quadraticCurveTo(6.2 * u, -15.6 * u, 5.0 * u, -17.2 * u); ctx.quadraticCurveTo(4.0 * u, -15.6 * u, 3.4 * u, -13.4 * u); ctx.fill(); ctx.stroke(); }
function falconHead(ctx, u) { // Ra: blue tripartite wig, white falcon face with dark malar stripe, gold hooked beak (4352 t0/t32)
  const wig = () => { ctx.beginPath(); ctx.moveTo(1.6 * u, -14 * u); ctx.quadraticCurveTo(-2 * u, -18 * u, -7 * u, -14 * u); ctx.lineTo(-9.5 * u, 4 * u); ctx.lineTo(-4.5 * u, 6 * u); ctx.lineTo(-1.5 * u, -2 * u); ctx.lineTo(0.5 * u, 9.5 * u); ctx.lineTo(3.5 * u, 9.5 * u); ctx.lineTo(2.5 * u, -6 * u); ctx.closePath(); };
  ctx.save(); wig(); ctx.strokeStyle = P.line; ctx.lineWidth = LW * 2; ctx.stroke(); ctx.fillStyle = P.lapis; ctx.fill(); ctx.clip(); ctx.fillStyle = '#E9C05A'; for (let i = 0; i < 36; i++) { const x = (-9 + (i * 37 % 13)) * u, y = (-14 + (i * 17 % 23)) * u; ctx.beginPath(); ctx.arc(x, y, 0.35 * u, 0, 7); ctx.fill(); } ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.moveTo(1.2 * u, -13.5 * u); ctx.quadraticCurveTo(6.5 * u, -15 * u, 7.5 * u, -10 * u); ctx.lineTo(9.6 * u, -8.6 * u); ctx.quadraticCurveTo(9.8 * u, -6.4 * u, 8.3 * u, -5.6 * u); ctx.lineTo(7.4 * u, -6.8 * u); ctx.quadraticCurveTo(6.5 * u, -3 * u, 3 * u, -2 * u); ctx.lineTo(1.2 * u, -4 * u); ctx.closePath(); ctx.strokeStyle = P.line; ctx.lineWidth = LW * 2; ctx.stroke(); ctx.fillStyle = '#F2EEE3'; ctx.fill(); ctx.clip();
  ctx.fillStyle = '#2B2B3A'; ctx.beginPath(); ctx.moveTo(1.2 * u, -11 * u); ctx.lineTo(4.5 * u, -9.5 * u); ctx.lineTo(4.2 * u, -4 * u); ctx.lineTo(2.6 * u, -3.5 * u); ctx.lineTo(3.0 * u, -8.5 * u); ctx.closePath(); ctx.fill();
  ctx.fillStyle = P.gold; ctx.beginPath(); ctx.moveTo(7.0 * u, -10.4 * u); ctx.lineTo(9.8 * u, -8.6 * u); ctx.quadraticCurveTo(9.9 * u, -6.2 * u, 8.2 * u, -5.4 * u); ctx.lineTo(7.2 * u, -7.6 * u); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#C0392B'; ctx.beginPath(); ctx.arc(5.4 * u, -10.0 * u, 1.0 * u, 0, 7); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(5.6 * u, -10.0 * u, 0.5 * u, 0, 7); ctx.fill(); }
function sunCrown(ctx, u, horns) { const cy = -19.4 * u; if (horns) { ctx.strokeStyle = P.line; ctx.lineWidth = 1.6 * u; ctx.beginPath(); ctx.arc(0, cy - 0.5 * u, 5.4 * u, Math.PI * 0.05, Math.PI * 0.95, true); ctx.stroke(); }
  ctx.fillStyle = P.red; ctx.strokeStyle = P.gold; ctx.lineWidth = 1.1 * u; ctx.beginPath(); ctx.arc(0, cy, 3.8 * u, 0, 7); ctx.fill(); ctx.stroke(); ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, cy, 4.4 * u, 0, 7); ctx.stroke();
  ctx.fillStyle = P.gold; ctx.fillRect(-2.6 * u, -17.6 * u, 5.2 * u, 1.2 * u); }
function headband(ctx, u, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(4.2 * u, -12.9 * u); ctx.quadraticCurveTo(-1.5 * u, -15.2 * u, -7.4 * u, -11.5 * u); ctx.lineTo(-7.5 * u, -10.4 * u); ctx.quadraticCurveTo(-1.5 * u, -14.0 * u, 4.0 * u, -11.9 * u); ctx.closePath(); ctx.fill(); }

/* collar (usekh) — concentric bands on the chest, clipped to torso */
function collar(ctx, u, cols) { const r0 = 3.2 * u; cols.forEach((c, i) => { const r = r0 + (cols.length - i) * 1.55 * u; ctx.fillStyle = P.line; ctx.beginPath(); ctx.ellipse(0, 0, r + 0.3 * u, r * 0.8 + 0.3 * u, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.8, 0, 0, Math.PI); ctx.fill(); });
  ctx.fillStyle = 'rgba(255,240,200,0.6)'; for (let a = 0.25; a < Math.PI; a += 0.32) { const r = r0 + 1.55 * u * 0.5; ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r * 0.8, 0.25 * u, 0, 7); ctx.fill(); } }

const KIND = {
  man:     { skin: P.skinM, shade: P.skinMShade, wig: 'bob', dress: 'kilt', collar: [P.blue, P.turq, P.blue], sh: 13.5, band: P.gold },
  worker:  { skin: P.skinM, shade: P.skinMShade, wig: 'short', dress: 'kilt', collar: [P.blue, P.turq], sh: 13.5, band: null },
  woman:   { skin: P.skinF, shade: P.skinFShade, wig: 'long', dress: 'sheath', collar: [P.green, P.red, P.blue, P.green], sh: 11.5, band: P.gold },
  scribe:  { skin: P.skinM, shade: P.skinMShade, wig: 'short', dress: 'kilt', collar: [P.turq, P.blue], sh: 13, band: null, belly: 1 },
  pharaoh: { skin: P.skinM, shade: P.skinMShade, wig: 'nemes', dress: 'kilt', collar: [P.gold, P.blue, P.red, P.turq, P.gold], sh: 14, band: P.gold, apron: 1 },
  official:{ skin: P.skinM, shade: P.skinMShade, wig: 'long', dress: 'robe', collar: [P.gold, P.blue, P.gold], sh: 13.5, band: P.gold },
  ra:      { skin: P.skinM, shade: P.skinMShade, wig: 'falcon', dress: 'kilt', collar: [P.gold, P.blue, P.red, P.turq, P.gold], sh: 14, band: P.gold, crown: 'sun' },
  hathor:  { skin: P.skinF, shade: P.skinFShade, wig: 'long', dress: 'net', collar: [P.green, P.red, P.blue, P.green], sh: 11.5, band: P.gold, crown: 'horns' },
};
export function egyptian(ctx, opt = {}) {
  const { x = 0, y = 0, H = 400, f = 1, kind = 'man', k = 1, mouth = 0, blink = false, shadow = true } = opt;
  const K = { ...KIND[kind], ...(opt.look || {}) }; const fem = kind === 'woman' || kind === 'hathor';
  let p = opt.pose || 'stand'; if (typeof p === 'string') p = POSES[p]; p = blendPose(p, p, 0);
  const u = H / 100, lean = p.lean, drop = (p.drop || 0) * u;
  const pel = [0, -50 * u + drop];
  const hipB = [pel[0] - 2.2 * u, pel[1]], hipF = [pel[0] + 2.4 * u, pel[1]];
  const legPts = (hip, [ha, kn]) => { const kpt = [hip[0] + V(ha, 24 * u)[0], hip[1] + V(ha, 24 * u)[1]]; const sa = ha - kn; const apt = [kpt[0] + V(sa, 23 * u)[0], kpt[1] + V(sa, 23 * u)[1]]; return { hip, knee: kpt, ank: apt, sa }; };
  const LB = legPts(hipB, p.legs[0]), LF = legPts(hipF, p.legs[1]);
  const neck = [pel[0] + Math.sin(lean * R) * 32 * u, pel[1] - Math.cos(lean * R) * 32 * u];
  const tl = (lx, ly) => { const c = Math.cos(lean * R), s = Math.sin(lean * R); return [pel[0] + lx * c - ly * s, pel[1] + lx * s + ly * c]; };
  const shB = tl(-K.sh * u * 0.66, -29 * u), shF = tl(K.sh * u * 0.56, -29 * u);
  const armPts = (sh, [sa, el]) => { const e = [sh[0] + V(sa, 15.5 * u)[0], sh[1] + V(sa, 15.5 * u)[1]]; const fa = sa + el; const h = [e[0] + V(fa, 13.5 * u)[0], e[1] + V(fa, 13.5 * u)[1]]; return { sh, el: e, hand: h, fa }; };
  const AB = armPts(shB, p.arms[0]), AF = armPts(shF, p.arms[1]);
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(x, y); ctx.scale(f, 1);
  if (shadow) { ctx.fillStyle = 'rgba(40,20,10,0.22)'; ctx.beginPath(); ctx.ellipse(1 * u, 0.5 * u, 18 * u, 2.2 * u, 0, 0, 7); ctx.fill(); }
  const skin = K.skin;
  const arm = (A, far) => outlined(ctx, (c, m) => { c.beginPath(); seg(c, A.sh[0], A.sh[1], A.el[0], A.el[1], 5.2 * u, 4.0 * u); paint(c, m); c.beginPath(); seg(c, A.el[0], A.el[1], A.hand[0], A.hand[1], 4.0 * u, 3.0 * u); paint(c, m);
      const hd = V(A.fa, 1); c.beginPath(); c.ellipse(A.hand[0] + hd[0] * 1.6 * u, A.hand[1] + hd[1] * 1.6 * u, 1.9 * u, 2.7 * u, Math.atan2(hd[1], hd[0]) - Math.PI / 2, 0, 7); paint(c, m); }, far ? mix(skin, K.shade, 0.55) : skin);
  const armBands = (A) => { if (!K.band) return; for (const [pt, w] of [[[lerp(A.sh[0], A.el[0], 0.35), lerp(A.sh[1], A.el[1], 0.35)], 4.9], [[lerp(A.el[0], A.hand[0], 0.82), lerp(A.el[1], A.hand[1], 0.82)], 3.3]]) { const d = A === AB ? V(p.arms[0][0], 1) : V(p.arms[1][0], 1); ctx.save(); ctx.translate(pt[0], pt[1]); ctx.rotate(Math.atan2(d[1], d[0])); ctx.fillStyle = w > 4 ? K.band : P.blue; ctx.fillRect(-0.8 * u, -w / 2 * u, 1.6 * u, w * u); ctx.restore(); } };
  const leg = (L, far) => outlined(ctx, (c, m) => { c.beginPath(); seg(c, L.hip[0], L.hip[1], L.knee[0], L.knee[1], 8.2 * u, 5.4 * u); paint(c, m); c.beginPath(); seg(c, L.knee[0], L.knee[1], L.ank[0], L.ank[1], 5.4 * u, 3.0 * u); paint(c, m);
      const fa = L.sa; const fl = [Math.cos(fa * R * 0.4), -Math.sin(fa * R * 0.4)]; const tx = L.ank[0] + fl[0] * 9 * u, ty = L.ank[1] + 1.4 * u + fl[1] * 9 * u;
      c.beginPath(); c.moveTo(L.ank[0] - 2.2 * u, L.ank[1] - 1.2 * u); c.quadraticCurveTo(L.ank[0] - 2.8 * u, L.ank[1] + 1.6 * u, L.ank[0] - 1.2 * u, L.ank[1] + 1.6 * u); c.lineTo(tx, ty); c.quadraticCurveTo(tx + 0.4 * u, ty - 1.4 * u, tx - 2 * u, ty - 1.8 * u); c.quadraticCurveTo(L.ank[0] + 3 * u, L.ank[1] - 1.2 * u, L.ank[0] + 1.2 * u, L.ank[1] - 2.2 * u); c.closePath(); paint(c, m); }, far ? mix(skin, K.shade, 0.55) : skin);
  // ── far arm, legs
  arm(AB, true); armBands(AB);
  const showLegs = K.dress !== 'robe';
  if (K.dress === 'sheath' || K.dress === 'net' || K.dress === 'robe') { leg(LB, true); leg(LF, false); } else { leg(LB, true); leg(LF, false); }
  // ── torso
  const torso = (c, m) => { c.save(); c.translate(pel[0], pel[1]); c.rotate(lean * R); c.beginPath(); const s = K.sh * u, w = (fem ? 5.0 : 5.6) * u;
    c.moveTo(-w, 1 * u); c.quadraticCurveTo(-w - 1.4 * u, -14 * u, -s * 0.78, -27 * u); c.quadraticCurveTo(-s * 0.85, -31 * u, -s * 0.5, -31.2 * u); c.lineTo(s * 0.45, -31.2 * u); c.quadraticCurveTo(s * 0.72, -31 * u, s * 0.66, -27 * u);
    if (fem) { c.quadraticCurveTo(s * 0.62, -24 * u, 8.6 * u, -19.5 * u); c.quadraticCurveTo(8.0 * u, -16 * u, 5.4 * u, -15.5 * u); c.quadraticCurveTo(w + 0.4 * u, -8 * u, w, 1 * u); }
    else if (K.belly) { c.quadraticCurveTo(s * 0.7, -18 * u, w + 0.8 * u, -16 * u); c.quadraticCurveTo(w + 4.2 * u, -8 * u, w + 1.2 * u, 1 * u); }
    else { c.quadraticCurveTo(s * 0.74, -21 * u, w + 1.3 * u, -18 * u); c.quadraticCurveTo(w + 0.2 * u, -9 * u, w, 1 * u); }
    c.closePath(); paint(c, m); if (m !== 'none') { c.beginPath(); seg(c, 0.3 * u, -29.5 * u, 1.3 * u, -34.0 * u, 6.0 * u, 5.4 * u); paint(c, m); } c.restore(); };
  outlined(ctx, torso, skin);
  // shading on the far side of torso + pecs line
  ctx.save(); torso(ctx, 'none'); ctx.clip(); ctx.translate(pel[0], pel[1]); ctx.rotate(lean * R);
  ctx.save(); ctx.beginPath(); { const s = K.sh * u; ctx.rect(-s, -32 * u, s * 0.55, 34 * u); } ctx.fillStyle = rgba(K.shade, 0.35); ctx.fill(); ctx.restore();
  if (!fem) { ctx.strokeStyle = rgba(P.line, 0.5); ctx.lineWidth = 0.35 * u; ctx.beginPath(); ctx.moveTo(1.5 * u, -21 * u); ctx.quadraticCurveTo(5 * u, -19 * u, 7.5 * u, -20 * u); ctx.stroke(); }
  // collar centred under neck
  // dress top (sheath straps / net) on torso
  ctx.restore();
  // ── lower garment
  const hemY = pel[1] + 21 * u; const kx = Math.max(LB.knee[0], LF.knee[0]), bx = Math.min(LB.knee[0], LF.knee[0]);
  if (K.dress === 'kilt') { const sit = (p.drop || 0) > 15; const front = sit ? Math.max(kx, LF.knee[0]) + 2 * u : Math.max(9 * u, kx * 0.75 + 3 * u), back = Math.min(-7.5 * u, bx * 0.5 - 4 * u); const hy = sit ? pel[1] + 6 * u : hemY;
    const kilt = (c, m) => { c.beginPath(); c.moveTo(-6.6 * u, pel[1] - 3.4 * u); c.lineTo(6.8 * u, pel[1] - 3.4 * u); c.quadraticCurveTo(front - 1 * u, pel[1] + 6 * u, front, hy - 1.5 * u); c.lineTo(back, hy); c.quadraticCurveTo(-8 * u, pel[1] + 8 * u, -6.6 * u, pel[1] - 3.4 * u); c.closePath(); paint(c, m); };
    ctx.save(); ctx.translate(pel[0], 0); ctx.translate(-pel[0], 0); outlined(ctx, kilt, P.linen); ctx.restore();
    ctx.save(); kilt(ctx, 'none'); ctx.clip(); ctx.strokeStyle = rgba('#9C8F72', 0.65); ctx.lineWidth = 0.35 * u; for (let i = -6; i < 10; i += 1.8) { ctx.beginPath(); ctx.moveTo(i * u, pel[1] - 2 * u); ctx.lineTo(i * u + (front - 6 * u) * (i + 6) / 16 * 0.55, hy); ctx.stroke(); }
    ctx.fillStyle = rgba(P.linenShade, 0.7); ctx.beginPath(); ctx.moveTo(-6.6 * u, pel[1]); ctx.lineTo(back, hy); ctx.lineTo(back + 4 * u, hy); ctx.lineTo(-3 * u, pel[1]); ctx.fill(); ctx.restore();
    if (K.apron) { ctx.fillStyle = P.gold; ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1 * u, pel[1] - 2 * u); ctx.lineTo(5 * u, pel[1] - 2 * u); ctx.lineTo(4.5 * u, hy - 3 * u); ctx.lineTo(1.5 * u, hy - 3 * u); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = P.lapis; ctx.lineWidth = 0.6 * u; for (let yy = pel[1] + 1 * u; yy < hy - 4 * u; yy += 2.2 * u) { ctx.beginPath(); ctx.moveTo(1.5 * u, yy); ctx.lineTo(4.5 * u, yy); ctx.stroke(); } }
    ctx.fillStyle = K.band || '#C9BC9A'; ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(-6.8 * u, pel[1] - 4.6 * u, 13.8 * u, 2.2 * u); ctx.fill(); ctx.stroke();
  } else { // sheath / net / robe: a tube from the waist to the ankles that follows both legs
    const ankF = Math.max(LB.ank[0], LF.ank[0]) + 1.5 * u, ankB = Math.min(LB.ank[0], LF.ank[0]) - 1.5 * u, ay = Math.max(LB.ank[1], LF.ank[1]) - 2.5 * u;
    const tB = tl(-6.2 * u, -21.5 * u), tF = tl(7.2 * u, -25.5 * u), bF = tl(8.9 * u, -19.6 * u), bU = tl(5.6 * u, -15.2 * u), wF = tl(5.4 * u, -4 * u), wB = tl(-5.4 * u, -4 * u);
    const top = fem && K.dress !== 'robe';
    const sk = (c, m) => { c.beginPath(); if (top) { c.moveTo(tB[0], tB[1]); c.quadraticCurveTo(0, (tB[1] + tF[1]) / 2 + 1 * u, tF[0], tF[1]); c.quadraticCurveTo(bF[0] + 0.6 * u, bF[1] - 2 * u, bF[0], bF[1]); c.quadraticCurveTo(bF[0] - 0.4 * u, bU[1] - 0.5 * u, bU[0], bU[1]); c.lineTo(wF[0], wF[1]); } else { c.moveTo(-6.4 * u, pel[1] - 6 * u); c.lineTo(7.6 * u, pel[1] - 6 * u); } c.quadraticCurveTo(kx + 4 * u, pel[1] + 22 * u, ankF, ay); c.lineTo(ankB, ay); if (top) { c.quadraticCurveTo(bx - 4 * u, pel[1] + 24 * u, wB[0], wB[1]); c.lineTo(tB[0], tB[1]); } else c.quadraticCurveTo(bx - 4 * u, pel[1] + 24 * u, -6.4 * u, pel[1] - 6 * u); c.closePath(); paint(c, m); };
    outlined(ctx, sk, K.dress === 'net' ? '#F1EADA' : P.linen);
    ctx.save(); sk(ctx, 'none'); ctx.clip();
    if (K.dress === 'net') { ctx.strokeStyle = P.turq; ctx.lineWidth = 0.6 * u; for (let i = -40; i < 40; i += 3.2) { ctx.beginPath(); ctx.moveTo((i - 20) * u, pel[1] - 40 * u); ctx.lineTo((i + 30) * u, pel[1] + 60 * u); ctx.stroke(); ctx.beginPath(); ctx.moveTo((i + 20) * u, pel[1] - 40 * u); ctx.lineTo((i - 30) * u, pel[1] + 60 * u); ctx.stroke(); } ctx.fillStyle = '#C89A43'; for (let i = -12; i < 14; i += 3.2) for (let j = -8; j < 52; j += 3.2) { ctx.beginPath(); ctx.arc(i * u, pel[1] + j * u, 0.45 * u, 0, 7); ctx.fill(); } }
    else { ctx.strokeStyle = rgba('#9C8F72', 0.5); ctx.lineWidth = 0.35 * u; for (let i = -4; i < 8; i += 2.6) { ctx.beginPath(); ctx.moveTo(i * u, pel[1] - 4 * u); ctx.lineTo(i * u * 1.3, ay); ctx.stroke(); } ctx.fillStyle = rgba(P.linenShade, 0.5); ctx.fillRect(-14 * u, pel[1] - 8 * u, 6 * u, 70 * u); }
    ctx.restore();
    if (K.dress === 'robe') { ctx.fillStyle = K.band; ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(-6.6 * u, pel[1] - 7.5 * u, 14.4 * u, 2.2 * u); ctx.fill(); ctx.stroke(); }
  }
  ctx.save(); ctx.translate(pel[0], pel[1]); ctx.rotate(lean * R); ctx.translate(0.6 * u, -31 * u); collar(ctx, u, K.collar); ctx.restore();
  // ── head
  const hd = [neck[0] + Math.sin(lean * R) * 2.5 * u + 1.2 * u, neck[1] - 2.2 * u]; const ha = (lean * 0.45 - (p.head || 0)) * R;
  ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(ha); const hu = u * 1.08;
  if (K.wig === 'falcon') { falconHead(ctx, hu); }
  else {
    if (K.wig === 'long' || K.wig === 'nemes') { /* back hair drawn behind the face */ }
    if (K.wig === 'nemes') nemes(ctx, hu);
    outlined(ctx, (c, m) => face(c, hu, m, fem ? 'woman' : 'man'), skin);
    ctx.save(); face(ctx, hu, 'none', fem ? 'woman' : 'man'); ctx.clip(); ctx.fillStyle = rgba(K.shade, 0.3); ctx.beginPath(); ctx.ellipse(-2 * hu, -4 * hu, 4.5 * hu, 9 * hu, 0, 0, 7); ctx.fill(); ctx.restore();
    if (K.wig !== 'nemes') { ctx.save(); wigPath(ctx, hu, K.wig); ctx.strokeStyle = P.line; ctx.lineWidth = LW * 2; ctx.lineJoin = 'round'; ctx.stroke(); ctx.fillStyle = P.wig; ctx.fill(); ctx.clip();
      ctx.strokeStyle = rgba(P.wigHi, 0.75); ctx.lineWidth = 0.35 * hu; for (let i = -8; i < 4; i += 1.3) { ctx.beginPath(); ctx.moveTo(i * hu, -17 * hu); ctx.quadraticCurveTo((i - 1) * hu, -6 * hu, (i - 0.4) * hu, 10 * hu); ctx.stroke(); } ctx.restore();
      if (K.band && K.wig !== 'short') headband(ctx, hu, K.wig === 'long' && fem ? P.gold : P.blue); }
    faceDetail(ctx, hu, fem ? 'woman' : 'man', { open: mouth, blink });
    if (fem) { ctx.fillStyle = P.gold; ctx.strokeStyle = P.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-0.6 * hu, -4.2 * hu, 0.9 * hu, 0, 7); ctx.fill(); ctx.stroke(); }
  }
  if (K.crown === 'sun' || K.crown === 'horns') sunCrown(ctx, hu, K.crown === 'horns');
  ctx.restore();
  // ── near arm on top
  arm(AF, false); armBands(AF);
  ctx.restore();
  const W2 = (pt) => [x + f * pt[0], y + pt[1]];
  const hang = (A) => { const d = V(A.fa, 1); return Math.atan2(d[1], d[0] * f); };
  return { hands: [W2(AB.hand), W2(AF.hand)], hang: [hang(AB), hang(AF)], elbows: [W2(AB.el), W2(AF.el)], head: W2(hd), top: y - 100 * u + drop, f, u };
}
