/** look.js — own-murphy-panel 墨菲暖板: warm miniature diorama in a dark room, rendered in pure Canvas2D.
 * A tiny 3D core (look-at camera, culled + Lambert-shaded faces, painter's list), the room (dark wall, sconces,
 * wood floor with long grain streaks), shallow depth of field, and the flat 2D overlay layer: top-left checklist HUD,
 * italic multiplier tags, thin gold annotation/measure lines, ring gauge, bottom serif caption with gold keyword. */
export const W = 1920, H = 1080;
export const SERIF = "'Noto Serif SC', serif";
export const ITAL = "'Noto Serif It', 'Noto Serif SC', serif";
export const P = {
  room: '#17120F', roomDeep: '#0D0A08', wallWarm: '#2B1E16',
  floor: '#4F2A1A', floorHi: '#6C3924', floorDeep: '#2A160D', streak: '#331A0F',
  wood: '#7A4426', woodLite: '#A4653D', woodDark: '#43230F', woodEdge: '#C78A58',
  tile: '#93502F', tileLite: '#B06842', grout: '#4A2414', terrazzo: '#B48A5E', speck: '#5A3A22',
  cream: '#F3EBDC', capWhite: '#F7F2E8', gold: '#EAC57E', goldDeep: '#C9963F', coral: '#EC8B70', red: '#D0493B', hud: '#E9E0CF',
  sage: '#94A170', terra: '#B5643F', mustard: '#CFA552', rose: '#C98B80', olive: '#7F7B49', plum: '#8E5A63', slate: '#6F7D86', clay: '#9C6A4A',
  head: '#F1E7D2', tableGreen: '#CFCB7A', paper: '#EDE3CB', glow: '#FFC870', bulb: '#FFE6B0', ink: '#2A1C14',
};
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgba(h, a = 1) { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; }
/** multiply a colour by k (k>1 brightens toward warm white). */
export function shade(h, k, a = 1) { const c = hex2rgb(h); const f = v => k <= 1 ? v * k : v + (255 - v) * Math.min(1, (k - 1)) * 0.9; return `rgba(${c.map(v => Math.round(clamp(f(v), 0, 255))).join(',')},${a})`; }
export function mix(h1, h2, k) { const a = hex2rgb(h1), b = hex2rgb(h2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], k)).toString(16).padStart(2, '0')).join(''); }
export function rnd(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

/* ── camera ── */
const v3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(...a) || 1; return a.map(v => v / l); } };
export { v3 };
export const CAM = { eye: [0, 400, 900], target: [0, 40, 0], f: 1500, cx: W / 2, cy: H / 2, R: [1, 0, 0], U: [0, 1, 0], F: [0, 0, -1] };
/** set the camera: eye, target (world units ≈ cm of the miniature), f = focal length in px. */
export function setCam(eye, target, f = 1500, cx = W / 2, cy = H / 2) {
  Object.assign(CAM, { eye, target, f, cx, cy }); CAM.F = v3.norm(v3.sub(target, eye)); CAM.R = v3.norm(v3.cross(CAM.F, [0, 1, 0])); CAM.U = v3.cross(CAM.R, CAM.F);
}
setCam(CAM.eye, CAM.target);
/** world → [sx, sy, depth, px-per-unit] */
export function pr(x, y, z) { const d = [x - CAM.eye[0], y - CAM.eye[1], z - CAM.eye[2]]; const zc = Math.max(1, v3.dot(d, CAM.F)); const k = CAM.f / zc;
  return [CAM.cx + v3.dot(d, CAM.R) * k, CAM.cy - v3.dot(d, CAM.U) * k, zc, k]; }
