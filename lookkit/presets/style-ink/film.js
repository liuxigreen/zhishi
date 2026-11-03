// style-ink · apology-excuse-worse · densest v4 (10s, same 8-shot board as noir; only the look differs). Static layers cached per shot.
import * as N from './scene.js';
import { W, H, L, lay, cam, shake, seg, ease, eout, ein, back, clamp, mkGrain, grainOver, caption, vignette } from '../../core/filmkit.js';
import { rng, fbm, mkCanvas, SLIPS } from '../../core/util.js';
const { brush, sweepBrush, wash, pth, ell, circ, PAPER, paperBase, closed, rectPts, figure, inkSlip, seal, lantern, mountains, board } = N;
const SEED = 7;
const S = (beat, layer) => L(c => N[beat](c, { W, H, seed: SEED, layer }));
const sprite = (w, h, fn) => { const c = mkCanvas(w, h); fn(c.getContext('2d'), c); return c; };
const slipV = t => sprite(150, 270, x => inkSlip(x, 75, 135, 0, t, 1));
function slipH(t, { w = 300, h = 88, fs = 56, edge = '184,38,29' } = {}) { return sprite(w + 40, h + 40, x => { x.translate((w + 40) / 2, (h + 40) / 2); x.shadowColor = 'rgba(60,40,20,.3)'; x.shadowBlur = 12; x.shadowOffsetY = 6; x.fillStyle = '#f7efdc'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
  brush(x, rectPts(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 8), { w: 5, dry: .3, seed: t.length * 7, bristles: 8, color: edge, taper: [.02, .05] });
  x.fillStyle = 'rgba(18,16,14,.95)'; x.font = `${fs}px Brush`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 0, 3); }); }
function blit(ctx, cv, x, y, rot = 0, s = 1, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.drawImage(cv, -cv.width / 2, -cv.height / 2); ctx.restore(); }
function tally(ctx, x, y, n, fs = 46) { ctx.save(); ctx.font = `${fs}px Brush`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.strokeStyle = `rgba(${PAPER},.9)`; ctx.lineWidth = 8;
  ctx.strokeText('借口', x, y); ctx.fillStyle = 'rgba(18,16,14,.92)'; ctx.fillText('借口', x, y); ctx.font = `${fs * 1.3}px Brush`; ctx.strokeText('×' + n, x, y + fs * 1.25); ctx.fillStyle = n ? '#b8261d' : '#9a6a10'; ctx.fillText('×' + n, x, y + fs * 1.25); ctx.restore(); }
function splash(ctx, x, y, k, seed = 1, col = '16,14,12', n = 50, R = 220) { if (k <= 0) return; const r = rng(seed); const e = eout(clamp(k * 1.6)); ctx.save();
  for (let i = 0; i < n; i++) { const a = r() * 6.28, d = 20 + r() * r() * R, s = 1 + r() * r() * 12; ctx.fillStyle = `rgba(${col},${(.5 + r() * .5) * (1 - .5 * seg(k, .7, 1))})`; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * d * e, y + Math.sin(a) * d * e * .8, s, s * (.5 + r()), a, 0, 7); ctx.fill(); }
  ctx.fillStyle = `rgba(${col},${.8 * (1 - .4 * seg(k, .5, 1))})`; ctx.beginPath(); ctx.ellipse(x, y, 34 * e, 22 * e, .6, 0, 7); ctx.fill(); ctx.restore(); }
function flecks(ctx, t, n, x0, x1, y0, y1, col = '20,18,16', seed = 3) { const r = rng(seed); ctx.save(); for (let i = 0; i < n; i++) { const bx = x0 + r() * (x1 - x0), by = y0 + r() * (y1 - y0), sp = 15 + r() * 40, ph = r() * 6.28, s = .8 + r() * 2.2;
  const x = bx + Math.sin(t * 1.4 + ph) * 18, y = y0 + ((by - y0 + t * sp) % (y1 - y0)); ctx.fillStyle = `rgba(${col},${.18 + .3 * r()})`; ctx.beginPath(); ctx.ellipse(x, y, s * 1.6, s, ph + t, 0, 7); ctx.fill(); } ctx.restore(); }
function cinnabar(ctx, cx, cy, w, h, fs, rot = 0, seed = 900) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.shadowColor = 'rgba(184,38,29,.45)'; ctx.shadowBlur = 50; ctx.fillStyle = 'rgb(176,40,30)'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  for (let i = 0; i < 4; i++) brush(ctx, [[-w / 2 + 4, -h / 2 + h * (.15 + i * .22)], [w / 2 - 4, -h / 2 + h * (.17 + i * .22)]], { w: h * .26, dry: .85, seed: seed + i, ink: .35, color: '120,18,12', bristles: 16 });
  brush(ctx, rectPts(-w / 2, -h / 2, w, h, 10), { w: 9, dry: .3, seed: seed + 9, bristles: 12, color: '100,16,10', taper: [.02, .05] });
  ctx.font = `${fs}px Brush`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fbf3e3'; ctx.fillText('是我的错', 0, 4); ctx.restore(); }
const T = [0, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.6, 10.0];
const sealL = (ch, x = 930, y = 260) => L((c, x2) => seal(x2, rng(ch.charCodeAt(0)), x, y, ch, .8));

