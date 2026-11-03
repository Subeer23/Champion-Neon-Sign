# Automatic cinematic Founder Journey

Implemented 2026-11-03. This supersedes the earlier Home Spotlight requirement.

## Startup and content

Existing Splash → FounderCinematicScreen → unchanged onboarding/auth/guest/account
branch in LaunchGate. Only an in-memory completion flag is added to LaunchGate;
there is no new persistence key or mutation of session/onboarding state. A fresh
app/JS-root launch plays it again. Ordinary renders, navigation and foreground
resumption do not replay it. Fast Refresh may preserve in-memory state, so a full
JS reload is the appropriate non-build fresh-launch check during development.

Home has no Founder Spotlight or founder CTA. The pre-spotlight Home layout,
hero, solutions, work, clients and existing CTAs are retained. About continues to
link to the manual Founder Journey with complete references.

The cinematic reuses founderContent: introduction, all nine verified narrative
sections, all six sourced timeline entries and a non-biographical conclusion.
No new biographical facts, achievements or quotations were added. Per-block
attribution is shared with the manual screen. Full source metadata and unresolved
source discrepancies remain in PHASE5_FOUNDER_SOURCES.md.

The genuine user-supplied portrait is reused; source/permission provenance stays
in founder-portrait-source.json. Its initials fallback now preserves the portrait
frame's dimensions so a load failure does not collapse the cinematic layout.

## Playback mechanics

- A single requestAnimationFrame loop drives imperative ScrollView.scrollTo calls.
  Scroll commands use animated:false because the controller itself provides
  small frame-by-frame increments; competing native scroll animations are not
  continually restarted.
- All 17 content blocks, content height and viewport height must be measured
  through actual layout events before auto-play begins. There are no assumed
  device/screen heights or guessed target section offsets.
- Layout changes update measured targets and preserve the current section and
  offset. No resize effect replays the entire story.
- Travel is 32 layout points/second; a tall section is traversed at 26 points/second.
  Reading holds use max(5.5 seconds, word count × 320ms), including a small
  attribution allowance. Tall blocks receive an additional ending hold before
  progressing. These are playback settings, not measured user reading speeds.
- Frame deltas are capped at 64ms to prevent a delayed/background frame from
  becoming a large position jump. The player never overscrolls the measured end.
- React state updates only for readiness, playback controls or errors, not each
  animation frame. The lightweight Animated.Value progress bar updates with the
  clock. No new animation/native library was installed.

## Controls, accessibility and lifecycle

After the three-second portrait-only prelude, Skip is visible, including before
story measurement and on failure. Both
Skip and natural completion use an idempotent completion path. Android hardware
Back also continues to the normal startup destination. Pause/Resume preserves
position and reading time; Replay is an explicit restart during the presentation.
Touching the story or beginning a manual drag pauses automatic motion. A manual
scroll updates the player's current visible section for subsequent Resume.

Background/inactive events stop the frame loop. Returning to foreground leaves
Resume visible rather than restarting or unexpectedly advancing the story.
All frames, accessibility subscriptions and lifecycle/back listeners are cleaned
up on unmount. Skip also cancels the frame before exiting.

Reduced Motion or screen-reader use selects static/manual reading with visible
Continue and Skip actions. Unavailable accessibility preferences fail safely into
manual mode. Playback exceptions show a readable error and retain Skip/Resume;
a failed image uses initials. Missing layout measurements cannot hide Skip.

## Portrait-only opening and bottom entry

The latest requested opening shows only the fixed portrait for three seconds after
Splash. Foreground controls and story are mounted for measurement but hidden and
excluded from touch/accessibility during that bounded delay. Android hardware
Back remains available. The prelude counts foreground time, pauses in the
background and cleans up its timer and listener. Rerenders do not reset it.

