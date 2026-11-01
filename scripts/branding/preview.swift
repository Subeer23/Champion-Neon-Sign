// Static design review approximations of RN layout, not device screenshots.
import AppKit
import CoreText
let root = FileManager.default.currentDirectoryPath
for name in ["Regular", "SemiBold", "Bold"] {
    CTFontManagerRegisterFontsForURL(URL(fileURLWithPath: root + "/src/assets/fonts/Manrope-\(name).ttf") as CFURL, .process, nil)
}
let photo=NSImage(contentsOfFile:root+"/src/assets/images/exhibition.jpg")!
let logo=NSImage(contentsOfFile:root+"/src/assets/images/logo.png")!
func preview(_ width:Int,_ height:Int,_ top:CGFloat,_ bottom:CGFloat,_ file:String) {
 let w=CGFloat(width),h=CGFloat(height)
 let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:width*2,pixelsHigh:height*2,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:width*8,bitsPerPixel:32)!
 NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:rep)
 let ctx=NSGraphicsContext.current!.cgContext;ctx.scaleBy(x:2,y:2)
 NSColor(srgbRed:16/255,green:16/255,blue:18/255,alpha:1).setFill();NSRect(x:0,y:0,width:w,height:h).fill()
 let factor=min(w/photo.size.width,(h*0.62)/photo.size.height)
 let pw=photo.size.width*factor,ph=photo.size.height*factor
 photo.draw(in:NSRect(x:(w-pw)/2,y:h*0.55-ph/2,width:pw,height:ph))
 let edges=NSGradient(colors:[NSColor(srgbRed:16/255,green:16/255,blue:18/255,alpha:1),.clear,.clear,NSColor(srgbRed:16/255,green:16/255,blue:18/255,alpha:1)],atLocations:[0,0.18,0.82,1],colorSpace:.sRGB)!
 edges.draw(from:NSPoint(x:0,y:h*0.55+ph/2),to:NSPoint(x:0,y:h*0.55-ph/2),options:[])
 let alpha:[CGFloat]=[0.94,0.42,0.74,0.30,0.93,1]
 let cols=alpha.map{NSColor(srgbRed:16/255,green:16/255,blue:18/255,alpha:$0)}
 let gradient=NSGradient(colors:cols,atLocations:[0,0.25,0.45,0.64,0.82,1],colorSpace:.sRGB)!
 gradient.draw(from:NSPoint(x:0,y:h),to:NSPoint(x:0,y:0),options:[])
 let red=NSGradient(starting:NSColor(srgbRed:215/255,green:29/255,blue:36/255,alpha:0.24),ending:.clear)!
 red.draw(fromCenter:NSPoint(x:w,y:h*0.52),radius:0,toCenter:NSPoint(x:w,y:h*0.52),radius:w*0.8,options:.drawsAfterEndingLocation)
 func line(_ x:CGFloat,_ y:CGFloat,_ width:CGFloat,_ color:NSColor,_ height:CGFloat=1) {color.setFill();NSRect(x:x,y:h-y-height,width:width,height:height).fill()}
 func text(_ value:String,_ x:CGFloat,_ y:CGFloat,_ size:CGFloat,_ font:String,_ color:NSColor,_ kern:CGFloat=0) {
  (value as NSString).draw(at:NSPoint(x:x,y:h-y-size*1.45),withAttributes:[.font:NSFont(name:"Manrope-\(font)",size:size)!, .foregroundColor:color,.kern:kern])
 }
 let gutter=max(24,(w-520)/2),white=NSColor(white:0.94,alpha:1),muted=NSColor(white:0.81,alpha:1)
 line(gutter,top+24,w-2*gutter,NSColor(white:1,alpha:0.19))
 text("VISUAL COMMUNICATION",gutter,top+43,10,"SemiBold",white,1.8)
 text("SINCE 1989",gutter,top+65,10,"Regular",muted,1.6)
 let footerY=h-bottom-32-150
 let centerY=(top+24+63+footerY)/2
 let lw=min(420,w-48),lh=lw*380/900
 logo.draw(in:NSRect(x:(w-lw)/2,y:h-centerY-lh/2,width:lw,height:lh))
 line(gutter,footerY+8,28,NSColor(srgbRed:215/255,green:29/255,blue:36/255,alpha:1),2)
 text("CHAMPION GROUP · UAE",gutter+40,footerY,10,"SemiBold",white,1.8)
 text("Elevate Your Brand",gutter,footerY+32,w < 360 ? 28 : 32,"Bold",.white,-0.7)
 text("With Champion.",gutter,footerY+73,w < 360 ? 28 : 32,"Bold",.white,-0.7)
 text("Quality Visual Communication Solutions",gutter,footerY+130,12,"Regular",muted)
 try! rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:root+"/docs/branding/"+file))
}
preview(390,844,47,34,"splash-phone.png")
preview(320,568,24,0,"splash-small.png")
preview(768,1024,24,20,"splash-tablet.png")
print("Static review previews rendered; not device screenshots.")
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
label("OFFICIAL CHAMPION MARK · LAUNCHER REVIEW",40,450)
try! sheet.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:root+"/docs/branding/icon-review.png"))
