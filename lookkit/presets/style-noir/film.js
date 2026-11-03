// style-noir · apology-excuse-worse · densest v4 (10s, 8 shots / 7 sets). Static layers cached per shot; frames composite.
import * as N from './scene.js';
import { W, H, L, lay, cam, shake, seg, ease, eout, ein, back, clamp, mkGrain, grainOver, caption, vignette } from '../../core/filmkit.js';
import { rng, fbm, mkCanvas, SLIPS } from '../../core/util.js';
const { E, Q, rimSil, wallBase, coneLight, lampShade, foldLines, cloth, plaque, KEY } = N;
const SEED = 7;
const S = (beat, layer) => L(c => N[beat](c, { W, H, seed: SEED, layer }));
// ── small cached sprites ──
function slipCv(txt, { w = 184, h = 60, fs = 38, edge = null, glow = .95, ink = 'rgba(40,20,10,.9)' } = {}) {
  const c = mkCanvas(w + 60, h + 60), x = c.getContext('2d'); x.translate(c.width / 2, c.height / 2);
  x.shadowColor = 'rgba(0,0,0,.75)'; x.shadowBlur = 16; x.shadowOffsetY = 10;
  const g = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, `rgba(255,240,205,${glow})`); g.addColorStop(1, `rgba(190,160,115,${glow})`);
  x.fillStyle = g; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
  if (edge) { x.strokeStyle = edge; x.lineWidth = 5; x.strokeRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10); }
  x.fillStyle = ink; x.font = `${fs}px Brush`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 2); return c; }
