/** props.js — Lailong institution props (≥14).
 * Grammar: flat silhouette → ONE light event. Presence=fire-gold; Absence=mark-red hollow.
 */
import { P, glowStroke as GS, glowFill as GF, rng } from './look.js';

const OUT = 'rgba(40,30,22,0.75)';

/** 1. beaconTower — trapezoid + cabin + ladder + arch (5918).
 * o: {x,y,s,k,lit}  y = base centre
 */
export function beaconTower(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1;
  if (k <= 0) return;
  const X = (u) => o.x + u * s, Y = (v) => o.y + v * s;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.4);
  ctx.fillStyle = o.fill || '#2E261E'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.4 * s;
  // body trapezoid
  ctx.beginPath();
  ctx.moveTo(X(-55), Y(0)); ctx.lineTo(X(-40), Y(-160)); ctx.lineTo(X(40), Y(-160)); ctx.lineTo(X(55), Y(0));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // masonry lines
  ctx.strokeStyle = 'rgba(20,14,10,0.35)'; ctx.lineWidth = 1 * s;
  for (let i = 1; i <= 5; i++) {
    const yy = Y(-i * 26);
    const t = i / 6;
    ctx.beginPath(); ctx.moveTo(X(-55 + t * 15), yy); ctx.lineTo(X(55 - t * 15), yy); ctx.stroke();
  }
  // arch door
  ctx.fillStyle = '#1A1410';
  ctx.beginPath(); ctx.moveTo(X(-14), Y(0)); ctx.lineTo(X(-14), Y(-28));
  ctx.quadraticCurveTo(X(0), Y(-42), X(14), Y(-28)); ctx.lineTo(X(14), Y(0)); ctx.fill();
  // cabin
  ctx.fillStyle = o.fill || '#2E261E'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.4 * s;
  ctx.beginPath();
  ctx.moveTo(X(-28), Y(-160)); ctx.lineTo(X(-28), Y(-200)); ctx.lineTo(X(0), Y(-220));
  ctx.lineTo(X(28), Y(-200)); ctx.lineTo(X(28), Y(-160)); ctx.closePath(); ctx.fill(); ctx.stroke();
  // ladder left
  ctx.strokeStyle = OUT; ctx.lineWidth = 1.3 * s;
  ctx.beginPath(); ctx.moveTo(X(-58), Y(-10)); ctx.lineTo(X(-48), Y(-155)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X(-70), Y(-10)); ctx.lineTo(X(-60), Y(-155)); ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const t = i / 7, yy = Y(-15 - t * 140);
    ctx.beginPath(); ctx.moveTo(X(-70 + t * 10), yy); ctx.lineTo(X(-58 + t * 10), yy); ctx.stroke();
  }
  if (o.lit) {
    torchFire(ctx, { x: o.x, y: o.y - 210 * s, s: 0.7 * s, k: 1, t: o.t || 0 });
  }
  if (o.label) {
    ctx.fillStyle = P.cream; ctx.font = `${500} ${14 * s}px "Noto Serif SC", serif`;
    ctx.textAlign = 'center'; ctx.fillText(o.label, o.x, o.y + 22 * s);
  }
  ctx.restore();
}

