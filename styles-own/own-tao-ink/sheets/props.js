/** props.js — Tao Ink prop kit (all pure Canvas2D, all take k = entrance progress where it makes sense).
 * Grammar (STYLE §13): flat ink silhouette OR flat wash shape + ONE red accent; no outlines on fills; no gradients except
 * wash fades and the paper; red only for the one thing the line is about. */
import { P, W, H, BRUSH, SERIF, clamp, lerp, rng, rgba, splatter, dryBrush, seal, roundRect } from './look.js';
const D = Math.PI / 180;
const _cache = new Map();
/* 1 brushChar — giant brush characters (4550 道/无为/道家), write-on along a boustrophedon brush path, 飞白 + splatter. */
export function brushChar(ctx, text, cx, cy, size, { k = 1, seed = 9, dry = 1, color = P.ink, splat = 1, gap = 0.96, vertical = false, weight = 1 } = {}) {
  if (k <= 0) return; const key = text + size + seed + dry + color + vertical + weight;
  let c = _cache.get(key);
  if (!c) { c = document.createElement('canvas'); const n = text.length; c.width = Math.ceil(vertical ? size * 1.3 : size * (n * gap + 0.3)); c.height = Math.ceil(vertical ? size * (n * gap + 0.3) : size * 1.3);
    const x = c.getContext('2d'); x.font = `400 ${size}px ${BRUSH}`; x.fillStyle = color; x.textBaseline = 'middle'; x.textAlign = 'center';
    [...text].forEach((ch, i) => { const px = vertical ? c.width / 2 : size * (0.65 + i * gap), py = vertical ? size * (0.65 + i * gap) : c.height / 2;
      x.save(); x.translate(px, py); x.rotate((rng(seed + i)() - 0.5) * 0.05); x.strokeStyle = color; x.lineJoin = 'round'; x.lineWidth = size * 0.04 * weight; x.strokeText(ch, 0, 0); x.fillText(ch, 0, 0);
      x.globalAlpha = 0.25; x.fillText(ch, 2.5, 1.5); x.restore(); });   // second pass offset → wet edge
    dryBrush(x, 0, 0, c.width, c.height, { seed, amt: dry, n: 120, angle: -0.18 });
    _cache.set(key, c); }
  const m = document.createElement('canvas'); m.width = c.width; m.height = c.height; const mx = m.getContext('2d');
  mx.drawImage(c, 0, 0);
  if (k < 1) { const rows = 4, w = c.width, h = c.height, pts = []; for (let r = 0; r < rows; r++) { const y = h * (r + 0.5) / rows; if (vertical) { pts.push([w * (r + .5) / rows, 0], [w * (r + .5) / rows, h]); } else pts.push([0, y], [w, y]); }
    // vertical writing: columns left→right top→bottom per char; horizontal: rows. Keep simple: sweep per character.
    const msk = document.createElement('canvas'); msk.width = w; msk.height = h; const kx = msk.getContext('2d'); kx.lineCap = 'round'; kx.strokeStyle = '#000';
    const n = text.length, per = 1 / n;
    for (let i = 0; i < n; i++) { const kk = clamp((k - i * per) / per); if (kk <= 0) break;
      const bx = vertical ? 0 : size * (0.15 + i * gap), by = vertical ? size * (0.15 + i * gap) : 0, bw = vertical ? w : size, bh = vertical ? size : h;
      const segs = 5; kx.lineWidth = bh / segs * 1.5; for (let s = 0; s < segs; s++) { const sk = clamp(kk * segs - s); if (sk <= 0) break; const y = by + bh * (s + 0.5) / segs; const dir = s % 2 ? -1 : 1;
        const x0 = dir > 0 ? bx : bx + bw, x1 = x0 + dir * bw * sk; kx.beginPath(); kx.moveTo(x0, y); kx.lineTo(x1, y + (s % 2 ? -1 : 1) * 6); kx.stroke(); } }
    mx.globalCompositeOperation = 'destination-in'; mx.drawImage(msk, 0, 0); }
  ctx.drawImage(m, cx - c.width / 2, cy - c.height / 2);
  if (splat) splatter(ctx, cx, cy, size * 0.7 * Math.max(1, text.length * 0.6), { seed: seed + 3, n: Math.round(30 * splat), k: clamp((k - 0.6) / 0.4) });
}
/* 2 inkMountains — layered wash ridges, far = pale, near = darker, soft bottoms (4550 t23.5 / t46.5). */
export function inkMountains(ctx, x0, x1, base, h, { seed = 4, layers = 3, color = P.inkSoft, a = 1, night = false } = {}) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let L = 0; L < layers; L++) { const r = rng(seed + L * 7), hh = h * (1 - L * 0.22), yb = base + L * h * 0.12;
    const g = ctx.createLinearGradient(0, yb - hh, 0, yb + 30); const al = night ? 0.25 + L * 0.2 : 0.18 + L * 0.2;
    g.addColorStop(0, rgba(color, al)); g.addColorStop(0.7, rgba(color, al * 0.5)); g.addColorStop(1, rgba(color, 0)); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(x0, yb + 30); let x = x0, y = yb - hh * 0.3; ctx.lineTo(x, y);
    while (x < x1) { const nx = x + 40 + r() * 110, peak = yb - hh * (0.25 + r() * 0.75); ctx.quadraticCurveTo((x + nx) / 2, peak - r() * hh * 0.2, nx, yb - hh * (0.15 + r() * 0.5)); x = nx; }
    ctx.lineTo(x1, yb + 30); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
/* 3 pine — tall thin ink trunk, tiers of flat green wash discs with black needle dabs on top (4550 t67.5). */
export function pine(ctx, x, y, h, { seed = 1, sway = 0, k = 1 } = {}) {
  if (k <= 0) return; const r = rng(seed); ctx.save(); ctx.globalAlpha *= clamp(k); ctx.lineCap = 'round';
  ctx.strokeStyle = P.ink; ctx.lineWidth = h * 0.022; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + (r() - .5) * h * 0.06, y - h * 0.5, x + sway * h * 0.02, y - h); ctx.stroke();
  const tiers = 4 + Math.floor(r() * 3);
  for (let i = 0; i < tiers; i++) { const ty = y - h * (0.35 + 0.62 * i / tiers), tw = h * (0.2 - 0.022 * i) * (0.8 + r() * 0.4), tx = x + sway * h * 0.02 * (ty < y - h * 0.6 ? 1 : 0.5) + (r() - .5) * h * 0.04;
    ctx.fillStyle = rgba(r() < 0.5 ? P.pine : P.pineLite, 0.55); ctx.beginPath(); ctx.ellipse(tx, ty - h * 0.012, tw * 0.6, h * 0.026, 0, 0, 7); ctx.fill();
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.moveTo(tx - tw * 0.55, ty); for (let j = 0; j <= 8; j++) ctx.lineTo(tx - tw * 0.55 + tw * 1.1 * j / 8, ty - (j % 2 ? h * 0.018 : h * 0.006) - r() * 3);
    ctx.lineTo(tx + tw * 0.5, ty + h * 0.006); ctx.quadraticCurveTo(tx, ty + h * 0.012, tx - tw * 0.55, ty); ctx.fill(); }
  ctx.restore();
}
/* 4 crookedTree — twisted ink trunk + 2–3 green wash canopy blobs (4550 t73.5 无用之用). */
export function crookedTree(ctx, x, y, h, { seed = 3, k = 1, sway = 0 } = {}) {
  if (k <= 0) return; const r = rng(seed); ctx.save(); ctx.globalAlpha *= clamp(k); ctx.lineCap = 'round'; ctx.strokeStyle = P.ink;
  const pts = [[x, y], [x - h * 0.14, y - h * 0.25], [x + h * 0.12, y - h * 0.42], [x - h * 0.05, y - h * 0.62]];
  for (let w = 3; w >= 1; w--) { ctx.lineWidth = h * 0.025 * w; ctx.globalAlpha = w === 3 ? 1 : 1; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1]); if (w === 3) ctx.stroke(); }
  const br = [[pts[2], [x + h * 0.32, y - h * 0.62]], [pts[1], [x - h * 0.34, y - h * 0.5]], [pts[3], [x + h * 0.08, y - h * 0.82]]];
  ctx.lineWidth = h * 0.028; br.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + (r() - .5) * h * 0.1, (a[1] + b[1]) / 2 - h * 0.08, b[0] + sway * 4, b[1]); ctx.stroke(); });
  [[x + h * 0.3, y - h * 0.68, 0.24], [x - h * 0.3, y - h * 0.56, 0.2], [x + h * 0.04, y - h * 0.86, 0.26]].forEach(([cx, cy, rr]) => {
    for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba(i % 2 ? P.pine : P.pineLite, 0.28); ctx.beginPath(); ctx.ellipse(cx + (r() - .5) * h * rr * 0.6 + sway * 6, cy + (r() - .5) * h * 0.06, h * rr * (0.5 + r() * 0.3), h * rr * 0.22, (r() - .5) * 0.3, 0, 7); ctx.fill(); }
    ctx.fillStyle = rgba(P.ink, 0.75); for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.ellipse(cx + (r() - .5) * h * rr * 1.2 + sway * 6, cy + (r() - .3) * h * 0.08, 5 + r() * 9, 2 + r() * 3, (r() - .5), 0, 7); ctx.fill(); } });
  ctx.restore();
}
/* 5 redSun — flat red disc with soft wash halo (4550 t23.5 / t49.5). */
export function redSun(ctx, x, y, R, { k = 1 } = {}) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  const g = ctx.createRadialGradient(x, y, R, x, y, R * 2.6); g.addColorStop(0, rgba(P.red, 0.18)); g.addColorStop(1, rgba(P.red, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R * 2.6, 0, 7); ctx.fill();
  ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x, y, R * (0.85 + 0.15 * clamp(k)), 0, 7); ctx.fill(); ctx.restore(); }
