/** props.js — Emotion UI prop library (own-emotion-ui). STYLE.md §13 is the grammar; every prop here obeys it:
 *  flat fill + ONE soft inner gradient, 2–3 px light keyline at most, corners always rounded (r ≥ 0.12 × short side),
 *  props that "mean the screen" carry cyan light, props that "mean the self" carry orange, everything else is cream / navy.
 *  Every prop takes k (0..1 build-in) so motion.js can enter it with the same pop/settle.
 *  Measured donors: 6911 t8 (bubble stack, flip clock 22:53, status line, hanging lamp + table), nexo t26.5 (eyes + gaze lines,
 *  focus brackets, tension meter 紧张, callout pill), 6571 t4.5 (wall clock, window + moon, bed, phone glow), 2127 (crystal heart), 1183 (glitch text). */
import { P, rgba, mix, glowPool, roundRect, clamp, lerp, FONT, MONO, rng } from './look.js';
const TAU = Math.PI * 2;
const pop = (k) => { k = clamp(k); return k <= 0 ? 0 : 1 + 0.12 * Math.sin(k * Math.PI) * (1 - k) * 2 - 0.0 * k; };   // small overshoot scale
const enter = (ctx, x, y, k) => { const s = lerp(0.6, 1, Math.min(1, k * 1.4)) * pop(k); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 2); };

/* 1. PHONE — mode lock | chat | apps | blank.  Screen is the brightest object in its world (6571); bezel navy, 0.12 w corner. */
export function phone(ctx, x, y, h, { mode = 'lock', t = 0, k = 1, glow = 0.6, time = '19:02', rot = 0, lines = [] } = {}) {
  if (k <= 0) return;
  const w = h * 0.5;
  ctx.save(); enter(ctx, x, y, k); ctx.rotate(rot);
  if (glow > 0) glowPool(ctx, 0, 0, h * 1.25, P.cyan, glow * 0.5);
  roundRect(ctx, -w / 2, -h / 2, w, h, w * 0.18); ctx.fillStyle = '#10162A'; ctx.fill();
  ctx.lineWidth = Math.max(2, h * 0.012); ctx.strokeStyle = rgba(P.cyanHot, 0.55); ctx.stroke();
  const ix = -w / 2 + w * 0.07, iy = -h / 2 + w * 0.07, iw = w * 0.86, ih = h - w * 0.14;
  ctx.save(); roundRect(ctx, ix, iy, iw, ih, w * 0.12); ctx.clip();
  const g = ctx.createLinearGradient(0, iy, 0, iy + ih); g.addColorStop(0, '#1F3A6E'); g.addColorStop(1, '#0F1F44'); ctx.fillStyle = g; ctx.fillRect(ix, iy, iw, ih);
  ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (mode === 'lock') {
    ctx.font = `600 ${h * 0.15}px ${MONO}`; ctx.fillText(time, 0, -h * 0.2);
    ctx.fillStyle = rgba(P.white, 0.5); roundRect(ctx, -w * 0.25, -h * 0.08, w * 0.5, h * 0.018, 2); ctx.fill();
    roundRect(ctx, -w * 0.15, h * 0.4, w * 0.3, h * 0.014, 2); ctx.fill();
  } else if (mode === 'apps') {
    const c = w * 0.17; const cols = ['#FF9A3C', '#7ABAEF', '#5FC4A8', '#EE7D62', '#FFC66B', '#B79CFF'];
    for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) { roundRect(ctx, -w * 0.33 + q * w * 0.25, -h * 0.36 + r * h * 0.14, c, c, c * 0.28); ctx.fillStyle = cols[(r * 3 + q) % 6]; ctx.fill(); }
  } else if (mode === 'chat') {
    lines.forEach((L, i) => { const self = L[0] === '>'; const bw = w * (0.35 + 0.1 * (i % 3)); const by = -h * 0.36 + i * h * 0.13;
      roundRect(ctx, self ? iw / 2 - bw - w * 0.06 + ix + iw / 2 - iw / 2 : -iw / 2 + w * 0.06, by, bw, h * 0.085, h * 0.03);
      ctx.fillStyle = self ? P.orange : P.white; ctx.fill(); });
  }
  ctx.restore(); ctx.restore();
}

