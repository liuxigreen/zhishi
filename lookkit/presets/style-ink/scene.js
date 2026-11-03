// style-ink v2 (lane B · apology REF-LOCK v3): 水墨笔触 + legible figures (solid ink robes, continuous bristle contour, paper-white faces). beats: hook|mid|reverse
// orig: — procedural bristle brush strokes, ink wash with edge pooling, rice paper, red seal accent
import { rng, mkCanvas, paperTexture, noise2, fbm, grain, SLIPS } from '../../core/util.js';
export const meta = { name: 'ink', zh: '水墨笔触', accent: '#b8261d' };

function spline(pts, step = 2) { // catmull-rom resample
  const out = []; const P = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 1; i < P.length - 2; i++) { const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]; const L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]); const n = Math.max(2, L / step | 0);
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } }
  out.push(pts[pts.length - 1]); return out; }
// bristle brush: width profile press->lift, per-bristle ink runs out => dry-brush gaps (飞白)
function brush(ctx, pts, { w = 20, ink = 1, dry = .5, color = '20,18,16', seed = 1, taper = [.25, .35], bristles = 28 } = {}) {
  const r = rng(seed); const S = spline(pts, 1.5); const N = S.length; const br = [];
  for (let b = 0; b < bristles * 2; b++) br.push({ o: (r() - .5) * 2, load: .55 + r() * .5, rad: .6 + r() * 1.2, ph: r() * 100 });
  for (let i = 1; i < N; i++) { const t = i / N; const [x, y] = S[i], [px, py] = S[i - 1]; const a = Math.atan2(y - py, x - px), nx = -Math.sin(a), ny = Math.cos(a);
    const prof = Math.min(1, t / taper[0]) * Math.min(1, (1 - t) / taper[1] + .15); const ww = w * (.35 + .65 * Math.sqrt(Math.max(0, prof)));
    for (const b of br) { const remain = b.load - t * dry * (1.2 + noise2(b.ph, t * 6)); if (remain <= 0) continue; const gap = noise2(b.ph * 1.7 + t * 22, b.o * 5) < dry * (.12 + t * .7); if (gap) continue;
      const al = Math.min(1, remain * 1.4) * ink * (.35 + .65 * noise2(b.ph + t * 9, 3.3)); ctx.fillStyle = `rgba(${color},${al})`; ctx.beginPath(); ctx.arc(x + nx * b.o * ww * .5, y + ny * b.o * ww * .5, Math.max(.7, b.rad * ww / bristles * 1.1), 0, 7); ctx.fill(); } } }
// ink wash blob with darker pooled edge (墨晕)
function wash(ctx, path, { tone = .25, blur = 8, edge = .18, color = '30,28,26' } = {}) {
  const W = ctx.canvas.width, H = ctx.canvas.height; const c = mkCanvas(W, H), x = c.getContext('2d');
  x.filter = `blur(${blur}px)`; x.fillStyle = `rgba(${color},${tone})`; path(x); x.fill();
  x.filter = `blur(${blur * .4}px)`; x.strokeStyle = `rgba(${color},${edge})`; x.lineWidth = 5; path(x); x.stroke(); x.filter = 'none';
  // noise mottling
  x.globalCompositeOperation = 'destination-out'; const m = mkCanvas(W / 8, H / 8), mx = m.getContext('2d'), id = mx.createImageData(W / 8, H / 8);
  for (let j = 0; j < H / 8; j++) for (let i = 0; i < W / 8; i++) { const k = (j * W / 8 + i) * 4; id.data[k + 3] = Math.max(0, fbm(i / 9, j / 9, 3) - .45) * 400; } mx.putImageData(id, 0, 0);
  x.drawImage(m, 0, 0, W, H); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(c, 0, 0); ctx.restore(); }
const pth = pts => x => { const S = spline(pts, 4); x.beginPath(); S.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); };
const ell = (cx, cy, rx, ry, rot = 0) => x => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); };
const circ = (cx, cy, rx, ry, a0 = -.3, a1 = 5.9, n = 24) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; };

