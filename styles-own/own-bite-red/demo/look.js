/** Bite Red Queen — look / material / light lib.
 * Palette measured from bite-xinyu-redqueen + 0762 entropy (void/data-body). */
export const P = {
  void: '#0A0A0A',
  voidSoft: '#121212',
  panel: '#1A1212',
  red: '#E23B3B',
  redHot: '#FF2A2A',
  redDim: '#8B2222',
  redBloom: '#FF4A4A',
  white: '#F5F5F5',
  off: '#D0D0D0',
  mute: '#6A6A6A',
  cite: '#8A8A8A',
  hud: '#B8D4E8',
  gold: '#E0B85A',   // 0762 work/order accent only
  grain: '#1C1C1C',
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

/** Near-black void with film grain + optional red radial wash. */
export function paintVoid(ctx, w, h, { cx = 0.5, cy = 0.42, redWash = 0.35, grain = 0.55, seed = 19 } = {}) {
  ctx.fillStyle = P.void;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.hypot(w, h) * 0.72);
  g.addColorStop(0, `rgba(80,18,18,${0.22 * redWash})`);
  g.addColorStop(0.5, `rgba(30,10,10,0.08)`);
  g.addColorStop(1, 'rgba(0,0,0,0.95)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (grain > 0) {
    const r = rng(seed);
    ctx.save();
    for (let i = 0; i < 1400 * grain; i++) {
      const x = r() * w, y = r() * h, a = 0.04 + r() * 0.08;
      ctx.globalAlpha = a * grain;
      ctx.fillStyle = r() < 0.5 ? '#ffffff' : '#000000';
      ctx.fillRect(x, y, 1.1, 1.1);
    }
    ctx.restore();
  }
}

export function glowStroke(ctx, drawPath, { color = P.red, width = 1.6, bloom = 5, alpha = 1 } = {}) {
  ctx.save();
  for (let i = bloom; i >= 1; i--) {
    ctx.globalAlpha = alpha * (0.12 / i);
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

export function glowFill(ctx, drawPath, { color = P.red, alpha = 0.22 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; drawPath(); ctx.fill(); ctx.restore();
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

/** Top-left hero — white body, red DualMark on trap keywords. */
export function hero(ctx, lines, { x = 80, y = 70 } = {}) {
  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  lines.forEach((L) => {
    const size = L.size || 48, weight = L.weight || 700;
    ctx.globalAlpha = L.a ?? 1;
    ctx.font = `${weight} ${size}px "Noto Serif SC", serif`;
    const col = L.color || P.white;
    const text = L.text;
    if (L.mark && L.keyFrom != null) {
      const pre = text.slice(0, L.keyFrom);
      const key = text.slice(L.keyFrom, L.keyTo);
      const post = text.slice(L.keyTo);
      let xx = x;
      ctx.fillStyle = col; ctx.fillText(pre, xx, y);
      xx += ctx.measureText(pre).width;
      // red key with soft bloom
      ctx.save();
      ctx.shadowColor = P.redBloom; ctx.shadowBlur = 14;
      ctx.fillStyle = P.red; ctx.fillText(key, xx, y);
      ctx.restore();
      xx += ctx.measureText(key).width;
      ctx.fillStyle = col; ctx.fillText(post, xx, y);
    } else {
      ctx.fillStyle = col; ctx.fillText(text, x, y);
    }
    y += (L.lh || size + 14);
  });
  ctx.restore();
}

export function sourceFooter(ctx, text) {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = P.cite;
  ctx.font = '500 16px "Inter Tight", "Noto Serif SC", sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
  ctx.fillText('● ' + text, 48, 1048);
  ctx.restore();
}

export function brand(ctx) {
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = P.mute;
  ctx.font = '600 14px "Inter Tight", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Vibe知识大赏 · own-bite-red', 1870, 1048);
  ctx.restore();
}

/** Chapter tag top-left tiny (I 定律 / II 军备竞赛 …) */
export function chapterTag(ctx, roman, title, { x = 80, y = 36 } = {}) {
  ctx.save();
  ctx.fillStyle = P.red;
  ctx.font = '700 18px "Inter Tight", "Noto Serif SC", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${roman}  ${title}`, x, y);
  ctx.restore();
}

/** Semantic chip — 原地 / 锁死 / 分叉 */
export function statusChip(ctx, x, y, state, label) {
  const col = state === 'trap' ? P.red : state === 'lock' ? P.redHot : state === 'fork' ? P.hud : P.white;
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(12,8,8,0.82)';
  roundRect(ctx, x, y, label.length * 15 + 30, 26, 4); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x + 12, y + 13, 4, 0, Math.PI * 2); ctx.fill();
  ctx.font = '600 14px "Noto Serif SC", serif';
  ctx.fillStyle = P.white; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + 22, y + 13);
  ctx.restore();
}

/** Soft horizontal speed streaks */
export function speedStreaks(ctx, y, { n = 8, a = 0.25, seed = 3 } = {}) {
  const r = rng(seed);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const yy = y + (r() - 0.5) * 180;
    const x0 = r() * 1920;
    const len = 80 + r() * 220;
    ctx.globalAlpha = a * (0.4 + r() * 0.6);
    ctx.strokeStyle = P.redDim;
    ctx.lineWidth = 1 + r() * 1.5;
    ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + len, yy); ctx.stroke();
  }
  ctx.restore();
}
