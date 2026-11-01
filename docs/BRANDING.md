> Latest image selection and framing: [Phase 3 visual content update](PHASE3_VISUAL_CONTENT.md). The notes below record the preceding pass.

# Phase 3 corporate branding — 1 November 2026

## Delivered design

The React Native splash is now an exhibition campaign: verified Champion photography,
layered charcoal gradients, a restrained red glow, an unobstructed official wordmark,
a minimal masthead and the website headline “Elevate Your Brand With Champion.”
The photo stays visible between the logo and headline. The 900:380 wordmark uses
contain sizing, capped at 420 points; a 28-point headline on narrow phones avoids
crowding. Safe areas, scrolling, tablet width limits and scalable text remain.

The website itself publishes a compact red C mark as its favicon/apple-touch icon.
That complete official mark—not a cropped wordmark or new monogram—now supplies
all launcher icons and native launch stages. Its proportions and red are retained.
The icon uses charcoal for contrast; white is retained in the full wordmark and
campaign typography. The iOS OS mask is not baked into the AppIcon images.

Home shares the same exhibition photography, official wordmark, campaign wording
and charcoal header. Existing Phase 3 navigation and content changes are retained.

## Review previews

These are static AppKit layout approximations for design review, **not screenshots
of the running app**. Native mask/typography rendering still needs device checks.

- [Phone splash](branding/splash-phone.png)
- [Small-phone splash](branding/splash-small.png)
- [Tablet splash](branding/splash-tablet.png)
- [Launcher icon review at several sizes](branding/icon-review.png)

Review/refinement: the full logo remains readable and undistorted; the photograph
provides actual work context; headline size was reduced for narrow widths; the
compact mark retains its counter at small sizes. Native safe-circle geometry is
checked, rather than relying on square previews alone. Client approval has not
been obtained or implied.

## Launch behavior

- React Native background fades from 72% visibility; the logo starts at 85%, then
  settles from 0.99 scale to 1 in 360 ms with the native driver.
- The ready screen mounts immediately at 94% opacity and settles to 100% in 180 ms.
- Reduced-motion settings skip motion. Animation handles/subscriptions are cleaned
  up on unmount. No timer delays navigation; fast storage hydration may skip most
  or all of the React Native splash, intentionally.
- No fake progress, spinner, animated square, additional splash activity or timed
  duplicate sequence. The unavoidable OS launch surface precedes React Native.
- Android 12+ permits a solid background and bounded icon, not the full photographic
  campaign. Android native launch and iOS launch therefore share the compact C on
  #101012; the app expands into the photographic wordmark treatment when JS is ready.

## Prepared native assets — future rebuild required

Android:
- `res/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher*.png`: legacy/round icons.
- `res/drawable-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher_foreground.png`: transparent
  adaptive foregrounds, 108dp canvas with the mark occupying 48dp.
- `res/mipmap-anydpi-v26/ic_launcher*.xml`: adaptive icon resources.
- `res/values/colors.xml`: opaque charcoal background.
- `res/drawable/splash_icon.xml`: official silhouette vector, replacing square art.
- `res/drawable/launch_background.xml`, `res/values-v31/styles.xml`: coordinated native launch.
- Existing manifest icon/roundIcon references already resolve these assets; package
  identity, display name and signing configuration were not changed.

The entire adaptive mark lies within radius 31.64dp of its center (33dp safe radius).
The Android 12 splash mark lies within radius 94.93dp (96dp safe radius). The SVG
trace includes the original counter and uses the PNG's solid red #D31217.

 iOS:
- `Images.xcassets/AppIcon.appiconset`: 18 populated iPhone/iPad/marketing slots,
  matching existing device family 1,2 and AppIcon build setting. All exported icons
  are RGB PNG without alpha, including the 1024px marketing image.
- `Images.xcassets/ChampionMark.imageset`: original official mark.
- `LaunchScreen.storyboard`: centered aspect-fit official mark and charcoal; old
  decorative corners removed. Width constraints also protect narrow windows.

**None of these native changes can appear in the installed debug app through Fast
Refresh. They require a separately approved future native rebuild/reinstall.**
No Gradle, Xcode build, APK/AAB/IPA generation, install or push was performed.

## Fast Refresh changes and source files

- `SplashScreen.tsx`: responsive campaign composition and logo animation.
- `SplashArtwork.tsx`: local official photograph and live SVG gradients.
- `LaunchReveal.tsx`, `LaunchGate.tsx`: immediate, subtle ready-screen reveal.
- `HomeScreen.tsx`: consistent brand wording/header color.
- `src/assets/branding`: official source mark, traced silhouette and provenance.
- `src/test/splash.test.tsx`: updated sizing, copy and reduced-motion expectations.

Source URLs, treatment and original mark SHA-256 are in
`src/assets/branding/sources.json`. Existing photo and wordmark source manifests
remain intact. The 500px original mark is the largest downloaded source; the
required 1024px App Store export is resampled from that official artwork.

## Reproduction and checks (no app build)

The scripts use macOS AppKit only to rasterize supplied artwork and write PNGs;
they do not compile the mobile app or invoke Xcode/Gradle builds. No dependency added.

```
swift -module-cache-path /tmp/champion-swift-cache scripts/branding/render-assets.swift
python3 scripts/branding/trace-mark.py
swift -module-cache-path /tmp/champion-swift-cache scripts/branding/preview.swift
python3 scripts/branding/validate.py
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

Validation passed: TypeScript, ESLint, all 62 tests in 11 suites, PNG dimensions and
alpha checks for every configured icon slot, Android/iOS XML syntax, adaptive resource
presence and safe-circle geometry. This does not substitute for native resource
compilation, which was deliberately not performed.

Device follow-up: Fast Refresh appearance, landscape/large accessibility text,
cold/warm/hot launch transitions, image decode timing and reduced motion. After a
future approved rebuild, verify OEM adaptive masks, native splash handoff, iOS
launcher masks and iPad launch layouts. No physical-device visual approval claimed.
