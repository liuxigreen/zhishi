// style-ink: 水墨笔触 — procedural bristle brush strokes, ink wash with edge pooling, rice paper, red seal accent
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

export async function render(c, { W, H, seed }) {
  const ctx = c.getContext('2d'); const r = rng(seed);
  // rice paper: warm base + fibre texture multiply + faint stain
  ctx.fillStyle = '#efe5cf'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .45; ctx.fillStyle = ctx.createPattern(paperTexture(512, 2200, seed + 4), 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
  // distant moon + mist mountains (淡墨)
  wash(ctx, ell(780, 330, 150, 150), { tone: .0, edge: .22, blur: 6 });
  wash(ctx, pth([[0, 560], [140, 410], [260, 480], [420, 320], [560, 450], [700, 360], [860, 490], [1080, 390], [1080, 660], [0, 660]]), { tone: .1, blur: 18, edge: .05 });
  wash(ctx, pth([[0, 660], [200, 520], [380, 600], [600, 500], [820, 620], [1080, 530], [1080, 740], [0, 740]]), { tone: .16, blur: 14, edge: .08 });
  // red lantern above table (accent)
  brush(ctx, [[560, 0], [560, 300]], { w: 4, dry: .2, seed: 3, bristles: 6 });
  wash(ctx, ell(560, 390, 95, 105), { tone: .75, blur: 5, edge: .4, color: '184,38,29' });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const lg = ctx.createRadialGradient(560, 400, 10, 560, 400, 420); lg.addColorStop(0, 'rgba(255,200,120,.35)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.restore();
  brush(ctx, circ(560, 390, 95, 105, -1.2, 1.3, 14), { w: 6, dry: .4, seed: 4, color: '120,20,15', bristles: 10 });
  brush(ctx, [[520, 290], [600, 290]], { w: 14, seed: 5, dry: .3 }); brush(ctx, [[520, 492], [600, 492]], { w: 14, seed: 6, dry: .3 });
  brush(ctx, [[560, 500], [556, 560], [560, 600]], { w: 5, seed: 7, dry: .6, color: '184,38,29', bristles: 10 });
  // person B (right, seated, arms crossed) — wash body + bold contour strokes
  wash(ctx, pth([[690, 1180], [690, 930], [740, 850], [820, 830], [930, 860], [990, 960], [1000, 1180]]), { tone: .5, blur: 6, edge: .3 });
  wash(ctx, pth([[760, 640], [800, 610], [870, 625], [895, 690], [880, 760], [860, 700], [820, 680], [770, 690]]), { tone: .9, blur: 3, edge: .5 }); // hair
  wash(ctx, ell(885, 620, 38, 34), { tone: .92, blur: 3, edge: .4 }); // bun
  brush(ctx, circ(808, 715, 62, 76, 1.3, 4.2, 18), { w: 14, dry: .3, seed: 11, bristles: 16 }); // face contour
  brush(ctx, [[752, 690], [770, 683], [790, 690]], { w: 7, seed: 12, dry: .2, bristles: 10 }); // brow (furrowed)
  ctx.fillStyle = 'rgba(20,18,16,.9)'; ctx.beginPath(); ctx.ellipse(772, 706, 6, 3.5, 0, 0, 7); ctx.fill();
  brush(ctx, [[748, 712], [736, 740], [752, 744]], { w: 5, seed: 13, dry: .2, bristles: 8 }); brush(ctx, [[752, 768], [772, 764]], { w: 6, seed: 14, dry: .1, bristles: 8 });
  brush(ctx, [[742, 870], [700, 940], [688, 1060], [692, 1180]], { w: 30, seed: 15, dry: .55 }); brush(ctx, [[880, 845], [960, 880], [992, 980], [998, 1180]], { w: 34, seed: 16, dry: .6 });
  brush(ctx, [[670, 990], [760, 960], [860, 958], [935, 985]], { w: 46, seed: 17, dry: .45, taper: [.15, .2] }); // crossed arm 1
  brush(ctx, [[700, 1040], [790, 1020], [880, 1025], [925, 1040]], { w: 40, seed: 18, dry: .5, ink: .8, taper: [.15, .2] }); // arm 2
  brush(ctx, [[928, 975], [945, 995], [932, 1015]], { w: 22, seed: 19, dry: .2 });
  // table: dry-brush plank + legs + wash shadow
  wash(ctx, pth([[140, 1195], [1060, 1195], [1040, 1250], [160, 1250]]), { tone: .25, blur: 12, edge: .05 });
  brush(ctx, [[110, 1165], [400, 1160], [700, 1158], [1040, 1162]], { w: 34, seed: 21, dry: .75, taper: [.05, .1], bristles: 40 });
  brush(ctx, [[200, 1185], [196, 1450]], { w: 20, seed: 22, dry: .9 }); brush(ctx, [[960, 1185], [966, 1450]], { w: 20, seed: 23, dry: .9 });
  // broken plate: shards with indigo rim
  [[[640, 1128], [700, 1118], [692, 1140]], [[710, 1116], [770, 1124], [748, 1144]], [[780, 1130], [815, 1138], [790, 1146]], [[600, 1144], [632, 1138], [618, 1150]]].forEach((s, i) => {
    ctx.fillStyle = '#fbf8f0'; ctx.beginPath(); s.forEach(([a, b], j) => j ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fill();
    brush(ctx, [...s, s[0]], { w: 3.5, seed: 30 + i, dry: .1, bristles: 5 }); brush(ctx, [s[0], s[1]], { w: 4, seed: 40 + i, color: '40,70,140', dry: .1, bristles: 6 }); });
  brush(ctx, [[600, 1100], [612, 1090]], { w: 3, seed: 51, bristles: 4 }); brush(ctx, [[830, 1100], [842, 1108]], { w: 3, seed: 52, bristles: 4 });
  // excuse slips (pile + flying), calligraphy
  const slip = (x, y, a, t, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s); ctx.shadowColor = 'rgba(60,40,20,.25)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#f7efdc'; ctx.fillRect(-46, -110, 92, 220); ctx.shadowColor = 'transparent'; ctx.strokeStyle = 'rgba(184,38,29,.55)'; ctx.lineWidth = 2; ctx.strokeRect(-40, -104, 80, 208);
    ctx.fillStyle = 'rgba(18,16,14,.92)'; ctx.font = `${Math.min(44, 190 / t.length)}px Brush`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const n = t.length, fs = Math.min(44, 190 / n);
    [...t].forEach((ch, i) => ctx.fillText(ch, 0, -((n - 1) * fs) / 2 + i * fs)); ctx.restore(); };
  [[430, 1120, 1.45], [470, 1108, 1.7], [450, 1095, 1.35], [490, 1082, 1.6]].forEach(([x, y, a], i) => slip(x, y, a, SLIPS[i], .78));
  slip(600, 880, -.35, SLIPS[4], .95); slip(700, 560, .3, SLIPS[5], 1); slip(460, 700, -.2, SLIPS[6], .95); slip(320, 520, .25, '我也很难', .9);
  // person A (left, bowing, palms together) — sweeping back stroke = the gesture
  wash(ctx, pth([[150, 1720], [120, 1400], [150, 1160], [230, 1050], [330, 1020], [370, 1090], [380, 1300], [350, 1720]]), { tone: .4, blur: 6, edge: .28 });
  brush(ctx, [[240, 1040], [170, 1150], [130, 1400], [150, 1720], [165, 1900]], { w: 42, seed: 61, dry: .55, taper: [.08, .3] }); // back (one sweep)
  brush(ctx, [[340, 1060], [370, 1200], [360, 1450], [345, 1720], [340, 1900]], { w: 24, seed: 62, dry: .7, ink: .85, taper: [.1, .3] });
  wash(ctx, pth([[318, 950], [330, 890], [400, 880], [440, 930], [410, 935], [370, 945], [340, 1000]]), { tone: .92, blur: 3, edge: .5 }); // hair
  brush(ctx, circ(382, 978, 60, 74, -.4, 2.6, 18), { w: 14, dry: .3, seed: 63, bristles: 16 }); // face contour (bowed, facing down-right)
  brush(ctx, [[405, 992], [424, 1004]], { w: 5, seed: 64, bristles: 8 }); // closed eye
  brush(ctx, [[432, 1022], [454, 1042], [428, 1050]], { w: 5, seed: 65, bristles: 8 });
  brush(ctx, [[300, 1150], [380, 1170], [430, 1090], [462, 1005]], { w: 30, seed: 66, dry: .4 }); // forearm sweep
  brush(ctx, [[460, 1030], [474, 960], [488, 918]], { w: 18, seed: 67, dry: .2 }); // pressed palms
  ctx.fillStyle = 'rgba(70,110,160,.6)'; ctx.beginPath(); ctx.ellipse(436, 958, 6, 10, .3, 0, 7); ctx.fill(); // sweat
  // ink splatter dots
  for (let i = 0; i < 40; i++) { const x = 560 + (r() - .5) * 500, y = 1130 + (r() - .5) * 140, s = r() * r() * 7; ctx.fillStyle = `rgba(20,18,16,${.3 + r() * .6})`; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); }
  // red seal (印章) bottom right
  { const sc = mkCanvas(160, 160), sx = sc.getContext('2d'); sx.fillStyle = '#b8261d'; sx.fillRect(18, 18, 124, 124); sx.globalCompositeOperation = 'destination-out';
    sx.font = '92px XiaoWei'; sx.textAlign = 'center'; sx.textBaseline = 'middle'; sx.fillText('歉', 80, 86); sx.lineWidth = 5; sx.strokeRect(28, 28, 104, 104);
    for (let i = 0; i < 300; i++) { sx.fillStyle = `rgba(0,0,0,${r() * .8})`; sx.fillRect(18 + r() * 124, 18 + r() * 124, r() * 5, r() * 5); }
    ctx.save(); ctx.translate(900, 1700); ctx.rotate(-.04); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(sc, -80, -80); ctx.restore(); }
  brush(ctx, [[960, 1500], [958, 1580]], { w: 3, seed: 90, bristles: 4 });
  grain(ctx, W, H, .025, seed);
}
