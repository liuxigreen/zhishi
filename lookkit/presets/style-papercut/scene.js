// style-papercut: 纸雕层叠 — 7 depth layers of cut paper, inter-layer drop shadows, paper fiber, warm lamp key
import { rng, mkCanvas, paperTexture, wobblePath, ellipsePts, vignette, grain, SLIPS } from '../../core/util.js';
export const meta = { name: 'papercut', zh: '纸雕层叠', layers: 7 };

let TEX; let SEED = 1;
// shape helpers -> functions(ctx) that build a path (wobbly cut edges)
const El = (x, y, rx, ry, a0, a1) => c => wobblePath(c, ellipsePts(x, y, rx, ry, 40, a0, a1), 2.2, SEED++, 10);
const Pg = (...pts) => c => wobblePath(c, pts, 2.2, SEED++, 12);
const Bz = (pts, n = 18) => { // poly-bezier -> points (for organic shapes)
  const out = []; let [x0, y0] = pts[0];
  for (let i = 1; i < pts.length; i++) { const p = pts[i];
    if (p.length === 2) { out.push([x0, y0]); [x0, y0] = p; continue; }
    const [a, b, cx, cy, x, y] = p; for (let k = 0; k < n; k++) { const t = k / n, u = 1 - t;
      out.push([u*u*u*x0 + 3*u*u*t*a + 3*u*t*t*cx + t*t*t*x, u*u*u*y0 + 3*u*u*t*b + 3*u*t*t*cy + t*t*t*y]); } [x0, y0] = [x, y]; }
  out.push([x0, y0]); return c => wobblePath(c, out, 2, SEED++, 10); };