// ══ S1 · 席间 hook ══
const S1 = { id: 'S1-booth-hook', loc: 'booth', t0: T[0], t1: T[1], cap: [['以为', 0], ['讲清楚', 'R'], ['＝负责', 0]],
  async build() { const st = { back: await S('hook', 'back'), B: await S('hook', 'B'), front: await S('hook', 'front'), A: await S('hook', 'A'), seal: await sealL('歉') }; st.sl = SLIPS.slice(0, 6).map(slipV);
    st.streak = await L((c, x) => { [[[380, 980], [520, 860]], [[420, 900], [600, 760]], [[440, 1000], [640, 820]]].forEach((p, i) => brush(x, p, { w: 12, dry: .9, seed: 700 + i, ink: .5, bristles: 12 })); }); return st; },
  frame(ctx, lt, st, K) { const hits = st.sl.map((_, i) => .04 + i * .13 + .27); const [sx, sy] = shake(lt, hits, 12, .05);
    ctx.save(); cam(ctx, 1.02 + .05 * ease(lt), 560, 900, sx, sy); lay(ctx, st.back); const nIn = hits.filter(h => lt > h).length; tally(ctx, 150, 330, nIn, 44);
    lay(ctx, st.B, { rot: -.035 * ease(seg(lt, .2, 1)), dx: 26 * ease(seg(lt, .2, 1)), px: 860, py: 1180 }); lay(ctx, st.front); lay(ctx, st.streak, { a: .4 + .6 * Math.abs(Math.sin(lt * 18)) });
    lay(ctx, st.A, { dy: Math.sin(lt * 26) * 6, rot: .012 * Math.sin(lt * 26), px: 260, py: 1700 });
    st.sl.forEach((cv, i) => { const a = .04 + i * .13, k = seg(lt, a, a + .27); if (lt < a) return; const tx = 790 + (i % 3 - 1) * 60, ty = 700 + (i % 2) * 70 - 30;
      if (k < 1) { const e = ein(k); blit(ctx, cv, 470 + (tx - 470) * e, 990 + (ty - 990) * e - Math.sin(k * Math.PI) * 120, -1.9 + k * (1.6 + i * .2), .5 + .45 * e); }
      else { const d = (lt - a - .27) / .3; splash(ctx, tx, ty, d * 2, 20 + i, '16,14,12', 26, 110); blit(ctx, cv, tx + d * 40, ty + d * d * 420, .3 + d * 1.5 * (i % 2 ? 1 : -1), .95 - d * .2, 1 - seg(d, .6, 1)); } });
    lay(ctx, st.seal); ctx.restore(); } };

