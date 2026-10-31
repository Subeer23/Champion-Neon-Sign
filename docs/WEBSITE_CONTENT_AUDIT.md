# Champion Group website content audit

Verified 31 October 2026 against https://championgroup.ae/ and its four linked portfolio pages. The browsing service timed out on the homepage; direct HTTPS downloads succeeded for the homepage, all four pages and selected assets. No required page remained inaccessible.

## Page structure and coverage

The official navigation uses homepage sections for About (`#about`), Solutions (`#services`), Projects (`#projects`), Clients (`#clients`), FAQs (`#faqs`) and Contact (`#contact`). Testimonials are a homepage section, not a separate linked page. We did not invent standalone page URLs.

| Content                                                      | Verified source                                                 | App treatment                                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Company introduction, since 1989, craftsmanship and services | [Homepage About](https://championgroup.ae/#about)               | Concise factual summary; no fabricated awards or statistics                            |
| 16 service names and descriptions                            | [Solutions](https://championgroup.ae/#services)                 | Exact wording; uppercase labels converted to title case                                |
| Branding                                                     | [Showcase](https://championgroup.ae/project/branding/)          | Summary of identity, messaging and positioning; one published vehicle image            |
| LED Screens                                                  | [Showcase](https://championgroup.ae/project/led-screens/)       | Summary of applications and end-to-end services; three distinct gallery images         |
| Exhibition Stands                                            | [Showcase](https://championgroup.ae/project/exhibition-stands/) | Summary of custom stands and delivery; hero and two gallery images                     |
| Events                                                       | [Showcase](https://championgroup.ae/project/events/)            | Website showcase, without invented client details; hero and two gallery images         |
| Nine client logos                                            | [Clients](https://championgroup.ae/#clients)                    | Original artwork, proportions preserved; identities checked against images             |
| Six testimonials                                             | [Homepage Testimonials](https://championgroup.ae/)              | Full published wording and attribution; original spelling preserved                    |
| Ten FAQ questions and answers                                | [FAQs](https://championgroup.ae/#faqs)                          | Original wording, including punctuation; HTML markup removed and whitespace normalized |
| Phone, email, hours, location and WhatsApp                   | [Contact](https://championgroup.ae/#contact)                    | Published values and link; map search derived from embedded map identity               |

The site lists: Signage, Graphics, Branding, Outdoor, LCD Displays, LED Screens, Robotics, Interactive, Exhibitions, Events, Kiosks, Interiors, 3D Prints, UV Prints, Maintenance and Fabrication.

Client logos: ADNOC, Gree, Super General, Mister Baker, Canadian University Dubai, Jumbo, Emax, General and ENOC. Testimonials are attributed to Julian Leo Sirrao, Syed Adil, Dolphin Stationery, CEO CLUBS NETWORK, Mihir Sanganee and Namra Masood. These represent what Champion Group publishes; no additional client relationships or endorsements were inferred.

## Contact provenance

- Email: `sales@champions.me`
- Phone: `+971 4 2856595`
- Location: Dubai Investments Park 2, Dubai, UAE.
- Monday–Saturday, 8 AM–6 PM; Sunday closed.
- Exact published WhatsApp URL: `https://wa.me/971553182020?text=Hello%20Champion%21%20I%20have%20question%20about`
- The embedded Google map names **Champion Neon Headquarters**. The app opens an HTTPS maps search for that name and Dubai Investments Park 2; it does not invent a street address or require location permission.

## Assets and explicit fallbacks

The source manifest is `src/mocks/sourceManifest.ts`. It records individual service, project, FAQ, testimonial and client sources, dates, treatment and asset references. Capability summaries have separate source mappings. Exact original asset URLs and local filenames are in `src/assets/images/sources.json` and `phase3-sources.json`; the static image registry resolves them without network requests.

Thirteen new assets are bundled. Photos are JPEG at no more than 1200 pixels on the longest edge; newly added logos are PNG at no more than 400 pixels. The complete image folder is approximately 2.4 MB. Local galleries contain no duplicated filler images.

The 12 categories without a dedicated published image use a clearly labelled branded panel rather than unrelated stock imagery. Branding, LED Screens, Exhibitions and Events use their corresponding showcase imagery. The existing Home experience-center image remains a company overview photograph.

The Events page publishes an image whose original filename begins `ChatGPT-Image-Jan-16-2026`. It is included as a **website-published illustration**, explicitly labelled in the gallery, rather than asserted to be an event photograph. The site does not supply named clients, dates, budgets, locations or outcomes for these portfolio entries; the app does not invent them.

No new backend requests are made. External contact actions require an installed handler and, for browser/WhatsApp/maps services, connectivity.

## Extended media audit — 31 October 2026

Rechecked homepage HTML, its Elementor background CSS, the public page/project sitemaps,
all 78 records returned by the public media collection, and the additional
[Signage page](https://championgroup.ae/project/signage/). This page publishes a
Signwall mockup, now bundled as `solution-signage.jpg` (maximum 1200 pixels) and
labelled as an official website mockup, not a completed Champion client installation.

All 16 service cards publish original icons, not dedicated service photographs.
The app now bundles their exact inline SVG paths and Disle font glyph outlines in
`solutionIcons.ts`, replacing generic text-only fallbacks for the remaining 11
categories. Existing relevant photographs remain for Branding, LED Screens,
Exhibitions and Events. Icons are vector assets and preserve their viewBox proportions.
The font-based glyph source is:
https://championgroup.ae/wp-content/plugins/masterlayer-addons-for-elementor/assets/fonts/disle-icons/disle-icons.svg
with class mapping from the adjacent `assets/css/disle-icons.css` stylesheet.
The SVG font identifies IcoMoon generation; no new font dependency was installed.

The current homepage and its page sitemap contain exactly nine client logos and six
testimonials, all already represented. The public media library also contains older
logo assets for White & Velvet, Al Maya, City Centre Deira, Braun, Baskin Robbins,
Al Islami and Chai & Co (plus Kia Motors). Their presence in a media library alone
does not establish a current client relationship. They are not referenced by the
current client section and were not promoted into verified clients. Other reviewed
numbered photos depict gatherings/awards rather than service imagery and were excluded.

All six published testimonial portraits/company images are now bundled alongside
their exact existing attribution and quotes. Images retain their proportions and
are not enlarged during optimization; UI uses 48-point contain-mode frames.
No feedback was invented for clients without testimonials. The new asset manifest
is `src/assets/images/content-update-sources.json` and is included in the typed
source manifest. The earlier 12-missing-images statement is superseded by five
raster-backed categories and eleven original-icon-backed categories.

Validation for this update uses TypeScript, ESLint and focused content/repository/UI
tests only. No native build, bundle export, APK generation, installation or push.
Existing Metro Fast Refresh can pick up these TypeScript and local asset changes.
