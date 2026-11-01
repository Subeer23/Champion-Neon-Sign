"""Trace the alpha boundary of the official PNG, not a redesigned/reconstructed logo.
Run render-assets.swift first. No third-party tooling or application builds.
"""
from pathlib import Path
import math
raw = Path('/tmp/champion-mark.rgba').read_bytes()
n = 500
solid = {(x,y) for y in range(n) for x in range(n) if raw[(y*n+x)*4+3] >= 128}
edges = {}
def edge(a,b): edges.setdefault(a,[]).append(b)
for x,y in solid:
    if (x,y-1) not in solid: edge((x,y),(x+1,y))
    if (x+1,y) not in solid: edge((x+1,y),(x+1,y+1))
    if (x,y+1) not in solid: edge((x+1,y+1),(x,y+1))
    if (x-1,y) not in solid: edge((x,y+1),(x,y))
def simplify(points, tolerance=0.45):
    if len(points)<3: return points
    a,b=points[0],points[-1];dx,dy=b[0]-a[0],b[1]-a[1]
    d=[abs(dy*(x-a[0])-dx*(y-a[1]))/max(math.hypot(dx,dy),1) for x,y in points]
    i=max(range(len(d)),key=d.__getitem__)
    if d[i]<=tolerance:return [a,b]
    return simplify(points[:i+1])+simplify(points[i:])[1:]
loops=[]
while edges:
    first=min(edges); cur=first; loop=[first]
    while True:
        nxt=edges[cur].pop()
        if not edges[cur]: del edges[cur]
        loop.append(nxt);cur=nxt
        if cur==first:break
    # Split the closed contour so the RDP baseline is non-degenerate.
    if len(loop)>8:
        mid=len(loop)//2
        loops.append(simplify(loop[:mid+1])+simplify(loop[mid:])[1:])
path=' '.join('M'+ ' L'.join(f'{x},{y}' for x,y in loop)+' Z' for loop in loops)
# Android 12 no-background icon: 288dp viewport, mark spans 144dp.
vector=f'''<?xml version="1.0" encoding="utf-8"?>
<!-- Official website C silhouette traced from PNG alpha, including its counter. -->
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="288dp" android:height="288dp" android:viewportWidth="288" android:viewportHeight="288">
    <group android:scaleX="0.288" android:scaleY="0.288" android:translateX="72" android:translateY="72">
        <path android:fillColor="#D31217" android:fillType="evenOdd" android:pathData="{path}" />
    </group>
</vector>
'''
Path('android/app/src/main/res/drawable/splash_icon.xml').write_text(vector)
# Trace is also reviewable independently of Android.
Path('src/assets/branding/official-mark-traced.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path fill="#D31217" fill-rule="evenodd" d="{path}"/></svg>\n')
# Geometric proof: all silhouette pixels remain inside the adaptive 66dp and splash 192dp circles.
radius=max(math.hypot(x-250,y-250) for x,y in solid)
assert radius*48/500 < 33
assert radius*144/500 < 96
print(f'{len(loops)} contours; adaptive radius {radius*48/500:.2f}dp < 33; splash radius {radius*144/500:.2f}dp < 96')