Afterward the name and narrative enter from below the measured ScrollView
viewport using a viewport-height content spacer, then scroll upward through the
existing playback controller. Manual accessibility mode omits that spacer.
The photograph remains stationary throughout; Replay restarts the story without
repeating the launch-only portrait delay. No new biography or image was added.

Validation: TypeScript and ESLint passed; the full existing suite passed
24 suites / 159 tests, including the new opening/bottom-entry regression.
Additional focused hook tests cover exact timing, rerenders and foreground time.
Device confirmation of the three-second opening and bottom-entry appearance is
still required through Metro; no build was run.

## Changed code

- src/app/navigation/LaunchGate.tsx: one per-launch presentation gate.
- src/features/home/screens/HomeScreen.tsx: remove only the Founder Spotlight.
- src/features/founder/screens/FounderCinematicScreen.tsx: measured documentary,
  controls, lifecycle/accessibility and single-loop host.
- src/features/founder/domain/FounderPlayback.ts: deterministic playback clock.
- src/features/founder/components/FounderAttribution.tsx: shared source labels.
- FounderJourneyScreen.tsx: reuse attribution without changing its manual route.
- FounderSpotlight.tsx: stable-size portrait failure fallback; About preview kept.
- Regression startup helpers now explicitly use the real Skip control before
  testing pre-existing Phase 1–4 features; no production/Jest-only bypass exists.

## Automated validation

Final validation: `npm run typecheck` and `npm run lint` passed with no warnings;
`npm test -- --runInBand --watchman=false` passed **24 suites / 156 tests**.
`git diff --check` passed. No native files changed.

Focused tests exercise measured movement,
reading holds, natural completion, duplicate exits, touch pause, resume, replay,
manual motion/screen-reader modes, frame failure, frame/listener cleanup and
background/foreground handling. Startup integration covers onboarding, Welcome,
guest Home and registered-account Home, fresh-root replay and ordinary rerenders.
Existing feature regressions remain enabled.

## Manual verification still required

Use Metro/Fast Refresh and a full JS reload on the installed app; do not build.
Check portrait framing, perceived scroll smoothness/reading pace, very large text,
rotation during playback, Android hardware Back, touch interruption, Skip at any
point, screen-reader focus and Reduce Motion changes. Background for 30+ seconds,
return, Resume and confirm no jump/restart. Check final reading hold and each
stored-state destination. Actual device FPS, CPU, native scrolling behavior,
process-death restoration and release-only behavior are not proven by Jest.

No Gradle, Xcode, native build, APK/AAB/IPA, reinstall, signing change or GitHub
push was performed.

## Fixed portrait background update

The user requested the founder portrait remain behind the entire cinematic.
FounderCinematicBackground now renders one stationary, decorative local image
outside the ScrollView. The inline introductory portrait was removed from the
cinematic only. A dark overlay and translucent story/timeline surfaces preserve
text contrast while letting the portrait remain visible as content scrolls.
Header and playback controls remain fixed and readable. The background does not
intercept touches or screen-reader focus; image failure shows the initials
fallback without affecting measured story positions or access to Skip. The
manual About/Founder Journey portrait and all playback/routing behavior remain
unchanged. No source image pixels were modified.

Background follow-up validation: TypeScript and ESLint passed; all 24 suites /
158 tests passed. New regressions verify the portrait stays outside the scrolling
content across Pause/Resume and that image failure preserves fallback and Skip.
Device-level framing, readability and scrolling smoothness still need a Metro
visual check. No native build or installation was run.

Clarity follow-up: the near-square portrait now uses its original aspect ratio
in a centered frame bounded by the viewport and 480 layout points, instead of
being enlarged to cover a tall full-screen viewport. A lighter central gradient
makes the portrait more visible; darker text panels preserve reading contrast.
The original 408×404 PNG is unchanged. This reduces excessive magnification but
cannot recover missing image detail; a higher-resolution original is required
for genuinely sharp full-screen imagery. TypeScript, ESLint and 21 focused
cinematic/playback/startup tests passed. Device visual confirmation remains open.