// ══ S2 · 她的房间 round window + bamboo; rattan shield ══
const S2 = { id: 'S2-B-room', loc: 'B-room (round window, bamboo)', t0: T[1], t1: T[2], cap: [['她听到的是', 0], ['推责', 'R']],
  async build() { const st = {}; const r = rng(21);
    st.back = await L((c, x) => { paperBase(x, W, H, 21); wash(x, pth([[0, 0], [1080, 0], [1080, 1920], [0, 1920]]), { tone: .06, blur: 20, edge: 0 });
      x.save(); x.beginPath(); x.ellipse(330, 560, 250, 250, 0, 0, 7); x.clip(); wash(x, ell(330, 560, 260, 260), { tone: .1, blur: 30, edge: 0, color: '60,80,70' });
      for (let i = 0; i < 4; i++) { const bx = 170 + i * 110; sweepBrush(x, [[bx, 900], [bx + 10, 560], [bx + 18, 220]], { w: 18 - i * 2, ink: .55 - i * .1, dry: .3, seed: 30 + i, bristles: 10 }); for (let j = 0; j < 6; j++) brush(x, [[bx + 10, 300 + j * 100], [bx + 10, 306 + j * 100]], { w: 22 - i * 3, seed: 40 + i * 9 + j, dry: .2, ink: .8, bristles: 8 }); }
      for (let i = 0; i < 26; i++) { const lx = 150 + r() * 380, ly = 330 + r() * 420, a = (r() - .5) * 1.8; brush(x, [[lx, ly], [lx + Math.cos(a) * 70, ly + Math.sin(a) * 70 + 20]], { w: 14, dry: .3, seed: 60 + i, ink: .5 + r() * .3, bristles: 10, taper: [.1, .7] }); }
      for (let i = 0; i < 80; i++) { const px = 90 + r() * 480, py = 320 + r() * 480; x.strokeStyle = 'rgba(40,50,60,.25)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px, py); x.lineTo(px - 6, py + 30 + r() * 30); x.stroke(); } x.restore();
      brush(x, circ(330, 560, 255, 255, -1.6, 4.7, 48), { w: 30, dry: .35, seed: 70, bristles: 26 }); brush(x, [[80, 560], [580, 560]], { w: 9, dry: .3, seed: 71, bristles: 8 }); brush(x, [[330, 310], [330, 810]], { w: 9, dry: .3, seed: 72, bristles: 8 }); });
    st.B = await L((c, x) => figure(x, { body: [[40, 1960], [70, 1320], [230, 1100], [560, 1050], [582, 920], [705, 920], [722, 1045], [980, 1110], [1050, 1400], [1080, 1960]], robe: .82, cw: 16, sweep: 90,
      head: [640, 750, 150, 180, -.08], hair: [[[480, 700], [500, 560], [640, 520], [780, 560], [800, 700], [770, 650], [700, 620], [600, 630], [520, 690]]],
      feats: [{ pts: [[495, 690], [545, 702], [598, 728]], w: 16 }, { pts: [[520, 762], [560, 758]], w: 10 }, { pts: [[480, 780], [450, 830], [488, 840]], w: 7 }, { pts: [[505, 905], [530, 896], [560, 905]], w: 8 }, { pts: [[690, 700], [740, 690]], w: 12 }],
      folds: [[[300, 1250], [260, 1600], [250, 1900]], [[820, 1200], [880, 1600], [900, 1900]]], seed: 220 }));
    st.shield = await L((c, x) => { const cx = 560, cy = 1390, R = 330; x.save(); x.shadowColor = 'rgba(60,40,20,.35)'; x.shadowBlur = 40; x.shadowOffsetY = 20; x.fillStyle = '#d8c39a'; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill(); x.restore();
      x.save(); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.clip(); for (let k = 0; k < 14; k++) brush(x, circ(cx, cy, R - 20 - k * 22, R - 20 - k * 22, k * .4, k * .4 + 5.8, 36), { w: 12, dry: .7, seed: 80 + k, ink: .45, color: '110,80,40', bristles: 12 }); x.restore();
      brush(x, circ(cx, cy, R, R, -1.6, 4.7, 56), { w: 22, dry: .35, seed: 99, bristles: 24 }); x.font = '220px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(30,20,12,.5)'; x.fillText('怒', cx, cy + 10); });
    st.heat = await L((c, x) => { x.beginPath(); x.arc(560, 1390, 326, 0, 7); x.clip(); wash(x, pth([[200, 1000], [920, 1000], [920, 1760], [200, 1760]]), { tone: .7, blur: 6, edge: .3, color: '184,38,29' }); });
    const tx = ['最近太忙', '你也有错', '我压力大', '手滑了', '谁都会犯错'];
    st.spears = tx.map((t, i) => sprite(620, 120, x => { x.translate(0, 60); x.fillStyle = '#f7efdc'; x.fillRect(150, -28, 300, 56); brush(x, rectPts(150, -28, 300, 56, 8), { w: 4, dry: .3, seed: 110 + i, bristles: 6, taper: [.02, .05] });
      x.fillStyle = 'rgba(18,16,14,.95)'; x.font = '42px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 300, 2);
      x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.moveTo(450, -30); x.lineTo(600, 0); x.lineTo(450, 30); x.fill();
      x.save(); x.globalCompositeOperation = 'multiply'; for (let k = 0; k < 3; k++) { const f = x.createRadialGradient(540 - k * 40, 0, 2, 540 - k * 40, 0, 60); f.addColorStop(0, 'rgba(184,38,29,.75)'); f.addColorStop(1, 'rgba(184,38,29,0)'); x.fillStyle = f; x.fillRect(420, -60, 200, 120); } x.restore(); }));
    st.seal = await sealL('责'); return st; },
  frame(ctx, lt, st, K) { const hitT = [.08, .24, .40, .56, .72], P = [[330, 1310, -.32], [400, 1200, -.18], [345, 1470, -.42], [470, 1290, -.25], [420, 1560, -.5]];
    const [sx, sy] = shake(lt, hitT, 18, .06); const sdy = 260 * (1 - ease(seg(lt, 0, .7))); const nHit = hitT.filter(h => lt > h).length;
    ctx.save(); cam(ctx, 1.04 + .03 * lt, 560, 1000, sx, sy); lay(ctx, st.back); lay(ctx, st.B, { dy: -10 * ease(lt), dx: 8 * ease(lt) }); lay(ctx, st.shield, { dy: sdy });
    const heat = clamp(.1 + nHit * .18 + .08 * seg(lt, .72, 1)); const top = 1390 + 330 - 660 * heat; ctx.save(); ctx.beginPath(); ctx.rect(0, top + sdy, W, H); ctx.clip(); lay(ctx, st.heat, { dy: sdy, a: .85, op: 'multiply' }); ctx.restore();
    st.spears.forEach((cv, i) => { const h = hitT[i], [hx, hy, a] = P[i]; if (lt < h - .12) return; const k = seg(lt, h - .12, h); const bk = (1 - ein(k)) * 1100; const y = hy + (lt >= h ? sdy : 260 * (1 - ease(seg(h, 0, .7))));
      if (lt > h) splash(ctx, hx, y, (lt - h) * 4, 40 + i, '184,38,29', 22, 90);
      ctx.save(); ctx.translate(hx - Math.cos(a) * bk + Math.cos(a) * 40, y - Math.sin(a) * bk + Math.sin(a) * 40); ctx.rotate(a + (lt > h ? Math.sin((lt - h) * 60) * .04 * Math.exp(-(lt - h) * 12) : 0)); ctx.drawImage(cv, -600, -60); ctx.restore(); });
    lay(ctx, st.seal); ctx.restore(); } };

// ══ S3 · 庭院 moon gate mechanism ══
const S3 = { id: 'S3-hall-mechanism', loc: 'courtyard moon gate', t0: T[2], t1: T[3], cap: [['护的是', 0], ['形象', 'R'], ['，不是关系', 0]],
  async build() { return { back: await S('mid', 'back'), R: await S('mid', 'plaqR'), Lq: await S('mid', 'plaqL'), sp: await S('mid', 'spark'), card: await S('mid', 'card'), A: await S('mid', 'A'), seal: await sealL('辩', 930, 1520) }; },
  frame(ctx, lt, st, K) { const hit = .3; const [sx, sy] = shake(lt, [hit, .85], 20, .07); const rec = lt > hit ? Math.exp(-(lt - hit) * 7) * Math.sin((lt - hit) * 30) : 0;
    ctx.save(); cam(ctx, 1.03 + .04 * ease(lt), 560, 1000, sx, sy); lay(ctx, st.back);
    lay(ctx, st.R, { dx: lt > hit ? 70 * rec + 30 : 0, rot: lt > hit ? .06 * rec + .03 : 0, px: 800, py: 1030 });
    lay(ctx, st.Lq, { dx: -560 * (1 - ein(seg(lt, 0, hit))), rot: -.1 * (1 - seg(lt, 0, hit)), px: 350, py: 945 });
    if (lt > hit) lay(ctx, st.sp, { s: .4 + .7 * eout(seg(lt, hit, .5)), px: 585, py: 965, a: 1 });
    if (lt > .5) lay(ctx, st.card, { dy: -560 * (1 - back(seg(lt, .55, .85))), rot: .1 * (1 - seg(lt, .55, .85)), s: 1.3, px: 790, py: 420, a: seg(lt, .5, .56) });
    lay(ctx, st.A, { dx: 10 * ein(seg(lt, 0, hit)) - 8 * rec, px: 260, py: 1700 }); lay(ctx, st.seal); ctx.restore(); } };

// ══ S4 · 两扇屏风 split ══
const AB = ox => ({ body: [[ox + 0, 1960], [ox + 10, 1320], [ox + 80, 1120], [ox + 200, 1072], [ox + 206, 960], [ox + 300, 960], [ox + 304, 1066], [ox + 400, 1070], [ox + 500, 1170], [ox + 520, 1360], [ox + 530, 1960]], robe: .85, cw: 14, sweep: 70,
  head: [ox + 255, 860, 92, 112, .1], hair: [[[ox + 165, 840], [ox + 180, 730], [ox + 300, 705], [ox + 345, 790], [ox + 300, 772], [ox + 230, 780], [ox + 178, 870]]],
  feats: [{ pts: [[ox + 300, 850], [ox + 330, 848]], w: 7 }, { pts: [[ox + 345, 868], [ox + 372, 900], [ox + 342, 910]], w: 6 }, { pts: [[ox + 300, 950], [ox + 328, 946]], w: 6 }], folds: [[[ox + 120, 1200], [ox + 100, 1600], [ox + 90, 1900]], [[ox + 400, 1200], [ox + 420, 1600], [ox + 430, 1900]]], seed: 400 + ox });
const S4 = { id: 'S4-split-corridor', loc: 'two folding screens (split)', t0: T[3], t1: T[4], cap: [['堆原因', 'R'], ['挡脸｜只留', 0], ['是我的错', 'G']],
  async build() { const r = rng(44); const st = {};
    st.back = await L((c, x) => { paperBase(x, W, H, 44); x.save(); x.beginPath(); x.rect(0, 0, 540, H); x.clip(); wash(x, pth([[0, 0], [540, 0], [540, 1920], [0, 1920]]), { tone: .32, blur: 10, edge: 0 });
      for (let i = 0; i < 3; i++) { brush(x, rectPts(14 + i * 176, 120, 160, 1600, 10), { w: 10, dry: .4, seed: 450 + i, bristles: 12, taper: [.02, .05] }); for (let k = 0; k < 4; k++) brush(x, [[30 + i * 176, 300 + k * 380], [160 + i * 176, 360 + k * 380]], { w: 30, dry: .9, seed: 460 + i * 9 + k, ink: .35, bristles: 14, color: '120,20,14' }); }
      wash(x, ell(120, 200, 220, 160), { tone: .4, blur: 30, edge: 0, color: '184,38,29' }); x.restore();
      x.save(); x.beginPath(); x.rect(540, 0, 540, H); x.clip(); for (let i = 0; i < 3; i++) brush(x, rectPts(556 + i * 176, 120, 160, 1600, 10), { w: 7, dry: .5, seed: 470 + i, bristles: 10, ink: .6, taper: [.02, .05] });
      x.globalCompositeOperation = 'screen'; const g = x.createRadialGradient(860, 300, 20, 860, 500, 900); g.addColorStop(0, 'rgba(255,230,180,.45)'); g.addColorStop(1, 'rgba(255,230,180,0)'); x.fillStyle = g; x.fillRect(540, 0, 540, H); x.restore();
      brush(x, [[540, 0], [536, 700], [542, 1300], [540, 1920]], { w: 26, dry: .25, seed: 480, bristles: 26, taper: [.02, .02] }); });
    st.AL = await L((c, x) => { x.beginPath(); x.rect(0, 0, 528, H); x.clip(); figure(x, AB(0)); }); st.AR = await L((c, x) => { x.beginPath(); x.rect(552, 0, 528, H); x.clip(); figure(x, { ...AB(540), seed: 980 }); });
    st.gold = await L((c, x) => { cinnabar(x, 810, 1300, 440, 170, 100, -.03, 910); [[598, 1330], [1018, 1320]].forEach(([hx, hy], i) => { x.fillStyle = `rgb(${PAPER})`; x.beginPath(); x.ellipse(hx, hy, 44, 32, .3, 0, 7); x.fill(); brush(x, circ(hx, hy, 44, 32, 0, 6.3, 18), { w: 6, dry: .2, seed: 920 + i, bristles: 8 }); }); });
    st.sl = SLIPS.map(slipV); st.wall = []; for (let row = 0; row < 7; row++) for (let col = 0; col < 5; col++) st.wall.push([60 + col * 102 + (row % 2) * 16, 1560 - row * 125, (r() - .5) * .1]);
    st.peel = []; for (let i = 0; i < 12; i++) st.peel.push([610 + (i % 4) * 120, 820 + Math.floor(i / 4) * 200 + r() * 30, (r() - .5) * .2, r()]); st.seal = await sealL('挡', 960, 1500); return st; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.02 + .02 * lt, 540, 960); lay(ctx, st.back); lay(ctx, st.AL, { dy: 6 * Math.sin(lt * 20) });
    let nL = 0; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 528, H); ctx.clip(); st.wall.forEach(([x, y, a], i) => { const ti = .02 + i / st.wall.length * .72; if (lt < ti) return; nL++; const k = eout(seg(lt, ti, ti + .07)); blit(ctx, st.sl[i % 8], x, y - 70 * (1 - k), a + (1 - k) * .4, .82, k); }); ctx.restore();
    lay(ctx, st.AR); let nR = 0; ctx.save(); ctx.beginPath(); ctx.rect(552, 0, 528, H); ctx.clip(); st.peel.forEach(([x, y, a, q], i) => { const ti = .06 + i * .032; const d = Math.max(0, lt - ti) / .3; if (d < 1) nR++; if (d >= 1) return; blit(ctx, st.sl[(i + 3) % 8], x + d * 60 * (q - .5), y + d * d * 900, a + d * (q - .5) * 4, .8, 1 - seg(d, .7, 1)); }); ctx.restore();
    if (lt > .38) lay(ctx, st.gold, { dy: 300 * (1 - back(seg(lt, .4, .68))), a: seg(lt, .38, .45) });
    tally(ctx, 270, 230, Math.min(9, Math.ceil(nL * 9 / 35)), 48); tally(ctx, 810, 230, Math.ceil(nR * 9 / 12), 48); lay(ctx, st.seal); ctx.restore(); } };

