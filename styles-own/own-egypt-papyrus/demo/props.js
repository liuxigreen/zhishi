/* own-egypt-papyrus · props — every prop follows the PROP GRAMMAR (STYLE.md §13):
 * 1) flat fills from the P palette only, 2) one ~3 px dark-brown outline (outlined(): stroke 2·LW then fill),
 * 3) at most ONE inner detail colour band (gold / blue / green) — no gradients except sky & water,
 * 4) frontal or pure-profile view (no 3/4), 5) motion = 1 joint or 1 parameter (open, fill, sway, flame). */
import { P, LW, outlined, rgba, rng, lerp, clamp, mix, SERIF } from './look.js';

/* 1 · sun disk with optional rays (sky) */
export function sunDisk(ctx, x, y, r, { rays = 0, a = 1 } = {}) { ctx.save(); ctx.globalAlpha *= a;
  if (rays > 0) { ctx.strokeStyle = rgba(P.gold, 0.6 * rays); ctx.lineWidth = 3; for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * r * 1.25, y + Math.sin(an) * r * 1.25); ctx.lineTo(x + Math.cos(an) * r * (1.6 + rays * 0.3), y + Math.sin(an) * r * (1.6 + rays * 0.3)); ctx.stroke(); } }
  outlined(ctx, (c, m) => { c.beginPath(); c.arc(x, y, r, 0, 7); m === 'stroke' ? c.stroke() : c.fill(); }, P.red);
  ctx.strokeStyle = P.gold; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.arc(x, y, r * 0.88, 0, 7); ctx.stroke(); ctx.restore(); }

/* 2 · date palm (trunk with chevron scales, 7 fronds; sway = frond angle) */
export function palm(ctx, x, y, s = 1, { sway = 0 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const top = [10 + sway * 6, -260];
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-11, 0); c.quadraticCurveTo(-6, -140, top[0] - 6, top[1]); c.lineTo(top[0] + 6, top[1]); c.quadraticCurveTo(8, -140, 11, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.trunk);
  ctx.strokeStyle = rgba(P.line, 0.55); ctx.lineWidth = 2; for (let i = 1; i < 14; i++) { const yy = -i * 18, xx = lerp(0, top[0], i / 14); ctx.beginPath(); ctx.moveTo(xx - 8, yy + 4); ctx.lineTo(xx, yy - 3); ctx.lineTo(xx + 8, yy + 4); ctx.stroke(); }
  for (let i = 0; i < 7; i++) { const an = -Math.PI + 0.15 + i * (Math.PI - 0.3) / 6 + sway * 0.08; const L = 120 - Math.abs(i - 3) * 6; const ex = top[0] + Math.cos(an) * L, ey = top[1] + Math.sin(an) * L * 0.55 + 40 + Math.abs(Math.cos(an)) * 30;
    outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(top[0], top[1]); c.quadraticCurveTo(top[0] + Math.cos(an) * L * 0.5, top[1] + Math.sin(an) * L * 0.7 - 20, ex, ey); c.quadraticCurveTo(top[0] + Math.cos(an) * L * 0.55, top[1] + Math.sin(an) * L * 0.5, top[0], top[1] + 6); m === 'stroke' ? c.stroke() : c.fill(); }, i % 2 ? P.palm : mix(P.palm, P.grass, 0.35)); }
  ctx.fillStyle = P.redDark; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(top[0] - 10 + i * 5, top[1] + 12 + (i % 2) * 5, 5, 0, 7); ctx.fill(); }
  ctx.restore(); }

/* 3 · papyrus clump (green stalks + umbel fans) */
export function papyrus(ctx, x, y, s = 1, { sway = 0, n = 5 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < n; i++) { const bx = (i - (n - 1) / 2) * 16, h = 150 + ((i * 37) % 50), tx = bx * 1.8 + sway * 10 * (i % 2 ? 1 : -0.6), ty = -h;
    ctx.strokeStyle = P.line; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(bx, 0); ctx.quadraticCurveTo(bx, -h * 0.5, tx, ty); ctx.stroke(); ctx.strokeStyle = P.green; ctx.lineWidth = 3.5; ctx.stroke();
    outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx - 26, ty - 34); c.quadraticCurveTo(tx, ty - 46, tx + 26, ty - 34); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.grass);
    ctx.strokeStyle = rgba(P.grassDark, 0.9); ctx.lineWidth = 1.5; for (let j = -2; j <= 2; j++) { ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + j * 10, ty - 38); ctx.stroke(); } }
  ctx.restore(); }