/* 2. CHAT BUBBLE — self = orange w/ ink text, other = white w/ ink text (6911 t8). Tail on the speaker side, r = 0.28 h. */
export function chatBubble(ctx, x, y, text, { self = true, k = 1, size = 40, side = null, wobble = 0 } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.font = `700 ${size}px ${FONT}`;
  const tw = ctx.measureText(text).width, pw = size * 0.55, h = size * 1.5, w = tw + pw * 2;
  const sd = side || (self ? 'right' : 'left');
  const ax = sd === 'right' ? x - w : x;   // x is the tail-side edge
  enter(ctx, sd === 'right' ? x : x, y, k); ctx.rotate(wobble);
  const bx = sd === 'right' ? -w : 0;
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = size * 0.4; ctx.shadowOffsetY = size * 0.12;
  roundRect(ctx, bx, -h / 2, w, h, h * 0.28); ctx.fillStyle = self ? P.orange : P.white; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.beginPath(); const tx = sd === 'right' ? -h * 0.2 : h * 0.2; ctx.moveTo(tx, h * 0.22); ctx.lineTo(sd === 'right' ? h * 0.18 : -h * 0.18, h * 0.5); ctx.lineTo(tx + (sd === 'right' ? -h * 0.32 : h * 0.32), h * 0.46); ctx.fill();
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(0.5, 'rgba(255,255,255,0)');
  roundRect(ctx, bx, -h / 2, w, h, h * 0.28); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = P.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(text, bx + pw, size * 0.04);
  ctx.restore();
  return { x0: ax, y0: y - h / 2, x1: ax + w, y1: y + h / 2, text };
}

