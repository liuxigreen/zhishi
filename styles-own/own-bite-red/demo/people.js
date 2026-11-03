/** people.js — Bite Red Queen DATA-BODY.
 * Target: redqueen 01-t0004 runner — filled glowing human pictogram
 * (wide torso, neck, shoulders, thick tapering limbs). NOT a stick.
 */
import { P, hexRgb } from './look.js';

const TAU = Math.PI * 2;

function ang(deg) { return (deg * Math.PI) / 180; }

/** Capsule along a segment. */
function cap(ctx, x0, y0, x1, y1, r) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1e-6;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;
  ctx.moveTo(x0 + px * r, y0 + py * r);
  ctx.arc(x0, y0, r, Math.atan2(py, px), Math.atan2(-py, -px), false);
  ctx.lineTo(x1 - px * r, y1 - py * r);
  ctx.arc(x1, y1, r, Math.atan2(-py, -px), Math.atan2(py, px), false);
  ctx.closePath();
}

/**
 * Build a running / standing pictogram.
 * Local space: hip at (0,0), +y down, facing +1 = right.
 * Returns joint map in local px (unscaled).
 */
function build(pose, facing) {
  const f = facing >= 0 ? 1 : -1;
  const lean = pose.lean ?? 0;         // 0..1
  const a = pose.liftL ?? 0;           // leg A phase -1..1 (+ = forward)
  const b = pose.liftR ?? 0;
  const arm = pose.armSwing ?? 0;
  const look = pose.lookUp ?? 0;
  const sit = pose.sit ?? 0;

  // torso lean in degrees toward facing
  const leanDeg = lean * 32 * f; // sprint ~32°
  const rad = ang(leanDeg);

  // hip
  const hip = [0, sit * 40];
  // shoulder = up the torso axis
  const torsoH = 95 - sit * 12;
  const sh = [
    hip[0] + Math.sin(rad) * torsoH,
    hip[1] - Math.cos(rad) * torsoH,
  ];
  // head
  const head = [
    sh[0] + Math.sin(rad) * (38 + look * 4) + look * 3 * f,
    sh[1] - Math.cos(rad) * (38 + look * 4) - look * 8,
  ];
  // neck mid
  const neck = [(sh[0] + head[0]) / 2, (sh[1] + head[1]) / 2 + 2];

  // shoulder / hip half-widths (perpendicular)
  const c = Math.cos(rad), s = Math.sin(rad);
  // perp to torso direction (sin, -cos) is (cos, sin)
  const shW = 40, hipW = 24;
  const shL = [sh[0] - c * shW, sh[1] - s * shW];
  const shR = [sh[0] + c * shW, sh[1] + s * shW];
  const hipL = [hip[0] - c * hipW, hip[1] - s * hipW];
  const hipR = [hip[0] + c * hipW, hip[1] + s * hipW];

  /** Leg: phase +1 forward. */
  function leg(phase) {
    // thigh angle from vertical-down, toward facing when phase+
    // canvas down = 90°. facing+ forward = toward 0° (right) → subtract.
    const thighSwing = phase * 50 + lean * 12; // degrees
    const tDeg = 90 - thighSwing * f;
    const thighLen = 78;
    const knee = [
      hip[0] + Math.cos(ang(tDeg)) * thighLen,
      hip[1] + Math.sin(ang(tDeg)) * thighLen,
    ];
    // knee bend: rear leg bends more
    const bend = 25 + Math.max(0, -phase) * 55 + Math.max(0, phase) * 20;
    const sDeg = tDeg + bend * f;
    const shinLen = 78;
    let foot = [
      knee[0] + Math.cos(ang(sDeg)) * shinLen,
      knee[1] + Math.sin(ang(sDeg)) * shinLen,
    ];
    if (foot[1] > 8) foot[1] = 8;
    return { knee, foot };
  }

  /** Arm: phase +1 = same-side forward (we pass opposite of leg). */
  function armOf(phase, shoulder) {
    // upper arm: phase+ goes BACK (running), phase- goes FORWARD
    // hanging down = 90°. Back (facing+) ≈ 90+40 = 130 for rear arm.
    const swing = -phase * 55 + lean * 8; // opposite to legs
    const uDeg = 90 + swing * f;
    const upperLen = 52;
    const elbow = [
      shoulder[0] + Math.cos(ang(uDeg)) * upperLen,
      shoulder[1] + Math.sin(ang(uDeg)) * upperLen,
    ];
    // elbow always bent ~80-100°
    const eBend = 85 + Math.abs(phase) * 15;
    // fold forearm toward forward-up when rear, toward body when front
    const fDeg = uDeg - eBend * f;
    const foreLen = 48;
    const wrist = [
      elbow[0] + Math.cos(ang(fDeg)) * foreLen,
      elbow[1] + Math.sin(ang(fDeg)) * foreLen,
    ];
    return { elbow, wrist };
  }

  const L = leg(a), R = leg(b);
  const AL = armOf(-arm, shL); // left shoulder
  const AR = armOf(arm, shR);

  return {
    hip, sh, head, neck, rad,
    shL, shR, hipL, hipR,
    Lknee: L.knee, Lfoot: L.foot,
    Rknee: R.knee, Rfoot: R.foot,
    Lelbow: AL.elbow, Lwrist: AL.wrist,
    Relbow: AR.elbow, Rwrist: AR.wrist,
  };
}

