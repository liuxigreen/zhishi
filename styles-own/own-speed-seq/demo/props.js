/** Speed Seq — props. Core = bottom sequencer. Also metronome, BPM numeral, disco ball,
 * turntable, lamp, guitar, kick drum, chandelier, sofa, rainbow, footprint icon, hit flash. */
import { P, rgba, mix, glowPool, roundRect, contactShadow, clamp, lerp, FONT, MONO, rng } from './look.js';

const TAU = Math.PI * 2;

/** Persistent bottom sequencer (0594 every frame).
 * @param o.y top of sequencer band  @param o.h band height
 * @param o.playhead 0..1 across  @param o.pattern array of tracks: {icon, color, hits: number[] 0..1 positions, shape:'dot'|'dash'|'bar'|'ring'}
 * @param o.sig time signature label e.g. '4/4'  @param o.theme 'beige'|'dark'|'disco'|'gold'
 * @param o.hitFlash 0..1 glow on the column under playhead
 */
export function sequencer(ctx, o = {}) {
  const {
    x = 0, y = 760, w = 1920, h = 320, playhead = 0.25, pattern = null, sig = '4/4',
    theme = 'beige', hitFlash = 0, beatN = 16, labels = true,
  } = o;
  const tracks = pattern || defaultPattern(theme, beatN);
  const padL = 110, padR = 40, padT = 36, padB = 28;
  const innerX = x + padL, innerW = w - padL - padR;
  const trackH = (h - padT - padB) / tracks.length;

  // chrome
  ctx.save();
  if (theme === 'beige') {
    ctx.fillStyle = P.paper2; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = P.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 40, y + 18); ctx.lineTo(x + w - 40, y + 18);
    ctx.moveTo(x + 40, y + h - 18); ctx.lineTo(x + w - 40, y + h - 18); ctx.stroke();
  } else {
    const bg = theme === 'disco' ? '#120A14' : theme === 'gold' ? '#1A120C' : '#0E0A0C';
    ctx.fillStyle = bg; ctx.fillRect(x, y, w, h);
    // top rail
    const rail = ctx.createLinearGradient(0, y, 0, y + 10);
    rail.addColorStop(0, theme === 'disco' ? P.cyan : P.seqBeige); rail.addColorStop(1, rgba(P.seqBeige, 0));
    ctx.fillStyle = rail; ctx.fillRect(x, y, w, 8);
    if (theme === 'disco') {
      [[P.cyan, 0], [P.pink, 3], [P.yellow, 6]].forEach(([c, dy]) => {
        ctx.fillStyle = c; ctx.fillRect(x, y + dy, w, 2);
      });
    }
  }

  // left icons + signature
  ctx.font = `700 22px ${MONO}`; ctx.fillStyle = theme === 'beige' ? P.ink : P.seqBeige;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (labels) ctx.fillText(sig, x + padL / 2, y + padT * 0.55);
  tracks.forEach((tr, i) => {
    const cy = y + padT + i * trackH + trackH / 2;
    drawTrackIcon(ctx, x + padL / 2, cy, tr.icon || 'dot', theme === 'beige' ? P.inkSoft : (tr.color || P.seqBeige));
  });

  // grid + hits
  const phX = innerX + playhead * innerW;
  tracks.forEach((tr, i) => {
    const cy = y + padT + i * trackH + trackH / 2;
    // baseline
    ctx.strokeStyle = theme === 'beige' ? rgba(P.ink, 0.15) : rgba(P.seqBeige, 0.2);
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(innerX, cy); ctx.lineTo(innerX + innerW, cy); ctx.stroke();
    // measure ticks
    for (let b = 0; b <= beatN; b++) {
      const bx = innerX + (b / beatN) * innerW;
      const major = b % 4 === 0;
      ctx.strokeStyle = theme === 'beige' ? rgba(P.ink, major ? 0.35 : 0.12) : rgba(P.seqBeige, major ? 0.4 : 0.12);
      ctx.lineWidth = major ? 1.5 : 1;
      ctx.beginPath(); ctx.moveTo(bx, cy - trackH * 0.32); ctx.lineTo(bx, cy + trackH * 0.32); ctx.stroke();
    }
    (tr.hits || []).forEach((hp) => {
      const hx = innerX + hp * innerW;
      const past = hx <= phX;
      const col = past ? rgba(tr.color || P.accent, 0.45) : (tr.color || (theme === 'beige' ? P.ink : P.seqBeige));
      const under = Math.abs(hx - phX) < innerW / beatN * 0.55;
      const c = under ? P.accentHot : col;
      drawHit(ctx, hx, cy, tr.shape || 'dot', c, trackH * 0.28, under ? 1 + hitFlash : 1);
    });
  });

  // playhead
  ctx.strokeStyle = P.accent; ctx.lineWidth = 3;
  ctx.shadowColor = rgba(P.accent, 0.6); ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(phX, y + 12); ctx.lineTo(phX, y + h - 12); ctx.stroke();
  ctx.shadowBlur = 0;
  // triangle tip
  ctx.fillStyle = P.accent;
  ctx.beginPath(); ctx.moveTo(phX, y + 8); ctx.lineTo(phX - 8, y + 22); ctx.lineTo(phX + 8, y + 22); ctx.closePath(); ctx.fill();
  // hit flash disc
  if (hitFlash > 0) {
    glowPool(ctx, phX, y + h / 2, 80, P.accentHot, 0.45 * hitFlash);
    ctx.beginPath(); ctx.arc(phX, y + h / 2, 10 + 8 * hitFlash, 0, TAU);
    ctx.fillStyle = rgba(P.accentHot, 0.85 * hitFlash); ctx.fill();
  }
  ctx.restore();
  return { playheadX: phX, y, h, innerX, innerW };
}

