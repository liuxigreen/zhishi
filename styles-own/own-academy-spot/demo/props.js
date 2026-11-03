/** props.js — Academy Spot. Two materials: SOLID flat color-block (surface) and BLUEPRINT dashed line (deep structure).
 * Grammar in STYLE §13. Cite zhongshan-learn frames. */
import { P, rgba, mix, roundRect, glowStroke, glowPool, bpStroke, contactShadow, clamp, lerp, rng, SERIF, SANS, MONO } from './look.js';

const TAU = Math.PI * 2;

/* ── 1. wind-up dog (solid surface) — zhongshan f_00013 / f_00027 ── */
export function windupDog(ctx, x, y, s = 140, { k = 1, walk = 0, keyRot = 0, alpha = 1 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= alpha * clamp(k);
  contactShadow(ctx, x, y, s * 0.75, 0.35);
  const bodyW = s * 0.92, bodyH = s * 0.38, headR = s * 0.24;
  const legH = s * 0.26, legW = s * 0.10;
  const bodyY = y - legH * 0.9;
  // legs first (behind body)
  for (let i = 0; i < 4; i++) {
    const side = i < 2 ? -1 : 1;
    const phase = walk * TAU + i * 1.15;
    const lift = Math.sin(phase) * s * 0.035 * (i % 2 ? 1 : -1);
    const lx = x + side * bodyW * 0.30 + (i % 2 ? bodyW * 0.06 : -bodyW * 0.04);
    ctx.fillStyle = mix(P.red, '#6A281F', 0.3);
    roundRect(ctx, lx - legW / 2, bodyY + lift - 2, legW, legH - lift, 4); ctx.fill();
  }
  // body capsule (no gold collar — that read as a rider)
  ctx.fillStyle = P.red;
  roundRect(ctx, x - bodyW / 2, bodyY - bodyH, bodyW, bodyH, bodyH * 0.42); ctx.fill();
  // soft top rim
  ctx.save(); roundRect(ctx, x - bodyW / 2, bodyY - bodyH, bodyW, bodyH, bodyH * 0.42); ctx.clip();
  const rg = ctx.createLinearGradient(0, bodyY - bodyH, 0, bodyY - bodyH * 0.4);
  rg.addColorStop(0, 'rgba(255,200,160,0.28)'); rg.addColorStop(1, 'rgba(255,200,160,0)');
  ctx.fillStyle = rg; ctx.fillRect(x - bodyW / 2, bodyY - bodyH, bodyW, bodyH * 0.5); ctx.restore();
  // key slot (thin dark notch on back) so the key reads as inserted hardware
  ctx.fillStyle = 'rgba(20,10,8,0.55)';
  roundRect(ctx, x - s * 0.04, bodyY - bodyH - 1, s * 0.08, s * 0.07, 2); ctx.fill();
  // head
  const hx = x + bodyW * 0.48, hy = bodyY - bodyH * 0.55;
  ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(hx, hy, headR, 0, TAU); ctx.fill();
  // floppy ear
  ctx.beginPath(); ctx.ellipse(hx - headR * 0.6, hy + headR * 0.05, headR * 0.38, headR * 0.6, -0.5, 0, TAU); ctx.fill();
  // eye + nose (source: single dark dots)
  ctx.fillStyle = '#140C0A';
  ctx.beginPath(); ctx.arc(hx + headR * 0.22, hy - headR * 0.08, headR * 0.11, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + headR * 0.72, hy + headR * 0.18, headR * 0.13, 0, TAU); ctx.fill();
  // wind-up key: thin wire T, clearly ABOVE the back (not a figure)
  windupKey(ctx, x - bodyW * 0.02, bodyY - bodyH - s * 0.01, s * 0.34, { rot: keyRot, glow: 0.55, color: P.cream });
  // curly tail
  ctx.strokeStyle = mix(P.red, '#8A3028', 0.2); ctx.lineWidth = s * 0.055; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - bodyW * 0.48, bodyY - bodyH * 0.45);
  ctx.quadraticCurveTo(x - bodyW * 0.75, bodyY - bodyH * 1.15, x - bodyW * 0.5, bodyY - bodyH * 0.15); ctx.stroke();
  ctx.restore();
}

