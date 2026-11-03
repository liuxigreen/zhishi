#!/usr/bin/env python3
"""Frame-level FX measurements for D9/D10/D11. Outputs JSON + prints summary."""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image

def load_gray(p: Path) -> np.ndarray:
    im = Image.open(p).convert('RGB')
    a = np.asarray(im, dtype=np.float32)
    # Rec.709 luma
    return 0.2126*a[...,0] + 0.7152*a[...,1] + 0.0722*a[...,2]

def load_rgb(p: Path) -> np.ndarray:
    return np.asarray(Image.open(p).convert('RGB'), dtype=np.float32)

def vignette(gray: np.ndarray) -> dict:
    h, w = gray.shape
    cy, cx = h//2, w//2
    # center 10% box
    ch, cw = max(1,h//10), max(1,w//10)
    center = gray[cy-ch:cy+ch, cx-cw:cx+cw].mean()
    # 4 corners 8% boxes
    kh, kw = max(1,h//12), max(1,w//12)
    corners = [
        gray[:kh,:kw].mean(), gray[:kh,-kw:].mean(),
        gray[-kh:,:kw].mean(), gray[-kh:,-kw:].mean()
    ]
    corner = float(np.mean(corners))
    ratio = corner / max(center, 1e-6)
    return {"center_luma": round(float(center),2), "corner_luma": round(corner,2),
            "corner_center_ratio": round(float(ratio),4)}

def radial_profile(gray: np.ndarray, cy=None, cx=None, max_r=None) -> dict:
    h, w = gray.shape
    if cy is None: cy = h//2
    if cx is None: cx = w//2
    if max_r is None: max_r = min(cy, cx, h-cy, w-cx)
    yy, xx = np.ogrid[:h, :w]
    r = np.sqrt((yy-cy)**2 + (xx-cx)**2).astype(np.int32)
    rflat = r.ravel(); gflat = gray.ravel()
    # mask to max_r
    m = rflat <= max_r
    rflat, gflat = rflat[m], gflat[m]
    sums = np.bincount(rflat, weights=gflat, minlength=max_r+1)
    counts = np.bincount(rflat, minlength=max_r+1)
    counts = np.maximum(counts, 1)
    prof = sums / counts
    # glow radius: falloff to 10% of peak (peak taken from r=0..5 mean)
    peak = float(prof[:max(3,len(prof)//40)].mean())
    thresh = 0.10 * peak
    glow_r = 0
    for i, v in enumerate(prof):
        if v < thresh:
            glow_r = i; break
    else:
        glow_r = int(max_r)
    # also 50% falloff
    thresh50 = 0.50 * peak
    r50 = 0
    for i, v in enumerate(prof):
        if v < thresh50:
            r50 = i; break
    else:
        r50 = int(max_r)
    return {"peak_luma": round(peak,2), "radius_10pct_px": int(glow_r),
            "radius_50pct_px": int(r50), "profile_step": [round(float(x),2) for x in prof[::max(1,len(prof)//32)]]}

def find_bright_center(gray: np.ndarray, thresh_pct=95) -> tuple:
    """Find centroid of brightest region (orb)."""
    thr = np.percentile(gray, thresh_pct)
    mask = gray >= thr
    ys, xs = np.where(mask)
    if len(xs)==0:
        return gray.shape[0]//2, gray.shape[1]//2
    return int(ys.mean()), int(xs.mean())

def speck_count(gray: np.ndarray, local_delta=25, max_area=12) -> dict:
    """Count small bright blobs via simple local-mean threshold + connected components (scipy-free)."""
    from collections import deque
    h, w = gray.shape
    # downsample for speed
    step = 2
    g = gray[::step, ::step]
    # local mean via box
    k = 7
    pad = np.pad(g, k, mode='edge')
    # integral image
    ii = np.cumsum(np.cumsum(pad,0),1)
    def box_mean(y,x):
        y0,x0=y,x; y1,x1=y+2*k+1,x+2*k+1
        s = ii[y1,x1]-ii[y0,x1]-ii[y1,x0]+ii[y0,x0]
        return s / ((2*k+1)**2)
    bright = np.zeros_like(g, dtype=bool)
    gh, gw = g.shape
    # vectorized-ish: compute local mean with uniform filter
    from numpy.lib.stride_tricks import sliding_window_view
    win = sliding_window_view(pad, (2*k+1, 2*k+1))
    local = win.mean(axis=(-1,-2))  # shape = g
    bright = (g - local) > local_delta
    # also require absolute brightness
    bright &= g > 40
    # connected components
    visited = np.zeros_like(bright)
    areas = []
    for y in range(gh):
        for x in range(gw):
            if not bright[y,x] or visited[y,x]: continue
            # BFS
            q = deque([(y,x)]); visited[y,x]=True; area=0
            while q:
                cy,cx = q.popleft(); area += 1
                for dy,dx in ((0,1),(0,-1),(1,0),(-1,0)):
                    ny,nx=cy+dy,cx+dx
                    if 0<=ny<gh and 0<=nx<gw and bright[ny,nx] and not visited[ny,nx]:
                        visited[ny,nx]=True; q.append((ny,nx))
            areas.append(area)
    small = [a for a in areas if a <= max_area]
    # scale area back (step^2)
    return {"specks_total": len(areas), "specks_small_le12": len(small),
            "areas_small": small[:50], "downsample": step}

def streak_horizontal_band(gray: np.ndarray) -> dict:
    """Detect horizontal streak energy: row-wise variance of mid-band after vertical blur removal."""
    h,w = gray.shape
    # look at mid vertical third, exclude very bright center circle
    y0,y1 = h//4, 3*h//4
    band = gray[y0:y1,:]
    # for each row, compute 1d high-pass (streaks are elongated horizontally)
    row_energy = []
    for row in band[::4]:
        # horizontal gradient magnitude mean
        g = np.abs(np.diff(row)).mean()
        row_energy.append(float(g))
    # also find brightest horizontal bands via row means
    row_means = band.mean(axis=1)
    # peaks above median+std
    med, std = float(np.median(row_means)), float(row_means.std())
    peak_rows = np.where(row_means > med + 0.8*std)[0]
    # cluster consecutive
    clusters=[]
    if len(peak_rows):
        start=peak_rows[0]; prev=peak_rows[0]
        for r in peak_rows[1:]:
            if r==prev+1: prev=r
            else:
                clusters.append((int(start+y0), int(prev+y0))); start=prev=r
        clusters.append((int(start+y0), int(prev+y0)))
    return {"n_streak_bands_est": len(clusters), "streak_y_ranges": clusters[:8],
            "row_grad_mean": round(float(np.mean(row_energy)),3)}

def center_luma_series(paths, scale_to_1080=True):
    series=[]
    for p in paths:
        g = load_gray(p)
        h,w = g.shape
        cy,cx = find_bright_center(g)
        # small center patch
        r=max(3, min(h,w)//40)
        patch = g[max(0,cy-r):cy+r, max(0,cx-r):cx+r]
        series.append({"file": p.name, "cy":cy, "cx":cx, "luma": round(float(patch.mean()),2),
                       "h":h,"w":w})
    return series

def measure_ring(gray: np.ndarray) -> dict:
    """Estimate halo ring radius via radial profile peak away from center."""
    cy,cx = find_bright_center(gray, 99)
    h,w = gray.shape
    max_r = min(cy,cx,h-cy,w-cx)-2
    yy,xx = np.ogrid[:h,:w]
    r = np.sqrt((yy-cy)**2+(xx-cx)**2).astype(np.int32)
    rflat=r.ravel(); gflat=gray.ravel()
    m=rflat<=max_r
    sums=np.bincount(rflat[m], weights=gflat[m], minlength=max_r+1)
    counts=np.bincount(rflat[m], minlength=max_r+1); counts=np.maximum(counts,1)
    prof=sums/counts
    # skip inner orb (first 15% of max_r)
    skip=int(0.12*max_r)
    outer=prof[skip:]
    if len(outer)==0:
        return {"ring_r_px": None}
    idx = int(np.argmax(outer))+skip
    # ring stroke width: FWHM around peak
    peak=prof[idx]
    half=peak*0.5
    lo=idx
    while lo>skip and prof[lo]>half: lo-=1
    hi=idx
    while hi<len(prof)-1 and prof[hi]>half: hi+=1
    # glow of ring: where falls to 10% of peak outward
    thr=peak*0.10
    glow_out=hi
    while glow_out<len(prof)-1 and prof[glow_out]>thr: glow_out+=1
    glow_in=lo
    while glow_in>skip and prof[glow_in]>thr: glow_in-=1
    return {"orb_center":[cy,cx], "ring_r_px": int(idx),
            "ring_stroke_fwhm_px": int(hi-lo),
            "ring_glow_out_px": int(glow_out-idx),
            "ring_glow_in_px": int(idx-glow_in),
            "ring_peak_luma": round(float(peak),2),
            "scale_note": f"source {w}x{h}; multiply px by {1080/h:.3f} for @1080"}

def track_streak_motion(paths, fps=30):
    """Track horizontal energy centroid shift across frames for streak speed."""
    centroids=[]
    for p in paths:
        g=load_gray(p)
        h,w=g.shape
        # take mid band, compute column-mean weighted by brightness above median
        y0,y1=h//3, 2*h//3
        band=g[y0:y1,:]
        col=band.mean(axis=0)
        # exclude center 20% (orb)
        x0,x1=int(0.4*w), int(0.6*w)
        weights=col.copy(); weights[x0:x1]=0
        # left and right separately
        left=weights[:w//2]; right=weights[w//2:]
        def cen(arr, offset=0):
            s=arr.sum()
            if s<1e-3: return None
            xs=np.arange(len(arr))
            return float((xs*arr).sum()/s)+offset
        centroids.append({"file":p.name, "left_cx":cen(left,0), "right_cx":cen(right,w//2),
                          "global_cx":cen(weights,0)})
    # speed from consecutive non-None
    speeds=[]
    for a,b in zip(centroids, centroids[1:]):
        if a["global_cx"] is not None and b["global_cx"] is not None:
            speeds.append((b["global_cx"]-a["global_cx"])*fps)
    return {"series": centroids[::max(1,len(centroids)//20)],
            "speed_px_s_median": round(float(np.median(speeds)),2) if speeds else None,
            "speed_px_s_mean": round(float(np.mean(speeds)),2) if speeds else None,
            "n_pairs": len(speeds)}

def opacity_fade(paths, roi=None):
    """Track mean luma in a ROI (default lower-third text area) for fade timing."""
    series=[]
    for p in paths:
        g=load_gray(p)
        h,w=g.shape
        if roi is None:
            y0,y1=int(0.72*h), int(0.92*h); x0,x1=int(0.2*w), int(0.8*w)
        else:
            y0,y1,x0,x1=roi
        series.append(float(g[y0:y1,x0:x1].mean()))
    return series

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--dir', required=True)
    ap.add_argument('--fps', type=float, default=30)
    ap.add_argument('--glob', default='f*.png')
    ap.add_argument('--every', type=int, default=1, help='sample every Nth frame')
    ap.add_argument('--out', default=None)
    ap.add_argument('--tasks', default='vignette,ring,radial,specks,streak,breathe,fade')
    args=ap.parse_args()
    d=Path(args.dir)
    paths=sorted(d.glob(args.glob))[::args.every]
    if not paths:
        paths=sorted(d.glob('*.png'))[::args.every]
    print(f'files={len(paths)} dir={d}', file=sys.stderr)
    tasks=set(args.tasks.split(','))
    out={"dir":str(d), "n_frames":len(paths), "fps":args.fps, "every":args.every}

    # single-frame geometry on middle frame
    mid=paths[len(paths)//2]
    g=load_gray(mid)
    h,w=g.shape
    scale_1080=1080/h
    out["source_wh"]=[w,h]
    out["scale_to_1080"]=round(scale_1080,4)

    if 'vignette' in tasks:
        out['vignette']=vignette(g)
        # also first/last
        out['vignette_first']=vignette(load_gray(paths[0]))
        out['vignette_last']=vignette(load_gray(paths[-1]))

    if 'ring' in tasks:
        out['ring']=measure_ring(g)
        # convert key px to 1080
        if out['ring'].get('ring_r_px'):
            out['ring_at_1080']={k: (round(v*scale_1080,1) if isinstance(v,(int,float)) and 'luma' not in k and k!='orb_center' else v)
                                 for k,v in out['ring'].items()}

    if 'radial' in tasks:
        cy,cx=find_bright_center(g,99)
        out['radial_orb']=radial_profile(g, cy, cx, max_r=min(h,w)//3)
        out['radial_orb_at_1080']={
            "radius_10pct_px": round(out['radial_orb']['radius_10pct_px']*scale_1080,1),
            "radius_50pct_px": round(out['radial_orb']['radius_50pct_px']*scale_1080,1),
            "peak_luma": out['radial_orb']['peak_luma']
        }

    if 'specks' in tasks:
        # measure on 3 frames: start mid end
        picks=[paths[0], mid, paths[-1]]
        out['specks']=[speck_count(load_gray(p)) for p in picks]

    if 'streak' in tasks:
        out['streak_static']=streak_horizontal_band(g)
        # motion every 3rd frame for speed
        sub=paths[::max(1, int(args.fps/10))]  # ~10 samples/s
        out['streak_motion']=track_streak_motion(sub, fps=args.fps)

    if 'breathe' in tasks:
        # sample ~10/s
        sub=paths[::max(1, int(args.fps/10))]
        series=center_luma_series(sub)
        lumas=[s['luma'] for s in series]
        out['breathe']={"series_luma": lumas, "n": len(lumas),
                        "min": round(min(lumas),2), "max": round(max(lumas),2),
                        "amp_pct": round(100*(max(lumas)-min(lumas))/max(np.mean(lumas),1e-6),2)}
        # rough period via autocorrelation
        x=np.array(lumas)-np.mean(lumas)
        if len(x)>10 and x.std()>0.5:
            ac=np.correlate(x,x,mode='full'); ac=ac[len(ac)//2:]
            # find first peak after lag 2
            peaks=[]
            for i in range(2, len(ac)-1):
                if ac[i]>ac[i-1] and ac[i]>=ac[i+1] and ac[i]>0.2*ac[0]:
                    peaks.append(i)
            dt=1.0/(args.fps/max(1,int(args.fps/10)))  # seconds per sample in series
            # actually sub step
            step=max(1, int(args.fps/10))
            sec_per=step/args.fps
            if peaks:
                out['breathe']['period_est_ms']=round(peaks[0]*sec_per*1000,1)
                out['breathe']['autocorr_peaks_samples']=peaks[:5]

    if 'fade' in tasks:
        sub=paths[::max(1,2)]
        series=opacity_fade(sub)
        out['text_roi_luma']= {"series":[round(v,2) for v in series[::max(1,len(series)//40)]],
                               "min":round(min(series),2),"max":round(max(series),2)}
        # detect rise: first frame above 20% of range from min
        mn,mx=min(series),max(series)
        thr=mn+0.2*(mx-mn)
        thr80=mn+0.8*(mx-mn)
        t20=t80=None
        for i,v in enumerate(series):
            if t20 is None and v>=thr: t20=i
            if t80 is None and v>=thr80: t80=i
        step=max(1,2)
        if t20 is not None and t80 is not None and t80>t20:
            out['text_fade_in_ms']=round((t80-t20)*step/args.fps*1000,1)

    text=json.dumps(out, ensure_ascii=False, indent=2)
    if args.out:
        Path(args.out).write_text(text)
        print(f'wrote {args.out}', file=sys.stderr)
    print(text)

if __name__=='__main__':
    main()
