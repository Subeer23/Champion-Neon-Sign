> Latest image selection and framing: [Phase 3 visual content update](PHASE3_VISUAL_CONTENT.md). The notes below record the preceding pass.

# Phase 3 polish — 1 November 2026

Scope: React Native JavaScript/TypeScript, bundled images and tests only. No builds,
installs, native edits, signing changes, dependency additions, pushes or Phase 4
quotation submission. Existing staged splash work was preserved.

## Verified location and contact actions

Sources inspected: https://championgroup.ae/contact/ and https://championgroup.ae/.
The Contact page contains unrelated template contact content and a London Eye map;
its footer supplies the actual Dubai Investments Park 2 address. The homepage
Contact section embeds `Champion Neon Headquarters`, feature identifier
`0x3e5f58126fb99783:0x944cdf610b8a58fd`. Lossless hexadecimal-to-decimal conversion
of the business identifier gives CID `10686161623741782269`.

Open Maps uses https://www.google.com/maps?cid=10686161623741782269. This HTTPS
business link is handed to the OS through React Native Linking, allowing Google
Maps or a browser without native scheme declarations. If opening rejects, retry
an encoded search for Champion Neon Headquarters, Champion Group, Dubai Investments
Park 2, Dubai, UAE. If both fail, the existing Contact error state allows retry and
leaves the address selectable. The embed's camera coordinates are deliberately
not represented as verified pin coordinates. No ChIJ place ID was published.

Verified phone: +971 4 2856595; email: sales@champions.me; WhatsApp:
https://wa.me/971553182020 (homepage chat link). HTTPS avoids `canOpenURL` query
restrictions; tel/mailto retain availability checks and recoverable errors.

## Screen audit and changes

| Screen | Result |
| --- | --- |
| Splash | Preserved staged centered official 900:380 logo and diagonal artwork; shortened subtle native-driver entrance to 240 ms; no timer gate or square animation in JS. |
| Onboarding | Shared buttons/media improved; source changes clear failed images; reduced-motion defaults to enabled until preference resolves. Existing back, skip and persistence flow retained. |
| Home | Shared content media now matches solution/project records; removed unrelated image fallback maps and whole-page entrance animation. |
| Solutions | Smaller list batches, consistent media/cards, actionable clear-search/filter empty state. |
| Solution Details | Shared spacing/media/control polish; explicit absent-content state and retained related-showcase/quote routing. |
| Projects | Same shared catalog improvements; existing combined category/search behavior retained. |
| Project Details | Gallery uses the same filtered image indices as the viewer; no empty gallery button; explicit absent-content state. |
| Image Gallery | Audited contain sizing, safe insets, rotation remount, clamping, close/back, and existing 1-initial/2-per-batch/3-window virtualization; shared image failure recovery improved. |
| About | Shared 20-point gutters, rounded media, readable cards and consistent controls. |
| Clients | Correct safe-area-aware pixel grid widths; adapts to narrow widths and large text; nine contain-fit logos retained. |
| Testimonials | Dedicated typed route from More and Clients; all six original quotations and attributions retained. |
| FAQs | Existing search, expand/collapse and accessible expanded state retained; shared spacing/input scrolling polished. |
| Contact | Verified business destination, browser/search fallback; correct selectable DIP 2 address and verified contact channels retained. |
| More | Descriptive navigation rows, clear hierarchy and direct Testimonials access. |
| Quote entry | Replaced Phase 4 placeholder dead end with existing Contact navigation, preserving contextual solution/project display. No form or submission implemented. |

Design system stays with the existing official red, charcoal, white and Manrope
palette/typeface. Shared rounded back/close controls, centered wrapping button
labels, 52-point primary buttons, card media and content gutters are consistent.
Bottom tabs hide for the search keyboard; safe-area ownership remains with the tab
bar on tabs and Screen on pushed screens. No additional animation dependency.

## All 16 solution media decisions

| Solution | Verified media |
| --- | --- |
| Signage | Existing official signage mockup, labelled as a mockup; also used on Home. |
| Graphics | Official Passenger-Side vehicle branding photo, relevant to vehicle graphics. |
| Branding | Same official branding showcase vehicle photo. |
| Outdoor | Original official service icon; no verified dedicated photograph. |
| LCD Displays | Original official service icon; no substitution of an LED photograph. |
| LED Screens | Official LED showcase photograph. |
| Robotics | Original official service icon. |
| Interactive | Original official service icon. |
| Exhibitions | Official exhibition showcase photograph. |
| Events | Official Events showcase image. |
| Kiosks | Original official service icon. |
| Interiors | Original official service icon. |
| 3D Prints | Original official service icon. |
| UV Prints | Original official service icon. |
| Maintenance | Original official service icon. |
| Fabrication | Original official service icon. |

The homepage publishes icons for all 16 categories, not 16 dedicated service
photos. Ten remain icon-led rather than introducing speculative imagery. Removed
technical placeholder captions from these cards. All nine homepage client logos
and six testimonials match existing bundled records; none invented. The website's
Events illustration remains explicitly labelled in the gallery.

Ten JPEGs were reduced from 1200px maximum dimension to 1024px, quality 76:
2,036,394 → 1,469,173 bytes (27.9% less). Their decoded pixel area is approximately
27% smaller. Logo/portrait PNGs were left intact, logos use contain, gallery images
use contain, and card photography uses cover. Sources remain in the asset manifests.

RTK Query already shares cached subscriptions; no duplicate fetching effects were
added. Small static lists did not justify speculative memoization. Catalog batches
were reduced from six initial rows to three, with three per batch and a five-window
viewport. Home no longer animates an entire long content layer. These are structural
and asset improvements, not a claim of measured device FPS or peak memory savings.

## Validation and device follow-up

TypeScript and ESLint passed; all 62 tests across 11 Jest suites passed; diff
whitespace checks passed. Final Jest run used --runInBand --watchman=false. New tests cover exact CID derivation, Android/iOS HTTPS
handoff, restricted scheme discovery, map fallback success/failure and image source
recovery; navigation coverage includes Testimonials and all existing routes.

Metro was already listening on port 8081. ADB reports no attached device. Verify on
the installed app: Fast Refresh, all layouts with large text/landscape, catalog
scrolling/filter reset, gallery swiping/rotation/back, actual Google Maps business
selection, browser fallback, call/email/WhatsApp handoffs and launch transitions.

The installed Android 12+ native splash icon still contains its old square motif.
Fast Refresh cannot replace that compiled resource. A future native splash change
requires explicit rebuild/reinstall approval; no native change or build was made.
