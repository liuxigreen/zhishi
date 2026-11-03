// style-ink-land · apology 席间借口条 · 1920×1080 · ~130s · one-take continuous · TOP30 five-part
import * as N from '../style-ink/scene.js';
import { rng, fbm, mkCanvas, SLIPS } from '../../core/util.js';

export const W = 1920, H = 1080, FPS = 30;
const { brush, sweepBrush, wash, pth, ell, circ, PAPER, paperBase, rectPts, figure, inkSlip, seal } = N;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eout = t => 1 - Math.pow(1 - t, 3);
const ein = t => t * t * t;
const L = async fn => { const c = mkCanvas(W, H); await fn(c, c.getContext('2d')); return c; };
const sprite = (w, h, fn) => { const c = mkCanvas(w, h); fn(c.getContext('2d'), c); return c; };
const blit = (ctx, cv, x, y, rot = 0, s = 1, a = 1) => { if (a <= 0 || !cv) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.drawImage(cv, -cv.width / 2, -cv.height / 2); ctx.restore(); };
const cam = (ctx, z, cx, cy, dx = 0, dy = 0) => { ctx.translate(cx + dx, cy + dy); ctx.scale(z, z); ctx.translate(-cx, -cy); };

function slipH(t, { w = 280, h = 72, fs = 42 } = {}) {
  return sprite(w + 30, h + 30, x => {
    x.translate((w + 30) / 2, (h + 30) / 2);
    x.shadowColor = 'rgba(60,40,20,.28)'; x.shadowBlur = 10; x.shadowOffsetY = 4;
    x.fillStyle = '#f7efdc'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
    brush(x, rectPts(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 6), { w: 4, dry: .3, seed: t.length * 9, bristles: 7, color: '184,38,29', taper: [.02, .05] });
    x.fillStyle = 'rgba(18,16,14,.95)'; x.font = `${fs}px Brush`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 0, 2);
  });
}
function spearOf(t) {
  return sprite(520, 100, x => {
    x.translate(0, 50);
    x.fillStyle = '#f7efdc'; x.fillRect(120, -24, 260, 48);
    brush(x, rectPts(120, -24, 260, 48, 6), { w: 3, dry: .3, seed: 40 + t.length, bristles: 6 });
    x.fillStyle = 'rgba(18,16,14,.95)'; x.font = '36px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 250, 1);
    x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.moveTo(380, -26); x.lineTo(510, 0); x.lineTo(380, 26); x.fill();
    x.save(); x.globalCompositeOperation = 'multiply';
    for (let k = 0; k < 3; k++) { const g = x.createRadialGradient(460 - k * 30, 0, 2, 460 - k * 30, 0, 50); g.addColorStop(0, 'rgba(184,38,29,.7)'); g.addColorStop(1, 'rgba(184,38,29,0)'); x.fillStyle = g; x.fillRect(360, -50, 160, 100); }
    x.restore();
  });
}
function grainOver(ctx, G, f, a = .12) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a; ctx.drawImage(G[f % G.length], 0, 0); ctx.restore(); }
function mkGrain(n = 3, amt = .4, seed = 3) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const c = mkCanvas(W, H), x = c.getContext('2d'), id = x.createImageData(W, H), d = id.data, r = rng(seed + k * 101);
    for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() - .5) * 255 * amt; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    x.putImageData(id, 0, 0); out.push(c);
  }
  return out;
}
function vignette(ctx, a = .22) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .85);
  g.addColorStop(0, 'rgba(60,40,20,0)'); g.addColorStop(1, `rgba(60,40,20,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// —— shared stage builders ——
async function boothBack() {
  return L((c, x) => {
    paperBase(x, W, H, 11);
    // far mountains (landscape)
    wash(x, pth([[0, 260], [220, 140], [480, 200], [760, 80], [1100, 180], [1400, 90], [1680, 170], [1920, 110], [1920, 360], [0, 380]]), { tone: .1, blur: 20, edge: .05, color: '60,50,40' });
    wash(x, pth([[0, 340], [300, 250], [640, 310], [1000, 220], [1400, 300], [1920, 240], [1920, 420], [0, 440]]), { tone: .14, blur: 14, edge: .06, color: '50,42,32' });
    wash(x, pth([[0, 0], [1920, 0], [1920, 200], [0, 240]]), { tone: .06, blur: 28, edge: 0, color: '80,70,50' });
    // lanterns (hanging — string + oval body so not floating orbs)
    for (const [lx, ly] of [[280, 90], [1640, 85]]) {
      x.save();
      brush(x, [[lx, 20], [lx, ly + 10]], { w: 3, dry: .2, seed: lx, bristles: 4, color: '40,30,20', ink: .55 });
      x.translate(lx, ly + 50);
      x.fillStyle = 'rgba(184,38,29,.5)'; x.beginPath(); x.ellipse(0, 0, 28, 40, 0, 0, 7); x.fill();
      brush(x, circ(0, 0, 30, 42, -1.2, 4.5, 28), { w: 5, dry: .35, seed: lx, bristles: 10, color: '120,20,15' });
      // tassel
      brush(x, [[0, 42], [0, 70]], { w: 4, dry: .4, seed: lx + 1, bristles: 5, color: '140,30,20', ink: .5 });
      x.restore();
    }
    // table (thicker mass for landscape mid-ground)
    sweepBrush(x, [[200, 760], [960, 735], [1720, 760]], { w: 140, ink: .6, dry: .35, color: '55,38,22', seed: 80, bristles: 42 });
    sweepBrush(x, [[240, 820], [960, 800], [1680, 825]], { w: 70, ink: .4, dry: .45, color: '40,28,16', seed: 81, bristles: 28 });
    sweepBrush(x, [[260, 700], [960, 690], [1660, 705]], { w: 18, ink: .45, dry: .5, color: '70,48,28', seed: 82, bristles: 14 });
    // floor wash
    wash(x, pth([[0, 880], [1920, 860], [1920, 1080], [0, 1080]]), { tone: .12, blur: 18, edge: .05, color: '70,50,30' });
  });
}
async function figA(seed = 200) {
  // left-side host, landscape scaled
  return L((c, x) => {
    figure(x, {
      body: [[80, 1100], [120, 820], [260, 700], [420, 680], [440, 600], [520, 595], [540, 675], [700, 710], [760, 900], [780, 1100]],
      robe: .78, cw: 14, sweep: 70,
      head: [480, 520, 110, 130, -.06],
      hair: [[[370, 480], [390, 400], [480, 370], [570, 400], [590, 480], [560, 450], [500, 430], [430, 445], [390, 475]]],
      feats: [{ pts: [[410, 490], [445, 498]], w: 10 }, { pts: [[420, 540], [450, 536]], w: 7 }, { pts: [[400, 560], [380, 590], [410, 598]], w: 6 }],
      folds: [[[280, 780], [250, 980]], [[620, 760], [660, 980]]], seed
    });
  });
}
async function figB(seed = 220) {
  return L((c, x) => {
    figure(x, {
      body: [[1180, 1100], [1200, 860], [1320, 720], [1480, 690], [1500, 610], [1580, 605], [1600, 685], [1760, 730], [1820, 920], [1840, 1100]],
      robe: .75, cw: 14, sweep: 70,
      head: [1540, 530, 105, 125, .05],
      hair: [[[1430, 500], [1450, 410], [1540, 380], [1630, 410], [1650, 500], [1610, 470], [1550, 450], [1480, 460], [1440, 490]]],
      feats: [{ pts: [[1480, 500], [1515, 505]], w: 10 }, { pts: [[1490, 545], [1520, 542]], w: 7 }],
      folds: [[[1280, 800], [1260, 1000]], [[1680, 780], [1720, 1000]]], seed
    });
  });
}
async function shieldLayer() {
  return L((c, x) => {
    const cx = 1480, cy = 620, R = 210;
    x.save(); x.shadowColor = 'rgba(60,40,20,.3)'; x.shadowBlur = 28; x.shadowOffsetY = 12;
    x.fillStyle = '#d8c39a'; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill(); x.restore();
    x.save(); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.clip();
    for (let k = 0; k < 10; k++) brush(x, circ(cx, cy, R - 16 - k * 18, R - 16 - k * 18, k * .4, k * .4 + 5.8, 30), { w: 9, dry: .65, seed: 80 + k, ink: .4, color: '110,80,40', bristles: 10 });
    x.restore();
    brush(x, circ(cx, cy, R, R, -1.6, 4.7, 48), { w: 16, dry: .35, seed: 99, bristles: 20 });
    x.font = '140px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(30,20,12,.45)'; x.fillText('怒', cx, cy + 8);
  });
}
async function heatShield() {
  return L((c, x) => {
    const cx = 1480, cy = 620, R = 208;
    x.beginPath(); x.arc(cx, cy, R, 0, 7); x.clip();
    wash(x, pth([[cx - 220, cy - 220], [cx + 220, cy - 220], [cx + 220, cy + 220], [cx - 220, cy + 220]]), { tone: .65, blur: 6, edge: .25, color: '184,38,29' });
  });
}
async function scrollPortrait() {
  return L((c, x) => {
    // hanging scroll 「形象」
    const X = 320, Y = 120, w = 220, h = 520;
    x.fillStyle = '#e8dcc0'; x.fillRect(X, Y, w, h);
    brush(x, rectPts(X + 6, Y + 6, w - 12, h - 12, 8), { w: 5, dry: .3, seed: 300, bristles: 8, color: '40,30,20' });
    // face blob
    wash(x, ell(X + w / 2, Y + 200, 70, 90), { tone: .35, blur: 4, edge: .2, color: '30,24,18' });
    x.font = '72px Brush'; x.textAlign = 'center'; x.fillStyle = 'rgba(18,16,14,.9)'; x.fillText('形象', X + w / 2, Y + 420);
  });
}
async function schlenkerCard() {
  return L((c, x) => {
    x.save(); x.translate(960, 540); x.rotate(-.08);
    x.shadowColor = 'rgba(40,50,80,.35)'; x.shadowBlur = 24;
    x.fillStyle = 'rgb(48,72,138)'; x.fillRect(-220, -70, 440, 140);
    x.shadowColor = 'transparent';
    for (let i = 0; i < 3; i++) brush(x, [[-200, -40 + i * 40], [200, -36 + i * 40]], { w: 22, dry: .7, seed: 400 + i, ink: .3, color: '20,30,60', bristles: 14 });
    x.fillStyle = '#f4efe6'; x.font = '56px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('印象管理', 0, -8);
    x.font = '22px NSerif'; x.fillText('据 Schlenker · 简化模型', 0, 42);
    x.restore();
  });
}
async function emptyTableClose() {
  return L((c, x) => {
    paperBase(x, W, H, 17);
    wash(x, pth([[0, 240], [300, 130], [700, 190], [1100, 90], [1500, 160], [1920, 100], [1920, 340], [0, 360]]), { tone: .1, blur: 18, edge: .05, color: '60,50,40' });
    sweepBrush(x, [[200, 760], [960, 735], [1720, 760]], { w: 140, ink: .55, dry: .35, color: '55,38,22', seed: 90, bristles: 42 });
    sweepBrush(x, [[240, 820], [960, 800], [1680, 825]], { w: 70, ink: .4, dry: .45, color: '40,28,16', seed: 91, bristles: 28 });
    // ash flecks on table
    const r = rng(55);
    for (let i = 0; i < 40; i++) {
      const ax = 500 + r() * 900, ay = 730 + r() * 50;
      x.fillStyle = `rgba(30,24,18,${.15 + r() * .35})`; x.beginPath(); x.ellipse(ax, ay, 2 + r() * 4, 1 + r() * 2, r(), 0, 7); x.fill();
    }
  });
}

const TEXTS = ['堵车', '加班', '临时会', '手机没电', '不是故意'];
const DUR = 130;

// global camera path by absolute time (one-take)
function camAt(t) {
  // returns {z,cx,cy}
  if (t < 10) return { z: 1.0 + .06 * ease(t / 10), cx: 960, cy: 540 }; // push in
  if (t < 22) return { z: 1.08 + .12 * ease((t - 10) / 12), cx: 720 - 40 * ease((t - 10) / 12), cy: 560 }; // to his hand / slips
  if (t < 38) return { z: 1.05, cx: 960, cy: 520 }; // pull to wall
  if (t < 62) return { z: 1.1 + .05 * ease((t - 38) / 24), cx: 1200, cy: 560 }; // follow spears to shield
  if (t < 78) return { z: 1.0, cx: 960, cy: 540 }; // split
  if (t < 92) return { z: 1.15, cx: 960, cy: 540 }; // card
  if (t < 105) return { z: 1.05 + .02 * Math.sin((t - 92) * 8) * Math.exp(-(t - 92) * 3), cx: 960, cy: 540 }; // hit
  if (t < 118) return { z: 1.02, cx: 960, cy: 540 }; // callback
  return { z: 1.0 + .04 * ease((t - 118) / 12), cx: 960, cy: 500 }; // settle
}

function capParts(t) {
  // return {parts:[[txt,mark]], sub?, breath?} for absolute t
  if (t < 2.5) return { parts: [['你说了五句对不起——', 0], ['她却更生气了。', 'R']] };
  if (t < 10) return { parts: [['迟到八分钟。', 0]] };
  if (t < 22) return { parts: [['他以为：讲清楚', 0], ['＝负责。', 'R']] };
  if (t < 38) return null; // count only
  if (t < 48) return { parts: [['她听到的，是', 0], ['推责。', 'R']] };
  if (t < 62) return { parts: [['每多一句原因，', 0], ['盾就厚一分。', 0]] };
  if (t < 78) return null; // visual split
  if (t < 92) return { parts: [['印象管理', 'B']], sub: '据 Schlenker · 简化模型' };
  if (t < 105) return { parts: [['护的是形象，', 'R'], ['不是关系。', 0]], breath: true };
  if (t < 118) return { parts: [['同一张桌。', 0]] };
  if (t < 126) return { parts: [['解释越多，诚意越薄。', 0]], breath: true };
  return { parts: [['你上次道歉，', 0], ['先说了原因，还是先认了错？', 0]] };
}

function drawCap(ctx, t, ltFade = 1) {
  const c = capParts(t); if (!c) return;
  const k = eout(clamp(ltFade));
  ctx.save(); ctx.globalAlpha = k * (c.breath ? .95 : 1);
  ctx.textBaseline = 'alphabetic'; ctx.font = '64px Brush';
  const parts = c.parts; const ws = parts.map(([tx]) => ctx.measureText(tx).width);
  const tot = ws.reduce((a, b) => a + b, 0); let x = W / 2 - tot / 2; const y = 980;
  parts.forEach(([tx, m], i) => {
    const col = m === 'R' ? '#b8261d' : m === 'B' ? '#30488a' : 'rgba(18,16,14,.92)';
    ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(239,229,207,.9)'; ctx.lineWidth = 10; ctx.strokeText(tx, x, y);
    ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.fillText(tx, x, y);
    if (m) { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 12); ctx.lineTo(x + ws[i], y + 12); ctx.stroke(); }
    x += ws[i];
  });
  if (c.sub) { ctx.font = '600 28px NSerif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(48,72,138,.85)'; ctx.fillText(c.sub, W / 2, y + 48); }
  ctx.restore();
}

function tally(ctx, n, x = 160, y = 120) {
  ctx.save(); ctx.font = '44px Brush'; ctx.textAlign = 'center';
  ctx.strokeStyle = 'rgba(239,229,207,.9)'; ctx.lineWidth = 8; ctx.strokeText('借口×' + n, x, y);
  ctx.fillStyle = n ? '#b8261d' : '#9a6a10'; ctx.fillText('借口×' + n, x, y); ctx.restore();
}

function sealDraw(ctx, ch, x, y, s = .85) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgb(184,38,29)'; ctx.fillRect(-36, -36, 72, 72);
  brush(ctx, rectPts(-36, -36, 72, 72, 4), { w: 4, dry: .4, seed: ch.charCodeAt(0), bristles: 8, color: '100,16,10' });
  ctx.fillStyle = '#fbf3e3'; ctx.font = '48px Brush'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ch, 0, 4);
  ctx.restore();
}

// ========== SHOTS (timeline segments of one continuous take) ==========
const S0 = { id: 'S0-hook', t0: 0, t1: 10,
  async build() {
    return { back: await boothBack(), A: await figA(), B: await figB(), seal: '歉' };
  },
  frame(ctx, lt, st, K) {
    const t = K.t; const C = camAt(t);
    ctx.save(); cam(ctx, C.z, C.cx, C.cy);
    ctx.drawImage(st.back, 0, 0);
    // figures settle in
    const ain = ease(seg(t, 0, 2));
    ctx.globalAlpha = ain; ctx.drawImage(st.A, -40 * (1 - ain), 40 * (1 - ain)); ctx.globalAlpha = 1;
    ctx.globalAlpha = ain; ctx.drawImage(st.B, 40 * (1 - ain), 30 * (1 - ain)); ctx.globalAlpha = 1;
    // cracked porcelain corner
    if (t > 3) {
      const k = eout(seg(t, 3, 6));
      ctx.save(); ctx.translate(980, 740); ctx.rotate(-.2); ctx.globalAlpha = k;
      brush(ctx, [[0, 0], [40, -10], [70, 20], [30, 35], [0, 0]], { w: 8, dry: .4, seed: 1, bristles: 10, color: '80,70,60' });
      ctx.restore();
    }
    sealDraw(ctx, st.seal, 1780, 120);
    ctx.restore();
    drawCap(ctx, t, seg(t, 0, .8));
  }
};

const S1 = { id: 'S1-slips', t0: 10, t1: 38,
  async build() {
    const slips = TEXTS.map(slipH);
    return { back: await boothBack(), A: await figA(201), B: await figB(221), slips, seal: '辩' };
  },
  frame(ctx, lt, st, K) {
    const t = K.t; const C = camAt(t);
    ctx.save(); cam(ctx, C.z, C.cx, C.cy);
    ctx.drawImage(st.back, 0, 0); ctx.drawImage(st.A, 0, 0); ctx.drawImage(st.B, 0, 0);
    // slips appear one by one from his sleeve (~12s mark) stacking into a wall
    const starts = [11, 15, 19, 24, 29];
    let n = 0;
    st.slips.forEach((cv, i) => {
      const a = starts[i]; if (t < a) return; n++;
      const k = eout(seg(t, a, a + 1.2));
      const tx = 620 + (i % 3) * 50 + i * 8, ty = 520 - i * 38;
      const fromX = 520, fromY = 640;
      const x = fromX + (tx - fromX) * k, y = fromY + (ty - fromY) * k - Math.sin(k * Math.PI) * 80;
      blit(ctx, cv, x, y, -.15 + i * .04, .85 + .15 * k, .3 + .7 * k);
    });
    tally(ctx, n, 200, 140);
    sealDraw(ctx, st.seal, 1780, 120);
    ctx.restore();
    drawCap(ctx, t);
    if (t >= 10 && t < 22) {/* caption active */}
  }
};

const S2 = { id: 'S2-spears', t0: 38, t1: 62,
  async build() {
    return {
      back: await boothBack(), A: await figA(202), B: await figB(222),
      shield: await shieldLayer(), heat: await heatShield(),
      spears: TEXTS.map(spearOf), seal: '责'
    };
  },
  frame(ctx, lt, st, K) {
    const t = K.t; const C = camAt(t);
    ctx.save(); cam(ctx, C.z, C.cx, C.cy);
    ctx.drawImage(st.back, 0, 0); ctx.drawImage(st.A, 0, 0); ctx.drawImage(st.B, 0, 0);
    // shield rises
    const up = ease(seg(t, 38, 44));
    ctx.save(); ctx.translate(0, 180 * (1 - up)); ctx.drawImage(st.shield, 0, 0); ctx.restore();
    const hits = [40, 44, 48, 52, 56];
    let nHit = 0;
    st.spears.forEach((cv, i) => {
      const h = hits[i]; if (t < h - 1) return;
      const k = ein(seg(t, h - 1, h));
      const ang = -.35 - i * .05;
      const x0 = 700, y0 = 560 - i * 20;
      const x1 = 1280, y1 = 600 + (i - 2) * 30;
      const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = .4 + .6 * k; ctx.drawImage(cv, -500, -50); ctx.restore();
      if (t >= h) nHit++;
    });
    // heat fill by hits
    const heat = clamp(.08 + nHit * .16);
    if (heat > 0) {
      ctx.save(); ctx.translate(0, 180 * (1 - up));
      ctx.beginPath(); ctx.rect(1480 - 210, 620 + 210 - 420 * heat, 420, 420 * heat); ctx.clip();
      ctx.globalAlpha = .85; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(st.heat, 0, 0);
      ctx.restore();
    }
    tally(ctx, 5, 200, 140);
    sealDraw(ctx, st.seal, 1780, 120);
    ctx.restore();
    drawCap(ctx, t);
  }
};

const S3 = { id: 'S3-mechanism', t0: 62, t1: 92,
  async build() {
    return {
      back: await boothBack(), A: await figA(203), B: await figB(223),
      scroll: await scrollPortrait(), card: await schlenkerCard(),
      slips: TEXTS.map(slipH), seal: '机'
    };
  },
  frame(ctx, lt, st, K) {
    const t = K.t; const C = camAt(t);
    ctx.save(); cam(ctx, C.z, C.cx, C.cy);
    ctx.drawImage(st.back, 0, 0);
    // ink midline grows into split
    const mid = ease(seg(t, 62, 70));
    if (mid > 0) {
      brush(ctx, [[960, 120], [960, 120 + 800 * mid]], { w: 10, dry: .25, seed: 500, bristles: 12, color: '20,18,16', ink: mid });
    }
    // LEFT: wall of slips + scroll rising (image)
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, H); ctx.clip();
    ctx.drawImage(st.A, -80, 0);
    const sc = ease(seg(t, 66, 76));
    ctx.globalAlpha = sc; ctx.drawImage(st.scroll, 0, -80 * (1 - sc)); ctx.globalAlpha = 1;
    st.slips.forEach((cv, i) => blit(ctx, cv, 480 + (i % 2) * 40, 420 - i * 36, -.1 + i * .03, .9, .85));
    ctx.restore();
    // RIGHT: empty — B alone, no slips
    ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 960, H); ctx.clip();
    ctx.drawImage(st.B, 40, 0);
    ctx.restore();
    sealDraw(ctx, st.seal, 1780, 120);
    ctx.restore();
    // Schlenker card in screen space (late) — guaranteed legibility over zoom
    if (t > 78) {
      const k = eout(seg(t, 78, 88));
      ctx.save();
      ctx.globalAlpha = .25 + .75 * k;
      ctx.translate(W / 2, 160 + 320 * k);
      ctx.rotate(-.06);
      ctx.scale(.95 + .05 * k, .95 + .05 * k);
      ctx.drawImage(st.card, -W / 2, -H / 2);
      ctx.restore();
    }
    drawCap(ctx, t);
  }
};

const S4 = { id: 'S4-reverse', t0: 92, t1: 118,
  async build() {
    return {
      back: await boothBack(), empty: await emptyTableClose(),
      A: await figA(204), B: await figB(224),
      scroll: await scrollPortrait(), seal: '承'
    };
  },
  frame(ctx, lt, st, K) {
    const t = K.t; const C = camAt(t);
    const ash = ease(seg(t, 92, 100));
    ctx.save(); cam(ctx, C.z, C.cx, C.cy);
    // crossfade booth → empty table world
    ctx.globalAlpha = 1 - ash * .85; ctx.drawImage(st.back, 0, 0); ctx.drawImage(st.A, 0, 0); ctx.drawImage(st.B, 0, 0);
    // scroll collapses to ash
    if (ash < 1) {
      ctx.save(); ctx.globalAlpha = 1 - ash; ctx.translate(0, 40 * ash); ctx.scale(1, 1 - ash * .7); ctx.drawImage(st.scroll, 0, 0); ctx.restore();
    }
    ctx.globalAlpha = ash; ctx.drawImage(st.empty, 0, 0);
    // figures fade back in on empty table (callback same seats)
    if (t > 100) {
      const fin = ease(seg(t, 100, 110));
      ctx.globalAlpha = fin * .9; ctx.drawImage(st.A, 0, 20 * (1 - fin)); ctx.drawImage(st.B, 0, 20 * (1 - fin));
    }
    ctx.globalAlpha = 1;
    // ash particles
    const r = rng(7);
    for (let i = 0; i < 50 * ash; i++) {
      const ax = 400 + (i * 97 % 1100), ay = 500 + ((i * 53 + t * 40) % 280);
      ctx.fillStyle = `rgba(30,24,18,${.1 + (i % 5) * .05})`; ctx.beginPath(); ctx.ellipse(ax, ay, 2, 1.2, 0, 0, 7); ctx.fill();
    }
    tally(ctx, 0, 200, 140);
    sealDraw(ctx, st.seal, 1780, 120);
    ctx.restore();
    // breath still on reverse line
    const breath = t >= 92 && t < 98 ? 1 : 1;
    drawCap(ctx, t, breath);
  }
};

const S5 = { id: 'S5-close', t0: 118, t1: 130,
  async build() {
    return { empty: await emptyTableClose(), A: await figA(205), B: await figB(225), seal: '问' };
  },
  frame(ctx, lt, st, K) {
    const t = K.t; const C = camAt(t);
    ctx.save(); cam(ctx, C.z, C.cx, C.cy);
    ctx.drawImage(st.empty, 0, 0);
    ctx.globalAlpha = .85; ctx.drawImage(st.A, 0, 0); ctx.drawImage(st.B, 0, 0); ctx.globalAlpha = 1;
    sealDraw(ctx, st.seal, 1780, 120);
    ctx.restore();
    // quiet: reduce motion — caption breath
    drawCap(ctx, t);
  }
};

export const SHOTS = [S0, S1, S2, S3, S4, S5];

let GRAIN;
export async function ENV() { GRAIN = mkGrain(3, .45, 9); return { G: GRAIN }; }
export function POST(ctx, lt, sh, K) {
  vignette(ctx, .2);
  if (K.env && K.env.G) grainOver(ctx, K.env.G, K.f, .11);
}
