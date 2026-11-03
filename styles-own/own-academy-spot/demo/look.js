/** look.js — Academy Spot · 暗室聚光. Darkroom stage, top-light cones, blueprint hairlines.
 * Measured on zhongshan-learn: void ~#1A1816 / #0C0B0A, gold #E5C07B, novice blue #A8C4D8,
 * blueprint #7EB8C9 dashed, floor grid faint brown. Landscape 1920×1080. */
export const W = 1920, H = 1080;
export const P = {
  void: '#0C0B0A', voidMid: '#1A1816', voidLite: '#2A2622',
  floor: '#241F1A', grid: 'rgba(120,100,70,0.18)',
  gold: '#E5C07B', goldHot: '#F5D89A', goldDim: '#A8884A', goldSoft: 'rgba(229,192,123,0.22)',
  blue: '#A8C4D8', blueHot: '#C6DCEB', blueDim: '#6A8AA0', blueSoft: 'rgba(168,196,216,0.22)',
  blueprint: '#7EB8C9', blueprintHot: '#A8D8E4',
  cream: '#EDE6D6', white: '#F4F0E8', mute: '#9A9080',
  red: '#D8634F', orange: '#E08A4A', tan: '#C4A882',
  card: 'rgba(40,36,30,0.78)', cardLine: 'rgba(180,160,120,0.55)',
};
export const SERIF = '"Noto Serif SC", serif';
export const SANS = '"Noto Sans SC", sans-serif';
export const MONO = '"Geist Mono", monospace';
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export function rng(seed = 1) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; }; }
export function hexRgb(h) {
  if (!h) return [0, 0, 0];
  if (h.startsWith('rgb')) return h.match(/[\d.]+/g).slice(0, 3).map(Number);
  h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
export const rgba = (h, a) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; };
export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr); ctx.arcTo(x, y + h, x, y, rr); ctx.arcTo(x, y, x + w, y, rr); ctx.closePath();
}

/** Darkroom void with warm dust + optional floor grid (zhongshan f_00013 / scene s_0002). */
let _voidCache = null;
function makeVoid() {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const g = x.createRadialGradient(W * 0.5, H * 0.42, 40, W * 0.5, H * 0.5, H * 0.85);
  g.addColorStop(0, '#221E1A'); g.addColorStop(0.45, P.voidMid); g.addColorStop(1, '#050504');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const r = rng(11);
  for (let i = 0; i < 900; i++) {
    x.fillStyle = `rgba(255,245,220,${0.015 + r() * 0.05})`;
    x.fillRect(r() * W, r() * H, 1 + r() * 1.4, 1 + r() * 1.4);
  }
  return c;
}
export function paintDarkroom(ctx, { floorY = 860, grid = true, a = 1 } = {}) {
  _voidCache = _voidCache || makeVoid();
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(_voidCache, 0, 0); ctx.restore();
  if (grid) {
    ctx.save(); ctx.strokeStyle = P.grid; ctx.lineWidth = 1;
    // perspective floor grid
    const horizon = floorY - 180;
    for (let i = 0; i < 14; i++) {
      const t = i / 13; const y = lerp(horizon, floorY + 40, t * t);
      ctx.globalAlpha = 0.08 + t * 0.18;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let i = -10; i <= 10; i++) {
      const x0 = W / 2 + i * 90; const x1 = W / 2 + i * 220;
      ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.moveTo(x0, horizon); ctx.lineTo(x1, floorY + 60); ctx.stroke();
    }
    ctx.restore();
  }
}

/** Soft top-light cone (顶光锥) — feathered trapezoid + floor pool. */
export function spotCone(ctx, cx, yTop, yFloor, { wTop = 40, wFloor = 280, color = P.gold, a = 0.35, dust = 18, seed = 3 } = {}) {
  ctx.save();
  const g = ctx.createLinearGradient(cx, yTop, cx, yFloor);
  const [r, gg, b] = hexRgb(color);
  g.addColorStop(0, `rgba(${r},${gg},${b},${a * 0.55})`);
  g.addColorStop(0.55, `rgba(${r},${gg},${b},${a * 0.18})`);
  g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(cx - wTop / 2, yTop); ctx.lineTo(cx + wTop / 2, yTop);
  ctx.lineTo(cx + wFloor / 2, yFloor); ctx.lineTo(cx - wFloor / 2, yFloor); ctx.closePath();
  ctx.fill();
  // floor pool
  const pg = ctx.createRadialGradient(cx, yFloor, 4, cx, yFloor, wFloor * 0.55);
  pg.addColorStop(0, `rgba(${r},${gg},${b},${a * 0.45})`); pg.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(cx, yFloor, wFloor * 0.55, wFloor * 0.12, 0, 0, 7); ctx.fill();
  // dust motes in cone
  if (dust > 0) {
    const R = rng(seed);
    for (let i = 0; i < dust; i++) {
      const t = R(); const x = lerp(cx - wTop / 2, cx + wFloor / 2, R());
      const y = lerp(yTop, yFloor, t);
      ctx.fillStyle = `rgba(255,245,220,${0.08 + R() * 0.2})`;
      ctx.beginPath(); ctx.arc(x + (R() - 0.5) * wFloor * t, y, 1 + R() * 1.5, 0, 7); ctx.fill();
    }
  }
  ctx.restore();
}