/* 4 · lotus column (shaft + bands + flared capital) */
export function column(ctx, x, y, w, h, { tone = P.sand } = {}) { ctx.save();
  outlined(ctx, (c, m) => { c.beginPath(); c.rect(x - w / 2, y - h + w * 0.7, w, h - w * 0.7); m === 'stroke' ? c.stroke() : c.fill(); }, tone);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(x - w / 2, y - h + w * 0.7); c.quadraticCurveTo(x - w * 0.95, y - h + w * 0.2, x - w * 0.85, y - h); c.lineTo(x + w * 0.85, y - h); c.quadraticCurveTo(x + w * 0.95, y - h + w * 0.2, x + w / 2, y - h + w * 0.7); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.green);
  ctx.fillStyle = P.gold; ctx.fillRect(x - w * 0.85, y - h - w * 0.16, w * 1.7, w * 0.16); ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.strokeRect(x - w * 0.85, y - h - w * 0.16, w * 1.7, w * 0.16);
  for (const f of [0.18, 0.24, 0.3]) { ctx.fillStyle = f === 0.24 ? P.blue : P.red; ctx.fillRect(x - w / 2 + 2, y - h + w * 0.7 + h * f - 4, w - 4, 7); }
  ctx.strokeStyle = rgba(P.line, 0.3); ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + i * w / 4, y - h * 0.6); ctx.lineTo(x - w / 2 + i * w / 4, y - 4); ctx.stroke(); }
  ctx.restore(); }

/* 5 · hieroglyph glyph set + wall (rows inside ruled registers; reveal 0→1 carves left→right) */
const GLY = ['bird', 'eye', 'ankh', 'wave', 'reed', 'sun', 'loaf', 'snake', 'hand', 'owl', 'mouth', 'leg'];
export function glyph(ctx, name, x, y, s = 30, col = P.ink) { ctx.save(); ctx.translate(x, y); ctx.scale(s / 30, s / 30); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  switch (name) {
    case 'bird': ctx.moveTo(-10, 12); ctx.quadraticCurveTo(-12, -2, 0, -6); ctx.lineTo(6, -12); ctx.lineTo(10, -10); ctx.lineTo(6, -6); ctx.quadraticCurveTo(10, 6, -2, 8); ctx.lineTo(-14, 14); ctx.moveTo(-2, 8); ctx.lineTo(-2, 14); ctx.moveTo(2, 8); ctx.lineTo(3, 14); ctx.stroke(); break;
    case 'eye': ctx.moveTo(-12, 0); ctx.quadraticCurveTo(0, -10, 12, 0); ctx.quadraticCurveTo(0, 8, -12, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -1, 3.5, 0, 7); ctx.fill(); break;
    case 'ankh': ctx.ellipse(0, -8, 5, 7, 0, 0, 7); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke(); break;
    case 'wave': ctx.moveTo(-13, 0); for (let i = 0; i < 6; i++) ctx.lineTo(-13 + (i + 0.5) * 4.4, i % 2 ? 4 : -4); ctx.lineTo(13, 0); ctx.stroke(); break;
    case 'reed': ctx.moveTo(0, 14); ctx.lineTo(0, -6); ctx.moveTo(0, -6); ctx.quadraticCurveTo(6, -12, 2, -14); ctx.quadraticCurveTo(-4, -10, 0, -6); ctx.stroke(); break;
    case 'sun': ctx.arc(0, 0, 9, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, 7); ctx.fill(); break;
    case 'loaf': ctx.moveTo(-10, 6); ctx.quadraticCurveTo(0, -12, 10, 6); ctx.closePath(); ctx.fill(); break;
    case 'snake': ctx.moveTo(-12, 8); ctx.quadraticCurveTo(-6, 0, 0, 8); ctx.quadraticCurveTo(6, 14, 10, 4); ctx.lineTo(12, -4); ctx.stroke(); break;
    case 'hand': ctx.moveTo(-12, 4); ctx.lineTo(8, 4); ctx.quadraticCurveTo(14, 2, 10, -2); ctx.lineTo(-12, -2); ctx.closePath(); ctx.fill(); break;
    case 'owl': ctx.ellipse(0, 0, 7, 11, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(-3, -5, 1.8, 0, 7); ctx.arc(3, -5, 1.8, 0, 7); ctx.fill(); break;
    case 'mouth': ctx.ellipse(0, 0, 12, 4.5, 0, 0, 7); ctx.fill(); break;
    case 'leg': ctx.moveTo(-2, -14); ctx.lineTo(0, 10); ctx.lineTo(10, 12); ctx.stroke(); break;
  } ctx.restore(); }
export function hieroWall(ctx, x0, y0, x1, y1, { seed = 3, reveal = 1, col = P.ink, a = 0.8, cell = 46 } = {}) { const r = rng(seed); ctx.save(); ctx.globalAlpha *= a;
  const cols = Math.floor((x1 - x0) / cell), rows = Math.floor((y1 - y0) / cell); ctx.strokeStyle = rgba(P.line, 0.5); ctx.lineWidth = 2;
  for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(x0, y0 + j * cell); ctx.lineTo(x1, y0 + j * cell); ctx.stroke(); }
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const g = GLY[Math.floor(r() * GLY.length)]; const on = (i + j * 0.3) / cols; if (on > reveal) continue; glyph(ctx, g, x0 + (i + 0.5) * cell, y0 + (j + 0.5) * cell, cell * 0.62, r() < 0.12 ? P.blue : r() < 0.1 ? P.redDark : col); }
  ctx.restore(); }

