# Phase 3 — Website-accurate mobile experience

Phase 3 extends the existing React Native CLI 0.88.1 architecture, strict TypeScript, Redux Toolkit, RTK Query, typed navigation, repository injection and local mock mode. No dependencies were added.

## Delivered

- **Solutions:** all 16 website categories and original descriptions; responsive virtualized catalog, search, loading/retry/empty states and accessible card actions.
- **Solution details:** typed ID lookup, official relevant imagery or labelled fallback, published description, supported capabilities, related showcases, quotation context and contact CTA.
- **Projects:** four official service showcases; searchable catalog and combinable category filters. No fictional case-study metadata.
- **Project details:** source-based descriptions, image previews, related solutions, quotation context and full-screen gallery.
- **Gallery:** swipe paging, valid initial-index handling, counter, contain-mode image scaling, safe areas, accessible close icon and existing native back-stack behavior. Distinct bundled images only. Website illustration explicitly labelled.
- **About:** verified company introduction, since 1989, expertise, craftsmanship and contact/solutions actions.
- **Clients:** nine proportional logo tiles and all six published testimonials with their original attribution.
- **FAQs:** all ten official questions/answers with search and accessible expandable controls. No new animation dependencies.
- **Contact:** verified details/hours, call, email, official WhatsApp URL, maps search and quote action. Availability checks and recoverable failures; no calls/messages are sent automatically.
- **Global headers:** SVG chevron replaces visible Back text, 44×44 touch target, screen-reader label and existing safe-area handling. Gallery uses one close icon and no duplicate stack header.
- **Quote:** remains the existing typed placeholder, explicitly identified as unfinished until Phase 4.

Home's existing featured subset and presentation remain intact when the repositories expand to all services. Its project cards now naturally reflect the audited summaries.

## Structure and provenance

Solutions and projects continue through the mock repositories and RTK Query. Domain/API schemas accept optional media/source metadata without breaking existing API contracts. Company content is a typed local fixture, outside screens. See [website audit](WEBSITE_CONTENT_AUDIT.md) for verification, content gaps, asset treatment and the source manifest.

Reusable catalog, search, media and icon controls live under `src/shared/components`. Catalog filtering is a pure shared utility. Contact link opening lives in the Contact feature's service layer. Lists are virtualized and filtered with memoization; images are local and optimized. No server cache is duplicated in Redux slices.

## Native adjustments

Only contact availability declarations were added: Android manifest package-visibility queries for `tel`, `mailto` and HTTPS; iOS `LSApplicationQueriesSchemes` for `tel` and `mailto`. These support React Native Linking checks, as documented in https://reactnative.dev/docs/linking. No signing, SDK versions, app IDs or permissions were changed.

Android edge-to-edge remains enabled. Tab screens do not add a second bottom safe inset; root detail screens retain their bottom safe area, while gallery owns all four edges. Native navigation continues to handle Android hardware back.

## Validation

- TypeScript: passed.
- ESLint: passed without warnings.
- Tests: 43 passed across eight suites, including existing tests, all 16 detail routes, quote context, catalog filters, gallery paging/close, FAQ expansion, local-media coverage, contact failure/recovery and shared safe-area ownership.
- Android and iOS Metro development bundles: passed with bundled assets.
- Native manifest/plist XML and whitespace checks: passed.
- Android `:app:assembleDebug`: successful (13 seconds).
- APK: `android/app/build/outputs/apk/debug/app-debug.apk`.

The standard debug APK requires Metro (`npm start`). Core content and images do not require internet or a backend once the app is loaded; this is not a standalone production bundle.

No Android device was connected and no AVD was configured. Physical-device visual checks, actual external app launches, gesture/hardware-back behavior and runtime edge-to-edge acceptance remain unverified. Native iOS compilation was not performed; iOS JS bundling passed. Automated tests verify behavior but do not replace device presentation review.

No release build, GitHub push, authentication, payments or Phase 4 quotation implementation was performed.
