/** people.js — Tao Ink cast. Measured on 4550 (t3.5 sand man, t64.5 arms up, t74.5 reclining, t84.5 boat):
 *  - INK STICK PERSON: disc head r ≈ 0.11·H, limbs one round-capped stroke w ≈ 0.46·r, no face, no hands/feet;
 *    neck line runs into the head; the body is a single straight spine; joints bend (never a straight "I" arm).
 *    Appeal comes from POSE (contrapposto, hand on hip, weight on one leg) — 4550 t3.5 is the benchmark.
 *  - SAGE: robed silhouette with topknot + staff (4550 t11.5 老子骑牛), cream on night / ink on paper.
 *  - OX: ink silhouette (barrel body, hump, low head, crescent horns) — our W3 hero, also the sage's mount.
 * Angles are degrees from straight-down; + = toward the facing side. */
import { P, clamp, lerp } from './look.js';
const D = Math.PI / 180;
export const POSES = {
  stand:   { lean: 0, head: 0, ua: [12, -10], fa: [8, -6], th: [7, -6], sh: [3, -3] },
  hip:     { lean: -3, head: 4, ua: [62, -42], fa: [88, 48], th: [10, -4], sh: [2, -2] },          // 4550 t3.5: one hand out, one on hip
  akimbo:  { lean: 0, head: 0, ua: [45, -45], fa: [-40, 40], th: [9, -9], sh: [3, -3] },
  armsUp:  { lean: 0, head: -6, ua: [165, -165], fa: [172, -172], th: [6, -6], sh: [2, -2] },      // 4550 t64.5
  chopUp:  { lean: -8, head: -6, ua: [200, 190], fa: [235, 222], th: [24, -14], sh: [4, -6] },     // cleaver raised behind head
  chopDown:{ lean: 26, head: 30, ua: [60, 48], fa: [92, 80], th: [30, -14], sh: [-2, -8] },
  holdUp:  { lean: -4, head: -14, ua: [140, -42], fa: [160, 48], th: [10, -4], sh: [2, -2] },     // admires the blade
  bow:     { lean: 22, head: 26, ua: [10, 4], fa: [2, -4], th: [4, -4], sh: [0, 0] },
  slump:   { lean: 18, head: 34, ua: [6, -4], fa: [-2, 2], th: [8, -6], sh: [0, 0] },
  recline: { lean: -62, head: -20, ua: [-120, -100], fa: [-170, -160], th: [92, 80], sh: [62, 40], seat: true }, // 4550 t74.5
  sit:     { lean: 6, head: 6, ua: [40, 25], fa: [90, 80], th: [88, 84], sh: [8, 4], seat: true },               // boat / bench
  walk:    { lean: 4, head: 2, ua: [20, -20], fa: [30, -6], th: [22, -18], sh: [6, -26] },
};
export function blendPose(a, b, t) { const A = POSES[a] || a, B = POSES[b] || b, o = {};
  for (const k of ['lean', 'head']) o[k] = lerp(A[k], B[k], t);
  for (const k of ['ua', 'fa', 'th', 'sh']) o[k] = [lerp(A[k][0], B[k][0], t), lerp(A[k][1], B[k][1], t)];
  o.seat = t < 0.5 ? A.seat : B.seat; return o; }
export function walkPose(ph) { const s = Math.sin(ph), c = Math.cos(ph);
  return { lean: 5, head: 2, ua: [24 * s, -24 * s], fa: [24 * s + 18, -24 * s + 18], th: [26 * s, -26 * s], sh: [26 * s - 14 + Math.max(0, -c) * -18, -26 * s - 14 + Math.max(0, c) * -18] }; }
