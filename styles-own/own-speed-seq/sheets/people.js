/** Speed Seq — wooden-puppet people (0594-speedrun).
 * Language measured from source: round featureless head (peach/brown), thin limbs with
 * VISIBLE joint circles (wooden puppet), block/capsule torso in flat costume colour,
 * no faces. Appeal = pose + costume + joint clarity — never sticks/blobs.
 * Casts: dancer (disco/living), couple (waltz lead/follow), band (guitar/drums). */
import { P, rgba, mix, contactShadow, glowPool, roundRect, clamp, lerp } from './look.js';

const TAU = Math.PI * 2;

function joint(ctx, x, y, r, color = P.cream) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = color; ctx.fill();
  ctx.lineWidth = Math.max(1.2, r * 0.22); ctx.strokeStyle = rgba(P.ink, 0.35); ctx.stroke();
}
function limbSeg(ctx, a, b, w, color) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = w; ctx.strokeStyle = color;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
}
function angPt(ox, oy, ang, len) { return [ox + Math.cos(ang) * len, oy + Math.sin(ang) * len]; }

/** Pose library — angles in radians, 0 = right, clockwise-down positive for legs typically.
 * Each pose: { lean, head, L:[shoulder,elbow,hand], R:[...], hipL, kneeL, footL, hipR, kneeR, footR }
 * Angles are relative to body local (+x right when facing=1). */
export const POSES = {
  idle:   { lean: 0, head: 0, LS: 0.35, LE: 1.1, LH: 1.55, RS: 2.8, RE: 2.1, RH: 1.6, hipL: 1.45, knL: 1.55, hipR: 1.7, knR: 1.55 },
  swayL:  { lean: -0.08, head: -0.05, LS: -0.2, LE: 0.6, LH: 1.0, RS: 2.6, RE: 2.0, RH: 1.5, hipL: 1.25, knL: 1.5, hipR: 1.85, knR: 1.55 },
  swayR:  { lean: 0.08, head: 0.05, LS: 0.5, LE: 1.2, LH: 1.7, RS: 3.3, RE: 2.5, RH: 2.0, hipL: 1.55, knL: 1.55, hipR: 1.35, knR: 1.45 },
  discoL: { lean: -0.12, head: -0.1, LS: -1.1, LE: -1.6, LH: -2.0, RS: 2.5, RE: 1.9, RH: 1.4, hipL: 1.15, knL: 1.55, hipR: 1.9, knR: 1.65 },
  discoR: { lean: 0.12, head: 0.08, LS: 0.4, LE: 1.0, LH: 1.5, RS: 4.2, RE: 4.7, RH: 5.2, hipL: 1.7, knL: 1.65, hipR: 1.2, knR: 1.55 },
  pump:   { lean: 0.05, head: 0.1, LS: -0.9, LE: -1.4, LH: -1.9, RS: -0.7, RE: -1.2, RH: -1.7, hipL: 1.35, knL: 1.7, hipR: 1.75, knR: 1.55 },
  waltzL: { lean: -0.05, head: 0.08, LS: -0.6, LE: -0.1, LH: 0.35, RS: 0.15, RE: 0.55, RH: 0.9, hipL: 1.35, knL: 1.55, hipR: 1.8, knR: 1.5 }, // lead: L arm up-out, R arm forward
  waltzF: { lean: 0.12, head: -0.1, LS: 2.6, LE: 2.2, LH: 1.7, RS: 3.7, RE: 4.2, RH: 4.7, hipL: 1.65, knL: 1.45, hipR: 1.3, knR: 1.55 }, // follow: open dress sway
  guitar: { lean: 0.15, head: 0.12, LS: 0.55, LE: 1.15, LH: 1.55, RS: 2.4, RE: 1.7, RH: 1.15, hipL: 1.5, knL: 1.55, hipR: 1.65, knR: 1.55 },
  drums:  { lean: -0.05, head: 0.15, LS: -0.5, LE: -0.1, LH: 0.4, RS: 3.6, RE: 3.1, RH: 2.6, hipL: 1.55, knL: 1.2, hipR: 1.55, knR: 1.2 }, // seated-ish
  sit:    { lean: 0.05, head: -0.15, LS: 0.6, LE: 1.3, LH: 1.7, RS: 2.5, RE: 1.9, RH: 1.5, hipL: 0.55, knL: 1.55, hipR: 0.55, knR: 1.55 },
  hatTip: { lean: 0.08, head: 0.2, LS: -0.8, LE: -1.3, LH: -1.7, RS: 2.7, RE: 2.1, RH: 1.55, hipL: 1.4, knL: 1.55, hipR: 1.7, knR: 1.55 },
};

export function blendPose(a, b, k) {
  const o = {};
  for (const key of Object.keys(a)) o[key] = lerp(a[key], b[key], k);
  return o;
}

/**
 * puppet — one wooden-puppet person.
 * @param o.x o.y feet  @param o.H height  @param o.pose POSES key or pose object
 * @param o.skin head fill  @param o.shirt torso  @param o.pants leg color
 * @param o.hair 'none'|'cap'|'bob'|'fedora'  @param o.hatColor
 * @param o.dress if set, draw triangle/ballroom dress instead of pants (follow)
 * @param o.facing ±1  @param o.hit 0..1 beat flash (joint glow)  @param o.alpha
 * @param o.suspenders bool  @param o.bowtie bool
 */
