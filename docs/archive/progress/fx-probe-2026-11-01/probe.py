import cv2, numpy as np, sys, json
from scipy import ndimage
vids = dict(
 moyou_music="/workspace/vk-brain-first/ref-full/source.mp4",
 xiaomo_disarm="/workspace/vk-emotion-shelf/ref/source.mp4",
 nexo_crowd="/workspace/vk-distill/refs/nexo-crowd-phone/source.mp4",
 sanhao_halo="/workspace/vk-distill/refs/halo-logos/source.mp4",
 zhongshan_learn="/workspace/vk-distill/refs/learn-zhongshan/source.mp4",
 lailong_beacon="/workspace/vk-distill/refs/lailong-beacon/source.mp4",
 lailong_xuanzang="/workspace/vk-distill/refs/xuan-zang-passport/source.mp4",
 lailong_zhaoyun="/workspace/vk-distill/refs/zhaoyun-infant/source.mp4",
 andy_building="/workspace/vk-distill/refs/andy-building/source.mp4",
 andy_bridge="/workspace/vk-bridge-pier/ref/source.mp4",
 zhanwai_huashu="/workspace/vk-huashu/ref/source.mp4",
)
out={}
for k,p in vids.items():
  cap=cv2.VideoCapture(p); fps=cap.get(5); n=int(cap.get(7)); step=max(1,int(round(fps/5)))  # 5 fps sample
  prev=None; specks=[]; vig=[]; diffs=[]; bright=[]; idx=0
  while True:
    ok=cap.grab()
    if not ok: break
    if idx%step==0:
      ok,f=cap.retrieve(); g=cv2.cvtColor(cv2.resize(f,(512,288)),cv2.COLOR_BGR2GRAY).astype(np.float32)
      h,w=g.shape; c=g[h//3:2*h//3,w//3:2*w//3].mean()+1; cor=np.mean([g[:h//6,:w//8].mean(),g[:h//6,-w//8:].mean(),g[-h//6:,:w//8].mean(),g[-h//6:,-w//8:].mean()])+1
      vig.append(cor/c)
      # specks: small local maxima brighter than local bg by 25
      bg=cv2.blur(g,(15,15)); m=(g-bg)>25
      lab,nl=ndimage.label(m); sizes=ndimage.sum(m,lab,range(1,nl+1)) if nl else np.array([])
      specks.append(int(((sizes>=1)&(sizes<=12)).sum()))
      bright.append(float((g>235).mean()))
      if prev is not None: diffs.append(float(np.abs(g-prev).mean()))
      prev=g
    idx+=1
  sp=np.array(specks); d=np.array(diffs)
  out[k]=dict(dur=round(n/fps,1), speck_median=int(np.median(sp)), speck_p90=int(np.percentile(sp,90)), corner_center_ratio=round(float(np.median(vig)),2), motion_mean=round(float(d.mean()),2), still_frac=round(float((d<0.5).mean()),2), cut_like=int((d>25).sum()))
  print(k,out[k],flush=True)
json.dump(out,open('probe.json','w'),ensure_ascii=False,indent=1)
