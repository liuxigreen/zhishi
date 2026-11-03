/** look.js — Papyrus Egypt (莎草图) palette, grounds, frame bands, caption card, name tag. Measured on 4352 (1440×1080, 4:3):
 * parchment #E2D1A8 / mottle #B9A887 · navy band #1C273E · skin men #8E3B2A, women #D5A458 (shade #BE924B) · wig #181410 ·
 * outline #2A1A12 · kilt #EFE6D0 · collar blue #385780 · jar #A76044 · grass #839D60 · sun red #C0392B. */
export const W = 1440, H = 1080;
export const P = {
  parch: '#E2D1A8', parchMid: '#D1BE9A', parchDark: '#B9A887', crack: '#8C7A5A',
  navy: '#1C273E', navy2: '#24345A', gold: '#D9A640', goldDark: '#A9792A', cream: '#F1E6C8', creamEdge: '#E2D3AA',
  ink: '#2A1F17', line: '#2A1A12',
  skinM: '#8E3B2A', skinMShade: '#73301F', skinF: '#D5A458', skinFShade: '#BE924B',
  wig: '#181410', wigHi: '#2E3A5E', linen: '#EFE6D0', linenShade: '#D6CBB0',
  blue: '#2F5C9E', lapis: '#22408A', turq: '#3E9A8C', green: '#3F8A4E', red: '#B8392B', redDark: '#7A2418',
  jar: '#A76044', jarDark: '#7E4430', clay: '#B57A4E', grass: '#839D60', grassDark: '#5D7A45', palm: '#3B5A33', trunk: '#6D432A',
  sand: '#D9B77E', sandDark: '#B8925A', dune: '#C9935A', nile: '#2A4F86', nileLite: '#4F7DB8', sky1: '#ABB5C1', sky2: '#DFD3D5', sky3: '#F6D3C2', sky4: '#F7DDB3',
  night: '#1A1C29', night2: '#262A3E', nightGround: '#4A2E25', stone: '#B9AE98', stoneDark: '#8E8470',
  hiBlue: '#24529A', hiRed: '#A82A1F', hiGreen: '#256B42',
};
export const SERIF = '"Noto Serif SC", serif';
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
export function hexRgb(h) { if (h.startsWith('rgb')) return h.match(/[\d.]+/g).slice(0, 3).map(Number); h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
export const rgba = (h, a) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; };
export function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
/* outline-then-fill: every shape group gets one merged dark outline (the source's 3 px brown-black contour). */
export const LW = 3;
export function outlined(ctx, draw, fill, { lw = LW, line = P.line } = {}) { ctx.save(); ctx.strokeStyle = line; ctx.lineWidth = lw * 2; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; draw(ctx, 'stroke'); ctx.restore(); ctx.save(); ctx.fillStyle = fill; draw(ctx, 'fill'); ctx.restore(); }

