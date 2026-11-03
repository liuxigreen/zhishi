// style-iso: 等距微缩场景 — isometric cutaway dining room diorama, per-face shading, lamp light pool, tilt-shift blur, dense props
import { rng, mkCanvas, grain, vignette, SLIPS } from '../../core/util.js';
export const meta = { name: 'iso', zh: '等距微缩', propCount: 0 };

const C30 = Math.cos(Math.PI / 6), S30 = .5;
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * k, g = (n >> 8 & 255) * k, b = (n & 255) * k; return `rgb(${Math.min(255, r) | 0},${Math.min(255, g) | 0},${Math.min(255, b) | 0})`; }

export async function render(c, { W, H, seed }) {
  const ctx = c.getContext('2d'); const r = rng(seed); let props = 0;
  const s = 46, OX = 540, OY = 560; // iso origin (back corner of room, floor level)
  const P = (x, y, z) => [OX + (x - y) * C30 * s, OY + (x + y) * S30 * s - z * s];
  const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } };
  const box = (x, y, z, w, d, h, col, o = {}) => { props++;
    const k = o.k || [1, .78, .62]; const edge = 'rgba(0,0,0,.18)';
    poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], shade(col, k[2]), edge); // +x face
    poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], shade(col, k[1]), edge); // +y face
    poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], shade(col, k[0]), edge); // top
    if (o.hl) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(...P(x, y + d, z + h)); ctx.lineTo(...P(x + w, y + d, z + h)); ctx.lineTo(...P(x + w, y, z + h)); ctx.stroke(); } };
  const cyl = (x, y, z, rad, h, col) => { props++; const [cx, cy] = P(x, y, z), rx = rad * s * 1.2247, ry = rad * s * .7071;
    ctx.fillStyle = shade(col, .72); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI); ctx.lineTo(cx - rx, cy - h * s); ctx.ellipse(cx, cy - h * s, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, cy - h * s, rx, ry, 0, 0, 7); ctx.fill(); };
  const ball = (x, y, z, rad, col) => { props++; const [cx, cy] = P(x, y, z); const g = ctx.createRadialGradient(cx - rad * s * .3, cy - rad * s * .4, 1, cx, cy, rad * s); g.addColorStop(0, shade(col, 1.25)); g.addColorStop(1, shade(col, .7)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rad * s, 0, 7); ctx.fill(); };
  // background: deep gradient + soft spot behind diorama
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2b2340'); bg.addColorStop(1, '#120f1c'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const sp = ctx.createRadialGradient(540, 950, 50, 540, 950, 760); sp.addColorStop(0, 'rgba(255,190,140,.25)'); sp.addColorStop(1, 'rgba(255,190,140,0)'); ctx.fillStyle = sp; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 990); ctx.scale(1.25, 1.25); ctx.translate(-540, -668);
  const N = 11, WH = 7.5;
  // slab (diorama base thickness)
  box(0, 0, -1.2, N, N, 1.2, '#4a2f25', { k: [1, .7, .55] });
  // walls: back-left (x=0 plane) and back-right (y=0 plane)
  poly([P(0, 0, 0), P(0, N, 0), P(0, N, WH), P(0, 0, WH)], '#c8b48e'); // wall along y (x=0)
  poly([P(0, 0, 0), P(N, 0, 0), P(N, 0, WH), P(0, 0, WH)], '#e2cfa6'); // wall along x (y=0)
  // wallpaper stripes on x=0 wall
  for (let i = 0; i < N; i += 1) poly([P(0, i + .4, 0), P(0, i + .6, 0), P(0, i + .6, WH), P(0, i + .4, WH)], 'rgba(150,110,80,.18)');
  // wall thickness caps
  box(-.4, 0, 0, .4, N, WH, '#8a6a52'); box(0, -.4, 0, N, .4, WH, '#8a6a52');
  // skirting
  poly([P(0, 0, 0), P(0, N, 0), P(0, N, .4), P(0, 0, .4)], '#7a5a44'); poly([P(0, 0, 0), P(N, 0, 0), P(N, 0, .4), P(0, 0, .4)], '#8d6a50');
  // floor planks
  for (let i = 0; i < N; i++) poly([P(i, 0, 0), P(i + 1, 0, 0), P(i + 1, N, 0), P(i, N, 0)], i % 2 ? '#a8714a' : '#9c6842', 'rgba(60,30,15,.35)');
  // window on y=0 wall: night sky + moon + skyline
  poly([P(5.5, 0, 2.8), P(9.5, 0, 2.8), P(9.5, 0, 6.3), P(5.5, 0, 6.3)], '#1e3558');
  ctx.save(); ctx.beginPath(); [P(5.5, 0, 2.8), P(9.5, 0, 2.8), P(9.5, 0, 6.3), P(5.5, 0, 6.3)].forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.clip();
  { const [mx, my] = P(8.6, 0, 5.6); ctx.fillStyle = '#f8ecc6'; ctx.beginPath(); ctx.arc(mx, my, 16, 0, 7); ctx.fill(); }
  for (let i = 0; i < 8; i++) { const x0 = 5.5 + i * .5, hh = 3.4 + r() * 1.2; poly([P(x0, 0, 2.8), P(x0 + .5, 0, 2.8), P(x0 + .5, 0, hh), P(x0, 0, hh)], '#13233d'); for (let k = 0; k < 3; k++) if (r() < .6) { const [wx, wy] = P(x0 + .15 + r() * .2, 0, 3 + r() * (hh - 3.2)); ctx.fillStyle = '#f2c86a'; ctx.fillRect(wx, wy, 3, 4); } }
  ctx.restore();
  box(5.4, 0, 2.7, 4.2, .25, .12, '#f1e3c4'); box(5.4, 0, 6.3, 4.2, .25, .12, '#f1e3c4'); box(7.45, 0, 2.8, .1, .2, 3.5, '#f1e3c4');
  // curtains
  box(4.9, 0, 2.4, .5, .3, 4.3, '#b5432f'); box(9.6, 0, 2.4, .5, .3, 4.3, '#b5432f');
  // picture frames + clock on x=0 wall
  poly([P(0, 1.5, 3.6), P(0, 3.3, 3.6), P(0, 3.3, 5.4), P(0, 1.5, 5.4)], '#3a2a20'); poly([P(0, 1.7, 3.8), P(0, 3.1, 3.8), P(0, 3.1, 5.2), P(0, 1.7, 5.2)], '#6aa3a8'); props++;
  poly([P(0, 4, 4.6), P(0, 4.9, 4.6), P(0, 4.9, 5.6), P(0, 4, 5.6)], '#3a2a20'); poly([P(0, 4.1, 4.7), P(0, 4.8, 4.7), P(0, 4.8, 5.5), P(0, 4.1, 5.5)], '#e0a85a'); props++;
  { const [cx, cy] = P(0, 7, 5.6); ctx.fillStyle = '#f6efe0'; ctx.beginPath(); ctx.ellipse(cx, cy, 15, 22, -.5, 0, 7); ctx.fill(); ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 6, cy - 10); ctx.moveTo(cx, cy); ctx.lineTo(cx + 8, cy + 2); ctx.stroke(); props++; }
  // wall shelf with jars on x=0 wall
  box(0, 5.5, 3.6, .7, 3, .15, '#6b4430'); [[.3, 5.9, '#c94f3a'], [.3, 6.6, '#e3c35a'], [.3, 7.3, '#5f9e7a'], [.3, 8.1, '#d9d2c4']].forEach(([x, y, cc]) => cyl(x, y, 3.75, .22, .55, cc));
  // kitchen counter along x=0 wall (left) with stove, kettle, cutting board
  box(0, 5.4, 0, 1.6, 5.4, 2.2, '#e9dcc3', { hl: 1 }); box(0, 5.4, 2.2, 1.7, 5.5, .15, '#5a4a40');
  for (let i = 0; i < 3; i++) box(1.6, 5.6 + i * 1.75, .3, .02, 1.5, 1.6, '#d7c8ad');
  cyl(.8, 6.3, 2.35, .35, .5, '#3b6f87'); cyl(.8, 7.5, 2.35, .28, .35, '#b9b2a6'); box(.4, 8.6, 2.35, 1, 1.4, .1, '#c89a64'); cyl(.8, 10.2, 2.35, .25, .7, '#2f5a3a');
  // fridge in back corner
  box(0, 3.4, 0, 1.8, 1.9, 5.2, '#bfc9c4', { hl: 1 }); box(1.8, 3.6, 2.9, .08, .1, 1.2, '#8a9aa0');
  // sideboard along y=0 wall with tv-ish radio, vase, books
  box(1.8, 0, 0, 3, 1.3, 2.4, '#7a4b30', { hl: 1 }); box(2.1, .3, 2.4, 1.2, .7, .8, '#3a3a40'); cyl(4.2, .6, 2.4, .25, .9, '#2f6f8a'); ball(4.2, .6, 3.6, .35, '#3d8a5c');
  [[3.4, '#c94f3a'], [3.6, '#e0b04a'], [3.8, '#5a7fb0']].forEach(([x, cc]) => box(x, .3, 2.4, .18, .7, .9, cc));
  // floor plant near window
  cyl(10, 1.2, 0, .5, 1.2, '#c46a3c'); for (let i = 0; i < 7; i++) ball(10 + Math.cos(i) * .4, 1.2 + Math.sin(i) * .4, 1.6 + (i % 3) * .5, .45, i % 2 ? '#3d8a5c' : '#2f6b4a');
  // rug under table
  poly([P(3.5, 4, .01), P(9.3, 4, .01), P(9.3, 9.5, .01), P(3.5, 9.5, .01)], '#8e3b33'); poly([P(3.8, 4.3, .02), P(9, 4.3, .02), P(9, 9.2, .02), P(3.8, 9.2, .02)], '#b8574a'); props++;
  poly([P(4.4, 4.9, .03), P(8.4, 4.9, .03), P(8.4, 8.6, .03), P(4.4, 8.6, .03)], 'rgba(240,210,160,.25)');
  // chair behind table (B's)
  box(5, 4.2, 0, 1.4, 1.4, 1.5, '#6b3f27'); box(5, 4.2, 1.5, 1.4, .25, 2.2, '#6b3f27');
  // person B seated (behind table, facing +y toward A side), arms crossed
  box(5.25, 4.6, 1.5, .9, .7, 1.7, '#d99a2a'); box(5.15, 5.25, 2.5, 1.1, .35, .4, '#c2861f'); box(5.25, 5.3, 2.75, .9, .3, .3, '#b07618');
  ball(5.7, 4.95, 3.75, .42, '#f0c39c'); ball(5.62, 4.85, 4.0, .38, '#2b1d18'); ball(5.45, 4.7, 4.3, .2, '#2b1d18');
  { const [ex, ey] = P(5.7, 5.35, 3.75); ctx.fillStyle = '#2b1d18'; ctx.fillRect(ex - 9, ey - 3, 6, 2.5); ctx.fillRect(ex + 3, ey - 3, 6, 2.5); ctx.fillRect(ex - 4, ey + 8, 8, 2); }
  { const [ax, ay] = P(6.0, 5.0, 4.7); ctx.strokeStyle = '#e0342a'; ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let q = 0; q < 4; q++) { ctx.save(); ctx.translate(ax + 18, ay - 10); ctx.rotate(q * Math.PI / 2); ctx.beginPath(); ctx.moveTo(3, 7); ctx.quadraticCurveTo(3, 3, 7, 3); ctx.stroke(); ctx.restore(); } }
  // table
  box(4.2, 5.6, 0, .25, .25, 2.4, '#7a4b30'); box(8.2, 5.6, 0, .25, .25, 2.4, '#7a4b30');
  box(4, 5.4, 2.4, 4.7, 2.6, .25, '#8c5a36', { hl: 1 }); box(4, 5.4, 2.65, 4.7, 2.6, .02, '#f2ead8');
  box(4.2, 7.75, 0, .25, .25, 2.4, '#7a4b30'); box(8.2, 7.75, 0, .25, .25, 2.4, '#7a4b30');
  // table props: bowls, cups, chopsticks, dish of food, bottle, broken plate
  cyl(5.2, 6.1, 2.67, .3, .18, '#3f7c8c'); cyl(7.6, 6.2, 2.67, .3, .18, '#3f7c8c'); cyl(6.4, 6.6, 2.67, .5, .08, '#f7f3ea'); ball(6.4, 6.6, 2.85, .25, '#d9783a');
  cyl(8.1, 5.8, 2.67, .18, .9, '#2d5a3a'); cyl(4.6, 7.4, 2.67, .15, .35, '#e8e2d6');
  box(7.0, 7.2, 2.67, .9, .05, .03, '#d9b26a'); box(7.0, 7.3, 2.67, .9, .05, .03, '#d9b26a');
  [[5.8, 7.5], [6.2, 7.7], [6.7, 7.45], [5.5, 7.8]].forEach(([x, y], i) => { const [px, py] = P(x, y, 2.68); ctx.fillStyle = i % 2 ? '#fbf6ec' : '#e8e4da'; ctx.beginPath(); ctx.moveTo(px, py - 6); ctx.lineTo(px + 14 - i * 2, py); ctx.lineTo(px - 2, py + 6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#2f5e9e'; ctx.lineWidth = 1.5; ctx.stroke(); props++; });
  // slips pile on table edge and floor
  const tinySlip = (x, y, z, a) => { const [px, py] = P(x, y, z); ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.fillStyle = '#fff5dc'; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 2; ctx.fillRect(-11, -4, 22, 8); ctx.restore(); ctx.fillStyle = 'rgba(80,40,20,.6)'; ctx.fillRect(px - 6, py - 1, 12, 1.5); props++; };
  for (let i = 0; i < 9; i++) tinySlip(4.4 + r() * 1.2, 7.4 + r() * .5, 2.7 + i * .02, (r() - .5) * 1.2);
  for (let i = 0; i < 14; i++) tinySlip(2.6 + r() * 2.2, 8.2 + r() * 2.2, .02, (r() - .5) * 2);
  // trash bin overflowing with crumpled excuses
  cyl(2, 9.6, 0, .45, 1, '#5a6470'); for (let i = 0; i < 6; i++) ball(1.8 + r() * .4, 9.4 + r() * .4, 1.05 + r() * .3, .18, '#f6ecd6');
  // cat on floor ignoring everything
  ball(9.3, 9.6, .35, .4, '#e0a050'); ball(9.0, 9.95, .6, .26, '#e0a050'); { const [cx, cy] = P(9.0, 9.95, .85); ctx.fillStyle = '#e0a050'; ctx.beginPath(); ctx.moveTo(cx - 10, cy); ctx.lineTo(cx - 6, cy - 12); ctx.lineTo(cx - 1, cy); ctx.moveTo(cx + 1, cy); ctx.lineTo(cx + 6, cy - 12); ctx.lineTo(cx + 10, cy); ctx.fill(); }
  // person A standing front-left of table, bowing toward B, palms together
  box(3.2, 8.2, 0, .32, .32, 1.9, '#2c3550'); box(3.2, 8.7, 0, .32, .32, 1.9, '#2c3550');
  box(3.15, 8.15, 1.9, .5, .95, 1.1, '#8db7d1'); box(3.5, 8.2, 2.6, .55, .85, .7, '#7aa6c2'); // torso leaning forward (+x)
  box(4.0, 8.45, 2.9, .5, .25, .22, '#7aa6c2'); box(4.45, 8.5, 3.0, .18, .16, .5, '#f0c39c'); // forearms + pressed palms
  ball(4.2, 8.6, 3.5, .4, '#f0c39c'); ball(4.05, 8.55, 3.68, .36, '#3a2418');
  { const [sx, sy] = P(4.5, 8.6, 3.85); ctx.fillStyle = '#bfe6ff'; ctx.beginPath(); ctx.ellipse(sx + 6, sy - 4, 3, 5, .3, 0, 7); ctx.fill(); }
  // pendant lamp + warm light pool
  { const [lx, ly] = P(6.3, 6.6, 7.4); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, ly - 220); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.fillStyle = '#c2452f'; ctx.beginPath(); ctx.moveTo(lx - 14, ly); ctx.lineTo(lx + 14, ly); ctx.lineTo(lx + 40, ly + 30); ctx.lineTo(lx - 40, ly + 30); ctx.closePath(); ctx.fill(); props++;
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const [tx, ty] = P(6.3, 6.6, 2.7); const g = ctx.createRadialGradient(tx, ty, 10, tx, ty, 360); g.addColorStop(0, 'rgba(255,214,140,.55)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const cg = ctx.createLinearGradient(0, ly + 30, 0, ty); cg.addColorStop(0, 'rgba(255,220,160,.35)'); cg.addColorStop(1, 'rgba(255,220,160,.05)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(lx - 40, ly + 30); ctx.lineTo(lx + 40, ly + 30); ctx.lineTo(tx + 210, ty); ctx.lineTo(tx - 210, ty); ctx.closePath(); ctx.fill();
    const bb = ctx.createRadialGradient(lx, ly + 32, 2, lx, ly + 32, 60); bb.addColorStop(0, 'rgba(255,250,225,1)'); bb.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = bb; ctx.fillRect(lx - 60, ly - 30, 120, 120); ctx.restore(); }
  ctx.restore();
  // night cool cast on far half
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; const nc = ctx.createLinearGradient(0, 300, 0, 1500); nc.addColorStop(0, 'rgba(120,130,190,1)'); nc.addColorStop(.5, 'rgba(255,240,230,1)'); nc.addColorStop(1, 'rgba(150,140,190,1)'); ctx.fillStyle = nc; ctx.fillRect(0, 0, W, H); ctx.restore();
  // floating excuse slips (screen-space, legible) rising from A toward B
  const slip = (x, y, a, t, sc = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(sc, sc); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#fff4d8'; ctx.fillRect(-90, -30, 180, 60); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#4a2416'; ctx.font = `${Math.min(38, 160 / t.length)}px Brush`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, 0, 3); ctx.restore(); props++; };
  ctx.save(); ctx.translate(540, 990); ctx.scale(1.25, 1.25); ctx.translate(-540, -668);
  slip(...P(3.2, 8.8, 5.3), -.16, SLIPS[0], .95); slip(...P(4.6, 5.6, 7.4), .1, SLIPS[1]); slip(...P(9.2, 4.2, 6.2), -.08, SLIPS[3], .9); slip(...P(2.2, 10.6, 3.2), .18, SLIPS[2], .85); slip(...P(7.6, 9.6, 4.2), -.12, SLIPS[4], .8);
  ctx.restore();
  // tilt-shift: blur top and bottom bands progressively
  const snap = mkCanvas(W, H); snap.getContext('2d').drawImage(c, 0, 0);
  const band = (y0, y1, px, up) => { const m = mkCanvas(W, H), x = m.getContext('2d'); x.filter = `blur(${px}px)`; x.drawImage(snap, 0, 0); x.filter = 'none'; x.globalCompositeOperation = 'destination-in';
    const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, up ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)'); g.addColorStop(1, up ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)'); x.fillStyle = g; x.fillRect(0, up ? 0 : y0, W, up ? y1 : H - y0); ctx.drawImage(m, 0, 0); };
  band(0, 640, 8, true); band(1450, 1920, 10, false);
  // saturation/contrast pop typical of miniature photos
  const id = ctx.getImageData(0, 0, W, H), d = id.data; for (let i = 0; i < d.length; i += 4) { const l = (d[i] + d[i + 1] + d[i + 2]) / 3; for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, l + (d[i + k] - l) * 1.25)); } ctx.putImageData(id, 0, 0);
  vignette(ctx, W, H, .5); grain(ctx, W, H, .025, seed);
  meta.propCount = props;
}
