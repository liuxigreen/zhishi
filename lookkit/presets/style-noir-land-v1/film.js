// style-noir-land-v1 · eyewitness-wrong-face STRUCTURE-v1 APPROVED
import { W, H, FPS, clamp, seg, ease, eout, ein, blit, cam, vignette, rng, mkCanvas, grain } from './helpers.js';
import * as WW from './worlds.js';
export { W, H, FPS };

const TIMES = [
  [0, 4], [4, 8], [8, 14], [14, 20], [20, 26], [26, 32],
  [32, 38], [38, 44], [44, 50], [50, 56], [56, 62],
  [62, 68], [68, 74], [74, 80], [80, 86], [86, 92],
  [92, 98], [98, 104], [104, 110], [110, 118], [118, 124], [124, 130]
];

// parts: caption segments; m = amber emphasis index (-1 none); sub = footnote
const CAPS = [
  { parts: ['她指着三号：就是他。', '可那晚，他人在别的城市。'], m: 0 },
  { parts: ['她越说越肯定，', '三号的手铐就扣得越紧。'], m: 1 },
  { parts: ['那晚路灯坏了一半，', '她只看见帽檐和一只手。'], m: 1 },
  { parts: ['她只记住了几格画面，', '脸那一格是空的。'], m: 1 },
  { parts: ['警察问：「他是不是很凶？」', '空格里，就长出了一张凶脸。'], m: 1 },
  { parts: ['第二天新闻放出嫌犯画像，', '她脑中的空格被这张脸填满。'], m: 1 },
  { parts: ['邻居一人补一句，', '那只手越说越像纹了身。'], m: 1 },
  { parts: ['1974年，同一段车祸录像，', '被问「撞碎」的人，估的车速更快。'], m: 1 },
  { parts: ['录像里没有碎玻璃，', '被问「撞碎」的人却说看见了。'], m: 1, sub: '据 Loftus & Palmer 1974 · 简化模型' },
  { parts: ['记忆不是存档：每打开一次，', '就被重写一次，旧字就淡了。'], m: 1 },
  { parts: ['她第二次站到玻璃前，', '五个人里只有三号戴着画像那顶帽子。'], m: 1 },
  { parts: ['警察一句「认对了」，', '她从「好像是」变成「绝对是」。'], m: 1 },
  { parts: ['五盘录音，一盘比一盘细节多，', '可那晚只发生过一次。'], m: 1 },
  { parts: ['陪审团信的不是车票，', '是她那句「我百分百确定」。'], m: 1 },
  { parts: ['心理学叫它「记忆重建」：', '每回想一次，就改写一次。'], m: 1, sub: '据 Loftus 1974 / Wells 1998 · 简化模型' },
  { parts: ['木槌落下，三号被关进铁门；', '他口袋里的车票，没人再看一眼。'], m: 1 },
  { parts: ['她没有撒谎。', '她记住的脸，是别人一句句拼给她的。'], m: 1 },
  { parts: ['真正抢包的人，', '正在另一条巷子里数钱。'], m: 1 },
  { parts: ['美国375起DNA翻案里，', '约七成有一位认错人的目击者。'], m: 1, sub: '据 Innocence Project 1989–2020' },
  { parts: ['他们平均被关了14年，', '三号走出来时，头发已经白了。'], m: 0 },
  { parts: ['最笃定的那张脸，', '也可能是别人递给你的。'], m: 0 },
  { parts: ['你记得最清楚的那一幕，', '有多少是别人后来告诉你的？'], m: 1 }
];

const BUILDERS = [
  WW.W01_lineup, WW.W02_reflection, WW.W03_alley, WW.W04_darkroom, WW.W05_lamp, WW.W06_tvwall,
  WW.W07_neighbors, WW.W08_lab1974, WW.W09_glass, WW.W10_archive, WW.W11_lineup2,
  WW.W12_corridor, WW.W13_tapes, WW.W14_court, WW.W15_crane, WW.W16_door,
  WW.W17_puzzle, WW.W18_otherAlley, WW.W19_wall375, WW.W20_prisonRain, WW.W21_emptyRoom, WW.W22_theater
];