/* ── 2. wind-up key ── */
export function windupKey(ctx, x, y, s = 40, { rot = 0, glow = 0.5, color = P.gold } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  // thin wire T-key (reads as hardware, not a figure)
  glowStroke(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.05); ctx.lineTo(0, -s * 0.62);           // shaft
    ctx.moveTo(-s * 0.42, -s * 0.62); ctx.lineTo(s * 0.42, -s * 0.62); // crossbar
    ctx.moveTo(-s * 0.42, -s * 0.62); ctx.lineTo(-s * 0.42, -s * 0.82); // left tooth
    ctx.moveTo(s * 0.42, -s * 0.62); ctx.lineTo(s * 0.42, -s * 0.82);   // right tooth
  }, { color, width: Math.max(1.6, s * 0.045), bloom: 2 + glow, alpha: 0.95 });
  ctx.beginPath(); ctx.arc(0, 0, s * 0.09, 0, TAU);
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = rgba(P.void, 0.35); ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}

/* ── 3. blueprint dog (deep structure) — zhongshan f_00034 ── */
export function blueprintDog(ctx, x, y, s = 180, { k = 1, alpha = 0.95 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= alpha * clamp(k);
  const bodyW = s * 0.95, bodyH = s * 0.42, headR = s * 0.22;
  const by = y - bodyH;
  // soft pool under schema
  glowPool(ctx, x, y + s * 0.1, s * 0.7, P.blueprint, 0.12);
  // body as explicit rounded path (avoid nested beginPath from roundRect)
  const bodyPath = () => {
    const r = bodyH * 0.32;
    ctx.beginPath();
    ctx.moveTo(x - bodyW / 2 + r, by);
    ctx.lineTo(x + bodyW / 2 - r, by);
    ctx.quadraticCurveTo(x + bodyW / 2, by, x + bodyW / 2, by + r);
    ctx.lineTo(x + bodyW / 2, by + bodyH - r);
    ctx.quadraticCurveTo(x + bodyW / 2, by + bodyH, x + bodyW / 2 - r, by + bodyH);
    ctx.lineTo(x - bodyW / 2 + r, by + bodyH);
    ctx.quadraticCurveTo(x - bodyW / 2, by + bodyH, x - bodyW / 2, by + bodyH - r);
    ctx.lineTo(x - bodyW / 2, by + r);
    ctx.quadraticCurveTo(x - bodyW / 2, by, x - bodyW / 2 + r, by);
    ctx.closePath();
  };
  bpStroke(ctx, bodyPath, { dash: [7, 5], width: 2, alpha: 0.95, color: P.blueprint, glow: true });
  // head circle
  bpStroke(ctx, () => { ctx.beginPath(); ctx.arc(x + bodyW / 2 + headR * 0.55, by + bodyH * 0.45, headR, 0, TAU); },
    { dash: [6, 5], width: 1.8, alpha: 0.95, color: P.blueprint, glow: true });
  // legs
  bpStroke(ctx, () => {
    ctx.beginPath();
    for (const sx of [-0.32, -0.12, 0.12, 0.32]) {
      ctx.moveTo(x + bodyW * sx, by + bodyH); ctx.lineTo(x + bodyW * sx, by + bodyH + s * 0.3);
    }
  }, { dash: [5, 4], width: 1.8, alpha: 0.9, color: P.blueprint });
  // internal bay
  bpStroke(ctx, () => {
    const bx = x - bodyW * 0.22, by2 = by + bodyH * 0.22, bw = bodyW * 0.4, bh = bodyH * 0.55;
    ctx.beginPath(); ctx.rect(bx, by2, bw, bh);
  }, { dash: [4, 4], width: 1.4, alpha: 0.85, color: P.blueprintHot });
  // gears inside
  if (k > 0.35) {
    gear(ctx, x - bodyW * 0.02, by + bodyH * 0.5, s * 0.13, { k: (k - 0.35) / 0.65, color: P.gold, teeth: 8, fill: true });
    gear(ctx, x + bodyW * 0.16, by + bodyH * 0.42, s * 0.09, { k: (k - 0.45) / 0.55, color: P.blueprintHot, teeth: 6, rot: 0.35 });
  }
  ctx.restore();
}

/* ── 4. spiral spring ── */
export function spring(ctx, x, y, s = 50, { k = 1, color = P.gold, turns = 3.5 } = {}) {
  if (k <= 0) return;
  glowStroke(ctx, () => {
    ctx.beginPath();
    const n = Math.floor(60 * k);
    for (let i = 0; i <= n; i++) {
      const t = i / 60; const a = t * turns * TAU; const r = s * (0.15 + t * 0.55);
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.55;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
  }, { color, width: 2.4, bloom: 3, alpha: 0.95 });
}

/* ── 5. gear ── */
export function gear(ctx, x, y, r = 30, { k = 1, teeth = 10, rot = 0, color = P.gold, fill = false } = {}) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= clamp(k);
  const path = () => {
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * TAU, a1 = ((i + 0.45) / teeth) * TAU, a2 = ((i + 0.55) / teeth) * TAU, a3 = ((i + 1) / teeth) * TAU;
      const r0 = r * 0.72, r1 = r;
      ctx.lineTo(Math.cos(a0) * r0, Math.sin(a0) * r0);
      ctx.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
      ctx.lineTo(Math.cos(a2) * r1, Math.sin(a2) * r1);
      ctx.lineTo(Math.cos(a3) * r0, Math.sin(a3) * r0);
    }
    ctx.closePath();
  };
  if (fill) { path(); ctx.fillStyle = rgba(color, 0.15); ctx.fill(); }
  glowStroke(ctx, path, { color, width: 1.6, bloom: 2 });
  ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, TAU); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

