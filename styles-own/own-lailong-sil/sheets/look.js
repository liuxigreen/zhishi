/** Lailong Silhouette History — look / material / light lib.
 * Palette measured from 5918, zhaoyun, 2217, 3678, xuanzang. */
export const P = {
  void: '#100C09',
  voidSoft: '#1A120C',
  earth: '#2B1D13',
  ridge: '#3A2A1C',
  cream: '#F5F0E6',
  paper: '#EDE6D8',
  ink: '#3A2E24',
  fire: '#E0B85A',
  fireHot: '#FF8C00',
  fireCore: '#F5D080',
  markBlue: '#6BA3C9',
  markRed: '#C45C4A',
  jade: '#B8D4C8',
  robe: '#C45C2A',
  cite: '#8A8078',
  mute: '#5A4A3A',
  hat: '#1A1410',
  white: '#F8F4EA',
  pillar: '#6B2A24',
  lamp: '#E8C070',
};

export function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
export function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export const ease = {
  clamp01: x => Math.max(0, Math.min(1, x)),
  outCubic: x => 1 - Math.pow(1 - x, 3),
  inOut: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
  outBack: x => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
  settle: (x, f = 3, d = 5) => 1 - Math.exp(-d * x) * Math.cos(f * Math.PI * x),
};

/** Warm earth void with optional stars (night) and vignette. */
export function paintVoid(ctx, w, h, { cx = 0.5, cy = 0.42, warm = 0.7, stars = 0.6, seed = 11 } = {}) {
  ctx.fillStyle = P.void;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.hypot(w, h) * 0.7);
  g.addColorStop(0, `rgba(60,42,28,${0.28 * warm})`);
  g.addColorStop(0.45, `rgba(30,22,16,0.1)`);
  g.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (stars > 0) {
    const r = rng(seed);
    ctx.save();
    for (let i = 0; i < 90 * stars; i++) {
      const x = r() * w, y = r() * h * 0.62, a = 0.15 + r() * 0.55;
      ctx.globalAlpha = a * stars;
      ctx.fillStyle = r() < 0.08 ? P.fireCore : P.cream;
      ctx.fillRect(x, y, 1.2 + r(), 1.2 + r());
    }
    ctx.restore();
  }
}

export function glowStroke(ctx, drawPath, { color = P.fire, width = 1.6, bloom = 4, alpha = 1 } = {}) {
  ctx.save();
  for (let i = bloom; i >= 1; i--) {
    ctx.globalAlpha = alpha * (0.1 / i);
    ctx.strokeStyle = color;
    ctx.lineWidth = width + i * 3.4;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    drawPath(); ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  drawPath(); ctx.stroke();
  ctx.restore();
}

export function glowFill(ctx, drawPath, { color = P.fire, alpha = 0.2 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; drawPath(); ctx.fill(); ctx.restore();
}

export function hair(ctx, x0, y0, x1, y1, color = P.mute, w = 1) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.restore();
}

/** signalChip — 平安 / 告警 / 缺席 */
export function signalChip(ctx, x, y, state, label) {
  const col = state === 'peace' ? P.fire : state === 'alarm' ? P.fireHot : P.markRed;
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(20,14,10,0.78)';
  roundRect(ctx, x, y, label.length * 15 + 28, 26, 4); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x + 12, y + 13, 4, 0, Math.PI * 2); ctx.fill();
  ctx.font = '600 14px "Noto Serif SC", serif';
  ctx.fillStyle = P.cream; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + 22, y + 13);
  ctx.restore();
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Top-left hero block (family signature). */
export function hero(ctx, lines, { x = 80, y = 70 } = {}) {
  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  let yy = y;
  for (const L of lines) {
    ctx.font = `${L.weight || 700} ${L.size || 48}px "${L.font || 'Noto Serif SC'}", serif`;
    ctx.fillStyle = L.color || P.cream;
    ctx.globalAlpha = L.a ?? 1;
    ctx.fillText(L.text, x, yy);
    if (L.mark) {
      const tw = ctx.measureText(L.text).width;
      const mk = L.mark === 'red' ? P.markRed : P.markBlue;
      ctx.strokeStyle = mk; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, yy + (L.size || 48) + 4); ctx.lineTo(x + tw, yy + (L.size || 48) + 4); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, yy + (L.size || 48) + 9); ctx.lineTo(x + tw, yy + (L.size || 48) + 9); ctx.stroke();
      // recolour keyword if provided
      if (L.keyFrom != null) {
        const before = L.text.slice(0, L.keyFrom);
        const key = L.text.slice(L.keyFrom, L.keyTo);
        const bx = x + ctx.measureText(before).width;
        ctx.fillStyle = mk; ctx.fillText(key, bx, yy);
      }
    }
    yy += (L.size || 48) * 1.25;
  }
  ctx.restore();
  return yy;
}