/* 3. TYPING DOTS — three dots in a small bubble; dots bob 0.4 s phase (nexo t7.5 "···" above the crowd). */
export function typingDots(ctx, x, y, s, { t = 0, k = 1, color = P.white } = {}) {
  if (k <= 0) return;
  ctx.save(); enter(ctx, x, y, k);
  roundRect(ctx, -s, -s * 0.55, s * 2, s * 1.1, s * 0.5); ctx.fillStyle = rgba(color, 0.92); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * 0.45, s * 0.5); ctx.lineTo(-s * 0.7, s * 0.95); ctx.lineTo(-s * 0.05, s * 0.5); ctx.fill();
  for (let i = 0; i < 3; i++) { const b = Math.max(0, Math.sin(t * 7 - i * 0.9)) * s * 0.14;
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc((i - 1) * s * 0.55, -b, s * 0.15, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/* 4. FLIP CLOCK — dark tiles, split line, mono digits (6911 t8 "22:53"). flip = 0..1 animates the last digit turning. */
export function flipClock(ctx, x, y, s, { text = '22:53', k = 1, flip = 0, prev = null } = {}) {
  if (k <= 0) return;
  ctx.save(); enter(ctx, x, y, k);
  const tw = s * 0.62, th = s, gap = s * 0.08; const ch = text.split('');
  const W = ch.reduce((a, c) => a + (c === ':' ? s * 0.25 : tw + gap), 0); let cx = -W / 2;
  ch.forEach((c, i) => {
    if (c === ':') { ctx.fillStyle = rgba(P.white, 0.8); [-0.15, 0.15].forEach(d => { ctx.beginPath(); ctx.arc(cx + s * 0.1, d * s, s * 0.04, 0, TAU); ctx.fill(); }); cx += s * 0.25; return; }
    roundRect(ctx, cx, -th / 2, tw, th, s * 0.08); const g = ctx.createLinearGradient(0, -th / 2, 0, th / 2); g.addColorStop(0, '#2A3044'); g.addColorStop(0.5, '#1B2032'); g.addColorStop(0.5, '#151a2a'); g.addColorStop(1, '#202638'); ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = P.white; ctx.font = `600 ${s * 0.78}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const last = i === ch.length - 1 && flip > 0 && flip < 1 && prev;
    if (last) { ctx.save(); ctx.translate(cx + tw / 2, 0); ctx.scale(1, Math.abs(Math.cos(flip * Math.PI))); ctx.fillText(flip < 0.5 ? prev : c, 0, s * 0.04); ctx.restore(); }
    else ctx.fillText(c, cx + tw / 2, s * 0.04);
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(cx, -1, tw, 2);
    cx += tw + gap;
  });
  ctx.restore();
}

/* 5. HANGING LAMP + LIGHT CONE — dome shade on a cord, cone widens 2.6× to the floor, dust motes drift in the cone (6911). */
export function hangingLamp(ctx, x, topY, y, { w = 150, floorY = 900, on = 1, t = 0, seed = 4, dust = 40, spread = 2.6 } = {}) {
  ctx.save();
  ctx.strokeStyle = '#2A3046'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, topY); ctx.lineTo(x, y - w * 0.25); ctx.stroke();
  if (on > 0) {
    const bw = w * spread * 1.6; const g = ctx.createLinearGradient(0, y, 0, floorY);
    g.addColorStop(0, rgba(P.lamp, 0.42 * on)); g.addColorStop(1, rgba(P.lamp, 0.05 * on));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w * 0.45, y); ctx.lineTo(x + w * 0.45, y); ctx.lineTo(x + bw / 2, floorY); ctx.lineTo(x - bw / 2, floorY); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalAlpha = on; ctx.scale(1, 0.18); glowPool(ctx, x, floorY / 0.18, bw * 0.55, P.lamp, 0.35); ctx.restore();
    const R = rng(seed);
    for (let i = 0; i < dust; i++) { const fy = R(), fx = R() - 0.5, ph = R() * 10;
      const yy = lerp(y + 10, floorY - 10, (fy + t * 0.02 * (0.5 + R())) % 1); const half = lerp(w * 0.45, bw / 2, (yy - y) / (floorY - y));
      const xx = x + fx * 2 * half * 0.9 + Math.sin(t * 0.6 + ph) * 6;
      ctx.fillStyle = rgba(P.lampCore, (0.25 + 0.5 * R()) * on * (0.5 + 0.5 * Math.sin(t * 1.3 + ph))); ctx.beginPath(); ctx.arc(xx, yy, 1.2 + R() * 1.8, 0, TAU); ctx.fill(); }
    glowPool(ctx, x, y + w * 0.05, w * 1.3, P.lamp, 0.55 * on);
  }
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x - w * 0.42, y - w * 0.32, x, y - w * 0.34); ctx.quadraticCurveTo(x + w * 0.42, y - w * 0.32, x + w / 2, y); ctx.closePath();
  const sg = ctx.createLinearGradient(0, y - w * 0.34, 0, y); sg.addColorStop(0, '#3A4260'); sg.addColorStop(1, '#232A40'); ctx.fillStyle = sg; ctx.fill();
  ctx.fillStyle = on > 0 ? mix('#5A5240', P.lampCore, on) : '#5A5240'; ctx.beginPath(); ctx.ellipse(x, y, w * 0.5, w * 0.07, 0, 0, TAU); ctx.fill();
  ctx.restore();
}

/* 6. WINDOW + MOON — 2×2 mullions, moon crescent with halo; city sparks optional (6571, 6911 t31). */
export function windowMoon(ctx, x, y, w, h, { k = 1, city = false, seed = 2, t = 0 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  roundRect(ctx, x, y, w, h, 6); const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1C2A52'); g.addColorStop(1, '#101830'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); roundRect(ctx, x, y, w, h, 6); ctx.clip();
  glowPool(ctx, x + w * 0.68, y + h * 0.3, w * 0.45, P.lamp, 0.35);
  ctx.fillStyle = P.lampCore; ctx.beginPath(); ctx.arc(x + w * 0.68, y + h * 0.3, w * 0.09, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1A274C'; ctx.beginPath(); ctx.arc(x + w * 0.72, y + h * 0.27, w * 0.08, 0, TAU); ctx.fill();
  if (city) { const R = rng(seed); for (let i = 0; i < 9; i++) { const bx = x + i * w / 9, bh = h * (0.25 + R() * 0.35); ctx.fillStyle = '#0B1124'; ctx.fillRect(bx, y + h - bh, w / 9 - 2, bh);
    for (let j = 0; j < 6; j++) if (R() < 0.4) { ctx.fillStyle = rgba(P.gold, 0.6 + 0.3 * Math.sin(t + j)); ctx.fillRect(bx + 4 + (j % 2) * 10, y + h - bh + 8 + Math.floor(j / 2) * 14, 5, 6); } } }
  ctx.restore();
  ctx.strokeStyle = '#C9CEDB'; ctx.lineWidth = 4; roundRect(ctx, x, y, w, h, 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}

/* 7. WALL CLOCK — cream rim, 12 ticks, hands; speed > 1 = time anxiety (6571 t4.5). */
export function wallClock(ctx, x, y, r, { t = 0, speed = 1, k = 1, base = 22.88 } = {}) {
  if (k <= 0) return;
  ctx.save(); enter(ctx, x, y, k);
  ctx.fillStyle = '#121A33'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = P.cream; ctx.lineWidth = r * 0.07; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.lineWidth = r * (i % 3 ? 0.03 : 0.05); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78); ctx.lineTo(Math.cos(a) * r * 0.88, Math.sin(a) * r * 0.88); ctx.stroke(); }
  const hrs = base + t * speed / 60; const ma = (hrs % 1) * TAU - Math.PI / 2, ha = (hrs % 12) / 12 * TAU - Math.PI / 2;
  ctx.lineCap = 'round'; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ha) * r * 0.45, Math.sin(ha) * r * 0.45); ctx.stroke();
  ctx.lineWidth = r * 0.045; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ma) * r * 0.7, Math.sin(ma) * r * 0.7); ctx.stroke();
  ctx.fillStyle = P.orange; ctx.beginPath(); ctx.arc(0, 0, r * 0.07, 0, TAU); ctx.fill();
  ctx.restore();
}

/* 8. BED — cream post, navy duvet with soft lumps, pillow (6571). x,y = front-bottom-left; seat height = 0.36 w. */
export function bed(ctx, x, y, w, { k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  const h = w * 0.36;
  roundRect(ctx, x - w * 0.03, y - w * 0.62, w * 0.035, w * 0.62, w * 0.012); ctx.fillStyle = P.creamShade; ctx.fill();
  roundRect(ctx, x, y - h, w, h * 0.72, 8); ctx.fillStyle = '#222C55'; ctx.fill();
  ctx.fillStyle = '#2D3970'; ctx.beginPath(); ctx.moveTo(x, y - h); for (let i = 0; i <= 4; i++) { const xx = x + w * (0.25 + i * 0.18); ctx.quadraticCurveTo(xx - w * 0.09, y - h - w * 0.07, xx, y - h); } ctx.lineTo(x + w, y - h * 0.4); ctx.lineTo(x, y - h * 0.4); ctx.fill();
  ctx.fillStyle = P.creamShade; ctx.beginPath(); ctx.ellipse(x + w * 0.13, y - h - w * 0.02, w * 0.12, w * 0.035, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#161D3A'; ctx.fillRect(x, y - h * 0.3, w, h * 0.06);
  ctx.restore();
  return { seatY: y - h, x0: x, x1: x + w };
}

/* 9. PING-PONG TABLE + PADDLE + BALL — blue top in perspective, white edge, net (6911). ball = 0..1 position along its arc. */
export function pingTable(ctx, x, y, w, { k = 1, ball = -1, t = 0 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  const d = w * 0.12, top = y;
  ctx.fillStyle = '#121A33'; [[0.08, 0], [0.92, 0], [0.15, -1], [0.85, -1]].forEach(([fx, b]) => ctx.fillRect(x + w * fx - 5, top + (b ? -d * 0.4 : 0), 10, w * 0.17));
  ctx.beginPath(); ctx.moveTo(x + w * 0.06, top - d); ctx.lineTo(x + w * 0.94, top - d); ctx.lineTo(x + w, top); ctx.lineTo(x, top); ctx.closePath();
  const g = ctx.createLinearGradient(0, top - d, 0, top); g.addColorStop(0, '#2F59C9'); g.addColorStop(1, '#1D3E9E'); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = rgba(P.white, 0.85); ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#152C70'; ctx.fillRect(x, top, w, d * 0.18);
  ctx.strokeStyle = rgba(P.white, 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w / 2, top - d); ctx.lineTo(x + w / 2, top - d - w * 0.05); ctx.lineTo(x + w / 2, top - w * 0.05); ctx.lineTo(x + w / 2, top); ctx.stroke();
  ctx.fillStyle = rgba(P.white, 0.25); ctx.fillRect(x + w / 2 - 2, top - d - w * 0.05, 4, d + w * 0.05);
  if (ball >= 0) { const bx = lerp(x + w * 0.1, x + w * 0.9, ball), by = top - d * 0.6 - Math.sin(ball * Math.PI) * w * 0.16;
    glowPool(ctx, bx, by, 18, P.orange, 0.4); ctx.fillStyle = P.orange; ctx.beginPath(); ctx.arc(bx, by, 6, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/* 10. TENSION METER — vertical capsule gauge, fill colour slides calm→tense, label under it (nexo t26.5 「紧张」). */
export function tensionMeter(ctx, x, y, h, { v = 0.5, k = 1, label = '紧张', size = 30 } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.globalAlpha *= clamp(k * 2);
  const w = h * 0.12;
  roundRect(ctx, x - w / 2, y - h, w, h, w / 2); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.stroke();
  const fh = (h - 6) * clamp(v) * clamp(k); const col = mix(P.calm, P.tense, clamp(v * 1.4 - 0.2));
  roundRect(ctx, x - w / 2 + 3, y - 3 - fh, w - 6, fh, (w - 6) / 2); const g = ctx.createLinearGradient(0, y - fh, 0, y); g.addColorStop(0, col); g.addColorStop(1, mix(col, P.void, 0.4)); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = P.white; ctx.font = `600 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(label, x, y + size * 0.5);
  ctx.restore();
  return { x0: x - size, y0: y + size * 0.5, x1: x + size, y1: y + size * 1.6, text: label };
}

/* 11. FOCUS BRACKETS — four L corners that snap in from 1.25× (camera-UI "this is the subject"), nexo t26.5. */
export function focusBrackets(ctx, x, y, w, h, { k = 1, color = P.hero, t = 0, len = 0.16 } = {}) {
  if (k <= 0) return;
  const s = lerp(1.25, 1, clamp(k)); const W = w * s, Hh = h * s, L = Math.min(w, h) * len;
  ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.strokeStyle = color; ctx.lineWidth = 3 + Math.sin(t * 6) * 0.5; ctx.lineCap = 'round';
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { const cx = x + sx * W / 2, cy = y + sy * Hh / 2;
    ctx.beginPath(); ctx.moveTo(cx - sx * L, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy - sy * L); ctx.stroke(); });
  ctx.restore();
}

/* 12. EYE ICON + GAZE LINE — almond eye outline w/ iris; dashed line draws from eye to target (k = draw-on). nexo t26.5. */
export function eye(ctx, x, y, s, { k = 1, look = [1, 0], blink = 0, color = P.mute } = {}) {
  if (k <= 0) return;
  ctx.save(); enter(ctx, x, y, k);
  const o = 1 - clamp(blink);
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, s * 0.09);
  ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * 0.8 * o, s, 0); ctx.quadraticCurveTo(0, s * 0.8 * o, -s, 0); ctx.stroke();
  if (o > 0.2) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(look[0] * s * 0.22, look[1] * s * 0.1, s * 0.3 * o, 0, TAU); ctx.fill(); }
  ctx.restore();
}
export function gazeLine(ctx, ax, ay, bx, by, { k = 1, t = 0, color = P.mute, a = 0.55 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = rgba(color, a); ctx.lineWidth = 2; ctx.setLineDash([8, 9]); ctx.lineDashOffset = -t * 40;
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, bx, clamp(k)), lerp(ay, by, clamp(k))); ctx.stroke(); ctx.restore();
}