export const depth = (x, y, z) => v3.dot([x - CAM.eye[0], y - CAM.eye[1], z - CAM.eye[2]], CAM.F);
export const LIGHT = v3.norm([-0.5, 0.85, 0.45]);
export const lam = n => 0.42 + 0.7 * Math.max(0, v3.dot(n, LIGHT));
/** fill one planar polygon (world points) if it faces the eye; returns screen pts or null. */
export function face(c, pts, col, { n, k = null, stroke = null, lw = 1.2, alpha = 1, force = false } = {}) {
  if (!n) { const e1 = v3.sub(pts[1], pts[0]), e2 = v3.sub(pts[2], pts[0]); n = v3.norm(v3.cross(e1, e2)); }
  const cen = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length, a[2] + p[2] / pts.length], [0, 0, 0]);
  if (!force && v3.dot(n, v3.sub(CAM.eye, cen)) <= 0) return null;
  const s = pts.map(p => pr(...p)); c.beginPath(); s.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
  c.fillStyle = shade(col, k ?? lam(n), alpha); c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); } return s;
}
/** a box with base centre (x,y,z), size w×h×d, rotated ry about the vertical axis. opts.top = top colour, opts.faces = per-side callback. */
export function box(c, x, y, z, w, h, d, col, { top = null, ry = 0, edge = null, onTop = null, onFront = null, k = 1 } = {}) {
  const cs = Math.cos(ry), sn = Math.sin(ry); const P3 = (u, v, wv) => [x + u * cs + wv * sn, y + v, z - u * sn + wv * cs];
  const a = w / 2, b = d / 2; const B = [P3(-a, 0, -b), P3(a, 0, -b), P3(a, 0, b), P3(-a, 0, b)], T = B.map(p => [p[0], p[1] + h, p[2]]);
  const sides = [[0, 1], [1, 2], [2, 3], [3, 0]]; const out = {};
  for (const [i, j] of sides) { const quad = [B[i], B[j], T[j], T[i]]; const n = v3.norm(v3.cross(v3.sub(B[j], B[i]), [0, 1, 0])).map(v => -v);
    const s = face(c, quad, col, { n, k: lam(n) * k, stroke: edge }); if (s && i === 2) out.front = { s, quad }; if (s && onFront && i === 2) onFront(quad, n); }
  const st = face(c, [T[3], T[2], T[1], T[0]], top || col, { n: [0, 1, 0], k: lam([0, 1, 0]) * k * 1.04, stroke: edge }); if (st && onTop) onTop(T);
  out.top = T; return out;
}
/** an n-gon prism (cylinder for n≥16, hexagon for n=6), base centre (x,y,z). */
export function prism(c, x, y, z, r, h, col, { n = 20, rot = 0, top = null, k = 1, edge = null, onTop = null, sideTex = null } = {}) {
  const ring = yy => Array.from({ length: n }, (_, i) => { const a = rot + i / n * Math.PI * 2; return [x + Math.cos(a) * r, yy, z + Math.sin(a) * r]; });
  const B = ring(y), T = ring(y + h);
  const idx = [...Array(n).keys()].sort((i, j) => depth(...B[j]) - depth(...B[i]));
  for (const i of idx) { const j = (i + 1) % n; const a = rot + (i + 0.5) / n * Math.PI * 2; const nn = [Math.cos(a), 0, Math.sin(a)];
    const s = face(c, [B[i], B[j], T[j], T[i]], col, { n: nn, k: lam(nn) * k, stroke: edge }); if (s && sideTex) sideTex([B[i], B[j], T[j], T[i]], nn); }
  if (CAM.eye[1] > y + h) { face(c, T.slice().reverse(), top || col, { n: [0, 1, 0], k: lam([0, 1, 0]) * k * 1.04, force: true, stroke: edge }); if (onTop) onTop(T); }
  return T;
}
/** draw world-space line */
export function line3(c, a, b, col, lw = 1.5, alpha = 1) { const p = pr(...a), q = pr(...b); c.strokeStyle = rgba(col, alpha); c.lineWidth = lw; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
/** clip the context to a world polygon */
export function clip3(c, pts) { c.beginPath(); pts.forEach((p, i) => { const s = pr(...p); i ? c.lineTo(s[0], s[1]) : c.moveTo(s[0], s[1]); }); c.closePath(); c.clip(); }
/** painter's list: add(depthKey, fn) then flush() far → near */
export class Scene { constructor() { this.l = []; } add(d, fn) { this.l.push([d, fn]); return this; } at(x, y, z, fn) { return this.add(depth(x, y, z), fn); } flush() { this.l.sort((a, b) => b[0] - a[0]).forEach(([, f]) => f()); this.l = []; } }

/* ── room ── */
/** dark back wall + wood floor. wallZ = z of the wall plane; sconces = [[x,y]] on the wall. */
export function room(c, { wallZ = -900, sconces = [], t = 0, floorTone = 1, dim = 1, streaks = true } = {}) {
  const L = pr(-6000, 0, wallZ), R = pr(6000, 0, wallZ); const hy = (L[1] + R[1]) / 2;
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.roomDeep); g.addColorStop(clamp(hy / H), P.room); g.addColorStop(1, P.room);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (const [sx, sy] of sconces) wallGlow(c, sx, sy, wallZ, dim, t);
  // floor
  c.save(); c.beginPath(); c.moveTo(-50, L[1] + (R[1] - L[1]) * (-50 - L[0]) / (R[0] - L[0])); c.lineTo(W + 50, L[1] + (R[1] - L[1]) * (W + 50 - L[0]) / (R[0] - L[0])); c.lineTo(W + 50, H + 50); c.lineTo(-50, H + 50); c.closePath(); c.clip();
  const fg = c.createLinearGradient(0, hy, 0, H); fg.addColorStop(0, shade(P.floorDeep, floorTone * dim)); fg.addColorStop(0.45, shade(P.floor, floorTone * dim)); fg.addColorStop(1, shade(P.floorHi, floorTone * dim * 0.9));
  c.fillStyle = fg; c.fillRect(0, 0, W, H);
  if (streaks) { const r = rnd(5); for (let i = 0; i < 70; i++) { const z = wallZ + r() * (Math.abs(wallZ) + 900), x0 = -2600 + r() * 4400, len = 300 + r() * 1400, wd = 4 + r() * 16;
    const a = pr(x0, 0, z), b = pr(x0 + len, 0, z + wd * 0.3), a2 = pr(x0, 0, z + wd), b2 = pr(x0 + len, 0, z + wd * 1.3);
    c.fillStyle = rgba(r() < 0.6 ? P.streak : P.floorHi, (0.25 + r() * 0.35) * dim); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b2[0], b2[1]); c.lineTo(a2[0], a2[1]); c.fill(); } }
  // plank seams
  c.strokeStyle = rgba('#1E0F08', 0.35 * dim); c.lineWidth = 1; for (let z = wallZ; z < 1400; z += 70) { const a = pr(-6000, 0, z), b = pr(6000, 0, z); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
  c.restore();
  // skirting shadow where the wall meets the floor
  c.strokeStyle = rgba('#000', 0.35); c.lineWidth = 6; c.beginPath(); c.moveTo(L[0], L[1]); c.lineTo(R[0], R[1]); c.stroke();
  for (const [sx, sy] of sconces) sconce(c, sx, sy, wallZ, dim, t);
}
/** warm light pool painted on the wall (behind the sconce) */
function wallGlow(c, x, y, z, dim, t) { const p = pr(x, y, z); const r = 240 * p[3] * 1.3; const fl = 0.94 + 0.06 * Math.sin(t * 13 + x);
  c.save(); c.globalCompositeOperation = 'lighter'; let g = c.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, rgba('#8A5426', 0.55 * dim * fl)); g.addColorStop(0.35, rgba('#5A341A', 0.3 * dim * fl)); g.addColorStop(1, rgba('#2A160A', 0));
  c.fillStyle = g; c.beginPath(); c.ellipse(p[0], p[1], r * 0.85, r * 1.15, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
/** wall sconce: dark back plate, small shade, bright bulb + bloom */
export function sconce(c, x, y, z, dim = 1, t = 0) { const p = pr(x, y, z), s = p[3]; const fl = 0.92 + 0.08 * Math.sin(t * 17 + x * 0.1);
  c.fillStyle = '#1A120C'; c.fillRect(p[0] - 9 * s, p[1] - 4 * s, 18 * s, 44 * s); c.fillStyle = '#3A2414'; c.fillRect(p[0] - 11 * s, p[1] - 10 * s, 22 * s, 10 * s);
  c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(p[0], p[1], 0, p[0], p[1], 46 * s); g.addColorStop(0, rgba(P.bulb, 0.95 * dim * fl)); g.addColorStop(0.25, rgba(P.glow, 0.45 * dim * fl)); g.addColorStop(1, rgba(P.glow, 0));
  c.fillStyle = g; c.beginPath(); c.arc(p[0], p[1], 46 * s, 0, Math.PI * 2); c.fill(); c.restore();
  c.fillStyle = rgba(P.bulb, dim); c.beginPath(); c.arc(p[0], p[1] + 1 * s, 4.5 * s, 0, Math.PI * 2); c.fill(); }
/** a soft warm pool of light on the floor / a table top */
export function pool(c, x, y, z, r, a = 0.35, col = P.glow) { const p = pr(x, y, z), q = pr(x + r, y, z), q2 = pr(x, y, z + r); const rx = Math.abs(q[0] - p[0]), ry = Math.max(4, Math.abs(q2[1] - p[1]));
  c.save(); c.globalCompositeOperation = 'lighter'; c.translate(p[0], p[1]); c.scale(1, ry / rx); const g = c.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx, 0, Math.PI * 2); c.fill(); c.restore(); }