/* 6 · Nile water band: blue with stacked zigzag ripples (t scrolls) */
export function nile(ctx, x0, y0, x1, y1, { t = 0 } = {}) { ctx.save(); const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, P.nileLite); g.addColorStop(1, P.nile); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = rgba('#0E2347', 0.9); ctx.lineWidth = 3; const off = (t * 30) % 24; for (let y = y0 + 14; y < y1; y += 22) { ctx.beginPath(); for (let x = x0 - 24 + off; x < x1 + 24; x += 12) ctx.lineTo(x, y + ((Math.round((x - off) / 12)) % 2 ? -5 : 5)); ctx.stroke(); }
  ctx.strokeStyle = P.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke(); ctx.restore(); }

/* 7 · copper chisel + wooden mallet (worker tool; ang = mallet swing) */
export function chisel(ctx, x, y, s = 1, ang = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(ang);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-3, -34); c.lineTo(3, -34); c.lineTo(3, 0); c.lineTo(0, 6); c.lineTo(-3, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, '#E09A5C'); ctx.fillStyle = P.line; ctx.fillRect(-3, -36, 6, 5); ctx.restore(); }
export function mallet(ctx, x, y, s = 1, ang = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(ang);
  outlined(ctx, (c, m) => { c.beginPath(); c.rect(-3, -6, 6, 34); m === 'stroke' ? c.stroke() : c.fill(); }, P.trunk);
  outlined(ctx, (c, m) => { c.beginPath(); c.ellipse(0, -18, 11, 15, 0, 0, 7); m === 'stroke' ? c.stroke() : c.fill(); }, '#9A6A3E'); ctx.restore(); }

/* 8 · oil lamp (clay saucer + flickering flame; t drives flicker) */
export function oilLamp(ctx, x, y, s = 1, { t = 0, lit = 1 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (lit > 0) { const fl = 1 + Math.sin(t * 23) * 0.08 + Math.sin(t * 37) * 0.06; const g = ctx.createRadialGradient(18, -26, 0, 18, -26, 90 * fl); g.addColorStop(0, `rgba(255,200,90,${0.45 * lit})`); g.addColorStop(1, 'rgba(255,200,90,0)'); ctx.fillStyle = g; ctx.fillRect(-80, -120, 200, 200);
    outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(18, -6); c.quadraticCurveTo(6, -18, 18 + Math.sin(t * 17) * 2, -34 * fl); c.quadraticCurveTo(30, -18, 18, -6); m === 'stroke' ? c.stroke() : c.fill(); }, P.gold, { lw: 1.5 }); }
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-26, -8); c.quadraticCurveTo(-22, 8, 0, 8); c.quadraticCurveTo(20, 8, 26, -6); c.lineTo(14, -8); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.clay); ctx.restore(); }