/* 13. CALLOUT PILL — leader line from a point to a rounded pill label (nexo t26.5 「表情自然吗？」). */
export function callout(ctx, ax, ay, x, y, text, { k = 1, size = 30, color = P.white } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.font = `600 ${size}px ${FONT}`; const w = ctx.measureText(text).width + size * 1.1, h = size * 1.55;
  const kk = clamp(k * 1.6);
  ctx.strokeStyle = rgba(color, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, x, kk), lerp(ay, y, kk)); ctx.stroke();
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(ax, ay, 4, 0, TAU); ctx.fill();
  const kb = clamp((k - 0.4) / 0.6); if (kb > 0) { ctx.globalAlpha *= kb;
    roundRect(ctx, x, y - h / 2, w, h, h / 2); ctx.fillStyle = 'rgba(14,20,38,0.88)'; ctx.fill(); ctx.strokeStyle = rgba(color, 0.55); ctx.stroke();
    ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, x + size * 0.55, y + 1); }
  ctx.restore();
  return { x0: x, y0: y - h / 2, x1: x + w, y1: y + h / 2, text };
}

/* 14. THOUGHT CLOUD — scalloped cloud outline + 2 trailing puffs, contents drawn by a callback (6571 t9.5). */
export function thoughtCloud(ctx, x, y, w, h, { k = 1, from = null, draw = null, color = P.cream } = {}) {
  if (k <= 0) return;
  ctx.save();
  if (from) [[0.25, 0.05], [0.55, 0.08]].forEach(([f, r], i) => { const kk = clamp(k * 3 - i * 0.6); if (kk <= 0) return;
    ctx.fillStyle = '#121A36'; ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lerp(from[0], x, f), lerp(from[1], y + h / 2, f), w * r * 0.5 * kk, 0, TAU); ctx.fill(); ctx.stroke(); });
  const kc = clamp(k * 1.6 - 0.5); if (kc > 0) {
    ctx.translate(x, y); ctx.scale(lerp(0.5, 1, kc) * pop(kc), lerp(0.5, 1, kc) * pop(kc)); ctx.globalAlpha *= kc;
    const n = 9; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const a = i / n * TAU, nx = Math.cos(a) * w / 2, ny = Math.sin(a) * h / 2; const a0 = (i - 0.5) / n * TAU;
      if (i === 0) ctx.moveTo(Math.cos(a0) * w / 2, Math.sin(a0) * h / 2); else ctx.quadraticCurveTo(nx * 1.22, ny * 1.22, Math.cos(a + 0.5 / n * TAU) * w / 2, Math.sin(a + 0.5 / n * TAU) * h / 2); }
    ctx.closePath(); ctx.fillStyle = '#121A36'; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.stroke();
    if (draw) { ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, w * 0.48, h * 0.46, 0, 0, TAU); ctx.clip(); draw(ctx, w, h); ctx.restore(); }
  }
  ctx.restore();
}