/* stick person. x,y = point between the feet (or the seat point if pose.seat). Returns joints for attaching props. */
export function stick(ctx, { x, y, H = 600, pose = 'stand', facing = 1, color = P.ink, k = 1, bob = 0 } = {}) {
  if (k <= 0) return null; const p = typeof pose === 'string' ? POSES[pose] : pose; const f = facing;
  const r = 0.11 * H, lw = 0.46 * r, thL = 0.25 * H, shL = 0.24 * H, uaL = 0.17 * H, faL = 0.16 * H, spine = 0.3 * H;
  const v = (ang, len) => [Math.sin(ang * D) * len * f, Math.cos(ang * D) * len];        // down-pointing vector
  const hip = p.seat ? [x, y - bob] : [x, y - (thL + shL) * Math.cos(Math.max(Math.abs(p.th[0]), Math.abs(p.th[1])) * D * 0.5) - bob];
  const up = v(p.lean + 180, spine); const neck = [hip[0] + up[0], hip[1] + up[1]];
  const hv = v(p.lean + p.head * 0.6 + 180, r * 0.95); const head = [neck[0] + hv[0], neck[1] + hv[1]];
  const sv = v(p.lean, 0.045 * H); const sho = [neck[0] + sv[0], neck[1] + sv[1]];
  const limbs = []; const J = { head, headR: r, neck, hip, sho, hands: [], feet: [], elbows: [], lw, fa: [] };
  for (let i = 0; i < 2; i++) {
    const e = v(p.ua[i], uaL), el = [sho[0] + e[0], sho[1] + e[1]]; const h = v(p.fa[i], faL), ha = [el[0] + h[0], el[1] + h[1]];
    const kn = v(p.th[i], thL), knee = [hip[0] + kn[0], hip[1] + kn[1]]; const s = v(p.sh[i], shL), ft = [knee[0] + s[0], knee[1] + s[1]];
    limbs.push([sho, el, ha], [hip, knee, ft]); J.hands.push(ha); J.elbows.push(el); J.feet.push(ft); J.fa.push(p.fa[i]);
  }
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(neck[0], neck[1]); ctx.lineTo(head[0], head[1]); ctx.stroke();
  limbs.forEach(([a, b, c]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); });
  ctx.beginPath(); ctx.arc(head[0], head[1], r, 0, 7); ctx.fill();
  ctx.restore(); return J;
}
/* sage — robed silhouette: topknot, long sleeves, hem flare, staff. x,y feet centre. */
export function sage(ctx, x, y, H, { color = P.cream, facing = 1, k = 1, staff = true, seated = false } = {}) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(x, y); ctx.scale(facing * H / 100, H / 100); ctx.fillStyle = color; ctx.strokeStyle = color;
  ctx.beginPath(); ctx.arc(0, -86, 7.5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-1, -96, 3.6, 4.2, 0, 0, 7); ctx.fill();   // head + topknot
  ctx.beginPath(); ctx.moveTo(-2, -79);
  if (seated) { ctx.bezierCurveTo(-12, -76, -16, -52, -18, -38); ctx.bezierCurveTo(-8, -34, 12, -34, 22, -40); ctx.bezierCurveTo(12, -54, 10, -74, 3, -79); }
  else { ctx.bezierCurveTo(-12, -76, -15, -50, -15, -30); ctx.bezierCurveTo(-16, -14, -19, -4, -21, 0); ctx.lineTo(16, 0); ctx.bezierCurveTo(13, -8, 11, -24, 11, -40); ctx.bezierCurveTo(12, -60, 10, -74, 3, -79); }
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(6, -70); ctx.bezierCurveTo(16, -60, 20, -52, 18, -44); ctx.bezierCurveTo(14, -42, 9, -46, 6, -52); ctx.fill();  // sleeve
  if (staff) { ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(19, -100); ctx.lineTo(19, seated ? -30 : 0); ctx.stroke(); ctx.beginPath(); ctx.arc(19, -101, 2.6, 0, 7); ctx.fill(); }
  ctx.restore();
}
/* ox — side silhouette, length L, facing right by default. Returns joint anchors in world coords (for 庖丁 gaps).
 * parts: pass `split` 0..1 to drift the four cut sections apart (如土委地). */
