/** props.js — own-murphy-panel miniature props. Every prop is a small solid built from look.js primitives (box / prism /
 * faces on a plane), lit by the same upper-left key, and placed in world units on the diorama.
 * Grammar (STYLE §13): wood body + one muted accent colour + one emissive detail (screen, flame, glowing glyph). */
import { P, pr, box, prism, face, shade, rgba, rnd, clamp, lerp, line3, clip3, CAM, v3, lam, text, SERIF, mix } from './look.js';
/** map a world-space plane (origin o, edge vectors ex, ey) to a w×h drawing space; fn(c) draws inside */
export function onPlane(c, o, ex, ey, w, h, fn) { const a = pr(...o), b = pr(o[0] + ex[0], o[1] + ex[1], o[2] + ex[2]), d = pr(o[0] + ey[0], o[1] + ey[1], o[2] + ey[2]);
  c.save(); c.transform((b[0] - a[0]) / w, (b[1] - a[1]) / w, (d[0] - a[0]) / h, (d[1] - a[1]) / h, a[0], a[1]); fn(c); c.restore(); }
/** 1 · hexagonal wooden platform with a terracotta tile top (or terrazzo / plank) */
export function hexPlatform(c, x, z, R, h = 40, { top = 'tile', rot = Math.PI / 6, cell = 34, k = 1 } = {}) {
  const T = prism(c, x, 0, z, R, h, P.wood, { n: 6, rot, k, top: top === 'tile' ? P.tile : top === 'terrazzo' ? P.terrazzo : P.woodLite,
    sideTex: (q) => { for (let i = 1; i < 4; i++) { const yy = q[0][1] + h * i / 4; line3(c, [q[0][0], yy, q[0][2]], [q[1][0], yy, q[1][2]], '#2A1408', 1, 0.35); } } });
  c.save(); clip3(c, T); surface(c, x, h, z, R, top, cell); c.restore();
  // lit rim
  c.strokeStyle = rgba(P.woodEdge, 0.55); c.lineWidth = 2; c.beginPath(); T.forEach((p, i) => { const s = pr(...p); i ? c.lineTo(s[0], s[1]) : c.moveTo(s[0], s[1]); }); c.closePath(); c.stroke();
  return h;
}
/** 2 · square platform (terrazzo, like the supermarket board) */
export function squarePlatform(c, x, z, w, d, h = 30, { top = 'terrazzo', ry = 0, cell = 40 } = {}) {
  const b = box(c, x, 0, z, w, h, d, P.woodDark, { ry, top: top === 'tile' ? P.tile : P.terrazzo });
  c.save(); clip3(c, b.top); surface(c, x, h, z, Math.max(w, d), top, cell); c.restore(); return h; }
function surface(c, x, y, z, R, top, cell) {
  if (top === 'tile') { for (let u = -R; u <= R; u += cell) { line3(c, [x + u, y, z - R], [x + u, y, z + R], P.grout, 1.6, 0.85); line3(c, [x - R, y, z + u], [x + R, y, z + u], P.grout, 1.6, 0.85); }
    const r = rnd(3); for (let u = -R; u < R; u += cell) for (let v = -R; v < R; v += cell) { if (r() < 0.25) { const q = [[x + u + 2, y, z + v + 2], [x + u + cell - 2, y, z + v + 2], [x + u + cell - 2, y, z + v + cell - 2], [x + u + 2, y, z + v + cell - 2]]; face(c, q, P.tileLite, { n: [0, 1, 0], alpha: 0.35, force: true }); } } }
  else if (top === 'terrazzo') { const r = rnd(9); for (let i = 0; i < 900; i++) { const p = pr(x + (r() * 2 - 1) * R, y, z + (r() * 2 - 1) * R); c.fillStyle = r() < 0.7 ? rgba(P.speck, 0.7) : rgba('#E8D2B0', 0.7); c.fillRect(p[0], p[1], 1.5 + r() * 2 * p[3], 1.5 + r() * 1.4 * p[3]); }
    for (let u = -R; u <= R; u += cell) { line3(c, [x + u, y, z - R], [x + u, y, z + R], '#7B5A3A', 1, 0.35); line3(c, [x - R, y, z + u], [x + R, y, z + u], '#7B5A3A', 1, 0.35); } }
  else { for (let u = -R; u <= R; u += 22) line3(c, [x - R, y, z + u], [x + R, y, z + u], '#3E2010', 1, 0.5); }
}
/** 3 · round party table (pedestal) */
export function roundTable(c, x, z, r, h, { col = P.tableGreen, y = 0 } = {}) { prism(c, x, y, z, r * 0.16, h - 6, P.woodDark, { n: 14 }); prism(c, x, y, z, r * 0.45, 4, P.woodDark, { n: 18 });
  prism(c, x, y + h - 6, z, r, 6, col, { n: 32, k: 1.02 }); return y + h; }