/* 15. STATUS LINE — small grey system text under a bubble stack (6911 t8 「已送达 · 对方暂无动静」). */
export function statusLine(ctx, x, y, text, { k = 1, size = 26, align = 'right', color = '#C3CADB' } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.font = `500 ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y);
  const w = ctx.measureText(text).width; ctx.restore();
  const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x; return { x0, y0: y - size * 0.7, x1: x0 + w, y1: y + size * 0.7, text };
}

/* 16. STAT CARD — glass card, big number counts up, small label; colour codes belief (orange) vs fact (cyan). OUR ADDITION for data. */
export function statCard(ctx, x, y, w, { label = '', value = 0, suffix = '%', k = 1, color = P.orange, sub = '' } = {}) {
  if (k <= 0) return [];
  const h = w * 0.62; ctx.save(); enter(ctx, x, y, k);
  roundRect(ctx, -w / 2, -h / 2, w, h, w * 0.08); ctx.fillStyle = 'rgba(16,22,42,0.9)'; ctx.fill(); ctx.strokeStyle = rgba(color, 0.7); ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = rgba(color, 0.9); roundRect(ctx, -w / 2 + w * 0.08, -h / 2 + h * 0.13, w * 0.07, h * 0.04, 3); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = P.white; ctx.font = `600 ${w * 0.095}px ${FONT}`; ctx.fillText(label, 0, -h * 0.26);
  ctx.fillStyle = color; ctx.font = `700 ${w * 0.3}px ${MONO}`; ctx.fillText(Math.round(value * clamp(k * 1.2)) + suffix, 0, h * 0.08);
  if (sub) { ctx.fillStyle = '#C3CADB'; ctx.font = `500 ${w * 0.065}px ${FONT}`; ctx.fillText(sub, 0, h * 0.36); }
  ctx.restore();
  return [{ x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2, text: label + value + suffix + sub }];
}

/* 17. CRYSTAL HEART — faceted heart, coral/crimson facets + white glint; crack = 0..1 splits it (donor: 2127). */
export function crystalHeart(ctx, x, y, s, { k = 1, t = 0, crack = 0 } = {}) {
  if (k <= 0) return;
  ctx.save(); enter(ctx, x, y + Math.sin(t * 1.6) * s * 0.03, k);
  glowPool(ctx, 0, 0, s * 1.6, P.coral, 0.35);
  const V = [[0, -0.55], [-0.5, -0.95], [-1, -0.55], [-0.95, 0], [0, 0.95], [0.95, 0], [1, -0.55], [0.5, -0.95]].map(([a, b]) => [a * s, b * s]);
  const C = [0, -0.1 * s]; const cols = ['#FF8C7A', '#E2554C', '#B93A44', '#8E2337', '#C6404A', '#F06B5E', '#FFB0A0', '#D84A4F'];
  for (let i = 0; i < V.length; i++) { const a = V[i], b = V[(i + 1) % V.length]; const side = (a[0] + b[0]) < 0 ? -1 : 1; const off = crack * s * 0.18 * side;
    ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.moveTo(C[0] + off, C[1]); ctx.lineTo(a[0] + off, a[1]); ctx.lineTo(b[0] + off, b[1]); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.moveTo(-0.62 * s, -0.7 * s); ctx.lineTo(-0.42 * s, -0.78 * s); ctx.lineTo(-0.7 * s, -0.4 * s); ctx.fill();
  ctx.restore();
}

/* 18. GLITCH TEXT — RGB split + slice offsets for 0.2 s bursts (donor: 1183). Use once per film at most. */
export function glitchText(ctx, x, y, text, { t = 0, k = 1, size = 80, amt = 1, color = P.white } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.font = `800 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha *= clamp(k * 2);
  const j = amt * (Math.sin(t * 53) > 0.6 ? 1 : 0.25);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(255,60,120,0.7)'; ctx.fillText(text, x - 6 * j, y);
  ctx.fillStyle = 'rgba(60,200,255,0.7)'; ctx.fillText(text, x + 6 * j, y);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = color; ctx.fillText(text, x, y);
  const w = ctx.measureText(text).width;
  if (j > 0.5) for (let i = 0; i < 3; i++) { const sy = y - size / 2 + ((i * 37 + Math.floor(t * 20) * 13) % size), sh = 6; ctx.drawImage(ctx.canvas, x - w / 2, sy, w, sh, x - w / 2 + (i - 1) * 14, sy, w, sh); }
  ctx.restore();
  return { x0: x - w / 2, y0: y - size * 0.6, x1: x + w / 2, y1: y + size * 0.6, text };
}

