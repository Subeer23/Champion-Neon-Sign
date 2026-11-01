# Reference UI and demo authentication — 1 November 2026

The supplied Phase 1 Authentication Flow and Phase 2 Main App Screens images
were used as layout references. Gold becomes Champion red (#D71D24), with
#101010 backgrounds, #1C1C1C/#252525 surfaces, white text, #B5B5B5 secondary text,
#333333 borders and existing Manrope fonts. Small links use a lighter red for
readability. The official wordmark replaces the fictional star emblem. Earlier
UI screenshots/documents describe previous compositions.

## Screen coverage

| Reference | Implementation |
| --- | --- |
| Splash | Centered official logo, exhibition photography, dark gradient, subtle reveal; no artificial delay or progress. |
| Onboarding 1–3 | LED, facade signage and exhibition photographs; upper copy, red emphasis, Skip, dots, circular Next and persisted completion. |
| Welcome | Company photograph, logo, signup/login and guest entry. |
| Login / Sign Up | Shared dark icon fields, password visibility, validation, red buttons; signup demo acknowledgement. |
| Forgot Password | Lock emblem and email field; local demo challenge only. |
| OTP Verification | Six input cells, full-code paste, resend and explicit demo code/expiry. |
| Create New Password | Four password rules, confirmation and reset preview. |
| Password Changed | Success emblem, explicit demo completion and return to Login. |
| Login Success / Home Preview | Logo, greeting, project photograph and entry to main app. |
| Home | Centered logo, menu/profile, cinematic hero, compact solution cards, project grid, clients and quotation actions. |
| About | Company-premises photograph, highlighted heading and verified facts. |
| Solutions / Details | All 16 services, search, icon/text/photo rows, swipeable detail photos, capabilities and related showcases. |
| Projects / Details | Filters, responsive two-column cards, swipeable photos, overview, related services and full-screen gallery. |
| Clients | All nine existing verified client logos, uncropped on white plates. |
| Contact | Icon/action rows with verified Call, WhatsApp, Email and Maps links. |
| Get a Quote | Local form, service selector, preview and contact CTA for actual inquiries. |
| Profile | Demo/guest identity, expandable account rows, projects and logout. |

Five tabs follow the reference: Home, Solutions, Projects, Clients, Contact.
More, About, Testimonials and FAQs remain available through Home's menu;
Profile is available from Home and More. Existing search, filters, gallery,
contact errors, nine clients, six testimonials and 16 solution routes remain.
Responsive dimensions and scrollable forms replace fixed screenshot coordinates.

## Mock behavior

AuthRepository and DemoAuthRepository provide typed local behavior. Login accepts
any valid-format sample email with eight password characters; no account lookup
occurs. Signup validates name/email and four password rules. No credentials or
profile are saved in Redux or persistent storage. Form inputs remain in component
memory; challenge state contains no credentials.

The displayed OTP is 123456, expires after five minutes and permits five attempts.
Resend invalidates the previous challenge. Reset requires verification and consumes
the challenge once; it changes no real password. Social controls are explicitly
unavailable and send no requests.

Only onboarding completion and a guest/demo access flag persist. First launch
runs onboarding then Welcome. Later launches resume that local mode. Logout
clears the flag and returns to Welcome, preserving onboarding completion. Storage
failures display retryable messages rather than claiming successful saves.

Quote details stay in screen memory. Preview Request neither submits nor saves
anything. Profile rows explain the demo limitations; no fake accounts, inquiries
or notifications. No backend, real OTP, reset email or social-login integration.

## Photography and branding

Reused optimized bundled official-site images; no new image bytes or dependencies.
Exact source URLs remain in src/assets/images/sources.json,
content-update-sources.json and visual-selection-sources.json. Screen assignments
in the latter were updated.

- Splash, onboarding 3 and demo preview: exhibition (official homepage).
- Home hero: exhibition-stand-a (official Exhibition Stands project page).
- Onboarding 1: led (official LED project imagery).
- Onboarding 2: events-showcase (official Events gallery facade signage).
- Welcome and About: experience (official company-premises image).

Nine services remain icon-led where verified category-specific photos are absent.
No Instagram assets were retrieved; the earlier documented access limitation
remains. No restricted scraping or unrelated stock imagery. No fictional project
names, client associations, statistics or specifications were copied from the
concepts. Backdrops use cover; logos and detail/gallery photos use contain.

## Modified files and architecture

- src/features/auth/: typed repository/provider, Redux access slice, reusable
  form primitives and eight auth routes (plus existing splash/three onboarding).
- src/features/profile/screens/ProfileScreen.tsx: local profile and logout.
- src/features/onboarding/: splash composition and three onboarding layouts.
- src/features/home/, company/, contact/, quote/, solutions/, projects/:
  reference-oriented compositions preserving existing feature actions.
- src/shared/components/: CinematicBackdrop, LineIcon, SolutionIcon,
  MediaCarousel, CatalogList and keyboard-aware Screen.
- src/design-system/: palette, aligned Header and Button variants.
- src/app/ and src/core/storage/: routes, tabs, launch gate, provider, theme,
  Redux integration and access-mode persistence.
- src/test/: updated navigation expectations and demoAuth.test.tsx coverage.

The existing feature-based directory structure remains. Carousels use paged
FlatLists with fixed layouts, small render windows and no autoplay. No speculative
memoization or new dependencies. Unused Home content arrays were removed.

## Validation and remaining device checks

TypeScript and ESLint pass. Jest: 72 tests across 13 suites pass. Coverage includes
16 solution routes, gallery/contact navigation, onboarding persistence, demo
login/signup/reset/logout, expiry/replay/resend/attempt limits, storage failures
and quote validation without persistence.

Read-only branding validation passes: 18 opaque iOS icon slots, 15 Android density
images, adaptive resources and native XML syntax. Previously prepared native
assets were not changed in this pass; they require a future authorized rebuild
to appear on the installed app.

No Android/iOS builds, Gradle, Xcode, reinstall, artifacts, dependency installation
or GitHub push were performed.

Physical-device comparison remains required: small/large screens, large font
settings, keyboard movement, reduced motion, safe areas, Android Back, gallery
swipes, cold/warm launch and actual dialer/email/WhatsApp/Maps handoff. Splash may
be brief when storage hydrates quickly; it is not artificially held. Renderer
tests do not establish pixel-perfect device fidelity or measured frame-rate gains.
