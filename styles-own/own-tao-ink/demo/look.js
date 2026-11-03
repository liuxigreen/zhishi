/** look.js — Tao Ink (道卷水墨) palette, paper, ink helpers, type. Measured on 4550 (1080×1920):
 * paper centre #E3DBCB → edge #CFC7B4, ink #1D1D15 / #2B241C, red #AB2229, pine wash #54674B, night #0D0D0B. */
export const W = 1080, H = 1920;
export const P = {
  paper: '#E4DDCD', paperEdge: '#CFC7B4', paperShade: '#D8D0BD',
  ink: '#1D1B16', ink2: '#2B241C', inkSoft: '#4A443A', grey: '#9C968A', mist: '#C9C2B2', mist2: '#B8B1A2',
  red: '#AB2229', redHot: '#C8302F', redSoft: '#D98C8A',
  pine: '#54674B', pineLite: '#7E8F6E', pineDark: '#3C4A36',
  water: '#C6CABC', water2: '#BABDB2', waterLine: '#7F9796',
  night: '#0F0E0C', cream: '#EDE6D6', creamShade: '#CFC6B2',
  mud: '#98876B', mudDark: '#6E5E45', glass: '#2A2620',
};
export const SERIF = '"Noto Serif SC", serif';
export const BRUSH = '"MaShanZheng", "Noto Serif SC", serif';
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
export function hexRgb(h) { if (h.startsWith('rgb')) return h.match(/[\d.]+/g).slice(0, 3).map(Number); h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
export const rgba = (h, a) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; };