/* 6 water — sheet of pale wash with wavy blue-grey lines + broken red reflection under the sun (4550 t49.5 / t84.5). */
export function water(ctx, y0, y1, t, { sunX = null, a = 1 } = {}) { ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, P.water); g.addColorStop(1, P.water2); ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0);
  ctx.lineCap = 'round'; const n = 16; for (let i = 0; i < n; i++) { const yy = y0 + 18 + (y1 - y0 - 30) * Math.pow(i / n, 1.3), amp = 3 + i * 0.6, wl = 70 + i * 6;
    ctx.strokeStyle = rgba(P.waterLine, 0.45 + i * 0.02); ctx.lineWidth = 1.2 + i * 0.12; ctx.beginPath();
    for (let x = -20; x <= W + 20; x += 8) { const yv = yy + Math.sin(x / wl * 6.28 + t * 1.2 + i) * amp; x ? ctx.lineTo(x, yv) : ctx.moveTo(x, yv); } ctx.stroke(); }
  if (sunX != null) { ctx.fillStyle = rgba(P.red, 0.55); for (let i = 0; i < 9; i++) { const yy = y0 + 14 + i * 22, w = 120 - i * 9 + Math.sin(t * 2 + i) * 10; ctx.beginPath(); ctx.ellipse(sunX + Math.sin(t + i * 1.7) * 6, yy, w / 2, 3.2, 0, 0, 7); ctx.fill(); } }
  ctx.restore(); }
