/** props.js — Void Neon. ≥12 coded props. Sources cited in STYLE.md §13.
 * Grammar: thin self-lit wire · ≤2 line weights · max 1 light event · enter by draw-on · meaning = which edge/node lights magenta.
 */
import { P, glowStroke, glowFill, strokeDrawOn, rng, ease, roundRect, horizon } from './look.js';

/** 1 monitor — 5155 t6.5 */
export function monitor(ctx, o) {
  const x = o.x, y = o.y, w = o.w ?? 420, h = o.h ?? 260, k = o.k ?? 1;
  const col = o.color || P.neon;
  ctx.save();
  ctx.globalAlpha = 0.15 + 0.85 * k;
  // screen rect double stroke
  const path = () => { roundRect(ctx, x - w / 2, y - h, w, h, 6); };
  glowStroke(ctx, path, { color: col, width: 2.0, bloom: 7, alpha: 0.98 * k });
  glowStroke(ctx, () => { roundRect(ctx, x - w / 2 + 10, y - h + 10, w - 20, h - 20, 4); }, { color: col, width: 1.2, bloom: 3, alpha: 0.65 * k });
  // legs
  glowStroke(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(x - 40, y); ctx.lineTo(x - 70, y + 48);
    ctx.moveTo(x + 40, y); ctx.lineTo(x + 70, y + 48);
  }, { color: col, width: 1.4, bloom: 3, alpha: 0.9 * k });
  // CC badge
  if (o.cc !== false) {
    ctx.globalAlpha = 0.95 * k;
    ctx.fillStyle = '#F0C84A';
    roundRect(ctx, x + w / 2 - 62, y - h + 20, 42, 22, 5); ctx.fill();
    ctx.fillStyle = '#1a1020';
    ctx.font = '700 13px "Inter Tight", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CC', x + w / 2 - 41, y - h + 32);
  }
  // waveform
  if (o.wave) {
    glowStroke(ctx, () => {
      ctx.beginPath();
      const y0 = y - 36;
      for (let i = 0; i <= 40; i++) {
        const px = x - w / 2 + 30 + i * ((w - 60) / 40);
        const py = y0 + Math.sin(i * 0.55 + (o.t || 0) * 3) * 8 * o.wave;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
    }, { color: col, width: 1.2, bloom: 2, alpha: 0.7 * k });
  }
  // inner floating card
  if (o.inner) {
    const ix = x + 50, iy = y - h + 55, iw = 80, ih = 140;
    const gg = ctx.createRadialGradient(ix + iw/2, iy + ih/2, 0, ix + iw/2, iy + ih/2, ih);
    gg.addColorStop(0, `rgba(232,224,244,${0.45 * k})`);
    gg.addColorStop(1, `rgba(232,224,244,${0.05 * k})`);
    ctx.fillStyle = gg; roundRect(ctx, ix, iy, iw, ih, 6); ctx.fill();
    glowStroke(ctx, () => { roundRect(ctx, ix, iy, iw, ih, 6); }, { color: col, width: 1, bloom: 3, alpha: 0.5 * k });
  }
  // subtitle on screen
  if (o.screenText) {
    ctx.globalAlpha = 0.85 * k;
    ctx.fillStyle = P.paper;
    ctx.font = '500 18px "Inter Tight", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(o.screenText, x, y - 50);
  }
  ctx.restore();
}