// ══ S5 · 青门 jade-green courtyard door ══
const S5 = { id: 'S5-green-door', loc: 'jade-green courtyard door', t0: T[4], t1: T[5], cap: [['她问了，再补', 0], ['事实', 'B']], sub: '非永远不许解释',
  async build() { const st = {}; const DX0 = 220, DX1 = 860, DY0 = 360, DY1 = 1660;
    st.back = await L((c, x) => { paperBase(x, W, H, 55); wash(x, pth([[0, 1660], [1080, 1660], [1080, 1920], [0, 1920]]), { tone: .25, blur: 10, edge: .05 });
      brush(x, [[60, 260], [540, 230], [1020, 260]], { w: 40, dry: .4, seed: 501, bristles: 34 }); for (let i = 0; i < 8; i++) brush(x, [[60 + i * 125, 300], [150 + i * 125, 290]], { w: 16, dry: .7, seed: 510 + i, ink: .7, bristles: 12 });
      brush(x, [[DX0 - 34, DY1], [DX0 - 30, DY0 - 40], [DX1 + 30, DY0 - 40], [DX1 + 34, DY1]], { w: 26, dry: .3, seed: 520, bristles: 26, taper: [.02, .05] }); lantern(x, 980, 520, .3, 61); });
    st.glow = await L((c, x) => { x.fillStyle = '#f8f4e6'; x.fillRect(DX0, DY0, DX1 - DX0, DY1 - DY0); wash(x, pth([[DX0, DY0], [DX1, DY0], [DX1, DY1], [DX0, DY1]]), { tone: .22, blur: 30, edge: 0, color: '60,140,100' });
      wash(x, pth([[DX0, 1100], [380, 980], [560, 1060], [720, 960], [DX1, 1080], [DX1, 1300], [DX0, 1300]]), { tone: .12, blur: 16, edge: .05 });
      x.save(); x.globalCompositeOperation = 'screen'; const g = x.createRadialGradient(560, 1000, 20, 560, 1000, 520); g.addColorStop(0, 'rgba(255,255,240,.9)'); g.addColorStop(1, 'rgba(255,255,240,0)'); x.fillStyle = g; x.fillRect(DX0, DY0, DX1 - DX0, DY1 - DY0); x.restore(); });
    st.door = await L((c, x) => { x.fillStyle = 'rgb(66,120,92)'; x.fillRect(DX0, DY0, DX1 - DX0, DY1 - DY0); for (let i = 0; i < 9; i++) sweepBrush(x, [[DX0 + 30 + i * 72, DY0], [DX0 + 36 + i * 72, (DY0 + DY1) / 2], [DX0 + 30 + i * 72, DY1]], { w: 70, ink: .35, dry: .5, color: '20,60,40', seed: 530 + i, bristles: 30 });
      [[260, 400, 300, 160], [600, 400, 220, 160], [260, 1080, 300, 540], [600, 1080, 220, 540]].forEach(([a, b, w, h], i) => brush(x, rectPts(a, b, w, h, 8), { w: 9, dry: .3, seed: 540 + i, bristles: 10, color: '14,40,26', taper: [.02, .05] }));
      brush(x, rectPts(DX0, DY0, DX1 - DX0, DY1 - DY0, 14), { w: 16, dry: .3, seed: 549, bristles: 18, color: '14,30,20', taper: [.02, .05] });
      x.save(); x.translate(540, 680); x.rotate(-.02); x.fillStyle = '#f7efdc'; x.fillRect(-210, -72, 420, 144); brush(x, rectPts(-206, -68, 412, 136, 8), { w: 7, dry: .3, seed: 551, bristles: 8, color: '30,90,60', taper: [.02, .05] });
      x.font = '92px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(18,40,26,.95)'; x.fillText('对方问了', 0, 6); x.restore();
      x.fillStyle = '#9a7a3a'; x.beginPath(); x.arc(290, 1000, 20, 0, 7); x.fill(); brush(x, circ(290, 1000, 20, 20, 0, 6.3, 12), { w: 4, seed: 552, bristles: 5 }); });
    st.lockBody = sprite(140, 200, x => { x.fillStyle = '#c9a050'; x.fillRect(20, 80, 100, 110); brush(x, rectPts(20, 80, 100, 110, 6), { w: 6, dry: .2, seed: 560, bristles: 8, taper: [.02, .05] }); x.fillStyle = '#1a1206'; x.beginPath(); x.arc(70, 125, 10, 0, 7); x.fill(); x.fillRect(66, 128, 8, 30); });
    st.shackle = sprite(140, 120, x => brush(x, [[38, 110], [38, 60], [50, 32], [70, 26], [90, 32], [102, 60], [102, 110]], { w: 12, dry: .15, seed: 561, bristles: 10, taper: [.05, .05] }));
    st.red = slipH('抢先解释', { w: 300, h: 92, fs: 64 }); st.fact = slipH('事实：晚到40分钟', { w: 440, h: 92, fs: 56, edge: '48,72,138' });
    st.A = await L((c, x) => { figure(x, { body: [[-80, 1960], [-60, 1730], [80, 1650], [190, 1640], [190, 1600], [310, 1600], [310, 1640], [430, 1660], [500, 1800], [500, 1960]], robe: .9, cw: 14, sweep: 70,
      hair: [[[140, 1500], [150, 1380], [250, 1350], [350, 1390], [362, 1500], [340, 1610], [160, 1610]]], folds: [[[150, 1700], [140, 1900]], [[350, 1700], [370, 1900]]], seed: 570 });
      [[[180, 1400], [200, 1500], [196, 1590]], [[240, 1370], [250, 1480], [244, 1590]], [[300, 1380], [306, 1490], [300, 1590]], [[336, 1420], [334, 1510], [326, 1590]]].forEach((p, i) => brush(x, p, { w: 5, dry: .6, seed: 575 + i, color: PAPER, ink: .55, bristles: 8 }));
      brush(x, circ(250, 1352, 46, 34, 0, 6.3, 18), { w: 10, dry: .2, seed: 579, bristles: 10 }); x.fillStyle = 'rgb(22,20,18)'; x.beginPath(); x.ellipse(250, 1352, 44, 32, 0, 0, 7); x.fill(); brush(x, [[200, 1352], [300, 1352]], { w: 5, seed: 580, color: '184,38,29', bristles: 5 }); });
    st.seal = await sealL('问', 960, 1500); return st; },
  frame(ctx, lt, st, K) { const op = ease(seg(lt, .32, .62)); const [sx, sy] = shake(lt, [.15, .3], 12, .05);
    ctx.save(); cam(ctx, 1.02 + .04 * ease(lt), 540, 1000, sx, sy); lay(ctx, st.back); lay(ctx, st.glow); lay(ctx, st.door, { sx: 1 - .82 * op, sy: 1, px: 860, py: 1000 });
    if (op > 0) { ctx.save(); ctx.globalAlpha = .35 * op; ctx.fillStyle = 'rgb(20,40,30)'; ctx.fillRect(860 - 640 * (1 - .82 * op), 360, 640 * (1 - .82 * op), 1300); ctx.restore(); }
    const pop = seg(lt, .28, .34), drop = ein(seg(lt, .34, .6)); const lx = 292, ly = 960 + drop * 760; if (lt < .62) { blit(ctx, st.shackle, lx + 15 * pop, ly - 70 - 26 * pop, pop * .5 + drop * 2); blit(ctx, st.lockBody, lx, ly + 5, drop * 2.5); }
    const fall = seg(lt, .3, .52); const rx = 600 + fall * 120, ry = 1210 + ein(fall) * 700, rr = -.06 + fall * 1.4; blit(ctx, st.red, rx, ry, rr, 1.4, 1 - seg(fall, .7, 1));
    if (lt < .52) { ctx.save(); ctx.globalAlpha = 1 - seg(fall, .7, 1); ctx.translate(rx, ry); ctx.rotate(rr); ctx.scale(1.4, 1.4); const a1 = seg(lt, .12, .2), a2 = seg(lt, .2, .28);
      if (a1 > 0) brush(ctx, [[-170, -60], [-170 + 340 * a1, -60 + 120 * a1]], { w: 18, dry: .2, seed: 581, bristles: 12, color: '184,38,29', taper: [.05, .3] }); if (a2 > 0) brush(ctx, [[170, -60], [170 - 340 * a2, -60 + 120 * a2]], { w: 18, dry: .2, seed: 582, bristles: 12, color: '184,38,29', taper: [.05, .3] }); ctx.restore(); }
    if (lt > .5) { const k = eout(seg(lt, .55, .88)); blit(ctx, st.fact, -300 + 860 * k, 1000 + 140 * (1 - k), .3 * (1 - k) - .03, 1.15 + .1 * k, seg(lt, .5, .56)); }
    lay(ctx, st.A, { dy: 8 * Math.sin(lt * 9) }); lay(ctx, st.seal); ctx.restore(); } };