/* 7 glassCup — tapered glass, murk 1→0 settles to clear water + sediment (4550 t32.5→t37.5). */
export function glassCup(ctx, x, y, h, { murk = 1, t = 0, stick = 0 } = {}) { const w = h * 0.66, wb = w * 0.82; ctx.save();
  const top = y - h, lvl = top + h * 0.1; const path = (pad = 0) => { ctx.beginPath(); ctx.moveTo(x - w / 2 + pad, top); ctx.lineTo(x - wb / 2 + pad, y - pad); ctx.lineTo(x + wb / 2 - pad, y - pad); ctx.lineTo(x + w / 2 - pad, top); };
  ctx.save(); path(6); ctx.closePath(); ctx.clip(); const water = mix2(P.water, P.mud, murk); ctx.fillStyle = water; ctx.fillRect(x - w, lvl, w * 2, h);
  const r = rng(12); for (let i = 0; i < 260; i++) { const px = x + (r() - .5) * w, py0 = lvl + r() * h * 0.9, settle = 1 - murk; const py = lerp(py0, y - 6 - r() * h * 0.08, settle); ctx.fillStyle = rgba(P.mudDark, 0.35 + r() * 0.4); ctx.beginPath(); ctx.arc(px + Math.sin(t * 2 + i) * murk * 3, py, 1.2 + r() * 2.2, 0, 7); ctx.fill(); }
  ctx.fillStyle = rgba(P.mudDark, 0.9 * (1 - murk)); ctx.fillRect(x - w, y - h * 0.07, w * 2, h * 0.07);
  ctx.fillStyle = rgba('#FFFFFF', 0.25); ctx.fillRect(x - w * 0.36, lvl + 10, w * 0.05, h * 0.7); ctx.restore();
  ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.lineJoin = 'round'; path(); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - w / 2 - 4, top); ctx.lineTo(x + w / 2 + 4, top); ctx.stroke();
  if (stick > 0) { ctx.lineWidth = 7; ctx.lineCap = 'round'; const a = stick * 0.3; ctx.beginPath(); ctx.moveTo(x + w * 0.12 + Math.sin(t * 6) * 20 * stick, y - h * 0.12); ctx.lineTo(x + w * 0.42 + Math.sin(t * 6) * 6, top - h * 0.38); ctx.stroke(); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(x + w * 0.42 + Math.sin(t * 6) * 6, top - h * 0.38, 9, 0, 7); ctx.fill(); }
  ctx.restore(); }
