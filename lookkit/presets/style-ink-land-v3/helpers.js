import * as N from '../style-ink/scene.js';
import { rng, mkCanvas } from '../../core/util.js';
export const W = 1920, H = 1080, FPS = 30;
export const { brush, sweepBrush, wash, pth, ell, circ, paperBase, rectPts, seal: sealDrawN } = N;
const baseFigure = N.figure;
export { rng, mkCanvas };
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const eout = t => 1 - Math.pow(1 - t, 3);
export const ein = t => t * t * t;
export const L = async fn => { const c = mkCanvas(W, H); await fn(c.getContext('2d'), c); return c; };
export const blit = (ctx, cv, x, y, rot = 0, s = 1, a = 1) => {
  if (!cv || a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.drawImage(cv, -cv.width / 2, -cv.height / 2); ctx.restore();
};
export const cam = (ctx, z, cx, cy) => { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); };
export const EX = ['堵车', '加班', '临时会', '手机没电', '不是故意', '你也有错', '太忙了', '我压力大'];
export function slip(x, cx, cy, a, t, s = 1, red = true) {
  x.save(); x.translate(cx, cy); x.rotate(a); x.scale(s, s);
  x.shadowColor = 'rgba(60,40,20,.22)'; x.shadowBlur = 6; x.shadowOffsetY = 3;
  x.fillStyle = '#f7efdc'; x.fillRect(-24, -64, 48, 128); x.shadowColor = 'transparent';
  if (red) { x.strokeStyle = 'rgba(184,38,29,.55)'; x.lineWidth = 2; x.strokeRect(-20, -60, 40, 120); }
  const n = t.length, fs = Math.min(28, 110 / n);
  x.fillStyle = 'rgba(18,16,14,.92)'; x.font = `${fs}px Brush`; x.textAlign = 'center'; x.textBaseline = 'middle';
  [...t].forEach((ch, i) => x.fillText(ch, 0, -((n - 1) * fs) / 2 + i * fs)); x.restore();
}
export function hSlip(x, cx, cy, a, t, s = 1) {
  x.save(); x.translate(cx, cy); x.rotate(a); x.scale(s, s);
  x.fillStyle = '#f7efdc'; x.fillRect(-90, -16, 180, 32);
  x.strokeStyle = 'rgba(184,38,29,.5)'; x.lineWidth = 1.5; x.strokeRect(-86, -13, 172, 26);
  x.fillStyle = 'rgba(18,16,14,.92)'; x.font = '22px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(t, 0, 1); x.restore();
}
export function spear(x, cx, cy, a, t, s = 1) {
  x.save(); x.translate(cx, cy); x.rotate(a); x.scale(s, s);
  x.fillStyle = '#f2e8d2'; x.fillRect(-140, -10, 240, 20);
  x.strokeStyle = 'rgba(184,38,29,.45)'; x.lineWidth = 1.5; x.strokeRect(-140, -10, 240, 20);
  x.fillStyle = 'rgba(18,16,14,.9)'; x.font = '18px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(t, -20, 1);
  x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.moveTo(100, -12); x.lineTo(160, 0); x.lineTo(100, 12); x.fill();
  x.restore();
}
export function inkFig(x, o) { figure(x, o); }
// ---- v3 face + emotion kit ------------------------------------------------
// figure(x,o): o.emo ∈ neutral|anger|hurt|guilty|regret|reconcile ; o.view ∈ front|3qL|3qR|profL|profR (facing dir) ; o.pose ∈ square|fold|gesture|bow|lean
// single-stroke `feats` from v2 are dropped (they produced the one-left-eye bug); faces are rebuilt here.
export function figure(x, o) {
  const { feats, emo = 'neutral', view = 'front', pose, ...rest } = o;
  const head = rest.head ? [...rest.head] : null;
  if (head && (pose === 'bow' || emo === 'regret') && !head[4]) { // bowed: head drops & tips forward
    const dir = view.endsWith('L') ? -1 : 1; head[1] += head[3] * .22; head[0] += dir * head[2] * .15; head[4] = dir * .32; rest.head = head; }
  if (head && emo === 'hurt' && !head[4]) { const dir = view.endsWith('L') ? -1 : 1; head[4] = dir * .14; head[1] += head[3] * .06; rest.head = head; }
  if (head && rest.head !== o.head && o.head) { // move hair with the tipped head (rotate about neck point, then translate)
    const [ox, oy] = o.head, dx = head[0] - ox, dy = head[1] - oy, a = (head[4] || 0) - (o.head[4] || 0), c = Math.cos(a), sn = Math.sin(a);
    rest.hair = (rest.hair || []).map(h => h.map(([px, py]) => { const u = px - ox, v = py - oy; return [ox + u * c - v * sn + dx, oy + u * sn + v * c + dy]; })); }
  baseFigure(x, rest);
  if (head) { posture(x, head, pose || POSE[emo], view, rest.seed || 1); face(x, head, emo, view, rest.seed || 1); }
}
const POSE = { anger: 'square', hurt: 'fold', guilty: 'gesture', regret: null, reconcile: null, neutral: null };
function posture(x, [cx, cy, rx, ry], pose, view, seed) {
  if (!pose || rx < 26) return; const dir = view.endsWith('L') ? -1 : 1, s = rx / 90;
  if (pose === 'square') { // squared, raised shoulders: hard horizontal yoke
    brush(x, [[cx - rx * 1.7, cy + ry * 1.55], [cx - rx * 1.2, cy + ry * 1.32], [cx + rx * 1.2, cy + ry * 1.32], [cx + rx * 1.7, cy + ry * 1.55]], { w: 16 * s, dry: .25, seed: seed + 300, bristles: 16, taper: [.05, .05] }); }
  if (pose === 'fold') { // arms folded across chest: two crossing forearms, paper-edged so they read on the robe
    const y = cy + ry * 2.0, a = [[cx - rx * 1.25, y + ry * .1], [cx, y - ry * .12], [cx + rx * 1.2, y + ry * .05]], b = [[cx + rx * 1.25, y + ry * .32], [cx + rx * .05, y + ry * .14], [cx - rx * 1.15, y + ry * .3]];
    for (const [pts, k] of [[a, 0], [b, 1]]) { brush(x, pts, { w: 30 * s, dry: .1, seed: seed + 310 + k, color: '239,229,207', ink: .9, bristles: 16 }); brush(x, pts, { w: 20 * s, dry: .3, seed: seed + 320 + k, bristles: 20, ink: 1 }); }
    for (const p of [a[2], b[2]]) { x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(p[0], p[1], 11 * s, 9 * s, 0, 0, 7); x.fill(); brush(x, circ(p[0], p[1], 11 * s, 9 * s, 0, 6.2, 10), { w: 3 * s + 1, dry: .2, seed: seed + 330, bristles: 5 }); } }
  if (pose === 'gesture') { // open explaining hand pushed forward toward the listener
    const sx = cx + dir * rx * .9, sy = cy + ry * 1.6, hx = cx + dir * rx * 2.1, hy = cy + ry * 1.05;
    const arm = [[sx, sy + ry * .5], [cx + dir * rx * 1.6, sy + ry * .1], [hx, hy]];
    brush(x, arm, { w: 30 * s, dry: .1, seed: seed + 340, color: '239,229,207', ink: .9, bristles: 16 }); brush(x, arm, { w: 20 * s, dry: .3, seed: seed + 341, bristles: 20 });
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(hx + dir * 8 * s, hy - 4 * s, 16 * s, 12 * s, -dir * .5, 0, 7); x.fill();
    for (let k = 0; k < 4; k++) brush(x, [[hx + dir * 10 * s, hy - 6 * s + (k - 1.5) * 5 * s], [hx + dir * 30 * s, hy - 16 * s + (k - 1.5) * 8 * s]], { w: 3.4 * s + 1, dry: .1, seed: seed + 350 + k, bristles: 4 });
    brush(x, circ(hx + dir * 8 * s, hy - 4 * s, 16 * s, 12 * s, 0, 6.2, 12), { w: 3 * s + 1, dry: .2, seed: seed + 360, bristles: 5 }); }
}
// face features in head-local units (u = rx, v = ry); drawn in ink after hair
export function face(x, [cx, cy, rx, ry, rot = 0], emo = 'neutral', view = 'front', seed = 1) {
  x.save(); x.translate(cx, cy); x.rotate(rot);
  const tiny = rx < 30, k = rx / 90, lw = Math.max(1.6, 5.2 * k), C = '20,18,16';
  const st = (pts, w = lw, s2 = 0) => brush(x, pts.map(([a, b]) => [a * rx, b * ry]), { w, dry: .12, seed: seed + 500 + s2, bristles: Math.max(4, w * 1.4 | 0), color: C, taper: [.25, .3] });
  const dot = (a, b, r) => { x.fillStyle = `rgb(${C})`; x.beginPath(); x.ellipse(a * rx, b * ry, r, r * 1.1, 0, 0, 7); x.fill(); };
  const prof = view.startsWith('prof'), d = view.endsWith('L') ? -1 : 1;
  // eye centres (head-local); 3/4 shifts the face toward the facing side, far eye narrower
  let eyes = view === 'front' ? [[-.38, .0, 1], [.38, .0, 1]] : prof ? [[.5 * d, -.02, .9]] : [[-.05 * d, .0, .78], [.52 * d, .0, 1]];
  const mx = view === 'front' ? 0 : prof ? .68 * d : .3 * d, my = .5, ew = .17;
  if (tiny) { // far figures: two clear dots (or one + nose tick for profile)
    eyes.forEach(([ex, ey]) => dot(ex, ey - (emo === 'regret' || emo === 'hurt' ? -.08 : 0), Math.max(1.6, rx * .1)));
    if (prof) st([[.9 * d, -.05], [1.08 * d, .2], [.9 * d, .25]], Math.max(1.4, lw * .8), 9);
    x.restore(); return; }
  eyes.forEach(([ex, ey, sc], i) => {
    const w2 = ew * sc, inner = (ex * d > 0) === (view !== 'front') ? 1 : -1; const io = view === 'front' ? (ex < 0 ? 1 : -1) : -d; // inner direction (toward nose)
    const by = ey - .3;
    // --- brows
    if (emo === 'anger') st([[ex - io * w2 * 1.1, by - .05], [ex + io * w2 * 1.15, by + .09]], lw * 1.25, i);           // knitted: inner end low
    else if (emo === 'guilty') st([[ex - io * w2 * 1.1, by - .02], [ex, by - .12], [ex + io * w2 * 1.05, by - .07]], lw, i); // raised arch
    else if (emo === 'regret' || emo === 'hurt') st([[ex - io * w2 * 1.1, by + .03], [ex + io * w2 * 1.0, by - .07]], lw, i); // sad: inner end up
    else if (emo === 'reconcile') st([[ex - w2 * 1.05, by + .01], [ex, by - .05], [ex + w2 * 1.05, by + .01]], lw * .85, i);
    else st([[ex - w2, by], [ex + w2, by - .01]], lw * .9, i);
    // --- eyes
    if (emo === 'anger') { st([[ex - w2, ey - .02 + (io < 0 ? .03 : 0)], [ex + w2, ey + (io > 0 ? .04 : 0)]], lw * 1.1, 10 + i); dot(ex + io * w2 * .1, ey + .02, lw * .75); }
    else if (emo === 'hurt') { st([[ex - w2, ey + .02], [ex, ey + .07], [ex + w2, ey + .02]], lw, 10 + i); dot(ex - d * w2 * .2, ey + .07, lw * .55); } // lowered lid, looking down/away
    else if (emo === 'regret') st([[ex - w2, ey], [ex, ey + .07], [ex + w2, ey]], lw, 10 + i); // closed, downcast
    else if (emo === 'reconcile') st([[ex - w2, ey + .04], [ex, ey - .04], [ex + w2, ey + .04]], lw, 10 + i); // soft smiling arcs
    else { // neutral / guilty: open almond with pupil; guilty pupils dart sideways (alternate by seed)
      st([[ex - w2, ey], [ex, ey - .06], [ex + w2, ey]], lw * .9, 10 + i); st([[ex - w2 * .8, ey + .03], [ex + w2 * .8, ey + .035]], lw * .55, 20 + i);
      const dart = emo === 'guilty' ? ((seed % 2) ? 1 : -1) * w2 * .55 : 0; dot(ex + dart, ey + .005, lw * .95); }
  });
  // --- nose
  if (prof) st([[.82 * d, -.22], [1.04 * d, .16], [.86 * d, .24]], lw * 1.05, 30);
  else if (view === 'front') st([[.02, .12], [-.04, .28], [.06, .3]], lw * .7, 30);
  else st([[.42 * d, .1], [.5 * d, .28], [.36 * d, .3]], lw * .8, 30);
  // --- mouth
  const mw = prof ? .13 : .2;
  if (emo === 'anger') st([[mx - mw, my + .03], [mx, my], [mx + mw, my + .03]], lw * 1.1, 40);         // tight, pressed down
  else if (emo === 'hurt') st([[mx - mw * .7, my + .02], [mx + mw * .7, my + .02]], lw * .8, 40);
  else if (emo === 'regret') st([[mx - mw * .8, my + .04], [mx, my], [mx + mw * .8, my + .04]], lw * .85, 40);
  else if (emo === 'reconcile') st([[mx - mw, my - .02], [mx, my + .05], [mx + mw, my - .02]], lw * .9, 40); // slight smile
  else if (emo === 'guilty') { x.fillStyle = `rgb(${C})`; x.beginPath(); x.ellipse(mx * rx, (my + .02) * ry, mw * .45 * rx, .06 * ry, 0, 0, 7); x.fill(); } // mid-sentence
  else st([[mx - mw * .7, my], [mx + mw * .7, my]], lw * .8, 40);
  if (emo === 'anger') { // sharp ink flick off the temple
    const tx = -(view === 'front' ? 1 : d) * 1.05; brush(x, [[tx * rx, -.55 * ry], [(tx - .25 * Math.sign(tx)) * rx, -.95 * ry]], { w: lw * 1.6, dry: .2, seed: seed + 580, bristles: 8, taper: [.05, .9], color: C }); }
  x.restore();
}
export function sealCh(x, ch, px, py, s = .55) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = 'rgb(184,38,29)'; x.fillRect(-36, -36, 72, 72);
  brush(x, rectPts(-36, -36, 72, 72, 4), { w: 3, dry: .4, seed: ch.charCodeAt(0), bristles: 7, color: '100,16,10' });
  x.fillStyle = '#fbf3e3'; x.font = '48px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 0, 3);
  x.restore();
}
export function drawCap(ctx, parts, markIdx = -1, sub = null, a = 1) {
  if (!parts || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.textBaseline = 'alphabetic'; ctx.font = '58px Brush';
  const ws = parts.map(t => ctx.measureText(t).width);
  let x = (W - ws.reduce((p, c) => p + c, 0)) / 2, y = sub ? 940 : 990;
  // paper channel behind caption
  const tw = ws.reduce((p, c) => p + c, 0);
  ctx.fillStyle = 'rgba(239,229,207,.72)'; ctx.fillRect(x - 24, y - 58, tw + 48, sub ? 110 : 78);
  parts.forEach((tx, i) => {
    const red = i === markIdx;
    ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(239,229,207,.95)'; ctx.strokeText(tx, x + ws[i] / 2, y);
    ctx.fillStyle = red ? '#b8261d' : 'rgba(18,16,14,.95)'; ctx.textAlign = 'center';
    ctx.fillText(tx, x + ws[i] / 2, y);
    if (red) { ctx.strokeStyle = '#b8261d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x + ws[i], y + 10); ctx.stroke(); }
    x += ws[i];
  });
  if (sub) { ctx.font = '600 26px NSerif'; ctx.fillStyle = 'rgba(48,72,138,.9)'; ctx.textAlign = 'center'; ctx.fillText(sub, W / 2, y + 42); }
  ctx.restore();
}
export function vignette(ctx, a = .18) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .9);
  g.addColorStop(0, 'rgba(60,40,20,0)'); g.addColorStop(1, `rgba(60,40,20,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export function grain(ctx, seed = 1, a = .1) {
  const r = rng(seed); const id = ctx.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 16) { const v = (r() - .5) * 40 * a; d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, d[i] + v)); }
  // too slow for full frame — skip heavy grain in POST; use overlay pattern instead
}
export function horse(x, bx, by, s = 1) {
  // readable side-view horse: firm brush silhouette (not soft wash blob)
  x.save(); x.translate(bx, by); x.scale(s, s);
  // belly fill (light) then dark outline strokes
  x.fillStyle = 'rgba(36,28,20,.78)';
  x.beginPath();
  x.moveTo(10, 8); x.bezierCurveTo(40, -28, 120, -36, 175, -8);
  x.bezierCurveTo(205, 8, 200, 38, 170, 48); x.bezierCurveTo(100, 58, 40, 52, 8, 28);
  x.closePath(); x.fill();
  // neck + head block
  x.beginPath();
  x.moveTo(155, -10); x.bezierCurveTo(175, -45, 195, -78, 225, -88);
  x.bezierCurveTo(248, -92, 258, -78, 248, -66);
  x.bezierCurveTo(235, -58, 210, -42, 185, -18); x.closePath(); x.fill();
  // mane
  brush(x, [[200, -70], [188, -95], [210, -100], [225, -88]], { w: 5, dry: .35, seed: 2, bristles: 8, ink: .85 });
  // ear
  brush(x, [[230, -88], [242, -108], [248, -86]], { w: 4, dry: .2, seed: 1, bristles: 5 });
  // eye
  x.fillStyle = 'rgba(245,235,210,.9)'; x.beginPath(); x.arc(238, -72, 3.5, 0, 7); x.fill();
  // legs — distinct four, slight bend
  // legs — gallop: hind legs with hocks, one foreleg lifted & folded at the knee
  const legs = [
    [[30, 34], [18, 66], [30, 84], [22, 112]],      // hind far (hock)
    [[62, 40], [56, 72], [70, 90], [76, 112]],      // hind near (hock)
    [[140, 38], [150, 70], [138, 82], [158, 96]],   // fore lifted, folded knee
    [[170, 40], [182, 76], [178, 112]]              // fore planted
  ];
  legs.forEach((pts, i) => brush(x, pts, { w: i % 2 ? 10 : 8, dry: .2, seed: 10 + i, bristles: 8, ink: .95, taper: [.02, .3] }));
  legs.forEach(pts => { const [p, q] = pts.slice(-2); const a = Math.atan2(q[1] - p[1], q[0] - p[0]); x.save(); x.translate(q[0], q[1]); x.rotate(a - Math.PI / 2); x.fillStyle = 'rgba(20,16,12,.95)'; x.fillRect(-6, -2, 12, 7); x.restore(); });
  // muzzle + nostril, chest line, bridle & reins
  x.fillStyle = 'rgba(36,28,20,.85)'; x.beginPath(); x.ellipse(251, -64, 10, 8, .5, 0, 7); x.fill();
  x.fillStyle = 'rgba(245,235,210,.8)'; x.beginPath(); x.arc(256, -62, 1.8, 0, 7); x.fill();
  brush(x, [[190, 30], [200, 4], [196, -20]], { w: 3, dry: .4, seed: 33, bristles: 5, ink: .5 });
  x.strokeStyle = 'rgba(184,38,29,.9)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(226, -86); x.lineTo(250, -60); x.moveTo(232, -70); x.lineTo(252, -70); x.stroke();
  // saddle cloth (vermilion) + saddle
  x.fillStyle = 'rgba(184,38,29,.85)'; x.beginPath(); x.moveTo(86, -22); x.lineTo(150, -24); x.lineTo(146, 22); x.lineTo(90, 24); x.closePath(); x.fill();
  brush(x, [[84, -24], [116, -30], [152, -26]], { w: 6, dry: .2, seed: 34, bristles: 6 });
  brush(x, [[118, -20], [116, 30], [110, 40]], { w: 2, dry: .3, seed: 35, bristles: 3 }); // stirrup strap
  // tail flowing back
  brush(x, [[12, 6], [-30, -18], [-58, 8], [-48, 36]], { w: 9, dry: .4, seed: 20, bristles: 12, ink: .8 });
  // body contour reinforce
  brush(x, [[10, 10], [50, -24], [110, -32], [170, -6], [190, 20]], { w: 4, dry: .3, seed: 30, bristles: 6, ink: .55 });
  // rider — smaller, clearly seated on back (not a desk figure)
  x.fillStyle = 'rgba(24,20,16,.92)';
  // torso
  x.beginPath(); x.moveTo(95, -8); x.lineTo(108, -55); x.lineTo(138, -58); x.lineTo(148, -10); x.closePath(); x.fill();
  // head
  x.beginPath(); x.arc(124, -72, 16, 0, 7); x.fill();
  // helmet + red tassel, banner pole, reins to the bit
  x.beginPath(); x.moveTo(106, -76); x.quadraticCurveTo(124, -100, 142, -76); x.closePath(); x.fill();
  brush(x, [[124, -98], [116, -116], [104, -122]], { w: 5, dry: .3, seed: 41, bristles: 6, color: '184,38,29' });
  brush(x, [[104, -20], [92, -170]], { w: 3.5, dry: .2, seed: 42, bristles: 4 });
  x.fillStyle = 'rgba(184,38,29,.85)'; x.beginPath(); x.moveTo(92, -170); x.lineTo(54, -160); x.lineTo(60, -136); x.lineTo(94, -140); x.closePath(); x.fill();
  brush(x, [[140, -40], [175, -36], [200, -50], [244, -64]], { w: 2.5, dry: .25, seed: 40, bristles: 4 });
  brush(x, [[140, -40], [160, -30]], { w: 6, dry: .25, seed: 43, bristles: 6 });
  x.restore();
}
