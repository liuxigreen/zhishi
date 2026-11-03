/** people.js — Lailong paper-puppet cast.
 * Distilled from zhaoyun, xuanzang, 2217 seal silhouettes.
 * WHY attractive: cream flat fill + black rank-hat, NO face; emotion = posture + prop contact.
 * Head ≈ 1/6.5 height; robe A-line; mianguan / soldier / monk / commoner hats.
 */
import { P } from './look.js';

const OUT = 'rgba(40,30,22,0.7)';

/** Generic paper puppet.
 * x,y = feet centre. s=1 → ~320 px tall.
 * hat: 'mian' | 'soldier' | 'monk' | 'common' | 'none'
 * fill: cream | white | mute | robe
 * pose: { tilt, drop, lean, armL, armR }  arm*: -1..1 raise
 * hold: optional callback(ctx, handX, handY) for prop contact
 */
export function puppet(ctx, o = {}) {
  const s = o.s ?? 1, f = o.facing ?? 1;
  const tilt = o.pose?.tilt ?? 0, drop = o.pose?.drop ?? 0, lean = o.pose?.lean ?? 0;
  const armL = o.pose?.armL ?? 0, armR = o.pose?.armR ?? 0;
  const X = (u) => o.x + (u + lean * 18) * s * f;
  const Y = (v) => o.y + v * s;
  const fill = o.fill === 'robe' ? P.robe : o.fill === 'mute' ? P.mute : o.fill === 'white' ? P.white : P.paper;
  ctx.save();
  // legs
  ctx.fillStyle = fill; ctx.strokeStyle = OUT; ctx.lineWidth = 1.3 * s;
  ctx.beginPath();
  ctx.moveTo(X(-22), Y(0)); ctx.lineTo(X(-28), Y(-70 + drop * 8));
  ctx.lineTo(X(-8), Y(-110 + drop * 10)); ctx.lineTo(X(8), Y(-110 + drop * 10));
  ctx.lineTo(X(28), Y(-70 + drop * 8)); ctx.lineTo(X(22), Y(0));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // robe body A-line
  ctx.beginPath();
  ctx.moveTo(X(-38), Y(-100 + drop * 10));
  ctx.quadraticCurveTo(X(-48), Y(-160), X(-30), Y(-210 + drop * 6));
  ctx.lineTo(X(-14), Y(-230));
  // neck
  ctx.lineTo(X(-8), Y(-248));
  ctx.quadraticCurveTo(X(0), Y(-252), X(8), Y(-248));
  ctx.lineTo(X(14), Y(-230));
  ctx.lineTo(X(30), Y(-210 + drop * 6));
  ctx.quadraticCurveTo(X(48), Y(-160), X(38), Y(-100 + drop * 10));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // head (egg, no face)
  const hx = X(tilt * 10), hy = Y(-270);
  ctx.beginPath();
  ctx.ellipse(hx, hy, 18 * s, 22 * s, tilt * f * 0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // hat / hair block
  drawHat(ctx, hx, hy - 10 * s, s, f, o.hat || 'common', tilt);
  // arms (simple, contact-ready)
  const shoulderY = Y(-200 + drop * 6);
  const handL = arm(ctx, X(-28), shoulderY, -1 * f, armL, s, fill);
  const handR = arm(ctx, X(28), shoulderY, 1 * f, armR, s, fill);
  if (typeof o.hold === 'function') o.hold(ctx, handR.x, handR.y, handL.x, handL.y);
  ctx.restore();
  return { head: { x: hx, y: hy }, handR, handL };
}

function arm(ctx, sx, sy, side, raise, s, fill) {
  const len = 70 * s;
  const ang = (-0.15 + raise * 1.1) * side; // raise 1 = up
  const ex = sx + Math.cos(Math.PI / 2 + ang) * len * side;
  // side already encodes L/R; simplify:
  const hx = sx + side * (20 + 8 * Math.max(0, -raise)) * s;
  const hy = sy + (55 - raise * 50) * s;
  ctx.fillStyle = fill; ctx.strokeStyle = OUT; ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(sx + side * 18 * s, sy + 28 * s, hx, hy);
  ctx.lineTo(hx + side * 6 * s, hy + 4 * s);
  ctx.quadraticCurveTo(sx + side * 22 * s, sy + 30 * s, sx + side * 6 * s, sy + 4 * s);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  return { x: hx, y: hy };
}

function drawHat(ctx, hx, hy, s, f, kind, tilt) {
  ctx.save();
  ctx.translate(hx, hy); ctx.rotate(tilt * 0.3 * f);
  ctx.fillStyle = P.hat; ctx.strokeStyle = OUT; ctx.lineWidth = 1.1 * s;
  if (kind === 'mian') {
    // flat board + short center stem sitting ON the head (no ear-like uprights)
    ctx.fillStyle = P.hat;
    ctx.fillRect(-28 * s, -22 * s, 56 * s, 9 * s);           // board
    ctx.fillRect(-10 * s, -13 * s, 20 * s, 16 * s);          // stem down onto head
    // hanging beads DOWN from board front edge
    for (let i = -3; i <= 3; i++) {
      const bx = i * 7.5 * s;
      ctx.strokeStyle = 'rgba(220,190,120,0.85)'; ctx.lineWidth = 1.1 * s;
      ctx.beginPath(); ctx.moveTo(bx, -13 * s); ctx.lineTo(bx, (8 + Math.abs(i) * 2) * s); ctx.stroke();
      ctx.fillStyle = P.fireCore;
      ctx.beginPath(); ctx.arc(bx, (10 + Math.abs(i) * 2) * s, 2.2 * s, 0, Math.PI * 2); ctx.fill();
    }
  } else if (kind === 'soldier') {
    ctx.beginPath();
    ctx.moveTo(-20 * s, 4 * s); ctx.lineTo(-16 * s, -22 * s); ctx.lineTo(0, -30 * s);
    ctx.lineTo(16 * s, -22 * s); ctx.lineTo(20 * s, 4 * s); ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (kind === 'monk') {
    ctx.beginPath();
    ctx.ellipse(0, -6 * s, 16 * s, 12 * s, 0, Math.PI, 0);
    ctx.fill(); // shaved bump / robe hood suggestion
    ctx.fillStyle = P.robe;
    ctx.beginPath(); ctx.ellipse(0, 2 * s, 18 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
  } else if (kind === 'common') {
    ctx.beginPath();
    ctx.ellipse(0, -2 * s, 18 * s, 10 * s, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Tiny extra for crowds. */
export function puppetTiny(ctx, o = {}) {
  return puppet(ctx, { ...o, s: (o.s ?? 0.35) });
}

/** Court row — N mute puppets. */
export function courtRow(ctx, { x = 960, y = 780, n = 7, gap = 70, s = 0.45, hat = 'mian', lit = -1 } = {}) {
  for (let i = 0; i < n; i++) {
    const px = x + (i - (n - 1) / 2) * gap;
    puppet(ctx, {
      x: px, y, s, hat, facing: 1,
      fill: i === lit ? 'cream' : 'mute',
      pose: { tilt: 0, drop: i === lit ? 0 : 0.15, lean: 0 },
    });
  }
}

/** Horse + rider silhouette (5364 / zhaoyun Changban grammar). */
export function horseRider(ctx, o = {}) {
  const s = o.s ?? 1, f = o.facing ?? 1;
  const X = (u) => o.x + u * s * f, Y = (v) => o.y + v * s;
  const fill = o.fill || P.paper;
  ctx.save();
  ctx.fillStyle = fill; ctx.strokeStyle = OUT; ctx.lineWidth = 1.4 * s;
  // horse body
  ctx.beginPath();
  ctx.moveTo(X(-90), Y(-20));
  ctx.bezierCurveTo(X(-100), Y(-60), X(-40), Y(-90), X(40), Y(-80));
  ctx.bezierCurveTo(X(90), Y(-70), X(110), Y(-40), X(100), Y(-10));
  ctx.lineTo(X(70), Y(0));
  // legs
  ctx.lineTo(X(55), Y(30)); ctx.lineTo(X(40), Y(30)); ctx.lineTo(X(50), Y(0));
  ctx.lineTo(X(10), Y(0)); ctx.lineTo(X(0), Y(30)); ctx.lineTo(X(-15), Y(30)); ctx.lineTo(X(-5), Y(0));
  ctx.lineTo(X(-50), Y(0)); ctx.lineTo(X(-60), Y(28)); ctx.lineTo(X(-75), Y(28)); ctx.lineTo(X(-65), Y(0));
  ctx.lineTo(X(-90), Y(-5));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // neck + head
  ctx.beginPath();
  ctx.moveTo(X(70), Y(-70));
  ctx.bezierCurveTo(X(90), Y(-110), X(100), Y(-130), X(85), Y(-145));
  ctx.lineTo(X(110), Y(-140)); ctx.lineTo(X(105), Y(-125));
  ctx.bezierCurveTo(X(120), Y(-110), X(95), Y(-80), X(75), Y(-60));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // rider
  puppet(ctx, {
    x: o.x + 10 * s * f, y: o.y - 55 * s, s: 0.55 * s,
    hat: o.hat || 'soldier', facing: f, fill: o.riderFill || 'cream',
    pose: { tilt: 0.1, drop: 0, lean: 0.2, armR: 0.6 },
  });
  ctx.restore();
}
