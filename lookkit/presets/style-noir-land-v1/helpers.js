// style-noir-land-v1 helpers · deep blue-black + single sodium amber
import { rng, fbm, grain, vignette as vigCore, mkCanvas } from '../../core/util.js';
export { rng, mkCanvas, fbm, grain };
export const W = 1920, H = 1080, FPS = 30;
export const AMB = 'rgba(255,186,96,';
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
export function vignette(x, a = .62) { vigCore(x, W, H, a); }

export function wall(x, top = '#0c1118', bot = '#06080b', s = 80, amt = 22, seed = 1) {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const id = x.getImageData(0, 0, W, H), d = id.data;
  for (let y = 0; y < H; y += 2) for (let i = 0; i < W; i += 2) {
    const n = (fbm(i / s + seed, y / s, 3) - .5) * amt;
    for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const k = ((y + b) * W + i + a) * 4; d[k] += n; d[k + 1] += n; d[k + 2] += n * 1.15; }
  }
  x.putImageData(id, 0, 0);
}
export function cone(x, lx, ly, w0, xl, xr, yb, a = .5) {
  x.save(); x.globalCompositeOperation = 'screen';
  const p = new Path2D(); p.moveTo(lx - w0, ly); p.lineTo(lx + w0, ly); p.lineTo(xr, yb); p.lineTo(xl, yb); p.closePath();
  const g = x.createLinearGradient(0, ly, 0, yb); g.addColorStop(0, AMB + a + ')'); g.addColorStop(.7, AMB + a * .3 + ')'); g.addColorStop(1, AMB + a * .08 + ')');
  x.filter = 'blur(22px)'; x.fillStyle = g; x.fill(p); x.filter = 'none'; x.restore(); return p;
}
export function glow(x, cx, cy, r, a = .9) {
  x.save(); x.globalCompositeOperation = 'screen';
  const g = x.createRadialGradient(cx, cy, 1, cx, cy, r);
  g.addColorStop(0, 'rgba(255,244,220,' + a + ')'); g.addColorStop(.25, AMB + a * .7 + ')'); g.addColorStop(1, AMB + '0)');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
}
export function rain(x, seed, n = 900, a = .22, x0 = 0, x1 = W) {
  const r = rng(seed); x.save(); x.globalCompositeOperation = 'screen'; x.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const px = x0 + r() * (x1 - x0), py = r() * H, l = 18 + r() * 34;
    x.strokeStyle = `rgba(190,200,215,${a * (.3 + r())})`; x.lineWidth = .8 + r() * 1.2;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px - l * .18, py + l); x.stroke();
  }
  x.restore();
}
export function sil(x, draw, dx, dy, body = ['#1a1714', '#050506'], rimA = .95, glowA = .55) {
  const m = mkCanvas(W, H), M = m.getContext('2d'); M.fillStyle = '#fff'; draw(M);
  const rimC = mkCanvas(W, H), R = rimC.getContext('2d'); R.drawImage(m, 0, 0); R.globalCompositeOperation = 'destination-out'; R.drawImage(m, dx, dy);
  R.globalCompositeOperation = 'source-in'; R.fillStyle = AMB + rimA + ')'; R.fillRect(0, 0, W, H);
  const b = mkCanvas(W, H), B = b.getContext('2d'); const g = B.createLinearGradient(0, 0, 0, H); g.addColorStop(0, body[0]); g.addColorStop(1, body[1]);
  B.fillStyle = g; B.fillRect(0, 0, W, H); B.globalCompositeOperation = 'destination-in'; B.drawImage(m, 0, 0);
  x.drawImage(b, 0, 0); x.drawImage(rimC, 0, 0);
  x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = glowA; x.filter = 'blur(9px)'; x.drawImage(rimC, 0, 0); x.restore(); x.filter = 'none';
}
export function face(x, cx, cy, r, emo = 'neutral', look = 0, lit = .6, tilt = 0) {
  x.save(); x.translate(cx, cy); x.rotate(tilt);
  const g = x.createRadialGradient(r * .35 * Math.sign(look || 1), -r * .2, r * .1, 0, 0, r * 1.15);
  g.addColorStop(0, `rgba(${Math.round(150 + 80 * lit)},${Math.round(110 + 60 * lit)},${Math.round(70 + 40 * lit)},1)`); g.addColorStop(1, '#2a1d14');
  x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, r * .82, r, 0, 0, 7); x.fill();
  const ex = r * .34, ey = -r * .08, ew = r * .19;
  const eh = ({ neutral: .09, certain: .055, anxious: .13, hurt: .07, hollow: .07, angry: .06 }[emo] || .09) * r;
  for (const s of [-1, 1]) {
    x.fillStyle = '#efe4d2'; x.beginPath(); x.ellipse(s * ex + look * r * .06, ey, ew, eh, 0, 0, 7); x.fill();
    x.fillStyle = '#120c08'; x.beginPath(); x.arc(s * ex + look * r * .12, ey + (emo === 'hurt' || emo === 'hollow' ? eh * .35 : 0), Math.min(eh * .95, ew * .5), 0, 7); x.fill();
    x.fillStyle = 'rgba(255,240,215,.9)'; x.beginPath(); x.arc(s * ex + look * r * .12 + 2, ey - 2, r * .022, 0, 7); x.fill();
    const by = ey - r * .2; x.strokeStyle = '#140d09'; x.lineWidth = r * .065; x.lineCap = 'round'; x.beginPath();
    if (emo === 'certain' || emo === 'angry') { x.moveTo(s * (ex + ew), by - r * .04); x.lineTo(s * (ex - ew * .9), by + r * .06); }
    else if (emo === 'anxious') { x.moveTo(s * (ex + ew), by + r * .03); x.lineTo(s * (ex - ew * .9), by - r * .08); }
    else if (emo === 'hurt' || emo === 'hollow') { x.moveTo(s * (ex + ew), by + r * .05); x.lineTo(s * (ex - ew), by - r * .02); }
    else { x.moveTo(s * (ex + ew), by); x.lineTo(s * (ex - ew), by - r * .01); }
    x.stroke();
  }
  x.strokeStyle = 'rgba(40,24,14,.7)'; x.lineWidth = r * .04; x.beginPath(); x.moveTo(r * .03, -r * .02); x.lineTo(-r * .05, r * .24); x.lineTo(r * .06, r * .27); x.stroke();
  x.strokeStyle = '#1a0f0a'; x.lineWidth = r * .055; x.beginPath(); const my = r * .5;
  if (emo === 'certain' || emo === 'angry') { x.moveTo(-r * .2, my); x.lineTo(r * .2, my - r * .01); }
  else if (emo === 'anxious') { x.ellipse(0, my, r * .1, r * .07, 0, 0, 7); }
  else if (emo === 'hurt' || emo === 'hollow') { x.moveTo(-r * .18, my + r * .04); x.quadraticCurveTo(0, my - r * .04, r * .18, my + r * .04); }
  else { x.moveTo(-r * .16, my); x.quadraticCurveTo(0, my + r * .02, r * .16, my); }
  x.stroke(); x.restore();
}
export function ticket(x, cx, cy, a = 0, s = 1, label = '车票 · 案发当晚') {
  x.save(); x.translate(cx, cy); x.rotate(a); x.scale(s, s);
  x.fillStyle = '#e2d2ae'; x.fillRect(-90, -36, 180, 72);
  x.strokeStyle = '#3a2a1a'; x.lineWidth = 2; x.strokeRect(-90, -36, 180, 72);
  x.fillStyle = '#3a2a1a'; x.font = '600 22px NSerif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(label, 0, -8); x.font = '500 18px NSerif'; x.fillText('当晚在外地', 0, 18);
  x.restore();
}
export function finish(x, seed) { vignette(x, .62); grain(x, W, H, .05, seed); }
