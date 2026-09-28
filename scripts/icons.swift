// Regenerates every logo asset in public/ from the art in src/screen/Logo.tsx.
// macOS only (CoreGraphics). Run from the repo root: `pnpm icons`.

import CoreGraphics
import CoreText
import Foundation
import ImageIO
import UniformTypeIdentifiers

let out = "public"
let pixelFont = "node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2"
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let phi: CGFloat = 1.618_034

// Keep in sync with src/screen/Logo.tsx.
let X5 = ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"]
let O5 = [".###.", "#...#", "#...#", "#...#", ".###."]
let layout: [[[String]?]] = [[X5, nil, O5], [nil, X5, nil], [O5, nil, X5]]
let size = 23
let cells = [0, 8, 16]
let lines = [7, 15]
/// Tight padding for small sizes (favicon, in-app); app icons use art = plate / φ.
let smallPad = 2
let cornerRatio: CGFloat = 0.2237

func rgb(_ hex: UInt32, _ a: CGFloat = 1) -> CGColor {
  CGColor(
    srgbRed: CGFloat((hex >> 16) & 255) / 255, green: CGFloat((hex >> 8) & 255) / 255,
    blue: CGFloat(hex & 255) / 255, alpha: a)
}
let lcd0 = rgb(0x0f380f), lcd1 = rgb(0x306230), lcd2 = rgb(0x8bac0f), lcd3 = rgb(0x9bbc0f)

/// Grid lines as (x, y, w, h) in art units.
let gridRects = lines.flatMap { [($0, 0, 1, size), (0, $0, size, 1)] }

/// Mark pixels: (x, y, color) in art units.
func artPixels() -> [(Int, Int, UInt32)] {
  var px: [(Int, Int, UInt32)] = []
  for (r, row) in layout.enumerated() {
    for (c, mark) in row.enumerated() {
      guard let mark = mark else { continue }
      for (j, line) in mark.enumerated() {
        for (i, ch) in line.enumerated() where ch == "#" {
          px.append((cells[c] + 1 + i, cells[r] + 1 + j, mark == X5 ? 0x9bbc0f : 0x8bac0f))
        }
      }
    }
  }
  return px
}

// favicon.svg
do {
  let box = size + 2 * smallPad
  var paths: [UInt32: String] = [
    0x306230: gridRects.map { "M\($0.0 + smallPad) \($0.1 + smallPad)h\($0.2)v\($0.3)h-\($0.2)z" }
      .joined()
  ]
  for (x, y, color) in artPixels() {
    paths[color, default: ""] += "M\(x + smallPad) \(y + smallPad)h1v1h-1z"
  }
  let body = [0x306230, 0x9bbc0f, 0x8bac0f].map {
    "<path fill=\"#\(String($0, radix: 16))\" d=\"\(paths[UInt32($0)]!)\"/>"
  }.joined()
  let rx = String(format: "%.2f", CGFloat(box) * cornerRatio)
  let svg =
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 \(box) \(box)\"><rect width=\"\(box)\" height=\"\(box)\" rx=\"\(rx)\" fill=\"#0f380f\"/><g shape-rendering=\"crispEdges\">\(body)</g></svg>\n"
  try! svg.write(toFile: "\(out)/favicon.svg", atomically: true, encoding: .utf8)
}

func canvas(_ w: Int, _ h: Int, alpha: Bool) -> CGContext {
  let ctx = CGContext(
    data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: cs,
    bitmapInfo: (alpha ? CGImageAlphaInfo.premultipliedLast : .noneSkipLast).rawValue)!
  ctx.translateBy(x: 0, y: CGFloat(h))
  ctx.scaleBy(x: 1, y: -1)
  return ctx
}