/** final grade: corner vignette + faint warm haze */
export function vignette(c, k = 0.6) { const g = c.createRadialGradient(W / 2, H * 0.55, H * 0.35, W / 2, H * 0.55, H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(5,3,2,${k})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }

/* ── depth of field: render a layer offscreen and blur it ── */
const OFF = {}; export function layer(name) { if (!OFF[name]) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; OFF[name] = cv; } const cv = OFF[name]; const x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); return [cv, x]; }
/** draw fn into an offscreen layer, then composite it with a blur of px (0 = sharp) */
export function dof(c, px, fn, name = 'L') { if (px < 0.3) { fn(c); return; } const [cv, x] = layer(name); fn(x); c.save(); c.filter = `blur(${px.toFixed(1)}px)`; c.drawImage(cv, 0, 0); c.restore(); }

/* ── 2D overlay: HUD, captions, annotations ── */
const FONT = (w, s, f = SERIF) => `${w} ${s}px ${f}`;
export function text(c, s, x, y, { size = 26, w = 700, col = P.hud, a = 1, align = 'left', base = 'middle', font = SERIF, ls = 1, shadow = true } = {}) {
  c.save(); c.font = FONT(w, size, font); c.letterSpacing = ls + 'px'; c.textAlign = align; c.textBaseline = base; c.globalAlpha = a;
  if (shadow) { c.shadowColor = 'rgba(0,0,0,0.75)'; c.shadowBlur = 8; } c.fillStyle = col; c.fillText(s, x, y); const wd = c.measureText(s).width; c.restore(); return wd; }