// ══ S6 · 石桥 ink rain ══
const S6 = { id: 'S6-rain-street', loc: 'stone bridge in ink rain', t0: T[5], t1: T[6], cap: [['解释越多', 'R'], ['，诚意越薄', 0]],
  async build() { const st = {}; const r = rng(66);
    st.back = await L((c, x) => { paperBase(x, W, H, 66); mountains(x); wash(x, pth([[0, 700], [300, 600], [600, 680], [900, 580], [1080, 640], [1080, 900], [0, 900]]), { tone: .2, blur: 20, edge: .05 });
      wash(x, pth([[0, 1380], [1080, 1380], [1080, 1920], [0, 1920]]), { tone: .22, blur: 14, edge: .02, color: '40,50,60' }); for (let i = 0; i < 12; i++) brush(x, [[r() * 900, 1450 + i * 38], [r() * 900 + 180, 1452 + i * 38]], { w: 6, dry: .8, seed: 600 + i, ink: .35, bristles: 8 });
      brush(x, [[-40, 1330], [200, 1240], [540, 1190], [880, 1240], [1120, 1330]], { w: 40, dry: .35, seed: 620, bristles: 36 }); brush(x, [[-40, 1400], [200, 1320], [540, 1280], [880, 1320], [1120, 1400]], { w: 22, dry: .4, seed: 621, bristles: 22 });
      brush(x, [[330, 1390], [400, 1300], [540, 1270], [680, 1300], [750, 1390]], { w: 14, dry: .4, seed: 622, bristles: 14 }); wash(x, pth([[330, 1390], [400, 1300], [540, 1270], [680, 1300], [750, 1390]]), { tone: .25, blur: 6, edge: .1, color: '20,18,16' });
      for (let i = 0; i < 9; i++) brush(x, [[100 + i * 100, 1190 + Math.abs(i - 4.5) * 12], [100 + i * 100, 1110 + Math.abs(i - 4.5) * 12]], { w: 10, dry: .3, seed: 630 + i, bristles: 8 }); brush(x, [[60, 1120], [540, 1060], [1020, 1120]], { w: 12, dry: .4, seed: 640, bristles: 12 }); });
    st.B = await L((c, x) => { figure(x, { body: [[920, 1080], [960, 1078], [972, 1160], [966, 1220], [950, 1220], [942, 1180], [936, 1220], [918, 1220], [912, 1160]], robe: .95, cw: 4, sweep: 24, hair: [[[924, 1050], [932, 1032], [954, 1032], [962, 1056], [952, 1078], [930, 1078]]], seed: 650 });
      wash(x, pth([[860, 1040], [900, 990], [940, 975], [980, 990], [1020, 1040], [940, 1030]]), { tone: .75, blur: 3, edge: .4, color: '184,70,40' }); brush(x, [[860, 1040], [900, 992], [940, 976], [980, 992], [1020, 1040]], { w: 6, dry: .2, seed: 651, bristles: 8 }); brush(x, [[940, 976], [942, 1100]], { w: 4, seed: 652, bristles: 4 }); });
    st.A = await L((c, x) => { figure(x, { body: [[300, 780], [380, 740], [470, 745], [530, 800], [610, 1000], [620, 1400], [610, 1760], [470, 1770], [450, 1880], [380, 1880], [350, 1770], [240, 1760], [230, 1300], [250, 900]], robe: .88, cw: 14, sweep: 74,
      head: [420, 640, 62, 76, .08], hair: [[[356, 610], [362, 560], [420, 540], [484, 566], [488, 610], [460, 590], [410, 590], [370, 640]]],
      feats: [{ pts: [[440, 630], [466, 628]], w: 6 }, { pts: [[476, 650], [494, 668], [472, 676]], w: 5 }, { pts: [[440, 700], [462, 704]], w: 5 }],
      limbs: [{ pts: [[300, 980], [400, 1060], [500, 1050], [600, 990]], w: 40 }], folds: [[[330, 900], [300, 1300], [290, 1700]], [[520, 900], [560, 1300], [570, 1700]]], seed: 660 }); });
    st.sl = SLIPS.map(slipV); st.drop = []; for (let i = 0; i < 12; i++) st.drop.push([.02 + i * .07, 380 + r() * 200, (r() - .5) * 1.5, 1560 + r() * 260, 200 + r() * 600]); st.seal = await sealL('薄', 960, 1500); return st; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.03 - .02 * lt, 500, 1100); lay(ctx, st.back); lay(ctx, st.B, { dx: 80 * lt, dy: Math.abs(Math.sin(lt * 20)) * -4 });
    st.drop.forEach(([t0, x0, sp, py, x1], i) => { if (lt < t0 + .22) return; const k = seg(lt, t0 + .22, t0 + .9); const g = ctx.createRadialGradient(x1, py + 20, 2, x1, py + 20, 30 + 170 * eout(k)); g.addColorStop(0, `rgba(20,18,16,${.55 * (1 - .5 * k)})`); g.addColorStop(.6, `rgba(20,18,16,${.25 * (1 - .5 * k)})`); g.addColorStop(1, 'rgba(20,18,16,0)');
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x1, py + 20, 30 + 170 * eout(k), (30 + 170 * eout(k)) * .3, 0, 0, 7); ctx.fill(); ctx.restore(); });
    const left = st.drop.filter(d => lt < d[0]).length; for (let i = 0; i < Math.ceil(left / 2); i++) blit(ctx, st.sl[i % 8], 440 + (i % 2) * 40, 960 - i * 14, 1.5 + (i % 3 - 1) * .12, .7);
    lay(ctx, st.A);
    st.drop.forEach(([t0, x0, sp, py, x1], i) => { if (lt < t0) return; const k = seg(lt, t0, t0 + .22); const x = x0 + (x1 - x0) * k, y = 1000 + (py - 1000) * ein(k); const dis = seg(lt, t0 + .22, t0 + .4); if (dis < 1) blit(ctx, st.sl[i % 8], x, y, sp * k * 2 + 1.5 * (1 - k), .7, 1 - dis); });
    const r = rng(5); ctx.save(); for (let i = 0; i < 220; i++) { const bx = r() * 1300 - 100, by = r() * 2100, sp = 2600 + r() * 1400, l = 40 + r() * 60; const y = (by + K.t * sp) % 2100 - 100, x = bx - (y / 2100) * 120; ctx.strokeStyle = `rgba(30,32,36,${.25 + r() * .35})`; ctx.lineWidth = 1.5 + r() * 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + l); ctx.stroke(); } ctx.restore();
    lay(ctx, st.seal); ctx.restore(); } };