function defaultPattern(theme, n) {
  const step = 1 / n;
  const every = (k, off = 0) => Array.from({ length: Math.floor(n / k) }, (_, i) => (i * k + off) * step);
  if (theme === 'disco') {
    return [
      { icon: 'hat', color: P.cyan, shape: 'dash', hits: every(1) },
      { icon: 'heart', color: P.pink, shape: 'dot', hits: every(2, 1) },
      { icon: 'guitar', color: P.yellow, shape: 'bar', hits: every(4, 2) },
      { icon: 'kick', color: P.white, shape: 'ring', hits: every(4) },
    ];
  }
  if (theme === 'gold') {
    return [
      { icon: 'hat', color: P.gold, shape: 'dot', hits: every(3) },
      { icon: 'kick', color: P.goldSoft, shape: 'ring', hits: every(3) },
    ];
  }
  // beige / dark 4/4
  return [
    { icon: 'hat', color: theme === 'beige' ? P.ink : P.seqBeige, shape: 'dash', hits: every(1) },
    { icon: 'kick', color: P.accent, shape: 'dot', hits: every(4) },
  ];
}
function drawHit(ctx, x, y, shape, color, r, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.fillStyle = color; ctx.strokeStyle = color;
  if (shape === 'dash') { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke(); }
  else if (shape === 'bar') { roundRect(ctx, -r * 0.7, -r * 0.55, r * 1.4, r * 1.1, 3); ctx.fill(); }
  else if (shape === 'ring') { ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.25, 0, TAU); ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function drawTrackIcon(ctx, x, y, icon, color) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
  if (icon === 'kick') { ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill(); }
  else if (icon === 'hat') { ctx.beginPath(); ctx.arc(0, -2, 8, Math.PI, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(10, -2); ctx.stroke(); }
  else if (icon === 'guitar') { ctx.beginPath(); ctx.ellipse(0, 4, 7, 9, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, -14); ctx.stroke(); }
  else if (icon === 'heart') { ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-12, -2, -8, -12, 0, -6); ctx.bezierCurveTo(8, -12, 12, -2, 0, 6); ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/** Classic metronome pyramid with swinging arm (0594 t18 / t36). */
export function metronome(ctx, x, y, s = 180, { angle = 0, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); contactShadow(ctx, x, y + s * 0.45, s * 0.35, 0.35);
  // body pyramid
  ctx.beginPath(); ctx.moveTo(x, y - s * 0.5); ctx.lineTo(x + s * 0.32, y + s * 0.45); ctx.lineTo(x - s * 0.32, y + s * 0.45); ctx.closePath();
  const g = ctx.createLinearGradient(x - s * 0.3, y, x + s * 0.3, y);
  g.addColorStop(0, '#C4A882'); g.addColorStop(0.5, '#E8D2B0'); g.addColorStop(1, '#A88860');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5; ctx.stroke();
  // window
  roundRect(ctx, x - s * 0.08, y - s * 0.25, s * 0.16, s * 0.45, 3); ctx.fillStyle = '#1A1410'; ctx.fill();
  // swinging arm
  ctx.save(); ctx.translate(x, y - s * 0.22); ctx.rotate(angle);
  ctx.fillStyle = P.ink; roundRect(ctx, -3, -s * 0.05, 6, s * 0.55, 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, s * 0.48, 10, 0, TAU); ctx.fillStyle = P.accent; ctx.fill();
  ctx.restore();
  // base
  roundRect(ctx, x - s * 0.38, y + s * 0.42, s * 0.76, s * 0.1, 4); ctx.fillStyle = '#8A6A48'; ctx.fill();
  ctx.restore();
}

/** Huge italic BPM numeral with footprint (0594 t18 「70」). */
export function bpmNum(ctx, x, y, n, { size = 220, underline = true, footprint = true, k = 1 } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  const text = String(n);
  ctx.font = `900 italic ${size}px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = P.ink; ctx.fillText(text, x, y);
  const tw = ctx.measureText(text).width;
  if (footprint) {
    // orange footprint glyph (0594 t18) — sole + 3 toes, left of the numeral
    ctx.save(); ctx.translate(x - size * 0.28, y + size * 0.02); ctx.rotate(-0.55); ctx.fillStyle = P.accent;
    ctx.beginPath(); ctx.ellipse(0, 0, size * 0.055, size * 0.09, 0.2, 0, TAU); ctx.fill(); // sole
    const toes = [[-0.04, -0.12], [0.0, -0.14], [0.04, -0.12]];
    toes.forEach(([tx, ty], i) => { ctx.beginPath(); ctx.ellipse(size * tx, size * ty, size * 0.018, size * 0.024, 0, 0, TAU); ctx.fill(); });
    ctx.restore();
  }
  if (underline) { ctx.fillStyle = P.accent; ctx.fillRect(x, y + size * 0.42, tw * 0.92, size * 0.045); }
  ctx.restore();
  return { text, x0: x, y0: y - size * 0.5, x1: x + tw, y1: y + size * 0.5 };
}

/** Disco ball + beams (0594 t146). */
export function discoBall(ctx, x, y, r = 70, { t = 0, beams = 6, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  // cable
  ctx.strokeStyle = rgba(P.white, 0.5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - r); ctx.stroke();
  // ball
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, '#F0F4F8'); g.addColorStop(1, '#6A7580');
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
  // tiles
  ctx.strokeStyle = rgba('#1A2030', 0.35); ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.95, r * Math.abs(Math.cos(i * 0.35)), 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + Math.sin(i * 0.5) * r, y - r); ctx.lineTo(x + Math.sin(i * 0.5) * r, y + r); ctx.stroke();
  }
  // beams
  const cols = [P.pink, P.cyan, P.yellow, P.orange, P.purple, P.teal];
  for (let i = 0; i < beams; i++) {
    const a = t * 0.7 + i * (TAU / beams);
    ctx.strokeStyle = rgba(cols[i % cols.length], 0.22); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 520, y + Math.sin(a) * 380); ctx.stroke();
  }
  ctx.restore();
}

/** Checkered disco floor in perspective (0594 t146). */
export function discoFloor(ctx, y0, y1, { cols = 10, t = 0, k = 1 } = {}) {
  if (k <= 0) return;
  const palette = [P.yellow, P.pink, P.teal, P.purple, P.orange, P.cyan];
  ctx.save(); ctx.globalAlpha *= clamp(k);
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const u0 = r / rows, u1 = (r + 1) / rows;
    const yy0 = lerp(y0, y1, u0), yy1 = lerp(y0, y1, u1);
    const w0 = lerp(0.55, 1, u0), w1 = lerp(0.55, 1, u1);
    for (let c = 0; c < cols; c++) {
      const v0 = c / cols, v1 = (c + 1) / cols;
      const x00 = 960 + (v0 - 0.5) * 1920 * w0, x01 = 960 + (v1 - 0.5) * 1920 * w0;
      const x10 = 960 + (v0 - 0.5) * 1920 * w1, x11 = 960 + (v1 - 0.5) * 1920 * w1;
      ctx.beginPath(); ctx.moveTo(x00, yy0); ctx.lineTo(x01, yy0); ctx.lineTo(x11, yy1); ctx.lineTo(x10, yy1); ctx.closePath();
      const lit = ((c + r + Math.floor(t * 4)) % 5 === 0);
      ctx.fillStyle = lit ? palette[(c + r) % palette.length] : rgba(palette[(c + r) % palette.length], 0.35);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Spotlight cone (0594 t91). */
export function spotlight(ctx, x, floorY, { topW = 80, botW = 420, a = 0.22, color = '#FFE8C0', dust = 30, t = 0 } = {}) {
  ctx.save();
  const g = ctx.createLinearGradient(x, 0, x, floorY);
  g.addColorStop(0, rgba(color, 0)); g.addColorStop(1, rgba(color, a));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - topW / 2, 0); ctx.lineTo(x + topW / 2, 0); ctx.lineTo(x + botW / 2, floorY); ctx.lineTo(x - botW / 2, floorY); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.scale(1, 0.18); glowPool(ctx, x, floorY / 0.18, botW * 0.55, color, a * 1.4); ctx.restore();
  const R = rng(11 + Math.floor(t * 8));
  ctx.fillStyle = rgba('#fff', 0.45);
  for (let i = 0; i < dust; i++) ctx.fillRect(x - botW * 0.4 + R() * botW * 0.8, R() * floorY, 2, 2);
  ctx.restore();
}

/** Turntable + vinyl (0594 t237 / t328). */
export function turntable(ctx, x, y, s = 140, { spin = 0, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); contactShadow(ctx, x, y + s * 0.2, s * 0.55, 0.4);
  roundRect(ctx, x - s * 0.55, y - s * 0.22, s * 1.1, s * 0.5, 8); ctx.fillStyle = '#3A2A22'; ctx.fill();
  // platter
  ctx.beginPath(); ctx.arc(x - s * 0.12, y, s * 0.28, 0, TAU); ctx.fillStyle = '#1A1410'; ctx.fill();
  ctx.save(); ctx.translate(x - s * 0.12, y); ctx.rotate(spin);
  ctx.strokeStyle = rgba(P.gold, 0.35); ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, 0, s * 0.08 + i * s * 0.04, 0, TAU); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 0, s * 0.05, 0, TAU); ctx.fillStyle = P.accent; ctx.fill();
  ctx.restore();
  // tonearm
  ctx.strokeStyle = P.seqBeige; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + s * 0.32, y - s * 0.1); ctx.quadraticCurveTo(x + s * 0.38, y + s * 0.05, x + s * 0.05, y + s * 0.05); ctx.stroke();
  ctx.restore();
}

/** Dome floor lamp (0594 t237). */
export function domeLamp(ctx, x, y, h = 220, { on = 1, color = P.orange } = {}) {
  ctx.save();
  ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h + 30); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y - h + 20, 48, 28, 0, 0, TAU); ctx.fillStyle = on ? color : mix(color, '#444', 0.6); ctx.fill();
  if (on) glowPool(ctx, x, y - h + 40, 120, color, 0.35);
  // base
  ctx.beginPath(); ctx.ellipse(x, y, 28, 8, 0, 0, TAU); ctx.fillStyle = '#2A2018'; ctx.fill();
  ctx.restore();
}

/** Electric guitar silhouette (0594 t109). */
export function guitar(ctx, x, y, s = 160, { angle = -0.5, color = P.orange, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(x, y); ctx.rotate(angle);
  ctx.beginPath(); ctx.ellipse(0, 20, s * 0.22, s * 0.28, 0, 0, TAU); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = mix(color, '#000', 0.25); ctx.beginPath(); ctx.ellipse(0, 20, s * 0.1, s * 0.12, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5A4030'; roundRect(ctx, -6, -s * 0.55, 12, s * 0.55, 3); ctx.fill();
  ctx.fillStyle = P.cream; roundRect(ctx, -10, -s * 0.62, 20, 18, 3); ctx.fill();
  ctx.restore();
}

/** Kick drum front (0594 t109). */
export function kickDrum(ctx, x, y, r = 70, { k = 1, hit = 0 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); contactShadow(ctx, x, y + r * 0.7, r * 0.9, 0.35);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = '#E8E0D4'; ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = P.accent; ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = rgba(P.ink, 0.3); ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, TAU); ctx.stroke();
  if (hit > 0) glowPool(ctx, x, y, r * 1.4, P.accentHot, 0.4 * hit);
  ctx.restore();
}

/** Wire chandelier (0594 t529). */
export function chandelier(ctx, x, y, s = 100, { k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.strokeStyle = P.gold; ctx.fillStyle = P.gold; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x, y - s * 0.3); ctx.stroke();
  [1, 0.7, 0.45].forEach((sc, i) => {
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.25 + i * 18, s * 0.45 * sc, s * 0.08 * sc, 0, 0, TAU); ctx.stroke();
  });
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU;
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * s * 0.38, y - s * 0.2 + Math.sin(a) * 6, 3, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/** Retro sofa (0594 t237). */
export function sofa(ctx, x, y, w = 280, { color = '#3A2418', cushion = P.gold, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k); contactShadow(ctx, x, y, w * 0.5, 0.4);
  roundRect(ctx, x - w / 2, y - 70, w, 70, 12); ctx.fillStyle = color; ctx.fill();
  roundRect(ctx, x - w / 2, y - 110, w * 0.22, 50, 10); ctx.fill();
  roundRect(ctx, x + w / 2 - w * 0.22, y - 110, w * 0.22, 50, 10); ctx.fill();
  roundRect(ctx, x - w * 0.28, y - 95, w * 0.24, 40, 8); ctx.fillStyle = cushion; ctx.fill();
  roundRect(ctx, x + w * 0.04, y - 95, w * 0.24, 40, 8); ctx.fill();
  ctx.restore();
}

/** Retro rainbow bands (0594 t237). */
export function rainbow(ctx, x, y, r = 280, { k = 1 } = {}) {
  if (k <= 0) return;
  const cols = ['#4A3020', P.orange, P.gold];
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.lineCap = 'butt';
  cols.forEach((c, i) => {
    ctx.strokeStyle = c; ctx.lineWidth = 28;
    ctx.beginPath(); ctx.arc(x, y, r - i * 32, Math.PI, TAU); ctx.stroke();
  });
  ctx.restore();
}

/** Arched window pair (0594 t91). */
export function archWindows(ctx, y0 = 80, h = 360, { color = '#3A5A8A', k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  const draw = (x) => {
    // outer frame
    ctx.beginPath(); ctx.moveTo(x - 48, y0 + h); ctx.lineTo(x - 48, y0 + 55);
    ctx.arc(x, y0 + 55, 48, Math.PI, 0); ctx.lineTo(x + 48, y0 + h); ctx.closePath();
    ctx.fillStyle = rgba('#0A0810', 0.55); ctx.fill();
    ctx.strokeStyle = rgba(P.goldSoft, 0.45); ctx.lineWidth = 3; ctx.stroke();
    // glass
    ctx.beginPath(); ctx.moveTo(x - 38, y0 + h - 8); ctx.lineTo(x - 38, y0 + 55);
    ctx.arc(x, y0 + 55, 38, Math.PI, 0); ctx.lineTo(x + 38, y0 + h - 8); ctx.closePath();
    const g = ctx.createLinearGradient(x, y0, x, y0 + h);
    g.addColorStop(0, mix(color, '#A0C8F0', 0.35)); g.addColorStop(1, mix(color, '#102038', 0.3));
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba(P.goldSoft, 0.3); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y0 + 17); ctx.lineTo(x, y0 + h - 8);
    ctx.moveTo(x - 38, y0 + 140); ctx.lineTo(x + 38, y0 + 140); ctx.stroke();
  };
  draw(200); draw(1720);
  ctx.restore();
}

/** Twinkle star. */
export function star(ctx, x, y, r = 10, { a = 1, color = P.gold } = {}) {
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a0 = i * Math.PI / 2, a1 = a0 + Math.PI / 4;
    ctx.lineTo(x + Math.cos(a0) * r, y + Math.sin(a0) * r);
    ctx.lineTo(x + Math.cos(a1) * r * 0.35, y + Math.sin(a1) * r * 0.35);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

/** Syncopation bracket highlighting the "gap" between beats — OUR derived prop. */
export function gapBracket(ctx, x0, x1, y, { label = '缝', k = 1, color = P.accent } = {}) {
  if (k <= 0) return null;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'square';
  const h = 28;
  ctx.beginPath(); ctx.moveTo(x0, y - h); ctx.lineTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1, y - h); ctx.stroke();
  // arrow up into the gap
  const mx = (x0 + x1) / 2;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(mx, y - h - 18); ctx.lineTo(mx - 8, y - h - 4); ctx.lineTo(mx + 8, y - h - 4); ctx.closePath(); ctx.fill();
  ctx.font = `800 28px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(label, mx, y - h - 22);
  ctx.restore();
  return { text: label, x0, y0: y - h - 50, x1, y1: y };
}

/** Lava lamp (0594 t237). */
export function lavaLamp(ctx, x, y, h = 160, { t = 0, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  ctx.fillStyle = '#2A2018'; roundRect(ctx, x - 18, y - 16, 36, 20, 4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 22, y - 16); ctx.lineTo(x - 14, y - h); ctx.lineTo(x + 14, y - h); ctx.lineTo(x + 22, y - 16); ctx.closePath();
  const g = ctx.createLinearGradient(x, y - h, x, y); g.addColorStop(0, '#5A2030'); g.addColorStop(1, '#C04030');
  ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = rgba(P.orange, 0.85);
  for (let i = 0; i < 3; i++) {
    const by = y - 30 - ((t * 40 + i * 45) % (h - 50));
    ctx.beginPath(); ctx.ellipse(x + Math.sin(t + i) * 6, by, 10, 14, 0, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = '#3A2A20'; roundRect(ctx, x - 16, y - h - 14, 32, 16, 4); ctx.fill();
  if (k > 0.5) glowPool(ctx, x, y - h * 0.5, 80, P.orange, 0.25);
  ctx.restore();
}