function camAt(t) { const c = camRaw(t); const z = Math.max(1, c.z), hw = W / 2 / z, hh = H / 2 / z;
  return { z, cx: clamp(c.cx, hw, W - hw), cy: clamp(c.cy, hh, H - hh) }; }
function camRaw(t) {
  if (t < 4) return { z: 1 + .06 * ease(t / 4), cx: 960, cy: 540 };
  if (t < 8) return { z: 1.25 + .3 * ease((t - 4) / 4), cx: 1100, cy: 480 };
  if (t < 14) return { z: 1.05, cx: 1040, cy: 540 };
  if (t < 20) return { z: 1.15, cx: 900, cy: 480 };
  if (t < 26) return { z: 1.2, cx: 1000, cy: 560 };
  if (t < 32) return { z: 1.0, cx: 960, cy: 500 };
  if (t < 38) return { z: 1.05, cx: 960, cy: 520 };
  if (t < 44) return { z: 1.1, cx: 1100, cy: 480 };
  if (t < 50) return { z: 1.05, cx: 1200, cy: 560 };
  if (t < 56) return { z: 1.15, cx: 1400, cy: 520 };
  if (t < 62) return { z: 1.08, cx: 1100, cy: 500 };
  if (t < 68) return { z: 1.0 + .05 * Math.sin((t - 62) * 1.1), cx: 960, cy: 500 };
  if (t < 74) return { z: 1.05, cx: 960, cy: 480 };
  if (t < 80) return { z: 1.0, cx: 900, cy: 480 };
  if (t < 86) return { z: 1.1, cx: 1100, cy: 500 };
  if (t < 92) return { z: 1.2, cx: 960, cy: 540 };
  if (t < 92.5) return { z: 1.0, cx: 960, cy: 540 };
  if (t < 98) return { z: 1.05, cx: 960, cy: 540 };
  if (t < 104) return { z: 1.1, cx: 1100, cy: 560 };
  if (t < 110) return { z: 1.0, cx: 960, cy: 540 };
  if (t < 118) return { z: 1.08, cx: 1040, cy: 560 };
  if (t < 124) return { z: 1.0, cx: 960, cy: 540 };
  return { z: .78 + .08 * ease((t - 124) / 6), cx: 960, cy: 540 };
}

