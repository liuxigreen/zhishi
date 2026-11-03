// style-ink-land-v3 · STRUCTURE-v2 (LOCKED) · polish: caption system, match-morph transitions, faces
import {
  W, H, FPS, clamp, seg, ease, eout, ein, blit, cam, vignette, rng, mkCanvas
} from './helpers.js';
import * as WW from './worlds.js';

export { W, H, FPS };

const TIMES = [
  [0, 4], [4, 8], [8, 14], [14, 20], [20, 26], [26, 32],
  [32, 38], [38, 44], [44, 50], [50, 56], [56, 62],
  [62, 68], [68, 74], [74, 80], [80, 86], [86, 92],
  [92, 98], [98, 104], [104, 110], [110, 118], [118, 124], [124, 130]
];

const CAPS = [
  { parts: ['你说了五句对不起——', '她更冷了。'], m: -1 },
  { parts: ['她却更生气了。'], m: 0 },
  { parts: ['不是我——', '是猫碰的。'], m: 1 },
  { parts: ['长大后，猫换成了「堵车」。'], m: -1 },
  { parts: ['加班、临时会、手机没电……'], m: -1 },
  { parts: ['每个人，都备着一张。'], m: -1 },
  { parts: ['他以为：讲清楚', '＝负责。'], m: 1 },
  { parts: ['她听到的，', '是推责。'], m: 1 },
  { parts: ['每多一句原因，', '盾就厚一层。'], m: 1 },
  { parts: ['墙就高一层。'], m: -1 },
  { parts: ['原因越多，', '越像在辩护。'], m: 1 },
  { parts: ['两千年前，廉颇没带一个理由，', '只背荆条。'], m: -1 },
  { parts: ['只背来一捆荆条。'], m: -1 },
  { parts: ['一端是形象，', '一端是关系。'], m: 1 },
  { parts: ['心理学叫它印象管理——', '管的是自己。'], m: 1, sub: '据 Schlenker · 简化模型' },
  { parts: ['他擦亮了自己，'], m: -1, beat2: { parts: ['没看见身后的她。'], m: 0 } },
  { parts: ['护的是形象，', '不是关系。'], m: 1 },
  { parts: ['原因不会消失，', '只会顺流而下。'], m: -1 },
  { parts: ['她等的，从来不是原因。'], m: -1 },
  { parts: ['话越长，', '路越远。'], m: 1 },
  { parts: ['解释越多，诚意越薄。'], m: -1, breath: true },
  { parts: ['你上次道歉，', '先说了原因，还是先认了错？'], m: -1 }
];

const BUILDERS = [
  WW.W01_dinner, WW.W02_teacup, WW.W03_childhood, WW.W04_slipMicro, WW.W05_bambooMail, WW.W06_crowd,
  WW.W07_dinnerRevisit, WW.W08_battlefield, WW.W09_shieldCut, WW.W10_greatWall, WW.W11_courtroom,
  WW.W12_lianpoGate, WW.W13_xiangJiangHe, WW.W14_scale, WW.W15_mirrorHall, WW.W16_mirrorCorridor,
  WW.W17_shatter, WW.W18_river, WW.W19_redRope, WW.W20_rainStreet, WW.W21_emptyTable, WW.W22_handscroll
];

// camera path by absolute time — continuous one-take feel
function camAt(t) { const c = camRaw(t); const z = Math.max(1, c.z), hw = W / 2 / z, hh = H / 2 / z;
  return { z, cx: clamp(c.cx, hw, W - hw), cy: clamp(c.cy, hh, H - hh) }; }
