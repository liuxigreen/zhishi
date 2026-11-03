/** props.js — Dark Gold Line prop library (see STYLE.md §PROP GRAMMAR).
 * Every prop: (ctx, x, y, size, state) where state = { t (local sec), k (0..1 progress), mode }.
 * Rendering rule: hairline body (1.2–2 px) in cream/gold + ONE light event (glow core, beam or rim).
 * Distilled from: halo t5 (ring), t10/t25.5 (cloche, pedestal, beam, phones), t51.5 (crystal column),
 * t62 (archive screen); moyou f04 (bars), ember f02 (clock), xiaomo f02 (chat bubble).
 */
import { P, rng, glowStroke, roundRect, ease } from './look.js';

const CREAM = 'rgba(232,214,176,0.85)';
const TAU = Math.PI * 2;

/* 1. HALO RING — bright thin core + radial ticks + soft bloom. k = ignite 0..1 */
export function haloRing(ctx, x, y, r, { t = 0, k = 1, ticks = 140, seed = 5 } = {}) {
  const R = rng(seed);
  const a = ease.outCubic(k);
  ctx.save();
  // bloom disc
  const g = ctx.createRadialGradient(x, y, r * 0.7, x, y, r * 1.7);
  g.addColorStop(0, `rgba(245,200,90,${0.0})`);
  g.addColorStop(0.3, `rgba(245,200,90,${0.13 * a})`);
  g.addColorStop(1, 'rgba(245,200,90,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.7, 0, TAU); ctx.fill();
  // ticks
  ctx.strokeStyle = `rgba(250,220,150,${0.5 * a})`; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < ticks; i++) {
    const th = i / ticks * TAU + R() * 0.02, L = r * (0.03 + R() * 0.13) * (0.8 + 0.2 * Math.sin(t * 3 + i));
    ctx.moveTo(x + Math.cos(th) * (r + 3), y + Math.sin(th) * (r + 3));
    ctx.lineTo(x + Math.cos(th) * (r + 3 + L), y + Math.sin(th) * (r + 3 + L));
  }
  ctx.stroke();
  // core ring (draw-on by arc)
  glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * a); },
    { color: '#FFE3A0', width: 5.5, bloom: 6, alpha: 1 });
  ctx.strokeStyle = 'rgba(255,250,235,0.9)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * a); ctx.stroke();
  ctx.restore();
}

/* 2. GOLD DUST — drifting sparkles, deterministic. */
export function goldDust(ctx, { x = 960, y = 540, w = 800, h = 600, n = 120, t = 0, seed = 9, color = '255,224,150', size = 1 } = {}) {
  const R = rng(seed);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const px = x - w / 2 + R() * w + Math.sin(t * 0.4 + i) * 8;
    const py = y - h / 2 + ((R() * h - t * (6 + R() * 10)) % h + h) % h;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (1 + R() * 2) + i));
    const s = (0.6 + R() * 1.6) * size;
    ctx.fillStyle = `rgba(${color},${0.75 * tw})`;
    ctx.beginPath(); ctx.arc(px, py, s, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/* 3. SPOTLIGHT BEAM — top-down trapezoid with feathered edges. */
export function beam(ctx, x, topY, botY, wTop, wBot, { alpha = 0.16, warm = true } = {}) {
  ctx.save();
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const f = 1 - i / steps;
    ctx.globalAlpha = alpha / steps * 1.6;
    ctx.fillStyle = warm ? '#D9C49A' : '#BFC8D6';
    ctx.beginPath();
    ctx.moveTo(x - wTop / 2 * f - 6 * i, topY);
    ctx.lineTo(x + wTop / 2 * f + 6 * i, topY);
    ctx.lineTo(x + wBot / 2 * f + 10 * i, botY);
    ctx.lineTo(x - wBot / 2 * f - 10 * i, botY);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

/* 4. FLOOR LINE + pool of light */
export function floor(ctx, y, { x = 960, pool = 360, alpha = 0.5 } = {}) {
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, 1920, 0);
  g.addColorStop(0, 'rgba(200,190,170,0)'); g.addColorStop(0.5, `rgba(200,190,170,${alpha})`); g.addColorStop(1, 'rgba(200,190,170,0)');
  ctx.strokeStyle = g; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke();
  const pg = ctx.createRadialGradient(x, y, 0, x, y, pool);
  pg.addColorStop(0, 'rgba(230,200,140,0.10)'); pg.addColorStop(1, 'rgba(230,200,140,0)');
  ctx.fillStyle = pg; ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.18); ctx.translate(-x, -y);
  ctx.beginPath(); ctx.arc(x, y, pool, 0, TAU); ctx.fill(); ctx.restore();
  ctx.restore();
}

