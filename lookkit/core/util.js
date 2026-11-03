// lookkit core utils: rng, noise, grain, paper, vignette, path helpers
export function rng(seed = 1) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const P = new Uint8Array(512); { const r = rng(1337); const a = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } for (let i = 0; i < 512; i++) P[i] = a[i & 255]; }
const fade = t => t * t * (3 - 2 * t);
export function noise2(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const h = (i, j) => P[(P[(xi + i) & 255] + yi + j) & 255] / 255;
  const u = fade(xf), v = fade(yf);
  return (h(0,0) * (1-u) + h(1,0) * u) * (1-v) + (h(0,1) * (1-u) + h(1,1) * u) * v; }
export function fbm(x, y, o = 4) { let a = 0, f = 1, w = 0.5, n = 0; for (let i = 0; i < o; i++) { a += w * noise2(x * f, y * f); n += w; f *= 2; w *= .5; } return a / n; }
export function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// film/paper grain overlay; amt 0..1
export function grain(ctx, W, H, amt = .06, seed = 3) { const r = rng(seed); const id = ctx.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const g = (r() - .5) * 255 * amt; d[i] += g; d[i+1] += g; d[i+2] += g; } ctx.putImageData(id, 0, 0); }
// tileable paper fiber texture (grayscale around 128) for multiply/overlay
export function paperTexture(size = 512, fibers = 900, seed = 5) { const c = mkCanvas(size, size), x = c.getContext('2d'), r = rng(seed);
  const id = x.createImageData(size, size), d = id.data;
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const n = fbm(i / 40, j / 40, 4) * .6 + r() * .4; const v = 200 + n * 55; const k = (j * size + i) * 4; d[k] = d[k+1] = d[k+2] = v; d[k+3] = 255; }
  x.putImageData(id, 0, 0); x.lineCap = 'round';
  for (let i = 0; i < fibers; i++) { const px = r() * size, py = r() * size, a = r() * 6.28, l = 6 + r() * 26; x.strokeStyle = `rgba(${r() < .5 ? '255,255,255' : '120,110,100'},${.08 + r() * .14})`; x.lineWidth = .5 + r();
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + .5) * l * .5, py + Math.sin(a + .5) * l * .5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  return c; }
export function vignette(ctx, W, H, strength = .55, color = '0,0,0') { const g = ctx.createRadialGradient(W/2, H*.48, Math.min(W,H)*.25, W/2, H*.5, Math.hypot(W,H)*.6);
  g.addColorStop(0, `rgba(${color},0)`); g.addColorStop(1, `rgba(${color},${strength})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// jittered closed polygon from points -> path (paper-cut irregular edges)
export function wobblePath(ctx, pts, amp = 2, seed = 9, step = 14) { const r = rng(seed); ctx.beginPath();
  for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length]; const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 0; k < n; k++) { const t = k / n; const x = x0 + (x1 - x0) * t + (r() - .5) * amp, y = y0 + (y1 - y0) * t + (r() - .5) * amp; (i === 0 && k === 0) ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } }
  ctx.closePath(); }
// sample a Path2D-like shape defined as fn(ctx) into polygon via ellipse helper
export function ellipsePts(cx, cy, rx, ry, n = 36, a0 = 0, a1 = Math.PI * 2) { const p = []; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; }
export function lerp(a, b, t) { return a + (b - a) * t; }
// excuse slip texts shared across styles
export const SLIPS = ['路上堵车', '最近太忙', '不是故意的', '你也有错', '手滑了', '我压力大', '谁都会犯错', '盘子本来就裂了'];