/* 19. LOUD T-SHIRT PRINT — big round face print the wearer believes everyone sees (Gilovich 2000 used a celebrity tee). */
export function tshirtPrint(ctx, x, y, s, { k = 1, t = 0, glow = 0 } = {}) {
  if (k <= 0) return;
  ctx.save(); enter(ctx, x, y, k);
  if (glow > 0) glowPool(ctx, 0, 0, s * 2.2, P.gold, glow * 0.5);
  ctx.fillStyle = P.gold; ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); ctx.fill();
  ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(-s * 0.33, -s * 0.15, s * 0.11, 0, TAU); ctx.arc(s * 0.33, -s * 0.15, s * 0.11, 0, TAU); ctx.fill();
  ctx.strokeStyle = P.ink; ctx.lineWidth = s * 0.1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, s * 0.05, s * 0.45, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.restore();
}

/* 20. SYMPTOM CHIP is in look.js (chip). Listed here for the catalogue. */
export const PROP_LIST = ['phone', 'chatBubble', 'typingDots', 'flipClock', 'hangingLamp', 'windowMoon', 'wallClock', 'bed', 'pingTable', 'tensionMeter',
  'focusBrackets', 'eye', 'gazeLine', 'callout', 'thoughtCloud', 'statusLine', 'statCard', 'crystalHeart', 'glitchText', 'tshirtPrint', 'chip(look.js)'];