/** 4 · four-legged table (pale green, thin legs — the "桌子" of the source) */
export function table(c, x, z, w, d, h, { col = P.tableGreen, y = 0 } = {}) { const lw = Math.max(3, w * 0.05);
  const legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]].sort((a, b) => a[1] - b[1]);
  for (const [i, j] of legs) box(c, x + i * (w / 2 - lw), y, z + j * (d / 2 - lw), lw, h - 5, lw, col, { k: 0.95 });
  box(c, x, y + h - 5, z, w, 5, d, col); return y + h; }
/** 5 · birthday cake: two tiers + candles (lit flames flicker with t) */
export function cake(c, x, y, z, s = 1, { candles = 5, lit = 1, t = 0 } = {}) { prism(c, x, y, z, 26 * s, 3, '#E8E2D6', { n: 24 }); prism(c, x, y + 3, z, 22 * s, 13 * s, '#E9CFA8', { n: 24 });
  prism(c, x, y + 3 + 13 * s, z, 22.5 * s, 2.5 * s, '#F4EAD8', { n: 24 }); prism(c, x, y + 18.5 * s, z, 14 * s, 9 * s, '#D98E7C', { n: 22 }); prism(c, x, y + 27.5 * s, z, 14.5 * s, 2 * s, '#F6EEE0', { n: 22 });
  for (let i = 0; i < candles; i++) { const a = i / candles * Math.PI * 2 + 0.3, cx = x + Math.cos(a) * 9 * s, cz = z + Math.sin(a) * 9 * s; box(c, cx, y + 29 * s, cz, 2.2 * s, 9 * s, 2.2 * s, i % 2 ? '#8FB3C9' : '#E7C35E');
    if (lit > 0) { const f = pr(cx, y + 41 * s, cz), k = f[3]; const fl = 1 + 0.15 * Math.sin(t * 23 + i * 2); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(f[0], f[1], 0, f[0], f[1], 10 * k * s);
      g.addColorStop(0, rgba(P.bulb, 0.55 * lit)); g.addColorStop(1, rgba(P.glow, 0)); c.fillStyle = g; c.beginPath(); c.arc(f[0], f[1], 10 * k * s, 0, 7); c.fill(); c.restore();
      c.fillStyle = rgba('#FFE7A8', lit); c.beginPath(); c.ellipse(f[0], f[1], 1.6 * k * s, 3.4 * k * s * fl, 0, 0, 7); c.fill(); } } }