function blit(ctx, cv, x, y, rot = 0, s = 1, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.drawImage(cv, -cv.width / 2, -cv.height / 2); ctx.restore(); }
function goldPlaque(ctx, cx, cy, w, h, fs, rot = 0, txt = '是我的错') { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.shadowColor = 'rgba(255,200,110,.75)'; ctx.shadowBlur = 60;
  const gg = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gg.addColorStop(0, '#f7dc8e'); gg.addColorStop(.5, '#c99a3c'); gg.addColorStop(1, '#7a5718'); ctx.fillStyle = gg; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255,248,220,.95)'; ctx.lineWidth = 3; ctx.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
  ctx.strokeStyle = 'rgba(255,255,240,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.stroke();
  ctx.font = `900 ${fs}px NSerif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,240,200,.5)'; ctx.fillText(txt, 2, 6); ctx.fillStyle = '#3a2508'; ctx.fillText(txt, 0, 3); ctx.restore(); }
const sprite = (w, h, fn) => { const c = mkCanvas(w, h); fn(c.getContext('2d'), c); return c; };
function chalk(ctx, x, y, n, a = 1, fs = 44) { ctx.save(); ctx.globalAlpha = a; ctx.font = `${fs}px Brush`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(236,230,214,.88)'; ctx.shadowColor = 'rgba(255,230,190,.35)'; ctx.shadowBlur = 8;
  ctx.fillText('借口', x, y); ctx.font = `${fs * 1.25}px Brush`; ctx.fillStyle = n ? 'rgba(255,120,100,.95)' : 'rgba(250,215,120,.95)'; ctx.fillText('×' + n, x, y + fs * 1.2); ctx.restore(); }
function motesF(ctx, t, n, x0, x1, y0, y1, col = KEY, seed = 3) { const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) { const bx = x0 + r() * (x1 - x0), by = y0 + r() * (y1 - y0), sp = 10 + r() * 30, ph = r() * 6.28, s = .6 + r() * 2.4;
    const x = bx + Math.sin(t * 1.3 + ph) * 14, y = y0 + ((by - y0 + t * sp) % (y1 - y0)); ctx.fillStyle = col + (.25 + .5 * (.5 + .5 * Math.sin(t * 3 + ph))) + ')'; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); } ctx.restore(); }
function sparks(ctx, x, y, k, n = 40, seed = 1, col = '255,220,160') { if (k <= 0 || k >= 1) return; const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'screen';
  const fl = ctx.createRadialGradient(x, y, 2, x, y, 140 * (1 - k * .5)); fl.addColorStop(0, `rgba(255,250,235,${(1 - k) * .95})`); fl.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = fl; ctx.fillRect(x - 160, y - 160, 320, 320);
  for (let i = 0; i < n; i++) { const a = r() * 6.28, l = (40 + r() * 160) * eout(k); ctx.strokeStyle = `rgba(${col},${(1 - k) * (.5 + r() * .5)})`; ctx.lineWidth = 1 + r() * 2; ctx.beginPath(); const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l + l * l / 700; ctx.moveTo(x + Math.cos(a) * l * .6, y + Math.sin(a) * l * .6); ctx.lineTo(ex, ey); ctx.stroke(); } ctx.restore(); }
const fig = (ctx, sh, dx, dy, rim, cl, glow = .8) => rimSil(ctx, sh, dx, dy, rim, cloth(...cl), W, H, glow);
const T = [0, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.6, 10.0];

// ══ S1 · booth hook — 以为讲清楚=负责 ══
const S1 = { id: 'S1-booth-hook', loc: 'booth', t0: T[0], t1: T[1], cap: [['以为', 0], ['讲清楚', 'R'], ['＝负责', 0]],
  async build() { const st = { back: await S('hook', 'back'), B: await S('hook', 'B'), front: await S('hook', 'front'), A: await S('hook', 'A') };
    st.sl = SLIPS.slice(0, 6).map((t, i) => slipCv(t, { edge: i % 2 ? null : 'rgba(255,90,74,.7)' })); return st; },
  frame(ctx, lt, st, K) { const hits = st.sl.map((_, i) => .04 + i * .13 + .27); const [sx, sy] = shake(lt, hits, 12, .05);
    ctx.save(); cam(ctx, 1.02 + .05 * ease(lt), 560, 900, sx, sy);
    lay(ctx, st.back); const nIn = hits.filter(h => lt > h).length; chalk(ctx, 205, 455, nIn, 1, 40);
    lay(ctx, st.B, { rot: -.035 * ease(seg(lt, .2, 1)) - .01 * nIn * 0, dx: 26 * ease(seg(lt, .2, 1)), px: 860, py: 1180 });
    lay(ctx, st.front); lay(ctx, st.A, { dy: Math.sin(lt * 26) * 6, rot: .012 * Math.sin(lt * 26), px: 260, py: 1700 });
    st.sl.forEach((cv, i) => { const a = .04 + i * .13, k = seg(lt, a, a + .27); if (lt < a) return; const tx = 760 + (i % 3 - 1) * 60, ty = 690 + (i % 2) * 70 - 30;
      if (k < 1) { const e = ein(k); const x = 470 + (tx - 470) * e, y = 990 + (ty - 990) * e - Math.sin(k * Math.PI) * 120; blit(ctx, cv, x, y, -1.2 + k * (1.1 + i * .2), .55 + .6 * e); }
      else { const d = (lt - a - .27) / .3; blit(ctx, cv, tx + d * 40, ty + d * d * 420, .3 + d * 1.5 * (i % 2 ? 1 : -1), 1.15 - d * .2, 1 - seg(d, .6, 1)); sparks(ctx, tx, ty, d * 3, 24, i); } });
    motesF(ctx, K.t, 110, 120, 980, 480, 1280); ctx.restore(); } };

// ══ S2 · B's room — 她听到的是推责 ══
const S2 = { id: 'S2-B-room', loc: 'B-room (rain window)', t0: T[1], t1: T[2], cap: [['她听到的是', 0], ['推责', 'R']],
  async build() { const st = {}; const r = rng(21);
    st.back = await L((c, x) => { wallBase(x, W, H, '#0a0f17', '#0f1620', '#05070a', 110);
      // rain window with city bokeh
      x.save(); x.beginPath(); x.rect(70, 200, 520, 760); x.clip(); const sk = x.createLinearGradient(0, 200, 0, 960); sk.addColorStop(0, '#0b1a2c'); sk.addColorStop(1, '#1b2836'); x.fillStyle = sk; x.fillRect(70, 200, 520, 760);
      for (let i = 0; i < 60; i++) { const bx = 70 + r() * 520, by = 520 + r() * 440, rr = 8 + r() * 30, warm = r() < .6; const g = x.createRadialGradient(bx, by, 0, bx, by, rr); g.addColorStop(0, warm ? 'rgba(255,190,120,.55)' : 'rgba(120,180,255,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(bx - rr, by - rr, rr * 2, rr * 2); }
      x.strokeStyle = 'rgba(170,200,230,.35)'; for (let i = 0; i < 140; i++) { const px = 70 + r() * 520, py = 200 + r() * 760, l = 6 + r() * 30; x.lineWidth = .8 + r() * 1.6; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 2, py + l); x.stroke(); }
      for (let i = 0; i < 70; i++) { const px = 70 + r() * 520, py = 200 + r() * 760, s = 2 + r() * 5; x.fillStyle = 'rgba(200,225,255,.4)'; x.beginPath(); x.ellipse(px, py, s * .7, s, 0, 0, 7); x.fill(); }
      x.restore(); x.fillStyle = '#030406'; x.fillRect(60, 190, 540, 18); x.fillRect(60, 950, 540, 22); x.fillRect(60, 190, 18, 780); x.fillRect(582, 190, 18, 780); x.fillRect(320, 190, 14, 780); x.fillRect(60, 560, 540, 12);
      x.save(); x.globalCompositeOperation = 'screen'; const sp = x.createLinearGradient(0, 960, 0, 1700); sp.addColorStop(0, 'rgba(110,150,200,.22)'); sp.addColorStop(1, 'rgba(110,150,200,0)'); x.fillStyle = sp; x.beginPath(); x.moveTo(70, 970); x.lineTo(600, 970); x.lineTo(1000, 1700); x.lineTo(200, 1700); x.fill(); x.restore(); });
    const SB = [E(640, 740, 150, 180, -.08), Q([[495, 760], [455, 812], [500, 826]]), Q([[490, 690], [500, 520, 760, 500, 800, 640], [810, 780], [760, 700, 610, 640, 500, 720]]),
      Q([[575, 900], [575, 1060], [735, 1060], [735, 890]]), Q([[60, 1920], [80, 1300, 240, 1080, 520, 1040], [760, 1030, 1000, 1100, 1060, 1400], [1080, 1920]])];
    st.B = await L((c, x) => { const m = fig(x, SB, 16, 8, 'rgba(160,200,240,1)', ['#2b3440', '#141820', '#050608', 480, 600, 900, 1500], .9);
      foldLines(x, m, W, H, [[300, 1250, 260, 1600], [820, 1200, 880, 1600], [560, 1100, 600, 1300]], .2);
      x.strokeStyle = 'rgba(255,190,150,.75)'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(512, 700); x.lineTo(590, 728); x.stroke(); // brow, knitted down
      x.fillStyle = 'rgba(235,245,255,.95)'; x.beginPath(); x.ellipse(548, 752, 9, 4, -.2, 0, 7); x.fill();
      x.strokeStyle = 'rgba(255,190,150,.45)'; x.lineWidth = 4; x.beginPath(); x.moveTo(520, 905); x.quadraticCurveTo(545, 895, 568, 908); x.stroke(); });
    st.shield = await L((c, x) => { const cx = 560, cy = 1390, R = 330; x.save(); x.shadowColor = 'rgba(0,0,0,.9)'; x.shadowBlur = 50; x.shadowOffsetY = 30;
      const g = x.createRadialGradient(cx - 120, cy - 140, 20, cx, cy, R); g.addColorStop(0, '#5a4734'); g.addColorStop(.6, '#231a14'); g.addColorStop(1, '#0b0806'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill(); x.restore();
      for (const [rr, a] of [[R - 18, .9], [R - 90, .45], [R - 180, .35]]) { x.strokeStyle = `rgba(255,214,150,${a * .6})`; x.lineWidth = 5; x.beginPath(); x.arc(cx, cy, rr, Math.PI * .95, Math.PI * 1.75); x.stroke(); x.strokeStyle = 'rgba(0,0,0,.6)'; x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * .9); x.stroke(); }
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28; x.fillStyle = 'rgba(255,220,170,.7)'; x.beginPath(); x.arc(cx + Math.cos(a) * (R - 40), cy + Math.sin(a) * (R - 40), 6, 0, 7); x.fill(); }
      x.font = '900 230px NSerif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(0,0,0,.55)'; x.fillText('怒', cx + 5, cy + 8); x.fillStyle = 'rgba(255,200,150,.28)'; x.fillText('怒', cx, cy); });
    st.heat = await L((c, x) => { const cx = 560, cy = 1390, R = 330; x.beginPath(); x.arc(cx, cy, R - 6, 0, 7); x.clip(); const g = x.createLinearGradient(0, cy + R, 0, cy - R); g.addColorStop(0, 'rgba(255,60,30,.85)'); g.addColorStop(.7, 'rgba(255,90,40,.55)'); g.addColorStop(1, 'rgba(255,170,90,.7)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'destination-out'; x.font = '900 230px NSerif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.globalAlpha = .5; x.fillText('怒', cx, cy); });
    const tx = ['最近太忙', '你也有错', '我压力大', '手滑了', '谁都会犯错'];
    st.spears = tx.map(t => sprite(620, 120, (x) => { x.translate(0, 60); x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowBlur = 14; x.shadowOffsetY = 8; const g = x.createLinearGradient(0, -26, 0, 26); g.addColorStop(0, '#f6e6c4'); g.addColorStop(1, '#b8965e'); x.fillStyle = g; x.fillRect(20, -26, 430, 52); x.shadowColor = 'transparent';
      x.fillStyle = 'rgba(40,20,10,.92)'; x.font = '38px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 235, 2);
      x.fillStyle = '#1a120c'; x.beginPath(); x.moveTo(450, -30); x.lineTo(600, 0); x.lineTo(450, 30); x.fill(); x.strokeStyle = 'rgba(255,230,190,.9)'; x.lineWidth = 2; x.stroke();
      x.globalCompositeOperation = 'screen'; for (let i = 0; i < 4; i++) { const f = x.createRadialGradient(560 - i * 40, 0, 2, 560 - i * 40, 0, 70 - i * 8); f.addColorStop(0, 'rgba(255,240,180,.9)'); f.addColorStop(.4, 'rgba(255,120,40,.6)'); f.addColorStop(1, 'rgba(255,60,20,0)'); x.fillStyle = f; x.fillRect(400, -60, 220, 120); } }));
    return st; },
  frame(ctx, lt, st, K) { const hitT = [.08, .24, .40, .56, .72], P = [[330, 1310, -.32], [400, 1200, -.18], [345, 1470, -.42], [470, 1290, -.25], [420, 1560, -.5]];
    const [sx, sy] = shake(lt, hitT, 18, .06); const sdy = 260 * (1 - ease(seg(lt, 0, .7))); const nHit = hitT.filter(h => lt > h).length;
    ctx.save(); cam(ctx, 1.04 + .03 * lt, 560, 1000, sx, sy); lay(ctx, st.back); lay(ctx, st.B, { dy: -10 * ease(lt), dx: 8 * ease(lt) });
    lay(ctx, st.shield, { dy: sdy }); const heat = clamp(.1 + nHit * .18 + .08 * seg(lt, .72, 1)); const top = 1390 + 330 - 660 * heat;
    ctx.save(); ctx.beginPath(); ctx.rect(0, top + sdy, W, H); ctx.clip(); lay(ctx, st.heat, { dy: sdy, a: .75 + .25 * Math.sin(K.t * 30) ** 2, op: 'screen' }); ctx.restore();
    st.spears.forEach((cv, i) => { const h = hitT[i], [hx, hy, a] = P[i]; if (lt < h - .12) return; const k = seg(lt, h - .12, h); const back = (1 - ein(k)) * 1100; const y = hy + (lt >= h ? sdy : 260 * (1 - ease(seg(h, 0, .7))));
      ctx.save(); ctx.translate(hx - Math.cos(a) * back + Math.cos(a) * 40, y - Math.sin(a) * back + Math.sin(a) * 40); ctx.rotate(a + (lt > h ? Math.sin((lt - h) * 60) * .04 * Math.exp(-(lt - h) * 12) : 0)); ctx.drawImage(cv, -600, -60); ctx.restore(); sparks(ctx, hx, y, (lt - h) * 4, 40, i + 5, '255,150,90'); });
    ctx.restore(); } };

// ══ S3 · hall mechanism — 护的是形象，不是关系 ══
const S3 = { id: 'S3-hall-mechanism', loc: 'hall (arched window, backlit door)', t0: T[2], t1: T[3], cap: [['护的是', 0], ['形象', 'R'], ['，不是关系', 0]],
  async build() { return { back: await S('mid', 'back'), R: await S('mid', 'plaqR'), Lq: await S('mid', 'plaqL'), sp: await S('mid', 'spark'), card: await S('mid', 'card'), A: await S('mid', 'A') }; },
  frame(ctx, lt, st, K) { const hit = .3; const [sx, sy] = shake(lt, [hit, .85], 20, .07); const rec = lt > hit ? Math.exp(-(lt - hit) * 7) * Math.sin((lt - hit) * 30) : 0;
    ctx.save(); cam(ctx, 1.03 + .04 * ease(lt), 560, 1000, sx, sy); lay(ctx, st.back);
    lay(ctx, st.R, { dx: lt > hit ? 70 * rec + 30 : 0, rot: lt > hit ? .06 * rec + .03 : 0, px: 770, py: 1000 });
    lay(ctx, st.Lq, { dx: -560 * (1 - ein(seg(lt, 0, hit))), rot: -.1 * (1 - seg(lt, 0, hit)), px: 380, py: 950 });
    if (lt > hit) lay(ctx, st.sp, { s: .5 + .8 * eout(seg(lt, hit, .75)), px: 590, py: 960, a: 1 - seg(lt, .55, .85) });
    if (lt > .5) lay(ctx, st.card, { dy: -560 * (1 - back(seg(lt, .55, .85))), rot: .1 * (1 - seg(lt, .55, .85)), s: 1.35, px: 806, py: 430, a: seg(lt, .5, .56) });
    lay(ctx, st.A, { dx: 10 * ein(seg(lt, 0, hit)) - 8 * rec, px: 260, py: 1700 }); motesF(ctx, K.t, 120, 80, 1000, 320, 1400, KEY, 9); ctx.restore(); } };

// ══ S4 · split corridor — 堆原因挡脸 | 只留「是我的错」 ══
const AB = ox => [E(250 + ox, 860, 95, 115, .1), Q([[338 + ox, 862], [372 + ox, 904], [336 + ox, 914]]), Q([[160 + ox, 830], [175 + ox, 720, 300 + ox, 700, 345 + ox, 800], [300 + ox, 770, 220 + ox, 785, 170 + ox, 860]]),
  Q([[200 + ox, 960], [205 + ox, 1070], [300 + ox, 1070], [296 + ox, 960]]), Q([[0 + ox, 1920], [0 + ox, 1300, 60 + ox, 1110, 220 + ox, 1066], [380 + ox, 1050, 500 + ox, 1150, 520 + ox, 1350], [530 + ox, 1920]])];
const S4 = { id: 'S4-split-corridor', loc: 'split corridor (brick | bare wall)', t0: T[3], t1: T[4], cap: [['堆原因', 'R'], ['挡脸｜只留', 0], ['是我的错', 'G']],
  async build() { const r = rng(44); const st = {};
    st.back = await L((c, x) => { wallBase(x, W, H, '#140b0b', '#1a0f0e', '#070404', 80);
      x.save(); x.beginPath(); x.rect(0, 0, 540, H); x.clip(); for (let row = 0; row < 40; row++) for (let col = -1; col < 6; col++) { const bx = col * 120 + (row % 2) * 60, by = row * 50; const v = 40 + r() * 30 | 0; x.fillStyle = `rgb(${v + 30},${v * .45 | 0},${v * .35 | 0})`; x.fillRect(bx + 3, by + 3, 114, 44); }
      x.globalCompositeOperation = 'multiply'; const dk = x.createRadialGradient(150, 250, 50, 200, 700, 1300); dk.addColorStop(0, '#ff9a80'); dk.addColorStop(.5, '#6a2a24'); dk.addColorStop(1, '#0a0303'); x.fillStyle = dk; x.fillRect(0, 0, 540, H); x.restore();
      x.save(); x.beginPath(); x.rect(540, 0, 540, H); x.clip(); const wg = x.createLinearGradient(540, 0, 1080, 0); wg.addColorStop(0, '#2b2219'); wg.addColorStop(1, '#17120d'); x.fillStyle = wg; x.fillRect(540, 0, 540, H);
      x.globalCompositeOperation = 'screen'; const wl = x.createRadialGradient(860, 300, 20, 860, 500, 900); wl.addColorStop(0, KEY + '.6)'); wl.addColorStop(1, KEY + '0)'); x.fillStyle = wl; x.fillRect(540, 0, 540, H); x.restore();
      x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(14px)'; x.fillStyle = 'rgba(255,235,200,.7)'; x.fillRect(532, 0, 16, H); x.filter = 'none'; x.fillStyle = 'rgba(255,248,230,.95)'; x.fillRect(538, 0, 4, H); x.restore(); });
    st.AL = await L((c, x) => { x.beginPath(); x.rect(0, 0, 536, H); x.clip(); fig(x, AB(0), -12, 8, 'rgba(255,110,90,1)', ['#3a1d18', '#160c0a', '#040202', 300, 800, 100, 1600], .9); });
    st.AR = await L((c, x) => { x.beginPath(); x.rect(544, 0, 536, H); x.clip(); const m = fig(x, AB(540), -12, 8, 'rgba(255,220,160,1)', ['#4a3a2a', '#1b1610', '#050403', 840, 800, 640, 1600], .9);
      x.fillStyle = 'rgba(255,240,210,.9)'; x.beginPath(); x.ellipse(842, 850, 7, 3, -.1, 0, 7); x.fill(); });
    st.gold = await L((c, x) => { goldPlaque(x, 810, 1300, 440, 170, 92, -.03); [[600, 1330], [1015, 1320]].forEach(([hx, hy]) => { x.fillStyle = '#120d09'; x.beginPath(); x.ellipse(hx, hy, 46, 34, .3, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,214,150,.8)'; x.lineWidth = 3; x.beginPath(); x.ellipse(hx, hy, 46, 34, .3, 3.6, 5.6); x.stroke(); }); });
    st.sl = SLIPS.map(t => slipCv(t, { edge: 'rgba(255,90,74,.65)', glow: .9 })); st.wall = []; for (let row = 0; row < 13; row++) for (let col = 0; col < 3; col++) st.wall.push([95 + col * 172 + (row % 2) * 20 - 10, 1560 - row * 64, (r() - .5) * .12]);
    st.peel = []; for (let i = 0; i < 12; i++) st.peel.push([600 + (i % 3) * 165 + 70, 820 + Math.floor(i / 3) * 120 + r() * 30, (r() - .5) * .2, r()]); return st; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.02 + .02 * lt, 540, 960); lay(ctx, st.back); lay(ctx, st.AL, { dy: 6 * Math.sin(lt * 20) });
    let nL = 0; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 536, H); ctx.clip(); st.wall.forEach(([x, y, a], i) => { const ti = .02 + i / st.wall.length * .72; if (lt < ti) return; nL++; const k = eout(seg(lt, ti, ti + .07)); blit(ctx, st.sl[i % 8], x, y - 70 * (1 - k), a + (1 - k) * .4, .95, k); }); ctx.restore();
    lay(ctx, st.AR); let nR = 0; ctx.save(); ctx.beginPath(); ctx.rect(544, 0, 536, H); ctx.clip(); st.peel.forEach(([x, y, a, q], i) => { const ti = .06 + i * .032; const d = Math.max(0, lt - ti) / .3; if (d < 1) nR++; if (d >= 1) return; blit(ctx, st.sl[(i + 3) % 8], x + d * 60 * (q - .5), y + d * d * 900, a + d * (q - .5) * 4, .9, 1 - seg(d, .7, 1)); }); ctx.restore();
    if (lt > .38) lay(ctx, st.gold, { dy: 300 * (1 - back(seg(lt, .4, .68))), a: seg(lt, .38, .45) });
    chalk(ctx, 270, 230, Math.min(9, Math.ceil(nL * 9 / 39)), 1, 46); chalk(ctx, 810, 230, Math.ceil(nR * 9 / 12), 1, 46);
    motesF(ctx, K.t, 70, 560, 1060, 200, 1500, KEY, 4); motesF(ctx, K.t, 50, 20, 520, 200, 1500, 'rgba(255,120,90,', 5); ctx.restore(); } };

// ══ S5 · green door — 她问了，再补事实 ══
const S5 = { id: 'S5-green-door', loc: 'hallway green door', t0: T[4], t1: T[5], cap: [['她问了，再补', 0], ['事实', 'B']], sub: '非永远不许解释',
  async build() { const st = {}; const DX0 = 220, DX1 = 860, DY0 = 360, DY1 = 1660;
    st.back = await L((c, x) => { wallBase(x, W, H, '#0b0f0e', '#111816', '#050706', 100); const fl = x.createLinearGradient(0, 1660, 0, H); fl.addColorStop(0, '#18140f'); fl.addColorStop(1, '#050403'); x.fillStyle = fl; x.fillRect(0, 1660, W, H - 1660);
      x.fillStyle = '#050605'; x.fillRect(DX0 - 30, DY0 - 30, DX1 - DX0 + 60, DY1 - DY0 + 30); x.strokeStyle = 'rgba(255,214,150,.35)'; x.lineWidth = 3; x.strokeRect(DX0 - 30, DY0 - 30, DX1 - DX0 + 60, DY1 - DY0 + 30);
      coneLight(x, W, H, 540, 120, 50, 160, 920, 1700, .35); lampShade(x, 540, 90, .7); });
    st.glow = await L((c, x) => { const g = x.createRadialGradient(560, 1000, 30, 560, 1000, 760); g.addColorStop(0, '#e9fff0'); g.addColorStop(.25, '#8fe0b0'); g.addColorStop(1, '#0f3a2a'); x.fillStyle = g; x.fillRect(DX0, DY0, DX1 - DX0, DY1 - DY0);
      x.globalCompositeOperation = 'screen'; x.filter = 'blur(40px)'; x.fillStyle = 'rgba(140,240,180,.45)'; x.beginPath(); x.moveTo(DX0, DY1); x.lineTo(DX1, DY1); x.lineTo(1080, H); x.lineTo(0, H); x.fill(); x.filter = 'none'; });
    st.door = await L((c, x) => { x.save(); x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowBlur = 30; const g = x.createLinearGradient(DX0, DY0, DX1, DY1); g.addColorStop(0, '#2c5a40'); g.addColorStop(.5, '#17331f'); g.addColorStop(1, '#08150d'); x.fillStyle = g; x.fillRect(DX0, DY0, DX1 - DX0, DY1 - DY0); x.restore();
      [[260, 400, 560, 560], [600, 400, 820, 560], [260, 1080, 560, 1620], [600, 1080, 820, 1620]].forEach(([a, b, e, f]) => { x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 8; x.strokeRect(a, b, e - a, f - b); x.strokeStyle = 'rgba(255,214,150,.3)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(a, f); x.lineTo(a, b); x.lineTo(e, b); x.stroke(); });
      x.strokeStyle = 'rgba(255,220,170,.55)'; x.lineWidth = 3; x.beginPath(); x.moveTo(DX0, DY0); x.lineTo(DX1, DY0); x.stroke();
      const pg = x.createLinearGradient(330, 610, 750, 730); pg.addColorStop(0, '#d9efd9'); pg.addColorStop(1, '#8fb89a'); x.save(); x.translate(540, 680); x.rotate(-.02); x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 20; x.fillStyle = pg; x.fillRect(-210, -72, 420, 144); x.shadowColor = 'transparent';
      x.strokeStyle = '#1e4a30'; x.lineWidth = 4; x.strokeRect(-198, -60, 396, 120); x.font = '900 80px NSerif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#12301e'; x.fillText('对方问了', 0, 4); x.restore();
      x.fillStyle = '#c8a050'; x.beginPath(); x.arc(290, 1000, 20, 0, 7); x.fill(); x.fillStyle = '#3a2a10'; x.fillRect(250, 960, 70, 14); });
    st.lockBody = sprite(140, 200, x => { const g = x.createLinearGradient(20, 70, 120, 190); g.addColorStop(0, '#f2d38a'); g.addColorStop(1, '#6a4a14'); x.fillStyle = g; x.fillRect(20, 80, 100, 110); x.strokeStyle = 'rgba(255,248,220,.9)'; x.lineWidth = 2; x.strokeRect(20, 80, 100, 110); x.fillStyle = '#1a1206'; x.beginPath(); x.arc(70, 125, 10, 0, 7); x.fill(); x.fillRect(66, 128, 8, 30); });
    st.shackle = sprite(140, 120, x => { x.strokeStyle = '#b9bcc0'; x.lineWidth = 14; x.beginPath(); x.moveTo(38, 110); x.lineTo(38, 60); x.arc(70, 60, 32, Math.PI, 0); x.lineTo(102, 110); x.stroke(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.beginPath(); x.arc(70, 60, 36, Math.PI * 1.1, Math.PI * 1.6); x.stroke(); });
    st.red = slipCv('抢先解释', { w: 300, h: 92, fs: 62, edge: 'rgba(255,70,50,.95)' }); st.fact = slipCv('事实：晚到40分钟', { w: 420, h: 92, fs: 54, edge: 'rgba(95,208,224,.95)' });
    st.A = await L((c, x) => { fig(x, [E(250, 1500, 110, 130), Q([[150, 1470], [170, 1350, 330, 1340, 352, 1470], [360, 1560], [140, 1560]]), Q([[190, 1600], [190, 1680], [310, 1680], [310, 1600]]), Q([[-80, 1920], [-60, 1720, 60, 1650, 200, 1650], [330, 1650, 470, 1700, 500, 1920]])], -12, 10, 'rgba(170,255,200,1)', ['#24302a', '#0e1210', '#030403', 300, 1400, 100, 1900], .9); });
    return st; },
  frame(ctx, lt, st, K) { const op = ease(seg(lt, .32, .62)); const [sx, sy] = shake(lt, [.15, .3], 12, .05);
    ctx.save(); cam(ctx, 1.02 + .04 * ease(lt), 540, 1000, sx, sy); lay(ctx, st.back); lay(ctx, st.glow, { a: .15 + .85 * op });
    lay(ctx, st.door, { sx: 1 - .82 * op, sy: 1, px: 860, py: 1000 }); if (op > 0) { ctx.save(); ctx.globalAlpha = .5 * op; ctx.fillStyle = '#000'; ctx.fillRect(860 - 640 * (1 - .82 * op), 360, 640 * (1 - .82 * op), 1300); ctx.restore(); }
    // padlock: shackle pops at .3, lock drops
    const pop = seg(lt, .28, .34), drop = ein(seg(lt, .34, .6)); const lx = 292, ly = 960 + drop * 760; if (lt < .62) { blit(ctx, st.shackle, lx + 15 * pop, ly - 70 - 26 * pop, pop * .5 + drop * 2, 1, 1); blit(ctx, st.lockBody, lx, ly + 5, drop * 2.5, 1, 1); }
    // red 抢先解释: X slashed, falls away
    const fall = seg(lt, .3, .52); blit(ctx, st.red, 600 + fall * 120, 1210 + ein(fall) * 700, -.06 + fall * 1.4, 1.4, 1 - seg(fall, .7, 1));
    if (lt < .52) { ctx.save(); ctx.translate(600 + fall * 120, 1210 + ein(fall) * 700); ctx.rotate(-.06 + fall * 1.4); ctx.scale(1.4, 1.4); ctx.strokeStyle = 'rgba(255,70,50,.95)'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,60,40,.8)'; ctx.shadowBlur = 20;
      const a1 = seg(lt, .12, .2), a2 = seg(lt, .2, .28); ctx.beginPath(); ctx.moveTo(-170, -60); ctx.lineTo(-170 + 340 * a1, -60 + 120 * a1); ctx.stroke(); if (a2 > 0) { ctx.beginPath(); ctx.moveTo(170, -60); ctx.lineTo(170 - 340 * a2, -60 + 120 * a2); ctx.stroke(); } ctx.restore(); }
    if (lt > .5) { const k = eout(seg(lt, .55, .88)); blit(ctx, st.fact, -300 + 860 * k, 1000 + 140 * (1 - k), .3 * (1 - k) - .03, 1.2 + .15 * k, seg(lt, .5, .56)); if (lt > .86) sparks(ctx, 560, 1000, (lt - .86) * 6, 30, 3, '120,230,240'); }
    lay(ctx, st.A, { dy: 8 * Math.sin(lt * 9) }); motesF(ctx, K.t, 80, 240, 860, 400, 1600, 'rgba(170,255,200,', 6); ctx.restore(); } };

// ══ S6 · rain street — 解释越多，诚意越薄 ══
const S6 = { id: 'S6-rain-street', loc: 'night rain street', t0: T[5], t1: T[6], cap: [['解释越多', 'R'], ['，诚意越薄', 0]],
  async build() { const st = {}; const r = rng(66);
    st.back = await L((c, x) => { const sk = x.createLinearGradient(0, 0, 0, 1300); sk.addColorStop(0, '#05080d'); sk.addColorStop(1, '#141c26'); x.fillStyle = sk; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) { const bx = i * 130 - 40, bw = 110 + r() * 60, bh = 400 + r() * 520; x.fillStyle = `rgb(${8 + i % 3 * 3},${11 + i % 3 * 3},${16 + i % 3 * 4})`; x.fillRect(bx, 1300 - bh, bw, bh);
        for (let wy = 1300 - bh + 30; wy < 1260; wy += 46) for (let wx = bx + 14; wx < bx + bw - 20; wx += 34) if (r() < .22) { x.fillStyle = r() < .7 ? 'rgba(255,200,130,.7)' : 'rgba(150,200,255,.6)'; x.fillRect(wx, wy, 14, 20); } }
      x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(30px)'; x.fillStyle = 'rgba(120,150,190,.35)'; x.fillRect(0, 1000, W, 360); x.filter = 'none'; x.restore();
      const gd = x.createLinearGradient(0, 1300, 0, H); gd.addColorStop(0, '#10161e'); gd.addColorStop(1, '#040507'); x.fillStyle = gd; x.fillRect(0, 1300, W, H - 1300);
      x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(8px)'; for (let i = 0; i < 70; i++) { const px = r() * W, l = 60 + r() * 380; x.fillStyle = r() < .7 ? `rgba(255,200,130,${.1 + r() * .2})` : `rgba(140,190,255,${.1 + r() * .2})`; x.fillRect(px, 1310, 6 + r() * 10, l); } x.filter = 'none';
      const lr = x.createLinearGradient(0, 1300, 0, 1920); lr.addColorStop(0, KEY + '.55)'); lr.addColorStop(1, KEY + '0)'); x.fillStyle = lr; x.fillRect(790, 1300, 70, 620); x.restore();
      x.fillStyle = '#030303'; x.fillRect(812, 260, 14, 1050); x.fillRect(780, 250, 90, 22); coneLight(x, W, H, 826, 290, 30, 520, 1080, 1500, .5); lampShade(x, 826, 250, .55);
      x.save(); x.globalCompositeOperation = 'screen'; [[300, 1800, 260, 40], [620, 1760, 200, 30], [470, 1870, 320, 36]].forEach(([px, py, rx, ry]) => { const pg = x.createRadialGradient(px, py, 5, px, py, rx); pg.addColorStop(0, 'rgba(150,180,220,.35)'); pg.addColorStop(1, 'rgba(150,180,220,0)'); x.fillStyle = pg; x.beginPath(); x.ellipse(px, py, rx, ry, 0, 0, 7); x.fill(); }); x.restore(); });
    st.B = await L((c, x) => { x.fillStyle = '#020202'; x.beginPath(); x.ellipse(940, 1120, 18, 22, 0, 0, 7); x.fill(); x.beginPath(); x.moveTo(915, 1145); x.lineTo(965, 1145); x.lineTo(975, 1260); x.lineTo(962, 1330); x.lineTo(948, 1330); x.lineTo(940, 1270); x.lineTo(930, 1330); x.lineTo(916, 1330); x.lineTo(905, 1260); x.fill();
      x.beginPath(); x.moveTo(860, 1095); x.quadraticCurveTo(940, 1000, 1020, 1095); x.quadraticCurveTo(940, 1080, 860, 1095); x.fill(); x.strokeStyle = 'rgba(255,214,150,.75)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(862, 1094); x.quadraticCurveTo(940, 1002, 1018, 1094); x.stroke(); x.fillRect(939, 1060, 3, 70); });
    const SA = [E(420, 640, 64, 78, .08), Q([[478, 650], [500, 668], [476, 676]]), E(418, 578, 124, 22, -.05), Q([[350, 590], [350, 500, 380, 480, 430, 482], [490, 486, 494, 520, 492, 588]]), Q([[380, 700], [382, 760], [460, 760], [458, 700]]),
      Q([[240, 1760], [220, 1300, 250, 900, 330, 780], [400, 740, 480, 744, 520, 790], [610, 1000, 620, 1400, 610, 1760]]), Q([[300, 1760], [300, 1880], [380, 1880], [400, 1760]]), Q([[460, 1760], [470, 1880], [550, 1880], [560, 1760]])];
    st.A = await L((c, x) => { const m = fig(x, SA, -12, 8, 'rgba(255,220,160,1)', ['#3a2e24', '#15120f', '#040303', 560, 700, 260, 1700], .85); foldLines(x, m, W, H, [[330, 900, 300, 1300], [520, 900, 560, 1300], [420, 1300, 420, 1700]], .22);
      x.fillStyle = '#0b0907'; x.beginPath(); x.moveTo(300, 980); x.quadraticCurveTo(450, 1080, 600, 990); x.lineTo(600, 1050); x.quadraticCurveTo(450, 1140, 300, 1040); x.fill(); x.strokeStyle = 'rgba(255,214,150,.6)'; x.lineWidth = 3; x.beginPath(); x.moveTo(600, 990); x.quadraticCurveTo(450, 1080, 330, 1000); x.stroke(); });
    st.sl = SLIPS.map(t => slipCv(t)); st.drop = []; for (let i = 0; i < 12; i++) st.drop.push([.02 + i * .07, 380 + r() * 200, (r() - .5) * 1.5, 1720 + r() * 140, 200 + r() * 500]); return st; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.03 - .02 * lt, 500, 1100); lay(ctx, st.back); lay(ctx, st.B, { dx: 80 * lt, dy: Math.abs(Math.sin(lt * 20)) * -4 });
    // pile in arms shrinks
    const left = st.drop.filter(d => lt < d[0]).length; for (let i = 0; i < Math.ceil(left / 2); i++) blit(ctx, st.sl[i % 8], 450 + (i % 2) * 20, 980 - i * 18, (i % 3 - 1) * .12, .8);
    lay(ctx, st.A);
    st.drop.forEach(([t0, x0, sp, py, x1], i) => { if (lt < t0) return; const k = seg(lt, t0, t0 + .22); const x = x0 + (x1 - x0) * k, y = 1000 + (py - 1000) * ein(k); const dis = seg(lt, t0 + .22, t0 + .4);
      if (dis < 1) blit(ctx, st.sl[i % 8], x, y, sp * k * 2, .85, 1 - dis); if (k >= 1) { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let j = 0; j < 3; j++) { const rk = seg(lt, t0 + .22 + j * .04, t0 + .5 + j * .04); if (rk <= 0 || rk >= 1) continue; ctx.strokeStyle = `rgba(200,220,255,${(1 - rk) * .7})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, py + 20, 20 + rk * 150, 4 + rk * 26, 0, 0, 7); ctx.stroke(); } ctx.restore(); } });
    const r = rng(5); ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 260; i++) { const bx = r() * 1300 - 100, by = r() * 2100, sp = 2600 + r() * 1400, l = 40 + r() * 60; const y = (by + K.t * sp) % 2100 - 100, x = bx - (y / 2100) * 120; ctx.strokeStyle = `rgba(190,210,240,${.15 + r() * .3})`; ctx.lineWidth = 1 + r() * 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + l); ctx.stroke(); } ctx.restore();
    ctx.restore(); } };