/** 2 numberScale — 0345 t48 */
export function numberScale(ctx, o) {
  const x0 = o.x0 ?? 280, x1 = o.x1 ?? 1640, y = o.y ?? 540;
  const k = o.k ?? 1, hot = o.hot; // 0..1 position of glow
  const ticks = o.ticks || [200, 400, 600, 800, 1000];
  ctx.save();
  strokeDrawOn(ctx, () => { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); }, k, { color: P.cream, width: 2.2, bloom: 4, len: x1 - x0 });
  // secondary axis
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x0, y + 14); ctx.lineTo(x1, y + 14); }, { color: P.cyanDim, width: 1, bloom: 1, alpha: 0.6 * k });
  ctx.font = '500 16px "Inter Tight", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = P.mute;
  ticks.forEach((n, i) => {
    const x = x0 + (i / (ticks.length - 1)) * (x1 - x0);
    glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); }, { color: P.cream, width: 1.2, bloom: 1, alpha: 0.7 * k });
    ctx.globalAlpha = 0.8 * k; ctx.fillText(String(n), x, y + 22);
  });
  // end caps
  [[x0, y], [x1, y]].forEach(([x, yy]) => {
    glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x, yy - 14); ctx.lineTo(x, yy + 14); }, { color: P.cream, width: 2, bloom: 2, alpha: k });
  });
  if (hot != null) {
    const hx = x0 + hot * (x1 - x0);
    const g = ctx.createRadialGradient(hx, y, 0, hx, y, 40);
    g.addColorStop(0, 'rgba(232,224,244,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = k; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, y, 40, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/** 3 orbMark — glowing ? (0345) */
export function orbMark(ctx, o) {
  const x = o.x, y = o.y, s = (o.s ?? 1) * (o.pulse ?? 1), k = o.k ?? 1;
  ctx.save();
  const g = ctx.createRadialGradient(x, y, 0, x, y, 90 * s);
  g.addColorStop(0, `rgba(232,184,90,${0.55 * k})`);
  g.addColorStop(0.45, `rgba(210,160,80,${0.18 * k})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 90 * s, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = k;
  ctx.fillStyle = P.cream;
  ctx.font = `600 ${Math.round(96 * s)}px "Noto Serif SC", serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(232,184,90,0.8)'; ctx.shadowBlur = 24;
  ctx.fillText(o.glyph || '?', x, y + 6);
  ctx.restore();
}

/** 4 circlePyramid — 5155 t86 insight puzzle */
export function circlePyramid(ctx, o) {
  const x = o.x, y = o.y, r = o.r ?? 28, gap = o.gap ?? 14, k = o.k ?? 1;
  const rows = o.rows || [1, 2, 3, 4];
  const lit = new Set(o.lit || []); // linear indices
  let idx = 0;
  ctx.save();
  rows.forEach((n, row) => {
    const totalW = n * (2 * r) + (n - 1) * gap;
    const y0 = y + row * (2 * r + gap);
    for (let i = 0; i < n; i++) {
      const x0 = x - totalW / 2 + r + i * (2 * r + gap);
      const isLit = lit.has(idx);
      const col = isLit ? P.magenta : P.neon;
      const path = () => { ctx.beginPath(); ctx.arc(x0, y0, r * k, 0, Math.PI * 2); };
      glowStroke(ctx, path, { color: col, width: isLit ? 2.2 : 1.5, bloom: isLit ? 6 : 3, alpha: 0.55 + 0.45 * k });
      if (isLit) glowFill(ctx, path, { color: col, alpha: 0.12 });
      idx++;
    }
  });
  ctx.restore();
}

/** 5 dice — 3785 */
export function dice(ctx, o) {
  const x = o.x, y = o.y, s = o.s ?? 36, pip = o.pip ?? 1, k = o.k ?? 1;
  ctx.save();
  const path = () => { roundRect(ctx, x - s, y - s, s * 2, s * 2, 6); };
  glowFill(ctx, path, { color: P.paper, alpha: 0.12 * k });
  glowStroke(ctx, path, { color: P.cream, width: 1.5, bloom: 3, alpha: k });
  // pips
  const spots = {
    1: [[0, 0]],
    2: [[-0.4, -0.4], [0.4, 0.4]],
    3: [[-0.4, -0.4], [0, 0], [0.4, 0.4]],
    4: [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]],
    5: [[-0.4, -0.4], [0.4, -0.4], [0, 0], [-0.4, 0.4], [0.4, 0.4]],
    6: [[-0.4, -0.45], [0.4, -0.45], [-0.4, 0], [0.4, 0], [-0.4, 0.45], [0.4, 0.45]],
  }[pip] || [[0, 0]];
  ctx.fillStyle = o.pipColor || P.bio;
  spots.forEach(([u, v]) => {
    ctx.globalAlpha = k;
    ctx.beginPath(); ctx.arc(x + u * s, y + v * s, s * 0.14, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
}

/** 6 probWheel — 3785 t16.5 */
export function probWheel(ctx, o) {
  const x = o.x, y = o.y, R = o.R ?? 160, k = o.k ?? 1, spokes = o.spokes ?? 12;
  ctx.save();
  for (const rr of [R * 0.35, R * 0.65, R]) {
    strokeDrawOn(ctx, () => { ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); }, k, { color: P.cream, width: 1.3, bloom: 2, len: 2 * Math.PI * rr });
  }
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2 + (o.rot || 0);
    strokeDrawOn(ctx, () => {
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R);
    }, k, { color: P.cream, width: 1, bloom: 1, len: R });
    // nodes
    const nr = R * (0.35 + (i % 3) * 0.3);
    glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(x + Math.cos(a) * nr, y + Math.sin(a) * nr, 5, 0, Math.PI * 2); }, { color: P.cream, width: 1.2, bloom: 2, alpha: k });
  }
  ctx.restore();
}