function paintBody(ctx, J, s, col, alpha, glow) {
  const X = (p) => p[0] * s;
  const Y = (p) => p[1] * s;

  // sizes tuned to redqueen 01-t0004 at s≈1.5
  const rHead = 15 * s;
  const rNeck = 9 * s;
  const rThigh = 15 * s;
  const rShin = 11 * s;
  const rUpper = 11 * s;
  const rFore = 9 * s;
  const rShCap = 15 * s;

  // contact shadow
  ctx.save();
  ctx.globalAlpha = 0.28 * glow * alpha;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 6 * s, 42 * s, 8 * s, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  const sil = (fat = 1) => {
    ctx.beginPath();
    // --- WIDE torso (trapezoid with rounded shoulders) ---
    const shL = [X(J.shL), Y(J.shL)];
    const shR = [X(J.shR), Y(J.shR)];
    const hipL = [X(J.hipL), Y(J.hipL)];
    const hipR = [X(J.hipR), Y(J.hipR)];
    // expand from torso center for bloom fat
    if (fat !== 1) {
      const cx = (shL[0] + shR[0] + hipL[0] + hipR[0]) / 4;
      const cy = (shL[1] + shR[1] + hipL[1] + hipR[1]) / 4;
      const ex = (p) => [cx + (p[0] - cx) * fat, cy + (p[1] - cy) * fat];
      const a = ex(shL), b = ex(shR), c = ex(hipR), d = ex(hipL);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(d[0], d[1]);
      ctx.closePath();
    } else {
      ctx.moveTo(shL[0], shL[1]);
      ctx.lineTo(shR[0], shR[1]);
      ctx.lineTo(hipR[0], hipR[1]);
      ctx.lineTo(hipL[0], hipL[1]);
      ctx.closePath();
    }
    // shoulder caps (deltoids)
    ctx.moveTo(X(J.shL) + rShCap * fat, Y(J.shL));
    ctx.arc(X(J.shL), Y(J.shL), rShCap * fat, 0, TAU);
    ctx.moveTo(X(J.shR) + rShCap * fat, Y(J.shR));
    ctx.arc(X(J.shR), Y(J.shR), rShCap * fat, 0, TAU);
    // neck
    cap(ctx, X(J.sh), Y(J.sh), X(J.neck), Y(J.neck), rNeck * fat);
    // head
    ctx.moveTo(X(J.head) + rHead * fat, Y(J.head));
    ctx.arc(X(J.head), Y(J.head), rHead * fat, 0, TAU);
    // legs (from hip corners slightly)
    cap(ctx, X(J.hip), Y(J.hip), X(J.Lknee), Y(J.Lknee), rThigh * fat);
    cap(ctx, X(J.Lknee), Y(J.Lknee), X(J.Lfoot), Y(J.Lfoot), rShin * fat);
    cap(ctx, X(J.hip), Y(J.hip), X(J.Rknee), Y(J.Rknee), rThigh * fat);
    cap(ctx, X(J.Rknee), Y(J.Rknee), X(J.Rfoot), Y(J.Rfoot), rShin * fat);
    // arms from shoulder caps
    cap(ctx, X(J.shL), Y(J.shL), X(J.Lelbow), Y(J.Lelbow), rUpper * fat);
    cap(ctx, X(J.Lelbow), Y(J.Lelbow), X(J.Lwrist), Y(J.Lwrist), rFore * fat);
    cap(ctx, X(J.shR), Y(J.shR), X(J.Relbow), Y(J.Relbow), rUpper * fat);
    cap(ctx, X(J.Relbow), Y(J.Relbow), X(J.Rwrist), Y(J.Rwrist), rFore * fat);
  };

  // soft bloom (source-like haze)
  ctx.save();
  ctx.shadowColor = col;
  ctx.shadowBlur = 36 * s * glow;
  ctx.globalAlpha = 0.55 * alpha * glow;
  ctx.fillStyle = col;
  sil(1.05);
  ctx.fill('nonzero');
  ctx.restore();

  // extra ring blooms
  for (let i = 4; i >= 1; i--) {
    ctx.save();
    ctx.globalAlpha = alpha * glow * (0.08 / i);
    ctx.fillStyle = col;
    sil(1 + i * 0.22);
    ctx.fill('nonzero');
    ctx.restore();
  }

  // solid core
  ctx.save();
  ctx.globalAlpha = 0.98 * alpha * glow;
  ctx.fillStyle = col;
  sil(1);
  ctx.fill('nonzero');
  ctx.restore();
}

