// filmkit: cached-layer compositing for pure-code films (one page = one shot; layers built once, frames composited)
import { mkCanvas, rng, vignette } from './util.js';
export const W = 1080, H = 1920, FPS = 30;
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const eout = t => 1 - Math.pow(1 - t, 3);
export const ein = t => t * t * t;
export const back = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
// build a full-frame transparent layer by running fn(canvas, ctx)
export async function L(fn) { const c = mkCanvas(W, H); await fn(c, c.getContext('2d')); return c; }
// draw a cached layer with a transform about pivot (px,py)
export function lay(ctx, cv, { dx = 0, dy = 0, s = 1, sx = s, sy = s, rot = 0, px = 540, py = 960, a = 1, op = null } = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; if (op) ctx.globalCompositeOperation = op;
  ctx.translate(px + dx, py + dy); ctx.rotate(rot); ctx.scale(sx, sy); ctx.translate(-px, -py); ctx.drawImage(cv, 0, 0); ctx.restore(); }
// camera: zoom z about (cx,cy) + pan + shake
export function cam(ctx, z, cx = 540, cy = 960, dx = 0, dy = 0) { ctx.translate(cx + dx, cy + dy); ctx.scale(z, z); ctx.translate(-cx, -cy); }
export function shake(lt, hits, amp = 14, dur = .08) { let x = 0, y = 0; for (const h of hits) { const k = (lt - h) / dur; if (k >= 0 && k < 1) { const d = (1 - k) * amp; x += Math.sin(k * 40 + h * 9) * d; y += Math.cos(k * 33 + h * 7) * d; } } return [x, y]; }
// film grain: N pre-generated full-res noise layers, drawn with overlay
export function mkGrain(n = 4, amt = .5, seed = 9) { const out = []; for (let k = 0; k < n; k++) { const c = mkCanvas(W, H), x = c.getContext('2d'), id = x.createImageData(W, H), d = id.data, r = rng(seed + k * 101);
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() - .5) * 255 * amt; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } x.putImageData(id, 0, 0); out.push(c); } return out; }
export function grainOver(ctx, G, f, a = .35) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a; ctx.drawImage(G[f % G.length], 0, 0); ctx.restore(); }
export { vignette };
// DualMark caption: parts = [[text, mark]] with mark in R(推责/挡脸) B(Schlenker/事实) G(承担) or 0
export function caption(ctx, parts, lt, st, sub = null) {
  const k = eout(seg(lt, 0, .14)); ctx.save(); ctx.globalAlpha = k; ctx.textBaseline = 'alphabetic'; ctx.font = st.font;
  const ws = parts.map(([t]) => ctx.measureText(t).width); const tot = ws.reduce((a, b) => a + b, 0); let x = W / 2 - tot / 2; const y = st.y + (1 - k) * 18;
  parts.forEach(([t, m], i) => { const col = m ? st.marks[m] : st.base;
    if (st.halo) { ctx.lineJoin = 'round'; ctx.strokeStyle = st.halo; ctx.lineWidth = st.haloW; ctx.strokeText(t, x, y); }
    if (st.shadow) { ctx.shadowColor = st.shadow; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4; }
    ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.fillText(t, x, y); ctx.shadowColor = 'transparent';
    if (m) st.underline(ctx, x, y + 16, ws[i], st.marks[m], seg(lt, .08, .3));
    x += ws[i]; });
  if (sub) { ctx.font = st.subFont; ctx.textAlign = 'center'; if (st.halo) { ctx.strokeStyle = st.halo; ctx.lineWidth = st.haloW * .6; ctx.strokeText(sub, W / 2, y + st.subDy); } ctx.fillStyle = st.subCol; ctx.fillText(sub, W / 2, y + st.subDy); }
  ctx.restore(); }
