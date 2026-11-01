// Static composition previews only; not device screenshots or app builds.
import AppKit
import CoreText
let root = FileManager.default.currentDirectoryPath
for name in ["Regular", "SemiBold", "Bold"] {
 CTFontManagerRegisterFontsForURL(URL(fileURLWithPath: root + "/src/assets/fonts/Manrope-\(name).ttf") as CFURL, .process, nil)
}
let photo=NSImage(contentsOfFile:root+"/src/assets/images/events-hero.jpg")!
let logo=NSImage(contentsOfFile:root+"/src/assets/images/logo.png")!
func preview(_ width:Int,_ height:Int,_ top:CGFloat,_ bottom:CGFloat,_ file:String) {
 let w=CGFloat(width),h=CGFloat(height)
 let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:width*2,pixelsHigh:height*2,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:width*8,bitsPerPixel:32)!
 NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:rep)
 NSGraphicsContext.current!.cgContext.scaleBy(x:2,y:2)
 NSColor(srgbRed:8/255,green:10/255,blue:13/255,alpha:1).setFill();NSRect(x:0,y:0,width:w,height:h).fill()
 let factor=max(w/photo.size.width,h/photo.size.height)
 let pw=photo.size.width*factor,ph=photo.size.height*factor
 NSGraphicsContext.saveGraphicsState()
 NSBezierPath(rect:NSRect(x:0,y:0,width:w,height:h)).addClip()
 photo.draw(in:NSRect(x:(w-pw)/2,y:(h-ph)/2,width:pw,height:ph))
 NSGraphicsContext.restoreGraphicsState()
 let alpha:[CGFloat]=[0.35,0.55,0.45,0.30,0.55]
 let cols=alpha.map{NSColor(srgbRed:8/255,green:10/255,blue:13/255,alpha:$0)}
 NSGradient(colors:cols,atLocations:[0,0.43,0.61,0.78,1],colorSpace:.sRGB)!.draw(from:NSPoint(x:0,y:h),to:NSPoint(x:0,y:0),options:[])
 let lw=min(320,w*0.70,w-48),lh=lw*380/900,y=top+max(48,(h-top-bottom)*0.23)
 logo.draw(in:NSRect(x:(w-lw)/2,y:h-y-lh,width:lw,height:lh))
 func text(_ value:String,_ y:CGFloat,_ size:CGFloat,_ font:String,_ color:NSColor) {
 let attrs:[NSAttributedString.Key:Any]=[.font:NSFont(name:"Manrope-\(font)",size:size)!, .foregroundColor:color,.kern:1.2]
 let str=value as NSString
 str.draw(at:NSPoint(x:(w-str.size(withAttributes:attrs).width)/2,y:h-y-size*1.4),withAttributes:attrs)
 }
 text("ELEVATE YOUR BRAND",y+lh+28,w<360 ? 13:15,"Bold",NSColor(srgbRed:1,green:115/255,blue:120/255,alpha:1))
 text("WITH CHAMPION.",y+lh+54,14,"Regular",NSColor(white:0.71,alpha:1))
 NSColor(srgbRed:215/255,green:29/255,blue:36/255,alpha:1).setFill();NSRect(x:(w-96)/2,y:bottom+50,width:96,height:2).fill()
 try! rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:root+"/docs/branding/"+file))
}
preview(390,844,47,34,"splash-phone.png")
preview(320,568,24,0,"splash-small.png")
preview(768,1024,24,20,"splash-tablet.png")
let sheet=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:1000,pixelsHigh:500,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:4000,bitsPerPixel:32)!
NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:sheet)
NSColor(srgbRed:0.94,green:0.94,blue:0.94,alpha:1).setFill();NSRect(x:0,y:0,width:1000,height:500).fill()
let appIcon=NSImage(contentsOfFile:root+"/ios/ChampionNeonSign/Images.xcassets/AppIcon.appiconset/icon-1024.png")!
NSGraphicsContext.saveGraphicsState()
NSBezierPath(roundedRect:NSRect(x:40,y:130,width:280,height:280),xRadius:62,yRadius:62).addClip()
appIcon.draw(in:NSRect(x:40,y:130,width:280,height:280))
NSGraphicsContext.restoreGraphicsState()
let round=NSImage(contentsOfFile:root+"/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png")!
round.draw(in:NSRect(x:370,y:190,width:180,height:180))
for (i,size) in [24,40,60].enumerated() {
 let n=CGFloat(size);appIcon.draw(in:NSRect(x:640+CGFloat(i)*100,y:250,width:n,height:n))
}
func label(_ text:String,_ x:CGFloat,_ y:CGFloat){(text as NSString).draw(at:NSPoint(x:x,y:y),withAttributes:[.font:NSFont.systemFont(ofSize:17),.foregroundColor:NSColor.darkGray])}
label("iOS mask preview",40,80);label("Android round",370,140);label("24 / 40 / 60 px",640,190)
label("CHAMP · USER-REQUESTED LAUNCHER REVIEW",40,450)
try! sheet.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:root+"/docs/branding/icon-review.png"))