/* ── 6. question orbit cards — zhongshan f_00027 ── */
export function questionOrbit(ctx, cx, cy, R, items, { k = 1, rot = 0, color = P.blue } = {}) {
  if (k <= 0) return;
  // dashed ellipse
  bpStroke(ctx, () => {
    ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.55, 0, 0, TAU);
  }, { color, dash: [5, 6], width: 1.3, alpha: 0.55 * k });
  items.forEach((txt, i) => {
    const a = rot + (i / items.length) * TAU;
    const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.55;
    const kk = clamp((k - i * 0.08) / 0.4);
    if (kk <= 0) return;
    calloutCard(ctx, x, y, txt, { color, k: kk, size: 18 });
  });
}

/* ── 7. callout card / bubble ── */
export function calloutCard(ctx, x, y, text, { color = P.blue, k = 1, size = 20, pad = 10 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  ctx.font = `600 ${size}px ${SERIF}`;
  const tw = ctx.measureText(text).width; const w = tw + pad * 2, h = size + pad * 1.4;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 6);
  ctx.fillStyle = P.card; ctx.fill();
  ctx.strokeStyle = rgba(color, 0.7); ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1);
  ctx.restore();
}

/* ── 8. speech bubble pointing to a peg ── */
export function speechBubble(ctx, x, y, text, { color = P.gold, k = 1, size = 22, tip = [0, 30] } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  ctx.font = `600 ${size}px ${SERIF}`;
  const tw = ctx.measureText(text).width; const w = tw + 28, h = size + 22;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 10);
  ctx.fillStyle = P.card; ctx.fill();
  ctx.strokeStyle = rgba(color, 0.75); ctx.lineWidth = 1.6; ctx.stroke();
  // tip
  ctx.beginPath(); ctx.moveTo(x - 8, y + h / 2 - 1); ctx.lineTo(x + tip[0], y + h / 2 + tip[1]); ctx.lineTo(x + 8, y + h / 2 - 1);
  ctx.fillStyle = P.card; ctx.fill(); ctx.stroke();
  ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1);
  ctx.restore();
}

/* ── 9. concentric understanding rings — scene s_0002 ── */
export function concentricRings(ctx, cx, cy, R, { k = 1, labels = ['表面', '用法', '原理'], highlight = 2 } = {}) {
  if (k <= 0) return;
  const colors = [P.blueDim, mix(P.tan, P.gold, 0.3), P.gold];
  for (let i = 0; i < 3; i++) {
    const rr = R * (1 - i * 0.28); const kk = clamp((k - i * 0.15) / 0.5);
    if (kk <= 0) continue;
    ctx.save(); ctx.globalAlpha = kk;
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU);
    ctx.fillStyle = rgba(colors[i], i === highlight ? 0.28 : 0.10); ctx.fill();
    glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); }, { color: colors[i], width: i === highlight ? 2.4 : 1.4, bloom: i === highlight ? 3 : 1 });
    if (labels[i]) {
      ctx.font = `600 20px ${SERIF}`; ctx.fillStyle = i === highlight ? P.goldHot : P.cream;
      ctx.textAlign = 'center'; ctx.fillText(labels[i], cx, cy - rr + 28);
    }
    ctx.restore();
  }
  // centre gear
  if (k > 0.6) gear(ctx, cx, cy, R * 0.16, { k: (k - 0.6) / 0.4, color: P.goldHot, teeth: 8, fill: true });
}

