// style-noir: 黑色电影剪影 — cone key light, rim light, volumetric haze, blind shadows, film grain
import { rng, fbm, grain, vignette, mkCanvas, SLIPS } from '../../core/util.js';
export const meta = { name: 'noir', zh: '黑色电影剪影', key: [255, 214, 150] };

// figures as unions of primitives -> mask; rim light = mask minus mask shifted away from light
const E = (x, y, rx, ry, a = 0) => c => { c.beginPath(); c.ellipse(x, y, rx, ry, a, 0, 7); c.fill(); };
const Q = pts => c => { c.beginPath(); c.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) { const p = pts[i]; p.length === 6 ? c.bezierCurveTo(...p) : p.length === 4 ? c.quadraticCurveTo(...p) : c.lineTo(...p); } c.closePath(); c.fill(); };
const SH_B = [ // person B: seated behind table, facing left, arms crossed, cold
  E(800, 700, 64, 78), Q([[742, 690], [722, 712], [742, 722]]), // head + nose
  Q([[740, 640], [760, 590, 860, 585, 868, 650], [872, 700], [850, 690, 800, 660, 760, 668]]), // hair mass
  Q([[762, 740], [770, 845], [852, 845], [850, 740]]), // neck
  Q([[690, 1200], [672, 950, 700, 850, 800, 822], [920, 820, 975, 870, 985, 960], [995, 1200]]), // torso (shirt)
];
const SH_A = [ // person A: standing left, hunched + head bowed toward table, palms pressed together
  E(378, 985, 60, 74, .55), Q([[428, 1030], [450, 1048], [424, 1056]]), // head tilted + nose
  Q([[330, 930], [345, 900], [352, 925]]), Q([[350, 918], [372, 892], [372, 920]]), // hair tufts
  Q([[318, 1000], [356, 1046], [318, 1074], [282, 1036]]), // neck
  Q([[140, 1720], [100, 1400, 120, 1150, 196, 1062], [236, 1010, 326, 1000, 352, 1052], [392, 1150, 362, 1400, 342, 1720]]), // hunched torso
  Q([[300, 1150], [380, 1172, 432, 1080, 456, 1002], [476, 992, 486, 1006, 476, 1022], [452, 1112, 402, 1212, 312, 1212]]), // forearm up
  Q([[452, 1012], [480, 922], [500, 916, 502, 934, 496, 952], [476, 1032]]), // pressed palms
  Q([[160, 1700], [175, 1920], [250, 1920], [245, 1710]]), Q([[250, 1700], [285, 1920], [345, 1920], [335, 1710]]), // legs
];
const SH_B_ARMS = [Q([[662, 985], [700, 935, 860, 930, 930, 962], [948, 1000, 930, 1034, 900, 1030], [800, 1020, 720, 1032, 680, 1047], [648, 1042, 646, 1000, 662, 985]]),
  Q([[690, 1010], [760, 990, 840, 990, 900, 1000], [910, 1020, 900, 1036, 880, 1036], [800, 1036, 740, 1040, 700, 1046]]), E(892, 968, 26, 20, .3)];
function mask(shapes, W, H) { const m = mkCanvas(W, H), x = m.getContext('2d'); x.fillStyle = '#fff'; shapes.forEach(f => f(x)); return m; }
function rimSil(ctx, shapes, dx, dy, rim, body, W, H, glow = .6) {
  const m = mask(shapes, W, H);
  const lay = mkCanvas(W, H), L = lay.getContext('2d'); L.fillStyle = rim; L.fillRect(0, 0, W, H); L.globalCompositeOperation = 'destination-in'; L.drawImage(m, 0, 0);
  const bod = mkCanvas(W, H), B = bod.getContext('2d'); B.fillStyle = body(B); B.fillRect(0, 0, W, H); B.globalCompositeOperation = 'destination-in'; B.drawImage(m, dx, dy);
  L.globalCompositeOperation = 'source-atop'; L.drawImage(bod, 0, 0);
  const rimOnly = mkCanvas(W, H), R = rimOnly.getContext('2d'); R.drawImage(m, 0, 0); R.globalCompositeOperation = 'destination-out'; R.drawImage(m, dx, dy); R.globalCompositeOperation = 'source-in'; R.fillStyle = rim; R.fillRect(0, 0, W, H);
  ctx.drawImage(lay, 0, 0);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = glow; ctx.filter = 'blur(10px)'; ctx.drawImage(rimOnly, 0, 0); ctx.restore();
  return m; }