/* 5. GLASS CLOCHE — bell jar: outline, knob, specular streak, base ellipse. lift = 0..1 raises the dome. */
export function cloche(ctx, x, baseY, w, { lift = 0, glow = 0.6 } = {}) {
  const h = w * 1.25, dy = -lift * h * 0.6;
  ctx.save();
  // base disc
  ctx.strokeStyle = CREAM; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(x, baseY, w * 0.58, w * 0.07, 0, 0, TAU); ctx.stroke();
  ctx.translate(0, dy);
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, baseY - 4);
    ctx.lineTo(x - w / 2, baseY - h * 0.55);
    ctx.bezierCurveTo(x - w / 2, baseY - h * 1.02, x + w / 2, baseY - h * 1.02, x + w / 2, baseY - h * 0.55);
    ctx.lineTo(x + w / 2, baseY - 4);
  };
  // faint glass body
  path(); ctx.closePath(); ctx.fillStyle = 'rgba(220,210,190,0.035)'; ctx.fill();
  glowStroke(ctx, path, { color: '#E6D2A6', width: 1.5, bloom: 2, alpha: glow + 0.3 });
  // rim at bottom
  ctx.strokeStyle = 'rgba(232,214,176,0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(x, baseY - 4, w / 2, w * 0.045, 0, 0, TAU); ctx.stroke();
  // knob
  ctx.strokeStyle = CREAM; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(x, baseY - h * 0.91 - w * 0.06, w * 0.06, 0, TAU); ctx.stroke();
  // specular streak
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = w * 0.025; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w * 0.36, baseY - h * 0.25); ctx.lineTo(x - w * 0.36, baseY - h * 0.6); ctx.stroke();
  ctx.restore();
}

/* 6. PEDESTAL — truncated plinth, line-only with a lit top edge. */
export function pedestal(ctx, x, topY, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(10,10,11,0.96)';
  ctx.strokeStyle = 'rgba(200,190,170,0.55)'; ctx.lineWidth = 1.3;
  // top slab
  ctx.beginPath();
  ctx.moveTo(x - w * 0.62, topY); ctx.lineTo(x + w * 0.62, topY);
  ctx.lineTo(x + w * 0.5, topY + h * 0.08); ctx.lineTo(x - w * 0.5, topY + h * 0.08); ctx.closePath();
  ctx.fill(); ctx.stroke();
  // column
  ctx.beginPath(); ctx.rect(x - w * 0.4, topY + h * 0.08, w * 0.8, h * 0.92); ctx.fill(); ctx.stroke();
  // lit edge
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x - w * 0.6, topY); ctx.lineTo(x + w * 0.6, topY); },
    { color: '#E8D2A0', width: 1.2, bloom: 2, alpha: 0.8 });
  ctx.restore();
}