// ══ S7 · 回席 callback ══
const S7 = { id: 'S7-booth-return', loc: 'booth (callback)', t0: T[6], t1: T[7], cap: [['只说一句：', 0], ['是我的错', 'G']],
  async build() { return { back: await S('reverse', 'back'), B: await S('reverse', 'B'), front: await S('reverse', 'front'), pl: await S('reverse', 'plaque'), ash: await S('reverse', 'ash'), A: await S('reverse', 'A'), seal: await sealL('承') }; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.07 - .07 * ease(lt), 600, 1050); lay(ctx, st.back); tally(ctx, 150, 330, 0, 44); lay(ctx, st.B, { rot: -.03 * ease(seg(lt, .3, 1)), px: 840, py: 1180 }); lay(ctx, st.front);
    const k = back(seg(lt, 0, .35)); lay(ctx, st.pl, { dy: -140 * (1 - k), a: seg(lt, 0, .06) }); lay(ctx, st.ash, { dy: 80 * lt, dx: 20 * Math.sin(lt * 5), a: 1 - .5 * lt }); lay(ctx, st.A, { dy: -8 * ease(lt), px: 300, py: 1700 });
    flecks(ctx, K.t, 40, 100, 1000, 300, 1600); lay(ctx, st.seal); ctx.restore(); } };