async function hook(c, { W, H, seed }) {
  const ctx = c.getContext('2d'); const r = rng(seed);
  const K = 'rgba(255,214,150,'; const lamp = [540, 420];
  // wall: deep teal-black with plaster noise
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0b1016'); bg.addColorStop(.55, '#121a22'); bg.addColorStop(1, '#07090c');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const tex = ctx.getImageData(0, 0, W, H); const d = tex.data;
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) { const n = (fbm(x / 90, y / 90, 3) - .5) * 26; const k = (y * W + x) * 4; d[k] += n; d[k+1] += n; d[k+2] += n * 1.1; }
  ctx.putImageData(tex, 0, 0);
  // venetian blind light slats (cool moonlight) across back wall
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(560, 120); ctx.transform(1, .32, -.18, 1, 0, 0);
  for (let i = 0; i < 9; i++) { const g = ctx.createLinearGradient(0, 0, 520, 0); g.addColorStop(0, 'rgba(120,160,200,0)'); g.addColorStop(.35, 'rgba(120,160,200,.16)'); g.addColorStop(1, 'rgba(120,160,200,0)');
    ctx.fillStyle = g; ctx.filter = 'blur(3px)'; ctx.fillRect(0, i * 46, 560, 24); }
  ctx.restore(); ctx.filter = 'none';
  // picture frame on wall (silhouette prop)
  ctx.fillStyle = '#05070a'; ctx.fillRect(110, 360, 190, 240); ctx.strokeStyle = 'rgba(255,214,150,.18)'; ctx.lineWidth = 3; ctx.strokeRect(110, 360, 190, 240);
  // light cone volumetric
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const cone = new Path2D(); cone.moveTo(lamp[0] - 70, lamp[1] + 40); cone.lineTo(lamp[0] + 70, lamp[1] + 40); cone.lineTo(1020, 1290); cone.lineTo(60, 1290); cone.closePath();
  const cg = ctx.createLinearGradient(0, lamp[1], 0, 1290); cg.addColorStop(0, K + '.55)'); cg.addColorStop(.6, K + '.18)'); cg.addColorStop(1, K + '.06)');
  ctx.filter = 'blur(26px)'; ctx.fillStyle = cg; ctx.fill(cone); ctx.filter = 'none';
  // haze noise inside cone
  ctx.clip(cone); const hz = mkCanvas(270, 480), hx = hz.getContext('2d'); const hid = hx.createImageData(270, 480);
  for (let y = 0; y < 480; y++) for (let x = 0; x < 270; x++) { const n = fbm(x / 30 + 3, y / 22, 4); const k = (y * 270 + x) * 4; hid.data[k] = 255; hid.data[k+1] = 214; hid.data[k+2] = 160; hid.data[k+3] = Math.max(0, n - .42) * 210; }
  hx.putImageData(hid, 0, 0); ctx.globalAlpha = .55; ctx.drawImage(hz, 0, 0, W, H); ctx.globalAlpha = 1; ctx.restore();
  // lamp shade
  ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lamp[0], 0); ctx.lineTo(lamp[0], lamp[1] - 60); ctx.stroke();
  ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.moveTo(lamp[0] - 30, lamp[1] - 62); ctx.lineTo(lamp[0] + 30, lamp[1] - 62); ctx.lineTo(lamp[0] + 88, lamp[1] + 40); ctx.lineTo(lamp[0] - 88, lamp[1] + 40); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,220,170,.5)'; ctx.lineWidth = 2; ctx.stroke();
  const bulb = ctx.createRadialGradient(lamp[0], lamp[1] + 40, 2, lamp[0], lamp[1] + 40, 120); bulb.addColorStop(0, 'rgba(255,248,225,1)'); bulb.addColorStop(.25, K + '.7)'); bulb.addColorStop(1, K + '0)');
  ctx.fillStyle = bulb; ctx.beginPath(); ctx.ellipse(lamp[0], lamp[1] + 44, 120, 60, 0, 0, 7); ctx.fill();
  // person B behind table, rim on upper-left (lamp is up-left of him)
  const mB = rimSil(ctx, SH_B, 9, 7, 'rgba(255,214,150,1)', B => { const g = B.createLinearGradient(700, 650, 1000, 1150); g.addColorStop(0, '#3b3126'); g.addColorStop(.35, '#16141a'); g.addColorStop(1, '#050507'); return g; }, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.restore();
  { const fc = mkCanvas(W, H), F = fc.getContext('2d'); F.strokeStyle = 'rgba(255,205,140,.28)'; F.lineWidth = 3.5; F.lineCap = 'round';
    [[720, 900, 740, 960], [880, 860, 920, 940], [700, 1070, 720, 1170], [820, 1040, 860, 1120], [700, 975, 900, 990]].forEach(([a, b, e, f]) => { F.beginPath(); F.moveTo(a, b); F.quadraticCurveTo((a + e) / 2 + 14, (b + f) / 2 - 6, e, f); F.stroke(); });
    F.globalCompositeOperation = 'destination-in'; F.drawImage(mB, 0, 0); ctx.drawImage(fc, 0, 0); }
  rimSil(ctx, SH_B_ARMS, 6, 8, 'rgba(255,214,150,.95)', B => { const g = B.createLinearGradient(0, 930, 0, 1050); g.addColorStop(0, '#4a3d30'); g.addColorStop(.5, '#1d1a1c'); g.addColorStop(1, '#08080a'); return g; }, W, H, .5);
  // eye glint B (cold stare)
  ctx.fillStyle = 'rgba(255,235,200,.85)'; ctx.beginPath(); ctx.ellipse(758, 690, 6, 2.6, -.2, 0, 7); ctx.fill();
  // table: top surface in light, front apron dark
  const tt = ctx.createLinearGradient(0, 1150, 0, 1215); tt.addColorStop(0, '#5a4330'); tt.addColorStop(1, '#2a1d14');
  ctx.fillStyle = tt; ctx.beginPath(); ctx.moveTo(150, 1215); ctx.lineTo(240, 1150); ctx.lineTo(1000, 1150); ctx.lineTo(1080, 1215); ctx.closePath(); ctx.fill();
  const pool = ctx.createRadialGradient(560, 1185, 10, 560, 1185, 420); pool.addColorStop(0, K + '.75)'); pool.addColorStop(1, K + '0)');
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = pool; ctx.beginPath(); ctx.moveTo(150, 1215); ctx.lineTo(240, 1150); ctx.lineTo(1000, 1150); ctx.lineTo(1080, 1215); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#0b0806'; ctx.fillRect(150, 1215, 930, 60); ctx.fillStyle = 'rgba(255,214,150,.35)'; ctx.fillRect(150, 1215, 930, 2);
  // tablecloth drape folds
  const cl = ctx.createLinearGradient(0, 1275, 0, 1500); cl.addColorStop(0, '#15100d'); cl.addColorStop(1, '#030303'); ctx.fillStyle = cl;
  ctx.beginPath(); ctx.moveTo(150, 1275); for (let x = 150; x <= 1080; x += 62) ctx.quadraticCurveTo(x + 31, 1290 + (x % 124 ? 30 : 10), x + 62, 1275); ctx.lineTo(1080, 1520); ctx.lineTo(150, 1520); ctx.fill();
  ctx.strokeStyle = 'rgba(255,214,150,.07)'; ctx.lineWidth = 6; for (let x = 180; x < 1080; x += 62) { ctx.beginPath(); ctx.moveTo(x, 1290); ctx.lineTo(x + 8, 1520); ctx.stroke(); }
  // glass + wine bottle silhouettes on table (props)
  ctx.save(); ctx.translate(70, 0); ctx.fillStyle = '#060606'; ctx.beginPath(); ctx.moveTo(880, 1150); ctx.lineTo(880, 1040); ctx.quadraticCurveTo(880, 1000, 900, 990); ctx.lineTo(900, 940); ctx.lineTo(920, 940); ctx.lineTo(920, 990); ctx.quadraticCurveTo(940, 1000, 940, 1040); ctx.lineTo(940, 1150); ctx.fill();
  ctx.strokeStyle = 'rgba(255,214,150,.7)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(884, 1140); ctx.lineTo(884, 1040); ctx.quadraticCurveTo(884, 1004, 902, 994); ctx.stroke(); ctx.restore();
  // broken plate: shards with specular edges
  const shards = [[[700, 1188], [770, 1176], [760, 1200]], [[778, 1174], [840, 1180], [820, 1202], [775, 1198]], [[848, 1186], [885, 1195], [858, 1206]], [[660, 1204], [700, 1198], [686, 1210]], [[905, 1204], [930, 1200], [925, 1210]]];
  shards.forEach((s, i) => { ctx.beginPath(); s.forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    const g = ctx.createLinearGradient(s[0][0], s[0][1], s[1][0], s[1][1]); g.addColorStop(0, '#f6efe2'); g.addColorStop(1, '#9d9384'); ctx.fillStyle = g; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.5; ctx.stroke(); });
  // excuse slips: pile on table + fluttering in the cone, glowing paper
  const slip = (x, y, a, txt, s = 1, glow = .9) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 10; const g = ctx.createLinearGradient(-90, -32, 90, 32); g.addColorStop(0, `rgba(255,240,205,${glow})`); g.addColorStop(1, `rgba(190,160,115,${glow})`);
    ctx.fillStyle = g; ctx.fillRect(-92, -30, 184, 60); ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(40,20,10,.85)'; ctx.font = '38px Brush'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 2); ctx.restore(); };
  [[560, 1178, -.08], [600, 1170, .12], [585, 1160, -.2], [625, 1152, .05], [570, 1146, .25], [610, 1136, -.1]].forEach(([x, y, a], i) => slip(x, y, a, SLIPS[i], .78, .8 + i * .03));
  slip(640, 900, -.25, '是你先凶的', .95); slip(660, 790, .22, '我也很难', 1.05); slip(560, 1050, .12, SLIPS[6], .9); slip(500, 720, -.16, SLIPS[7], .85, .8);
  // person A, rim on upper-right (lamp is up-right of him)
  const mA = rimSil(ctx, SH_A, -10, 8, 'rgba(255,220,160,1)', B => { const g = B.createLinearGradient(420, 880, 150, 1600); g.addColorStop(0, '#3a2e24'); g.addColorStop(.3, '#17130f'); g.addColorStop(1, '#040303'); return g; }, W, H, .8);
  { const fc = mkCanvas(W, H), F = fc.getContext('2d'); F.strokeStyle = 'rgba(255,205,140,.25)'; F.lineWidth = 3.5; F.lineCap = 'round';
    [[320, 1070, 300, 1300], [230, 1080, 200, 1300], [290, 1260, 300, 1500], [180, 1420, 200, 1680], [340, 1180, 420, 1100], [280, 1050, 330, 1120]].forEach(([a, b, e, f]) => { F.beginPath(); F.moveTo(a, b); F.quadraticCurveTo((a + e) / 2 + 16, (b + f) / 2, e, f); F.stroke(); });
    F.globalCompositeOperation = 'destination-in'; F.drawImage(mA, 0, 0); ctx.drawImage(fc, 0, 0); }
  // sweat drop catch light near temple
  ctx.fillStyle = 'rgba(255,240,210,.9)'; ctx.beginPath(); ctx.ellipse(420, 950, 4, 7, .3, 0, 7); ctx.fill();
  // dust motes
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.clip(cone);
  for (let i = 0; i < 260; i++) { const y = lamp[1] + 60 + r() * 800, x = 80 + r() * 920, s = r() * 2.6 + .4; ctx.fillStyle = K + (.2 + r() * .6) + ')'; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); }
  ctx.restore();
  // floor shadow band bottom
  const fl = ctx.createLinearGradient(0, 1500, 0, H); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(1, 'rgba(0,0,0,.85)'); ctx.fillStyle = fl; ctx.fillRect(0, 1500, W, H - 1500);
  vignette(ctx, W, H, .7); grain(ctx, W, H, .07, seed);
}

