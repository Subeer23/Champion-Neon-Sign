# Phase 3 photography and visual enhancement — 1 November 2026

## Access and provenance

The public Instagram URL https://www.instagram.com/champion_group/ failed to fetch
through the available web tool. Public search yielded no usable profile posts or
reels. No Instagram images, captions or video frames were retrieved, and no claim
is made to have reviewed inaccessible content. No login, restricted scrape,
screenshot, proxy, or access workaround was used.

The official homepage and project pages were reviewed. The LED and exhibition
pages timed out in the web reader but their public HTML was available through a
normal HTTPS request. Events HTML was also checked. The site's unrelated template
Services page was rejected. Existing verified company-published website media was
sufficient; no stock, generated or third-party imagery was introduced.

`src/assets/images/visual-selection-sources.json` records exact image URLs,
verification date, source pages, selection rationale and intended screens. The
records are included in the existing source manifest. No new photo bytes were
added: this pass reuses optimized local assets rather than downloading duplicate
versions. Publication on the company site is the provenance basis; it does not
independently establish the photographer's copyright ownership.

## Selection for all 16 solutions

| Solution | Selection / decision |
| --- | --- |
| Signage | `events-showcase`: real exterior facade signage, replacing the wall-logo mockup. Source: official Events gallery. |
| Graphics | `branding`: relevant vehicle graphics photo, retained. |
| Branding | `branding`: vehicle branding photo, retained. This related reuse is deliberate. |
| Outdoor | `led-display`: actual outdoor billboard from official LED gallery, replacing an icon. |
| LCD Displays | Official icon retained; no verified LCD-specific photo. |
| LED Screens | `led`: indoor LED installation; two additional verified gallery photos retained. |
| Robotics | Official icon retained; no verified dedicated photo. |
| Interactive | Official icon retained; no verified dedicated photo. |
| Exhibitions | `exhibition`: complete stand from homepage; detailed exhibition-and-display view in gallery. |
| Events | `events-hero`: official homepage showcase; real exterior photo leads the project gallery. |
| Kiosks | Official icon retained; no verified dedicated photo. |
| Interiors | Official icon retained; client-site photos not repurposed as interior-design evidence. |
| 3D Prints | Official icon retained; no verified dedicated photo. |
| UV Prints | Official icon retained; no verified dedicated photo. |
| Maintenance | Official icon retained; installation photos do not establish maintenance work. |
| Fabrication | Official icon retained; no verified fabrication/process photo. |

Nine categories remain icon-led. No unrelated photo was assigned simply to fill a
card. Client logos and testimonials were not changed.

## Screens and media treatment

- Home hero: `exhibition-stand-a`, showing both the exhibition stand and its large
  display, with full 16:9 framing, a dark caption bar and direct project navigation.
  All four existing project showcases are now featured below the solutions.
- Solutions/cards: full contain-fit photos on charcoal frames; real Signage and
  Outdoor imagery, consistent radii and spacing. No stretched or cropped signage.
- Details/About/Contact: source-aspect-aware media. Tall portrait frames are capped
  at a 0.8 aspect ratio with contain fit, so the entire image remains visible.
  About retains the authentic company-premises photo rather than a client site.
- Project galleries: larger lead image, responsive secondary tiles, full-image
  viewing labels, preserved index navigation and contain-fit thumbnails/viewer.
- Removed the visually repeated `exhibition-stand-b` view and the website's
  `events-illustration` (original filename explicitly identifies a ChatGPT image)
  from active galleries and the image registry. Their historical source files
  remain for provenance; Metro no longer requires these two assets. This removes
  300,634 bytes of image payload from the active module graph.
- Splash: retains the verified full exhibition photo, reframed into a cinematic
  horizontal band rather than a portrait crop dominated by the ceiling. Gradient
  edge fades blend it into charcoal. The official logo, restrained red lighting,
  accessible animation and immediate startup behavior remain intact.
- Local images no longer trigger Android's default repeated fade on gallery page
  mounts; the intentional splash transitions are retained. Existing list windows,
  repository cache and navigation architecture remain unchanged.

The selected photos are already locally compressed JPEGs with maximum dimension
1024px. No additional full-resolution copies, dependencies or fetch effects were
added. A hero image is reused from the existing gallery rather than bundled twice.

## Source references

- Homepage / exhibition photograph: https://championgroup.ae/
- Exhibition & digital display: https://championgroup.ae/project/exhibition-stands/
- Indoor LED, portrait display and outdoor billboard: https://championgroup.ae/project/led-screens/
- Exterior facade: https://championgroup.ae/project/events/
- Vehicle graphics: https://championgroup.ae/project/branding/
- Exact asset URLs and screen mappings: `src/assets/images/visual-selection-sources.json`.

## Validation and limits

TypeScript and ESLint passed; all 64 tests in 12 Jest suites passed, including
photo provenance/assignment, uncropped portrait media and navigation through all
seven Home featured cards. Diff whitespace checks passed. Design-review
splash renders in `docs/branding` are updated; these are static approximations,
not device screenshots. Check Fast Refresh, large text, landscape, hero navigation,
gallery swipes and visual quality on the installed app.

This pass changes only JavaScript/TypeScript, content metadata and review artifacts.
Earlier staged native launcher work is preserved, not rebuilt. No Gradle/Xcode app
build, APK/AAB/IPA, install, package/signing change, dependency addition, GitHub push
or Phase 4 work was performed.
