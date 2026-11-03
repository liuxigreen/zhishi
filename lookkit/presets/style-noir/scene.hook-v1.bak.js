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

export async function render(c, { W, H, seed }) {
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
