/** main.js — own-egypt-papyrus demo 「史上第一次罢工」(Deir el-Medina, Ramesses III year 29, c. 1157 BC). 24 s, 1440×1080 (4:3 like 4352), 4 worlds.
 * W1 tomb: workers carve the king's tomb, wages = grain → W2 granary empties, scribe Amennakht tallies 18 days late
 * → W3 the crew walks past five guard posts, sits behind the temple and shouts → W4 grain arrives, the scribe writes it on papyrus.
 * Improvement over the source: papyrus-unroll scene changes + jointed, moving figures (the source holds still boards). */
import { P, W, H, SERIF, parchment, grain, frameBands, captionCard, captionText, CARD, nameTag, titlePill, rgba, clamp, lerp, vignette, eyeOfHorus } from './look.js';
import { egyptian, POSES, blendPose } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 24;
let TX = [];
const S = M.seg01, E = M.ease;
function measure(text, size, weight = 900) { ctx.save(); ctx.font = `${weight} ${size}px ${SERIF}`; ctx.letterSpacing = '2px'; const w = ctx.measureText(text).width; ctx.restore(); return w; }
function cap(t, a, b, lines, id) { if (t < a || t >= b) return; const c = M.captionIn(t, a); const out = 1 - S(t, b - 0.25, b); captionText(ctx, lines, { a: c.a * out, dy: c.dy });
  const ys = lines.length === 1 ? [(CARD.l1 + CARD.l2) / 2] : [CARD.l1, CARD.l2]; lines.forEach((ln, i) => { const s = ln.map(g => g.t).join(''); const w = measure(s, CARD.size); TX.push({ id: id + i, text: s, x0: W / 2 - w / 2, y0: ys[i] - 28, x1: W / 2 + w / 2, y1: ys[i] + 28 }); }); }
function tag(t, t0, text, x, y, id) { const k = M.stampIn(t, t0); if (k.a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k.s, k.s); ctx.translate(-x, -y); const b = nameTag(ctx, text, x, y, { a: k.a, size: 26 }); ctx.restore(); if (b && k.a > 0.9) TX.push({ id, text, ...b }); }
const hand = (J, i) => ({ x: J.hands[i][0], y: J.hands[i][1], ang: J.hang[i] });
function sky(c, y1) { const bands = [P.sky1, P.sky2, P.sky3, P.sky4]; const hh = (y1 - 48) / 4; bands.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, 48 + i * hh, W, hh + 1); }); }
const GROUND = 846;