/* ── 10. balance scale — scene s_0004 ── */
export function balanceScale(ctx, cx, cy, s = 280, { tilt = 0, k = 1 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  // pedestal
  ctx.fillStyle = P.tan;
  roundRect(ctx, cx - s * 0.04, cy - s * 0.55, s * 0.08, s * 0.55, 3); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy - s * 0.55, s * 0.055, 0, TAU); ctx.fill();
  // beam
  ctx.save(); ctx.translate(cx, cy - s * 0.55); ctx.rotate(tilt);
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(-s * 0.48, 0); ctx.lineTo(s * 0.48, 0); }, { color: P.cream, width: 2.2, bloom: 1 });
  // left hanger (blue / quantity)
  const lx = -s * 0.42, rx = s * 0.42;
  bpStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx - s * 0.12, s * 0.22); ctx.lineTo(lx + s * 0.12, s * 0.22); ctx.closePath(); }, { color: P.blueprint, dash: [], width: 1.6 });
  glowStroke(ctx, () => { ctx.beginPath(); ctx.ellipse(lx, s * 0.28, s * 0.16, s * 0.05, 0, 0, TAU); }, { color: P.blue, width: 2, bloom: 2 });
  // right hanger (gold / quality)
  bpStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx - s * 0.12, s * 0.22); ctx.lineTo(rx + s * 0.12, s * 0.22); ctx.closePath(); }, { color: P.gold, dash: [], width: 1.6 });
  glowStroke(ctx, () => { ctx.beginPath(); ctx.ellipse(rx, s * 0.28, s * 0.16, s * 0.05, 0, 0, TAU); }, { color: P.gold, width: 2, bloom: 2 });
  ctx.restore();
  ctx.restore();
  return { left: [cx - s * 0.42, cy - s * 0.55 + Math.sin(tilt) * (-s * 0.42) + s * 0.28], right: [cx + s * 0.42, cy - s * 0.55 + Math.sin(tilt) * (s * 0.42) + s * 0.28], tilt };
}

/* ── 11. shallow question block ── */
export function shallowBlock(ctx, x, y, text, { k = 1, w = 90, h = 36 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 4);
  ctx.fillStyle = rgba(P.mute, 0.35); ctx.fill();
  ctx.strokeStyle = rgba(P.blue, 0.4); ctx.lineWidth = 1; ctx.stroke();
  ctx.font = `500 15px ${SANS}`; ctx.fillStyle = P.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1); ctx.restore();
}

/* ── 12. glowing why ring ── */
export function whyRing(ctx, x, y, text = '为什么?', { k = 1, s = 70 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  glowPool(ctx, x, y, s * 1.4, P.gold, 0.35);
  glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(x, y, s * 0.7, 0, TAU); }, { color: P.goldHot, width: 2.5, bloom: 4 });
  roundRect(ctx, x - s * 0.55, y - 18, s * 1.1, 36, 6);
  ctx.fillStyle = rgba(P.gold, 0.2); ctx.fill();
  ctx.font = `700 22px ${SERIF}`; ctx.fillStyle = P.goldHot; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1); ctx.restore();
}