const PAPER = '239,229,207';
function paperBase(ctx, W, H, seed) {
  ctx.fillStyle = '#efe5cf'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .45; ctx.fillStyle = ctx.createPattern(paperTexture(512, 2200, seed + 4), 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
const closed = p => [...p, p[0], p[1]];
// legible ink figure: dark robe wash + one continuous bristle contour + paper 飞白 folds + white face w/ contour + solid hair
// fast bristle sweep: each bristle = one broken polyline (飞白 gaps), ~100× cheaper than dot-stamping; for big robe masses
function sweepBrush(ctx, pts, { w = 80, ink = .9, dry = .45, color = '20,18,16', seed = 1, bristles = 40 } = {}) {
  const r = rng(seed); const S = spline(pts, 6); const N = S.length; ctx.save(); ctx.lineCap = 'round';
  for (let b = 0; b < bristles; b++) { const o = (r() - .5), load = .6 + r() * .5, ph = r() * 100; ctx.lineWidth = w / bristles * (1.6 + r() * 1.4); ctx.strokeStyle = `rgba(${color},${Math.min(1, ink * (.55 + r() * .5))})`;
    ctx.beginPath(); let down = false;
    for (let i = 1; i < N; i++) { const t = i / N, [x, y] = S[i], [px, py] = S[i - 1]; const a = Math.atan2(y - py, x - px), nx = -Math.sin(a), ny = Math.cos(a);
      const gap = (load - t * dry * 1.3) <= 0 || noise2(ph + t * 18, o * 7) < dry * (.15 + t * .6); const X = x + nx * o * w, Y = y + ny * o * w;
      if (gap) { down = false; continue; } if (!down) { ctx.moveTo(X, Y); down = true; } else ctx.lineTo(X, Y); }
    ctx.stroke(); } ctx.restore(); }
// straight-edged polyline sampler (catmull-rom would bulge rectangles)
function rectPts(x, y, w, h, n = 12) { const P = [], C = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  for (let i = 0; i < 4; i++) for (let k = 0; k < n; k++) { const t = k / n; P.push([C[i][0] + (C[i + 1][0] - C[i][0]) * t, C[i][1] + (C[i + 1][1] - C[i][1]) * t]); } P.push([x + 18, y]); return P; }
function densify(p, step = 40) { const o = []; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; const n = Math.max(1, Math.hypot(b[0] - a[0], b[1] - a[1]) / step | 0); for (let k = 0; k < n; k++) o.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return o; }
// legible ink figure (大写意): robe painted in broad dry-brush sweeps clipped to silhouette, calligraphic broken contour, paper-white face, solid hair
function figure(ctx, { body, robe = .85, limbs = [], head, hair = [], feats = [], folds = [], seed = 1, cw = 13, sweep = 78 }) {
  const r = rng(seed); const xs = body.map(p => p[0]), ys = body.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  ctx.save(); const cp = new Path2D(); const S = spline(body, 4); S.forEach(([a, b], i) => i ? cp.lineTo(a, b) : cp.moveTo(a, b)); cp.closePath(); ctx.clip(cp);
  ctx.fillStyle = 'rgba(40,36,32,.18)'; ctx.fill(cp); // light under-wash so 飞白 gaps still read as robe
  for (let x = x0 - sweep * .3, i = 0; x < x1 + sweep * .3; x += sweep * .62, i++) { const bend = (r() - .5) * 60;
    sweepBrush(ctx, [[x + bend * .3, y0 - 20], [x + bend, (y0 + y1) / 2], [x + bend * .4, y1 + 30]], { w: sweep, ink: robe * (.8 + r() * .25), dry: .42 + r() * .2, seed: seed + 400 + i, bristles: 44 }); }
  ctx.restore();
  // calligraphic contour: 3 tapered strokes, thick on the back side, broken joins
  const D = densify(body, 30), n = D.length, cuts = [0, n * .38 | 0, n * .7 | 0, n];
  for (let k = 0; k < 3; k++) { const seg = D.slice(cuts[k], Math.min(n, cuts[k + 1] + 2)); if (seg.length < 2) continue; brush(ctx, seg, { w: cw * [1.35, .8, 1.1][k], dry: .3, seed: seed + k, bristles: 22, taper: [.12, .25] }); }
  folds.forEach((f, i) => brush(ctx, f, { w: 7, dry: .7, seed: seed + 40 + i, color: PAPER, ink: .7, bristles: 12 }));
  limbs.forEach((l, i) => { brush(ctx, l.pts, { w: l.w + 7, dry: .15, seed: seed + 60 + i, color: PAPER, ink: .85, bristles: 18, taper: [.1, .15] });
    brush(ctx, l.pts, { w: l.w, dry: l.dry ?? .35, seed: seed + 70 + i, bristles: 26, ink: 1, taper: [.1, .2] }); });
  if (head) { const [cx, cy, rx, ry, rot = 0] = head;
    ctx.save(); ctx.fillStyle = `rgb(${PAPER})`; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot, 0, 7); ctx.fill(); ctx.restore();
    wash(ctx, ell(cx + rx * .25, cy + ry * .2, rx * .7, ry * .7, rot), { tone: .07, blur: 10, edge: 0 });
    const P = []; for (let i = 0; i <= 26; i++) { const a = .3 + i / 26 * 5.9; P.push([cx + Math.cos(a) * rx * Math.cos(rot) - Math.sin(a) * ry * Math.sin(rot), cy + Math.cos(a) * rx * Math.sin(rot) + Math.sin(a) * ry * Math.cos(rot)]); }
    brush(ctx, P, { w: 9, dry: .3, seed: seed + 5, bristles: 16, taper: [.2, .3] }); }
  hair.forEach((h, i) => { wash(ctx, pth(h), { tone: .95, blur: 2, edge: .6 }); brush(ctx, closed(h), { w: 7, dry: .3, seed: seed + 90 + i, bristles: 12 }); });
  feats.forEach((f, i) => brush(ctx, f.pts, { w: f.w || 6, dry: .1, seed: seed + 100 + i, bristles: 10, color: f.color || '20,18,16' })); }
function inkSlip(ctx, x, y, a, t, s = 1, burnt = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s); ctx.shadowColor = 'rgba(60,40,20,.25)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#f7efdc'; ctx.fillRect(-46, -110, 92, 220); ctx.shadowColor = 'transparent'; ctx.strokeStyle = 'rgba(184,38,29,.55)'; ctx.lineWidth = 2; ctx.strokeRect(-40, -104, 80, 208);
  const n = t.length, fs = Math.min(44, 190 / n); ctx.fillStyle = 'rgba(18,16,14,.92)'; ctx.font = `${fs}px Brush`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [...t].forEach((ch, i) => ctx.fillText(ch, 0, -((n - 1) * fs) / 2 + i * fs)); ctx.restore(); }
