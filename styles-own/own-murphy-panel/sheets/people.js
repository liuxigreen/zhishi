/** people.js — own-murphy-panel peg people: a soft capsule body (muted sage/terracotta/mustard/rose…), a cream ball
 * head sitting on it, two dark dot eyes set low and close, optional nub arms, hats (beanie, fedora, party cone, hair bun),
 * scarf. Drawn in screen space at the projected scale of their 3D base point, Lambert-ish gradient shading from the
 * upper-left key, contact shadow on the ground. Poses are parameters (tilt / bob / squash / arms / yaw / hop), not frames. */
import { P, pr, shade, rgba, clamp, lerp } from './look.js';
export const PALETTE = [P.sage, P.terra, P.mustard, P.rose, P.olive, P.plum, P.slate, P.clay];
export const HATS = ['none', 'beanie', 'none', 'fedora', 'bun', 'none', 'beanie', 'party'];
/** pose presets (all angles in radians; arms: 0 = hanging, +1.2 = held out, +2.6 = raised) */
export const POSES = {
  stand: {}, wave: { armR: 2.5, armWave: 1 }, point: { armR: 1.45 }, cheer: { armL: 2.7, armR: 2.7 }, think: { armR: 2.0, tilt: -0.05, look: 0.3 },
  shrug: { armL: 1.0, armR: 1.0, squash: 0.03 }, lean: { tilt: 0.16 }, hop: { hop: 0.8, armL: 0.9, armR: 0.9 }, carry: { armL: 1.25, armR: 1.25 }, slump: { tilt: 0.07, squash: 0.06, look: -0.4 },
  surprised: { armL: 2.2, armR: 2.2, squash: -0.04 }, side: { yaw: 1.35 }, back: { yaw: 3.14 }, sit: { sit: 1 }, fall: { tilt: 1.45 },
};
export const POSE_NAMES = Object.keys(POSES);
/** draw one peg person. o: {x,y,z (world base), h (world height, default 62), col, hat, hatCol, scarf, pose:{...}} */
export function peg(c, o) {
  const p0 = pr(o.x, o.y ?? 0, o.z), u = (o.h ?? 62) * p0[3]; const q = { ...(typeof o.pose === 'string' ? POSES[o.pose] : o.pose || {}) };
  const col = o.col || P.sage, yaw = q.yaw ?? o.yaw ?? 0, hop = q.hop || 0, sq = q.squash || 0, sit = q.sit || 0;
  // contact shadow
  c.save(); c.globalAlpha = (o.a ?? 1) * (0.55 - 0.3 * clamp(hop)); const sg = c.createRadialGradient(p0[0], p0[1], 0, p0[0], p0[1], u * 0.34); sg.addColorStop(0, 'rgba(10,5,2,0.75)'); sg.addColorStop(1, 'rgba(10,5,2,0)');
  c.fillStyle = sg; c.beginPath(); c.ellipse(p0[0], p0[1], u * 0.34, u * 0.11, 0, 0, Math.PI * 2); c.fill(); c.restore();
  c.save(); c.globalAlpha = o.a ?? 1; c.translate(p0[0], p0[1] - hop * u * 0.28 - (q.bob || 0) * u); c.rotate(q.tilt || 0); c.scale(u * (1 + sq), u * (1 - sq - sit * 0.22));
  const bw0 = 0.215, bw1 = 0.19, bh = 0.69, rr = 0.19; // half widths bottom/top, body height, top radius
  // nub arms behind body when they hang behind (far side when side-turned)
  const arm = (side, ang) => { if (ang == null || ang < 0.2) return; const sx = side * 0.16, sy = -0.53; c.save(); c.translate(sx, sy); c.rotate(-side * ang + (side > 0 ? 0 : 0) + (q.armWave ? Math.sin((o.t || 0) * 9) * 0.25 * (side > 0 ? 1 : 0) : 0));
    const g = c.createLinearGradient(-0.05, 0, 0.05, 0); g.addColorStop(0, shade(col, 1.08)); g.addColorStop(1, shade(col, 0.66)); c.fillStyle = g; c.beginPath(); c.roundRect(-0.042, -0.02, 0.084, 0.27, 0.042); c.fill(); c.restore(); };
  if (yaw > 0.8) arm(1, q.armR ?? null); else if (yaw < -0.8) arm(-1, q.armL ?? null);
  // body
  c.beginPath(); c.moveTo(-bw0, -0.0); c.bezierCurveTo(-bw0, -0.35, -bw1, -0.5, -bw1, -bh + rr); c.arc(0, -bh + rr, bw1, Math.PI, 0); c.bezierCurveTo(bw1, -0.5, bw0, -0.35, bw0, 0);
  c.ellipse(0, 0, bw0, 0.05, 0, 0, Math.PI); c.closePath();
  let g = c.createLinearGradient(-bw0, 0, bw0, 0); g.addColorStop(0, shade(col, 1.16)); g.addColorStop(0.35, shade(col, 1.0)); g.addColorStop(0.8, shade(col, 0.68)); g.addColorStop(1, shade(col, 0.5)); c.fillStyle = g; c.fill();
  g = c.createLinearGradient(0, -bh, 0, 0.05); g.addColorStop(0, 'rgba(255,240,220,0.12)'); g.addColorStop(0.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(20,8,2,0.38)'); c.fillStyle = g; c.fill();
  // warm rim on the lit edge
  c.strokeStyle = 'rgba(255,214,160,0.25)'; c.lineWidth = 0.012; c.beginPath(); c.moveTo(-bw0 + 0.008, -0.05); c.bezierCurveTo(-bw0 + 0.008, -0.35, -bw1 + 0.008, -0.5, -bw1 + 0.008, -bh + rr); c.stroke();
  if (o.scarf) { c.fillStyle = shade(o.scarf, 1.0); c.beginPath(); c.roundRect(-bw1 - 0.01, -bh + 0.06, bw1 * 2 + 0.02, 0.075, 0.035); c.fill(); c.fillStyle = shade(o.scarf, 0.8); c.beginPath(); c.roundRect(0.04, -bh + 0.1, 0.06, 0.17, 0.02); c.fill(); }
  if (o.bowtie) { c.fillStyle = o.bowtie; c.beginPath(); c.moveTo(0, -bh + 0.12); c.lineTo(-0.05, -bh + 0.09); c.lineTo(-0.05, -bh + 0.15); c.closePath(); c.moveTo(0, -bh + 0.12); c.lineTo(0.05, -bh + 0.09); c.lineTo(0.05, -bh + 0.15); c.closePath(); c.fill(); }
  if (yaw <= 0.8 && yaw >= -0.8) { arm(-1, q.armL ?? null); arm(1, q.armR ?? null); } else if (yaw > 0.8) arm(-1, q.armL ?? null); else arm(1, q.armR ?? null);
  // head
  const hr = 0.152, hx = (q.look || 0) * 0.01, hy = -bh - hr + 0.035 + (q.nod || 0) * 0.02;
  g = c.createRadialGradient(hx - hr * 0.4, hy - hr * 0.45, hr * 0.05, hx, hy, hr * 1.05); g.addColorStop(0, '#FFFBF1'); g.addColorStop(0.45, P.head); g.addColorStop(0.85, shade(P.head, 0.78)); g.addColorStop(1, shade(P.head, 0.6));
  c.fillStyle = 'rgba(30,14,6,0.28)'; c.beginPath(); c.ellipse(hx, hy + hr * 0.95, hr * 0.8, hr * 0.18, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = g; c.beginPath(); c.arc(hx, hy, hr, 0, Math.PI * 2); c.fill();
  // eyes: low, close, tiny
  if (Math.abs(yaw) < 2.0) { const ex = Math.sin(yaw) * hr * 0.62, sp = hr * 0.34 * Math.cos(yaw * 0.9), ey = hy + hr * 0.14 + (q.look ? -q.look * hr * 0.1 : 0);
    c.fillStyle = P.ink; const blink = o.blink ? 0.25 : 1;
    for (const s of [-1, 1]) { const xx = hx + ex + s * sp / 2; if (Math.abs(yaw) > 1.1 && Math.sign(yaw) === -s) continue; c.beginPath(); c.ellipse(xx, ey, hr * 0.085, hr * 0.105 * blink, 0, 0, Math.PI * 2); c.fill(); }
    if (o.blush) { c.fillStyle = 'rgba(214,120,100,0.28)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(hx + ex + s * sp * 0.95, ey + hr * 0.3, hr * 0.13, hr * 0.07, 0, 0, Math.PI * 2); c.fill(); } } }
  hat(c, o.hat || 'none', o.hatCol || shade(col, 0.85), hx, hy, hr, yaw);
  c.restore();
  return { head: pr(o.x, (o.y ?? 0) + (o.h ?? 62) * 0.98 + hop * (o.h ?? 62) * 0.28, o.z), base: p0, u };
}
function hat(c, kind, col, hx, hy, hr, yaw) {
  if (kind === 'none') return;
  if (kind === 'beanie') { let g = c.createLinearGradient(hx - hr, 0, hx + hr, 0); g.addColorStop(0, shade(col, 1.15)); g.addColorStop(1, shade(col, 0.6)); c.fillStyle = g;
    c.beginPath(); c.arc(hx, hy - hr * 0.08, hr * 1.06, Math.PI * 1.04, Math.PI * 1.96); c.closePath(); c.fill(); c.beginPath(); c.roundRect(hx - hr * 1.1, hy - hr * 0.28, hr * 2.2, hr * 0.36, hr * 0.16); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.12)'; c.lineWidth = hr * 0.05; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(hx + i * hr * 0.28, hy - hr * 0.26); c.lineTo(hx + i * hr * 0.28, hy + hr * 0.06); c.stroke(); } }
  else if (kind === 'fedora') { c.fillStyle = shade(col, 0.7); c.beginPath(); c.ellipse(hx, hy - hr * 0.5, hr * 1.55, hr * 0.3, 0, 0, Math.PI * 2); c.fill();
    const g = c.createLinearGradient(hx - hr, 0, hx + hr, 0); g.addColorStop(0, shade(col, 1.1)); g.addColorStop(1, shade(col, 0.62)); c.fillStyle = g; c.beginPath(); c.moveTo(hx - hr * 0.85, hy - hr * 0.5); c.lineTo(hx - hr * 0.75, hy - hr * 1.25); c.quadraticCurveTo(hx, hy - hr * 1.05, hx + hr * 0.75, hy - hr * 1.25); c.lineTo(hx + hr * 0.85, hy - hr * 0.5); c.closePath(); c.fill();
    c.fillStyle = shade(col, 0.4); c.fillRect(hx - hr * 0.84, hy - hr * 0.72, hr * 1.68, hr * 0.18); }
  else if (kind === 'bun') { const hc = '#4A2E1E'; const g = c.createLinearGradient(hx - hr, 0, hx + hr, 0); g.addColorStop(0, shade(hc, 1.3)); g.addColorStop(1, shade(hc, 0.7)); c.fillStyle = g;
    c.beginPath(); c.arc(hx, hy, hr * 1.04, Math.PI * 0.95, Math.PI * 2.05); c.quadraticCurveTo(hx + hr * 0.3, hy - hr * 0.5, hx - hr * 0.2, hy - hr * 0.35); c.closePath(); c.fill(); c.beginPath(); c.arc(hx + Math.sin(yaw) * hr * -0.5, hy - hr * 1.1, hr * 0.42, 0, Math.PI * 2); c.fill(); }
  else if (kind === 'party') { const g = c.createLinearGradient(hx - hr * 0.6, 0, hx + hr * 0.6, 0); g.addColorStop(0, shade(col, 1.2)); g.addColorStop(1, shade(col, 0.7)); c.fillStyle = g;
    c.beginPath(); c.moveTo(hx - hr * 0.62, hy - hr * 0.72); c.lineTo(hx + hr * 0.1, hy - hr * 2.15); c.lineTo(hx + hr * 0.66, hy - hr * 0.68); c.closePath(); c.fill(); c.save(); c.clip(); c.fillStyle = 'rgba(255,240,210,0.6)';
    for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(hx + hr * 0.05, hy - hr * (0.95 + i * 0.42), hr * 0.8, hr * 0.07, -0.25, 0, Math.PI * 2); c.fill(); } c.restore(); c.fillStyle = P.gold; c.beginPath(); c.arc(hx + hr * 0.1, hy - hr * 2.15, hr * 0.17, 0, 7); c.fill(); }
}
/** a crowd placement helper: n people on a ring around (cx,cz) at radius r, facing in */
export function ring(n, cx, cz, r, a0 = 0) { return Array.from({ length: n }, (_, i) => { const a = a0 + i / n * Math.PI * 2; return { x: cx + Math.cos(a) * r, z: cz + Math.sin(a) * r, a, i,
  col: PALETTE[(i * 3) % PALETTE.length], hat: HATS[(i * 5 + 1) % HATS.length], hatCol: PALETTE[(i * 3 + 4) % PALETTE.length] }; }); }