/** 7 probTree — 3785 t62 */
export function probTree(ctx, o) {
  const x = o.x, y = o.y, k = o.k ?? 1, depth = o.depth ?? 3;
  const col = o.color || P.cream;
  ctx.save();
  function branch(px, py, lev, ang, len) {
    if (lev > depth) return;
    const nx = px + Math.cos(ang) * len, ny = py + Math.sin(ang) * len;
    strokeDrawOn(ctx, () => { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); }, k, { color: col, width: 1.4 - lev * 0.2, bloom: 2, len });
    glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(nx, ny, 4, 0, Math.PI * 2); }, {
      color: lev === depth ? P.magenta : col, width: 1.2, bloom: lev === depth ? 5 : 2, alpha: k,
    });
    branch(nx, ny, lev + 1, ang - 0.45, len * 0.72);
    branch(nx, ny, lev + 1, ang + 0.45, len * 0.72);
  }
  branch(x, y, 0, -Math.PI / 2, o.len || 90);
  ctx.restore();
}

/** 8 dnaHelix — simplified wire from 9472 language */
export function dnaHelix(ctx, o) {
  const x = o.x, y = o.y, h = o.h ?? 220, k = o.k ?? 1, t = o.t || 0;
  ctx.save();
  for (let strand = 0; strand < 2; strand++) {
    const col = strand ? P.cyan : P.magenta;
    glowStroke(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const u = i / 40;
        const yy = y - h / 2 + u * h;
        const xx = x + Math.sin(u * Math.PI * 4 + t + strand * Math.PI) * 28;
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
    }, { color: col, width: 1.5, bloom: 3, alpha: 0.5 + 0.5 * k });
  }
  // rungs
  for (let i = 0; i < 10; i++) {
    const u = (i + 0.5) / 10;
    const yy = y - h / 2 + u * h;
    const x0 = x + Math.sin(u * Math.PI * 4 + t) * 28;
    const x1 = x + Math.sin(u * Math.PI * 4 + t + Math.PI) * 28;
    glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); }, { color: P.gold, width: 1, bloom: 1, alpha: 0.6 * k });
  }
  ctx.restore();
}

/** 9 graphArc — 5155 chart */
export function graphArc(ctx, o) {
  const x0 = o.x0 ?? 400, y0 = o.y0 ?? 700, w = o.w ?? 900, h = o.h ?? 280, k = o.k ?? 1;
  ctx.save();
  // axes
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 - h); }, { color: P.mute, width: 1.2, bloom: 1, alpha: k });
  strokeDrawOn(ctx, () => {
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const u = i / 48;
      const x = x0 + u * w;
      const y = y0 - Math.sin(u * Math.PI) * h * 0.85 - u * h * 0.1;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
  }, k, { color: P.magenta, width: 2, bloom: 4, len: w * 1.2 });
  // endpoints
  [[0, 0], [1, 1]].forEach(([u]) => {
    const x = x0 + u * w, y = y0 - Math.sin(u * Math.PI) * h * 0.85 - u * h * 0.1;
    glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); }, { color: P.neon, width: 1.5, bloom: 3, alpha: k });
  });
  ctx.restore();
}