/** 6 · gift box with ribbon */
export function gift(c, x, y, z, s = 1, col = P.rose, { ry = 0.3 } = {}) { const b = box(c, x, y, z, 22 * s, 18 * s, 22 * s, col, { ry, top: shade(col, 1.0) });
  const cs = Math.cos(ry), sn = Math.sin(ry); const T = b.top; line3(c, mid(T[0], T[1]), mid(T[2], T[3]), P.gold, 3 * pr(x, y, z)[3], 0.95); line3(c, mid(T[1], T[2]), mid(T[3], T[0]), P.gold, 3 * pr(x, y, z)[3], 0.95);
  const tp = pr(x, y + 18 * s, z); c.fillStyle = P.gold; c.beginPath(); c.ellipse(tp[0] - 5 * tp[3] * s, tp[1] - 3 * tp[3] * s, 5 * tp[3] * s, 3.4 * tp[3] * s, -0.5, 0, 7); c.ellipse(tp[0] + 5 * tp[3] * s, tp[1] - 3 * tp[3] * s, 5 * tp[3] * s, 3.4 * tp[3] * s, 0.5, 0, 7); c.fill(); }
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
/** 7 · glowing wooden letter block (墨菲 blocks): glow 0..1 lights the carved glyph */
export function letterBlock(c, x, y, z, s, ch, { glow = 1, ry = 0, t = 0 } = {}) {
  const b = box(c, x, y, z, s, s, s, P.wood, { ry, top: P.woodLite, k: 0.9 + 0.25 * glow });
  // carved glyph on the camera-facing side
  const cs = Math.cos(ry), sn = Math.sin(ry); const o = [x - s / 2 * cs + s / 2 * sn, y + s, z + s / 2 * sn * 0 + s / 2 * cs + s / 2 * sn * 0];
  const o2 = [x - s / 2 * cs + s / 2 * sn, y + s, z + s / 2 * sn + s / 2 * cs]; const ex = [s * cs, 0, -s * sn], ey = [0, -s, 0];
  onPlane(c, o2, ex, ey, 100, 100, (q) => { q.textAlign = 'center'; q.textBaseline = 'middle'; q.font = `900 78px ${SERIF}`;
    q.fillStyle = 'rgba(30,14,4,0.55)'; q.fillText(ch, 51, 55);
    if (glow > 0) { q.shadowColor = rgba('#FFB547', 0.95 * glow); q.shadowBlur = 26; q.fillStyle = mix('#7A4A20', '#FFD27A', glow); q.fillText(ch, 50, 53); q.shadowBlur = 8; q.fillStyle = rgba('#FFF1C4', 0.9 * glow); q.fillText(ch, 50, 53); } });
  if (glow > 0) { const p = pr(x, y + s / 2, z + s / 2); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(p[0], p[1], 0, p[0], p[1], s * 1.5 * p[3]); g.addColorStop(0, rgba('#FFB040', 0.22 * glow)); g.addColorStop(1, rgba('#FFB040', 0)); c.fillStyle = g; c.fillRect(p[0] - s * 2 * p[3], p[1] - s * 2 * p[3], s * 4 * p[3], s * 4 * p[3]); c.restore(); }
  return b; }
/** 8 · easel grid board: a vertical cream board of cols×rows cells, every cell a true perspective quad; cell(i) → null | colour */
export function gridBoard(c, x, y, z, w, h, cols, rows, cell = () => null, { title = null, legs = true, n = cols * rows } = {}) {
  if (legs) { box(c, x - w * 0.36, 0, z - 6, 6, y + h * 0.9, 6, P.woodDark); box(c, x + w * 0.36, 0, z - 6, 6, y + h * 0.9, 6, P.woodDark); box(c, x, 0, z - 34, 6, y + h * 0.8, 6, P.woodDark); }
  box(c, x, y - 8, z - 4, w + 16, h + 16, 8, P.wood, { top: P.woodLite });
  const zf = z + 0.5, x0 = x - w / 2, Y1 = y + h; const q = (a, b, cc, d) => [[a, b, zf], [cc, b, zf], [cc, d, zf], [a, d, zf]];
  face(c, q(x0, Y1, x0 + w, y), '#EFE6D2', { n: [0, 0, 1], k: 1.0, force: true });
  const top = title ? h * 0.12 : h * 0.03, pad = w * 0.025, cw = (w - pad * 2) / cols, ch = (h - top - pad) / rows;
  if (title) { const p = pr(x0 + pad, Y1 - top * 0.5, zf); c.save(); c.font = `900 ${Math.round(top * 0.55 * p[3])}px ${SERIF}`; c.fillStyle = P.ink; c.textBaseline = 'middle'; c.fillText(title, p[0], p[1]); c.restore(); }
  const out = [];
  for (let i = 0; i < n; i++) { const cx = x0 + pad + (i % cols) * cw, cy = Y1 - top - Math.floor(i / cols) * ch; const v = cell(i);
    face(c, q(cx + 1, cy - 1, cx + cw - 1, cy - ch + 1), v || '#D9CCB2', { n: [0, 0, 1], k: v ? 1.05 : 0.95, force: true }); out[i] = pr(cx + cw / 2, cy - ch / 2, zf); }
  return out;
}
/** 9 · vertical gauge bar (red fill rising in a wooden frame) with tick marks; k 0..1 */
export function gaugeBar(c, x, y, z, w, h, k, { col = P.red, ticks = 10, mark = null } = {}) { box(c, x, y, z, w + 8, h + 8, 8, P.woodDark);
  onPlane(c, [x - w / 2, y + h + 4, z + 4.2], [w, 0, 0], [0, -h, 0], 100, 1000, (q) => { q.fillStyle = '#2A1810'; q.fillRect(0, 0, 100, 1000); const fh = 1000 * clamp(k);
    const g = q.createLinearGradient(0, 0, 100, 0); g.addColorStop(0, shade(col, 1.25)); g.addColorStop(0.6, col); g.addColorStop(1, shade(col, 0.65)); q.fillStyle = g; q.fillRect(6, 1000 - fh, 88, fh);
    q.fillStyle = 'rgba(255,230,200,0.35)'; for (let i = 1; i < ticks; i++) q.fillRect(0, 1000 * i / ticks - 2, 30, 4);
    if (mark != null) { q.fillStyle = P.gold; q.fillRect(0, 1000 * (1 - mark) - 4, 100, 8); } }); }