func save(_ ctx: CGContext, _ name: String) {
  let d = CGImageDestinationCreateWithURL(
    URL(fileURLWithPath: "\(out)/\(name)") as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(d, ctx.makeImage()!, nil)
  CGImageDestinationFinalize(d)
}

/// Logo on a flat plate of side `s`. `pad` in art units; nil = golden (art = plate / φ).
func icon(_ ctx: CGContext, x: CGFloat, y: CGFloat, s: CGFloat, rounded: Bool, pad: Int? = nil) {
  let u = pad.map { s / CGFloat(size + 2 * $0) } ?? max(1, (s / phi / CGFloat(size)).rounded())
  let r = rounded ? s * cornerRatio : 0
  ctx.addPath(
    CGPath(
      roundedRect: CGRect(x: x, y: y, width: s, height: s), cornerWidth: r, cornerHeight: r,
      transform: nil))
  ctx.setFillColor(lcd0)
  ctx.fillPath()
  let off = ((s - CGFloat(size) * u) / 2).rounded()
  ctx.setFillColor(lcd1)
  for (gx, gy, gw, gh) in gridRects {
    ctx.fill(
      CGRect(
        x: x + off + CGFloat(gx) * u, y: y + off + CGFloat(gy) * u, width: CGFloat(gw) * u,
        height: CGFloat(gh) * u))
  }
  for (px, py, color) in artPixels() {
    ctx.setFillColor(rgb(color))
    ctx.fill(CGRect(x: x + off + CGFloat(px) * u, y: y + off + CGFloat(py) * u, width: u, height: u))
  }
}

// App icons. iOS and maskable icons are full-bleed: the platform applies its own mask.
for (name, px, rounded) in [
  ("apple-touch-icon.png", 180, false), ("icon-192.png", 192, true), ("icon-512.png", 512, true),
  ("icon-maskable-512.png", 512, false),
] {
  let c = canvas(px, px, alpha: rounded)
  icon(c, x: 0, y: 0, s: CGFloat(px), rounded: rounded)
  save(c, name)
}

// OG image.
let fontDesc = (CTFontManagerCreateFontDescriptorsFromURL(
  URL(fileURLWithPath: pixelFont) as CFURL) as! [CTFontDescriptor])[0]
func text(_ s: String, _ pt: CGFloat, _ c: CGColor, kern: CGFloat = 0) -> CTLine {
  CTLineCreateWithAttributedString(
    NSAttributedString(
      string: s,
      attributes: [
        kCTFontAttributeName as NSAttributedString.Key: CTFontCreateWithFontDescriptor(
          fontDesc, pt, nil),
        kCTForegroundColorAttributeName as NSAttributedString.Key: c,
        kCTKernAttributeName as NSAttributedString.Key: kern,
      ]))
}
func draw(_ ctx: CGContext, _ l: CTLine, x: CGFloat, baseline: CGFloat) {
  ctx.textMatrix = CGAffineTransform(scaleX: 1, y: -1)
  ctx.textPosition = CGPoint(x: x.rounded(), y: baseline.rounded())
  CTLineDraw(l, ctx)
}
/// Like CSS `radial-gradient(ellipse rx ry at cx cy, ...)`.
func ellipse(
  _ ctx: CGContext, _ colors: [CGColor], _ stops: [CGFloat], cx: CGFloat, cy: CGFloat,
  rx: CGFloat, ry: CGFloat
) {
  let g = CGGradient(colorsSpace: cs, colors: colors as CFArray, locations: stops)!
  ctx.saveGState()
  ctx.translateBy(x: cx, y: cy)
  ctx.scaleBy(x: 1, y: ry / rx)
  ctx.drawRadialGradient(
    g, startCenter: .zero, startRadius: 0, endCenter: .zero, endRadius: rx,
    options: [.drawsAfterEndLocation])
  ctx.restoreGState()
}

let W: CGFloat = 1200, H: CGFloat = 630
let og = canvas(Int(W), Int(H), alpha: false)
// Same as body's background in src/index.css.
ellipse(
  og, [rgb(0x1f1e27), rgb(0x18171e), rgb(0x111116)], [0, 0.55, 1], cx: W * 0.5, cy: H * 0.42,
  rx: W * 0.8, ry: H * 0.7)

// Layout by ink bounds: Press Start 2P's side bearings and tracking skew metric-based alignment.
let side = CGFloat(size + 2 * smallPad) * 12
let title = text("TIC·TAC·TOE", 40, lcd3)
let sup = text("SUPER", 24, lcd2, kern: 12)
let t = CTLineGetImageBounds(title, og), sp = CTLineGetImageBounds(sup, og)
let gap: CGFloat = 20, stripes: CGFloat = 8, gapX: CGFloat = 88
let lx = ((W - (side + gapX + t.width)) / 2).rounded()
let ly = ((H - side) / 2).rounded()

ellipse(
  og, [rgb(0x9bbc0f, 0.06), rgb(0x9bbc0f, 0)], [0, 1], cx: lx + side / 2, cy: ly + side / 2,
  rx: side * 0.95, ry: side * 0.85)
icon(og, x: lx, y: ly, s: side, rounded: true, pad: smallPad)

let tx = lx + side + gapX
let top = (ly + side / 2 - (sp.height + gap + t.height + gap + stripes) / 2).rounded()
let titleTop = top + sp.height + gap
draw(og, sup, x: tx + (t.width - sp.width) / 2 - sp.minX, baseline: top + sp.maxY)
draw(og, title, x: tx - t.minX, baseline: titleTop + t.maxY)
let sy = titleTop + t.height + gap
og.setFillColor(rgb(0xa8336a))
og.fill(CGRect(x: tx, y: sy, width: t.width, height: 3))
og.setFillColor(rgb(0x3d5cb8))
og.fill(CGRect(x: tx, y: sy + 5, width: t.width, height: 3))
save(og, "og-image.png")
