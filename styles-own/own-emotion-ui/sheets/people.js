/** Emotion UI — people. Three casts, each measured from its source:
 *  pill()  — nexo-crowd capsule person (nexo t5.5 / t7.5 / t26.5): head ⌀ = 0.25 H, body capsule w = 0.33 H, h = 0.76 H,
 *            one thick bent arm (w = 0.095 H), coin-shaded head, soft key-light. Hero = orange, crowd = blue-grey with depth echo.
 *  sitter() — 6571-just-en cream pictogram with thick round limbs (6571 t4.5 / t9.5): sits on a bed edge, hunched over a glowing phone.
 *  kid()   — 6911-anxious-attach flat-vector young adult (6911 t8 / t31): big bob/short hair, closed-arc or teary eyes, blush, hoodie.
 * All return anchors {head:[x,y], headR, hand:[x,y], top:[x,y]} so props (bubbles, brackets, gaze lines) can attach. */
import { P, rgba, mix, contactShadow, glowPool, roundRect, clamp, lerp } from './look.js';

const TAU = Math.PI * 2;
function capsule(ctx, x, y, w, h) { roundRect(ctx, x - w / 2, y, w, h, w / 2); }
function limb(ctx, pts, w, color) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = w; ctx.strokeStyle = color;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  if (pts.length === 3) ctx.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
  else for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke(); ctx.restore();
}
/** two-segment arm with a soft elbow (rounded join) */
function arm(ctx, s, e, h, w, color, edge) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (edge) { ctx.lineWidth = w + 3; ctx.strokeStyle = edge; ctx.beginPath(); ctx.moveTo(...s); ctx.lineTo(...e); ctx.lineTo(...h); ctx.stroke(); }
  ctx.lineWidth = w; ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(...s); ctx.lineTo(...e); ctx.lineTo(...h); ctx.stroke();
  ctx.restore();
}

/* ------------------------------------------------------------------ A. PILL PERSON (nexo) */
export const PILL_ARMS = ['hip', 'phone', 'down', 'raise', 'chin'];
/**
 * @param o.x, o.y   feet centre (floor)      @param o.H total height px
 * @param o.cast     'hero' | 'crowd'          @param o.arm one of PILL_ARMS (hero only; crowd has none, like nexo)
 * @param o.facing   1 = arm on the right       @param o.lean radians (+ = toward facing)
 * @param o.nod      head drop 0..1 (shame / looking at phone)   @param o.echo crowd depth echo 0..1 (nexo ghost head)
 * @param o.screen   0..1 phone screen light    @param o.glow hero aura 0..1   @param o.alpha
 */