// ══ S7 · booth return — 只说一句：是我的错 ══
const S7 = { id: 'S7-booth-return', loc: 'booth (callback)', t0: T[6], t1: T[7], cap: [['只说一句：', 0], ['是我的错', 'G']],
  async build() { return { back: await S('reverse', 'back'), B: await S('reverse', 'B'), front: await S('reverse', 'front'), pl: await S('reverse', 'plaque'), ash: await S('reverse', 'ash'), A: await S('reverse', 'A') }; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.07 - .07 * ease(lt), 600, 1050); lay(ctx, st.back); chalk(ctx, 205, 455, 0, 1, 40);
    lay(ctx, st.B, { rot: -.03 * ease(seg(lt, .3, 1)), px: 840, py: 1180 }); lay(ctx, st.front);
    const k = back(seg(lt, 0, .35)); ctx.save(); ctx.globalCompositeOperation = 'screen'; const gl = ctx.createRadialGradient(675, 1088, 10, 675, 1088, 420); gl.addColorStop(0, `rgba(255,210,120,${.35 + .2 * Math.sin(lt * 9) ** 2})`); gl.addColorStop(1, 'rgba(255,210,120,0)'); ctx.fillStyle = gl; ctx.fillRect(255, 668, 840, 840); ctx.restore();
    lay(ctx, st.pl, { dy: -140 * (1 - k), a: seg(lt, 0, .06) }); lay(ctx, st.ash, { dy: 80 * lt, dx: 20 * Math.sin(lt * 5), a: 1 - .5 * lt }); lay(ctx, st.A, { dy: -8 * ease(lt), px: 300, py: 1700 });
    motesF(ctx, K.t, 120, 100, 1000, 480, 1260, KEY, 12); ctx.restore(); } };