/* ── W1 0–6 · tomb in the Valley of the Kings: carving, wages are grain ── */
function w1(t) {
  parchment(ctx, { tone: 'stone' });
  // carved wall on the right, glyphs appear as the chisel works
  ctx.fillStyle = rgba('#B9A986', 0.6); ctx.fillRect(800, 110, 580, 560); ctx.strokeStyle = P.line; ctx.lineWidth = 3; ctx.strokeRect(800, 110, 580, 560);
  Pr.hieroWall(ctx, 826, 140, 1360, 650, { seed: 11, reveal: 0.25 + 0.75 * S(t, 0, 5.5), cell: 56 });
  Pr.oilLamp(ctx, 120, 330, 1.2, { t }); ctx.fillStyle = P.sandDark; ctx.fillRect(60, 336, 130, 14); ctx.strokeStyle = P.line; ctx.strokeRect(60, 336, 130, 14);
  // floor
  ctx.fillStyle = rgba('#8C7A5A', 0.35); ctx.fillRect(0, GROUND, W, 30);
  // worker A chisels the wall
  const A = M.chiselLoop(t, { period: 0.55 }); const ja = egyptian(ctx, { x: 650, y: GROUND, H: 470, kind: 'worker', pose: A.pose });
  const h0 = hand(ja, 0), h1 = hand(ja, 1); Pr.chisel(ctx, h0.x - 6, h0.y, 1.7, -Math.PI / 2 - 0.1); Pr.mallet(ctx, h1.x, h1.y, 1.1, h1.ang + Math.PI / 2);
  if (A.hit) { ctx.fillStyle = rgba(P.cream, 0.9); for (let i = 0; i < 6; i++) ctx.fillRect(h0.x + 50 + i * 6, h0.y - 10 + Math.sin(i * 3) * 14, 5, 5); }
  // worker B brings the wage basket (grain) on his head
  const B = M.walk(t, { x0: 120, speed: 0, period: 1.0 }); const jb = egyptian(ctx, { x: 250, y: GROUND, H: 440, kind: 'man', pose: blendPose(POSES.carry, B.pose, 0.35) });
  Pr.basket(ctx, jb.head[0] + 6, jb.head[1] - 74, 1.0, { full: 1 });
  Pr.jar(ctx, 60, GROUND, 0.9); Pr.bread(ctx, 120, GROUND, 0.9);
  tag(t, 1.6, '工匠', 520, 250, 'tagA');
  tag(t, 2.4, '工资', 150, 420, 'tagB');
  if (t < 4.0) { const k = S(t, 0.1, 0.5) * (1 - S(t, 3.6, 4.0)); if (k > 0) { titlePill(ctx, [[{ t: '史上第一次' }, { t: '罢工', c: 'red' }]], W / 2, 170, 560, 110, { a: k }); const w = measure('史上第一次罢工', 54); if (k > 0.9) TX.push({ id: 'title', text: '史上第一次罢工', x0: W / 2 - w / 2, y0: 140, x1: W / 2 + w / 2, y1: 200 }); } }
}
/* ── W2 6–12 · the granary empties; scribe Amennakht counts the days ── */
function w2(t) {
  parchment(ctx);
  Pr.palm(ctx, 90, GROUND, 1.0, { sway: Math.sin(t * 1.3) * 0.5 });
  const fill = 1 - E.io(S(t, 6.6, 8.6)); Pr.granary(ctx, 470, GROUND, 0.95, { fill, n: 3 });
  egyptian(ctx, { x: 190, y: GROUND, H: 420, kind: 'worker', pose: M.poseAt([[6, 'stand'], [8.4, 'stand'], [9.2, 'slump']], t) });
  // day board
  ctx.fillStyle = '#F2E8CF'; ctx.strokeStyle = P.line; ctx.lineWidth = 3; ctx.fillRect(820, 110, 520, 330); ctx.strokeRect(820, 110, 520, 330); ctx.fillStyle = P.line; ctx.fillRect(812, 102, 536, 10);
  const c = M.countUp(t, 7.6, 9.6, 0, 18); Pr.tally(ctx, 860, 160, Math.max(0, c.n + (t < 9.6 ? c.frac : 0)), { s: 1, per: 10, col: P.ink });
  if (c.n > 0) { const s = `第 ${c.n} 天`; ctx.save(); ctx.font = `900 64px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = c.n >= 18 ? P.hiRed : P.ink; ctx.translate(1080, 385); ctx.scale(c.pop, c.pop); ctx.fillText(s, 0, 0); ctx.restore(); const w = measure(s, 64); TX.push({ id: 'days', text: s, x0: 1080 - w / 2, y0: 350, x1: 1080 + w / 2, y1: 420 }); }
  const js = egyptian(ctx, { x: 1060, y: GROUND, H: 440, kind: 'scribe', pose: 'write' });
  Pr.palette(ctx, js.hands[1][0] + 30, js.hands[1][1] + 6, 0.7); Pr.reedPen(ctx, js.hands[0][0], js.hands[0][1], 0.9, 0.4 + Math.sin(t * 9) * 0.08);
  tag(t, 7.0, '书吏阿蒙纳赫特', 1340, 480, 'tagS');
}
/* ── W3 12–18 · past five guard posts, sit-in behind the temple ── */
function w3(t) {
  sky(ctx, 600); ctx.fillStyle = P.sand; ctx.fillRect(0, 600, W, H - 600); ctx.fillStyle = rgba(P.sandDark, 0.5); ctx.fillRect(0, 600, W, 6);
  Pr.sunDisk(ctx, 1220, 190, 46, { rays: 0.6 });
  const pan = 900 * E.io(S(t, 12.0, 14.5));
  Pr.temple(ctx, 2050 - pan, 640, 0.9);
  for (let i = 0; i < 5; i++) { const x = 160 + i * 330 - pan; if (x > -200 && x < W + 200) Pr.pylon(ctx, x, 640, 0.75, { n: i + 1 }); }
  for (let i = 0; i < 5; i++) { const x = 160 + i * 330 - pan; if (x > 40 && x < W - 40) TX.push({ id: 'post' + i, text: String(i + 1), x0: x - 9, y0: 640 - 150 - 12 - 8, x1: x + 9, y1: 640 - 150 + 12 - 8 }); }
  const sitK = S(t, 14.5, 15.1); const sh = M.shout(t, 15.3, 1.9);
  const crew = [[330, 'worker', 0], [520, 'man', 0.33], [710, 'worker', 0.66]];
  crew.forEach(([x, kind, ph], i) => { const wk = M.walk(t + ph, { speed: 0, period: 0.8 }); let pose = blendPose(wk.pose, POSES.sitDown, sitK);
    if (i === 1 && t > 15.1) pose = blendPose(POSES.sitDown, { ...POSES.shout, drop: 40, legs: POSES.sitDown.legs }, S(t, 15.1, 15.5));
    egyptian(ctx, { x: x + (i === 1 ? sh.dx : 0), y: GROUND - (sitK < 1 ? wk.bob * (1 - sitK) : 0), H: 430, kind, pose }); });
  if (t > 15.3) { const k = E.back(S(t, 15.3, 15.6)); const x = 560, y = 250; ctx.save(); ctx.translate(x + sh.dx, y + sh.dy); ctx.scale(k, k);
    ctx.strokeStyle = rgba(P.red, 0.8 * sh.amp + 0.2); ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 200, Math.sin(an) * 80); ctx.lineTo(Math.cos(an) * (230 + 30 * sh.amp), Math.sin(an) * (100 + 20 * sh.amp)); ctx.stroke(); }
    Pr.scroll(ctx, 0, 0, 380, 110, { open: 1, lines: [[{ t: '我们饿了！', c: 'red' }]], size: 60 }); ctx.restore(); const w = measure('我们饿了！', 60, 800); if (k > 0.95) TX.push({ id: 'shout', text: '我们饿了！', x0: x - w / 2, y0: y - 36, x1: x + w / 2, y1: y + 36 }); }
}
/* ── W4 18–24 · grain arrives, the scribe writes it down ── */
function w4(t) {
  parchment(ctx); Pr.hieroWall(ctx, 0, 70, W, 260, { seed: 4, a: 0.25, cell: 60 });
  Pr.nile(ctx, 0, 690, W, 760, { t }); ctx.fillStyle = P.grass; ctx.fillRect(0, 760, W, 120); ctx.strokeStyle = P.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 760); ctx.lineTo(W, 760); ctx.stroke();
  Pr.papyrus(ctx, 1380, 770, 0.8, { sway: Math.sin(t * 1.2) }); Pr.papyrus(ctx, 60, 770, 0.7, { sway: Math.cos(t * 1.1) });
  // big scroll unrolls and gets written
  const op = E.io(S(t, 18.5, 19.4)), wr = S(t, 19.4, 20.7);
  Pr.scroll(ctx, 720, 230, 880, 230, { open: op, lines: [[{ t: '第29年 · 工匠罢工' }], [{ t: '“我们饿了！”', c: 'red' }]], write: wr, size: 50 });
  if (wr > 0.98) { for (const [s, y, c] of [['第29年 · 工匠罢工', 194, 'ink'], ['“我们饿了！”', 266, 'red']]) { const w = measure(s, 50, 800); TX.push({ id: 'scr' + y, text: s, x0: 720 - w / 2, y0: y - 30, x1: 720 + w / 2, y1: y + 30 }); } }
  // official carries grain in; crew cheers
  const inK = S(t, 18.2, 20.6); const wk = M.walk(t, { speed: 0, period: 0.85 });
  const jo = egyptian(ctx, { x: lerp(1540, 1150, inK), y: GROUND, H: 450, f: -1, kind: 'official', pose: inK < 1 ? blendPose(POSES.carry, wk.pose, 0.35) : 'carry' });
  Pr.grainSack(ctx, jo.head[0] - 4, jo.head[1] - 74, 1.0);
  Pr.basket(ctx, lerp(1450, 1000, inK), GROUND, 1.1, { full: 1 });
  const ch = S(t, 20.6, 21.0); [[480, 'worker', 0], [700, 'man', 0.4]].forEach(([x, kind, ph]) => egyptian(ctx, { x, y: GROUND, H: 430, kind, pose: blendPose(POSES.stand, Math.sin((t + ph) * 6) > 0 ? POSES.cheer : POSES.raise, ch) }));
  const js = egyptian(ctx, { x: 200, y: GROUND, H: 420, kind: 'scribe', pose: 'write' }); Pr.reedPen(ctx, js.hands[0][0], js.hands[0][1], 0.9, 0.4 + Math.sin(t * 9) * 0.08);
  const ak = M.stampIn(t, 22.2); if (ak.a > 0) { ctx.save(); ctx.globalAlpha = ak.a; ctx.translate(1300, 520); ctx.scale(ak.s, ak.s); Pr.ankh(ctx, 0, 0, 1.2); ctx.restore(); }
}
const WORLDS = [w1, w2, w3, w4];
function captions(t) {
  cap(t, 1.0, 5.75, [[{ t: '给法老修陵墓的' }, { t: '工匠', c: 'blue' }, { t: '，' }], [{ t: '工资不是钱，是' }, { t: '粮食', c: 'green' }, { t: '。' }]], 'c1');
  cap(t, 6.6, 11.75, [[{ t: '拉美西斯三世', c: 'blue' }, { t: '在位第29年，' }], [{ t: '口粮晚发了' }, { t: '18天', c: 'red' }, { t: '。' }]], 'c2');
  cap(t, 12.3, 17.75, [[{ t: '工匠们走过' }, { t: '五道哨卡', c: 'green' }, { t: '，' }], [{ t: '坐到神庙后面，不干了。' }]], 'c3');
  cap(t, 18.5, 24.01, [[{ t: '书吏把这件事写进了' }, { t: '都灵罢工纸草', c: 'blue' }], [{ t: '——人类第一次有记载的' }, { t: '罢工', c: 'red' }, { t: '。' }]], 'c5');
}
window.render = (t) => {
  TX = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const i = Math.min(3, Math.floor(t / 6)); WORLDS[i](t);
  for (const [s, e, nx] of [[5.4, 6.0, w2], [11.4, 12.0, w3], [17.4, 18.0, w4]]) if (t >= s && t < e) { const save = TX; M.scrollWipe(ctx, S(t, s, e), () => { nx(e); }); TX = save; }
  grain(ctx, 1); vignette(ctx, 0.18);
  frameBands(ctx); captionCard(ctx, { k: E.out(S(t, 0.2, 0.8)) }); captions(t);
};
window.TEXTS = () => TX.slice();
Promise.all([document.fonts.load(`900 46px ${SERIF}`), document.fonts.load(`800 26px ${SERIF}`)]).then(() => document.fonts.ready).then(() => { window.render(0); window.READY = true; });