/* ── 13. zipper (illusion of explanatory depth) — f_00122 ── */
export function zipper(ctx, x, y, h = 320, { open = 0.45, k = 1 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  const w = 70; const mid = y;
  const openH = h * open;
  // closed top
  roundRect(ctx, x - w / 2, y - h / 2, w, h / 2 - openH / 2 + 10, 4);
  ctx.fillStyle = rgba(P.blueprint, 0.25); ctx.fill();
  ctx.strokeStyle = rgba(P.blueprintHot, 0.7); ctx.lineWidth = 1.5; ctx.stroke();
  // open V bottom
  ctx.beginPath();
  ctx.moveTo(x - w / 2, mid - openH / 2 + 10); ctx.lineTo(x - w * 1.1, y + h / 2); ctx.lineTo(x - w / 2 - 4, mid - openH / 2 + 10);
  ctx.moveTo(x + w / 2, mid - openH / 2 + 10); ctx.lineTo(x + w * 1.1, y + h / 2); ctx.lineTo(x + w / 2 + 4, mid - openH / 2 + 10);
  ctx.strokeStyle = rgba(P.blueprint, 0.8); ctx.lineWidth = 2; ctx.stroke();
  // teeth
  for (let i = 0; i < 12; i++) {
    const ty = y - h / 2 + 14 + i * ((h / 2 - openH / 2) / 12);
    ctx.fillStyle = rgba(P.cream, 0.55);
    ctx.fillRect(x - 8, ty, 7, 5); ctx.fillRect(x + 1, ty + 3, 7, 5);
  }
  // slider
  const sy = mid - openH / 2 + 4;
  roundRect(ctx, x - 16, sy - 14, 32, 28, 4); ctx.fillStyle = mix(P.mute, P.gold, 0.3); ctx.fill();
  ctx.strokeStyle = P.cream; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.restore();
}

/* ── 14. bar compare (belief vs after) ── */
export function barCompare(ctx, x, y, { belief = 7, after = 2.5, max = 7, k = 1, label = '我有多懂？' } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  const bh = 180, bw = 36;
  ctx.font = `600 18px ${SERIF}`; ctx.fillStyle = P.cream; ctx.textAlign = 'center'; ctx.fillText(label, x, y - bh / 2 - 24);
  // outline belief
  roundRect(ctx, x - bw / 2, y + bh / 2 - (belief / max) * bh, bw, (belief / max) * bh, 4);
  ctx.strokeStyle = rgba(P.cream, 0.35); ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = `400 14px ${SANS}`; ctx.fillStyle = P.mute; ctx.fillText('以为', x, y - bh / 2 - 4);
  // filled after
  const fh = (after / max) * bh;
  roundRect(ctx, x - bw / 2, y + bh / 2 - fh, bw, fh, 4);
  const g = ctx.createLinearGradient(x, y + bh / 2, x, y + bh / 2 - fh);
  g.addColorStop(0, P.red); g.addColorStop(1, P.orange); ctx.fillStyle = g; ctx.fill();
  ctx.font = `500 14px ${SANS}`; ctx.fillStyle = P.goldHot; ctx.fillText('讲完', x, y + bh / 2 + 22);
  // ticks
  ctx.strokeStyle = rgba(P.mute, 0.4); ctx.lineWidth = 1;
  for (let i = 1; i <= max; i++) {
    const ty = y + bh / 2 - (i / max) * bh;
    ctx.beginPath(); ctx.moveTo(x + bw / 2 + 6, ty); ctx.lineTo(x + bw / 2 + 14, ty); ctx.stroke();
    ctx.font = `400 12px ${MONO}`; ctx.fillStyle = P.mute; ctx.textAlign = 'left'; ctx.fillText(String(i), x + bw / 2 + 18, ty + 4);
  }
  ctx.restore();
}

/* ── 15. spiral knowledge steps ── */
export function spiralSteps(ctx, x0, y0, x1, y1, n = 6, { k = 1, color = P.gold } = {}) {
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1); const kk = clamp((k - i * 0.1) / 0.4); if (kk <= 0) continue;
    const x = lerp(x0, x1, t), y = lerp(y0, y1, t); const r = 28 - i * 1.5;
    ctx.save(); ctx.globalAlpha = kk;
    glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, { color, width: 1.4, bloom: 2 });
    // mandala / gear-ish inner
    gear(ctx, x, y, r * 0.7, { k: kk, teeth: 6, color, rot: i * 0.4 });
    ctx.restore();
  }
}

/* ── 16. decision wheel ── */
export function decisionWheel(ctx, cx, cy, R, items, { k = 1, rot = 0 } = {}) {
  if (k <= 0) return;
  glowStroke(ctx, () => { ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); }, { color: P.cream, width: 1.5, bloom: 1, alpha: 0.5 * k });
  // tripod supports
  bpStroke(ctx, () => {
    ctx.beginPath(); ctx.moveTo(cx - R * 0.55, cy + R * 0.85); ctx.lineTo(cx, cy); ctx.lineTo(cx + R * 0.55, cy + R * 0.85);
  }, { color: P.blueprint, dash: [], width: 1.5, alpha: 0.7 * k });
  items.forEach((txt, i) => {
    const a = rot + (i / items.length) * TAU - Math.PI / 2;
    const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
    const kk = clamp((k - i * 0.06) / 0.35); if (kk <= 0) return;
    calloutCard(ctx, x, y, txt, { color: P.blue, k: kk, size: 16, pad: 8 });
  });
}

