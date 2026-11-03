// style-ink-land-v2 · STRUCTURE-v2 · 22 worlds · 130s · one-take continuous
import {
  W, H, FPS, clamp, seg, ease, eout, ein, blit, cam, drawCap, vignette, rng, mkCanvas
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
  { parts: ['你说了五句对不起——'], m: -1 },
  { parts: ['她却更生气了。'], m: 0 },
  { parts: ['不是我——', '是猫碰的。'], m: 1 },
  { parts: ['长大后，猫换成了「堵车」。'], m: -1 },
  { parts: ['加班、临时会、手机没电……'], m: -1 },
  { parts: ['每个人，都备着一张。'], m: -1 },
  { parts: ['他以为：讲清楚', '＝负责。'], m: 1 },
  { parts: ['她听到的，', '是推责。'], m: 1 },
  { parts: ['每多一句原因，'], m: -1 },
  { parts: ['墙就高一层。'], m: -1 },
  { parts: ['原因越多，', '越像在辩护。'], m: 1 },
  { parts: ['两千年前，廉颇没带一个理由，'], m: -1 },
  { parts: ['只背来一捆荆条。'], m: -1 },
  { parts: ['一端是形象，', '一端是关系。'], m: 1 },
  { parts: ['心理学叫它：印象管理'], m: -1, sub: '据 Schlenker · 简化模型' },
  { parts: ['他擦亮的，是自己的像。'], m: -1 },
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
function camAt(t) {
  // gentle push/pull/pan; transitions amplify via shot-local morph
  if (t < 4) return { z: 1 + .08 * ease(t / 4), cx: 960, cy: 540 };
  if (t < 8) return { z: 1.4 + 1.2 * ease((t - 4) / 4), cx: 1200, cy: 720 }; // dive into tea
  if (t < 14) return { z: 1.05, cx: 960, cy: 560 };
  if (t < 20) return { z: 1.2 + .3 * ease((t - 14) / 6), cx: 960, cy: 500 }; // into slip
  if (t < 26) return { z: 1.0, cx: 960, cy: 540 };
  if (t < 32) return { z: .85 + .05 * Math.sin((t - 26) * 2), cx: 960, cy: 560 }; // pull to crowd
  if (t < 38) return { z: 1.15, cx: 700, cy: 520 };
  if (t < 44) return { z: 1.1, cx: 1100, cy: 560 };
  if (t < 50) return { z: 1.4, cx: 960, cy: 480 }; // into shield rings
  if (t < 56) return { z: 1.0, cx: 960, cy: 540 };
  if (t < 62) return { z: 1.05, cx: 960, cy: 500 };
  if (t < 68) return { z: 1.0, cx: 700, cy: 560 };
  if (t < 74) return { z: 1.1, cx: 960, cy: 540 };
  if (t < 80) return { z: .95, cx: 960, cy: 500 };
  if (t < 86) return { z: 1.2, cx: 960, cy: 480 };
  if (t < 92) return { z: 1.35, cx: 960, cy: 500 };
  if (t < 92.5) return { z: 1.0, cx: 960, cy: 540 }; // black
  if (t < 98) return { z: 1.05, cx: 960, cy: 540 };
  if (t < 104) return { z: 1.0, cx: 960, cy: 560 };
  if (t < 110) return { z: 1.5, cx: 960, cy: 520 }; // rope close
  if (t < 118) return { z: 1.05, cx: 960, cy: 560 };
  if (t < 124) return { z: 1.0, cx: 960, cy: 540 };
  return { z: .75 + .1 * ease((t - 124) / 6), cx: 960, cy: 540 }; // pull to scroll
}

function makeShot(i) {
  const [t0, t1] = TIMES[i];
  const id = `W${String(i + 1).padStart(2, '0')}`;
  return {
    id, t0, t1,
    async build() {
      const self = await BUILDERS[i]();
      let next = null, cinnabar = null;
      // preload next for crossfade morph in last 1s
      if (i < BUILDERS.length - 1) next = await BUILDERS[i + 1]();
      if (i === 16) cinnabar = await WW.W17b_cinnabar(); // shatter shot needs black+cinnabar
      return { self, next, cinnabar };
    },
    frame(ctx, lt, st, K) {
      const t = K.t;
      const C = camAt(t);
      const dur = t1 - t0;
      const local = t - t0;
      // transition windows
      const exitK = local > dur - 1.0 ? ease((local - (dur - 1.0)) / 1.0) : 0;
      const enterK = local < 0.9 ? 1 - ease(local / 0.9) : 0; // residual from prev (visual settle)

      ctx.save();
      // special: shot 17 (index 16) ink-black breath
      if (i === 16) {
        // STRUCTURE: shatter flash → 92.0–92.5 ink-black breath → cinnabar → river
        if (t < 92.12) {
          cam(ctx, C.z * (1 + (t - 92) * 3), C.cx, C.cy);
          ctx.drawImage(st.self, 0, 0);
          // white flash overlay rising
          ctx.save(); ctx.globalAlpha = clamp((t - 92) / .12);
          ctx.fillStyle = '#f4efe6'; ctx.fillRect(-100, -100, W + 200, H + 200); ctx.restore();
        } else if (t < 92.5) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = '#0a0908'; ctx.fillRect(0, 0, W, H);
        } else {
          const k = ease(seg(t, 92.5, 98));
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = '#0a0908'; ctx.fillRect(0, 0, W, H);
          if (st.cinnabar) {
            ctx.save(); ctx.globalAlpha = 1;
            ctx.translate(960, 540); ctx.scale(.25 + k * 2.6, .25 + k * 2.6); ctx.translate(-960, -540);
            ctx.drawImage(st.cinnabar, 0, 0); ctx.restore();
          }
          if (st.next && k > .35) {
            ctx.save(); ctx.globalAlpha = clamp((k - .35) / .65);
            ctx.drawImage(st.next, 0, 0); ctx.restore();
          }
        }
        ctx.restore();
        const capA = t >= 92.5 ? eout(seg(t, 92.5, 94)) : 0;
        if (capA > 0) drawCap(ctx, CAPS[i].parts, CAPS[i].m, CAPS[i].sub, capA);
        return;
      }

      // default: draw self with camera; morph toward next in last second
      cam(ctx, C.z, C.cx, C.cy);

      if (exitK > 0 && st.next) {
        // morph strategies by shot index
        const kind = transitionKind(i);
        if (kind === 'push') {
          // scale up self, fade in next from center
          ctx.save(); ctx.translate(960, 540); ctx.scale(1 + exitK * 2.2, 1 + exitK * 2.2); ctx.translate(-960, -540);
          ctx.globalAlpha = 1 - exitK * .85; ctx.drawImage(st.self, 0, 0); ctx.restore();
          ctx.save(); ctx.globalAlpha = exitK; ctx.drawImage(st.next, 0, 0); ctx.restore();
        } else if (kind === 'pull') {
          ctx.save(); ctx.globalAlpha = 1 - exitK; ctx.drawImage(st.self, 0, 0); ctx.restore();
          ctx.save(); ctx.translate(960, 540); ctx.scale(.4 + .6 * exitK, .4 + .6 * exitK); ctx.translate(-960, -540);
          ctx.globalAlpha = exitK; ctx.drawImage(st.next, 0, 0); ctx.restore();
        } else if (kind === 'bleed') {
          ctx.drawImage(st.self, 0, 0);
          ctx.save();
          ctx.globalAlpha = exitK;
          ctx.beginPath();
          const R = exitK * 1400;
          ctx.ellipse(960, 540, R, R * .7, 0, 0, 7); ctx.clip();
          ctx.drawImage(st.next, 0, 0);
          ctx.restore();
        } else if (kind === 'flip') {
          // vertical wipe / reflection flip feel
          ctx.save(); ctx.globalAlpha = 1 - exitK; ctx.drawImage(st.self, 0, 0); ctx.restore();
          ctx.save(); ctx.translate(0, H * (1 - exitK)); ctx.globalAlpha = exitK; ctx.drawImage(st.next, 0, 0); ctx.restore();
        } else {
          // crossfade default
          ctx.save(); ctx.globalAlpha = 1 - exitK; ctx.drawImage(st.self, 0, 0); ctx.restore();
          ctx.save(); ctx.globalAlpha = exitK; ctx.drawImage(st.next, 0, 0); ctx.restore();
        }
      } else {
        ctx.drawImage(st.self, 0, 0);
        // settle: slight fade from black/prev at start
        if (enterK > 0 && i > 0) {
          ctx.save(); ctx.globalAlpha = enterK * .25; ctx.fillStyle = '#efe5cf'; ctx.fillRect(0, 0, W, H); ctx.restore();
        }
      }
      ctx.restore();

      // captions (screen space)
      let capA = 1;
      if (local < 0.4) capA = eout(local / 0.4);
      if (local > dur - 0.5) capA = 1 - ein((local - (dur - 0.5)) / 0.5);
      if (CAPS[i].breath && local > 1 && local < dur - 1) capA = 1;
      // hold breath still on W21 golden line
      if (i === 20 && local >= 1 && local <= 3) capA = 1;
      drawCap(ctx, CAPS[i].parts, CAPS[i].m, CAPS[i].sub, clamp(capA));
    }
  };
}

function transitionKind(i) {
  // map STRUCTURE transition types
  // push into: 1→2, 3→4, 8→9, 14→15
  if ([1, 3, 8, 14].includes(i)) return 'push';
  // pull out reveal: 4→5, 5→6, 13→14, 21→22
  if ([4, 5, 13, 21].includes(i)) return 'pull';
  // ink bleed: 0→1 (ink drop), 11→12 (plaque bleed), 16 handled special, 17→18 cinnabar→moon
  if ([0, 11, 17].includes(i)) return 'bleed';
  // flip/reflection: 19→20, 20→21
  if ([19, 20].includes(i)) return 'flip';
  return 'cross';
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
}