/** Soft circular pool (for props under light). */
export function glowPool(ctx, x, y, R, color = P.gold, a = 0.3) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, R);
  const [r, gg, b] = hexRgb(color);
  g.addColorStop(0, `rgba(${r},${gg},${b},${a})`); g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
}

/** Glow stroke via layered alpha (no shadowBlur). */
export function glowStroke(ctx, drawPath, { color = P.gold, width = 2, bloom = 3, alpha = 1 } = {}) {
  ctx.save();
  for (let i = bloom; i >= 1; i--) {
    ctx.globalAlpha = alpha * (0.1 / i); ctx.strokeStyle = color; ctx.lineWidth = width + i * 3.4;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; drawPath(); ctx.stroke();
  }
  ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; drawPath(); ctx.stroke();
  ctx.restore();
}

export function contactShadow(ctx, x, y, w, a = 0.4) {
  ctx.save();
  const g = ctx.createRadialGradient(x, y, 0, x, y, w * 0.55);
  g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, w * 0.55, w * 0.12, 0, 0, 7); ctx.fill();
  ctx.restore();
}

/** Blueprint dashed line helper. */
export function bpStroke(ctx, drawPath, { color = P.blueprint, width = 1.6, dash = [6, 5], alpha = 0.9, glow = false } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 8; }
  drawPath(); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}

/** Topic chip / brand. */
export function chip(ctx, x, y, text, { num = 0, color = P.gold, a = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = a; ctx.font = `600 22px ${SANS}`;
  const tw = ctx.measureText(text).width; const pad = 14; const h = 36; const nw = num ? 28 : 0;
  roundRect(ctx, x, y - h / 2, tw + pad * 2 + nw, h, 8);
  ctx.fillStyle = 'rgba(30,26,22,0.72)'; ctx.fill();
  ctx.strokeStyle = rgba(color, 0.55); ctx.lineWidth = 1.4; ctx.stroke();
  if (num) {
    ctx.beginPath(); ctx.arc(x + 18, y, 11, 0, 7); ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = P.void; ctx.font = `700 16px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(num), x + 18, y + 1);
  }
  ctx.fillStyle = P.cream; ctx.font = `600 22px ${SANS}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(text, x + pad + nw, y); ctx.restore();
  return tw + pad * 2 + nw;
}

/** Caption band — serif white, key words gold/blue, ≥4.5:1 on dark. */
export function caption(ctx, segs, { y = 960, size = 42, a = 1, band = true } = {}) {
  ctx.save(); ctx.globalAlpha = a;
  const lines = Array.isArray(segs[0]) ? segs : [segs];
  if (band) {
    const bh = lines.length * size * 1.45 + 28;
    const g = ctx.createLinearGradient(0, y - bh / 2, 0, y + bh / 2);
    g.addColorStop(0, 'rgba(8,7,6,0)'); g.addColorStop(0.3, 'rgba(8,7,6,0.72)'); g.addColorStop(0.7, 'rgba(8,7,6,0.72)'); g.addColorStop(1, 'rgba(8,7,6,0)');
    ctx.fillStyle = g; ctx.fillRect(0, y - bh / 2, W, bh);
  }
  ctx.font = `700 ${size}px ${SERIF}`; ctx.textBaseline = 'middle';
  lines.forEach((ln, li) => {
    const w = ln.reduce((s, g) => s + ctx.measureText(g.t).width, 0);
    let x = W / 2 - w / 2; const yy = y + (li - (lines.length - 1) / 2) * size * 1.45;
    ln.forEach(g => {
      ctx.fillStyle = g.gold ? P.goldHot : g.blue ? P.blueHot : P.white;
      ctx.fillText(g.t, x, yy); x += ctx.measureText(g.t).width;
    });
  });
  ctx.restore();
}

export function cite(ctx, text, { x = W - 40, y = H - 28, a = 0.7 } = {}) {
  ctx.save(); ctx.globalAlpha = a; ctx.font = `400 18px ${SERIF}`; ctx.fillStyle = P.mute;
  ctx.textAlign = 'right'; ctx.fillText(text, x, y); ctx.restore();
}

export function vignette(ctx, a = 0.45) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.78);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

/** Soft pendant lamp shade (zhongshan f_00013). */
export function pendant(ctx, cx, y, { w = 70, h = 36, on = 1 } = {}) {
  ctx.save();
  // cord
  ctx.strokeStyle = rgba(P.mute, 0.5); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, y - h / 2); ctx.stroke();
  // shade trapezoid
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.35, y - h / 2); ctx.lineTo(cx + w * 0.35, y - h / 2);
  ctx.lineTo(cx + w * 0.55, y + h / 2); ctx.lineTo(cx - w * 0.55, y + h / 2); ctx.closePath();
  ctx.fillStyle = mix(P.voidLite, P.gold, 0.15 * on); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, 0.35); ctx.lineWidth = 1.2; ctx.stroke();
  // inner glow
  if (on > 0) {
    const g = ctx.createRadialGradient(cx, y + h / 2, 2, cx, y + h / 2, w);
    g.addColorStop(0, rgba(P.goldHot, 0.55 * on)); g.addColorStop(1, rgba(P.goldHot, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, y + h / 2, w, 0, 7); ctx.fill();
  }
  ctx.restore();
}
