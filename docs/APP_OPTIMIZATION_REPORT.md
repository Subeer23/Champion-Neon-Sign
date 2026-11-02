# Champion Group application optimization and release audit

Date: 2026-11-02

## Scope and result

Audited the Phase 1–4 React Native application and inspected the Android source
configuration. Implemented targeted JavaScript/TypeScript fixes while preserving
branding, layouts, verified imagery, demo credential hashing and local-account
behavior. No Android/iOS build, Gradle task, Xcode command, package generation,
installation, signing change, dependency installation or push was performed.

This is a candidate for release testing, **not a certified release**. Android
release signing still references the debug signing configuration. That must be
resolved separately before distributing a client release. Native configuration
was inspected only and remains unchanged.

## Module audit

| Area | Findings and disposition |
| --- | --- |
| Splash / startup | Animation and minimum-duration timers clean up; accessibility subscriptions and animation completion use mounted guards. Storage initialization has retry UI. Added overlapping hydration guards and an outer render-error boundary. Existing three-second branded splash duration preserved. |
| Onboarding | BackHandler subscription removed on unmount; responsive controls retained. Added store-level prevention of overlapping completion writes. |
| Welcome / Login / Sign Up | Shared press guards prevent immediate repeated actions. Login/signup continuations check mounted and focused state after account work before changing screens. No passwords moved into Redux or logs. |
| Forgot / OTP / Reset | Mounted/focus checks after async work. Missing OTP route state now offers a reset restart. Existing bounded, expiring local challenges and reset validation retained. |
| Home | Bounded preview collections retained. Menu/profile and showcase navigation guarded against repeated taps; existing safe-area and motion behavior retained. |
| About | Static bounded content, no asynchronous work or large lists requiring virtualization. No gratuitous memoization added. |
| Solutions / Projects | Existing FlatList virtualization retained. Extracted memoized catalog rows with stable selection/render callbacks and key extraction; search/filter changes no longer rerender surviving unchanged cards. |
| Solution Details | Memoized related-project filtering and image-ID aggregation; missing route ID follows the existing repository error/empty UI instead of dereferencing absent parameters. |
| Project Details | Subscribe only to account ID and the current project's saved flag. Deduplicate/cache gallery IDs; absent route parameters handled defensively. |
| Gallery / media carousel | Stable deduplicated image arrays, bounded one-image initial rendering and small windows. Carousel renderer stable between page-index updates. Width clamped positive; gallery remount key includes project/image identity, preventing stale data when same-length galleries change. Pagination targets enlarged to 44pt. |
| Clients | Nine static logos: retaining the existing compact grid avoids nested virtualization complexity. Existing source/fallback behavior reviewed. |
| Testimonials | Six static cards, bounded local images. Existing ScrollView is appropriate for this data size. |
| FAQs | Finite static accordion/search retained. No timers, async work or large collection issue found. |
| Get a Quote | Previous independent-field memoization, fixed selection CTA, validation, account isolation and duplicate submission protection retained. Save/auth continuations now check mounted/focused state. Missing draft route records display an unavailable message rather than silently creating another request. |
| My Quotations | Existing virtualized account-specific history and concise View demo action retained. No remote processing state fabricated. |
| Profile | Subscribe to profile and displayed counts instead of all quotation/notification contents; editing a quote without changing the count does not need to refresh Profile. |
| Edit Profile / Change Password | Field state retained; narrowed snapshot subscriptions and protected post-await UI updates. Existing validation and credential handling unchanged. |
| Saved Projects | Subscribe only to account ID and saved IDs. Existing virtualized list and unavailable-project fallback retained. |
| Notifications | Subscribe only to account ID, notifications and preference. Protect delayed navigation after marking an item read. Existing list windows retained. |
| Settings | Subscribe only to account ID and notification preference. Clear-data recovery now finds orphaned quote documents, including when the database is corrupted/unhydrated. Cleanup failures are reported and can be retried. |
| Help / Contact | Shared contact-action error handling retained; Contact now uses synchronous ref locking through useAsyncAction rather than a state-only busy check. Overlapping external-app launches are prevented. Phone/email availability and HTTPS browser/Maps fallbacks covered by tests. |
| Global navigation / errors | Guarded shared buttons, back/close icons, auth links, account rows, catalog selection and key Home actions. Render/lifecycle errors have a restart-view fallback without clearing storage or exposing raw error text. Async event errors still use explicit action/query error UI. |