// ───────────── shared noir helpers for multi-scene beats ─────────────
const KEY = 'rgba(255,214,150,';
function wallBase(ctx, W, H, top = '#0b1016', mid = '#121a22', bot = '#07090c', s = 90) {
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, top); bg.addColorStop(.55, mid); bg.addColorStop(1, bot);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const tex = ctx.getImageData(0, 0, W, H), d = tex.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = (fbm(x / s, y / s, 3) - .5) * 26; const k = (y * W + x) * 4; d[k] += n; d[k + 1] += n; d[k + 2] += n * 1.1; }
  ctx.putImageData(tex, 0, 0); }
function coneLight(ctx, W, H, lx, ly, topW, x0, x1, yb, a = .55, col = KEY) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const cone = new Path2D(); cone.moveTo(lx - topW, ly); cone.lineTo(lx + topW, ly); cone.lineTo(x1, yb); cone.lineTo(x0, yb); cone.closePath();
  const g = ctx.createLinearGradient(0, ly, 0, yb); g.addColorStop(0, col + a + ')'); g.addColorStop(.6, col + a * .33 + ')'); g.addColorStop(1, col + a * .1 + ')');
  ctx.filter = 'blur(26px)'; ctx.fillStyle = g; ctx.fill(cone); ctx.filter = 'none';
  ctx.clip(cone); const hz = mkCanvas(270, 480), hx = hz.getContext('2d'), id = hx.createImageData(270, 480);
  for (let y = 0; y < 480; y++) for (let x = 0; x < 270; x++) { const n = fbm(x / 30 + lx / 97, y / 22, 4); const k = (y * 270 + x) * 4; id.data[k] = 255; id.data[k + 1] = 214; id.data[k + 2] = 160; id.data[k + 3] = Math.max(0, n - .42) * 210; }
  hx.putImageData(id, 0, 0); ctx.globalAlpha = .5; ctx.drawImage(hz, 0, 0, W, H); ctx.globalAlpha = 1; ctx.restore(); return cone; }