function seal(ctx, r, x, y, ch = '歉', s = 1) { const sc = mkCanvas(160, 160), sx = sc.getContext('2d'); sx.fillStyle = '#b8261d'; sx.fillRect(18, 18, 124, 124); sx.globalCompositeOperation = 'destination-out';
  sx.font = '92px XiaoWei'; sx.textAlign = 'center'; sx.textBaseline = 'middle'; sx.fillText(ch, 80, 86); sx.lineWidth = 5; sx.strokeRect(28, 28, 104, 104);
  for (let i = 0; i < 300; i++) { sx.fillStyle = `rgba(0,0,0,${r() * .8})`; sx.fillRect(18 + r() * 124, 18 + r() * 124, r() * 5, r() * 5); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.04); ctx.scale(s, s); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(sc, -80, -80); ctx.restore(); }
function lantern(ctx, x, y, glow = .35, seed = 3) {
  brush(ctx, [[x, 0], [x, y - 90]], { w: 4, dry: .2, seed, bristles: 6 });
  wash(ctx, ell(x, y, 95, 105), { tone: .78, blur: 5, edge: .4, color: '184,38,29' });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const lg = ctx.createRadialGradient(x, y + 10, 10, x, y + 10, 460); lg.addColorStop(0, `rgba(255,200,120,${glow})`); lg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  brush(ctx, circ(x, y, 95, 105, -1.2, 1.3, 14), { w: 6, dry: .4, seed: seed + 1, color: '120,20,15', bristles: 10 });
  brush(ctx, [[x - 40, y - 100], [x + 40, y - 100]], { w: 14, seed: seed + 2, dry: .3 }); brush(ctx, [[x - 40, y + 102], [x + 40, y + 102]], { w: 14, seed: seed + 3, dry: .3 });
  brush(ctx, [[x, y + 110], [x - 4, y + 170], [x, y + 210]], { w: 5, seed: seed + 4, dry: .6, color: '184,38,29', bristles: 10 }); }
