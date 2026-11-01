// Asset rasterization only. Run with `swift -module-cache-path /tmp/champion-swift-cache scripts/branding/render-assets.swift`.
// User-requested Champ launcher lettering; does not compile/build the mobile application.
import AppKit
import Foundation
import CoreText
let root = FileManager.default.currentDirectoryPath
let mark = NSImage(contentsOfFile: root + "/src/assets/branding/official-mark.png")!
let dark = NSColor(srgbRed: 16/255, green: 16/255, blue: 18/255, alpha: 1)
CTFontManagerRegisterFontsForURL(URL(fileURLWithPath: root + "/src/assets/fonts/Manrope-Bold.ttf") as CFURL, .process, nil)
func render(_ n: Int, _ path: String, opaque: Bool = false, _ draw: (CGFloat) -> Void) {
    let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: n, pixelsHigh: n, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: n*4, bitsPerPixel: 32)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    NSGraphicsContext.current!.imageInterpolation = .high
    draw(CGFloat(n))
    NSGraphicsContext.restoreGraphicsState()
    let url = URL(fileURLWithPath: root + "/" + path)
    try! FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
    var output = bitmap
    if opaque {
        output = NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:n,pixelsHigh:n,bitsPerSample:8,samplesPerPixel:3,hasAlpha:false,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:n*3,bitsPerPixel:24)!
        for pixel in 0..<(n*n) { for channel in 0..<3 { output.bitmapData![pixel*3+channel] = bitmap.bitmapData![pixel*4+channel] } }
    }
    try! output.representation(using: .png, properties: [:])!.write(to: url)
}
func drawMark(_ size: CGFloat, _ fraction: CGFloat) {
    let edge = size * fraction
    let origin = (size-edge)/2
    mark.draw(in: NSRect(x: origin, y: origin, width: edge, height: edge))
    // User-requested lettering inside the unchanged original C silhouette.
    let text = "hamp" as NSString
    let baseFont = NSFont(name: "Manrope-Bold", size: 100)!
    let measured = text.size(withAttributes: [.font: baseFont])
    let font = NSFont(name: "Manrope-Bold", size: 100 * edge * 0.59 / measured.width)!
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: NSColor(srgbRed: 211/255, green: 18/255, blue: 23/255, alpha: 1)
    ]
    text.draw(at: NSPoint(x: origin + edge * 0.29, y: origin + edge * 0.34), withAttributes: attributes)
}

for (density, scale) in [("mdpi",1.0),("hdpi",1.5),("xhdpi",2.0),("xxhdpi",3.0),("xxxhdpi",4.0)] {
    let res = "android/app/src/main/res/"
    for round in [false, true] {
        render(Int(48*scale), res + "mipmap-\(density)/ic_launcher\(round ? "_round" : "").png") { n in
            dark.setFill()
            if round { NSBezierPath(ovalIn: NSRect(x: 0, y: 0, width: n, height: n)).fill() }
            else { NSBezierPath(roundedRect: NSRect(x: 0, y: 0, width: n, height: n), xRadius: n*0.22, yRadius: n*0.22).fill() }
            drawMark(n, round ? 0.68 : 0.76)
        }
    }
    render(Int(108*scale), res + "drawable-\(density)/ic_launcher_foreground.png") { n in drawMark(n, 48/108) }
}
let catalog = "ios/ChampionNeonSign/Images.xcassets/AppIcon.appiconset/"
var entries: [[String: String]] = []
for (idiom, sizes) in [("iphone",[(20.0,[2,3]),(29.0,[2,3]),(40.0,[2,3]),(60.0,[2,3])]), ("ipad",[(20.0,[1,2]),(29.0,[1,2]),(40.0,[1,2]),(76.0,[1,2]),(83.5,[2])]), ("ios-marketing",[(1024.0,[1])])] {
    for (size, scales) in sizes { for scale in scales {
        let n = Int(size*Double(scale)), filename = "icon-\(n).png"
        render(n, catalog + filename, opaque: true) { n in dark.setFill(); NSRect(x:0,y:0,width:n,height:n).fill(); drawMark(n, 0.76) }
        let points = size == floor(size) ? String(Int(size)) : String(size)
        entries.append(["idiom":idiom,"size":"\(points)x\(points)","scale":"\(scale)x","filename":filename])
    }}
}
let contents: [String: Any] = ["images":entries,"info":["author":"xcode","version":1]]
try! JSONSerialization.data(withJSONObject: contents, options: [.prettyPrinted,.sortedKeys]).write(to: URL(fileURLWithPath: root + "/" + catalog + "Contents.json"))
// Exact alpha samples for contour tracing of the official silhouette, including its hole.
let rep = NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:500,pixelsHigh:500,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:2000,bitsPerPixel:32)!
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep:rep)
mark.draw(in:NSRect(x:0,y:0,width:500,height:500))
try! Data(bytes:rep.bitmapData!,count:1000000).write(to:URL(fileURLWithPath:"/tmp/champion-mark.rgba"))
print("Prepared Android densities and 18 iPhone/iPad/marketing catalog slots with user-requested Champ lettering.")