function lampShade(ctx, x, y, s = 1) {
  ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - 60 * s); ctx.stroke();
  ctx.fillStyle = '#0a0a0a'; ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 62 * s); ctx.lineTo(x + 30 * s, y - 62 * s); ctx.lineTo(x + 88 * s, y + 40 * s); ctx.lineTo(x - 88 * s, y + 40 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,220,170,.5)'; ctx.lineWidth = 2; ctx.stroke();
  const b = ctx.createRadialGradient(x, y + 40 * s, 2, x, y + 40 * s, 120 * s); b.addColorStop(0, 'rgba(255,248,225,1)'); b.addColorStop(.25, KEY + '.7)'); b.addColorStop(1, KEY + '0)');
  ctx.fillStyle = b; ctx.beginPath(); ctx.ellipse(x, y + 44 * s, 120 * s, 60 * s, 0, 0, 7); ctx.fill(); }
function motes(ctx, cone, r, n, x0, x1, y0, y1) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.clip(cone);
  for (let i = 0; i < n; i++) { const y = y0 + r() * (y1 - y0), x = x0 + r() * (x1 - x0), s = r() * 2.6 + .4; ctx.fillStyle = KEY + (.2 + r() * .6) + ')'; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); } ctx.restore(); }
function foldLines(ctx, m, W, H, lines, a = .26) { const fc = mkCanvas(W, H), F = fc.getContext('2d'); F.strokeStyle = `rgba(255,205,140,${a})`; F.lineWidth = 3.5; F.lineCap = 'round';
  lines.forEach(([x0, y0, x1, y1]) => { F.beginPath(); F.moveTo(x0, y0); F.quadraticCurveTo((x0 + x1) / 2 + 14, (y0 + y1) / 2 - 6, x1, y1); F.stroke(); });
  F.globalCompositeOperation = 'destination-in'; F.drawImage(m, 0, 0); ctx.drawImage(fc, 0, 0); }