/* 9 · granary: mud-brick beehive silos, fill = grain level 0..1 visible through the hatch */
export function granary(ctx, x, y, s = 1, { fill = 1, n = 3 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  outlined(ctx, (c, m) => { c.beginPath(); c.rect(-n * 70 - 10, -40, n * 140 + 20, 40); m === 'stroke' ? c.stroke() : c.fill(); }, P.sandDark);
  for (let i = 0; i < n; i++) { const cx = (i - (n - 1) / 2) * 140; const dome = (c, m) => { c.beginPath(); c.moveTo(cx - 62, -40); c.lineTo(cx - 62, -150); c.quadraticCurveTo(cx - 60, -240, cx, -244); c.quadraticCurveTo(cx + 60, -240, cx + 62, -150); c.lineTo(cx + 62, -40); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); };
    outlined(ctx, dome, P.dune); ctx.save(); dome(ctx, 'none'); ctx.beginPath(); ctx.restore();
    ctx.fillStyle = rgba(P.jarDark, 0.35); ctx.fillRect(cx + 30, -236, 32, 196);
    // hatch shows grain level
    outlined(ctx, (c, m) => { c.beginPath(); c.rect(cx - 26, -130, 52, 70); m === 'stroke' ? c.stroke() : c.fill(); }, '#3A2214');
    const lv = clamp(fill, 0, 1); if (lv > 0) { ctx.fillStyle = P.gold; ctx.fillRect(cx - 24, -62 - 66 * lv, 48, 66 * lv); ctx.fillStyle = rgba(P.goldDark, 0.8); for (let k = 0; k < 10 * lv; k++) ctx.fillRect(cx - 20 + (k * 13) % 40, -64 - (k * 7) % (60 * lv), 4, 3); }
    outlined(ctx, (c, m) => { c.beginPath(); c.arc(cx, -246, 12, Math.PI, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.sandDark); }
  ctx.restore(); }

/* 10 · grain sack (linen bag, tied neck) and basket of grain */
export function grainSack(ctx, x, y, s = 1, { open = 0 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(-38, -40, -16, -60); c.lineTo(16, -60); c.quadraticCurveTo(38, -40, 30, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.linen);
  ctx.fillStyle = rgba(P.linenShade, 0.9); ctx.beginPath(); ctx.moveTo(10, 0); ctx.quadraticCurveTo(30, -30, 16, -58); ctx.lineTo(24, -50); ctx.quadraticCurveTo(36, -30, 30, 0); ctx.fill();
  if (open) { outlined(ctx, (c, m) => { c.beginPath(); c.ellipse(0, -62, 18, 7, 0, 0, 7); m === 'stroke' ? c.stroke() : c.fill(); }, P.gold); }
  else { outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-10, -60); c.lineTo(-14, -76); c.lineTo(14, -76); c.lineTo(10, -60); m === 'stroke' ? c.stroke() : c.fill(); }, P.linen); ctx.fillStyle = P.red; ctx.fillRect(-12, -64, 24, 5); }
  ctx.restore(); }
export function basket(ctx, x, y, s = 1, { full = 1 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (full > 0) outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-34, -30); c.quadraticCurveTo(0, -30 - 26 * full, 34, -30); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.gold);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-38, -32); c.lineTo(38, -32); c.lineTo(28, 0); c.lineTo(-28, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, '#B88A4E');
  ctx.strokeStyle = rgba(P.line, 0.5); ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-36 + i, -24 + i * 8); ctx.lineTo(36 - i * 3, -24 + i * 8); ctx.stroke(); } ctx.restore(); }