// ══ S8 · table macro — 借口×0，关系才回得来 ══
const S8 = { id: 'S8-table-macro', loc: 'table close-up', t0: T[7], t1: T[8], cap: [['借口', 'R'], ['×0，关系才回得来', 0]], sub: '据 Schlenker · 简化模型',
  async build() { const st = {}; const r = rng(88);
    st.back = await L((c, x) => { const id = x.createImageData(W, H), d = id.data; for (let y = 0; y < H; y++) { const plank = Math.floor((y + 40) / 300), py = (y + 40) % 300; for (let xx = 0; xx < W; xx++) { const g = fbm(xx / 420 + plank * 7, y / 9, 3), k2 = fbm(xx / 60, y / 60 + plank, 2);
        const v = 46 + g * 50 + k2 * 14 - (py < 4 ? 30 : 0); const i = (y * W + xx) * 4; d[i] = v * 1.05; d[i + 1] = v * .72; d[i + 2] = v * .48; d[i + 3] = 255; } } x.putImageData(id, 0, 0);
      x.save(); x.globalCompositeOperation = 'multiply'; const pool = x.createRadialGradient(540, 950, 60, 540, 1000, 1100); pool.addColorStop(0, '#fff2d8'); pool.addColorStop(.45, '#9a7650'); pool.addColorStop(1, '#0c0806'); x.fillStyle = pool; x.fillRect(0, 0, W, H); x.restore();
      x.save(); x.translate(850, 1390); for (let i = 0; i < 5; i++) { x.fillStyle = i % 2 ? '#d9d1c2' : '#f6efe2'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 10; x.beginPath(); x.ellipse(0, -i * 9, 120 - i * 8, 26, 0, 0, 7); x.fill(); x.shadowColor = 'transparent'; x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 1.5; x.stroke(); }
      x.strokeStyle = 'rgba(60,40,20,.7)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-70, -40); x.lineTo(-20, -30); x.lineTo(20, -48); x.stroke(); x.restore();
      x.save(); x.translate(250, 1440); x.rotate(-.22); x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 16; x.shadowOffsetY = 8; x.fillStyle = '#e8dcc0'; x.fillRect(-130, -46, 260, 92); x.shadowColor = 'transparent'; x.strokeStyle = 'rgba(160,60,40,.7)'; x.lineWidth = 3; x.strokeRect(-120, -36, 240, 72);
      x.font = '56px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#2a160c'; x.fillText('借口×0', 0, 4); x.restore();
      for (let i = 0; i < 18; i++) { const ax = 120 + r() * 300, ay = 1560 + r() * 200, s = 8 + r() * 14; x.save(); x.translate(ax, ay); x.rotate(r() * 6); x.fillStyle = 'rgba(30,24,20,.85)'; x.beginPath(); x.moveTo(-s, 0); x.quadraticCurveTo(0, -s * .7, s, 0); x.quadraticCurveTo(0, s * .4, -s, 0); x.fill(); x.restore(); } });
    st.pl = await L((c, x) => goldPlaque(x, 540, 880, 780, 290, 156));
    const HE = [[400, 1130, 80, 52, .05], [490, 1100, 50, 15, .1], [503, 1128, 54, 16, .03], [497, 1156, 50, 15, -.04], [478, 1182, 40, 13, -.12], [440, 1084, 42, 15, -.55]];
    const SL = [[-120, 1050], [180, 1028], [310, 1068], [330, 1205], [180, 1245], [-120, 1270]];
    const mir = (e, m) => m ? [1140 - e[0], e[1] + 20, e[2], e[3], -e[4]] : e;
    const handL = (m, rimDx, rim, cl) => L((c, x) => { const sh = HE.map(e => E(...mir(e, m))); sh.push(Q([[m ? 840 : 300, 1092], [m ? 800 : 340, 1086], [m ? 790 : 350, 1192], [m ? 840 : 300, 1200]].map(([px, py]) => [px, py + (m ? 20 : 0)])));
      const mk = fig(x, sh, rimDx, 8, rim, ['#c8916a', '#7a4e34', '#2a1810', m ? 900 : 240, 1080, m ? 600 : 520, 1200], .75);
      foldLines(x, mk, W, H, HE.slice(1, 5).map(e => { const q = mir(e, m); return [q[0] - (m ? -30 : 30), q[1] - 2, q[0] + (m ? -30 : 30), q[1] + 2]; }), .3);
      const slv = SL.map(([px, py]) => [m ? 1140 - px : px, py + (m ? 20 : 0)]); const ms = fig(x, [Q(slv)], rimDx, 8, rim, m ? ['#2a3442', '#121820', '#040506', 900, 1050, 1100, 1300] : ['#4a3a2c', '#1d1712', '#060504', 300, 1050, 0, 1300], .8);
      foldLines(x, ms, W, H, (m ? [[1000, 1080, 980, 1250], [900, 1075, 890, 1240], [1080, 1090, 1060, 1260]] : [[140, 1060, 160, 1230], [240, 1060, 250, 1230], [40, 1065, 60, 1240]]), .3);
      x.save(); x.fillStyle = m ? '#cfd8e2' : '#efe4cf'; x.beginPath(); const c0 = m ? 1140 - 310 : 310, c1 = m ? 1140 - 330 : 330, dy = m ? 20 : 0; x.moveTo(c0, 1068 + dy); x.lineTo(c0 + (m ? -22 : 22), 1072 + dy); x.lineTo(c1 + (m ? -20 : 20), 1200 + dy); x.lineTo(c1, 1205 + dy); x.fill(); x.restore(); });
    st.hA = await handL(false, -10, 'rgba(255,225,175,1)'); st.hB = await handL(true, 10, 'rgba(255,225,175,1)');
    return st; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.0 + .06 * ease(lt), 540, 1050); lay(ctx, st.back); ctx.save(); ctx.globalCompositeOperation = 'screen'; const gl = ctx.createRadialGradient(540, 880, 40, 540, 880, 620); gl.addColorStop(0, `rgba(255,210,120,${.3 + .15 * Math.sin(lt * 7) ** 2})`); gl.addColorStop(1, 'rgba(255,210,120,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 300, W, 1200); ctx.restore();
    lay(ctx, st.pl); const a = eout(seg(lt, .02, .4)), b = eout(seg(lt, .3, .88)); lay(ctx, st.hA, { dx: -520 * (1 - a) }); lay(ctx, st.hB, { dx: 560 * (1 - b) });
    if (lt > .85) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(540, 1160, 5, 540, 1160, 200); g.addColorStop(0, `rgba(255,230,170,${.5 * seg(lt, .85, 1)})`); g.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = g; ctx.fillRect(340, 960, 400, 400); ctx.restore(); }
    motesF(ctx, K.t, 90, 60, 1020, 300, 1700, KEY, 14); ctx.restore(); } };

