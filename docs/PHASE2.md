# Phase 2 — Premium mobile UI

## Implemented scope

- Official-logo native launch surfaces on Android (including Android 12+) and
  iOS; dark React Native splash with a subtle entrance animation.
- LaunchGate uses existing Redux hydration/completion state. There is no timer
  keeping users on the splash: it resolves as soon as preferences are available.
  Failed hydration provides a retry action.
- Three onboarding pages with verified local photography, Skip/Next/Get Started,
  accessible pagination, Android back navigation, save progress, and recoverable
  persistence errors. Completion is persisted through the existing AsyncStorage
  adapter. Relaunch bypasses onboarding after successful completion or Skip.
- Complete Home composition: official-logo header, photographic hero, quotation
  CTA, company introduction, featured solutions, expertise, featured showcases,
  reasons to choose Champion, verified client preview, and contact CTA.
- Existing routes and repository/RTK Query infrastructure are preserved. Home
  catalogue sections consume existing query hooks and expose loading, error,
  retry, and empty states. Company/client/contact/quote destinations retain the
  Phase 1 placeholders; Phase 3 business screens were not implemented.

## UI and assets

The palette remains Champion red #D71D24, dark #171717, and background #F6F6F6,
with bundled Manrope. Accessible secondary tokens are centralized in the design
system. New reusable primitives include BrandLogo, BrandImage (with failure
fallback), and FadeIn. Home owns reusable section headings and showcase cards.

Content adapts from one column to multiple columns at 680 points, with a maximum
content width. Onboarding content scrolls independently from safe-area-aware
controls. Home honors horizontal safe areas and the navigation tab bar. Text
supports platform scaling, interactive controls have generous touch targets,
and entrance motion respects the system reduced-motion setting. Home uses a
focus-aware light status bar; other routes restore the existing dark bar.

All eight images are local. Source URLs and processing notes are recorded in
`src/assets/images/sources.json`. Official assets were read from
[Champion Group](https://championgroup.ae/) and its
[LED Screens showcase](https://championgroup.ae/project/led-screens/).
ADNOC, Super General, and Jumbo logo identities were visually verified against
those website assets. The logo artwork is preserved; only transparent margins
were trimmed. Photos are bounded to 1200 pixels and WebP assets are converted
for consistent native usage. The image set is approximately 1 MB.

Portfolio entries remain explicitly described as showcases. No client-specific
project outcomes, dates, awards, counts, or prices were invented. The imagery
contains actual branding present in the source photos; it is not supplemented
with speculative client/project metadata.

## Native changes

Android adds a dark window background and official-logo launch drawables, plus
Android 12+ splash-theme attributes. iOS replaces the starter launch labels with
an official-logo image asset on a dark background. No native dependency,
signing setting, application ID, SDK level, or release configuration changed.
No package dependencies were added or removed.

## Validation

- TypeScript: passed.
- ESLint: passed without warnings.
- Jest: 6 suites, 22 tests passed (all existing tests retained).
- Added tests cover hydration/splash, all onboarding pages, selected pagination,
  persisted completion/relaunch, Skip retry on write failure, hydration retry,
  Home empty/error/retry states, and Home company/client/contact navigation.
- Native XML and storyboard syntax: validated.
- Android and iOS Metro development bundles: passed (assets copied successfully).
- Android `:app:assembleDebug`: passed in 1m 11s after providing an explicit
  Node PATH to a fresh Gradle process.
- APK: `android/app/build/outputs/apk/debug/app-debug.apk`.
- No native iOS build was run.

There was no connected Android device or configured Android emulator. iOS
simulators are installed, but a native iOS build/interactive visual smoke test
was not run. JS navigation tests do not substitute for on-device font, gesture,
large-text, and visual acceptance checks.

The standard debug APK uses Metro (`npm start`) for its development bundle.
Once loaded, core content, imagery, preferences, and mock queries need no backend
or internet connection. Release builds and distribution were not performed.
