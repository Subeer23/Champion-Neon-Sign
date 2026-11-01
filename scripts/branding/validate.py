"""Read-only asset checks; no Android/iOS build tools invoked."""
from pathlib import Path
import json,struct,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[2]
def png(p):
    data=p.read_bytes()
    assert data[:8]==b'\x89PNG\r\n\x1a\n',p
    w,h,depth,kind=struct.unpack('>IIBB',data[16:26])
    return w,h,depth,kind
catalog=root/'ios/ChampionNeonSign/Images.xcassets/AppIcon.appiconset'
entries=json.loads((catalog/'Contents.json').read_text())['images']
for e in entries:
    n=int(float(e['size'].split('x')[0])*int(e['scale'][0]))
    w,h,depth,kind=png(catalog/e['filename'])
    assert (w,h)==(n,n),e
    assert kind==2, f"iOS icon must be RGB without alpha: {e}"
assert {e['idiom'] for e in entries}=={'iphone','ipad','ios-marketing'}
res=root/'android/app/src/main/res'
for density,scale in [('mdpi',1),('hdpi',1.5),('xhdpi',2),('xxhdpi',3),('xxxhdpi',4)]:
    for name in ['ic_launcher','ic_launcher_round']:
        assert png(res/f'mipmap-{density}/{name}.png')[:2]==(int(48*scale),)*2
    assert png(res/f'drawable-{density}/ic_launcher_foreground.png')[:2]==(int(108*scale),)*2
for p in res.rglob('*.xml'): ET.parse(p)
ET.parse(root/'ios/ChampionNeonSign/LaunchScreen.storyboard')
ET.parse(root/'android/app/src/main/AndroidManifest.xml')
for name in ['ic_launcher','ic_launcher_round']:
    assert ET.parse(res/f'mipmap-anydpi-v26/{name}.xml').getroot().tag=='adaptive-icon'
print(f'PASS: {len(entries)} opaque iOS slots, 15 Android density images, adaptive resources and native XML syntax.')
print('Native runtime/resource compilation deliberately not performed; future device validation required.')