/* ── grounds (cached) ── */
const _cache = {};
function cached(key, w, h, fn) { if (!_cache[key]) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); _cache[key] = c; } return _cache[key]; }
function mottle(x, w, h, r, n, cols, a0, a1, rmin, rmax) { for (let i = 0; i < n; i++) { const cx = r() * w, cy = r() * h, rr = rmin + r() * (rmax - rmin); const g = x.createRadialGradient(cx, cy, 0, cx, cy, rr); const col = cols[Math.floor(r() * cols.length)]; g.addColorStop(0, rgba(col, a0 + r() * (a1 - a0))); g.addColorStop(1, rgba(col, 0)); x.fillStyle = g; x.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); } }
function cracks(x, w, h, r, n, col, a) { x.strokeStyle = rgba(col, a); x.lineCap = 'round'; for (let i = 0; i < n; i++) { let px = r() * w, py = r() * h, ang = r() * Math.PI * 2; x.lineWidth = 1 + r() * 1.4; x.beginPath(); x.moveTo(px, py); const L = 6 + Math.floor(r() * 10); for (let k = 0; k < L; k++) { ang += (r() - 0.5) * 1.2; const s = 10 + r() * 26; px += Math.cos(ang) * s; py += Math.sin(ang) * s; x.lineTo(px, py); if (r() < 0.18) { x.moveTo(px, py); } } x.stroke(); } }
/* parchment wall: warm sand with blotchy plaster mottling + hairline cracks (4352 t14/t32/t134 backgrounds) */
export function parchment(ctx, { a = 1, x = 0, y = 0, w = W, h = H, tone = 'parch' } = {}) {
  const base = { parch: [P.parch, P.parchDark], stone: ['#CFC3A8', '#A79C84'], blue: ['#1E2C4E', '#141D33'], red: ['#6A2016', '#4A140E'], night: [P.night, '#10121C'] }[tone];
  const c = cached('parch-' + tone, W, H, (x2, w2, h2) => { const r = rng(tone.length * 31 + 5); x2.fillStyle = base[0]; x2.fillRect(0, 0, w2, h2);
    const dark = tone === 'parch' || tone === 'stone'; mottle(x2, w2, h2, r, 260, [base[1], base[1], dark ? '#F4E6C0' : '#000000'], dark ? 0.25 : 0.2, dark ? 0.6 : 0.45, 18, 90);
    if (dark) { cracks(x2, w2, h2, r, 26, P.crack, 0.45); for (let i = 0; i < 1400; i++) { x2.fillStyle = rgba(r() < 0.6 ? '#7A6A4C' : '#FFF5DA', r() * 0.25); x2.fillRect(r() * w2, r() * h2, 1 + r() * 2, 1 + r() * 2); } } });
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(c, 0, 0); ctx.restore();
}
/* grain: the source lays a faint plaster texture over EVERYTHING (figures included) — multiply mottling + flecks */
export function grain(ctx, a = 1) { const c = cached('grain', W, H, (x, w, h) => { const r = rng(91); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, w, h); mottle(x, w, h, r, 420, ['#9C8A68', '#C2B18E'], 0.12, 0.3, 14, 70); cracks(x, w, h, r, 10, '#8C7A5A', 0.25); for (let i = 0; i < 3000; i++) { x.fillStyle = `rgba(90,75,50,${r() * 0.18})`; x.fillRect(r() * w, r() * h, 1.5, 1.5); } });
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.55 * a; ctx.drawImage(c, 0, 0); ctx.restore(); }
/* stripe of coloured blocks (blue-red-green-gold-…) with dark separators — the band edge and the card top */
const BLOCKS = ['#2F5C9E', '#B8392B', '#3F8A4E', '#D9A640'];
export function blockStripe(ctx, x0, x1, y, h = 10, bw = 22) { ctx.save(); ctx.fillStyle = P.line; ctx.fillRect(x0, y - 1, x1 - x0, h + 2); let i = 0; for (let x = x0 + 2; x < x1 - 2; x += bw, i++) { ctx.fillStyle = BLOCKS[i % 4]; ctx.fillRect(x, y + 1, Math.min(bw - 3, x1 - 2 - x), h - 2); } ctx.restore(); }
function star5(ctx, x, y, r) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
/* winged sun disk (top band centre) */
export function wingedSun(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of [-1, 1]) { const cols = [P.gold, P.green, P.blue, P.red]; for (let k = 0; k < 4; k++) { ctx.fillStyle = cols[k]; ctx.beginPath(); ctx.moveTo(d * 14, -6 + k * 3); ctx.quadraticCurveTo(d * 70, -10 + k * 3, d * 112 - d * k * 12, -2 + k * 4); ctx.lineTo(d * 100 - d * k * 12, 2 + k * 4); ctx.quadraticCurveTo(d * 60, 2 + k * 3, d * 14, 4 + k * 2); ctx.closePath(); ctx.fill(); } }
  ctx.fillStyle = P.red; ctx.strokeStyle = P.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
/* Eye of Horus glyph (bottom band centre, also a prop) */
export function eyeOfHorus(ctx, x, y, s = 1, col = P.gold) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-18, -12); ctx.quadraticCurveTo(0, -20, 18, -13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-16, -2); ctx.quadraticCurveTo(0, -12, 16, -3); ctx.quadraticCurveTo(0, 6, -16, -2); ctx.stroke();
  ctx.beginPath(); ctx.arc(1, -3, 4, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(16, -3); ctx.lineTo(26, -3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-2, 3); ctx.lineTo(-4, 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, 3); ctx.quadraticCurveTo(12, 16, 20, 12); ctx.quadraticCurveTo(22, 6, 16, 8); ctx.stroke(); ctx.restore(); }
function lotusMotif(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#121A2E'; ctx.strokeStyle = '#4C6FA8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(-11, -9); ctx.lineTo(-4, -4); ctx.lineTo(0, -13); ctx.lineTo(4, -4); ctx.lineTo(11, -9); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#5E8F55'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(18, 12); ctx.lineTo(18, -6); ctx.stroke(); ctx.fillStyle = '#5E8F55'; ctx.beginPath(); ctx.ellipse(18, -8, 3, 5, 0, 0, 7); ctx.fill(); ctx.restore(); }
/* frame bands: top 0–38 navy + gold stars + winged sun, block stripe 38–48; bottom block stripe 1028–1040 + navy lotus 1040–1080 + eye */
export function frameBands(ctx, { a = 1 } = {}) { ctx.save(); ctx.globalAlpha = a;
  const nb = (y0, y1) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#22305A'); g.addColorStop(1, '#17203A'); ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0); };
  nb(0, 38); ctx.fillStyle = P.gold; for (let x = 30; x < W; x += 58) { if (Math.abs(x - W / 2) < 150) continue; star5(ctx, x, 19, 5); }
  wingedSun(ctx, W / 2, 18, 1); blockStripe(ctx, 0, W, 38, 10);
  blockStripe(ctx, 0, W, 1028, 12); nb(1040, H); ctx.strokeStyle = P.gold; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 1043); ctx.lineTo(W, 1043); ctx.moveTo(0, 1077); ctx.lineTo(W, 1077); ctx.stroke();
  for (let x = 40; x < W; x += 64) { if (Math.abs(x - W / 2) < 60) continue; lotusMotif(ctx, x, 1060, 0.9); }
  eyeOfHorus(ctx, W / 2 - 4, 1062, 0.8); ctx.restore(); }