/* 7. TREASURED OBJECT — ordinary thing made precious: gold-lit ellipse ring (hair tie, cup rim, key ring). */
export function treasure(ctx, x, y, w, { k = 1, kind = 'ring' } = {}) {
  ctx.save();
  // value = light: k 0 → plain warm-grey hairline, k 1 → hot gold with bloom (STYLE §13 state change)
  const kc = ease.clamp01(k), mix = (a, b) => Math.round(a + (b - a) * kc);
  const col = `rgb(${mix(200, 245)},${mix(194, 200)},${mix(182, 74)})`;
  if (kc > 0.6) { const g = ctx.createRadialGradient(x, y - w * 0.35, 0, x, y - w * 0.35, w * 1.1); g.addColorStop(0, `rgba(245,200,74,${0.28 * (kc - 0.6) / 0.4})`); g.addColorStop(1, 'rgba(245,200,74,0)'); ctx.fillStyle = g; ctx.fillRect(x - w * 1.2, y - w * 1.5, w * 2.4, w * 2.4); }
  if (kind === 'ring') {
    glowStroke(ctx, () => { ctx.beginPath(); ctx.ellipse(x, y, w / 2, w * 0.11, 0, 0, TAU); },
      { color: col, width: 3, bloom: Math.round(1 + 3 * kc), alpha: 0.6 + 0.4 * kc });
  } else if (kind === 'cup') {
    const path = () => {
      ctx.beginPath();
      ctx.ellipse(x, y - w * 0.7, w * 0.36, w * 0.07, 0, 0, TAU);
      ctx.moveTo(x - w * 0.36, y - w * 0.7); ctx.lineTo(x - w * 0.3, y); ctx.lineTo(x + w * 0.3, y); ctx.lineTo(x + w * 0.36, y - w * 0.7);
      ctx.moveTo(x + w * 0.34, y - w * 0.55); ctx.bezierCurveTo(x + w * 0.62, y - w * 0.55, x + w * 0.62, y - w * 0.2, x + w * 0.32, y - w * 0.18);
    };
    glowStroke(ctx, path, { color: col, width: 2.2, bloom: Math.round(1 + 2 * kc), alpha: 0.6 + 0.4 * kc });
  }
  ctx.restore();
}

/* 8. ARCHIVE SCREEN — rounded frame, cold-grey scanline interior, caption line. draw(ctx, ix, iy, iw, ih) paints inside. */
export function archiveScreen(ctx, x, y, w, h, { t = 0, cite = '', draw = null, k = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = ease.outCubic(k);
  roundRect(ctx, x, y, w, h, 22); ctx.fillStyle = '#0B0D10'; ctx.fill();
  ctx.strokeStyle = 'rgba(214,214,214,0.75)'; ctx.lineWidth = 2; ctx.stroke();
  const ix = x + 22, iy = y + 22, iw = w - 44, ih = h - 44;
  ctx.save();
  roundRect(ctx, ix, iy, iw, ih, 8); ctx.clip();
  const g = ctx.createRadialGradient(ix + iw / 2, iy + ih * 0.45, 0, ix + iw / 2, iy + ih / 2, iw * 0.7);
  g.addColorStop(0, '#4A5260'); g.addColorStop(1, '#14171C');
  ctx.fillStyle = g; ctx.fillRect(ix, iy, iw, ih);
  if (draw) draw(ctx, ix, iy, iw, ih);
  // scanlines + roll
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let yy = iy; yy < iy + ih; yy += 4) ctx.fillRect(ix, yy, iw, 1.5);
  const roll = iy + ((t * 60) % ih);
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(ix, roll, iw, 18);
  ctx.restore();
  if (cite) {
    ctx.font = 'italic 400 30px "Noto Serif SC", Georgia, serif';
    ctx.fillStyle = 'rgba(220,216,206,0.85)'; ctx.textAlign = 'center';
    ctx.fillText(cite, x + w / 2, y + h + 50);
  }
  ctx.restore();
}

