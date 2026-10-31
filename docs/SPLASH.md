# Cinematic splash refinement

The React Native splash now uses three zones: low-opacity architectural linework,
a contained official logo with a red accent, and the requested Manrope tagline
and brand statement. SVG decoration is non-interactive and hidden from screen readers.
No new images or dependencies were added.

Logo sizing uses the bundled artwork's exact 900:380 ratio. Available width excludes
safe-area insets and 48 points of horizontal padding, capped at 320 points. The
scrollable layout protects short screens, split-screen windows and enlarged text.

The 620 ms native-driver entrance uses opacity, a 0.98–1 logo scale and an accent
reveal. The reduced-motion preference is resolved before motion starts. Animations
stop on unmount, and startup still navigates immediately when stored preferences
are ready. There is no minimum display time, loading simulation or new splash loop.
On fast launches, only part of the entrance—or none—may be visible by design.

The previous native Android icon placed the wide logo inside a system-masked icon
area, a clipping risk documented by Android's splash guidelines:
https://developer.android.com/develop/ui/views/launch/splash-screen
Android 12+ now uses a restrained architectural vector inside the icon safe circle;
the full official logo belongs in the app splash. Earlier Android launch backgrounds
keep the logo's exact ratio with restrained framing. iOS uses aspect-fit rendering,
a proportional height constraint, available-width sizing and a 320-point cap.
All backgrounds remain #171717. System launch layouts are intentionally simpler
than the React Native composition; Android 12 does not support the full three-zone
layout in its system splash.

Validation: TypeScript and ESLint passed; 52 tests passed, including logo widths,
source ratio, reduced motion, animation cleanup and existing hydration/retry/routes.
Android debug build passed. Native XML passed validation; iOS Interface Builder compiled the launch storyboard
with no errors or warnings. Physical-device visual
checks (including cold-start transitions and clipping) remain outstanding.

No signing changes, release builds, pushes or unrelated screen changes were made
for this refinement. Existing Phase 3 changes in the workspace were preserved.