/* Paper: cached rice paper — radial warm centre, cloud mottling, fibres, flecks (4550 every paper board). */
let _paper = null, _night = null;
function makePaper(night) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const r = rng(night ? 77 : 7);
  const g = x.createRadialGradient(W * 0.5, H * 0.45, 100, W * 0.5, H * 0.5, H * 0.75);
  if (night) { g.addColorStop(0, '#1A1916'); g.addColorStop(1, '#090908'); } else { g.addColorStop(0, '#E9E3D4'); g.addColorStop(0.6, P.paper); g.addColorStop(1, P.paperEdge); }
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { const cx = r() * W, cy = r() * H, rr = 80 + r() * 260; const gg = x.createRadialGradient(cx, cy, 0, cx, cy, rr);
    const col = night ? (r() < .5 ? '255,250,235' : '0,0,0') : (r() < .5 ? '120,105,80' : '255,252,240'); gg.addColorStop(0, `rgba(${col},${night ? 0.018 : 0.035})`); gg.addColorStop(1, `rgba(${col},0)`); x.fillStyle = gg; x.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); }
  x.lineCap = 'round';
  for (let i = 0; i < 520; i++) { const cx = r() * W, cy = r() * H, a = r() * Math.PI, l = 6 + r() * 30; x.strokeStyle = night ? `rgba(255,250,235,${0.015 + r() * 0.03})` : `rgba(90,75,55,${0.03 + r() * 0.06})`; x.lineWidth = 0.6 + r() * 0.8;
    x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + Math.cos(a) * l * 0.5 + (r() - .5) * 6, cy + Math.sin(a) * l * 0.5 + (r() - .5) * 6, cx + Math.cos(a) * l, cy + Math.sin(a) * l); x.stroke(); }
  for (let i = 0; i < 900; i++) { x.fillStyle = night ? `rgba(255,250,235,${r() * 0.04})` : `rgba(70,60,45,${r() * 0.09})`; x.fillRect(r() * W, r() * H, 1 + r() * 1.5, 1 + r() * 1.5); }
  return c;
}
export function paper(ctx, { night = false, a = 1 } = {}) {
  if (night) { _night = _night || makePaper(true); } else { _paper = _paper || makePaper(false); }
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(night ? _night : _paper, 0, 0); ctx.restore();
}
/* Ink splatter — round drops + satellite specks + a few teardrop flicks (4550 t17.5 around 道). */
export function splatter(ctx, x, y, R, { seed = 3, n = 26, k = 1, color = P.ink, spread = 1 } = {}) {
  if (k <= 0) return; const r = rng(seed); ctx.save(); ctx.fillStyle = color;
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = R * (0.55 + r() * 0.9 * spread), s = (r() < 0.15 ? 9 : 3.5) * (0.4 + r()) * (R / 200);
    const kk = clamp(k * 1.6 - (d / R) * 0.5); if (kk <= 0) continue; const px = x + Math.cos(a) * d * kk, py = y + Math.sin(a) * d * kk;
    ctx.beginPath(); ctx.ellipse(px, py, s, s * (0.75 + r() * 0.3), a, 0, 7); ctx.fill();
    if (r() < 0.35) { ctx.beginPath(); ctx.ellipse(px + Math.cos(a) * s * 2.2, py + Math.sin(a) * s * 2.2, s * 0.35, s * 0.3, 0, 0, 7); ctx.fill(); }
    if (r() < 0.12) { ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(s * 2, -s * 0.5, s * 5, 0); ctx.quadraticCurveTo(s * 2, s * 0.5, -s, 0); ctx.fill(); ctx.restore(); } }
  ctx.restore();
}
/* Dry-brush texture: knock streaks out of whatever was just drawn inside a box (飞白). Call inside save/restore. */
export function dryBrush(ctx, x, y, w, h, { seed = 5, angle = -0.25, amt = 1, n = 70 } = {}) {
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round';
  for (let i = 0; i < n * amt; i++) { const cx = x + r() * w, cy = y + r() * h, l = 20 + r() * w * 0.35; ctx.strokeStyle = `rgba(0,0,0,${0.15 + r() * 0.55})`; ctx.lineWidth = 0.8 + r() * 2.6;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * l, cy + Math.sin(angle) * l); ctx.stroke(); }
  ctx.restore();
}
export function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
/* Seal (印): slightly irregular red square, char knocked out in white serif (4550 header 道, chapter 壹/贰/叁/肆). */
export function seal(ctx, x, y, s, ch, { k = 1, color = P.red, seed = 2, rot = 0, font = SERIF, weight = 900 } = {}) {
  if (k <= 0) return; const r = rng(seed); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= clamp(k);
  ctx.beginPath(); const N = 20; for (let i = 0; i < N; i++) { const t = i / N * 4, sd = Math.floor(t), u = t - sd; let px, py;
    if (sd === 0) { px = u; py = 0; } else if (sd === 1) { px = 1; py = u; } else if (sd === 2) { px = 1 - u; py = 1; } else { px = 0; py = 1 - u; }
    px = (px - 0.5) * s + (r() - .5) * s * 0.03; py = (py - 0.5) * s + (r() - .5) * s * 0.03; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = '#000'; ctx.font = `${weight} ${s * (ch.length > 1 ? 0.42 : 0.72)}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (ch.length > 1) { ctx.fillText(ch[0], -s * 0.2, -s * 0.2); ctx.fillText(ch[1], s * 0.2, -s * 0.2); if (ch[2]) ctx.fillText(ch[2], -s * 0.2, s * 0.22); if (ch[3]) ctx.fillText(ch[3], s * 0.2, s * 0.22); }
  else ctx.fillText(ch, 0, s * 0.04);
  for (let i = 0; i < 26; i++) { ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc((r() - .5) * s, (r() - .5) * s, s * (0.008 + r() * 0.02), 0, 7); ctx.fill(); }
  ctx.restore();
}
/* Header bar: tiny seal + series line, letter-spaced light serif (4550 every board, y≈195). Ours reads 知 · 一分钟 · 读懂庄子. */
export function header(ctx, { a = 1, night = false, text = '一分钟  ·  读懂庄子' } = {}) {
  ctx.save(); ctx.globalAlpha = a; seal(ctx, 352, 195, 40, '知', { seed: 11 });
  ctx.font = `400 34px ${SERIF}`; ctx.fillStyle = night ? P.cream : P.ink; ctx.textBaseline = 'middle'; ctx.letterSpacing = '6px'; ctx.fillText(text, 386, 197); ctx.restore();
}
/* Chapter chip: big seal numeral + title + progress dots (4550 t26.5 「壹 无为 ●○○○○」). */
export function chapter(ctx, num, title, idx, { a = 1, total = 5, night = false, noSeal = false } = {}) {
  ctx.save(); ctx.globalAlpha = a; if (!noSeal) seal(ctx, 120, 300, 76, num, { seed: 20 + idx, font: BRUSH, weight: 400 });
  ctx.font = `500 42px ${SERIF}`; ctx.fillStyle = night ? P.cream : P.ink; ctx.textBaseline = 'middle'; ctx.letterSpacing = '4px'; ctx.fillText(title, 176, 296);
  for (let i = 0; i < total; i++) { ctx.beginPath(); ctx.arc(176 + 6 + i * 28, 352, 7, 0, 7); if (i <= idx) { ctx.fillStyle = P.red; ctx.fill(); } else { ctx.strokeStyle = P.grey; ctx.lineWidth = 2; ctx.stroke(); } }
  ctx.restore();
}
/* Caption: bold serif, ink, centred y≈1380; segments [{t, red}] — red marks the key words (4550 「越用力，越糟」). */
export function caption(ctx, segs, { y = 1380, size = 62, a = 1, night = false, dy = 0, blur = 0, redOnly = false } = {}) {
  ctx.save(); ctx.globalAlpha = a; ctx.font = `800 ${size}px ${SERIF}`; ctx.textBaseline = 'middle'; ctx.letterSpacing = '2px';
  const lines = Array.isArray(segs[0]) ? segs : [segs];
  lines.forEach((ln, li) => { const w = ln.reduce((s, g) => s + ctx.measureText(g.t).width, 0); let x = W / 2 - w / 2; const yy = y + dy + li * size * 1.45;
    ln.forEach(g => { if (redOnly && !g.red) { x += ctx.measureText(g.t).width; return; } ctx.fillStyle = g.red ? (night ? '#E0413F' : P.red) : (night ? P.cream : P.ink); if (blur) ctx.filter = `blur(${blur}px)`; ctx.fillText(g.t, x, yy); ctx.filter = 'none'; x += ctx.measureText(g.t).width; }); });
  ctx.restore();
}
/* Small cite line: thin serif, grey, centred, with em-dash (4550 「—— 老子 · 八十章」). */
export function cite(ctx, text, y, { a = 1, night = false } = {}) { ctx.save(); ctx.globalAlpha = a; ctx.font = `400 30px ${SERIF}`; ctx.fillStyle = night ? '#A9A291' : '#6F685A'; ctx.textAlign = 'center'; ctx.letterSpacing = '3px'; ctx.fillText(text, W / 2, y); ctx.restore(); }
export function vignette(ctx, a = 0.35) { const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(40,30,20,0)'); g.addColorStop(1, `rgba(40,30,20,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