function MASKC(cv) { const m = mkCanvas(cv.width, cv.height), x = m.getContext('2d'); x.drawImage(cv, 0, 0); return m; }
// draw one paper piece: fill colour, paper grain multiply, lamp shading, drop shadow onto what's below
function piece(ctx, W, H, shapes, color, { depth = 1, lamp = [540, 430], hole = null, shade = .35 } = {}) {
  const cv = mkCanvas(W, H), x = cv.getContext('2d');
  x.fillStyle = color; shapes.forEach(f => { f(x); x.fill(); });
  if (hole) { x.globalCompositeOperation = 'destination-out'; hole.forEach(f => { f(x); x.fill(); }); }
  const msk = MASKC(cv); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .55; x.fillStyle = x.createPattern(TEX, 'repeat'); x.fillRect(0, 0, W, H);
  x.globalAlpha = 1; x.globalCompositeOperation = 'destination-in'; x.drawImage(msk, 0, 0);
  x.globalCompositeOperation = 'source-atop';
  const g = x.createRadialGradient(lamp[0], lamp[1] + 300, 60, lamp[0], lamp[1] + 300, 1100); g.addColorStop(0, 'rgba(255,220,160,.18)'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(20,10,30,${shade})`);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // cut-edge highlight (paper thickness) on top-left of piece
  const e = mkCanvas(W, H), ex = e.getContext('2d'); ex.drawImage(cv, 0, 0); ex.globalCompositeOperation = 'destination-out'; ex.drawImage(cv, 2.5, 2.5);
  ex.globalCompositeOperation = 'source-in'; ex.fillStyle = 'rgba(255,245,225,.55)'; ex.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = `rgba(18,8,2,${Math.min(.75, .45 + depth * .03)})`; ctx.shadowBlur = 14 + depth * 4; ctx.shadowOffsetX = 6 + depth * 2.2; ctx.shadowOffsetY = 9 + depth * 3;
  ctx.drawImage(cv, 0, 0); ctx.restore(); ctx.drawImage(e, 0, 0); }

export async function render(c, { W, H, seed }) {
  const ctx = c.getContext('2d'); const r = rng(seed); TEX = paperTexture(512, 1400, seed); SEED = seed * 100;
  const P = (s, col, o) => piece(ctx, W, H, s, col, o);
  // L0 back board
  ctx.fillStyle = '#1d3540'; ctx.fillRect(0, 0, W, H); P([Pg([0, 0], [W, 0], [W, H], [0, H])], '#24434d', { depth: 0, shade: .6 });
  // L1 night window: sky + moon + 2 skyline layers
  const win = Pg([170, 230], [910, 230], [910, 760], [170, 760]);
  P([win], '#2d5a6b', { depth: 0 });
  P([El(760, 350, 52, 52)], '#f6e7c1', { depth: 1 });
  P([Pg([170, 760], [170, 600], [230, 600], [230, 540], [300, 540], [300, 620], [360, 620], [360, 500], [430, 500], [430, 640], [520, 640], [520, 580], [600, 580], [600, 660], [700, 660], [700, 560], [780, 560], [780, 640], [910, 640], [910, 760])], '#1a3b4a', { depth: 1 });
  P([Pg([170, 760], [170, 680], [260, 680], [260, 650], [340, 650], [340, 700], [480, 700], [480, 670], [620, 670], [620, 710], [760, 710], [760, 680], [910, 680], [910, 760])], '#132c38', { depth: 1 });
  for (let i = 0; i < 16; i++) { const wx = 190 + r() * 700, wy = 600 + r() * 120; P([Pg([wx, wy], [wx + 10, wy], [wx + 10, wy + 14], [wx, wy + 14])], '#f3c96a', { depth: 0 }); }
  // window frame with mullions (cut holes)
  P([Pg([140, 200], [940, 200], [940, 790], [140, 790])], '#e9d9b8', { depth: 2, hole: [Pg([175, 235], [530, 235], [530, 755], [175, 755]), Pg([550, 235], [905, 235], [905, 755], [550, 755])] });
  // L2 lamp + translucent light cone
  P([Pg([536, 0], [544, 0], [544, 400], [536, 400])], '#3a2a20', { depth: 2 });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const cg = ctx.createLinearGradient(0, 470, 0, 1300); cg.addColorStop(0, 'rgba(255,214,140,.55)'); cg.addColorStop(1, 'rgba(255,200,120,.06)');
  ctx.fillStyle = cg; ctx.filter = 'blur(6px)'; Pg([470, 470], [610, 470], [1000, 1280], [80, 1280])(ctx); ctx.fill(); ctx.restore(); ctx.filter = 'none';
  P([Pg([490, 395], [590, 395], [650, 475], [430, 475])], '#c2452f', { depth: 3 });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const bg = ctx.createRadialGradient(540, 480, 4, 540, 480, 170); bg.addColorStop(0, 'rgba(255,250,220,1)'); bg.addColorStop(.3, 'rgba(255,210,130,.6)'); bg.addColorStop(1, 'rgba(255,190,100,0)'); ctx.fillStyle = bg; ctx.fillRect(300, 300, 480, 400); ctx.restore();
  // L3 person B (behind table, facing left, arms crossed, frowning)
  P([Bz([[660, 1250], [655, 990, 690, 880, 805, 860], [930, 860, 990, 930, 995, 1050], [1000, 1250]])], '#d79a2b', { depth: 3 }); // sweater
  P([Pg([775, 790], [845, 790], [850, 880], [770, 880])], '#e8b48f', { depth: 3 }); // neck
  P([El(808, 735, 70, 84)], '#f0c39c', { depth: 4 }); // head
  P([Pg([742, 728], [716, 756], [744, 764])], '#f0c39c', { depth: 4 }); // nose
  P([Bz([[742, 700], [740, 620, 840, 610, 880, 660], [905, 700, 900, 770, 870, 810], [860, 760, 845, 700, 790, 690], [765, 688, 750, 700, 742, 700]]), El(880, 650, 34, 34)], '#2b1d18', { depth: 4 }); // hair + bun
  P([Pg([752, 712], [785, 703], [786, 710], [752, 719])], '#2b1d18', { depth: 5 }); // angry brow
  P([El(770, 728, 6, 4)], '#2b1d18', { depth: 5 }); P([Pg([748, 784], [772, 780], [772, 785], [748, 789])], '#9c4a3a', { depth: 5 }); // eye, tight mouth
  P([Bz([[668, 1000], [720, 950, 870, 945, 945, 975], [965, 1010, 950, 1048, 915, 1046], [820, 1035, 735, 1048, 690, 1064], [655, 1062, 652, 1020, 668, 1000]])], '#c2861f', { depth: 5 }); // crossed arm 1
  P([Bz([[700, 1030], [770, 1005, 860, 1008, 915, 1018], [928, 1040, 915, 1060, 892, 1060], [810, 1058, 750, 1062, 705, 1068]]), El(912, 985, 26, 20)], '#b07618', { depth: 6 }); // arm 2 + fist
  // floor boards + skirting
  P([Pg([0, 1480], [W, 1480], [W, H], [0, H])], '#6b4430', { depth: 2 });
  for (let i = 0; i < 7; i++) P([Pg([0, 1520 + i * 62], [W, 1520 + i * 62], [W, 1526 + i * 62], [0, 1526 + i * 62])], '#4e3022', { depth: 1 });
  P([Pg([0, 1460], [W, 1460], [W, 1490], [0, 1490])], '#e9d9b8', { depth: 3 });
  // chair back behind B
  P([Pg([960, 860], [990, 860], [1000, 1200], [970, 1200]), Pg([960, 880], [1060, 880], [1060, 910], [960, 910])], '#5a3524', { depth: 2 });
  // L4 table: top, checker cloth strips, apron
  P([Pg([120, 1200], [230, 1135], [1010, 1135], [1080, 1200])], '#8a5a3b', { depth: 4 });
  P([Pg([100, 1200], [1080, 1200], [1080, 1420], [100, 1420])], '#f2ead8', { depth: 5 });
  for (let i = 0; i < 9; i++) P([Pg([120 + i * 108, 1200], [168 + i * 108, 1200], [168 + i * 108, 1420], [120 + i * 108, 1420])], '#c94a38', { depth: 5 });
  P([Bz([[100, 1420], [160, 1460, 220, 1400, 280, 1440], [340, 1480, 400, 1410, 460, 1450], [520, 1490, 580, 1410, 640, 1450], [700, 1490, 760, 1410, 820, 1450], [880, 1490, 940, 1410, 1000, 1450], [1040, 1470, 1060, 1440, 1080, 1440], [1080, 1400], [100, 1400]])], '#f2ead8', { depth: 6 });
  // teacups / bowl props on table
  P([El(905, 1150, 58, 18)], '#f6efe2', { depth: 6 }); P([Pg([860, 1150], [950, 1150], [940, 1100], [870, 1100])], '#3d7b8a', { depth: 6 });
  P([Pg([300, 1160], [340, 1160], [345, 1090], [295, 1090])], '#dfe7ea', { depth: 6 }); // glass
  // broken plate shards (white porcelain + blue rim)
  [[[620, 1165], [700, 1150], [690, 1182]], [[705, 1148], [775, 1158], [752, 1185], [702, 1182]], [[782, 1166], [820, 1176], [790, 1190]], [[575, 1185], [615, 1178], [600, 1194]]].forEach(s => P([Pg(...s)], '#fbf6ec', { depth: 7 }));
  P([Pg([705, 1150], [775, 1160], [772, 1166], [705, 1157])], '#2f5f9e', { depth: 7 });
  // L5 excuse slips: pile + fluttering
  const slip = (x, y, a, t, s = 1, col = '#fff4d8') => { const w = 190 * s, h = 64 * s, ca = Math.cos(a), sa = Math.sin(a), rot = ([px, py]) => [x + px * ca - py * sa, y + px * sa + py * ca];
    P([Pg(rot([-w/2, -h/2]), rot([w/2, -h/2]), rot([w/2, h/2]), rot([-w/2, h/2]))], col, { depth: 7, shade: .15 });
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#4a2416'; ctx.font = `${40 * s}px Brush`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, 0, 3); ctx.restore(); };
  [[470, 1172, -.08], [500, 1160, .14], [480, 1146, -.18], [515, 1132, .06], [490, 1118, .22]].forEach(([x, y, a], i) => slip(x, y, a, SLIPS[i], .8, i % 2 ? '#fde9c4' : '#fff6e0'));
  slip(560, 960, -.28, SLIPS[5]); slip(690, 1060, .18, SLIPS[6], .9); slip(520, 820, .12, SLIPS[7], .95, '#fde0d0'); slip(660, 700, -.14, '我也很难', .9);
  // L6 person A (front-left, bowing, palms together)
  P([Pg([150, 1640], [130, 1920], [230, 1920], [245, 1640]), Pg([250, 1640], [270, 1920], [360, 1920], [345, 1640])], '#2c3550', { depth: 6 }); // trousers
  P([Bz([[120, 1680], [80, 1400, 110, 1140, 200, 1050], [240, 1000, 330, 990, 360, 1050], [400, 1150, 380, 1420, 360, 1680]])], '#8db7d1', { depth: 7 }); // shirt
  P([Bz([[150, 1200], [180, 1350, 170, 1500, 140, 1660], [160, 1660], [200, 1500, 210, 1350, 175, 1190]]), Bz([[300, 1240], [320, 1400, 330, 1520, 330, 1660], [350, 1660], [350, 1500, 340, 1380, 320, 1230]])], '#6f9cba', { depth: 7 }); // shirt folds
  P([Pg([110, 1560], [370, 1560], [370, 1600], [105, 1600])], '#3b2a22', { depth: 8 }); P([Pg([230, 1562], [270, 1562], [270, 1598], [230, 1598])], '#d9b25a', { depth: 9 }); // belt + buckle
  P([Pg([300, 1000], [345, 1040], [320, 1070], [282, 1036])], '#e8b48f', { depth: 7 }); // neck
  P([Pg([255, 1040], [300, 1030], [330, 1090], [290, 1080]), Pg([300, 1030], [350, 1040], [345, 1100], [330, 1090])], '#eef4f8', { depth: 8 }); // collar
  P([El(380, 975, 64, 78)], '#f0c39c', { depth: 8 }); // head (bowed)
  P([Pg([434, 1018], [458, 1040], [428, 1050])], '#f0c39c', { depth: 8 });
  P([Bz([[318, 960], [320, 890, 400, 880, 438, 930], [420, 935, 400, 930, 380, 945], [360, 960, 340, 990, 330, 1010]])], '#3a2418', { depth: 8 }); // hair
  P([Pg([408, 990], [430, 1004], [428, 1009], [406, 996])], '#3a2418', { depth: 9 }); // closed eye (contrite)
  P([El(432, 960, 6, 10)], '#bfe4f5', { depth: 9 }); // sweat drop
  P([Bz([[300, 1150], [380, 1175, 432, 1085, 456, 1005], [476, 995, 488, 1008, 478, 1025], [455, 1115, 405, 1215, 312, 1215]])], '#7aa6c2', { depth: 9 }); // sleeve
  P([Bz([[452, 1015], [462, 960, 470, 925, 482, 915], [498, 912, 504, 930, 498, 952], [490, 990, 482, 1025, 472, 1040]])], '#f0c39c', { depth: 10 }); // pressed palms
  // L7 foreground frame: curtain + potted plant cut silhouettes
  P([Bz([[0, 0], [140, 0], [100, 400, 150, 900, 60, 1400], [40, 1600, 30, 1800, 0, 1920]])], '#7d2a24', { depth: 10 });
  P([Bz([[W, 0], [W - 110, 0], [W - 80, 500, W - 130, 1000, W - 60, 1500], [W - 40, 1700, W - 20, 1850, W, 1920]])], '#7d2a24', { depth: 10 });
  for (let i = 0; i < 7; i++) { const a = -1.9 + i * .25; const x0 = 960, y0 = 1920; P([Bz([[x0, y0], [x0 + Math.cos(a) * 160 - 40, y0 + Math.sin(a) * 160, x0 + Math.cos(a) * 320, y0 + Math.sin(a) * 380, x0 + Math.cos(a) * 400, y0 + Math.sin(a) * 470], [x0 + Math.cos(a) * 300 + 40, y0 + Math.sin(a) * 300, x0 + 30, y0 - 80, x0 + 10, y0]])], i % 2 ? '#2f6b4a' : '#3d8a5c', { depth: 11 }); }
  vignette(ctx, W, H, .45, '30,12,4'); grain(ctx, W, H, .035, seed);
}