function mountains(ctx) {
  wash(ctx, ell(800, 330, 140, 140), { tone: .06, edge: .2, blur: 6 });
  wash(ctx, pth([[0, 560], [140, 410], [260, 480], [420, 320], [560, 450], [700, 360], [860, 490], [1080, 390], [1080, 660], [0, 660]]), { tone: .1, blur: 18, edge: .05 });
  wash(ctx, pth([[0, 660], [200, 520], [380, 600], [600, 500], [820, 620], [1080, 530], [1080, 740], [0, 740]]), { tone: .16, blur: 14, edge: .08 }); }
function table(ctx, seed) {
  wash(ctx, pth([[140, 1195], [1060, 1195], [1040, 1250], [160, 1250]]), { tone: .25, blur: 12, edge: .05 });
  brush(ctx, [[110, 1165], [400, 1160], [700, 1158], [1040, 1162]], { w: 34, seed, dry: .6, taper: [.05, .1], bristles: 40 });
  brush(ctx, [[200, 1185], [196, 1450]], { w: 22, seed: seed + 1, dry: .7 }); brush(ctx, [[960, 1185], [966, 1450]], { w: 22, seed: seed + 2, dry: .7 }); }
// figures
const B_SEATED = { body: [[690, 1150], [692, 930], [742, 852], [808, 818], [900, 830], [968, 880], [998, 990], [1004, 1150]], robe: .78,
  head: [808, 715, 60, 74], hair: [[[748, 690], [758, 630], [812, 606], [870, 628], [882, 700], [862, 676], [820, 660], [774, 670]], [[860, 600], [892, 588], [918, 612], [904, 646], [872, 640]]],
  feats: [{ pts: [[752, 690], [770, 682], [790, 690]], w: 7 }, { pts: [[764, 708], [780, 706]], w: 7 }, { pts: [[748, 714], [738, 742], [752, 746]], w: 5 }, { pts: [[756, 770], [776, 766]], w: 5 }],
  folds: [[[770, 900], [740, 1000], [732, 1120]], [[930, 900], [960, 1000], [968, 1120]]], seed: 300 };
const A_BOW = { body: [[205, 1060], [300, 1030], [350, 1062], [380, 1200], [372, 1450], [356, 1720], [352, 1960], [100, 1960], [126, 1650], [114, 1400], [140, 1160]], robe: .88,
  head: [382, 976, 58, 72, .55], hair: [[[318, 950], [332, 892], [400, 880], [440, 926], [404, 934], [366, 946], [342, 1000]]],
  feats: [{ pts: [[404, 990], [424, 1002]], w: 6 }, { pts: [[432, 1020], [454, 1040], [428, 1048]], w: 5 }],
  limbs: [{ pts: [[300, 1150], [380, 1172], [430, 1090], [462, 1005]], w: 34 }, { pts: [[460, 1030], [474, 960], [488, 918]], w: 22, dry: .1 }],
  folds: [[[250, 1120], [190, 1350], [180, 1650]], [[320, 1250], [318, 1500], [310, 1800]]], seed: 200 };