## Root causes and implemented changes

1. Catalog `renderItem` recreated entire card subtrees on every search update.
   A memoized row is useful here because RTK Query retains item identity; stable
   layout props and callbacks allow surviving cards to bail out. This is not
   blanket memoization of every component.
2. Full-account subscriptions refreshed profile forms, settings, saved projects
   and project details for unrelated quotation/notification operations. Narrowed
   selectors now return stable fields, IDs, counts or a boolean for the current
   saved project.
3. Busy React state is not a synchronous lock. Contact and shared press targets
   could process multiple taps before rerender. Added synchronous guards with
   cleanup of their short 350ms timers; async work also retains its own ref lock.
4. Several repository operations could complete after leaving a screen, then
   replace routes or update local UI. useAsyncAction now refuses work after
   unmount and supplies an activity check; affected continuations also check
   navigation focus before UI/navigation changes. Storage transactions finish
   atomically rather than being abandoned halfway through a commit.
5. Missing route state could be dereferenced in details/gallery/reset screens.
   Added defensive ID access, an explicit OTP restart, and an unavailable-draft
   fallback. Existing repository missing-record states remain in use.
6. The app had no outer boundary for render/lifecycle exceptions. Added a generic
   restart-view fallback; it does not log raw errors, erase saved data, or claim
   recovery of unsaved form input. Native crashes and out-of-memory termination
   are outside React error-boundary coverage.
7. Clear demo data previously knew only currently loaded document keys and
   silently ignored deletion failures. It now enumerates versioned quote keys
   in the existing storage namespace, resets the database, attempts every
   deletion, and rejects partial cleanup so the user can retry. This also removes
   abandoned staged revisions without needing to parse damaged account JSON.
8. Removed the unused generic TextField primitive. A repository-wide reference
   search found no application/test callers; actual authentication and quotation
   inputs continue using the existing production form primitives. Historical
   Phase 1 documentation remains an account of that earlier implementation.

## Asset and memory audit

The reproducible source inventory is in `APP_ASSET_AUDIT.json`, including paths,
encoded byte counts, dimensions and SHA-256 hashes.

- 29 raster source assets, totaling **2,171,631 bytes**.
- Largest encoded file: `experience.png`, **295,239 bytes**, 1024 × 524 pixels.
- Every audited raster image has a longest side of at most **1024 pixels**.
- All 29 hashes are different: no byte-identical raster duplicates found.
- Photos are already bounded for mobile use. No lossy recompression or dimension
  reduction was justified without a verified quality benefit; official logo
  sharpness, transparency and image provenance were preserved.
- `events-illustration` and `exhibition-stand-b` are intentionally excluded from
  the runtime image registry, as documented by Phase 3. Their archival source
  records/files are not runtime imports and were retained as provenance; deleting
  them would not reduce the shipped image set.
- BrandImage already requests Android resize decoding and disables image fades.
  Added a visible fallback when a source is absent/empty, in addition to its
  existing load-failure fallback and reset when the source changes.
- Account lists are bounded (500 quotations/notifications per account) and
  virtualized. Catalogs are virtualized; small static company sections and Home
  previews remain bounded. No same-axis nested account/catalog FlatLists added.

Encoded bytes are not decoded bitmap memory, APK size, native heap usage or PSS.
No device memory, frame-time or battery measurement was taken in this session.

## Actual measurements

Controlled react-test-renderer counters, not FPS or timing benchmarks:

| Scenario | Before | After | Evidence |
| --- | --- | --- | --- |
| Two catalog rows rendered, then search retains one row | 3 cumulative icon renders (2 initial + 1 survivor rerender) | 2 cumulative renders (no survivor rerender) | Ran identical instrumentation against HEAD's pre-audit CatalogList and the updated component; temporary baseline copy removed afterward. Permanent regression: catalogRendering.test.tsx. |
| Three immediate presses on one shared button | Existing handler directly forwarded each event; no added numeric baseline claim | 1 callback; another allowed after 350ms | appReadiness.test.tsx |
| Two overlapping contact launch requests | State-only guard could race; no numeric baseline recorded | 1 Linking.openURL invocation | appReadiness.test.tsx |
| Two overlapping onboarding/session requests | No store-level single-flight condition | 1 persistence invocation in each tested scenario | appReadiness.test.tsx |

Earlier Phase 4 regression counters also remain: unchanged draft/duplicate submit
produce zero writes; unrelated profile subscribers and unchanged input siblings
retain their render counts. Those are previous-phase results, not newly invented
app-wide measurements.

## Files modified in this audit

- App composition: `src/app/App.tsx`;
  `src/shared/errors/AppErrorBoundary.tsx` (new).
- Input/event lifecycle: `src/shared/hooks/usePressGuard.ts` (new),
  `useAsyncAction.ts`; design-system `Button.tsx`, `BrandImage.tsx`;
  shared `IconButton.tsx`.
- Lists/media: shared `CatalogList.tsx`, `MediaCarousel.tsx`;
  SolutionsScreen, SolutionDetailsScreen; ProjectsScreen,
  ProjectDetailsScreen, GalleryViewerScreen.
- Auth/profile/account: AuthPrimitives, AuthScreens, authSlice,
  AccountPrimitives, AccountCollectionScreens, AccountSettingsScreens,
  ProfileFormScreens, ProfileScreen, LocalDemoRepository.
- Startup/home/contact: onboardingSlice, HomeScreen, ShowcaseCard,
  ContactUsScreen.
- Deleted unused file: `src/shared/forms/TextField.tsx`.
- Validation: `src/test/appReadiness.test.tsx` (new),
  `catalogRendering.test.tsx` (new), `demoTestStorage.ts`.
- Reports: this file and `docs/APP_ASSET_AUDIT.json`.

## Validation

Commands (JavaScript/TypeScript only):