const ss = k => k * k * k * (k * (k * 6 - 15) + 10);
const TR = [
  { k: 'push', a: [1140, 380], b: [1480, 360], r0: 100, S: 4 },
  { k: 'push', a: [960, 120], b: [1290, 170], r0: 120, S: 3 },
  { k: 'push', a: [1040, 450], b: [580, 390], r0: 90, S: 4 },
  { k: 'push', a: [1600, 180], b: [1160, 260], r0: 100, S: 3 },
  { k: 'push', a: [620, 900], b: [960, 400], r0: 120, S: 3 },
  { k: 'wipe' },
  { k: 'push', a: [960, 930], b: [1080, 400], r0: 140, S: 2.5 },
  { k: 'push', a: [1080, 400], b: [450, 400], r0: 160, S: 2.5 },
  { k: 'push', a: [1490, 745], b: [1400, 520], r0: 120, S: 3 },
  { k: 'push', a: [1520, 540], b: [1180, 400], r0: 100, S: 3 },
  { k: 'push', a: [1180, 400], b: [960, 400], r0: 140, S: 2.5 },
  { k: 'push', a: [960, 300], b: [960, 380], r0: 80, S: 3 },
  { k: 'wipe' },
  { k: 'push', a: [630, 800], b: [1100, 180], r0: 100, S: 3 },
  { k: 'push', a: [1100, 160], b: [960, 540], r0: 120, S: 2.5 },
  null, // W16→17 ink black handled specially
  { k: 'push', a: [960, 540], b: [1100, 560], r0: 160, S: 2.5 },
  { k: 'wipe' },
  { k: 'push', a: [960, 540], b: [1040, 540], r0: 140, S: 2.5 },
  { k: 'push', a: [1100, 1000], b: [960, 540], r0: 80, S: 3 },
  { k: 'pull', a: [960, 540], b: [960, 340], r1: 220 }
];
const toScr = (C, p) => [(p[0] - C.cx) * C.z + W / 2, (p[1] - C.cy) * C.z + H / 2];
let TMP, MASK;
function layer(ctx, cv, C, P = null, z = 1, A = null) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (P) { ctx.translate(P[0], P[1]); ctx.scale(z, z); ctx.translate(-A[0], -A[1]); }
  cam(ctx, C.z, C.cx, C.cy); ctx.drawImage(cv, 0, 0); ctx.restore();
}
function masked(ctx, fn, maskFn, alpha = 1) {
  if (!TMP) { TMP = mkCanvas(W, H); MASK = mkCanvas(W, H); }
  const t = TMP.getContext('2d'); t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = 'source-over'; t.globalAlpha = 1; t.clearRect(0, 0, W, H);
  fn(t); t.globalCompositeOperation = 'destination-in'; maskFn(t); t.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.drawImage(TMP, 0, 0); ctx.restore();
}
const disc = (P, r, fe = .35) => t => { const g = t.createRadialGradient(P[0], P[1], Math.max(0, r * (1 - fe)), P[0], P[1], r);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); t.fillStyle = g; t.fillRect(0, 0, W, H); };
const RF = 2600;
function transition(ctx, i, st, C, Cn, k) {
  const T = TR[i];
  if (!T) { layer(ctx, st.self, C); return; }
  if (T.k === 'push') {
    const A = toScr(C, T.a), B = toScr(Cn, T.b), P = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
    const zs = Math.pow(T.S, k), zn = Math.pow(T.S, k - 1), r = T.r0 * C.z * Math.pow(RF / (T.r0 * C.z), k);
    layer(ctx, st.self, C, P, zs, A);
    masked(ctx, t => layer(t, st.next, Cn, P, zn, B), disc(P, r)); return;
  }
  if (T.k === 'pull') {
    const A = toScr(C, T.a), B = toScr(Cn, T.b), P = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
    const rr = T.r1 * Cn.z, S = RF / rr, zs = Math.pow(S, -k), zn = Math.pow(S, 1 - k), r = zs * (540 + 1300 * (1 - k) * (1 - k));
    layer(ctx, st.next, Cn, P, zn, B);
    masked(ctx, t => layer(t, st.self, C, P, zs, A), disc(P, r, .3), 1 - ss(seg(k, .72, 1))); return;
  }
  if (T.k === 'wipe' || T.k === 'rise') {
    const fe = 320, hz = T.k === 'wipe', e = (hz ? W : H) + fe - k * ((hz ? W : H) + 2 * fe);
    const d = 90 * k;
    layer(ctx, st.self, C, hz ? [W / 2 - d, H / 2] : [W / 2, H / 2 - d * .6], 1, [W / 2, H / 2]);
    masked(ctx, t => layer(t, st.next, Cn, hz ? [W / 2 + 90 - d, H / 2] : [W / 2, H / 2 + 54 - d * .6], 1, [W / 2, H / 2]), t => {
      const g = hz ? t.createLinearGradient(e, 0, e + fe, 0) : t.createLinearGradient(0, e, 0, e + fe);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); t.fillStyle = g; t.fillRect(0, 0, W, H); }); return;
  }
}

