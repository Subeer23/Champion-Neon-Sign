# Phase 1: Enterprise architecture foundation

## Scope

React Native CLI 0.88.1 and React 19.3.0 are retained. This phase provides typed
navigation, a small local catalogue, reusable UI primitives, persistence, and
replaceable data access. Screens are placeholders, not completed business flows.
There is no authentication, commerce, quotation submission, or real API traffic.

## Structure and ownership

| Directory           | Responsibility                                                       |
| ------------------- | -------------------------------------------------------------------- |
| `src/app`           | Composition, providers, dependency creation, navigation, Redux store |
| `src/core`          | HTTP client, normalized errors, storage contracts/adapters           |
| `src/design-system` | Brand tokens, typography, buttons, cards, headers                    |
| `src/features`      | Feature models, repositories, query endpoints, screens               |
| `src/shared`        | Screen/state primitives and typed React Hook Form field              |
| `src/mocks`         | Small verified fixture subset and content provenance                 |
| `src/assets`        | Licensed local Manrope fonts                                         |
| `src/test`          | Isolated stores, repository, persistence, and navigation tests       |

Data flow: screen → generated RTK Query hook → feature endpoint → injected
repository. Mock repositories return copied local data. API repositories accept
an Axios instance, forward AbortSignals, and validate unknown responses with Zod.
Domain models and repository interfaces have no React, Redux, or Axios dependency.

`createAppStore(dependencies)` injects repositories/storage through the thunk extra
argument. `RootState`, `AppDispatch`, and typed Redux hooks derive from the store.
RTK Query is the only owner of catalogue caches. The onboarding slice stores only
completion, hydration/saving status, and storage errors. Preferences use the
AsyncStorage 3 named database API with a versioned key; no personal data is stored.
The onboarding presentation is deferred, so hydration does not gate navigation.

## Future API integration

`src/app/config/dataConfig.ts` defaults to `{mode: 'mock'}`. There is no API host
or user-facing mode switch. API mode requires an explicit HTTPS base URL; the
Axios client is not constructed in mock mode. `/solutions` and `/projects` are
proposed contracts, not verified Champion endpoints. Agree real DTOs/endpoints
and update repository schemas/mapping before enabling API mode. Do not add HTTP
calls directly to screens or duplicate RTK Query data in slices.

## Navigation

The root native stack contains MainTabs, SolutionDetails, ProjectDetails, AboutUs,
Clients, FAQs, ContactUs, GetQuote, and GalleryViewer (modal). MainTabs contains
Home, Solutions, Projects, and More. Routes carry IDs, not cached entities.
Details fetch by ID. Quote placeholders display selected context without a form
submission. Galleries deliberately show an empty placeholder until verified
images are approved. More links to every company/contact destination.

## Dependencies and compatibility

Exact newly installed runtime versions:

| Package                                   | Version |
| ----------------------------------------- | ------- |
| @react-navigation/native                  | 7.5.1   |
| @react-navigation/native-stack            | 7.21.0  |
| @react-navigation/bottom-tabs             | 7.21.0  |
| react-native-screens                      | 4.30.1  |
| @reduxjs/toolkit (includes RTK Query)     | 2.13.0  |
| react-redux                               | 9.3.1   |
| axios                                     | 1.21.0  |
| @react-native-async-storage/async-storage | 3.1.1   |
| react-native-svg                          | 15.16.0 |
| react-hook-form                           | 7.91.0  |
| zod                                       | 4.6.7   |

Existing safe-area-context 5.11.0 remains resolved in the lockfile. No Reanimated,
Gesture Handler, UI kit, Expo runtime, or separate RTK Query package was added.
React Hook Form has a generic controlled TextField primitive; the business form
is deferred. The unused starter new-app-screen dependency is removed.

Peer metadata was checked before installation. Native compatibility references:

- [Screens Fabric support](https://github.com/software-mansion/react-native-screens#supported-react-native-version): 4.26+ lists RN 0.84+.
- [SVG support](https://github.com/software-mansion/react-native-svg#supported-react-native-versions): 15.16+ lists RN 0.80+.
- [AsyncStorage requirements](https://github.com/react-native-async-storage/async-storage#compatibility): RN 0.76+, Android SDK 24+, iOS 13+, Kotlin 2.1+.
- [Navigation installation](https://reactnavigation.org/docs/getting-started/): native dependencies and Android setup.

These support ranges and successful resolution are not a substitute for device
testing on the exact application toolchain.

## Documented native/configuration adjustments

- MainActivity registers `RNScreensFragmentFactory` before `super.onCreate` for
  fragment restoration, following the navigation installation instructions.
- Android predictive-back callback is disabled per the same instructions.
- Kotlin is aligned from 2.2.0 to 2.2.10: the build resolved Kotlin 2.2.10 while
  AsyncStorage selected KSP for the old root version. Matching the declared
  Kotlin version allows AsyncStorage to select its matching KSP version.
- Three Manrope font assets are copied to Android assets and registered in iOS
  resources/`UIAppFonts`. See `src/assets/README.md` for source and licenses.
- CocoaPods links AsyncStorage, RNScreens, and RNSVG and updates Podfile.lock.
- Babel's namespace-export transform is pinned as a dev dependency because
  Metro exposed Zod 4's ESM namespace exports as unsupported by the base preset.

Signing, application IDs, SDK levels, Hermes, New Architecture, and release
settings are preserved. No release build or GitHub push is part of this phase.

## Validation commands

```sh
npm ci
bundle exec pod install --project-directory=ios
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

For Android, set `ANDROID_HOME` to the local SDK, then run
`./gradlew :app:assembleDebug` from `android/`. The existing project requires
compile SDK 37, Build Tools 37.0.0, target SDK 36, and NDK 27.1.12297006.
No SDK downgrade is used to work around a missing local installation.

Tests use the real navigation tree with native safe-area/storage mocks, fake
timers, explicit unmounting, and isolated stores. Axios contract tests use
in-memory adapters and never contact a server. Native touch/gesture behavior and
font rendering still require a device/simulator smoke check.

## Validation results

- TypeScript (`npm run typecheck`): passed.
- ESLint (`npm run lint`): passed with no warnings.
- Jest: 5 suites, 16 tests passed, including the original render test.
- Real navigator tests cover solution/project details, quotation context, gallery
  presentation/back, and all More destinations.
- Repository tests cover cache reuse, injected failures/retry, missing IDs,
  cancellation, defensive copies, API schema validation, and zero HTTP-client
  creation in default mock mode.
- Onboarding tests cover persistence across stores and failed writes.
- Android and iOS Metro development bundles: passed, written only to `/tmp`.
- CocoaPods installation and code generation: passed; native modules linked.
- iOS plist/project syntax, dependency lock consistency, and font-copy checks: passed.
- Native iOS build and device/simulator visual checks: not run in this phase.

Android native debug build: **passed** (`:app:assembleDebug`, all configured ABIs).
APK: `android/app/build/outputs/apk/debug/app-debug.apk`. The first build installed
the required SDK 37 tools and downloaded native artifacts. No release build was
created, signing configuration was unchanged, and no code was pushed.