/** 10 · bookshelf with muted coloured books */
export function bookshelf(c, x, z, w, h, d = 30, { ry = 0, seed = 2 } = {}) { box(c, x, 0, z, w, h, d, P.wood, { ry, top: P.woodLite }); const r = rnd(seed);
  const shelves = 3; onPlane(c, [x - w / 2 + 4, h - 4, z + d / 2 + 0.5], [w - 8, 0, 0], [0, -(h - 8), 0], 1000, 1000 * (h - 8) / (w - 8), (q) => { const hh = 1000 * (h - 8) / (w - 8), sh = hh / shelves;
    for (let s = 0; s < shelves; s++) { q.fillStyle = '#2B170C'; q.fillRect(0, s * sh, 1000, sh - 14); let xx = 8; while (xx < 980) { const bw = 34 + r() * 30, bh = sh * (0.55 + r() * 0.3); const cols = [P.sage, P.terra, P.mustard, P.rose, '#E6D6A0', P.olive, '#D7A07A'];
      const col = cols[Math.floor(r() * cols.length)]; const g = q.createLinearGradient(xx, 0, xx + bw, 0); g.addColorStop(0, shade(col, 1.12)); g.addColorStop(1, shade(col, 0.72)); q.fillStyle = g; q.fillRect(xx, s * sh + sh - 14 - bh, bw - 4, bh); xx += bw; }
      q.fillStyle = P.woodLite; q.fillRect(0, s * sh + sh - 14, 1000, 14); } }); }