/* 11 · papyrus scroll: rolled ends + sheet; open 0..1 unrolls to w; lines = [[{t,c}]] written in ink (write 0..1 = chars shown) */
export function scroll(ctx, x, y, w, h, { open = 1, lines = [], write = 1, size = 34 } = {}) { ctx.save(); const ww = Math.max(18, w * open);
  outlined(ctx, (c, m) => { c.beginPath(); c.rect(x - ww / 2, y - h / 2, ww, h); m === 'stroke' ? c.stroke() : c.fill(); }, '#EBD9A8');
  ctx.save(); ctx.beginPath(); ctx.rect(x - ww / 2, y - h / 2, ww, h); ctx.clip(); ctx.strokeStyle = rgba('#B49A62', 0.4); ctx.lineWidth = 1; for (let i = -h; i < ww; i += 9) { ctx.beginPath(); ctx.moveTo(x - ww / 2 + i, y - h / 2); ctx.lineTo(x - ww / 2 + i, y + h / 2); ctx.stroke(); }
  if (lines.length) { ctx.font = `800 ${size}px ${SERIF}`; ctx.textBaseline = 'middle'; const tot = lines.reduce((s, l) => s + l.reduce((q, g) => q + [...g.t].length, 0), 0); let shown = Math.floor(tot * write);
    lines.forEach((ln, li) => { const lw2 = ln.reduce((s, g) => s + ctx.measureText(g.t).width, 0); let xx = x - lw2 / 2; const yy = y + (li - (lines.length - 1) / 2) * size * 1.45; ln.forEach(g => { const ch = [...g.t]; const vis = ch.slice(0, Math.max(0, shown)).join(''); shown -= ch.length; ctx.fillStyle = g.c === 'red' ? P.hiRed : g.c === 'blue' ? P.hiBlue : P.ink; ctx.fillText(vis, xx, yy); xx += ctx.measureText(g.t).width; }); }); }
  ctx.restore();
  for (const sx of [x - ww / 2, x + ww / 2]) outlined(ctx, (c, m) => { c.beginPath(); c.ellipse(sx, y, 11, h / 2 + 8, 0, 0, 7); m === 'stroke' ? c.stroke() : c.fill(); }, '#D8C08A');
  ctx.restore(); return { x0: x - ww / 2, x1: x + ww / 2 }; }
/* 12 · reed pen + palette (scribe kit) */
export function reedPen(ctx, x, y, s = 1, ang = -0.5) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(ang);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-2.5, -46); c.lineTo(2.5, -46); c.lineTo(1.5, 0); c.lineTo(0, 5); c.lineTo(-1.5, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, '#C9A766', { lw: 2 }); ctx.restore(); }
export function palette(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); outlined(ctx, (c, m) => { c.beginPath(); c.rect(-10, -40, 20, 80); m === 'stroke' ? c.stroke() : c.fill(); }, '#E6CF96');
  ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, -26, 5, 0, 7); ctx.fill(); ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(0, -12, 5, 0, 7); ctx.fill(); ctx.restore(); }

/* 13 · beer jar (amphora-ish, red clay, blue rim band) */
export function jar(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-12, -78); c.lineTo(12, -78); c.lineTo(10, -66); c.quadraticCurveTo(34, -52, 26, -20); c.quadraticCurveTo(16, 0, 0, 2); c.quadraticCurveTo(-16, 0, -26, -20); c.quadraticCurveTo(-34, -52, -10, -66); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.jar);
  ctx.fillStyle = P.blue; ctx.fillRect(-22, -50, 44, 6); ctx.fillStyle = rgba(P.jarDark, 0.6); ctx.beginPath(); ctx.moveTo(10, -64); ctx.quadraticCurveTo(32, -50, 24, -20); ctx.quadraticCurveTo(16, -4, 6, 0); ctx.quadraticCurveTo(22, -30, 10, -64); ctx.fill(); ctx.restore(); }
/* 14 · bread loaves (conical) */
export function bread(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [dx, h] of [[-18, 30], [0, 38], [18, 28]]) outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(dx - 12, 0); c.quadraticCurveTo(dx - 6, -h, dx, -h); c.quadraticCurveTo(dx + 6, -h, dx + 12, 0); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, '#C48A4A'); ctx.restore(); }