function mix2(a, b, t) { const A = hx(a), B = hx(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
function hx(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
/* 8 cleaver — 庖丁's knife: broad blade + dark handle; `gleam` 0..1 sweeps a white bar along the edge (our M11). */
export function cleaver(ctx, x, y, len, ang, { gleam = -1, color = P.ink, blade = '#D9D4C6', edge = '#F4F1E8', night = false, nick = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const L = len, bw = len * 0.42;
  ctx.fillStyle = night ? '#6B5A45' : P.ink2; roundRect(ctx, -L * 0.36, -L * 0.045, L * 0.38, L * 0.09, L * 0.04); ctx.fill();  // handle (pivot = grip)
  ctx.beginPath(); ctx.moveTo(0, -L * 0.07); ctx.lineTo(L * 0.62, -L * 0.1); ctx.quadraticCurveTo(L * 0.68, -L * 0.08, L * 0.68, 0); ctx.lineTo(L * 0.66, bw); ctx.quadraticCurveTo(L * 0.3, bw * 1.05, L * 0.02, bw * 0.85); ctx.closePath();
  ctx.fillStyle = blade; ctx.fill(); ctx.lineWidth = Math.max(2, L * 0.012); ctx.strokeStyle = night ? '#BDB4A0' : P.ink; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.fillStyle = edge; ctx.fillRect(0, bw * 0.78, L, bw * 0.3);
  if (nick) { ctx.fillStyle = night ? P.night : P.paper; for (let i = 0; i < 5 * nick; i++) { ctx.beginPath(); ctx.moveTo(L * (0.15 + i * 0.1), bw * 1.1); ctx.lineTo(L * (0.18 + i * 0.1), bw * 0.86); ctx.lineTo(L * (0.21 + i * 0.1), bw * 1.1); ctx.fill(); } }
  if (gleam >= 0 && gleam <= 1) { const gx = lerp(-L * 0.2, L * 0.9, gleam); const g = ctx.createLinearGradient(gx - L * 0.12, 0, gx + L * 0.12, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(gx - L * 0.12, -L * 0.2, L * 0.24, bw * 1.4); }
  ctx.restore(); ctx.fillStyle = night ? '#BDB4A0' : P.ink; ctx.beginPath(); ctx.arc(L * 0.56, -L * 0.03, L * 0.025, 0, 7); ctx.fill(); ctx.restore();
}
/* 9 block — round chopping block (log end, side view) with growth rings on top + hack marks */
export function block(ctx, x, y, w, { color = P.cream, night = true, marks = 0, tall = 0.42 } = {}) { ctx.save(); const h = w * tall;
  ctx.fillStyle = night ? '#3A332A' : P.inkSoft; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2, y); ctx.ellipse(x, y, w / 2, w * 0.1, 0, Math.PI, 0, true); ctx.lineTo(x + w / 2, y - h); ctx.fill();
  ctx.fillStyle = night ? '#8A7A62' : P.mist; ctx.beginPath(); ctx.ellipse(x, y - h, w / 2, w * 0.1, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba(night ? '#4A3F31' : P.ink, 0.6); ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.ellipse(x, y - h, w / 2 * i / 4, w * 0.1 * i / 4, 0, 0, 7); ctx.stroke(); }
  ctx.strokeStyle = night ? '#1A1712' : P.ink; ctx.lineWidth = 3; const r = rng(31); for (let i = 0; i < marks; i++) { const mx = x + (r() - .5) * w * 0.7; ctx.beginPath(); ctx.moveTo(mx - 14, y - h - 4 + (r() - .5) * 8); ctx.lineTo(mx + 14, y - h + 4 + (r() - .5) * 8); ctx.stroke(); }
  ctx.restore(); }
/* 10 chips — bone/wood chips + red sparks flying from an impact (night W1). age 0..1 */
export function chips(ctx, x, y, age, { seed = 5, n = 18, spark = true } = {}) { if (age < 0 || age > 1) return; const r = rng(seed); ctx.save();
  for (let i = 0; i < n; i++) { const a = -Math.PI * (0.1 + r() * 0.8), v = 220 + r() * 380, px = x + Math.cos(a) * v * age, py = y + Math.sin(a) * v * age + 900 * age * age; const s = 5 + r() * 8;
    ctx.globalAlpha = 1 - age; ctx.fillStyle = i % 4 === 0 && spark ? '#E0413F' : P.cream; ctx.save(); ctx.translate(px, py); ctx.rotate(age * 9 * (r() - .5)); ctx.fillRect(-s / 2, -s / 4, s, s / 2); ctx.restore(); }
  ctx.restore(); }
/* 11 stump — cut stump with rings (4550 t70.5 row of stumps) */
export function stump(ctx, x, y, w, { color = P.ink } = {}) { ctx.save(); ctx.fillStyle = color; ctx.fillRect(x - w / 2, y - w * 0.6, w, w * 0.6); ctx.fillStyle = P.mist; ctx.beginPath(); ctx.ellipse(x, y - w * 0.6, w / 2, w * 0.14, 0, 0, 7); ctx.fill(); ctx.restore(); }
/* 12 boat — black crescent hull (4550 t84.5) */
export function boat(ctx, x, y, w, { color = P.ink, rock = 0 } = {}) { ctx.save(); ctx.translate(x, y); ctx.rotate(rock * 0.04); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-w / 2, -w * 0.12); ctx.quadraticCurveTo(-w * 0.1, -w * 0.02, w / 2, -w * 0.14); ctx.quadraticCurveTo(w * 0.3, w * 0.1, -w * 0.05, w * 0.1); ctx.quadraticCurveTo(-w * 0.38, w * 0.08, -w / 2, -w * 0.12); ctx.fill(); ctx.restore(); }
/* 13 yinYang — ink/paper taiji with optional red ring on the eye (4550 t78.5) */
export function yinYang(ctx, x, y, R, { rot = 0, k = 1 } = {}) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = P.paper; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2); ctx.arc(0, R / 2, R / 2, Math.PI / 2, -Math.PI / 2, true); ctx.arc(0, -R / 2, R / 2, Math.PI / 2, -Math.PI / 2, false); ctx.fill();
  ctx.lineWidth = R * 0.06; ctx.strokeStyle = P.ink; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.stroke(); ctx.fillStyle = P.paper; ctx.beginPath(); ctx.arc(0, R / 2, R * 0.12, 0, 7); ctx.fill(); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, -R / 2, R * 0.12, 0, 7); ctx.fill(); ctx.restore(); }