export function pill(ctx, o) {
  const { x, y, H = 520, cast = 'hero', arm: armK = 'down', facing = 1, lean = 0, nod = 0, echo = 0, screen = 0, glow = 0, alpha = 1, squash = 0, phone = true } = o;
  const hero = cast === 'hero';
  const bw = H * 0.33, bh = H * 0.76 * (1 - squash * 0.06), hr = H * 0.125;
  const base = hero ? P.hero : (o.color || P.crowd);
  const lit = hero ? P.heroLit : mix(base, '#DDE3F2', 0.25), shade = hero ? P.heroShade : mix(base, '#1A2033', 0.45);
  ctx.save(); ctx.globalAlpha *= alpha;
  if (hero && glow > 0) glowPool(ctx, x, y - H * 0.55, H * 0.95, '#FFB070', 0.30 * glow);
  contactShadow(ctx, x, y, bw * 0.95, hero ? 0.55 : 0.35);
  ctx.translate(x, y); ctx.rotate(lean * facing); ctx.scale(facing, 1);
  const by = -bh;                                     // body top
  // body capsule with soft vertical light
  const g = ctx.createLinearGradient(-bw / 2, by, bw / 2, 0);
  g.addColorStop(0, lit); g.addColorStop(0.55, base); g.addColorStop(1, shade);
  if (!hero) { // crowd: lighter at chest, dissolves toward the floor (nexo t5.5)
    const gv = ctx.createLinearGradient(0, by, 0, 0);
    gv.addColorStop(0, mix(base, '#E6EAF5', 0.18)); gv.addColorStop(0.6, base); gv.addColorStop(1, rgba(base.startsWith('#') ? base : '#7F89A3', 0.25));
    ctx.fillStyle = gv;
  } else ctx.fillStyle = g;
  capsule(ctx, 0, by, bw, bh); ctx.fill();
  if (hero) { // rim light on the lit edge + inner shade on the far edge
    ctx.save(); capsule(ctx, 0, by, bw, bh); ctx.clip();
    const rg = ctx.createLinearGradient(-bw / 2, 0, -bw / 2 + bw * 0.22, 0);
    rg.addColorStop(0, 'rgba(255,230,200,0.35)'); rg.addColorStop(1, 'rgba(255,230,200,0)');
    ctx.fillStyle = rg; ctx.fillRect(-bw / 2, by, bw * 0.3, bh);
    const sg = ctx.createLinearGradient(bw / 2, 0, bw / 2 - bw * 0.3, 0);
    sg.addColorStop(0, 'rgba(120,55,20,0.28)'); sg.addColorStop(1, 'rgba(120,55,20,0)');
    ctx.fillStyle = sg; ctx.fillRect(bw * 0.2, by, bw * 0.3, bh);
    ctx.restore();
  }
  // head: coin shading = darker disc offset down-back, then lit disc (nexo t7.5)
  const hx = bw * 0.02 + nod * bw * 0.10, hy = by - hr * 0.98 + nod * hr * 0.38;
  if (!hero && echo > 0) { ctx.fillStyle = rgba('#8C96B0', 0.35 * echo); ctx.beginPath(); ctx.arc(hx - hr * 0.42, hy - hr * 0.05, hr * 1.04, 0, TAU); ctx.fill(); }
  ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(hx - hr * 0.07, hy + hr * 0.07, hr, 0, TAU); ctx.fill();
  const hg = ctx.createRadialGradient(hx - hr * 0.35, hy - hr * 0.4, hr * 0.1, hx, hy, hr * 1.05);
  hg.addColorStop(0, hero ? '#FFD3A0' : mix(base, '#F0F3FA', 0.35)); hg.addColorStop(1, hero ? base : mix(base, '#B8C0D4', 0.15));
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, hr * 0.97, 0, TAU); ctx.fill();
  // arm (hero only) — shoulder sits inside the capsule's upper-right
  const aw = H * 0.095, S = [bw * 0.28, by + bh * 0.13];
  let E, Hh, phoneAt = null;
  const armCol = hero ? '#E89150' : shade, edge = hero ? 'rgba(255,214,170,0.55)' : null;
  if (hero) {
    if (armK === 'hip') { E = [bw * 0.66, by + bh * 0.36]; Hh = [bw * 0.32, by + bh * 0.58]; phoneAt = [bw * 0.30, by + bh * 0.66, 0.05]; }
    else if (armK === 'phone') { E = [bw * 0.66, by + bh * 0.31]; Hh = [bw * 0.16, by + bh * 0.26]; phoneAt = [bw * 0.05, by + bh * 0.25, 0]; }
    else if (armK === 'raise') { E = [bw * 0.62, by - bh * 0.02]; Hh = [bw * 0.55, by - bh * 0.30]; }
    else if (armK === 'chin') { E = [bw * 0.62, by + bh * 0.30]; Hh = [bw * 0.18, by - hr * 0.15]; }
    else { E = [bw * 0.44, by + bh * 0.34]; Hh = [bw * 0.42, by + bh * 0.58]; }
    if (phone && phoneAt && armK === 'hip') drawPhone(ctx, phoneAt[0], phoneAt[1], H * 0.155, screen, phoneAt[2]);
    arm(ctx, S, E, Hh, aw, armCol, edge);
    if (phone && phoneAt && armK === 'phone') drawPhone(ctx, phoneAt[0], phoneAt[1], H * 0.27, screen, 0);
  }
  ctx.restore();
  // anchors in world space
  const c = Math.cos(lean * facing), s2 = Math.sin(lean * facing);
  const W = ([px, py]) => [x + (px * facing) * c - py * s2, y + (px * facing) * s2 + py * c];
  return { head: W([hx, hy]), headR: hr, top: W([hx, hy - hr]), hand: Hh ? W(Hh) : W([bw * 0.4, by + bh * 0.5]), chest: W([0, by + bh * 0.25]), bw, H };
}
/** phone held in a pill hand: dark slab, lit screen with lock-time (nexo t7.5) */
function drawPhone(ctx, cx, cy, h, screen, rot) {
  const w = h * 0.5;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  if (screen > 0) glowPool(ctx, 0, 0, h * 1.6, '#9CC8FF', 0.32 * screen);
  roundRect(ctx, -w / 2, -h / 2, w, h, w * 0.18); ctx.fillStyle = '#0C1120'; ctx.fill();
  ctx.lineWidth = Math.max(1.5, h * 0.018); ctx.strokeStyle = 'rgba(160,175,210,0.55)'; ctx.stroke();
  roundRect(ctx, -w / 2 + h * 0.03, -h / 2 + h * 0.03, w - h * 0.06, h - h * 0.06, w * 0.13);
  const sg = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  sg.addColorStop(0, mix('#101830', '#2E4C86', screen)); sg.addColorStop(1, mix('#0A0F1C', '#18264A', screen));
  ctx.fillStyle = sg; ctx.fill();
  if (screen > 0.3 && h > 60) {
    ctx.save(); ctx.scale(1, 1);  // keep text upright even if mirrored by facing
    ctx.fillStyle = `rgba(235,242,255,${screen})`; ctx.font = `600 ${h * 0.14}px "Inter Tight", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('19:02', 0, -h * 0.2);
    ctx.fillStyle = `rgba(200,215,240,${0.6 * screen})`; ctx.fillRect(-w * 0.28, -h * 0.08, w * 0.56, h * 0.018);
    ctx.restore();
  }
  ctx.restore();
}
/** crowd row (nexo t5.5): back layer small & dark, front layer large; pills keep visible gaps (≈0.12 H) so each reads as a person,
 *  heads carry the depth echo. phones = share of the crowd lit by their own screen (our addition: "everyone is busy with themselves"). */
export function crowd(ctx, { x0 = 0, x1 = 760, y = 900, H = 480, n = 4, seed = 3, phones = 0, t = 0, alpha = 1 } = {}) {
  let s = seed; const R = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const out = [];
  [[0.66, 0.5, 1.25, 0.10], [0.84, 0.75, 1.0, 0.45], [1.0, 0.97, 0.78, 0.0]].forEach(([k, a, dens, off], layer) => {
    const m = Math.max(1, Math.round(n * dens)), span = (x1 - x0);
    for (let i = 0; i < m; i++) {
      const px = x0 + span * ((i + off + 0.35 + (R() - 0.5) * 0.25) / m);
      const hh = H * k * (0.93 + R() * 0.12);
      const col = mix(P.crowd, '#1C2236', [0.62, 0.42, 0.22][layer]);
      const sway = Math.sin(t * 0.8 + i * 1.7 + layer * 2.1) * 0.01;
      const p = pill(ctx, { x: px, y: y - [34, 16, 0][layer], H: hh, cast: 'crowd', color: col, echo: layer === 1 ? 0.8 : 0, lean: sway, alpha: a * alpha });
      if (phones && layer && R() < phones) {
        ctx.save(); ctx.globalAlpha *= alpha; glowPool(ctx, p.chest[0], p.chest[1] + hh * 0.06, hh * 0.25, '#8EC3FF', 0.32);
        roundRect(ctx, p.chest[0] - hh * 0.03, p.chest[1] + hh * 0.0, hh * 0.06, hh * 0.1, 3); ctx.fillStyle = '#CFE6FF'; ctx.fill(); ctx.restore();
        p.phone = true;
      }
      out.push(p);
    }
  });
  // nexo: the crowd sinks into floor haze (lower third fades to the void)
  const g = ctx.createLinearGradient(0, y - H * 0.42, 0, y + 4); g.addColorStop(0, rgba(P.void, 0)); g.addColorStop(1, rgba(P.void, 0.55 * alpha));
  ctx.fillStyle = g; ctx.fillRect(x0 - H * 0.3, y - H * 0.42, x1 - x0 + H * 0.6, H * 0.42 + 4);
  return out;
}

/* ------------------------------------------------------------------ B. SITTER (6571 cream pictogram) */
/** Measured 6571 t9.5: head ⌀ ≈ 0.62 torso width; torso is one fat rounded slab leaning forward; upper arm hangs to just above the knee,
 *  forearm comes forward-up to the phone at chest height; thigh horizontal on the bed edge, shin straight down. Far limbs one tone darker.
 *  @param o.x,o.y = knee-bottom point on the bed front edge · o.H standing height · o.hunch 0..1 · o.phone glow 0..1 · o.look 0..1 head lifts */
export function sitter(ctx, o) {
  const { x, y, H = 560, hunch = 0.6, phone = 1, facing = 1, look = 0, alpha = 1, color = P.cream } = o;
  const u = H / 10;
  const shade = mix(color, '#6F7590', 0.40);
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.scale(facing, 1);
  const hip = [-u * 2.3, -u * 0.55], knee = [u * 0.35, -u * 0.55], foot = [u * 0.45, u * 2.75];
  const sp = lerp(0.18, 0.5, hunch);
  const L = u * 3.0, sh = [hip[0] + Math.sin(sp) * L, hip[1] - Math.cos(sp) * L];
  const ha = sp + 0.25 * hunch - look * 0.5, neck = u * 1.55;
  const hd = [sh[0] + Math.sin(ha) * neck, sh[1] - Math.cos(ha) * neck], hr = u * 1.02;
  const elbow = [sh[0] + u * 0.25, sh[1] + u * 1.55], hand = [sh[0] + u * 1.55, sh[1] + u * 0.85];
  const lw = u * 1.05;
  // far leg & arm
  limb(ctx, [[hip[0] + u * 0.3, hip[1] - u * 0.15], [knee[0] + u * 0.2, knee[1] - u * 0.15]], lw * 1.05, shade);
  limb(ctx, [[knee[0] + u * 0.2, knee[1] - u * 0.15], [foot[0] + u * 0.3, foot[1] - u * 0.1]], lw * 0.95, shade);
  limb(ctx, [[sh[0] + u * 0.25, sh[1] + u * 0.1], [elbow[0] + u * 0.35, elbow[1] - u * 0.1], [hand[0] + u * 0.1, hand[1] - u * 0.15]], lw * 0.8, shade);
  // torso slab: thick capsule from pelvis to chest, slightly fuller at the chest
  limb(ctx, [hip, sh], lw * 1.75, color);
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(sh[0], sh[1] + u * 0.1, lw * 0.95, 0, TAU); ctx.fill();
  // near leg
  limb(ctx, [hip, knee], lw * 1.12, color); limb(ctx, [knee, foot], lw, color);
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(foot[0] + u * 0.25, foot[1] + u * 0.05, lw * 0.75, lw * 0.42, 0, 0, TAU); ctx.fill();
  // phone + its cyan glow (6571: glow is the brightest thing in frame)
  if (phone > 0) glowPool(ctx, hand[0] + u * 0.3, hand[1] - u * 0.2, u * 3.0, '#7ABAEF', 0.55 * phone);
  ctx.save(); ctx.translate(hand[0] + u * 0.45, hand[1] - u * 0.35); ctx.rotate(-0.95);
  roundRect(ctx, -u * 0.6, -u * 0.36, u * 1.2, u * 0.72, u * 0.12); ctx.fillStyle = mix('#2E4E86', '#E8F6FF', 0.9 * phone); ctx.fill(); ctx.restore();
  // near arm over the phone
  limb(ctx, [[sh[0] - u * 0.05, sh[1] + u * 0.2], elbow, hand], lw * 0.86, color);
  // head
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(hd[0], hd[1], hr, 0, TAU); ctx.fill();
  if (phone > 0) { ctx.save(); ctx.globalAlpha *= 0.45 * phone; ctx.strokeStyle = P.cyanHot; ctx.lineWidth = u * 0.14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(hd[0], hd[1], hr * 0.93, -0.15, 1.2); ctx.stroke(); ctx.beginPath(); ctx.arc(sh[0], sh[1] + u * 0.1, lw * 0.9, -0.4, 0.9); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  const X = (p) => [x + p[0] * facing, y + p[1]];
  return { head: X(hd), headR: hr, top: X([hd[0], hd[1] - hr]), hand: X(hand), seat: X(hip) };
}
/** anxiety steam above a head (6571 t3.5–13: three wavy strokes) */
export function steam(ctx, x, y, s, t, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(238,234,224,0.9)'; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    for (let k = 0; k <= 12; k++) { const yy = y - k * s * 0.06, xx = x + i * s * 0.28 + Math.sin(k * 0.9 + t * 6 + i) * s * 0.06; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ C. KID (6911 flat vector) */
/** @param o.x,o.y feet · o.H height · o.hair 'bob'|'short' · o.top hoodie colour · o.mood 'calm'|'happy'|'worried'|'teary'|'shout'
 *  o.facing (face turns toward) · o.armR 'down'|'paddle'|'phone'|'wave'|'hip' · o.phones headphones band · o.look -1..1 eye shift */
export function kid(ctx, o) {
  const { x, y, H = 560, hair = 'bob', top = P.coral, mood = 'calm', facing = 1, armR = 'down', armL = 'down', phones = true, alpha = 1, bob = 0, blink = 0, hold = null, t = 0, turn = 0 } = o;
  const u = H / 100, tn = Math.max(0, Math.min(1, turn));   // turn 0 = front · 1 = 3/4 side toward `facing`
  ctx.save(); ctx.globalAlpha *= alpha;
  contactShadow(ctx, x, y, u * 22, 0.5);
  ctx.translate(x, y - bob * u); ctx.scale(facing, 1);
  ctx.save(); ctx.scale(1 - 0.22 * tn, 1);   // body narrows in 3/4 view; head drawn unscaled below
  const topSh = mix(top, '#3A2030', 0.22), topLt = mix(top, '#FFFFFF', 0.12);
  // legs (navy trousers) + white shoes (6911 t31)
  ctx.fillStyle = P.trouser;
  roundRect(ctx, -u * 8.5, -u * 33, u * 7, u * 31, u * 3); ctx.fill();
  roundRect(ctx, u * 1.5, -u * 33, u * 7, u * 31, u * 3); ctx.fill();
  ctx.fillStyle = '#E9ECF2';
  [[-u * 6.5, -u * 1.6], [u * 4.2, -u * 1.6]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.ellipse(sx, sy, u * 6.2, u * 2.6, 0, 0, TAU); ctx.fill(); });
  // back arm
  const shL = [-u * 12.5, -u * 58], shR = [u * 12.5, -u * 58];
  const armPath = (s, kind, side) => {
    if (kind === 'paddle' || kind === 'phone') return [s, [s[0] + side * u * 3, s[1] + u * 14], [s[0] + side * u * 12, s[1] + u * 12]];
    if (kind === 'wave') return [s, [s[0] + side * u * 9, s[1] - u * 8], [s[0] + side * u * 11, s[1] - u * 22]];
    if (kind === 'hip') return [s, [s[0] + side * u * 8, s[1] + u * 10], [s[0] + side * u * 1, s[1] + u * 19]];
    return [s, [s[0] + side * u * 2.5, s[1] + u * 12], [s[0] + side * u * 2, s[1] + u * 24]];
  };
  const aL = armPath(shL, armL, -1), aR = armPath(shR, armR, 1);
  limb(ctx, aL, u * 6.4, topSh); ctx.fillStyle = P.skin; ctx.beginPath(); ctx.arc(aL[2][0], aL[2][1] + u * 1.5, u * 2.9, 0, TAU); ctx.fill();
  // hoodie body: trapezoid with rounded shoulders + pocket + hem band
  ctx.beginPath();
  ctx.moveTo(-u * 10, -u * 62); ctx.quadraticCurveTo(-u * 15.5, -u * 61, -u * 15.5, -u * 54);
  ctx.lineTo(-u * 15, -u * 32); ctx.quadraticCurveTo(-u * 15, -u * 29, -u * 12, -u * 29);
  ctx.lineTo(u * 12, -u * 29); ctx.quadraticCurveTo(u * 15, -u * 29, u * 15, -u * 32);
  ctx.lineTo(u * 15.5, -u * 54); ctx.quadraticCurveTo(u * 15.5, -u * 61, u * 10, -u * 62); ctx.closePath();
  const bg = ctx.createLinearGradient(-u * 15, 0, u * 15, 0); bg.addColorStop(0, topLt); bg.addColorStop(1, top);
  ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = topSh; ctx.globalAlpha *= 0.55;
  roundRect(ctx, -u * 8, -u * 42, u * 16, u * 8, u * 2); ctx.fill();               // kangaroo pocket
  ctx.fillRect(-u * 15, -u * 32.5, u * 30, u * 3.2);                                    // hem band
  ctx.globalAlpha /= 0.55;
  ctx.restore();
  // neck
  ctx.fillStyle = mix(P.skin, '#B0705A', 0.25); roundRect(ctx, -u * 2.6, -u * 66, u * 5.2, u * 6, u * 1.5); ctx.fill();
  // HEAD (≈ 0.36 H tall like source) — slightly wider than tall, face turned by facing
  const hcx = u * (1.2 + 1.5 * tn), hcy = -u * 80, hw = u * (15.5 - 1.2 * tn), hh = u * 16.5;
  // hair back mass
  ctx.fillStyle = P.hair;
  if (hair === 'bob') { ctx.beginPath(); ctx.ellipse(hcx - u * 1, hcy + u * 1, hw * 1.13, hh * 1.06, 0, Math.PI * 0.95, Math.PI * 2.05); ctx.lineTo(hcx + hw * 1.1, hcy + u * 13); ctx.lineTo(hcx - hw * 1.15, hcy + u * 13); ctx.closePath(); ctx.fill(); }
  // ear (back side) — in 3/4 view it moves onto the cheek side of the skull, drawn after the face
  const ear = () => { ctx.fillStyle = mix(P.skin, '#D88A70', 0.25); ctx.beginPath(); ctx.ellipse(hcx - hw * (0.98 - 0.5 * tn), hcy + u * 2, u * 2.6, u * 3.4, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = mix(P.skin, '#A05A48', 0.4); ctx.lineWidth = u * 0.6; ctx.beginPath(); ctx.arc(hcx - hw * (0.98 - 0.5 * tn) + u * 0.4, hcy + u * 2, u * 1.3, -1.2, 1.4); ctx.stroke(); };
  if (tn < 0.3) ear();
  // face
  const fg = ctx.createRadialGradient(hcx + u * 3, hcy - u * 2, u * 2, hcx, hcy, hw * 1.1);
  fg.addColorStop(0, '#FBDCC2'); fg.addColorStop(1, P.skin);
  ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(hcx, hcy, hw, hh, 0, 0, TAU); ctx.fill();
  if (tn > 0) { ctx.beginPath(); ctx.ellipse(hcx + hw * 0.93, hcy + u * 2.5, u * 2.4 * tn, u * 2.2, 0, 0, TAU); ctx.fill(); }   // nose tip breaks the profile
  if (tn >= 0.3) ear();
  // hair top cap with side-swept fringe
  ctx.fillStyle = P.hair; ctx.beginPath();
  ctx.moveTo(hcx - hw * 1.08, hcy + u * (hair === 'bob' ? 6 : -1));
  ctx.bezierCurveTo(hcx - hw * 1.2, hcy - hh * 1.25, hcx + hw * 1.15, hcy - hh * 1.35, hcx + hw * 1.06, hcy - u * 2);
  ctx.bezierCurveTo(hcx + hw * 0.7, hcy - hh * 0.75, hcx + hw * 0.1, hcy - hh * 0.62, hcx - hw * 0.35, hcy - hh * 0.55);
  ctx.bezierCurveTo(hcx - hw * 0.65, hcy - hh * 0.35, hcx - hw * 0.85, hcy - u * 3, hcx - hw * 0.9, hcy + u * (hair === 'bob' ? 6 : 1));
  ctx.closePath(); ctx.fill();
  // hair sheen
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = u * 1.2; ctx.beginPath(); ctx.arc(hcx - u * 2, hcy - u * 4, hh * 0.95, -2.4, -1.7); ctx.stroke();
  // blush (6911: large soft cheek discs)
  ctx.fillStyle = 'rgba(240,130,130,0.35)';
  if (tn < 0.5) { ctx.beginPath(); ctx.ellipse(hcx - u * 7.5, hcy + u * 4.5, u * 3.6, u * 2.6, 0, 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(hcx + u * (10.5 - 2 * tn), hcy + u * 4.5, u * 3.3, u * 2.4, 0, 0, TAU); ctx.fill();
  // eyes + brows + mouth by mood
  const ex1 = hcx + u * (-2.5 + 5 * tn), ex2 = hcx + u * (7 + 3.5 * tn), ey = hcy + u * 0.5, eyeSx = (ex) => ex === ex1 ? 1 - 0.4 * tn : 1;
  ctx.strokeStyle = '#2A1E1C'; ctx.fillStyle = '#2A1E1C'; ctx.lineCap = 'round'; ctx.lineWidth = u * 1.0;
  const closed = mood === 'happy' || blink > 0.5;
  if (closed) { [ex1, ex2].forEach(ex => { ctx.beginPath(); ctx.arc(ex, ey + u * 1, u * 2.1, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }); }
  else {
    [ex1, ex2].forEach(ex => { ctx.beginPath(); ctx.ellipse(ex, ey, u * 1.55 * eyeSx(ex), u * 2.0, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ex + u * 0.5, ey - u * 0.7, u * 0.55, 0, TAU); ctx.fill(); ctx.fillStyle = '#2A1E1C'; });
  }
  // brows: inner ends lift when worried, drop when shouting
  ctx.lineWidth = u * 0.8;
  const bt = mood === 'worried' || mood === 'teary' ? 1 : mood === 'shout' ? -0.8 : 0;
  [[ex1, 1], [ex2, -1]].forEach(([ex, inner]) => { // inner = direction toward the nose
    const ix = ex + inner * u * 2, ox = ex - inner * u * 2, by0 = ey - u * 4.4;
    ctx.beginPath(); ctx.moveTo(ox, by0 + bt * u * 0.3); ctx.lineTo(ix, by0 - bt * u * 1.3); ctx.stroke(); });
  // mouth
  ctx.lineWidth = u * 0.9; const mx = hcx + u * (2.6 + 4.5 * tn), my = hcy + u * 8;
  ctx.beginPath();
  if (mood === 'happy') { ctx.arc(mx, my - u * 1.2, u * 2.6, 0.2, Math.PI - 0.2); ctx.stroke(); }
  else if (mood === 'calm') { ctx.arc(mx, my - u * 1.4, u * 1.8, 0.35, Math.PI - 0.35); ctx.stroke(); }
  else if (mood === 'shout') { ctx.fillStyle = '#6A2A2A'; ctx.ellipse(mx, my, u * 2.2, u * 2.8, 0, 0, TAU); ctx.fill(); }
  else { ctx.moveTo(mx - u * 2.6, my); for (let k = 1; k <= 4; k++) ctx.lineTo(mx - u * 2.6 + k * u * 1.3, my + (k % 2 ? -u * 0.9 : 0)); ctx.stroke(); }   // wobbly (6911 t8)
  if (mood === 'teary') { ctx.fillStyle = 'rgba(140,200,255,0.9)'; ctx.beginPath(); ctx.ellipse(ex2 + u * 0.8, ey + u * 3.6, u * 0.9, u * 1.6, 0, 0, TAU); ctx.fill(); }
  // headphones band (6911: grey arc over the hair)
  if (phones) { ctx.strokeStyle = '#7C7F8C'; ctx.lineWidth = u * 1.3; ctx.beginPath(); ctx.ellipse(hcx - u * 0.5, hcy - u * 1, hw * 1.25, hh * 1.2, 0, Math.PI * 1.03, Math.PI * 1.97); ctx.stroke(); }
  // front arm last (over body)
  limb(ctx, aR, u * 6.6, top);
  ctx.fillStyle = P.skin; ctx.beginPath(); ctx.arc(aR[2][0], aR[2][1] + u * 1, u * 3, 0, TAU); ctx.fill();
  let handW = [aR[2][0], aR[2][1]];
  if (armR === 'paddle') { ctx.fillStyle = '#7A4A2A'; roundRect(ctx, aR[2][0] - u * 0.6, aR[2][1] - u * 1.5, u * 5, u * 2.2, u * 1); ctx.fill(); ctx.fillStyle = '#E23A34'; ctx.beginPath(); ctx.arc(aR[2][0] + u * 9, aR[2][1] - u * 1.5, u * 6.3, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(aR[2][0] + u * 7.5, aR[2][1] - u * 3.5, u * 3, 0, TAU); ctx.fill(); }
  if (armR === 'phone') { glowPool(ctx, aR[2][0] + u * 2, aR[2][1] - u * 4, u * 14, '#9CC8FF', 0.4); ctx.fillStyle = '#10182C'; roundRect(ctx, aR[2][0] - u * 1, aR[2][1] - u * 11, u * 6, u * 10.5, u * 1.2); ctx.fill(); ctx.fillStyle = '#9CCBFF'; roundRect(ctx, aR[2][0] - u * 0.3, aR[2][1] - u * 10.3, u * 4.6, u * 9.1, u * 0.8); ctx.fill(); }
  ctx.restore();
  const X = (p) => [x + p[0] * facing, y - bob * u + p[1]];
  return { head: X([hcx, hcy]), headR: hh, top: X([hcx, hcy - hh * 1.2]), hand: X(handW), H };
}