function trails(ctx, J, s, col, facing, amt) {
  if (amt < 0.3) return;
  const f = facing >= 0 ? 1 : -1;
  for (let i = 1; i <= 5; i++) {
    const dx = -f * i * 18 * s * amt;
    ctx.save();
    ctx.globalAlpha = 0.11 * amt * (1 - i / 6);
    ctx.fillStyle = col;
    ctx.beginPath();
    // ghost torso
    ctx.moveTo(J.shL[0] * s + dx, J.shL[1] * s);
    ctx.lineTo(J.shR[0] * s + dx, J.shR[1] * s);
    ctx.lineTo(J.hipR[0] * s + dx, J.hipR[1] * s);
    ctx.lineTo(J.hipL[0] * s + dx, J.hipL[1] * s);
    ctx.closePath();
    ctx.moveTo(J.head[0] * s + dx + 14 * s, J.head[1] * s);
    ctx.arc(J.head[0] * s + dx, J.head[1] * s, 14 * s, 0, TAU);
    ctx.fill('nonzero');
    ctx.restore();
  }
}

export function stick(ctx, o = {}) {
  const s = o.s ?? 1;
  const f = o.facing ?? 1;
  const pose = o.pose || POSES.stand;
  const glow = pose.glow ?? (o.glow ?? 0.95);
  const col = o.color || P.red;
  const alpha = o.alpha ?? 1;
  const J = build(pose, f);

  ctx.save();
  ctx.translate(o.x, o.y);
  // lift so feet sit on y=0: feet max y
  const footY = Math.max(J.Lfoot[1], J.Rfoot[1], 0);
  ctx.translate(0, -footY * s);

  if (o.trail !== false) {
    const amt = Math.min(1, Math.abs(pose.lean ?? 0) * 0.95);
    trails(ctx, J, s, col, f, amt * glow);
  }
  paintBody(ctx, J, s, col, alpha, glow);

  if (typeof o.hold === 'function') {
    const wr = ((pose.armSwing ?? 0) * f > 0) ? J.Rwrist : J.Lwrist;
    o.hold(ctx, o.x + wr[0] * s, o.y + (wr[1] - footY) * s);
  }
  ctx.restore();
}

export function stickTiny(ctx, o = {}) {
  stick(ctx, {
    x: o.x, y: o.y,
    s: (o.s ?? 0.45) * 0.95,
    color: o.color || P.white,
    glow: o.glow ?? 0.75,
    trail: false,
    pose: { lean: 0.1, liftL: 0.25, liftR: -0.2, armSwing: 0.3, glow: o.glow ?? 0.75 },
  });
}

export function stairCrowd(ctx, o = {}) {
  const n = o.n ?? 8, gap = o.gap ?? 70, s = o.s ?? 0.55;
  const lit = o.lit ?? 2;
  for (let i = 0; i < n; i++) {
    stickTiny(ctx, {
      x: o.x + i * gap,
      y: o.y - i * (o.rise ?? 28),
      s,
      color: i === lit ? P.red : P.white,
      glow: i === lit ? 1 : 0.55,
    });
  }
}

export const POSES = {
  sprint: { lean: 0.92, liftL: 0.95, liftR: -0.9, armSwing: 1.0, glow: 1 },
  lean:   { lean: 0.5, liftL: 0.35, liftR: -0.25, armSwing: 0.45, glow: 0.92 },
  stand:  { lean: 0.05, liftL: 0.12, liftR: -0.1, armSwing: 0.1, glow: 0.85 },
  lookUp: { lean: 0.1, lookUp: 1, liftL: 0.1, liftR: -0.08, armSwing: -0.15, glow: 0.9 },
  sit:    { sit: 1, lean: 0.0, liftL: 0.5, liftR: -0.3, armSwing: -0.2, glow: 0.7 },
  fork:   { lean: -0.35, lookUp: 0.5, liftL: 0.4, liftR: 0.5, armSwing: -0.35, glow: 1 },
};

export const dataBody = stick;