async function hook(c, o) { const { W, H, seed } = o; const on = ON(o);
  const ctx = c.getContext('2d'); const r = rng(seed); if (on('back')) { paperBase(ctx, W, H, seed); mountains(ctx); lantern(ctx, 560, 390); }
  if (on('B')) { figure(ctx, B_SEATED);
  // B's crossed arms: near-black sleeves with paper halo
  brush(ctx, [[670, 990], [760, 960], [860, 958], [935, 985]], { w: 60, seed: 317, dry: .1, color: PAPER, bristles: 18, taper: [.1, .15] });
  brush(ctx, [[670, 990], [760, 960], [860, 958], [935, 985]], { w: 48, seed: 17, dry: .3, taper: [.15, .2] });
  brush(ctx, [[700, 1040], [790, 1020], [880, 1025], [925, 1040]], { w: 42, seed: 18, dry: .35, ink: .95, taper: [.15, .2] }); }
  if (on('front')) { table(ctx, 21);
  [[[640, 1128], [700, 1118], [692, 1140]], [[710, 1116], [770, 1124], [748, 1144]], [[780, 1130], [815, 1138], [790, 1146]], [[600, 1144], [632, 1138], [618, 1150]]].forEach((s, i) => {
    ctx.fillStyle = '#fbf8f0'; ctx.beginPath(); s.forEach(([a, b], j) => j ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fill();
    brush(ctx, [...s, s[0]], { w: 3.5, seed: 30 + i, dry: .1, bristles: 5 }); brush(ctx, [s[0], s[1]], { w: 4, seed: 40 + i, color: '40,70,140', dry: .1, bristles: 6 }); });
  [[430, 1120, 1.45], [470, 1108, 1.7], [450, 1095, 1.35], [490, 1082, 1.6]].forEach(([x, y, a], i) => inkSlip(ctx, x, y, a, SLIPS[i], .78)); }
  if (on('fly')) { inkSlip(ctx, 600, 880, -.35, SLIPS[4], .95); inkSlip(ctx, 700, 560, .3, SLIPS[5], 1); inkSlip(ctx, 600, 660, -.2, SLIPS[6], .9); inkSlip(ctx, 300, 560, .25, '我也很难', .9);
  // motion: dry-brush speed streaks behind the flying slips (they are being fired at B)
  [[[380, 980], [520, 860]], [[420, 860], [560, 700]], [[250, 700], [300, 600]]].forEach((p, i) => brush(ctx, p, { w: 10, dry: .9, seed: 700 + i, ink: .5, bristles: 12 })); }
  if (on('A')) { figure(ctx, A_BOW);
  ctx.fillStyle = 'rgba(70,110,160,.7)'; ctx.beginPath(); ctx.ellipse(440, 952, 6, 10, .3, 0, 7); ctx.fill(); }
  if (on('front')) { for (let i = 0; i < 40; i++) { const x = 560 + (r() - .5) * 500, y = 1130 + (r() - .5) * 140, s = r() * r() * 7; ctx.fillStyle = `rgba(20,18,16,${.3 + r() * .6})`; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); } }
  if (on('seal')) seal(ctx, r, 900, 1700); if (on('fx')) grain(ctx, W, H, .025, seed);
}

// A3 · mechanism — new place: moon-gate courtyard; 辩解 board vs 认错 board clash; indigo Schlenker card falls; B leaves through the moon gate
function board(ctx, cx, cy, w, h, rot, txt, seed, tone = .3) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.shadowColor = 'rgba(40,30,20,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 14; ctx.fillStyle = `rgb(${232 - tone * 120 | 0},${214 - tone * 120 | 0},${180 - tone * 110 | 0})`; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  for (let i = 0; i < 5; i++) brush(ctx, [[-w / 2 + 6, -h / 2 + 24 + i * h / 5], [0, -h / 2 + 30 + i * h / 5], [w / 2 - 6, -h / 2 + 26 + i * h / 5]], { w: 22, dry: .9, seed: seed + i, ink: .3, color: '70,45,25', bristles: 18 });
  brush(ctx, rectPts(-w / 2, -h / 2, w, h), { w: 13, dry: .35, seed: seed + 9, bristles: 18, taper: [.02, .05] });
  ctx.font = `${h * .58}px Brush`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(14,12,10,.95)'; ctx.fillText(txt, 0, 6);
  ctx.restore(); }