export function measure(c, s, size, w = 700, font = SERIF, ls = 1) { c.save(); c.font = FONT(w, size, font); c.letterSpacing = ls + 'px'; const m = c.measureText(s).width; c.restore(); return m; }
/** checklist HUD top-left. items: [{t, state:0 empty|1 current|2 done}] ; title + 'n/N' italic */
export function checklist(c, title, items, { x = 64, y = 56, a = 1, pop = null } = {}) {
  const done = items.filter(i => i.state === 2).length; const tw = text(c, title, x, y, { size: 24, w: 600, col: rgba(P.hud, 0.82), a, ls: 2 });
  text(c, `${done}/${items.length}`, x + tw + 14, y + 1, { size: 26, w: 500, font: ITAL, col: P.gold, a, ls: 0 });
  const out = [{ id: 'hud', text: title, x0: x, y0: y - 14, x1: x + tw, y1: y + 14 }];
  items.forEach((it, i) => { const yy = y + 50 + i * 44; const cur = it.state === 1, dn = it.state === 2; const al = a * (cur ? 1 : dn ? 0.92 : 0.6);
    if (cur) text(c, '-', x - 16, yy, { size: 30, w: 700, col: P.capWhite, a: al });
    c.save(); c.globalAlpha = al; c.strokeStyle = dn ? P.gold : P.hud; c.lineWidth = 2; c.strokeRect(x + 2, yy - 11, 22, 22);
    if (dn) { const k = pop && pop[i] != null ? pop[i] : 1; c.strokeStyle = P.gold; c.lineWidth = 3.4; c.lineCap = 'round'; c.beginPath(); const L = [[x + 6, yy], [x + 12, yy + 7], [x + 26, yy - 12]]; c.moveTo(...L[0]);
      if (k < 0.5) c.lineTo(lerp(L[0][0], L[1][0], k * 2), lerp(L[0][1], L[1][1], k * 2)); else { c.lineTo(...L[1]); c.lineTo(lerp(L[1][0], L[2][0], (k - 0.5) * 2), lerp(L[1][1], L[2][1], (k - 0.5) * 2)); } c.stroke(); }
    c.restore(); const ww = text(c, it.t, x + 38, yy, { size: 30, w: cur ? 900 : 700, col: cur ? P.capWhite : P.hud, a: al, ls: 2 });
    out.push({ id: 'hud' + i, text: it.t, x0: x + 38, y0: yy - 16, x1: x + 38 + ww, y1: yy + 16 }); });
  return out;
}
/** bottom caption: lines = [[{t, k:'gold'|'red'}...]]; gold keyword gets an underline */
export const CAP = { size: 52, y1: 1004, l1: 944, l2: 1010 };
export function caption(c, lines, { a = 1, dy = 0, under = 1 } = {}) {
  if (a <= 0) return []; const out = []; const ys = lines.length === 1 ? [CAP.y1] : [CAP.l1, CAP.l2];
  // soft dark bed so white/gold always read ≥4.5:1 even over a lit diorama
  const g = c.createLinearGradient(0, ys[0] - 90, 0, H); g.addColorStop(0, 'rgba(10,6,4,0)'); g.addColorStop(0.45, `rgba(10,6,4,${0.5 * a})`); g.addColorStop(1, `rgba(10,6,4,${0.62 * a})`); c.fillStyle = g; c.fillRect(0, ys[0] - 90, W, H - ys[0] + 90);
  lines.forEach((ln, i) => { c.save(); c.font = FONT(900, CAP.size); c.letterSpacing = '3px'; const ws = ln.map(s => c.measureText(s.t).width); const tot = ws.reduce((p, q) => p + q, 0); let x = W / 2 - tot / 2; const y = ys[i] + dy;
    c.textBaseline = 'middle'; c.globalAlpha = a; c.shadowColor = 'rgba(0,0,0,0.85)'; c.shadowBlur = 12; c.shadowOffsetY = 2;
    ln.forEach((s, j) => { c.fillStyle = s.k === 'gold' ? P.gold : s.k === 'red' ? P.coral : P.capWhite; c.fillText(s.t, x, y);
      if (s.k === 'gold' && under > 0) { c.shadowBlur = 0; c.fillStyle = rgba(P.gold, 0.9); c.fillRect(x + 2, y + 33, (ws[j] - 6) * under, 3); c.shadowBlur = 12; } x += ws[j]; });
    c.restore(); const s = ln.map(q => q.t).join(''); out.push({ id: 'cap' + i, text: s, x0: W / 2 - tot / 2, y0: y - 30, x1: W / 2 + tot / 2, y1: y + 30 }); });
  return out;
}
/** inline formula row: parts = [{t, k:'it'|'red'|'gold'|'w'}] — italic coral multipliers like 「高度 ×4 → 时间 ×2」 */
export function formula(c, parts, x, y, { size = 34, a = 1, align = 'center' } = {}) {
  const ms = parts.map(p => measure(c, p.t, p.k === 'it' || p.k === 'red' ? size * 1.15 : size, p.k === 'it' || p.k === 'red' ? 500 : 900, p.k === 'it' || p.k === 'red' ? ITAL : SERIF, 1) + 6);
  const tot = ms.reduce((p, q) => p + q, 0); let xx = align === 'center' ? x - tot / 2 : x; const x0 = xx;
  parts.forEach((p, i) => { const it = p.k === 'it' || p.k === 'red'; text(c, p.t, xx, y, { size: it ? size * 1.15 : size, w: it ? 500 : 900, font: it ? ITAL : SERIF, col: p.k === 'red' ? P.coral : p.k === 'gold' ? P.gold : P.capWhite, a, ls: 1 }); xx += ms[i]; });
  return { x0, x1: x0 + tot, y0: y - size * 0.6, y1: y + size * 0.6 };
}
/** vertical measure bracket with ticks + label (桌高 3米 style) */
export function measureBar(c, x, yTop, yBot, label, big, { a = 1, k = 1 } = {}) { const y1 = lerp(yBot, yTop, k); c.save(); c.globalAlpha = a; c.strokeStyle = rgba(P.gold, 0.85); c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(x, yBot); c.lineTo(x, y1); c.moveTo(x - 9, yBot); c.lineTo(x + 9, yBot); c.moveTo(x - 9, y1); c.lineTo(x + 9, y1); c.stroke();
  c.setLineDash([3, 6]); c.strokeStyle = rgba(P.gold, 0.4); c.beginPath(); c.moveTo(x - 260, y1); c.lineTo(x - 12, y1); c.stroke(); c.restore();
  if (label) text(c, label, x + 22, (yBot + y1) / 2 - 26, { size: 22, w: 600, col: P.hud, a }); if (big) text(c, big, x + 22, (yBot + y1) / 2 + 14, { size: 40, w: 900, col: P.gold, a }); }