```sh
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

Final validation results:

- TypeScript: passed (`tsc --noEmit`).
- ESLint: passed with no errors or warnings.
- Jest: **19 suites, 119 tests passed** (109 existing + 10 added regressions).
- `git diff --check`: passed.
- Separate temporary pre-audit/updated catalog counter comparison: passed; the
  temporary baseline files were removed after measurement.
- No automated JavaScript checks were blocked. Native builds, Android lint/R8,
  real-device profiling and release installation were intentionally not run.

Coverage includes existing authentication/session persistence, profile updates,
password hashing, account isolation, legacy credential formats, storage
corruption/failures, quote/draft storage/restoration, duplicate submissions,
guest-to-login transitions, navigation and image fallback tests. New regressions
cover event coalescing, unmounted async continuations, render-error recovery,
missing OTP route state, absent image sources, catalog survivor renders,
corrupted/unhydrated data reset, orphan document removal and cleanup retry.

## Android release configuration: inspected, not changed

| Check | Source findings / required verification |
| --- | --- |
| Signing | **Release currently uses debug signing. Distribution blocker.** No credentials, keystores or signing configuration changed. A delivery signing configuration requires a separate approved native change. |
| Hermes | `hermesEnabled=true`; Hermes dependency is selected. Actual release Hermes startup and minified-JS behavior remain untested. |
| New Architecture | Enabled; MainApplication uses the default ReactHost and autolinking. Native module compatibility must be verified on the installed release binary. |
| R8 / ProGuard | Release minification flag is false; project ProGuard file has no custom keep rules. No keep-rule or obfuscation correctness claim is possible without enabling and testing it separately. |
| Resource shrinking | No `shrinkResources` configuration found. Native size optimization is deferred; changing this would require approval and a later release build. |
| Permissions | Main manifest declares INTERNET. Phone/email/HTTPS package queries are present; no contacts/location/storage permissions requested by that manifest. Final merged manifest still needs verification. |
| Networking | Main manifest uses the Gradle plugin's `usesCleartextTraffic` placeholder. Installed plugin source sets release to false, debug to true. Current data configuration is mock/offline and does not instantiate an HTTP client. API mode requires explicit HTTPS and is not a live backend. |
| Package/version | Namespace/application ID `com.championneonsign`; Android versionCode 1, versionName 1.0. JS package version is 0.0.1, so Settings and native package versions are inconsistent. Native/version alignment is deferred. |
| Launcher/splash | Branded density/adaptive icons, native launch drawables, Android 12+ splash theme and Manrope font resources exist. Resource compilation and final launcher/splash appearance unverified. |
| Back/keyboard | Manifest uses adjustResize and has predictive-back opt-out. MainActivity installs RNScreensFragmentFactory before super.onCreate. Existing values unchanged; process death, back gestures and edge-to-edge require Android device testing. |
| Debug paths | No explicit debugImplementation dependencies or app console logging found. Default release bundling is not listed as a debuggable variant. Metro independence, source-map handling, merged permissions and final dependency contents still require release verification. |
| Architectures/toolchain | Four ABIs configured; SDK/build-tools/NDK values are explicit. ABI size, toolchain availability and final compilation not verified. No ABI pruning performed. |

## Remaining risks

- No Release APK was built or installed. Signing, resource compilation,
  native-module initialization, offline JS bundle startup and release-only
  failures remain unverified. A passing debug session is insufficient evidence.
- No hardware profiling: no claims about FPS, cold-start speed, memory peaks,
  thermal behavior, ANRs, battery impact or APK size reduction.
- Storage/account credentials are a device-local demonstration system, not a
  production authentication/backend service. Demo labels and required consent
  remain visible; no real quote delivery or company processing is fabricated.
- Accounts are loaded/validated together. Very large multi-account histories
  still need a real-device stress run. No breaking persistence rewrite added.
- Immutable-document housekeeping after a successful commit remains best-effort;
  interruption can leave unreferenced revisions. Clear demo data now enumerates
  those revisions and reports failed deletion instead of silently succeeding.
- Async operations are not forcibly cancelled halfway through durable account
  mutations. Their screen continuations are guarded; committed changes remain
  available after a restart.
- No real external-app launches or unavailable-handler scenarios were tested on
  physical Android hardware; Linking behavior was tested with mocks.

## Manual Android release-device checklist

1. After signing is configured and a release build is separately authorized,
   cold-launch with Metro unavailable and airplane mode on. Confirm native splash,
   Manrope fonts, branded icons, no white flashes, and all bundled company media.
2. Fresh install: complete/skip onboarding; revisit after a force-stop. Repeat
   with large font size, dark/light system appearance and rotation.
3. Register two sample accounts; login/logout/restart; verify profile updates,
   password change, OTP expiry/reset, invalid credentials and account isolation.
4. Guest: browse every tab and detail; start a quote; enter data; Login/Sign Up;
   confirm draft restoration. Cancel/retry authentication without losing input.
5. Save incomplete drafts, restart, resume, review, submit rapidly and confirm one
   record/notification. View/cancel/delete requests; verify missing/deleted IDs.
6. Rapid-tap catalog cards, shared CTAs, account rows and back/close controls.
   Exercise Android hardware back, edge-swipe, modal gallery close and keyboard
   back. Check that no duplicate screen or delayed navigation appears.
7. Search/filter all catalogs and FAQs; verify selection, empty/error states,
   image aspect ratios, gallery orientation and large-text clipping.
8. Save/unsave projects; toggle/read notifications; clear demo data and retry
   storage failures. Verify accounts and orphan quote records do not reappear.
9. Launch phone, email, WhatsApp, Maps and website actions with handlers installed
   and unavailable; confirm errors remain usable and contacts are unchanged.
10. Profile startup, scrolling, keyboard, image galleries and 500-entry histories
    on a lower-memory Android device. Record JS/UI frame traces and native/PSS
    memory before claiming performance targets. Background/restore and simulate
    process death; inspect Android crash/ANR logs without exposing sample secrets.
11. Inspect the release package's signing certificate, merged manifest, ABI/native
    modules, bundled JS/assets, resource shrinker behavior and actual version.