const cloth = (a, b, c, x0, y0, x1, y1) => B => { const g = B.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(.35, b); g.addColorStop(1, c); return g; };
// lit plaque: wood face with lit gradient, brass rim, carved serif text
function plaque(ctx, cx, cy, w, h, rot, txt, { face = ['#6b4c30', '#2a1a10'], rim = 'rgba(255,214,150,.9)', ink = '#f6e6c8', fs = 150, sub = null } = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 26;
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, face[0]); g.addColorStop(1, face[1]); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = rim; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
  ctx.strokeStyle = 'rgba(255,240,210,.9)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.stroke(); // top edge catches the light
  for (let i = 0; i < 14; i++) { ctx.strokeStyle = `rgba(0,0,0,${.08 + (i % 3) * .04})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2 + 14, -h / 2 + 18 + i * (h - 36) / 14); ctx.bezierCurveTo(-w / 6, -h / 2 + 24 + i * (h - 36) / 14, w / 6, -h / 2 + 12 + i * (h - 36) / 14, w / 2 - 14, -h / 2 + 18 + i * (h - 36) / 14); ctx.stroke(); }
  ctx.font = `900 ${fs}px NSerif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillText(txt, 4, (sub ? -18 : 0) + 6); ctx.fillStyle = ink; ctx.fillText(txt, 0, sub ? -18 : 0);
  if (sub) { ctx.font = `600 ${fs * .26}px NSerif`; ctx.fillStyle = 'rgba(246,230,200,.75)'; ctx.fillText(sub, 0, h / 2 - fs * .32); }
  ctx.restore(); }