/** 11 · chair (wood, small back) */
export function chair(c, x, z, s = 1, { ry = 0, col = P.wood } = {}) { const cs = Math.cos(ry), sn = Math.sin(ry);
  for (const [i, j] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(c, x + (i * cs + j * sn) * 9 * s, 0, z + (-i * sn + j * cs) * 9 * s, 2.6 * s, 18 * s, 2.6 * s, col);
  box(c, x, 18 * s, z, 22 * s, 3 * s, 22 * s, col, { ry, top: P.woodLite }); box(c, x - sn * 10 * s, 21 * s, z - cs * 10 * s, 22 * s, 18 * s, 2.6 * s, col, { ry }); }
/** 12 · balloon on a string, bobbing */
export function balloon(c, x, y, z, s = 1, col = P.coral, t = 0) { const b = pr(x, y, z), top = pr(x + Math.sin(t * 1.3 + x) * 3, y + 60 * s, z); const r = 11 * s * top[3];
  c.strokeStyle = 'rgba(240,225,200,0.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(b[0], b[1]); c.quadraticCurveTo(b[0] + 6, (b[1] + top[1]) / 2, top[0], top[1] + r * 1.15); c.stroke();
  const g = c.createRadialGradient(top[0] - r * 0.4, top[1] - r * 0.4, r * 0.1, top[0], top[1], r * 1.2); g.addColorStop(0, shade(col, 1.45)); g.addColorStop(0.5, col); g.addColorStop(1, shade(col, 0.55)); c.fillStyle = g;
  c.beginPath(); c.ellipse(top[0], top[1], r, r * 1.18, 0, 0, 7); c.fill(); c.fillStyle = shade(col, 0.7); c.beginPath(); c.moveTo(top[0] - 3, top[1] + r * 1.25); c.lineTo(top[0] + 3, top[1] + r * 1.25); c.lineTo(top[0], top[1] + r * 1.1); c.fill(); }
/** 13 · checkout counter with a little register screen (emissive) */
export function counter(c, x, z, w, s = 1, { ry = 0 } = {}) { box(c, x, 0, z, w, 34 * s, 26 * s, P.clay, { ry, top: '#5B3420' });
  box(c, x + w * 0.3, 34 * s, z, 18 * s, 10 * s, 14 * s, '#E2D5BC', { ry }); const p = pr(x + w * 0.3, 52 * s, z + 2); const k = p[3];
  c.fillStyle = '#E2D5BC'; c.fillRect(p[0] - 10 * k * s, p[1] - 8 * k * s, 20 * k * s, 15 * k * s); c.fillStyle = '#20262A'; c.fillRect(p[0] - 8 * k * s, p[1] - 6.5 * k * s, 16 * k * s, 11 * k * s); c.fillStyle = 'rgba(160,210,220,0.25)'; c.fillRect(p[0] - 8 * k * s, p[1] - 6.5 * k * s, 16 * k * s, 4 * k * s); }
/** 14 · toast (the Murphy bread) — butter side marked; spin = rotation in radians */
export function toast(c, sx, sy, sc = 1, spin = 0, { butter = true } = {}) { c.save(); c.translate(sx, sy); c.rotate(spin); c.scale(sc, sc);
  c.fillStyle = '#B9733C'; c.beginPath(); c.roundRect(-30, -22, 60, 44, [16, 16, 6, 6]); c.fill(); c.fillStyle = '#EBC487'; c.beginPath(); c.roundRect(-25, -17, 50, 35, [12, 12, 4, 4]); c.fill();
  if (butter) { c.fillStyle = '#F8E27A'; c.beginPath(); c.roundRect(-11, -8, 22, 15, 3); c.fill(); } c.restore(); }
/** 15 · number flag post (queue number 1/2/3 style) */
export function flagPost(c, x, z, h, label) { box(c, x, 0, z, 3, h, 3, P.woodDark); const p = pr(x, h, z), k = p[3]; c.fillStyle = '#EFE6D2'; c.strokeStyle = P.woodDark; c.lineWidth = 2;
  c.fillRect(p[0] + 2, p[1], 30 * k, 26 * k); c.strokeRect(p[0] + 2, p[1], 30 * k, 26 * k); c.fillStyle = P.ink; c.font = `900 ${20 * k}px ${SERIF}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(label, p[0] + 2 + 15 * k, p[1] + 13 * k); c.textAlign = 'left';
  c.fillStyle = P.gold; c.beginPath(); c.arc(p[0], p[1] - 3, 3 * k, 0, 7); c.fill(); }
/** 16 · tear-off desk calendar showing a date (vertical card on a wooden base) */
export function deskCalendar(c, x, y, z, s, month, day, { col = P.red } = {}) { box(c, x, y, z, 40 * s, 6 * s, 20 * s, P.wood);
  onPlane(c, [x - 17 * s, y + 46 * s, z + 2], [34 * s, 0, 0], [0, -40 * s, 0], 100, 118, (q) => { q.fillStyle = '#F2EAD8'; q.fillRect(0, 0, 100, 118); q.fillStyle = col; q.fillRect(0, 0, 100, 30);
    q.fillStyle = '#FFF4E4'; q.font = `900 20px ${SERIF}`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(month, 50, 16); q.fillStyle = P.ink; q.font = `900 64px ${SERIF}`; q.fillText(day, 50, 76); }); }
/** gold pair line between two screen points with a travelling spark (used by the pair-count pattern) */
export function pairLine(c, a, b, k = 1, { col = P.gold, alpha = 0.5, lw = 1.3 } = {}) { if (k <= 0) return; const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k);
  c.strokeStyle = rgba(col, alpha); c.lineWidth = lw; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(x, y); c.stroke(); if (k < 1) { c.fillStyle = rgba('#FFE9B0', 0.9); c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); } }
export const PROP_NAMES = ['hexPlatform', 'squarePlatform', 'roundTable', 'table', 'cake', 'gift', 'letterBlock', 'gridBoard', 'gaugeBar', 'bookshelf', 'chair', 'balloon', 'counter', 'toast', 'flagPost', 'deskCalendar', 'sconce', 'pairLine'];