export function caption(ctx, text, { x = 960, y = 1000, size = 22, color = P.cite, font = 'Noto Serif SC', weight = 500, align = 'center' } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px "${font}", serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.9; ctx.fillText(text, x, y); ctx.restore();
}

export function sourceFooter(ctx, text = '据史料示意 · 非原件复刻') {
  caption(ctx, text, { y: 1048, size: 14, color: P.cite });
}

export function brand(ctx) {
  ctx.save();
  ctx.strokeStyle = P.mute; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
  roundRect(ctx, 1680, 36, 180, 36, 2); ctx.stroke();
  ctx.font = '500 14px "Noto Serif SC", serif';
  ctx.fillStyle = P.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('知 识 大 赏', 1770, 54);
  ctx.restore();
}

/** Crescent moon. */
export function moon(ctx, x, y, r = 28, phase = 0.7) {
  ctx.save();
  // soft halo
  const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3.2);
  g.addColorStop(0, `rgba(245,240,230,${0.22 * phase})`);
  g.addColorStop(0.35, `rgba(245,240,230,${0.08 * phase})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
  // crescent via path difference
  ctx.fillStyle = P.cream; ctx.globalAlpha = 0.92 * phase;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.arc(x + r * 0.42, y - r * 0.08, r * 0.88, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/** Soft ground / stage floor. */
export function ground(ctx, y, { w = 1920, color = P.earth } = {}) {
  const g = ctx.createLinearGradient(0, y - 40, 0, y + 200);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.3, color);
  g.addColorStop(1, '#0A0806');
  ctx.fillStyle = g;
  ctx.fillRect(0, y - 40, w, 400);
}

/** Distant mountain silhouettes (5918 t0). */
export function mountains(ctx, { y = 720, color = '#0A0806', peaks = null } = {}) {
  const pts = peaks || [[0, 40], [180, -60], [360, 10], [520, -90], [700, -20], [900, -70], [1100, 0], [1300, -50], [1500, 20], [1700, -40], [1920, 30]];
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, 1080);
  ctx.lineTo(0, y + pts[0][1]);
  for (const [x, dy] of pts) ctx.lineTo(x, y + dy);
  ctx.lineTo(1920, 1080); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** Distant warm settlement glow. */
export function distantGlow(ctx, x, y, r = 120, a = 0.35) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,150,60,${a})`);
  g.addColorStop(0.4, `rgba(200,100,40,${a * 0.35})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

/** Wavy terrain hairlines behind subject (5918). */
export function terrainWaves(ctx, y0 = 640, n = 5) {
  ctx.save();
  ctx.strokeStyle = 'rgba(180,160,130,0.07)'; ctx.lineWidth = 1.2;
  for (let i = 0; i < n; i++) {
    const yy = y0 + i * 28;
    ctx.beginPath();
    ctx.moveTo(100, yy);
    for (let x = 100; x < 1800; x += 40) {
      ctx.lineTo(x, yy + Math.sin(x * 0.01 + i) * 8);
    }
    ctx.stroke();
  }
  ctx.restore();
}
