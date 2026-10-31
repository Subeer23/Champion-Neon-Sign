# Local assets

Manrope Regular, SemiBold, and Bold are bundled locally. Font source: the
`@expo-google-fonts/manrope` 0.4.3 asset distribution, derived from Google Fonts.
No Expo package or runtime is installed. See `fonts/LICENSE_FONT` (SIL OFL) and
`fonts/LICENSE` for the distribution license.

The original TTFs are in `fonts/`. Android's matching copies live in
`android/app/src/main/assets/fonts/`. iOS references these source files in its
Resources phase and registers their filenames in `UIAppFonts`. Preserve the
PostScript names used by the typography tokens when replacing fonts.

Portfolio images and logo variants are deferred to the approved content phase.