/* ── 17. books stack ── */
export function books(ctx, x, y, { k = 1, n = 4 } = {}) {
  if (k <= 0) return;
  const cols = [P.blueDim, '#7A6A9A', P.goldDim, '#6A5040'];
  for (let i = 0; i < n; i++) {
    const kk = clamp((k - i * 0.1) / 0.4); if (kk <= 0) continue;
    ctx.save(); ctx.globalAlpha = kk;
    const yy = y - i * 18; const w = 90 + (i % 2) * 10;
    roundRect(ctx, x - w / 2, yy - 16, w, 16, 2); ctx.fillStyle = cols[i % cols.length]; ctx.fill();
    ctx.strokeStyle = rgba('#000', 0.25); ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  }
}

/* ── 18. knowledge graph (star links) ── */
export function knowledgeGraph(ctx, cx, cy, nodes, { k = 1 } = {}) {
  if (k <= 0) return;
  nodes.forEach((n, i) => {
    const kk = clamp((k - i * 0.08) / 0.4); if (kk <= 0) return;
    bpStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y); }, { color: P.cream, dash: [4, 5], width: 1.2, alpha: 0.55 * kk });
    glowPool(ctx, n.x, n.y, 28, n.color || P.gold, 0.25 * kk);
    if (n.draw) n.draw(ctx, n.x, n.y, kk);
    else { ctx.save(); ctx.globalAlpha = kk; ctx.font = `600 16px ${SANS}`; ctx.fillStyle = P.cream; ctx.textAlign = 'center'; ctx.fillText(n.label || '', n.x, n.y + 4); ctx.restore(); }
  });
}

/* ── 19. matthew / gap graph ── */
export function gapGraph(ctx, x, y, w, h, { k = 1, t = 0 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  // axes
  ctx.strokeStyle = rgba(P.mute, 0.5); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.lineTo(x + w, y - h); ctx.stroke(); // wait floor at bottom
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y - h); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke();
  // gold curve (expert accelerating)
  glowStroke(ctx, () => {
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const u = i / 40; const px = x + u * w * Math.min(1, t + 0.15); const py = y - Math.pow(u, 1.6) * h * 0.95;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
  }, { color: P.gold, width: 2.2, bloom: 2 });
  // blue curve (novice flat)
  glowStroke(ctx, () => {
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const u = i / 40; const px = x + u * w * Math.min(1, t + 0.15); const py = y - Math.pow(u, 0.7) * h * 0.35;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
  }, { color: P.blue, width: 2, bloom: 2 });
  ctx.font = `600 18px ${SERIF}`; ctx.fillStyle = P.goldHot; ctx.fillText('差距', x + w * 0.72, y - h * 0.6);
  ctx.restore();
}

/* ── 20. label tag with leader ── */
export function labelTag(ctx, x, y, tx, ty, text, { color = P.gold, k = 1 } = {}) {
  if (k <= 0) return;
  bpStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); }, { color, dash: [3, 4], width: 1.2, alpha: 0.7 * k });
  calloutCard(ctx, tx, ty, text, { color, k, size: 18 });
}

/* ── 21. pedestal / display block ── */
export function pedestal(ctx, x, y, w = 120, h = 40, { k = 1, color = P.tan } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  // simple isometric-ish block
  ctx.fillStyle = color; roundRect(ctx, x - w / 2, y - h, w, h, 3); ctx.fill();
  ctx.fillStyle = mix(color, '#000', 0.25); roundRect(ctx, x - w / 2, y - 6, w, 6, 2); ctx.fill();
  ctx.fillStyle = mix(color, '#FFF', 0.15); roundRect(ctx, x - w / 2, y - h, w, 8, 2); ctx.fill();
  ctx.restore();
}

/* ── 22. pencil + lined paper (closing beat) ── */
export function pencilPaper(ctx, x, y, { k = 1, write = 0 } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k);
  // paper
  roundRect(ctx, x - 90, y - 110, 180, 200, 4); ctx.fillStyle = rgba(P.cream, 0.92); ctx.fill();
  ctx.strokeStyle = rgba(P.mute, 0.4); ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = rgba(P.blue, 0.35); ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) { const yy = y - 80 + i * 22; ctx.beginPath(); ctx.moveTo(x - 70, yy); ctx.lineTo(x + 70, yy); ctx.stroke(); }
  // pencil
  ctx.save(); ctx.translate(x + 70, y + 20); ctx.rotate(-0.5 + write * 0.1);
  ctx.fillStyle = P.gold; roundRect(ctx, -6, -70, 12, 100, 2); ctx.fill();
  ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(-6, 30); ctx.lineTo(0, 48); ctx.lineTo(6, 30); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.restore();
}