function camRaw(t) {
  // gentle push/pull/pan; transitions amplify via shot-local morph
  if (t < 4) return { z: 1 + .08 * ease(t / 4), cx: 960, cy: 540 };
  if (t < 8) return { z: 1.4 + 1.2 * ease((t - 4) / 4), cx: 1200, cy: 720 }; // dive into tea
  if (t < 14) return { z: 1.05, cx: 960, cy: 560 };
  if (t < 20) return { z: 1.2 + .3 * ease((t - 14) / 6), cx: 960, cy: 500 }; // into slip
  if (t < 26) return { z: 1.0, cx: 960, cy: 540 };
  if (t < 32) return { z: 1.04 + .03 * Math.sin((t - 26) * 1.2), cx: 960, cy: 560 }; // crowd drift
  if (t < 38) return { z: 1.15, cx: 700, cy: 520 };
  if (t < 44) return { z: 1.1, cx: 1100, cy: 560 };
  if (t < 50) return { z: 1.4, cx: 960, cy: 480 }; // into shield rings
  if (t < 56) return { z: 1.0, cx: 960, cy: 540 };
  if (t < 62) return { z: 1.05, cx: 960, cy: 500 };
  if (t < 68) return { z: 1.0, cx: 700, cy: 560 };
  if (t < 74) return { z: 1.1, cx: 960, cy: 540 };
  if (t < 80) return { z: .95, cx: 960, cy: 500 };
  if (t < 86) return { z: 1.2, cx: 960, cy: 480 };
  if (t < 92) return { z: 1.22, cx: 920, cy: 500 };
  if (t < 92.5) return { z: 1.0, cx: 960, cy: 540 }; // black
  if (t < 98) return { z: 1.05, cx: 960, cy: 540 };
  if (t < 104) return { z: 1.0, cx: 960, cy: 560 };
  if (t < 110) return { z: 1.5, cx: 960, cy: 520 }; // rope close
  if (t < 118) return { z: 1.05, cx: 960, cy: 560 };
  if (t < 124) return { z: 1.0, cx: 960, cy: 540 };
  return { z: .75 + .1 * ease((t - 124) / 6), cx: 960, cy: 540 }; // pull to scroll
}