/* caption card: cream sheet 84–1356, top 874 → into bottom stripe, block stripe on top, 2 lines bold serif ~46 px.
 * segs: [[{t, c:'blue'|'red'|'green'}...], ...]. hi colours are darkened so every word is ≥4.5:1 on cream. */
export const CARD = { x0: 84, x1: 1356, y0: 872, y1: 1030, size: 46, l1: 932, l2: 990 };
export function captionCard(ctx, { a = 1, k = 1 } = {}) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const { x0, x1, y0, y1 } = CARD; const hgt = (y1 - y0) * k;
  ctx.fillStyle = 'rgba(40,25,10,0.25)'; ctx.fillRect(x0 + 6, y1 - hgt + 6, x1 - x0, hgt);
  const g = ctx.createLinearGradient(0, y1 - hgt, 0, y1); g.addColorStop(0, '#F3E9CC'); g.addColorStop(1, '#E9DCB8'); ctx.fillStyle = g; ctx.fillRect(x0, y1 - hgt, x1 - x0, hgt);
  ctx.strokeStyle = 'rgba(120,95,60,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y1 - hgt + 0.5, x1 - x0 - 1, hgt);
  // right edge curls like a papyrus sheet
  ctx.fillStyle = '#D8C79E'; ctx.beginPath(); ctx.moveTo(x1, y1 - hgt + 12); ctx.quadraticCurveTo(x1 + 10, (y1 * 2 - hgt) / 2, x1, y1); ctx.lineTo(x1 - 6, y1); ctx.lineTo(x1 - 6, y1 - hgt + 12); ctx.fill();
  blockStripe(ctx, x0, x1, y1 - hgt - 2, 11, 24); ctx.restore(); }
export const HI = { blue: P.hiBlue, red: P.hiRed, green: P.hiGreen };
export function captionText(ctx, lines, { a = 1, dy = 0, size = CARD.size, only = null } = {}) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `900 ${size}px ${SERIF}`; ctx.textBaseline = 'middle'; ctx.letterSpacing = '2px';
  const ys = lines.length === 1 ? [(CARD.l1 + CARD.l2) / 2] : [CARD.l1, CARD.l2];
  lines.forEach((ln, li) => { const w = ln.reduce((s, g) => s + ctx.measureText(g.t).width, 0); let x = W / 2 - w / 2;
    ln.forEach(g => { const show = only === null || (only === 'hi' ? !!g.c : !g.c); if (show) { ctx.fillStyle = g.c ? HI[g.c] : P.ink; ctx.fillText(g.t, x, ys[li] + dy); } x += ctx.measureText(g.t).width; }); });
  ctx.restore(); }
/* vertical name tag (竖排名牌): cream slip, dark 2 px border, vertical bold text, small top cap */
export function nameTag(ctx, text, x, y, { size = 24, a = 1 } = {}) { if (a <= 0) return null; const chars = [...text]; const w = size + 16, h = chars.length * (size + 2) + 18;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#F2E8CF'; ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.fillRect(x - w / 2, y, w, h); ctx.strokeRect(x - w / 2, y, w, h);
  ctx.fillStyle = P.line; ctx.fillRect(x - w / 2 - 3, y - 4, w + 6, 5);
  ctx.font = `800 ${size}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.ink; chars.forEach((ch, i) => ctx.fillText(ch === '·' ? '·' : ch, x, y + 10 + size / 2 + i * (size + 2))); ctx.restore();
  return { x0: x - w / 2, y0: y, x1: x + w / 2, y1: y + h }; }
/* title cartouche (opening): rounded cream pill with gold double border — 4352 t0 「太阳神的眼睛」 */
export function titlePill(ctx, lines, x, y, w, h, { a = 1 } = {}) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(0,0,0,0.35)'; roundRect(ctx, x - w / 2 + 6, y - h / 2 + 8, w, h, h / 2); ctx.fill();
  ctx.fillStyle = '#F1E6C8'; roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.strokeStyle = P.gold; ctx.lineWidth = 6; ctx.stroke(); ctx.strokeStyle = P.goldDark; ctx.lineWidth = 2; roundRect(ctx, x - w / 2 + 10, y - h / 2 + 10, w - 20, h - 20, (h - 20) / 2); ctx.stroke();
  ctx.font = `900 54px ${SERIF}`; ctx.textBaseline = 'middle'; ctx.letterSpacing = '3px';
  lines.forEach((ln, li) => { const ww = ln.reduce((s, g) => s + ctx.measureText(g.t).width, 0); let xx = x - ww / 2; const yy = y + (li - (lines.length - 1) / 2) * 70; ln.forEach(g => { ctx.fillStyle = g.c ? HI[g.c] : P.ink; ctx.fillText(g.t, xx, yy); xx += ctx.measureText(g.t).width; }); }); ctx.restore(); }
export function vignette(ctx, a = 0.35) { const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.9); g.addColorStop(0, 'rgba(30,15,5,0)'); g.addColorStop(1, `rgba(30,15,5,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