export const OX_PARTS = ['head', 'fore', 'mid', 'hind'];
export function ox(ctx, x, y, L, { color = P.ink, facing = 1, k = 1, split = 0, walk = 0 } = {}) {
  if (k <= 0) return null; const s = L / 200; ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(x, y); ctx.scale(facing * s, s); ctx.fillStyle = color;
  // legs: tapered curves — muscled upper leg, knee/hock joint, thin cannon, fetlock, small cloven hoof. hind=true bends the hock back.
  const legs = (lx, ph, hind = false) => { const sw = Math.sin(walk + ph) * 6, kx = lx + sw * 0.5 + (hind ? 5 : -1), fx = lx + sw;
    ctx.beginPath(); ctx.moveTo(lx - (hind ? 12 : 9), -50);
    ctx.bezierCurveTo(lx - (hind ? 12 : 9), -38, kx - 5, -30, kx - 3.6, -22);           // back of thigh → knee/hock
    ctx.bezierCurveTo(kx - 3.4, -14, fx - 3, -8, fx - 3.2, -4);                          // cannon
    ctx.bezierCurveTo(fx - 4.5, -2, fx - 5, 0, fx - 4.5, 0.5); ctx.lineTo(fx + 1, 0.5); ctx.lineTo(fx + 1.6, -1.5); ctx.lineTo(fx + 2.4, 0.5); ctx.lineTo(fx + 5.5, 0.5);  // cloven hoof
    ctx.bezierCurveTo(fx + 5.5, -2, fx + 3, -3, fx + 2.6, -5);
    ctx.bezierCurveTo(fx + 2.4, -10, kx + 2.4, -16, kx + 3, -24);                        // front of cannon
    ctx.bezierCurveTo(kx + 4, -32, lx + (hind ? 4 : 9), -38, lx + (hind ? 6 : 10), -50); ctx.closePath(); ctx.fill(); };
  const off = (i) => [(i - 1.5) * 24 * split, (Math.abs(i - 1.5) < 1 ? -6 : 8) * split];
  const part = (i, draw) => { const [dx, dy] = off(i); ctx.save(); ctx.translate(dx, dy); ctx.rotate((i - 1.5) * 0.07 * split); draw(); ctx.restore(); };
  if (split < 0.02) { ctx.beginPath(); ctx.moveTo(-86, -82); ctx.bezierCurveTo(-80, -96, -60, -98, -40, -97); ctx.bezierCurveTo(-10, -99, 10, -104, 26, -110); ctx.bezierCurveTo(42, -116, 56, -110, 62, -98);
    ctx.lineTo(62, -50); ctx.bezierCurveTo(40, -36, 20, -38, 10, -38); ctx.bezierCurveTo(-10, -32, -30, -34, -50, -40); ctx.bezierCurveTo(-70, -42, -86, -50, -88, -66); ctx.closePath(); ctx.fill(); }
  // hind: rump + tail + hind legs
  part(3, () => { ctx.beginPath(); ctx.moveTo(-40, -96); ctx.bezierCurveTo(-70, -98, -88, -88, -92, -70); ctx.bezierCurveTo(-94, -54, -86, -44, -70, -42); ctx.lineTo(-40, -42); ctx.closePath(); ctx.fill();
    legs(-80, 0, true); legs(-62, 2.4, true); ctx.lineWidth = 3; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-90, -80); ctx.bezierCurveTo(-100, -66, -98, -48, -96, -38); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-96, -36, 3, 6, 0, 0, 7); ctx.fill(); });
  part(2, () => { ctx.beginPath(); ctx.moveTo(-41, -97); ctx.bezierCurveTo(-20, -100, 0, -101, 16, -102); ctx.lineTo(16, -40); ctx.bezierCurveTo(4, -32, -24, -33, -41, -41); ctx.closePath(); ctx.fill(); });
  part(1, () => { ctx.beginPath(); ctx.moveTo(15, -102); ctx.bezierCurveTo(28, -116, 46, -118, 60, -104); ctx.bezierCurveTo(70, -86, 70, -60, 62, -46); ctx.bezierCurveTo(48, -38, 30, -38, 15, -40); ctx.closePath(); ctx.fill(); legs(38, 1.2); legs(56, 3.6);
    ctx.beginPath(); ctx.moveTo(48, -46); ctx.bezierCurveTo(56, -34, 62, -33, 65, -40); ctx.bezierCurveTo(67, -48, 66, -56, 62, -62); ctx.closePath(); ctx.fill(); });  // dewlap
  part(0, () => { ctx.beginPath(); ctx.moveTo(58, -100); ctx.bezierCurveTo(70, -104, 80, -98, 86, -88); ctx.bezierCurveTo(92, -78, 98, -66, 103, -58); ctx.bezierCurveTo(105, -54, 103, -49, 98, -48); ctx.bezierCurveTo(93, -47, 90, -50, 86, -52); ctx.bezierCurveTo(80, -55, 74, -60, 68, -64); ctx.bezierCurveTo(62, -68, 58, -74, 58, -80); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 4.5; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(80, -92); ctx.bezierCurveTo(76, -108, 84, -116, 96, -114); ctx.stroke();       // horn
    ctx.beginPath(); ctx.moveTo(84, -90); ctx.bezierCurveTo(90, -102, 100, -104, 106, -98); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(74, -88); ctx.bezierCurveTo(68, -94, 64, -92, 66, -86); ctx.fill(); });                                                    // ear
  ctx.restore();
  const T = (px, py) => [x + px * s * facing, y + py * s];
  return { gaps: [[T(60, -102), T(62, -70), T(60, -48)], [T(16, -104), T(18, -72), T(16, -40)], [T(-40, -98), T(-38, -70), T(-41, -42)]], spine: [T(-88, -88), T(-40, -98), T(16, -102), T(62, -98)], s, top: T(0, -112) };
}