/* 15 · guard post / small pylon gate (two sloped towers + lintel with sun disk); n label */
export function pylon(ctx, x, y, s = 1, { n = null, tone = P.sand } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of [-1, 1]) outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(d * 30, 0); c.lineTo(d * 110, 0); c.lineTo(d * 96, -170); c.lineTo(d * 34, -170); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, tone);
  outlined(ctx, (c, m) => { c.beginPath(); c.rect(-40, -150, 80, 26); m === 'stroke' ? c.stroke() : c.fill(); }, tone);
  ctx.fillStyle = '#3A2214'; ctx.fillRect(-30, -124, 60, 124);
  for (const d of [-1, 1]) { ctx.fillStyle = P.blue; ctx.fillRect(d * 34 - (d < 0 ? 62 : 0), -164, 62, 8); }
  sunDisk(ctx, 0, -137, 9);
  if (n !== null) { ctx.fillStyle = P.cream; ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -200, 22, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = P.ink; ctx.font = `900 26px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 0, -199); }
  ctx.restore(); }
/* 16 · temple facade (columns + cornice) */
export function temple(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  outlined(ctx, (c, m) => { c.beginPath(); c.rect(-260, -40, 520, 40); m === 'stroke' ? c.stroke() : c.fill(); }, P.sandDark);
  for (let i = 0; i < 6; i++) column(ctx, -200 + i * 80, -40, 46, 260);
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-270, -300); c.lineTo(270, -300); c.lineTo(282, -340); c.lineTo(-282, -340); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, P.sand);
  ctx.fillStyle = P.blue; ctx.fillRect(-270, -318, 540, 8); sunDisk(ctx, 0, -320, 12); ctx.restore(); }
/* 17 · tally marks (hieratic day count: groups of strokes; n can be fractional → last stroke draws in) */
export function tally(ctx, x, y, n, { s = 1, col = P.ink, per = 10 } = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round';
  const full = Math.floor(n), frac = n - full; for (let i = 0; i < Math.ceil(n); i++) { const k = i < full ? 1 : frac; const g = Math.floor(i / per), j = i % per; const xx = j * 20 + g * 0, yy = g * 70; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 3 * k, yy + 48 * k); ctx.stroke(); }
  ctx.restore(); }
/* 18 · ankh (life sign, gold) */
export function ankh(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  for (const [lw, col] of [[16, P.line], [10, P.gold]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.ellipse(0, -30, 13, 18, 0, 0, 7); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 46); ctx.stroke(); } ctx.restore(); }
/* 19 · star sky (night): gold 5-point stars twinkle with t */
export function starSky(ctx, x0, y0, x1, y1, { t = 0, n = 40, seed = 5 } = {}) { const r = rng(seed); ctx.save(); const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#141C33'); g.addColorStop(1, '#2B3557'); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0) * 0.8, rr = 3 + r() * 5, ph = r() * 7; ctx.fillStyle = rgba(P.gold, 0.55 + 0.45 * Math.sin(t * 2 + ph) ** 2); ctx.beginPath(); for (let k = 0; k < 10; k++) { const an = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? rr * 0.45 : rr; ctx.lineTo(x + Math.cos(an) * q, y + Math.sin(an) * q); } ctx.fill(); }
  ctx.restore(); }
/* 20 · Theban hills: the pyramid-shaped peak (el-Qurn) over the Valley of the Kings + rock-cut tomb door */
export function hills(ctx, y, { tone = P.dune, door = null } = {}) { ctx.save(); const W2 = ctx.canvas.width;
  outlined(ctx, (c, m) => { c.beginPath(); c.moveTo(-10, y); c.lineTo(-10, y - 160); c.lineTo(260, y - 230); c.lineTo(520, y - 400); c.lineTo(760, y - 250); c.lineTo(1100, y - 300); c.lineTo(W2 + 10, y - 180); c.lineTo(W2 + 10, y); c.closePath(); m === 'stroke' ? c.stroke() : c.fill(); }, tone);
  ctx.fillStyle = rgba(P.jarDark, 0.25); ctx.beginPath(); ctx.moveTo(520, y - 400); ctx.lineTo(760, y - 250); ctx.lineTo(760, y); ctx.lineTo(600, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.line, 0.35); ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(80 + i * 150, y - 60 - (i % 3) * 30); ctx.lineTo(140 + i * 150, y - 70 - (i % 3) * 30); ctx.stroke(); }
  if (door) { const [dx, dy, dw, dh] = door; outlined(ctx, (c, m) => { c.beginPath(); c.rect(dx - dw / 2, dy - dh, dw, dh); m === 'stroke' ? c.stroke() : c.fill(); }, '#2A1A10'); ctx.fillStyle = P.sandDark; ctx.fillRect(dx - dw / 2 - 14, dy - dh - 16, dw + 28, 16); ctx.strokeStyle = P.line; ctx.strokeRect(dx - dw / 2 - 14, dy - dh - 16, dw + 28, 16); }
  ctx.restore(); }
export const PROPS = ['sunDisk', 'palm', 'papyrus', 'column', 'hieroWall/glyph', 'nile', 'chisel+mallet', 'oilLamp', 'granary', 'grainSack/basket', 'scroll', 'reedPen/palette', 'jar', 'bread', 'pylon', 'temple', 'tally', 'ankh', 'starSky', 'hills'];
