/** Dark Gold Line — look / material / light lib.
 * Palette measured from moyou-darkgold, ember-craving, xiaomo-disarm, halo. */
export const P = {
  void: '#070708',
  voidSoft: '#0C0C0E',
  charcoal: '#14151A',
  slate: '#2A2C34',
  ink: '#52545A',
  paper: '#E8E6E1',
  gold: '#E8B84A',
  goldHot: '#F5C84A',
  goldDim: '#A07830',
  goldFill: 'rgba(232,184,74,0.18)',
  white: '#F2F1EC',
  mute: '#9A9A96',
  danger: '#C45A4A',
  ok: '#5A9A7A',
  coolGlow: '#A8C4E8',
};

/** Seeded RNG — deterministic. */
export function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}

export function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Soft radial spotlight vignette — signature of this family. */
export function paintVoid(ctx, w, h, { warm = 0.55, cx = 0.5, cy = 0.48, r = 0.62 } = {}) {
  ctx.fillStyle = P.void;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.hypot(w, h) * r);
  g.addColorStop(0, `rgba(40,32,22,${0.22 * warm})`);
  g.addColorStop(0.45, `rgba(18,16,14,0.08)`);
  g.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** Glowing stroke helper — bloom via layered alpha, no filters needed. */
export function glowStroke(ctx, drawPath, {
  color = P.gold, width = 2, bloom = 3, alpha = 1,
} = {}) {
  ctx.save();
  for (let i = bloom; i >= 1; i--) {
    ctx.globalAlpha = alpha * (0.08 / i);
    ctx.strokeStyle = color;
    ctx.lineWidth = width + i * 3.2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    drawPath();
    ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  drawPath();
  ctx.stroke();
  ctx.restore();
}

export function glowFill(ctx, drawPath, { color = P.gold, alpha = 0.2 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  drawPath();
  ctx.fill();
  ctx.restore();
}

/** Thin UI hairline. */
export function hair(ctx, x0, y0, x1, y1, color = P.ink, w = 1) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.restore();
}

/** Ease helpers. */
export const ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  outBack: t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  clamp01: t => Math.max(0, Math.min(1, t)),
};

/** Draw-on by dash — pattern A. */
export function strokeDrawOn(ctx, pathFn, t, { color = P.gold, width = 2, len = 800, bloom = 2 } = {}) {
  const u = ease.outCubic(ease.clamp01(t));
  ctx.save();
  ctx.setLineDash([len * u, len]);
  glowStroke(ctx, pathFn, { color, width, bloom, alpha: 0.35 + 0.65 * u });
  ctx.setLineDash([]);
  ctx.restore();
}

/** State chip — OUR improvement beyond source: every live prop can show anticipation/peak/decay. */
export function stateChip(ctx, x, y, state, label) {
  const map = { anticipation: P.gold, peak: P.white, decay: P.mute, risk: P.danger, ok: P.ok };
  const c = map[state] || P.gold;
  ctx.save();
  ctx.font = '500 13px "Inter Tight", sans-serif';
  const tw = ctx.measureText(label).width;
  const w = tw + 28, h = 22;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(10,10,12,0.75)';
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

export function caption(ctx, text, { x = 960, y = 1000, size = 28, color = P.white, font = 'Noto Serif SC', weight = 500, align = 'center' } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px "${font}", "Noto Sans CJK SC", sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function titleBlock(ctx, lines, { x = 80, y = 70 } = {}) {
  let yy = y;
  for (const L of lines) {
    ctx.save();
    ctx.font = `${L.weight || 600} ${L.size || 42}px "${L.font || 'Noto Serif SC'}", sans-serif`;
    ctx.fillStyle = L.color || P.white;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 6;
    ctx.fillText(L.text, x, yy);
    ctx.restore();
    yy += (L.size || 42) * 1.35;
  }
  return yy;
}
