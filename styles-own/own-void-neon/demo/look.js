/** Void Neon — look / material / light. Measured from 5155 / 0345 / 3785 / 9472. */
export const P = {
  void: '#030108',
  voidMid: '#0B061A',
  voidSoft: '#130B2A',
  nebula: '#1D123B',
  hair: 'rgba(232,224,244,0.72)',
  neon: '#E8E0F4',
  neonHot: '#FFFFFF',
  magenta: '#E87AB0',
  magentaDim: '#A05078',
  cyan: '#7EC8E8',
  cyanDim: '#3A7088',
  cream: '#E7DDC7',
  gold: '#D2A15B',
  bio: '#E06080',
  mute: '#666072',
  paper: '#DFD8E4',
  danger: '#C45A6A',
  ok: '#6ABA9A',
  ink: '#3B344B',
};

export function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
export function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Deep purple void + sparse star dust + soft nebula. Cite 5155 t6.5 / t86. */
export function paintVoid(ctx, w, h, { cx = 0.5, cy = 0.42, warm = 0.4, stars = 1 } = {}) {
  ctx.fillStyle = P.void;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.hypot(w, h) * 0.7);
  g.addColorStop(0, `rgba(70,35,120,${0.42 * warm})`);
  g.addColorStop(0.35, `rgba(35,18,70,${0.28 * warm})`);
  g.addColorStop(0.7, `rgba(12,6,28,0.35)`);
  g.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // soft bokeh patches (5155), not sharp starfield
  if (stars > 0) {
    const r = rng(91);
    ctx.save();
    for (let i = 0; i < 18 * stars; i++) {
      const x = r() * w, y = r() * h * 0.75, rad = 18 + r() * 70;
      const gg = ctx.createRadialGradient(x, y, 0, x, y, rad);
      gg.addColorStop(0, `rgba(180,120,220,${0.07 + r() * 0.08})`);
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < 40 * stars; i++) {
      const x = r() * w, y = r() * h, a = 0.05 + r() * 0.2, rad = 0.5 + r() * 1.1;
      ctx.globalAlpha = a;
      ctx.fillStyle = P.neon;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

export function glowStroke(ctx, drawPath, { color = P.neon, width = 1.6, bloom = 4, alpha = 1 } = {}) {
  ctx.save();
  for (let i = bloom; i >= 1; i--) {
    ctx.globalAlpha = alpha * (0.07 / i);
    ctx.strokeStyle = color;
    ctx.lineWidth = width + i * 3.6;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    drawPath(); ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  drawPath(); ctx.stroke();
  ctx.restore();
}

export function glowFill(ctx, drawPath, { color = P.neon, alpha = 0.15 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; drawPath(); ctx.fill(); ctx.restore();
}

export function hair(ctx, x0, y0, x1, y1, color = P.mute, w = 1) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
}

export const ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  outBack: t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  clamp01: t => Math.max(0, Math.min(1, t)),
};

export function strokeDrawOn(ctx, pathFn, t, { color = P.neon, width = 1.6, len = 900, bloom = 3 } = {}) {
  const u = ease.outCubic(ease.clamp01(t));
  ctx.save();
  ctx.setLineDash([len * u, len]);
  glowStroke(ctx, pathFn, { color, width, bloom, alpha: 0.3 + 0.7 * u });
  ctx.setLineDash([]);
  ctx.restore();
}

/** State chip — our addition: 卡住 / 试探 / 顿悟 / 连上. */
export function stateChip(ctx, x, y, state, label) {
  const map = { stuck: P.mute, probe: P.cyan, flash: P.magenta, linked: P.ok, risk: P.danger };
  const c = map[state] || P.neon;
  ctx.save();
  ctx.font = '500 13px "Inter Tight", sans-serif';
  const tw = ctx.measureText(label).width;
  const w = tw + 28, h = 22;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(8,4,18,0.78)';
  roundRect(ctx, x, y, w, h, 11); ctx.fill();
  ctx.strokeStyle = c; ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 11); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 11, y + 11, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = c; ctx.fill();
  ctx.fillStyle = P.paper; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + 20, y + 12);
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
export function caption(ctx, text, { x = 960, y = 1000, size = 28, color = P.paper, font = 'Noto Serif SC', weight = 500, align = 'center', key } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px "${font}", "Noto Sans CJK SC", sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 10;
  ctx.fillText(text, x, y);
  ctx.restore();
}
export function titleBlock(ctx, lines, { x = 80, y = 70 } = {}) {
  let yy = y;
  for (const L of lines) {
    ctx.save();
    ctx.font = `${L.weight || 600} ${L.size || 42}px "${L.font || 'Noto Serif SC'}", sans-serif`;
    ctx.fillStyle = L.color || P.paper;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 6;
    ctx.fillText(L.text, x, yy);
    ctx.restore();
    yy += (L.size || 42) * 1.35;
  }
  return yy;
}

/** Horizon floor glow — signature of 5155. */
export function horizon(ctx, y, { w = 1920, glow = 1, color = P.neon } = {}) {
  ctx.save();
  const g = ctx.createLinearGradient(0, y - 40, 0, y + 60);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.55, `rgba(232,224,244,${0.08 * glow})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, y - 40, w, 100);
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(w - 80, y); }, { color, width: 1.2, bloom: 5, alpha: 0.85 * glow });
  // bokeh orbs along horizon (5155 t6.5)
  const r = rng(42);
  for (let i = 0; i < 10; i++) {
    const x = 120 + r() * (w - 240), a = 0.15 + r() * 0.35, rad = 3 + r() * 7;
    ctx.globalAlpha = a * glow;
    const gg = ctx.createRadialGradient(x, y - 2, 0, x, y - 2, rad);
    gg.addColorStop(0, r() < 0.3 ? P.magenta : P.cream);
    gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y - 2, rad, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
