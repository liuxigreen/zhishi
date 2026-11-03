import * as N from '../style-ink/scene.js';
import { rng, mkCanvas } from '../../core/util.js';
export const W = 1920, H = 1080, FPS = 30;
export const { brush, sweepBrush, wash, pth, ell, circ, paperBase, rectPts, figure, seal: sealDrawN } = N;
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
  const legs = [
    [[35, 42], [28, 78], [32, 110]],
    [[70, 46], [78, 82], [74, 112]],
    [[130, 40], [122, 76], [128, 108]],
    [[168, 42], [178, 78], [172, 110]]
  ];
  legs.forEach((pts, i) => brush(x, pts, { w: 9, dry: .22, seed: 10 + i, bristles: 7, ink: .92 }));
  // hooves
  legs.forEach(pts => { const tip = pts[pts.length - 1]; x.fillStyle = 'rgba(20,16,12,.9)'; x.fillRect(tip[0] - 6, tip[1] - 2, 12, 6); });
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
  // arm holding rein
  brush(x, [[140, -40], [175, -28], [200, -20]], { w: 5, dry: .25, seed: 40, bristles: 5 });
  x.restore();
}