/** thin gold leader + label (tag on a 3D point) */
export function leader(c, sx, sy, tx, ty, label, { a = 1, size = 26, col = P.capWhite } = {}) { c.save(); c.globalAlpha = a; c.strokeStyle = rgba(P.gold, 0.8); c.lineWidth = 1.4; c.beginPath(); c.moveTo(sx, sy); c.lineTo(tx, ty); c.stroke();
  c.fillStyle = P.gold; c.beginPath(); c.arc(sx, sy, 3, 0, 7); c.fill(); c.restore(); const w = text(c, label, tx + (tx >= sx ? 8 : -8), ty, { size, w: 900, col, a, align: tx >= sx ? 'left' : 'right' });
  return { x0: tx >= sx ? tx + 8 : tx - 8 - w, x1: tx >= sx ? tx + 8 + w : tx - 8, y0: ty - size * 0.6, y1: ty + size * 0.6 }; }
/** ring gauge (top-right 落地前，转了 style): k = 0..1 arc, label above, centre content via fn */
export function ringGauge(c, x, y, r, k, label, { a = 1, col = P.gold, inner = null } = {}) { c.save(); c.globalAlpha = a; c.strokeStyle = rgba(P.hud, 0.25); c.lineWidth = 3; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  c.strokeStyle = col; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(k)); c.stroke();
  const e = -Math.PI / 2 + Math.PI * 2 * clamp(k); c.fillStyle = col; c.beginPath(); c.arc(x + Math.cos(e) * r, y + Math.sin(e) * r, 6, 0, 7); c.fill(); c.restore();
  if (inner) inner(x, y); if (label) text(c, label, x, y - r - 30, { size: 22, w: 600, col: P.hud, a, align: 'center', ls: 2 }); }
/** small italic serif line at top centre (subtitle / quote) */
export function topLine(c, s, { a = 1, y = 112, size = 24 } = {}) { const w = text(c, s, W / 2, y, { size, w: 600, col: rgba(P.hud, 0.85), a, align: 'center', ls: 3 }); return { id: 'top', text: s, x0: W / 2 - w / 2, x1: W / 2 + w / 2, y0: y - 14, y1: y + 14 }; }
/** big red serif title with a thin dash subline (倒霉定律 — style) */
export function bigTitle(c, s, sub, x, y, { a = 1, size = 92, col = P.red } = {}) { const w = text(c, s, x, y, { size, w: 900, col, a, align: 'center', ls: 8 });
  if (sub) text(c, '— ' + sub, x, y + size * 0.78, { size: 24, w: 600, col: P.hud, a: a * 0.9, align: 'center', ls: 3 }); return { x0: x - w / 2, x1: x + w / 2, y0: y - size / 2, y1: y + size / 2 }; }