async function mid(c, o) { const { W, H, seed } = o; const on = ON(o);
  const ctx = c.getContext('2d'); const r = rng(seed + 11); if (on('back')) paperBase(ctx, W, H, seed + 1);
  // courtyard wall with a moon gate on the right
  if (on('back')) { wash(ctx, pth([[0, 760], [1080, 740], [1080, 1560], [0, 1580]]), { tone: .12, blur: 10, edge: .05 });
  brush(ctx, [[0, 760], [540, 752], [1080, 742]], { w: 26, dry: .55, seed: 501, bristles: 30, taper: [.02, .05] });
  for (let i = 0; i < 9; i++) brush(ctx, [[i * 128 + 10, 735], [i * 128 + 120, 728]], { w: 18, dry: .7, seed: 520 + i, ink: .7, bristles: 14 }); // roof tiles
  ctx.save(); ctx.fillStyle = 'rgba(248,240,222,1)'; ctx.beginPath(); ctx.ellipse(880, 1270, 170, 210, 0, 0, 7); ctx.fill(); ctx.restore();
  brush(ctx, circ(880, 1270, 172, 212, -1.6, 4.7, 40), { w: 18, dry: .4, seed: 530, bristles: 22 });
  wash(ctx, pth([[760, 1300], [820, 1240], [900, 1270], [990, 1220], [1020, 1300], [1020, 1440], [740, 1440]]), { tone: .1, blur: 14, edge: .03 }); // garden mist beyond gate
  // B small, back turned, walking out through the gate
  figure(ctx, { body: [[870, 1330], [912, 1318], [928, 1400], [922, 1470], [905, 1470], [900, 1420], [884, 1420], [878, 1470], [860, 1470], [856, 1400]], robe: .95, cw: 5, sweep: 30,
    head: null, hair: [[[868, 1290], [878, 1268], [906, 1268], [914, 1296], [902, 1318], [878, 1318]]], seed: 540 });
  // hanging scroll 「形象」 with A's ink portrait, upper left
  brush(ctx, [[110, 230], [370, 230]], { w: 20, dry: .2, seed: 550 }); brush(ctx, [[240, 120], [180, 230]], { w: 3, seed: 551, bristles: 4 }); brush(ctx, [[240, 120], [300, 230]], { w: 3, seed: 552, bristles: 4 });
  ctx.fillStyle = '#f6eedb'; ctx.fillRect(130, 240, 220, 400); ctx.strokeStyle = 'rgba(120,90,50,.6)'; ctx.lineWidth = 3; ctx.strokeRect(140, 250, 200, 380);
  wash(ctx, ell(240, 380, 46, 56), { tone: .08, blur: 3, edge: .5 }); brush(ctx, circ(240, 380, 46, 56, 0, 6.4, 24), { w: 8, dry: .2, seed: 553, bristles: 12 });
  wash(ctx, pth([[200, 345], [218, 318], [262, 318], [282, 350], [262, 336], [222, 336]]), { tone: .9, blur: 2, edge: .5 });
  brush(ctx, [[222, 384], [234, 384]], { w: 4, seed: 554, bristles: 6 }); brush(ctx, [[248, 384], [260, 384]], { w: 4, seed: 555, bristles: 6 }); brush(ctx, [[226, 410], [240, 416], [254, 410]], { w: 4, seed: 556, bristles: 6 }); // smug smile
  wash(ctx, pth([[170, 520], [200, 450], [280, 450], [310, 520]]), { tone: .55, blur: 3, edge: .4 });
  ctx.font = '62px Brush'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(18,16,14,.92)'; ctx.fillText('形象', 240, 600);
  brush(ctx, [[110, 650], [370, 650]], { w: 22, dry: .2, seed: 557 }); }
  // indigo card falling late (Schlenker), dry streaks above
  if (on('card')) { [[700, 140, 712, 300], [760, 120, 770, 290], [820, 150, 828, 300]].forEach(([a, b, e, f], i) => brush(ctx, [[a, b], [e, f]], { w: 8, dry: .85, seed: 560 + i, ink: .5, color: '40,70,140', bristles: 10 }));
  ctx.save(); ctx.translate(790, 420); ctx.rotate(.12); ctx.fillStyle = '#f2ead6'; ctx.fillRect(-150, -90, 300, 180); ctx.restore();
  ctx.save(); ctx.translate(790, 420); ctx.rotate(.12); ctx.fillStyle = 'rgb(48,72,132)'; ctx.fillRect(-150, -90, 300, 180); for (let i = 0; i < 4; i++) brush(ctx, [[-146, -70 + i * 46], [146, -64 + i * 46]], { w: 30, dry: .85, seed: 570 + i, ink: .35, color: '20,34,80', bristles: 16 }); brush(ctx, rectPts(-150, -90, 300, 180), { w: 7, dry: .3, seed: 575, bristles: 10, color: '18,28,70' }); ctx.restore();
  ctx.save(); ctx.translate(790, 420); ctx.rotate(.12); ctx.textAlign = 'center'; ctx.fillStyle = '#f6efe0'; ctx.font = '64px Brush'; ctx.fillText('印象管理', 0, 8); ctx.font = '26px NSerif'; ctx.fillText('据 Schlenker · 简化模型', 0, 60); ctx.restore(); }
  // the clash
  if (on('plaqR')) { board(ctx, 800, 1030, 400, 270, .12, '认错', 600, .18); }
  if (on('plaqL')) { board(ctx, 350, 945, 440, 290, -.14, '辩解', 610, .38); }
  // ink burst at the seam (泼墨 splatter = impact)
  if (on('spark')) { const sx = 585, sy = 965; wash(ctx, ell(sx, sy, 60, 40, .6), { tone: .85, blur: 2, edge: .6 });
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = 40 + r() * r() * 260, s = 1 + r() * r() * 14; ctx.fillStyle = `rgba(16,14,12,${.5 + r() * .5})`; ctx.beginPath(); ctx.ellipse(sx + Math.cos(a) * d, sy + Math.sin(a) * d * .8, s, s * (.5 + r()), a, 0, 7); ctx.fill(); }
  for (let i = 0; i < 9; i++) { const a = r() * 6.28; brush(ctx, [[sx, sy], [sx + Math.cos(a) * 160, sy + Math.sin(a) * 120]], { w: 10, dry: .7, seed: 620 + i, bristles: 10, taper: [.02, .8] }); } }
  // A: big figure lower-left, shoulder driven into the 辩解 board (back to the moon gate)
  if (on('A')) { figure(ctx, { body: [[150, 1300], [250, 1268], [330, 1300], [384, 1400], [400, 1600], [392, 1960], [-20, 1960], [-10, 1620], [40, 1420]], robe: .9, cw: 15,
    head: [262, 1200, 60, 74, -.35], hair: [[[200, 1180], [210, 1120], [262, 1110], [320, 1140], [324, 1160], [290, 1150], [240, 1160], [220, 1210]]],
    feats: [{ pts: [[290, 1196], [306, 1188]], w: 6 }, { pts: [[312, 1214], [332, 1232], [312, 1240]], w: 5 }, { pts: [[288, 1170], [312, 1160]], w: 7 }],
    limbs: [{ pts: [[320, 1340], [380, 1250], [420, 1160], [446, 1100]], w: 40 }, { pts: [[180, 1360], [220, 1240], [262, 1150], [290, 1090]], w: 34 }],
    folds: [[[220, 1360], [180, 1600], [170, 1880]], [[320, 1420], [330, 1660], [320, 1880]]], seed: 640 });
  ctx.fillStyle = 'rgba(70,110,160,.7)'; ctx.beginPath(); ctx.ellipse(330, 1180, 6, 10, .3, 0, 7); ctx.fill(); }
  if (on('seal')) seal(ctx, r, 960, 1760, '辩'); if (on('fx')) grain(ctx, W, H, .025, seed + 1);
}