/* 14 redDigits — 7-segment red numerals (4550 t5.5 「04:59」); text may contain digits and ':' */
const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
export function redDigits(ctx, str, x, y, h, { color = '#D8322F', glow = true } = {}) { ctx.save(); const w = h * 0.52, t = h * 0.13; let cx = x; ctx.fillStyle = color; if (glow) { ctx.shadowColor = rgba('#E0413F', 0.6); ctx.shadowBlur = h * 0.15; }
  const tot = [...str].reduce((s, c) => s + (c === ':' ? w * 0.5 : w * 1.25), 0); cx = x - tot / 2;
  for (const c of str) { if (c === ':') { ctx.fillRect(cx + w * 0.15, y - h * 0.3, t, t); ctx.fillRect(cx + w * 0.15, y + h * 0.18, t, t); cx += w * 0.5; continue; }
    const on = SEG[c] || ''; const S = { a: [0, -h / 2, w, t], d: [0, h / 2 - t, w, t], g: [0, -t / 2, w, t], f: [0, -h / 2, t, h / 2], b: [w - t, -h / 2, t, h / 2], e: [0, 0, t, h / 2], c: [w - t, 0, t, h / 2] };
    for (const s of on) { const [a, b, ww, hh] = S[s]; ctx.fillRect(cx + a, y + b, ww, hh); } cx += w * 1.25; }
  ctx.restore(); }