/** 10 paperCard — 7098 / 1643 experimental record */
export function paperCard(ctx, o) {
  const x = o.x, y = o.y, w = o.w ?? 280, h = o.h ?? 360, k = o.k ?? 1;
  ctx.save();
  ctx.globalAlpha = 0.92 * k;
  ctx.fillStyle = '#EDE6D8';
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(60,40,30,0.25)'; ctx.lineWidth = 1;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 4); ctx.stroke();
  ctx.fillStyle = '#5A4030';
  ctx.font = `600 ${o.titleSize || 22}px "Noto Serif SC", serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(o.title || '实验记录', x, y - h / 2 + 28);
  ctx.font = '500 14px "Inter Tight", sans-serif';
  ctx.fillStyle = '#8A7060';
  (o.lines || ['……', '……']).forEach((L, i) => ctx.fillText(L, x, y - h / 2 + 70 + i * 22));
  ctx.restore();
}

/** 11 droplet — 9472 DNA drop */
export function droplet(ctx, o) {
  const x = o.x, y = o.y, s = o.s ?? 1, k = o.k ?? 1;
  ctx.save();
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(x, y - 40 * s);
    ctx.bezierCurveTo(x + 28 * s, y - 10 * s, x + 24 * s, y + 30 * s, x, y + 42 * s);
    ctx.bezierCurveTo(x - 24 * s, y + 30 * s, x - 28 * s, y - 10 * s, x, y - 40 * s);
  };
  glowFill(ctx, path, { color: P.bio, alpha: 0.2 * k });
  glowStroke(ctx, path, { color: P.bio, width: 1.6, bloom: 4, alpha: k });
  // inner particles
  const r = rng(9);
  for (let i = 0; i < 12; i++) {
    ctx.globalAlpha = 0.5 * k;
    ctx.fillStyle = P.neon;
    ctx.beginPath(); ctx.arc(x + (r() - 0.5) * 20 * s, y + (r() - 0.5) * 30 * s, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/** 12 wordChip — 5155 boxed words */
export function wordChip(ctx, o) {
  const x = o.x, y = o.y, k = o.k ?? 1;
  ctx.save();
  ctx.font = `500 ${o.size || 22}px "Noto Serif SC", serif`;
  const tw = ctx.measureText(o.text).width;
  const w = tw + 28, h = (o.size || 22) + 16;
  ctx.globalAlpha = k;
  glowStroke(ctx, () => { roundRect(ctx, x - w / 2, y - h / 2, w, h, 4); }, { color: o.color || P.neon, width: 1.2, bloom: 2, alpha: k });
  ctx.fillStyle = o.color || P.paper;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(o.text, x, y);
  ctx.restore();
}

/** 13 needleBoard — 3785 Buffon feel: parallel lines + falling needle */
export function needleBoard(ctx, o) {
  const x0 = o.x0 ?? 400, y0 = o.y0 ?? 300, w = o.w ?? 1000, h = o.h ?? 420, k = o.k ?? 1;
  const lines = o.lines || 6;
  ctx.save();
  for (let i = 0; i < lines; i++) {
    const y = y0 + (i / (lines - 1)) * h;
    glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); }, { color: P.cream, width: 1.2, bloom: 1, alpha: 0.55 * k });
  }
  (o.needles || []).forEach(n => {
    const col = n.hit ? P.magenta : P.neon;
    glowStroke(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(n.x - Math.cos(n.a) * n.L, n.y - Math.sin(n.a) * n.L);
      ctx.lineTo(n.x + Math.cos(n.a) * n.L, n.y + Math.sin(n.a) * n.L);
    }, { color: col, width: 1.6, bloom: 3, alpha: k });
  });
  ctx.restore();
}

/** 14 linkCascade — OUR improvement: connected nodes light in sequence (insight) */
export function linkCascade(ctx, o) {
  const nodes = o.nodes || [];
  const edges = o.edges || [];
  const k = o.k ?? 0; // 0..1 progress of cascade
  ctx.save();
  edges.forEach((e, i) => {
    const a = nodes[e[0]], b = nodes[e[1]];
    if (!a || !b) return;
    const thr = (i + 1) / (edges.length + 1);
    const on = k >= thr;
    const frac = on ? Math.min(1, (k - thr) / 0.15) : 0;
    glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }, {
      color: on ? P.magenta : P.mute, width: on ? 2 : 1, bloom: on ? 5 : 1, alpha: 0.35 + 0.65 * frac,
    });
  });
  nodes.forEach((n, i) => {
    const thr = i / Math.max(1, nodes.length - 1);
    const on = k >= thr * 0.9;
    glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r || 10, 0, Math.PI * 2); }, {
      color: on ? (n.hot ? P.magenta : P.cyan) : P.mute, width: 1.6, bloom: on ? 5 : 2, alpha: on ? 1 : 0.4,
    });
    if (on && n.label) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = P.paper;
      ctx.font = '500 14px "Inter Tight", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(n.label, n.x, n.y - 20);
    }
  });
  ctx.restore();
}

export { horizon };