export const SHOTS = [S1, S2, S3, S4, S5, S6, S7, S8];
export const CAP = { font: '900 66px NSerif', y: 1650, base: '#f3ece0', shadow: 'rgba(0,0,0,.95)', halo: 'rgba(0,0,0,.55)', haloW: 10, marks: { R: '#ff5a4a', B: '#5fd0e0', G: '#f2c35a' },
  subFont: '600 34px NSans', subCol: 'rgba(230,240,240,.82)', subDy: 70,
  underline(ctx, x, y, w, col, k) { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.quadraticCurveTo(x + w / 2, y + 6, x + 4 + (w - 8) * k, y - 2); ctx.stroke(); ctx.restore(); } };
export async function ENV() { return { G: mkGrain(4, .55, 31) }; }
export function POST(ctx, lt, sh, K) { const fl = ctx.createLinearGradient(0, 1480, 0, H); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(1, 'rgba(0,0,0,.7)'); ctx.fillStyle = fl; ctx.fillRect(0, 1480, W, H - 1480);
  vignette(ctx, W, H, .55); grainOver(ctx, K.env.G, K.f, .32); caption(ctx, sh.cap, lt, CAP, sh.sub || null);
  if (lt < .05) { ctx.fillStyle = `rgba(255,245,225,${(1 - lt / .05) * .18})`; ctx.fillRect(0, 0, W, H); } }