/** 2. torchFire — layered bloom flame + embers. */
export function torchFire(ctx, o = {}) {
  const s = (o.s ?? 1) * (o.flicker || 1), k = o.k ?? 1;
  if (k <= 0) return;
  const x = o.x, y = o.y, t = o.t || 0;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.5);
  // outer bloom
  const g0 = ctx.createRadialGradient(x, y, 0, x, y, 70 * s);
  g0.addColorStop(0, 'rgba(255,180,80,0.45)');
  g0.addColorStop(0.5, 'rgba(224,100,40,0.18)');
  g0.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(x, y, 70 * s, 0, Math.PI * 2); ctx.fill();
  // flame shape
  ctx.beginPath();
  ctx.moveTo(x, y + 18 * s);
  ctx.bezierCurveTo(x - 22 * s, y + 5 * s, x - 18 * s, y - 30 * s, x - 4 * s, y - 55 * s);
  ctx.bezierCurveTo(x - 2 * s, y - 35 * s, x + 6 * s, y - 25 * s, x + 2 * s, y - 60 * s);
  ctx.bezierCurveTo(x + 20 * s, y - 25 * s, x + 24 * s, y + 5 * s, x, y + 18 * s);
  ctx.closePath();
  const g1 = ctx.createLinearGradient(x, y + 18 * s, x, y - 60 * s);
  g1.addColorStop(0, P.fireHot); g1.addColorStop(0.5, P.fire); g1.addColorStop(1, P.fireCore);
  ctx.fillStyle = g1; ctx.fill();
  // core
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#FFF5D0';
  ctx.beginPath(); ctx.ellipse(x, y - 5 * s, 6 * s, 14 * s, 0, 0, Math.PI * 2); ctx.fill();
  // embers
  const r = rng(((t * 10) | 0) * 17 + ((x * 3) | 0));
  for (let i = 0; i < 6; i++) {
    const px = x + (r() - 0.5) * 40 * s;
    const py = y - 30 * s - r() * 50 * s - (t * 20 * s) % 40;
    ctx.globalAlpha = 0.4 + r() * 0.5;
    ctx.fillStyle = P.fireCore;
    ctx.fillRect(px, py, 2 * s, 2 * s);
  }
  ctx.restore();
}

/** 3. smokePlume — day tube smoke. */
export function smokePlume(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1, rise = o.rise || 0;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = 0.35 * k;
  for (let i = 0; i < 4; i++) {
    const yy = o.y - i * 28 * s + rise;
    const rr = (10 + i * 7) * s;
    const g = ctx.createRadialGradient(o.x, yy, 0, o.x, yy, rr);
    g.addColorStop(0, 'rgba(180,170,160,0.55)');
    g.addColorStop(1, 'rgba(180,170,160,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x + Math.sin(i + rise * 0.05) * 6 * s, yy, rr, 0, Math.PI * 2); ctx.fill();
  }
  // tube base
  ctx.globalAlpha = k; ctx.fillStyle = '#2A221A'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(o.x - 12 * s, o.y + 20 * s); ctx.lineTo(o.x - 8 * s, o.y - 10 * s);
  ctx.lineTo(o.x + 8 * s, o.y - 10 * s); ctx.lineTo(o.x + 12 * s, o.y + 20 * s);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/** 4. topoMap — embossed brown relief bed. */
export function topoMap(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 560, w = o.w ?? 1400, h = o.h ?? 700, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.2);
  // parchment bed
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.7);
  g.addColorStop(0, '#2E2218'); g.addColorStop(1, '#140E0A');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
  // ridge strokes
  const r = rng(o.seed || 42);
  ctx.strokeStyle = 'rgba(90,70,50,0.45)'; ctx.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
    const x0 = x - w * 0.4 + r() * w * 0.8;
    const y0 = y - h * 0.35 + r() * h * 0.7;
    ctx.beginPath(); ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(x0 + 40, y0 - 20, x0 + 80, y0 + 10, x0 + 120, y0 - 5);
    ctx.stroke();
  }
  ctx.restore();
}

/** 5. peacePath — dashed gold route; nodes optional. */
export function peacePath(ctx, o = {}) {
  const pts = o.pts || [], k = o.k ?? 1;
  if (pts.length < 2 || k <= 0) return;
  ctx.save();
  // measure total length roughly
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  const drawLen = total * k;
  ctx.strokeStyle = P.fire; ctx.lineWidth = 2.2; ctx.setLineDash([6, 8]);
  ctx.lineCap = 'round'; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (acc + d <= drawLen) { ctx.lineTo(pts[i].x, pts[i].y); acc += d; }
    else {
      const t = (drawLen - acc) / d;
      ctx.lineTo(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t);
      break;
    }
  }
  ctx.stroke(); ctx.setLineDash([]);
  // nodes
  (o.nodes || []).forEach((n, i) => {
    const along = i / Math.max(1, (o.nodes.length - 1));
    if (along > k + 0.01) return;
    ctx.fillStyle = n.empty ? 'transparent' : P.fire;
    ctx.strokeStyle = n.empty ? P.markRed : P.fireCore;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r || 8, 0, Math.PI * 2);
    if (!n.empty) ctx.fill(); ctx.stroke();
    if (n.label) {
      ctx.fillStyle = P.cream; ctx.font = '500 16px "Noto Serif SC", serif';
      ctx.textAlign = 'center'; ctx.fillText(n.label, n.x, n.y - 16);
    }
  });
  ctx.restore();
}