// noir captions: warm white + ink outline on dark band; amber on emphasis; wipe in/out
const FONT_MAIN = '600 66px NSerif', FONT_SUB = '500 34px NSerif';
const WHITE = [246, 241, 232], AMBC = [255, 196, 110], NIGHT = [4, 6, 9];
const hex = c => `rgb(${c[0]},${c[1]},${c[2]})`;
const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
const lum = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const cr = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const LUT = Float32Array.from({ length: 256 }, (_, v) => lin(v));
const lumF = (r, g, b) => .2126 * LUT[r] + .7152 * LUT[g] + .0722 * LUT[b];
let CAPSTATE = null;
if (typeof window !== 'undefined') window.__CAPLOG = window.__CAPLOG || [];
function capWindow(i, dur) {
  if (i === 16) return [0.55, 1.05, dur - 1.0, dur - 0.55];
  const r0 = 0.15; return [r0, r0 + 0.5, dur - 1.0, dur - 0.55];
}
function drawCaption(ctx, i, local, dur, f) {
  const cap = CAPS[i]; const [a0, a1, h0, h1] = capWindow(i, dur);
  if (local < a0 || local >= h1) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.font = FONT_MAIN;
  const ws = cap.parts.map(t => ctx.measureText(t).width), tw = ws.reduce((a, b) => a + b, 0);
  const mBase = cap.sub ? 944 : 984, sBase = 1004;
  ctx.font = FONT_SUB; const sw = cap.sub ? ctx.measureText(cap.sub).width : 0;
  const bw = Math.max(tw, sw) + 96, bx = (W - bw) / 2, by = mBase - 74, bh = (cap.sub ? sBase + 20 : mBase + 26) - by;
  const tx0 = (W - tw) / 2;
  const pin = ss(seg(local, a0, a1)), pout = ss(seg(local, h0, h1));
  const fe = 70; const vx0 = bx - fe + pout * (bw + 2 * fe), vx1 = bx - fe + pin * (bw + 2 * fe);
  if (vx1 <= vx0) { ctx.restore(); return; }
  const clip = () => { ctx.beginPath(); ctx.moveTo(vx0 + 18, by - 20); ctx.lineTo(vx1 + 18, by - 20); ctx.lineTo(vx1 - 18, by + bh + 20); ctx.lineTo(vx0 - 18, by + bh + 20); ctx.closePath(); ctx.clip(); };
  const gx = Math.max(0, Math.floor(bx)), gy = Math.floor(by), gw = Math.min(W, Math.ceil(bw)), gh = Math.ceil(bh);
  const under = ctx.getImageData(gx, gy, gw, gh);
  const LEVELS = [.62, .74, .84, .92, .97];
  const gL = [lum(...WHITE), lum(...AMBC)], sL = lum(...WHITE);
  let res = null;
  for (const A of LEVELS) {
    ctx.putImageData(under, gx, gy);
    ctx.save(); clip();
    ctx.fillStyle = `rgba(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]},${A})`; ctx.shadowColor = `rgba(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]},${A})`; ctx.shadowBlur = 28;
    ctx.beginPath(); ctx.roundRect(bx + 14, by + 8, bw - 28, bh - 16, 22); ctx.fill(); ctx.restore();
    const tb = { x0: Math.max(tx0 - 6, vx0 - 18), x1: Math.min(tx0 + tw + 6, vx1 + 18), y0: mBase - 62, y1: (cap.sub ? sBase + 10 : mBase + 18) };
    const im = ctx.getImageData(gx, gy, gw, gh).data; let ext = 0, n = 0;
    for (let y = Math.max(0, tb.y0 - gy); y < Math.min(gh, tb.y1 - gy); y += 1) {
      const sy = 18 - 36 * ((y + gy) - (by - 20)) / (bh + 40);
      const xa = Math.max(tx0 - 6, vx0 + sy + 2), xb = Math.min(tx0 + tw + 6, vx1 + sy - 2);
      for (let x = Math.max(0, Math.ceil(xa - gx)); x < Math.min(gw, Math.floor(xb - gx)); x += 1) {
        const o = (y * gw + x) * 4, L = lumF(im[o], im[o + 1], im[o + 2]); n++; if (L > ext) ext = L; }
    }
    res = { A, bgL: ext, cMain: cr(gL[0], ext), cMark: cap.m >= 0 ? cr(gL[1], ext) : null, cSub: cap.sub ? cr(sL, ext) : null, n };
    if (Math.min(res.cMain, res.cMark ?? 99, res.cSub ?? 99) >= 5.0) break;
  }
  ctx.save(); clip();
  let x = tx0; ctx.font = FONT_MAIN; ctx.lineJoin = 'round';
  cap.parts.forEach((t, k) => {
    const c = k === cap.m ? AMBC : WHITE;
    ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(3,4,6,.92)'; ctx.strokeText(t, x, mBase);
    ctx.fillStyle = hex(c); ctx.fillText(t, x, mBase); x += ws[k];
  });
  if (cap.sub) { ctx.font = FONT_SUB; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(3,4,6,.92)'; ctx.strokeText(cap.sub, (W - sw) / 2, sBase); ctx.fillStyle = 'rgba(230,224,214,.92)'; ctx.fillText(cap.sub, (W - sw) / 2, sBase); }
  ctx.restore(); ctx.restore();
  if (typeof window !== 'undefined') window.__CAPLOG.push({ f, i, dark: true, vis: [Math.round(vx0), Math.round(vx1)], full: pin >= 1 && pout <= 0, ...res, bgL: +res.bgL.toFixed(4) });
}

function makeShot(i) {
  const [t0, t1] = TIMES[i];
  const id = `W${String(i + 1).padStart(2, '0')}`;
  return {
    id, t0, t1,
    async build() {
      const self = await BUILDERS[i]();
      let next = null;
      if (i < BUILDERS.length - 1) next = await BUILDERS[i + 1]();
      return { self, next };
    },
    frame(ctx, lt, st, K) {
      const t = K.t, C = camAt(t), dur = t1 - t0, local = t - t0;
      CAPSTATE = { i, local, dur, f: K.f };
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (i === 16) { // puzzle after ink-black 92.0–92.5
        ctx.fillStyle = '#050608'; ctx.fillRect(0, 0, W, H);
        if (t < 92.12) {
          const q = seg(t, 92, 92.12); layer(ctx, st.self, C, [W / 2, H / 2], 1 + q * .2, [W / 2, H / 2]);
          ctx.fillStyle = `rgba(5,6,8,${ss(q)})`; ctx.fillRect(0, 0, W, H);
        } else if (t >= 92.5) {
          const g = ss(seg(t, 92.5, 94.5));
          layer(ctx, st.self, C);
          ctx.fillStyle = `rgba(5,6,8,${1 - g})`; ctx.fillRect(0, 0, W, H);
          const T = TR[i]; const exitK = local > dur - 1.0 && st.next && T ? ss(clamp((local - (dur - 1.0)) / 1.0)) : 0;
          if (exitK > 0) transition(ctx, i, st, C, camAt(t1), exitK);
        }
        ctx.restore(); return;
      }
      // W16 door: fade to black at end of shot (approaching 92)
      if (i === 15) {
        const T = TR[i]; const exitK = local > dur - 1.0 && st.next ? ss(clamp((local - (dur - 1.0)) / 1.0)) : 0;
        // actually TR[15] is null — fade self to black near end
        layer(ctx, st.self, C);
        const fade = ss(seg(local, dur - 0.55, dur));
        if (fade > 0) { ctx.fillStyle = `rgba(5,6,8,${fade})`; ctx.fillRect(0, 0, W, H); }
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
  GRAIN = [];
  for (let k = 0; k < 2; k++) {
    const c = mkCanvas(W, H), x = c.getContext('2d'), r = rng(9 + k);
    const id = x.createImageData(W, H), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() - .5) * 80; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    x.putImageData(id, 0, 0); GRAIN.push(c);
  }
  return { G: GRAIN };
}
export function POST(ctx, lt, sh, K) {
  vignette(ctx, .18);
  if (GRAIN) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07; ctx.drawImage(GRAIN[K.f % GRAIN.length], 0, 0); ctx.restore(); }
  if (CAPSTATE && !(typeof location !== 'undefined' && /[?&]nocap=1/.test(location.search))) drawCaption(ctx, CAPSTATE.i, CAPSTATE.local, CAPSTATE.dur, CAPSTATE.f);
}