// ══ S8 · 案上 dry-brush table macro ══
const S8 = { id: 'S8-table-macro', loc: 'table close-up', t0: T[7], t1: T[8], cap: [['借口', 'R'], ['×0，关系才回得来', 0]], sub: '据 Schlenker · 简化模型',
  async build() { const st = {}; const r = rng(88);
    st.back = await L((c, x) => { paperBase(x, W, H, 88); wash(x, pth([[0, 0], [1080, 0], [1080, 1920], [0, 1920]]), { tone: .22, blur: 10, edge: 0, color: '90,60,30' });
      for (let i = 0; i < 26; i++) { const y = i * 76 + r() * 20; sweepBrush(x, [[-40, y], [540, y + (r() - .5) * 20], [1120, y + (r() - .5) * 30]], { w: 60, ink: .3 + r() * .2, dry: .55, color: '70,45,25', seed: 700 + i, bristles: 34 }); }
      x.save(); x.globalCompositeOperation = 'screen'; const g = x.createRadialGradient(540, 950, 50, 540, 1000, 900); g.addColorStop(0, 'rgba(255,240,210,.55)'); g.addColorStop(1, 'rgba(255,240,210,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore();
      for (let i = 0; i < 5; i++) { x.fillStyle = '#fbf8f0'; x.beginPath(); x.ellipse(850, 1390 - i * 9, 120 - i * 8, 26, 0, 0, 7); x.fill(); brush(x, circ(850, 1390 - i * 9, 120 - i * 8, 26, 0, 6.3, 26), { w: 4, dry: .1, seed: 730 + i, bristles: 6, color: i ? '20,18,16' : '40,70,140' }); }
      x.save(); x.translate(250, 1440); x.rotate(-.22); x.fillStyle = '#f7efdc'; x.fillRect(-130, -46, 260, 92); brush(x, rectPts(-124, -40, 248, 80, 8), { w: 5, dry: .3, seed: 740, bristles: 8, color: '184,38,29', taper: [.02, .05] });
      x.font = '60px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(18,16,14,.95)'; x.fillText('借口×0', 0, 4); x.restore();
      for (let i = 0; i < 30; i++) { const ax = 100 + r() * 360, ay = 1560 + r() * 220, s = 3 + r() * 9; x.fillStyle = `rgba(20,18,16,${.3 + r() * .5})`; x.beginPath(); x.ellipse(ax, ay, s, s * .5, r() * 3, 0, 7); x.fill(); } });
    st.pl = await L((c, x) => cinnabar(x, 540, 880, 780, 290, 170, 0, 760));
    const HE = [[400, 1130, 80, 52, .05], [490, 1100, 50, 15, .1], [503, 1128, 54, 16, .03], [497, 1156, 50, 15, -.04], [478, 1182, 40, 13, -.12], [440, 1084, 42, 15, -.55]];
    const SL = [[-120, 1050], [180, 1028], [310, 1068], [330, 1205], [180, 1245], [-120, 1270]];
    const hand = (m, seed) => L((c, x) => { const mir = e => m ? [1140 - e[0], e[1] + 20, e[2], e[3], -e[4]] : e; const P = ([px, py]) => [m ? 1140 - px : px, py + (m ? 20 : 0)];
      figure(x, { body: SL.map(P), robe: m ? .9 : .8, cw: 12, sweep: 50, seed, folds: (m ? [[[1000, 1080], [980, 1250]], [[900, 1075], [890, 1240]]] : [[[140, 1060], [160, 1230]], [[240, 1060], [250, 1230]]]) });
      x.fillStyle = `rgb(${PAPER})`; HE.forEach(e => { const [cx, cy, rx, ry, a] = mir(e); x.beginPath(); x.ellipse(cx, cy, rx, ry, a, 0, 7); x.fill(); });
      const pts = []; const [hx, hy] = mir(HE[0]); for (let i = 0; i <= 20; i++) { const a = (m ? Math.PI : 0) + 1.2 - i / 20 * 2.4; pts.push([hx + Math.cos(a) * 85, hy + Math.sin(a) * 55]); } brush(x, pts, { w: 7, dry: .25, seed: seed + 1, bristles: 10 });
      HE.slice(1).forEach((e, i) => { const [cx, cy, rx, ry, a] = mir(e); const P2 = []; for (let k = 0; k <= 10; k++) { const t = -1.6 + k / 10 * 3.2 + (m ? Math.PI : 0); P2.push([cx + Math.cos(t) * rx * Math.cos(a) - Math.sin(t) * ry * Math.sin(a), cy + Math.cos(t) * rx * Math.sin(a) + Math.sin(t) * ry * Math.cos(a)]); } brush(x, P2, { w: 5, dry: .2, seed: seed + 10 + i, bristles: 8 }); });
      const c0 = P([310, 1068]), c1 = P([330, 1205]); brush(x, [c0, c1], { w: 16, dry: .1, seed: seed + 30, color: PAPER, bristles: 10, taper: [.05, .05] }); });
    st.hA = await hand(false, 780); st.hB = await hand(true, 800); st.seal = await sealL('和', 960, 300); return st; },
  frame(ctx, lt, st, K) { ctx.save(); cam(ctx, 1.0 + .06 * ease(lt), 540, 1050); lay(ctx, st.back); lay(ctx, st.pl); const a = eout(seg(lt, .02, .4)), b = eout(seg(lt, .3, .88)); lay(ctx, st.hA, { dx: -520 * (1 - a) }); lay(ctx, st.hB, { dx: 560 * (1 - b) });
    flecks(ctx, K.t, 30, 60, 1020, 300, 1700, '70,45,25', 14); lay(ctx, st.seal, { a: seg(lt, .8, .9) }); ctx.restore(); } };

export const SHOTS = [S1, S2, S3, S4, S5, S6, S7, S8];
export const CAP = { font: '74px Brush', y: 1650, base: '#16130f', shadow: null, halo: `rgba(${PAPER},.96)`, haloW: 16, marks: { R: '#b8261d', B: '#30488a', G: '#9a6a10' },
  subFont: '600 34px NSerif', subCol: 'rgba(30,26,22,.85)', subDy: 72,
  underline(ctx, x, y, w, col, k) { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.globalAlpha = .9; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x + 2, y + 2); ctx.quadraticCurveTo(x + w / 2, y - 4, x + 2 + (w - 4) * k, y + 4); ctx.stroke();
    ctx.globalAlpha = .45; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 10, y + 10); ctx.lineTo(x + 10 + (w - 30) * k, y + 9); ctx.stroke(); ctx.restore(); } };
export async function ENV() { return { G: mkGrain(4, .4, 41) }; }
export function POST(ctx, lt, sh, K) { const fl = ctx.createLinearGradient(0, 1500, 0, H); fl.addColorStop(0, `rgba(${PAPER},0)`); fl.addColorStop(1, `rgba(${PAPER},.55)`); ctx.fillStyle = fl; ctx.fillRect(0, 1500, W, H - 1500);
  vignette(ctx, W, H, .28, '60,40,20'); grainOver(ctx, K.env.G, K.f, .14); caption(ctx, sh.cap, lt, CAP, sh.sub || null);
  if (lt < .05) { ctx.fillStyle = `rgba(20,18,16,${(1 - lt / .05) * .12})`; ctx.fillRect(0, 0, W, H); } }