/** 6. imperialSeal — jade block + knob + bloom (2217). */
export function imperialSeal(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1;
  if (k <= 0) return;
  const x = o.x, y = o.y;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  // bloom
  GF(ctx, () => { ctx.beginPath(); ctx.arc(x, y, 90 * s, 0, Math.PI * 2); }, { color: P.jade, alpha: 0.22 });
  // body
  ctx.fillStyle = '#7A9A8E'; ctx.strokeStyle = P.jade; ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(x - 40 * s, y + 30 * s); ctx.lineTo(x - 40 * s, y - 10 * s);
  ctx.lineTo(x - 30 * s, y - 30 * s); ctx.lineTo(x + 30 * s, y - 30 * s);
  ctx.lineTo(x + 40 * s, y - 10 * s); ctx.lineTo(x + 40 * s, y + 30 * s);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // knob dragon-ish
  ctx.fillStyle = '#9BB8AA';
  ctx.beginPath(); ctx.ellipse(x, y - 42 * s, 16 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 10 * s, y - 55 * s, 8 * s, 6 * s, 0.4, 0, Math.PI * 2); ctx.fill();
  if (o.glyph) {
    ctx.fillStyle = '#1A2822'; ctx.font = `700 ${18 * s}px "Noto Serif SC", serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(o.glyph, x, y + 5 * s);
  }
  ctx.restore();
}

/** 7. nightDrum — barrel + skin + beat pulse. */
export function nightDrum(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1, pulse = o.pulse || 1;
  if (k <= 0) return;
  const x = o.x, y = o.y;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  ctx.fillStyle = '#4A3424'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5 * s;
  // barrel
  ctx.beginPath(); ctx.ellipse(x, y + 30 * s, 55 * s, 22 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillRect(x - 55 * s, y - 30 * s, 110 * s, 60 * s);
  ctx.beginPath(); ctx.ellipse(x, y - 30 * s, 55 * s, 22 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // skin
  ctx.fillStyle = P.paper;
  ctx.beginPath(); ctx.ellipse(x, y - 30 * s, 48 * s * pulse, 18 * s * pulse, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = P.fire; ctx.lineWidth = 1.2 * s; ctx.stroke();
  // studs
  ctx.fillStyle = P.fire;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * 48 * s, y - 30 * s + Math.sin(a) * 18 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/** 8. horseRider — re-export wrapper using people (kept as prop slot for sheet). */
export { horseRider as horseRiderProp } from './people.js';
export function horseProp(ctx, o) {
  // simple horse without rider for sheet cell
  const s = o.s ?? 1, f = o.facing ?? 1;
  const X = (u) => o.x + u * s * f, Y = (v) => o.y + v * s;
  ctx.save();
  ctx.fillStyle = o.fill || P.paper; ctx.strokeStyle = OUT; ctx.lineWidth = 1.4 * s;
  ctx.beginPath();
  ctx.moveTo(X(-70), Y(-10));
  ctx.bezierCurveTo(X(-80), Y(-50), X(-30), Y(-70), X(30), Y(-60));
  ctx.bezierCurveTo(X(70), Y(-50), X(85), Y(-25), X(75), Y(0));
  ctx.lineTo(X(50), Y(0)); ctx.lineTo(X(40), Y(25)); ctx.lineTo(X(28), Y(25)); ctx.lineTo(X(35), Y(0));
  ctx.lineTo(X(-10), Y(0)); ctx.lineTo(X(-20), Y(25)); ctx.lineTo(X(-32), Y(25)); ctx.lineTo(X(-22), Y(0));
  ctx.lineTo(X(-55), Y(0)); ctx.lineTo(X(-65), Y(22)); ctx.lineTo(X(-76), Y(22)); ctx.lineTo(X(-68), Y(0));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // head
  ctx.beginPath();
  ctx.moveTo(X(55), Y(-55)); ctx.bezierCurveTo(X(70), Y(-90), X(80), Y(-105), X(65), Y(-115));
  ctx.lineTo(X(88), Y(-110)); ctx.lineTo(X(82), Y(-95));
  ctx.bezierCurveTo(X(95), Y(-80), X(72), Y(-55), X(55), Y(-45));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/** 9. scrollBook — open cream pages + DualMark line. */
export function scrollBook(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1;
  if (k <= 0) return;
  const x = o.x, y = o.y, w = (o.w || 220) * s, h = (o.h || 160) * s;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  ctx.fillStyle = P.paper; ctx.strokeStyle = OUT; ctx.lineWidth = 1.4;
  // left page
  ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x - 4, y - h / 2 + 6);
  ctx.lineTo(x - 4, y + h / 2 + 6); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  // right
  ctx.beginPath(); ctx.moveTo(x + 4, y - h / 2 + 6); ctx.lineTo(x + w / 2, y - h / 2);
  ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x + 4, y + h / 2 + 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  // lines
  ctx.strokeStyle = 'rgba(60,45,30,0.35)'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const yy = y - h * 0.3 + i * h * 0.14;
    ctx.beginPath(); ctx.moveTo(x + 20, yy); ctx.lineTo(x + w / 2 - 20, yy); ctx.stroke();
  }
  if (o.mark) {
    const yy = y - h * 0.3 + 2 * h * 0.14;
    ctx.strokeStyle = o.mark === 'red' ? P.markRed : P.markBlue;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + 20, yy + 6); ctx.lineTo(x + w / 2 - 20, yy + 6); ctx.stroke();
  }
  if (o.title) {
    ctx.fillStyle = P.ink; ctx.font = `700 ${16 * s}px "Noto Serif SC", serif`;
    ctx.textAlign = 'center'; ctx.fillText(o.title, x + w * 0.22, y - h * 0.35);
  }
  ctx.restore();
}

/** 10. courtLamp — standing lamp + warm glow (zhaoyun CourtLampStage). */
export function courtLamp(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1, breathe = o.breathe || 1;
  if (k <= 0) return;
  const x = o.x, y = o.y;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  // glow
  const g = ctx.createRadialGradient(x, y - 80 * s, 0, x, y - 80 * s, 120 * s * breathe);
  g.addColorStop(0, 'rgba(255,200,100,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 80 * s, 120 * s * breathe, 0, Math.PI * 2); ctx.fill();
  // pole
  ctx.fillStyle = '#5A4030'; ctx.fillRect(x - 4 * s, y - 100 * s, 8 * s, 100 * s);
  // lantern box
  ctx.fillStyle = P.lamp; ctx.strokeStyle = OUT; ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(x - 22 * s, y - 100 * s); ctx.lineTo(x - 18 * s, y - 140 * s);
  ctx.lineTo(x + 18 * s, y - 140 * s); ctx.lineTo(x + 22 * s, y - 100 * s); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5A4030'; ctx.fillRect(x - 26 * s, y - 4 * s, 52 * s, 8 * s); // base
  ctx.restore();
}

/** 11. redLantern — hanging. */
export function redLantern(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1;
  if (k <= 0) return;
  const x = o.x, y = o.y;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  ctx.strokeStyle = P.mute; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y - 40 * s); ctx.lineTo(x, y - 10 * s); ctx.stroke();
  GF(ctx, () => { ctx.beginPath(); ctx.ellipse(x, y + 20 * s, 40 * s, 50 * s, 0, 0, Math.PI * 2); }, { color: P.markRed, alpha: 0.25 });
  ctx.fillStyle = '#A03028'; ctx.strokeStyle = '#E07060'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.ellipse(x, y + 20 * s, 28 * s, 36 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = P.fire; ctx.fillRect(x - 10 * s, y - 10 * s, 20 * s, 6 * s);
  ctx.fillRect(x - 8 * s, y + 52 * s, 16 * s, 8 * s);
  ctx.restore();
}

/** 12. steelyard — balance scale (zhaoyun power metaphor). */
export function steelyard(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1, tilt = o.tilt || 0;
  if (k <= 0) return;
  const x = o.x, y = o.y;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  ctx.strokeStyle = P.cream; ctx.lineWidth = 2 * s; ctx.lineCap = 'round';
  // stand
  ctx.beginPath(); ctx.moveTo(x, y + 60 * s); ctx.lineTo(x, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 30 * s, y + 60 * s); ctx.lineTo(x + 30 * s, y + 60 * s); ctx.stroke();
  // beam
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  ctx.beginPath(); ctx.moveTo(-90 * s, 0); ctx.lineTo(90 * s, 0); ctx.stroke();
  // pans
  [[-80, o.left], [80, o.right]].forEach(([px, content]) => {
    ctx.beginPath(); ctx.moveTo(px * s, 0); ctx.lineTo(px * s, 30 * s); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(px * s, 40 * s, 28 * s, 8 * s, 0, 0, Math.PI * 2);
    ctx.strokeStyle = P.fire; ctx.stroke(); ctx.strokeStyle = P.cream;
    if (content === 'fire') torchFire(ctx, { x: px * s, y: 25 * s, s: 0.35 * s, k: 1, t: o.t || 0 });
    if (content === 'people') {
      ctx.fillStyle = P.paper;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.arc(px * s + i * 10 * s, 28 * s, 5 * s, 0, Math.PI * 2); ctx.fill();
      }
    }
  });
  ctx.restore();
  ctx.restore();
}

/** 13. codeStamp — red square seal stamp / law chop. */
export function codeStamp(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1;
  if (k <= 0) return;
  const x = o.x, y = o.y, w = (o.w || 90) * s;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  ctx.strokeStyle = P.markRed; ctx.lineWidth = 3 * s;
  ctx.strokeRect(x - w / 2, y - w / 2, w, w);
  ctx.fillStyle = P.markRed; ctx.font = `700 ${22 * s}px "Noto Serif SC", serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lines = o.lines || ['唐', '律'];
  lines.forEach((t, i) => ctx.fillText(t, x, y + (i - (lines.length - 1) / 2) * 26 * s));
  ctx.restore();
}

/** 14. absentSignal — OUR improvement: hollow red ring where fire should be. */
export function absentSignal(ctx, o = {}) {
  const s = o.s ?? 1, k = o.k ?? 1, breathe = o.breathe || 1;
  if (k <= 0) return;
  const x = o.x, y = o.y, R = 36 * s * breathe;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.4);
  // dashed hollow ring
  ctx.strokeStyle = P.markRed; ctx.lineWidth = 3 * s; ctx.setLineDash([8 * s, 6 * s]);
  ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  // soft inward arrows
  ctx.fillStyle = P.markRed;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4;
    const ax = x + Math.cos(a) * (R + 14 * s);
    const ay = y + Math.sin(a) * (R + 14 * s);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - Math.cos(a) * 12 * s + Math.sin(a) * 5 * s, ay - Math.sin(a) * 12 * s - Math.cos(a) * 5 * s);
    ctx.lineTo(ax - Math.cos(a) * 12 * s - Math.sin(a) * 5 * s, ay - Math.sin(a) * 12 * s + Math.cos(a) * 5 * s);
    ctx.closePath(); ctx.fill();
  }
  // centre ghost flame outline (not lit)
  ctx.strokeStyle = 'rgba(196,92,74,0.45)'; ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 12 * s);
  ctx.bezierCurveTo(x - 10 * s, y, x - 8 * s, y - 18 * s, x, y - 28 * s);
  ctx.bezierCurveTo(x + 8 * s, y - 18 * s, x + 10 * s, y, x, y + 12 * s);
  ctx.stroke();
  if (o.label !== false) {
    ctx.fillStyle = P.markRed; ctx.font = `700 ${18 * s}px "Noto Serif SC", serif`;
    ctx.textAlign = 'center'; ctx.fillText(o.label || '没来', x, y + R + 28 * s);
  }
  ctx.restore();
}

/** Red pillar for CourtLamp stage. */
export function redPillar(ctx, o = {}) {
  const s = o.s ?? 1;
  ctx.save();
  ctx.fillStyle = P.pillar;
  ctx.fillRect(o.x - 18 * s, o.y - 400 * s, 36 * s, 400 * s);
  ctx.fillStyle = P.fire;
  ctx.fillRect(o.x - 22 * s, o.y - 410 * s, 44 * s, 12 * s);
  ctx.restore();
}