/* 9. CRYSTAL COLUMN — rising ice/bubble motes (halo t51.5): veil between two people. */
export function crystalColumn(ctx, x, y0, y1, w, { t = 0, n = 70, seed = 21, k = 1 } = {}) {
  const R = rng(seed), H = y1 - y0;
  ctx.save();
  for (let i = 0; i < n * k; i++) {
    const px = x + (R() - 0.5) * w * (0.6 + 0.4 * R());
    const sp = 14 + R() * 30;
    const py = y1 - (((R() * H) + t * sp) % H);
    const r = 2 + R() * 6;
    ctx.strokeStyle = `rgba(214,220,226,${0.35 + R() * 0.4})`; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(px, py, r, r * 0.62, 0, 0, TAU); ctx.stroke();
    if (R() < 0.08) {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r * 3);
      g.addColorStop(0, 'rgba(230,230,230,0.25)'); g.addColorStop(1, 'rgba(230,230,230,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r * 3, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

/* 10. LABEL TAG — pill with gold hairline, attaches to a person with a thread (our improvement: thread + snap). */
export function labelTag(ctx, x, y, text, { k = 1, anchor = null, size = 26 } = {}) {
  const a = ease.clamp01(k);
  ctx.save();
  ctx.font = `500 ${size}px "Noto Serif SC", serif`;
  const tw = ctx.measureText(text).width, w = tw + size * 1.4, h = size * 1.7;
  const s = 0.85 + 0.15 * ease.outBack(a);
  ctx.globalAlpha = a;
  if (anchor) {
    ctx.strokeStyle = 'rgba(232,184,74,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(anchor[0], anchor[1]); ctx.lineTo(x - w / 2 * s, y); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.translate(x, y); ctx.scale(s, s);
  roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = 'rgba(20,16,10,0.85)'; ctx.fill();
  ctx.strokeStyle = 'rgba(232,184,74,0.75)'; ctx.lineWidth = 1.3; ctx.stroke();
  ctx.fillStyle = '#EADFC6'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 2);
  ctx.restore();
}

/* 11. 3D GREY BARS (moyou f04) — extruded bars with top face, plus a gold expectation line. */
export function bars3d(ctx, x, baseY, values, { bw = 70, gap = 40, depth = 22, k = 1, expect = null, hot = -1 } = {}) {
  ctx.save();
  values.forEach((v, i) => {
    const h = v * ease.outCubic(ease.clamp01(k * 1.4 - i * 0.12));
    const bx = x + i * (bw + gap);
    const side = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    side.addColorStop(0, i === hot ? '#6E5A30' : '#3A3B40'); side.addColorStop(1, i === hot ? '#9C7C3A' : '#55575E');
    ctx.fillStyle = side; ctx.fillRect(bx, baseY - h, bw, h);
    ctx.fillStyle = i === hot ? '#C9A050' : '#6C6E76';
    ctx.beginPath(); ctx.moveTo(bx, baseY - h); ctx.lineTo(bx + depth, baseY - h - depth * 0.6);
    ctx.lineTo(bx + bw + depth, baseY - h - depth * 0.6); ctx.lineTo(bx + bw, baseY - h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = i === hot ? '#5A4826' : '#26272B';
    ctx.beginPath(); ctx.moveTo(bx + bw, baseY - h); ctx.lineTo(bx + bw + depth, baseY - h - depth * 0.6);
    ctx.lineTo(bx + bw + depth, baseY - depth * 0.6); ctx.lineTo(bx + bw, baseY); ctx.closePath(); ctx.fill();
  });
  if (expect) {
    const ea = ease.clamp01(k * 1.2 - 0.3);
    ctx.setLineDash([2400 * ea, 3000]);
    glowStroke(ctx, () => {
      ctx.beginPath();
      expect.forEach((v, i) => { const px = x + i * (bw + gap) + bw / 2 + depth / 2, py = baseY - v; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    }, { color: '#F0A040', width: 3, bloom: 3 });
    ctx.setLineDash([]);
  }
  ctx.restore();
}

/* 12. GOLD CLOCK (ember f02) — hairline dial, glowing hand sweep, 12 ticks. */
export function clock(ctx, x, y, r, { t = 0, speed = 1, k = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = ease.clamp01(k);
  glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, { color: P.gold, width: 2, bloom: 3 });
  ctx.strokeStyle = 'rgba(232,184,74,0.7)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82); ctx.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); ctx.stroke(); }
  const a = -Math.PI / 2 + t * speed;
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75); }, { color: P.goldHot, width: 2.5, bloom: 2 });
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a / 12) * r * 0.5, y + Math.sin(a / 12) * r * 0.5); }, { color: P.goldHot, width: 3, bloom: 2 });
  ctx.restore();
}

