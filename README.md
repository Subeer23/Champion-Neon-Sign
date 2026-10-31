# Champion Group mobile demo

React Native CLI 0.88.1 / React 19.3.0, with a strict TypeScript foundation.

Phase 2 adds branded launch screens, persisted onboarding, and a complete corporate
Home experience over the Phase 1 repositories, RTK Query, and design system.
The app uses local mocks and makes no application API requests. Remaining business
screens and quotation submission await Phase 3 approval.

## Setup

Use Node 22.11 or newer and the native toolchain required by React Native 0.88.1.

```sh
npm ci
bundle exec pod install --project-directory=ios
npm start
```

In another terminal, run `npm run android` or `npm run ios`. Android requires
`ANDROID_HOME` pointing to the installed SDK. The existing project uses compile
SDK 37, Build Tools 37.0.0, target SDK 36, and NDK 27.1.12297006.

## Checks

```sh
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

## Architecture

See [the Phase 2 UI guide](docs/PHASE2.md) for the new experience and validation.
See [the Phase 1 guide](docs/PHASE1.md) for folder ownership, dependency versions,
repository injection, navigation, native adjustments, and validation results.
See [asset notes](src/assets/README.md) for Manrope font provenance and licenses.

The root `App.tsx` forwards to `src/app/App.tsx`. Features live in `src/features`;
shared visual primitives belong in `src/design-system`. API endpoints in the
inactive Axios repositories are proposals and must be agreed before API mode is
enabled. Never add direct HTTP requests to screens.