/* 15 vertColumn — vertical serif column, last item red (4550 t43.5 「一天 / 一年 / 十年」) */
export function vertColumn(ctx, items, x, y, size, { k = 1, gap = 1.25 } = {}) { ctx.save(); ctx.font = `600 ${size}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  items.forEach((s, i) => { const kk = clamp(k * items.length - i); if (kk <= 0) return; ctx.globalAlpha = kk; ctx.fillStyle = i === items.length - 1 ? P.red : P.inkSoft; ctx.fillText(s, x, y + i * size * gap - (1 - kk) * 12); }); ctx.restore(); }
/* 16 dashedPath — red dashed brush line drawn on to k; returns {pt, ang} at the head (for a follower). */
export function dashedPath(ctx, pts, k, { color = P.red, w = 6, dash = [18, 12], a = 1 } = {}) { const segs = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  let rem = tot * clamp(k); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let head = pts[0], ang = 0;
  for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / segs[i - 1]); head = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]); ctx.lineTo(head[0], head[1]); rem -= segs[i - 1]; }
  ctx.stroke(); ctx.restore(); return { pt: head, ang }; }
/* 17 moon — pale disc with soft halo on night (4550 t11.5) */
export function moon(ctx, x, y, R, { k = 1 } = {}) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k); const g = ctx.createRadialGradient(x, y, R * 0.9, x, y, R * 3); g.addColorStop(0, 'rgba(240,235,220,0.22)'); g.addColorStop(1, 'rgba(240,235,220,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R * 3, 0, 7); ctx.fill(); ctx.fillStyle = '#EFEADB'; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill(); ctx.restore(); }
/* 18 sheep — cloud body + dark head, for counting gags (4550 t5.5) */
export function sheep(ctx, x, y, s, { hop = 0 } = {}) { ctx.save(); ctx.translate(x, y - Math.abs(Math.sin(hop)) * s * 0.5); ctx.fillStyle = P.cream; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s * 0.4 + i * s * 0.2, -s * 0.15 * (i % 2), s * 0.3, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#2A2924'; ctx.beginPath(); ctx.ellipse(s * 0.55, -s * 0.05, s * 0.18, s * 0.14, 0.3, 0, 7); ctx.fill(); ctx.strokeStyle = P.cream; ctx.lineWidth = s * 0.08; ctx.lineCap = 'round'; [-0.3, 0.3].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx * s, s * 0.1); ctx.lineTo(dx * s, s * 0.4); ctx.stroke(); }); ctx.restore(); }
/* 19 ruler — red measuring stick with ticks (4550 t76.5 别人的尺子) */
export function ruler(ctx, x, y, len, { k = 1, ang = -Math.PI / 2 } = {}) { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const L = len * clamp(k); ctx.fillStyle = P.red; ctx.fillRect(0, -9, L, 18); ctx.strokeStyle = P.paper; ctx.lineWidth = 2; for (let i = 10; i < L; i += 20) { ctx.beginPath(); ctx.moveTo(i, -9); ctx.lineTo(i, i % 100 < 20 ? 4 : -2); ctx.stroke(); } ctx.restore(); }
/* 20 sandStream — fine falling grains from a hand (4550 t2.5 沙子，握得越紧) */
export function sandStream(ctx, x, y, len, t, { color = '#C9A86A', n = 60 } = {}) { const r = rng(17); ctx.save(); ctx.fillStyle = color; for (let i = 0; i < n; i++) { const ph = (r() + t * 0.9) % 1, px = x + (r() - .5) * 18 * ph + Math.sin(i) * 3, py = y + ph * len; ctx.globalAlpha = 0.9 - ph * 0.5; ctx.fillRect(px, py, 2.2, 2.2); } ctx.restore(); }
/* 21 inkBloom — organic ink blot growing from a point (our M1 transition / punctuation). k 0..1 */
export function inkBloom(ctx, x, y, R, k, { seed = 8, color = P.ink, rough = 1 } = {}) { if (k <= 0) return; const r = rng(seed); ctx.save(); ctx.fillStyle = color; const rr = R * Math.pow(clamp(k), 0.7);
  const off = []; for (let i = 0; i < 3; i++) off.push([r() * 6.28, (0.03 + r() * 0.04) * rough, 2 + Math.floor(r() * 3)]); for (let i = 0; i < 6; i++) off.push([r() * 6.28, (0.008 + r() * 0.014) * rough, 9 + Math.floor(r() * 20)]);
  ctx.beginPath(); const N = 160;
  for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2; let m = 1; off.forEach(([p, amp, f]) => m += Math.sin(a * f + p) * amp); const px = x + Math.cos(a) * rr * m, py = y + Math.sin(a) * rr * m; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fill(); if (k < 1) splatter(ctx, x, y, rr * 1.1, { seed, n: 20, k: 1, color }); ctx.restore(); }
/* 22 reeds — ink grass tufts at a waterline (4550 t23.5) */
export function reeds(ctx, x, y, h, { seed = 6, sway = 0 } = {}) { const r = rng(seed); ctx.save(); ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; for (let i = 0; i < 14; i++) { const bx = x + (r() - .5) * h * 0.6, hh = h * (0.5 + r() * 0.5); ctx.lineWidth = 2 + r() * 2; ctx.beginPath(); ctx.moveTo(bx, y); ctx.quadraticCurveTo(bx + (r() - .5) * 10, y - hh * 0.6, bx + (r() - .5) * 30 + sway * 10, y - hh); ctx.stroke(); } ctx.restore(); }