/* 13. CHAT BUBBLE (xiaomo f02) — dark capsule, hairline, typing dots or text. */
export function bubble(ctx, x, y, w, h, { text = '', side = 'left', k = 1, t = 0, typing = false, gold = false } = {}) {
  const a = ease.outBack(ease.clamp01(k));
  ctx.save();
  ctx.translate(x, y); ctx.scale(0.6 + 0.4 * a, 0.6 + 0.4 * a); ctx.globalAlpha = ease.clamp01(k * 1.5);
  roundRect(ctx, -w / 2, -h / 2, w, h, h / 2.4);
  ctx.fillStyle = gold ? 'rgba(60,44,16,0.9)' : 'rgba(28,28,32,0.92)'; ctx.fill();
  ctx.strokeStyle = gold ? 'rgba(232,184,74,0.8)' : 'rgba(200,196,188,0.5)'; ctx.lineWidth = 1.3; ctx.stroke();
  const tx = side === 'left' ? -w / 2 + 18 : w / 2 - 18;
  ctx.beginPath(); ctx.moveTo(tx - 8, h / 2 - 1); ctx.lineTo(tx + (side === 'left' ? -10 : 10), h / 2 + 14); ctx.lineTo(tx + 8, h / 2 - 1); ctx.fill();
  if (typing) {
    for (let i = 0; i < 3; i++) { ctx.fillStyle = `rgba(230,224,210,${0.35 + 0.6 * Math.max(0, Math.sin(t * 6 - i * 0.9))})`; ctx.beginPath(); ctx.arc(-18 + i * 18, 0, 5, 0, TAU); ctx.fill(); }
  } else {
    ctx.font = `500 ${h * 0.42}px "Noto Serif SC", serif`; ctx.fillStyle = gold ? '#F5DFA8' : '#E8E4DA';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2);
  }
  ctx.restore();
}