// ---------- transitions: prop-continuous match morphs (last element of N → first of N+1) ----------
const ss = k => k * k * k * (k * (k * 6 - 15) + 10); // smootherstep
const TR = [
  /*W01→02*/ { k: 'push', a: [1200, 720], b: [960, 540], r0: 60, S: 9 },      // her teacup → tea surface
  /*W02→03*/ { k: 'push', a: [960, 540], b: [960, 600], r0: 120, S: 4 },      // ripple → cracked vase
  /*W03→04*/ { k: 'push', a: [960, 600], b: [900, 540], r0: 110, S: 4 },      // vase crack → 堵 stroke
  /*W04→05*/ { k: 'push', a: [900, 540], b: [970, 580], r0: 140, S: 3 },      // stroke fibre → slip in thread
  /*W05→06*/ { k: 'pull', a: [960, 540], b: [890, 545], r1: 40 },             // thread shrinks into one crowd slip
  /*W06→07*/ { k: 'pull', a: [960, 540], b: [830, 530], r1: 70 },             // crowd shrinks into his sleeve slips
  /*W07→08*/ { k: 'push', a: [830, 530], b: [960, 560], r0: 70, S: 6 },       // slips → spears field
  /*W08→09*/ { k: 'push', a: [1480, 720], b: [960, 500], r0: 200, S: 4 },     // 怒 shield → cut rings
  /*W09→10*/ { k: 'push', a: [960, 540], b: [960, 560], r0: 220, S: 2.5 },    // rings → wall courses
  /*W10→11*/ { k: 'wipe' },
  /*W11→12*/ { k: 'push', a: [960, 110], b: [960, 280], r0: 160, S: 1.6 },    // 明镜高悬 plaque → 蔺府 plaque
  /*W12→13*/ { k: 'push', a: [960, 520], b: [960, 780], r0: 130, S: 3 },      // gate door → wine jar
  /*W13→14*/ { k: 'push', a: [960, 710], b: [1520, 548], r0: 90, S: 3 },      // red knot → rope coil on pan
  /*W14→15*/ { k: 'push', a: [400, 390], b: [960, 490], r0: 120, S: 4 },      // portrait → gold mirror
  /*W15→16*/ { k: 'push', a: [960, 490], b: [960, 500], r0: 380, S: 2.2 },    // mirror → mirror corridor
  /*W16→17*/ { k: 'push', a: [960, 500], b: [960, 540], r0: 160, S: 2.5 },    // vanishing point → shatter
  /*W17→18*/ null,                                                             // special: black → cinnabar → moon
  /*W18→19*/ { k: 'push', a: [960, 720], b: [910, 510], r0: 160, S: 3 },      // river → rope knot in water
  /*W19→20*/ { k: 'rise' },
  /*W20→21*/ { k: 'push', a: [1600, 850], b: [1620, 180], r0: 70, S: 3 },     // puddle lamp → lantern
  /*W21→22*/ { k: 'pull', a: [960, 540], b: [900, 490], r1: 210 },            // table scene rolls into scroll
];
const toScr = (C, p) => [(p[0] - C.cx) * C.z + W / 2, (p[1] - C.cy) * C.z + H / 2];
let TMP, MASK;
function layer(ctx, cv, C, P = null, z = 1, A = null) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (P) { ctx.translate(P[0], P[1]); ctx.scale(z, z); ctx.translate(-A[0], -A[1]); }
  cam(ctx, C.z, C.cx, C.cy); ctx.drawImage(cv, 0, 0); ctx.restore();
}
// draw `fn` into TMP, keep it only inside a feathered disc (or wipe), composite onto ctx
function masked(ctx, fn, maskFn, alpha = 1) {
  if (!TMP) { TMP = mkCanvas(W, H); MASK = mkCanvas(W, H); }
  const t = TMP.getContext('2d'); t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = 'source-over'; t.globalAlpha = 1; t.clearRect(0, 0, W, H);
  fn(t); t.globalCompositeOperation = 'destination-in'; maskFn(t); t.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.drawImage(TMP, 0, 0); ctx.restore();
}
const disc = (P, r, fe = .35) => t => { const g = t.createRadialGradient(P[0], P[1], Math.max(0, r * (1 - fe)), P[0], P[1], r);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); t.fillStyle = g; t.fillRect(0, 0, W, H); };
const RF = 2600; // radius that covers the frame from any anchor
function transition(ctx, i, st, C, Cn, k) {
  const T = TR[i];
  if (T.k === 'push') { // dive into element a of N; N+1 grows out of it, anchor b lands where it belongs
    const A = toScr(C, T.a), B = toScr(Cn, T.b), P = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
    const zs = Math.pow(T.S, k), zn = Math.pow(T.S, k - 1), r = T.r0 * C.z * Math.pow(RF / (T.r0 * C.z), k);
    layer(ctx, st.self, C, P, zs, A);
    masked(ctx, t => layer(t, st.next, Cn, P, zn, B), disc(P, r)); return; }
  if (T.k === 'pull') { // N shrinks into element b of N+1
    const A = toScr(C, T.a), B = toScr(Cn, T.b), P = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
    const rr = T.r1 * Cn.z, S = RF / rr, zs = Math.pow(S, -k), zn = Math.pow(S, 1 - k), r = zs * (540 + 1300 * (1 - k) * (1 - k)); // disc stays inside the shrinking frame: no hard rectangle edge
    layer(ctx, st.next, Cn, P, zn, B);
    masked(ctx, t => layer(t, st.self, C, P, zs, A), disc(P, r, .3), 1 - ss(seg(k, .72, 1))); return; }
  if (T.k === 'wipe' || T.k === 'rise') { // soft scroll-wipe (no double exposure): horizontal or bottom-up
    const fe = 320, hz = T.k === 'wipe', e = (hz ? W : H) + fe - k * ((hz ? W : H) + 2 * fe);
    const d = 90 * k;
    layer(ctx, st.self, C, hz ? [W / 2 - d, H / 2] : [W / 2, H / 2 - d * .6], 1, [W / 2, H / 2]);
    masked(ctx, t => layer(t, st.next, Cn, hz ? [W / 2 + 90 - d, H / 2] : [W / 2, H / 2 + 54 - d * .6], 1, [W / 2, H / 2]), t => {
      const g = hz ? t.createLinearGradient(e, 0, e + fe, 0) : t.createLinearGradient(0, e, 0, e + fe);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); t.fillStyle = g; t.fillRect(0, 0, W, H); }); return; }
}