export function puppet(ctx, o) {
  const {
    x, y, H = 420, pose = 'idle', skin = P.skin, shirt = P.teal, pants = '#2A2430',
    hair = 'cap', hatColor = P.ink, dress = null, facing = 1, hit = 0, alpha = 1,
    suspenders = false, bowtie = false, leanExtra = 0, scale = 1,
  } = o;
  const p = typeof pose === 'string' ? (POSES[pose] || POSES.idle) : pose;
  const hr = H * 0.10;            // head radius — source ≈ 0.09–0.11 of H
  const torsoH = H * 0.30, torsoW = H * 0.18;
  const armW = H * 0.034, legW = H * 0.038, jR = H * 0.028;
  const limbCol = mix(skin, '#FFFFFF', 0.15);
  const lean = (p.lean || 0) + leanExtra;

  ctx.save(); ctx.globalAlpha *= alpha;
  contactShadow(ctx, x, y, torsoW * 1.4, 0.4);
  ctx.translate(x, y); ctx.scale(facing * scale, scale);

  // body origin at pelvis
  const pelvisY = -H * 0.42;
  ctx.translate(0, pelvisY);
  ctx.rotate(lean);

  // legs from pelvis
  const hipSpread = torsoW * 0.28;
  const legLen = H * 0.38;
  const drawLeg = (side, hipA, knA) => {
    const hx = side * hipSpread, hy = H * 0.02;
    const knee = angPt(hx, hy, hipA, legLen * 0.48);
    const foot = angPt(knee[0], knee[1], knA, legLen * 0.52);
    limbSeg(ctx, [hx, hy], knee, legW, pants);
    limbSeg(ctx, knee, foot, legW * 0.92, pants);
    joint(ctx, hx, hy, jR * 0.85, limbCol);
    joint(ctx, knee[0], knee[1], jR * 0.75, limbCol);
    // shoe
    ctx.beginPath(); ctx.ellipse(foot[0] + side * H * 0.01, foot[1] + H * 0.008, H * 0.028, H * 0.012, 0, 0, TAU);
    ctx.fillStyle = mix(pants, '#000', 0.3); ctx.fill();
    return foot;
  };
  if (!dress) {
    drawLeg(-1, p.hipL, p.knL);
    drawLeg(1, p.hipR, p.knR);
  } else {
    // dress: big triangle / trapezoid skirt (waltz follow 0594 t91)
    const skirtTop = H * 0.02, skirtBot = H * 0.40, skirtW = H * (typeof dress === 'number' ? dress : 0.42);
    ctx.beginPath();
    ctx.moveTo(-torsoW * 0.35, skirtTop); ctx.lineTo(torsoW * 0.35, skirtTop);
    ctx.lineTo(skirtW, skirtBot); ctx.lineTo(-skirtW, skirtBot); ctx.closePath();
    ctx.fillStyle = typeof dress === 'string' ? dress : P.pink; ctx.fill();
    // tiny feet peek
    ctx.fillStyle = P.ink; ctx.beginPath(); ctx.ellipse(-H * 0.04, skirtBot + 2, H * 0.02, H * 0.01, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(H * 0.05, skirtBot + 2, H * 0.02, H * 0.01, 0, 0, TAU); ctx.fill();
  }

  // torso block
  const ty = -torsoH;
  roundRect(ctx, -torsoW / 2, ty, torsoW, torsoH, torsoW * 0.18);
  const tg = ctx.createLinearGradient(-torsoW / 2, ty, torsoW / 2, ty);
  tg.addColorStop(0, mix(shirt, '#fff', 0.18)); tg.addColorStop(0.55, shirt); tg.addColorStop(1, mix(shirt, '#000', 0.18));
  ctx.fillStyle = tg; ctx.fill();
  if (suspenders) {
    ctx.strokeStyle = rgba(P.white, 0.85); ctx.lineWidth = H * 0.012;
    ctx.beginPath(); ctx.moveTo(-torsoW * 0.22, ty + 4); ctx.lineTo(-torsoW * 0.08, ty + torsoH - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(torsoW * 0.22, ty + 4); ctx.lineTo(torsoW * 0.08, ty + torsoH - 4); ctx.stroke();
  }
  if (bowtie) {
    ctx.fillStyle = P.white; roundRect(ctx, -torsoW * 0.2, ty + torsoH * 0.08, torsoW * 0.4, torsoH * 0.12, 2); ctx.fill();
    ctx.fillStyle = P.ink;
    ctx.beginPath(); ctx.moveTo(-H * 0.025, ty + torsoH * 0.14); ctx.lineTo(0, ty + torsoH * 0.08); ctx.lineTo(0, ty + torsoH * 0.2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(H * 0.025, ty + torsoH * 0.14); ctx.lineTo(0, ty + torsoH * 0.08); ctx.lineTo(0, ty + torsoH * 0.2); ctx.fill();
  }

  // arms
  const shY = ty + torsoH * 0.12;
  const armLen = H * 0.28;
  const drawArm = (side, sA, eA) => {
    const sx = side * torsoW * 0.52, sy = shY;
    const el = angPt(sx, sy, sA, armLen * 0.48);
    const hd = angPt(el[0], el[1], eA, armLen * 0.52);
    limbSeg(ctx, [sx, sy], el, armW, limbCol);
    limbSeg(ctx, el, hd, armW * 0.9, limbCol);
    const jc = hit > 0 ? mix(P.gold, limbCol, 1 - hit) : limbCol;
    joint(ctx, sx, sy, jR, jc);
    joint(ctx, el[0], el[1], jR * 0.85, jc);
    joint(ctx, hd[0], hd[1], jR * 0.7, jc);
    if (hit > 0) glowPool(ctx, el[0], el[1], jR * 6, P.gold, 0.35 * hit);
    return hd;
  };
  const handL = drawArm(-1, p.LS, p.LE);
  const handR = drawArm(1, p.RS, p.RE);

  // head
  const hx = 0, hy = ty - hr * 0.95 + (p.head || 0) * hr;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(p.head || 0);
  // shade disc then lit
  ctx.beginPath(); ctx.arc(-hr * 0.06, hr * 0.06, hr, 0, TAU); ctx.fillStyle = mix(skin, '#000', 0.18); ctx.fill();
  const hg = ctx.createRadialGradient(-hr * 0.3, -hr * 0.35, hr * 0.1, 0, 0, hr);
  hg.addColorStop(0, mix(skin, '#fff', 0.25)); hg.addColorStop(1, skin);
  ctx.beginPath(); ctx.arc(0, 0, hr * 0.97, 0, TAU); ctx.fillStyle = hg; ctx.fill();
  // hair / hat
  if (hair === 'cap') {
    ctx.beginPath(); ctx.arc(0, -hr * 0.15, hr * 0.95, Math.PI, TAU); ctx.fillStyle = hatColor; ctx.fill();
    ctx.fillRect(-hr * 0.95, -hr * 0.2, hr * 1.9, hr * 0.22);
  } else if (hair === 'bob') {
    ctx.beginPath(); ctx.arc(0, 0, hr * 1.05, 0.15, Math.PI - 0.15); ctx.fillStyle = hatColor; ctx.fill();
    ctx.beginPath(); ctx.arc(-hr * 0.7, hr * 0.15, hr * 0.35, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(hr * 0.7, hr * 0.15, hr * 0.35, 0, TAU); ctx.fill();
  } else if (hair === 'fedora') {
    // brim
    ctx.beginPath(); ctx.ellipse(0, -hr * 0.05, hr * 1.35, hr * 0.22, 0, 0, TAU); ctx.fillStyle = hatColor; ctx.fill();
    // crown
    roundRect(ctx, -hr * 0.7, -hr * 1.15, hr * 1.4, hr * 0.95, hr * 0.2); ctx.fillStyle = hatColor; ctx.fill();
    ctx.fillStyle = mix(hatColor, P.accent, 0.35); ctx.fillRect(-hr * 0.72, -hr * 0.35, hr * 1.44, hr * 0.12);
  } else if (hair === 'tuft') {
    ctx.beginPath(); ctx.moveTo(-hr * 0.3, -hr * 0.6); ctx.quadraticCurveTo(0, -hr * 1.4, hr * 0.3, -hr * 0.6); ctx.fillStyle = hatColor; ctx.fill();
  }
  ctx.restore();

  ctx.restore(); // lean/translate
  // anchors
  return {
    head: [x, y + (pelvisY - torsoH - hr) * scale],
    headR: hr * scale,
    handL: [x + handL[0] * facing * scale, y + (pelvisY + handL[1]) * scale],
    handR: [x + handR[0] * facing * scale, y + (pelvisY + handR[1]) * scale],
    chest: [x, y + (pelvisY - torsoH * 0.4) * scale],
    H: H * scale,
  };
}

/** Tiny background dancer row (0594 t146). */
export function crowdRow(ctx, { x0, x1, y, H = 180, n = 12, seed = 3, shirt = P.purple, t = 0, hit = 0 } = {}) {
  const R = (() => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; }; })();
  const gap = (x1 - x0) / Math.max(1, n - 1);
  const out = [];
  for (let i = 0; i < n; i++) {
    const px = x0 + i * gap;
    const pose = (Math.floor(t * 2 + i) % 2 === 0) ? 'discoL' : 'discoR';
    const p = puppet(ctx, {
      x: px, y, H: H * (0.9 + R() * 0.2), pose, skin: mix(P.skin, P.skinDark, R() * 0.5),
      shirt: mix(shirt, P.pink, R() * 0.4), pants: '#1A1520', hair: 'cap', hatColor: '#1A1520',
      facing: R() > 0.5 ? 1 : -1, hit: hit * (0.5 + 0.5 * ((i + Math.floor(t * 4)) % 2)), alpha: 0.85,
    });
    out.push(p);
  }
  return out;
}