/* 14. FRAME STACK — repeated exposure: N ghost cards fanning, front one lit. (derived example, §Derive) */
export function frameStack(ctx, x, y, w, h, n, { k = 1, t = 0, draw = null } = {}) {
  ctx.save();
  const shown = Math.max(1, Math.floor(n * ease.clamp01(k)));
  for (let i = shown - 1; i >= 0; i--) {
    const off = i * 16, a = i === 0 ? 1 : 0.5 - i * 0.04;
    ctx.globalAlpha = Math.max(0.06, a);
    roundRect(ctx, x - w / 2 + off, y - h / 2 - off * 0.6, w, h, 10);
    ctx.fillStyle = '#0D0D0F'; ctx.fill();
    ctx.strokeStyle = i === 0 ? 'rgba(232,184,74,0.9)' : 'rgba(200,190,170,0.6)'; ctx.lineWidth = 1.3; ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (draw) { ctx.save(); roundRect(ctx, x - w / 2, y - h / 2, w, h, 10); ctx.clip(); draw(ctx, x - w / 2, y - h / 2, w, h); ctx.restore(); }
  ctx.restore();
}

/* 15. COUNTER — tabular number tick-up with gold flash at end. */
export function counter(ctx, x, y, value, { size = 90, k = 1, suffix = '' } = {}) {
  const v = Math.round(value * ease.outCubic(ease.clamp01(k)));
  ctx.save();
  ctx.font = `600 ${size}px "Inter Tight", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = k >= 1 ? P.goldHot : P.paper;
  ctx.shadowColor = k >= 1 ? P.goldHot : 'transparent'; ctx.shadowBlur = k >= 1 ? 24 : 0;
  ctx.fillText(v + suffix, x, y);
  ctx.restore();
}

/* 16. BALANCE (ember f_00053) — gold beam scale; tilt = (right-left) weight, pans hang plumb.
 * state change = the beam tips: what the brain weighs heavier sinks. k = draw-on. */
export function balance(ctx, x, y, w, { tilt = 0, k = 1, left = null, right = null } = {}) {
  ctx.save(); ctx.globalAlpha = ease.clamp01(k * 1.5);
  const H = w * 0.62, a = tilt * 0.28;
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + H); ctx.moveTo(x - w * 0.16, y + H); ctx.lineTo(x + w * 0.16, y + H); }, { color: P.goldDim, width: 3, bloom: 2 });
  const ex = Math.cos(a) * w / 2, ey = Math.sin(a) * w / 2;
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x - ex, y - ey); ctx.lineTo(x + ex, y + ey); }, { color: P.gold, width: 2.5, bloom: 3 });
  ctx.fillStyle = P.goldHot; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
  [[-1, left], [1, right]].forEach(([sd, draw]) => {
    const px = x + sd * ex, py = y + sd * ey, py2 = py + w * 0.26;
    ctx.strokeStyle = 'rgba(232,184,74,0.55)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - w * 0.12, py2); ctx.moveTo(px, py); ctx.lineTo(px + w * 0.12, py2); ctx.stroke();
    glowStroke(ctx, () => { ctx.beginPath(); ctx.ellipse(px, py2, w * 0.14, w * 0.025, 0, 0, Math.PI); }, { color: P.gold, width: 2, bloom: 2 });
    if (draw) draw(ctx, px, py2 - 4);
  });
  ctx.restore();
}

/* 17. LIGHT DROP (ember f_00040) — a single glowing droplet = a reward chemical / a feeling.
 * state change: fill rises with k (0 empty outline → 1 full glowing); pulse with t. */
export function drop(ctx, x, y, r, { k = 1, t = 0 } = {}) {
  ctx.save();
  const path = () => { ctx.beginPath(); ctx.moveTo(x, y - r * 1.6); ctx.bezierCurveTo(x + r * 0.35, y - r * 0.9, x + r, y - r * 0.35, x + r, y + r * 0.15); ctx.arc(x, y + r * 0.15, r, 0, Math.PI); ctx.bezierCurveTo(x - r, y - r * 0.35, x - r * 0.35, y - r * 0.9, x, y - r * 1.6); ctx.closePath(); };
  const pulse = 1 + 0.06 * Math.sin(t * 3);
  const g = ctx.createRadialGradient(x, y + r * 0.2, 0, x, y + r * 0.2, r * 4 * pulse);
  g.addColorStop(0, `rgba(245,200,74,${0.35 * k})`); g.addColorStop(1, 'rgba(245,200,74,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  ctx.save(); path(); ctx.clip();
  const top = y + r * 1.15 - (r * 2.75) * ease.clamp01(k);
  const fg = ctx.createLinearGradient(0, top, 0, y + r * 1.15); fg.addColorStop(0, '#F8D27A'); fg.addColorStop(1, '#B98A2E');
  ctx.fillStyle = fg; ctx.fillRect(x - r * 1.2, top, r * 2.4, y + r * 1.2 - top);
  ctx.fillStyle = 'rgba(255,250,230,0.55)'; ctx.beginPath(); ctx.ellipse(x - r * 0.4, y - r * 0.1, r * 0.14, r * 0.32, -0.4, 0, TAU); ctx.fill();
  ctx.restore();
  glowStroke(ctx, path, { color: P.goldHot, width: 2, bloom: 3 });
  ctx.restore();
}

/* 18. DOOR (xiaomo f_00070) — gold-framed door that opens on a hinge; the gap leaks light.
 * state change: open k 0..1 = "letting someone in". */
export function door(ctx, x, baseY, w, h, { k = 0, hinge = 'left' } = {}) {
  ctx.save();
  const sd = hinge === 'left' ? 1 : -1, x0 = hinge === 'left' ? x : x + w;
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, `rgba(245,200,110,${0.55 * k})`); g.addColorStop(1, `rgba(245,200,110,${0.15 * k})`);
  ctx.fillStyle = g; ctx.fillRect(x, baseY - h, w, h);
  ctx.strokeStyle = 'rgba(232,184,74,0.6)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, baseY - h, w, h);
  const fw = w * Math.cos(k * 1.25), skew = h * 0.08 * Math.sin(k * 1.25);
  ctx.beginPath(); ctx.moveTo(x0, baseY - h); ctx.lineTo(x0 + sd * fw, baseY - h - skew); ctx.lineTo(x0 + sd * fw, baseY + skew); ctx.lineTo(x0, baseY); ctx.closePath();
  const lg = ctx.createLinearGradient(x0, 0, x0 + sd * fw, 0); lg.addColorStop(0, '#3A2E1A'); lg.addColorStop(1, '#6E5326');
  ctx.fillStyle = lg; ctx.fill(); glowStroke(ctx, () => ctx.stroke(), { color: P.gold, width: 1.8, bloom: 2 });
  ctx.fillStyle = P.goldHot; ctx.beginPath(); ctx.arc(x0 + sd * fw * 0.86, baseY - h * 0.48, 3.5, 0, TAU); ctx.fill();
  ctx.restore();
}

/* 19. BRAIN SECTION (moyou f_00021) — sagittal outline in grey hairline; ONE region lights gold.
 * state change: region k 0..1 lights + small node pulse = "this part fires". */
export function brain(ctx, x, y, s, { k = 1, t = 0, region = 'mid' } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const out = () => { ctx.beginPath(); ctx.moveTo(-150, 30); ctx.bezierCurveTo(-170, -60, -90, -125, 0, -122); ctx.bezierCurveTo(100, -120, 165, -60, 158, 20); ctx.bezierCurveTo(152, 62, 110, 78, 70, 70); ctx.bezierCurveTo(50, 92, 40, 120, 30, 140); ctx.lineTo(10, 140); ctx.bezierCurveTo(14, 110, 5, 82, -30, 76); ctx.bezierCurveTo(-90, 80, -140, 70, -150, 30); ctx.closePath(); };
  ctx.fillStyle = 'rgba(30,31,36,0.9)'; out(); ctx.fill();
  ctx.strokeStyle = 'rgba(200,198,190,0.55)'; ctx.lineWidth = 2; out(); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,198,190,0.22)'; ctx.lineWidth = 1.5;
  [[-110, -40, -40, -80, 20, -70], [-60, 10, 0, -30, 70, -20], [-20, 50, 40, 20, 110, 30]].forEach(([a, b, c, d, e, f]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo(c, d, e, f); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(90, 60); ctx.bezierCurveTo(120, 70, 130, 95, 110, 105); ctx.stroke(); // cerebellum hint
  const R = { mid: [-10, 0, 46], front: [-90, -40, 40], back: [90, -30, 40] }[region];
  const kk = ease.clamp01(k);
  glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(R[0], R[1], R[2], Math.PI * 1.05, Math.PI * (1.05 + 1.1 * kk)); }, { color: P.goldHot, width: 9, bloom: 4, alpha: kk });
  const p = 0.6 + 0.4 * Math.sin(t * 4);
  ctx.fillStyle = `rgba(255,240,200,${kk * p})`; ctx.beginPath(); ctx.arc(R[0] - R[2] * 0.2, R[1] + R[2] * 0.75, 6, 0, TAU); ctx.fill();
  ctx.restore();
}