// ───────────── A3 · mechanism: 辩解牌 ↔ 认错牌 对撞 (new location: empty hall / backlit door) ─────────────
async function mid(c, { W, H, seed }) {
  const ctx = c.getContext('2d'); const r = rng(seed + 11);
  wallBase(ctx, W, H, '#0a0e13', '#10161d', '#050608', 120);
  // tall arched window: cool moonlight slats on the floor/back wall (different set from the dining room)
  ctx.save(); ctx.fillStyle = '#04060a'; ctx.beginPath(); ctx.moveTo(90, 1150); ctx.lineTo(90, 330); ctx.arc(250, 330, 160, Math.PI, 0); ctx.lineTo(410, 1150); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 6; i++) { const g = ctx.createLinearGradient(90, 0, 410, 0); g.addColorStop(0, 'rgba(110,150,200,0)'); g.addColorStop(.5, 'rgba(110,150,200,.22)'); g.addColorStop(1, 'rgba(110,150,200,0)'); ctx.fillStyle = g; ctx.fillRect(96, 360 + i * 130, 308, 54); }
  ctx.strokeStyle = 'rgba(140,170,210,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, 170); ctx.lineTo(250, 1150); ctx.stroke(); ctx.restore();
  // backlit door on right: relationship (B) walking out
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const dg = ctx.createLinearGradient(880, 0, 1060, 0); dg.addColorStop(0, 'rgba(255,200,140,.05)'); dg.addColorStop(.5, 'rgba(255,214,160,.55)'); dg.addColorStop(1, 'rgba(255,200,140,.1)');
  ctx.fillStyle = dg; ctx.fillRect(880, 1060, 170, 560); ctx.filter = 'blur(30px)'; ctx.fillStyle = 'rgba(255,200,140,.25)'; ctx.beginPath(); ctx.moveTo(880, 1620); ctx.lineTo(1050, 1620); ctx.lineTo(1080, 1900); ctx.lineTo(600, 1900); ctx.fill(); ctx.filter = 'none'; ctx.restore();
  // B tiny, back turned, in the doorway (pure black silhouette against light)
  ctx.fillStyle = '#020202'; ctx.beginPath(); ctx.ellipse(966, 1258, 30, 36, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(925, 1300); ctx.quadraticCurveTo(966, 1285, 1008, 1300); ctx.lineTo(1018, 1470); ctx.lineTo(1000, 1615); ctx.lineTo(975, 1615); ctx.lineTo(966, 1490); ctx.lineTo(957, 1615); ctx.lineTo(932, 1615); ctx.lineTo(916, 1470); ctx.closePath(); ctx.fill();
  // gilded portrait frame "形象" up-left that A is protecting
  const lampX = 560, lampY = 230; const cone = coneLight(ctx, W, H, lampX, lampY + 40, 70, 40, 1060, 1500, .6);
  ctx.save(); ctx.translate(250, 640); ctx.rotate(-.05); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18;
  const fg = ctx.createLinearGradient(-130, -170, 130, 170); fg.addColorStop(0, '#d9b36a'); fg.addColorStop(.5, '#6e5226'); fg.addColorStop(1, '#2a1d0c'); ctx.fillStyle = fg; ctx.fillRect(-130, -170, 260, 340); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#0d0b09'; ctx.fillRect(-100, -140, 200, 250); ctx.fillStyle = '#2b2219'; ctx.beginPath(); ctx.ellipse(0, -40, 46, 56, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-80, 110); ctx.quadraticCurveTo(0, 10, 80, 110); ctx.fill();
  ctx.strokeStyle = 'rgba(255,230,170,.9)'; ctx.lineWidth = 3; ctx.strokeRect(-130, -170, 260, 340); ctx.font = '900 40px NSerif'; ctx.fillStyle = '#f2d79a'; ctx.textAlign = 'center'; ctx.fillText('形 象', 0, 148); ctx.restore();
  lampShade(ctx, lampX, lampY);
  // plaques colliding: 认错 (behind, being pushed) vs 辩解 (A's shield, in front)
  plaque(ctx, 770, 1000, 400, 290, .17, '认错', { face: ['#4d3f33', '#1a1410'], ink: '#e9dcc4', fs: 140 });
  plaque(ctx, 380, 950, 460, 310, -.14, '辩解', { face: ['#7a5534', '#2b1a0e'], fs: 160 });
  // impact sparks at the collision seam
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const sx = 590, sy = 960;
  const flash = ctx.createRadialGradient(sx, sy, 2, sx, sy, 160); flash.addColorStop(0, 'rgba(255,250,230,.95)'); flash.addColorStop(.3, KEY + '.5)'); flash.addColorStop(1, KEY + '0)'); ctx.fillStyle = flash; ctx.fillRect(sx - 160, sy - 160, 320, 320);
  for (let i = 0; i < 60; i++) { const a = r() * 6.28, l = 30 + r() * 170; ctx.strokeStyle = `rgba(255,${200 + r() * 55 | 0},150,${.4 + r() * .6})`; ctx.lineWidth = .8 + r() * 2.2; ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * 12, sy + Math.sin(a) * 12); ctx.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l + l * l / 900); ctx.stroke(); }
  ctx.restore();
  // Schlenker teal card dropping late from above, motion streak
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 5; i++) { ctx.strokeStyle = `rgba(110,220,230,${.18 - i * .03})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(700 + i * 50, 150 + i * 8); ctx.lineTo(712 + i * 50, 330); ctx.stroke(); } ctx.restore();
  ctx.save(); ctx.translate(806, 430); ctx.rotate(.12); ctx.shadowColor = 'rgba(70,200,210,.6)'; ctx.shadowBlur = 40;
  const tg = ctx.createLinearGradient(-130, -80, 130, 80); tg.addColorStop(0, '#2c8f98'); tg.addColorStop(1, '#0f3e46'); ctx.fillStyle = tg; ctx.fillRect(-130, -80, 260, 160); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(190,250,255,.85)'; ctx.lineWidth = 2.5; ctx.strokeRect(-122, -72, 244, 144);
  ctx.textAlign = 'center'; ctx.fillStyle = '#e8fbff'; ctx.font = '900 56px NSerif'; ctx.fillText('印象管理', 0, 4); ctx.font = '500 26px NSans'; ctx.fillStyle = 'rgba(220,250,255,.8)'; ctx.fillText('据 Schlenker · 简化模型', 0, 52); ctx.restore();
  // A: large rim-lit silhouette lower-left, shoulder shoved into the 辩解 plaque (protecting the portrait, back to the door)
  const SH = [E(262, 1210, 62, 76, -.35), Q([[312, 1222], [338, 1236], [312, 1250]]), // head + nose (looking up-right at the clash)
    E(268, 1146, 118, 24, -.35), Q([[205, 1170], [196, 1090, 250, 1060, 300, 1080], [330, 1110], [322, 1130]]), // fedora brim + crown
    Q([[220, 1260], [240, 1310], [300, 1300], [300, 1250]]), // neck
    Q([[-20, 1920], [-40, 1600, 40, 1340, 170, 1290], [260, 1260, 340, 1300, 380, 1380], [420, 1500, 400, 1700, 380, 1920]]),
    Q([[300, 1330], [360, 1260, 400, 1180, 420, 1100], [440, 1084, 470, 1096, 462, 1120], [440, 1210, 400, 1300, 340, 1380]]), // arm up to plaque
    Q([[140, 1360], [180, 1250, 230, 1140, 280, 1080], [300, 1066, 326, 1080, 318, 1100], [270, 1180, 230, 1280, 200, 1400]])];
  const mA = rimSil(ctx, SH, -11, 9, 'rgba(255,220,160,1)', cloth('#3d3024', '#17130f', '#040303', 420, 1100, 150, 1800), W, H, .85);
  foldLines(ctx, mA, W, H, [[300, 1420, 280, 1700], [190, 1440, 160, 1720], [340, 1340, 410, 1200], [240, 1330, 300, 1400]]);
  ctx.fillStyle = 'rgba(255,240,210,.9)'; ctx.beginPath(); ctx.ellipse(318, 1196, 4, 7, .3, 0, 7); ctx.fill(); // sweat glint
  // wet floor reflection of the plaques (cheap mirrored smear)
  ctx.save(); ctx.globalAlpha = .18; ctx.translate(0, 2 * 1500); ctx.scale(1, -1); ctx.filter = 'blur(10px)'; ctx.drawImage(c, 300, 820, 700, 300, 300, 1380, 700, 300); ctx.restore(); ctx.filter = 'none';
  motes(ctx, cone, r, 240, 80, 1000, lampY + 80, 1400);
  const fl = ctx.createLinearGradient(0, 1560, 0, H); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(1, 'rgba(0,0,0,.8)'); ctx.fillStyle = fl; ctx.fillRect(0, 1560, W, H - 1560);
  vignette(ctx, W, H, .7); grain(ctx, W, H, .07, seed + 1);
}

// ───────────── A6 · reverse / callback: same table, new meaning (slips gone → ash; only 「是我的错」 stays) ─────────────
async function reverse(c, { W, H, seed }) {
  const ctx = c.getContext('2d'); const r = rng(seed + 23); const lamp = [540, 420];
  wallBase(ctx, W, H, '#0e1217', '#161c22', '#08090b');
  // blinds now warmer (dawn) — same wall, changed light
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(560, 120); ctx.transform(1, .32, -.18, 1, 0, 0);
  for (let i = 0; i < 9; i++) { const g = ctx.createLinearGradient(0, 0, 520, 0); g.addColorStop(0, 'rgba(230,170,120,0)'); g.addColorStop(.35, 'rgba(230,170,120,.18)'); g.addColorStop(1, 'rgba(230,170,120,0)'); ctx.fillStyle = g; ctx.filter = 'blur(3px)'; ctx.fillRect(0, i * 46, 560, 24); }
  ctx.restore(); ctx.filter = 'none';
  ctx.fillStyle = '#05070a'; ctx.fillRect(110, 360, 190, 240); ctx.strokeStyle = 'rgba(255,214,150,.18)'; ctx.lineWidth = 3; ctx.strokeRect(110, 360, 190, 240);
  const cone = coneLight(ctx, W, H, lamp[0], lamp[1] + 40, 70, 60, 1020, 1290, .62);
  lampShade(ctx, lamp[0], lamp[1]);
  // B: same seat, arms uncrossed, hands open on the table, head tilted toward A
  const SB = [E(790, 712, 64, 78, -.18), Q([[732, 712], [714, 736], [736, 744]]),
    Q([[735, 650], [760, 596, 860, 590, 866, 652], [870, 700], [846, 690, 800, 664, 756, 676]]), Q([[758, 750], [766, 845], [852, 845], [850, 740]]),
    Q([[690, 1200], [672, 950, 700, 850, 800, 822], [920, 820, 975, 870, 985, 960], [995, 1200]]),
    Q([[700, 900], [660, 1000, 640, 1100, 660, 1150], [700, 1150], [720, 1080, 740, 990, 750, 930]]), // left forearm down to table
    E(672, 1146, 34, 14, .1)];
  const mB = rimSil(ctx, SB, 9, 7, 'rgba(255,214,150,1)', cloth('#3b3126', '#16141a', '#050507', 700, 650, 1000, 1150), W, H);
  foldLines(ctx, mB, W, H, [[720, 900, 740, 960], [880, 860, 920, 940], [700, 1070, 720, 1170], [820, 1040, 860, 1120]], .28);
  ctx.fillStyle = 'rgba(255,235,200,.6)'; ctx.beginPath(); ctx.ellipse(748, 706, 5, 2.2, .1, 0, 7); ctx.fill(); // softer gaze
  // table (same as hook)
  const tt = ctx.createLinearGradient(0, 1150, 0, 1215); tt.addColorStop(0, '#5a4330'); tt.addColorStop(1, '#2a1d14');
  const top = () => { ctx.beginPath(); ctx.moveTo(150, 1215); ctx.lineTo(240, 1150); ctx.lineTo(1000, 1150); ctx.lineTo(1080, 1215); ctx.closePath(); };
  ctx.fillStyle = tt; top(); ctx.fill();
  const pool = ctx.createRadialGradient(560, 1185, 10, 560, 1185, 460); pool.addColorStop(0, KEY + '.85)'); pool.addColorStop(1, KEY + '0)');
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = pool; top(); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#0b0806'; ctx.fillRect(150, 1215, 930, 60); ctx.fillStyle = 'rgba(255,214,150,.35)'; ctx.fillRect(150, 1215, 930, 2);
  const cl = ctx.createLinearGradient(0, 1275, 0, 1500); cl.addColorStop(0, '#15100d'); cl.addColorStop(1, '#030303'); ctx.fillStyle = cl;
  ctx.beginPath(); ctx.moveTo(150, 1275); for (let x = 150; x <= 1080; x += 62) ctx.quadraticCurveTo(x + 31, 1290 + (x % 124 ? 30 : 10), x + 62, 1275); ctx.lineTo(1080, 1520); ctx.lineTo(150, 1520); ctx.fill();
  // shards swept into one small neat stack by the plate (repaired-ish), A's hand put them there
  ctx.save(); ctx.translate(930, 1176); for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#d9d1c2' : '#f6efe2'; ctx.beginPath(); ctx.ellipse(0, -i * 5, 54 - i * 4, 11, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.2; ctx.stroke(); }
  ctx.strokeStyle = 'rgba(60,40,20,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-30, -16); ctx.lineTo(-8, -12); ctx.lineTo(10, -20); ctx.stroke(); ctx.restore();
  // the one plaque left: 「是我的错」 gold, standing in the light pool
  ctx.save(); ctx.translate(675, 1088); ctx.shadowColor = 'rgba(255,200,110,.75)'; ctx.shadowBlur = 60;
  const gg = ctx.createLinearGradient(-150, -60, 150, 60); gg.addColorStop(0, '#f7dc8e'); gg.addColorStop(.5, '#c99a3c'); gg.addColorStop(1, '#7a5718'); ctx.fillStyle = gg; ctx.fillRect(-160, -62, 320, 124); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#3a2708'; ctx.fillRect(-40, 62, 80, 10); ctx.strokeStyle = 'rgba(255,248,220,.95)'; ctx.lineWidth = 3; ctx.strokeRect(-150, -52, 300, 104);
  ctx.font = '900 70px NSerif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#3a2508'; ctx.fillText('是我的错', 0, 4); ctx.restore();
  // ash curls of burnt excuse slips drifting down to the floor (prop changed state: slip → ash)
  for (let i = 0; i < 26; i++) { const x = 120 + r() * 520, y = 1350 + r() * 480, s = 6 + r() * 16; ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 6); ctx.fillStyle = `rgba(${40 + r() * 30 | 0},${34 + r() * 20 | 0},30,.85)`; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * .7, s, 0); ctx.quadraticCurveTo(0, s * .4, -s, 0); ctx.fill();
    ctx.strokeStyle = `rgba(255,${120 + r() * 60 | 0},60,${r() * .7})`; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); }
  // A: upright now, facing B, hands lowered (no pressed palms, no sweat)
  const SA = [E(392, 905, 60, 74, .12), Q([[446, 920], [470, 936], [446, 946]]),
    Q([[340, 850], [380, 820, 440, 830, 452, 880], [430, 870], [380, 862, 350, 880, 336, 900]]), Q([[360, 966], [372, 1010], [430, 1010], [425, 966]]),
    Q([[200, 1720], [180, 1400, 200, 1120, 290, 1010], [340, 990, 430, 990, 470, 1030], [520, 1150, 480, 1400, 450, 1720]]),
    Q([[455, 1050], [500, 1090, 530, 1130, 545, 1150], [556, 1168, 540, 1178, 528, 1172], [500, 1150, 470, 1130, 440, 1115]]), // hand set down beside plaque
    Q([[220, 1700], [235, 1920], [310, 1920], [305, 1710]]), Q([[330, 1700], [360, 1920], [425, 1920], [430, 1710]])];
  const mA = rimSil(ctx, SA, -10, 8, 'rgba(255,220,160,1)', cloth('#3a2e24', '#17130f', '#040303', 470, 900, 200, 1600), W, H, .8);
  foldLines(ctx, mA, W, H, [[300, 1070, 280, 1300], [400, 1080, 420, 1300], [290, 1320, 300, 1560], [380, 1400, 400, 1680]], .25);
  motes(ctx, cone, r, 200, 80, 1000, lamp[1] + 60, 1260);
  const fl = ctx.createLinearGradient(0, 1500, 0, H); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(1, 'rgba(0,0,0,.85)'); ctx.fillStyle = fl; ctx.fillRect(0, 1500, W, H - 1500);
  vignette(ctx, W, H, .7); grain(ctx, W, H, .07, seed + 2);
}

export async function render(c, o) { const b = o.beat || 'hook'; return ({ hook, mid, reverse }[b] || hook)(c, o); }