// ---------- caption system v3: one serif family, ink-on-paper band, wipe in/out at full opacity ----------
const FONT_MAIN = '600 66px NSerif', FONT_SUB = '500 34px NSerif';
const INK = [26, 26, 26], PAPER = [244, 238, 224], VER_L = [163, 32, 26];       // light mode
const GLOW = [244, 239, 230], NIGHT = [12, 10, 9], VER_D = [255, 140, 107];     // dark mode
const hex = c => `rgb(${c[0]},${c[1]},${c[2]})`;
const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
const lum = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const cr = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const LUT = new Float32Array(256).map((_, v) => lin(v));
const lumF = (r, g, b) => .2126 * LUT[r] + .7152 * LUT[g] + .0722 * LUT[b];
const DARK = new Set([16]);
let CAPSTATE = null;
if (typeof window !== 'undefined') window.__CAPLOG = window.__CAPLOG || [];
function capWindow(i, dur) { // [revealStart, revealEnd, hideStart, hideEnd] in shot-local seconds
  if (i === 16) return [0.55, 1.05, dur - 1.0, dur - 0.55];
  const r0 = 0.15; return [r0, r0 + 0.5, dur - 1.0, dur - 0.55];
}
function activeCap(cap, local, a0, h1) {
  // two-beat captions: first line lives until mid-shot; second line takes over with its own wipe-in
  if (!cap.beat2) return { cap, a0, a1: a0 + .5, h0: h1 - .45, h1, swap: false };
  const mid = (a0 + (h1 - .55)) / 2 + .6; // ~3.2s into a 6s shot
  if (local < mid) return { cap, a0, a1: a0 + .5, h0: mid - .45, h1: mid, swap: false };
  return { cap: { ...cap, ...cap.beat2 }, a0: mid, a1: mid + .5, h0: h1 - .45, h1, swap: true };
}
function drawCaption(ctx, i, local, dur, f) {
  const base = CAPS[i]; const win = capWindow(i, dur); const [wa0, , , wh1] = win;
  if (local < wa0 || local >= wh1) return;
  const { cap, a0, a1, h0, h1 } = activeCap(base, local, wa0, wh1);
  if (local < a0 || local >= h1) return;
  const dark = DARK.has(i);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.font = FONT_MAIN;
  const ws = cap.parts.map(t => ctx.measureText(t).width), tw = ws.reduce((a, b) => a + b, 0);
  const mBase = cap.sub ? 944 : 984, sBase = 1004;
  ctx.font = FONT_SUB; const sw = cap.sub ? ctx.measureText(cap.sub).width : 0;
  const bw = Math.max(tw, sw) + 96, bx = (W - bw) / 2, by = mBase - 74, bh = (cap.sub ? sBase + 20 : mBase + 26) - by;
  const tx0 = (W - tw) / 2;
  // wipe extents: brush-like reveal left→right, disperse left→right
  const pin = ss(seg(local, a0, a1)), pout = ss(seg(local, h0, h1));
  const fe = 70; const vx0 = bx - fe + pout * (bw + 2 * fe), vx1 = bx - fe + pin * (bw + 2 * fe);
  if (vx1 <= vx0) { ctx.restore(); return; }
  const clip = () => { ctx.beginPath(); ctx.moveTo(vx0 + 18, by - 20); ctx.lineTo(vx1 + 18, by - 20); ctx.lineTo(vx1 - 18, by + bh + 20); ctx.lineTo(vx0 - 18, by + bh + 20); ctx.closePath(); ctx.clip(); };
  const gx = Math.max(0, Math.floor(bx)), gy = Math.floor(by), gw = Math.min(W, Math.ceil(bw)), gh = Math.ceil(bh);
  const under = ctx.getImageData(gx, gy, gw, gh);
  const LEVELS = dark ? [.62, .74, .84, .92] : [.80, .88, .94, .985];
  const glyphs = dark ? [GLOW, VER_D] : [INK, VER_L];
  const gL = glyphs.map(c => lum(...c)), sL = lum(...(dark ? GLOW : [40, 52, 96]));
  let res = null;
  for (const A of LEVELS) {
    ctx.putImageData(under, gx, gy);
    ctx.save(); clip();
    const band = dark ? NIGHT : PAPER;
    ctx.fillStyle = `rgba(${band[0]},${band[1]},${band[2]},${A})`; ctx.shadowColor = `rgba(${band[0]},${band[1]},${band[2]},${A})`; ctx.shadowBlur = 28;
    ctx.beginPath(); ctx.roundRect(bx + 14, by + 8, bw - 28, bh - 16, 22); ctx.fill(); ctx.restore();
    // measure worst local background inside the visible text box (strict extreme, not mean)
    const tb = { x0: Math.max(tx0 - 6, vx0 - 18), x1: Math.min(tx0 + tw + 6, vx1 + 18), y0: mBase - 62, y1: (cap.sub ? sBase + 10 : mBase + 18) };
    const im = ctx.getImageData(gx, gy, gw, gh).data; let ext = dark ? 0 : 1, n = 0;
    // only pixels that are inside the slanted clip (glyphs never exist outside it), 2px inset for AA
    for (let y = Math.max(0, tb.y0 - gy); y < Math.min(gh, tb.y1 - gy); y += 1) {
      const sy = 18 - 36 * ((y + gy) - (by - 20)) / (bh + 40);
      const xa = Math.max(tx0 - 6, vx0 + sy + 2), xb = Math.min(tx0 + tw + 6, vx1 + sy - 2);
      for (let x = Math.max(0, Math.ceil(xa - gx)); x < Math.min(gw, Math.floor(xb - gx)); x += 1) {
      const o = (y * gw + x) * 4, L = lumF(im[o], im[o + 1], im[o + 2]); n++; if (dark ? L > ext : L < ext) ext = L; } }
    res = { A, bgL: ext, cMain: cr(gL[0], ext), cMark: cap.m >= 0 ? cr(gL[1], ext) : null, cSub: cap.sub ? cr(sL, ext) : null, n };
    if (Math.min(res.cMain, res.cMark ?? 99, res.cSub ?? 99) >= 5.0) break;
  }
  // glyphs
  ctx.save(); clip();
  let x = tx0; ctx.font = FONT_MAIN; ctx.lineJoin = 'round';
  cap.parts.forEach((t, k) => { const c = k === cap.m ? glyphs[1] : glyphs[0];
    if (dark) { ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(12,10,9,.92)'; ctx.strokeText(t, x, mBase); }
    ctx.fillStyle = hex(c); ctx.fillText(t, x, mBase); x += ws[k]; });
  if (cap.sub) { ctx.font = FONT_SUB; ctx.fillStyle = dark ? hex(GLOW) : 'rgb(40,52,96)'; ctx.fillText(cap.sub, (W - sw) / 2, sBase); }
  ctx.restore(); ctx.restore();
  if (typeof window !== 'undefined') window.__CAPLOG.push({ f, i, dark, vis: [Math.round(vx0), Math.round(vx1)], full: pin >= 1 && pout <= 0, ...res, bgL: +res.bgL.toFixed(4) });
}

function makeShot(i) {
  const [t0, t1] = TIMES[i];
  const id = `W${String(i + 1).padStart(2, '0')}`;
  return {
    id, t0, t1,
    async build() {
      const self = await BUILDERS[i]();
      let next = null, cinnabar = null;
      if (i < BUILDERS.length - 1) next = await BUILDERS[i + 1]();
      if (i === 16) cinnabar = await WW.W17b_cinnabar();
      return { self, next, cinnabar };
    },
    frame(ctx, lt, st, K) {
      const t = K.t, C = camAt(t), dur = t1 - t0, local = t - t0;
      CAPSTATE = { i, local, dur, f: K.f };
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (i === 15 && st.self && st.self.dyn) { // W16 animated corridor
        const cv = st.self.dyn(local);
        const T = TR[i]; const exitK = local > dur - 1.0 && st.next && T ? ss(clamp((local - (dur - 1.0)) / 1.0)) : 0;
        if (exitK > 0) { // wrap dyn canvas as self for the transition
          const pack = { self: cv, next: st.next }; transition(ctx, i, pack, C, camAt(t1), exitK); }
        else layer(ctx, cv, C);
        ctx.restore(); return;
      }
      if (i === 16) { // shatter → ink-black breath 92.0–92.5 → cinnabar → river (moon)
        ctx.fillStyle = '#0a0908'; ctx.fillRect(0, 0, W, H);
        if (t < 92.12) { // shards fly out as ink floods in (no white flash)
          const q = seg(t, 92, 92.12); layer(ctx, st.self, C, [W / 2, H / 2], 1 + q * .35, [W / 2, H / 2]);
          ctx.fillStyle = `rgba(10,9,8,${ss(q)})`; ctx.fillRect(0, 0, W, H);
        } else if (t >= 92.5) {
          const g = ss(seg(t, 92.5, 95)), k = ss(seg(t, 95, 97.6)), Cn = camAt(98);
          const M = toScr(Cn, [1500, 180]);
          if (k > 0) masked(ctx, x => layer(x, st.next, Cn), disc(M, 40 + Math.pow(RF / 40, k) * 40 - 40 + 1, .5));
          if (st.cinnabar && k < 1) { // cinnabar dot grows, then drifts up-right and becomes the moon
            const cx = 960 + (M[0] - 960) * k, cy = 540 + (M[1] - 540) * k, sc = (.25 + g * 1.6) * (1 - k * .75);
            const R = (10 + 70 * g) * (1 - k) + 38 * k; ctx.save(); ctx.globalAlpha = 1 - ss(seg(k, .55, 1));
            const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.6); gg.addColorStop(0, 'rgba(214,58,36,1)'); gg.addColorStop(.36, 'rgba(184,38,29,.95)'); gg.addColorStop(.42, 'rgba(150,30,22,.35)'); gg.addColorStop(1, 'rgba(120,20,15,0)');
            ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, R * 2.6, 0, 7); ctx.fill(); ctx.restore(); }
        }
        ctx.restore(); return;
      }
      const T = TR[i]; const exitK = local > dur - 1.0 && st.next && T ? ss(clamp((local - (dur - 1.0)) / 1.0)) : 0;
      if (exitK > 0) transition(ctx, i, st, C, camAt(t1), exitK);
      else layer(ctx, st.self, C);
      ctx.restore();
    }
  };
}
export const SHOTS = TIMES.map((_, i) => makeShot(i));

let GRAIN;
export async function ENV() {
  // light grain canvases
  GRAIN = [];
  for (let k = 0; k < 2; k++) {
    const c = mkCanvas(W, H), x = c.getContext('2d'), r = rng(9 + k);
    const id = x.createImageData(W, H), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 128 + (r() - .5) * 80; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    x.putImageData(id, 0, 0); GRAIN.push(c);
  }
  return { G: GRAIN };
}
export function POST(ctx, lt, sh, K) {
  vignette(ctx, .16);
  if (GRAIN) {
    ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .08;
    ctx.drawImage(GRAIN[K.f % GRAIN.length], 0, 0); ctx.restore();
  }
  // captions last: nothing (grain/vignette) is composited over the measured glyphs
  if (CAPSTATE && !(typeof location !== 'undefined' && /[?&]nocap=1/.test(location.search))) drawCaption(ctx, CAPSTATE.i, CAPSTATE.local, CAPSTATE.dur, CAPSTATE.f);
}