// A6 · reverse — same table, new meaning: slips gone (ink ash flecks), shards stacked, only 「是我的错」 cinnabar plaque; A upright, B arms open
async function reverse(c, o) { const { W, H, seed } = o; const on = ON(o);
  const ctx = c.getContext('2d'); const r = rng(seed + 23); if (on('back')) { paperBase(ctx, W, H, seed + 2); mountains(ctx); lantern(ctx, 560, 390, .5, 33); }
  if (on('B')) { figure(ctx, { ...B_SEATED, head: [800, 712, 60, 74, -.15], feats: [{ pts: [[748, 694], [768, 690], [788, 696]], w: 6 }, { pts: [[760, 712], [776, 714]], w: 6 }, { pts: [[744, 718], [734, 744], [748, 748]], w: 5 }, { pts: [[752, 770], [764, 776], [776, 770]], w: 5 }] });
  // B: forearms resting open on the table
  brush(ctx, [[720, 920], [690, 1040], [660, 1140]], { w: 52, seed: 811, dry: .1, color: PAPER, bristles: 16 }); brush(ctx, [[720, 920], [690, 1040], [660, 1140]], { w: 40, seed: 812, dry: .3 });
  brush(ctx, [[950, 920], [960, 1040], [930, 1140]], { w: 40, seed: 813, dry: .35 }); }
  if (on('front')) { table(ctx, 821);
  // stacked shards
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#fbf8f0'; ctx.beginPath(); ctx.ellipse(950, 1138 - i * 6, 46 - i * 5, 11, 0, 0, 7); ctx.fill(); brush(ctx, circ(950, 1138 - i * 6, 46 - i * 5, 11, 0, 6.3, 20), { w: 3, dry: .1, seed: 830 + i, bristles: 5, color: i ? '20,18,16' : '40,70,140' }); } }
  // cinnabar plaque 「是我的错」 — the one thing left in the light
  if (on('plaque')) { ctx.save(); ctx.shadowColor = 'rgba(184,38,29,.45)'; ctx.shadowBlur = 50; ctx.fillStyle = 'rgb(176,40,30)'; ctx.fillRect(560, 1000, 300, 128); ctx.restore();
  for (let i = 0; i < 3; i++) brush(ctx, [[564, 1020 + i * 42], [856, 1026 + i * 42]], { w: 34, dry: .85, seed: 845 + i, ink: .35, color: '120,18,12', bristles: 16 });
  brush(ctx, rectPts(560, 1000, 300, 128), { w: 8, dry: .3, seed: 840, bristles: 12, color: '100,16,10' });
  ctx.font = '86px Brush'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fbf3e3'; ctx.fillText('是我的错', 710, 1068); }
  // ash flecks where the excuse slips burnt away
  if (on('ash')) { for (let i = 0; i < 60; i++) { const x = 120 + r() * 600, y = 1260 + r() * 600, s = 2 + r() * 9; ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 6); ctx.fillStyle = `rgba(20,18,16,${.25 + r() * .5})`; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * .8, s, 0); ctx.quadraticCurveTo(0, s * .4, -s, 0); ctx.fill(); ctx.restore(); } }
  // A upright, facing B, hand set down beside the plaque
  if (on('A')) { figure(ctx, { body: [[260, 1010], [350, 990], [430, 1020], [470, 1160], [458, 1450], [448, 1720], [444, 1960], [186, 1960], [204, 1650], [196, 1400], [214, 1120]], robe: .88,
    head: [380, 900, 58, 72, .12], hair: [[[320, 880], [330, 830], [392, 816], [444, 846], [446, 872], [410, 858], [362, 864], [334, 910]]],
    feats: [{ pts: [[404, 892], [426, 892]], w: 6 }, { pts: [[434, 912], [450, 932], [432, 938]], w: 5 }, { pts: [[402, 960], [422, 958]], w: 5 }],
    limbs: [{ pts: [[430, 1060], [470, 1110], [520, 1150], [560, 1158]], w: 32 }],
    folds: [[[290, 1080], [260, 1350], [250, 1700]], [[400, 1100], [410, 1400], [400, 1750]]], seed: 860 }); }
  if (on('seal')) seal(ctx, r, 900, 1700, '承'); if (on('fx')) grain(ctx, W, H, .025, seed + 2);
}
const ON = o => k => !o.layer || (Array.isArray(o.layer) ? o.layer.includes(k) : o.layer === k);
export { hook, mid, reverse, spline, brush, sweepBrush, wash, pth, ell, circ, PAPER, paperBase, closed, rectPts, densify, figure, inkSlip, seal, lantern, mountains, table, board, B_SEATED, A_BOW };
export async function render(c, o) { const b = o.beat || 'hook'; return ({ hook, mid, reverse }[b] || hook)(c, o); }
