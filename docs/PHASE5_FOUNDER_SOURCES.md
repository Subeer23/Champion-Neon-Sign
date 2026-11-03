# Phase 5: Founder story source verification

Reviewed: 3 November 2026. Current scope: offline cinematic startup, About
and the manual Founder Journey. The later client requirement supersedes the
original Home Spotlight; it has been removed from Home. No authentication/storage schema, native code, signing,
build or installation changes. All story copy is original summary, not a
reproduction of an article. No invented quotations, awards or statistics.

## Research register

| ID | Published source | Date metadata | Access / relevant location |
| --- | --- | --- | --- |
| official | [Champion Group homepage](https://championgroup.ae/) | Undated; checked 2026-11-03 | Full text: Since 1989 and Our Solutions. |
| gn2019 | [Gulf News founder interview](https://gulfnews.com/uae-success-stories/shabbir-merchant-dubai-based-pakistani-businessman-who-turned-his-dh1500-monthly-salary-into-millions-1.1576134404285) | Last updated 2019-12-14, 10:11; initial publication date not separately established | Full article; Early life, Moving to Dubai, Early days of business. |
| gn2020 | [Gulf News family-business interview](https://gulfnews.com/uae/how-dubai-based-pakistani-family-of-merchants-overcame-covid-19-challenges-1.74831910) | Last updated 2020-11-05, 18:05 | Full article; Shifting gears; Perseverance, honesty and loyalty. |
| gn2026 | [Gulf News May 2026 profile](https://gulfnews.com/amp/story/uae%2Ffrom-1976-to-now-how-shabbir-merchant-from-pakistan-built-51-years-of-roots-in-dubai-1.500529772) | Last updated 2026-05-06, 14:08 | Full article; Building from scratch; The sons who came back. |
| retail2026 | [Retail People Magazine, Issue 47](https://fliphtml5.com/lkcyl/kmmj/) | May–July 2026 issue; host upload 2026-05-20 | Full relevant interview text on printed pages 52–53, The Champion Group Story. Upload is distinguished from issue date. |
| kt2006 | [Khaleej Times interview](https://www.khaleejtimes.com/uae/dubai-is-transforming-into-world-class-city) | Search-index metadata: published 2006-06-03, updated 2015-04-04 | Direct and AMP fetches failed. Reviewed accessible indexed excerpts only. **Not claimed as a full-page review. No unique app fact relies on this item.** |

Article titles, publication, date type/label, URLs, review date and access status
are retained in the typed `founderSources` registry. Each story section and
timeline item contains explicit source IDs. The app displays short attribution
beside the text and full references below it. Source links use existing safe
Linking/error handling; content itself does not require a network connection.

The official [About page](https://championgroup.ae/about/) was also inspected.
Its generic agency/team/template material is unsuitable for this biography and
was not used. The homepage's relevant company/service text was used instead.

## Fact-to-content map

| Content ID | Supported point | Source IDs |
| --- | --- | --- |
| name / designation | Name; Founder & Chairman designation in the magazine's interview caption | gn2019; retail2026 |
| introduction / foundation / champion | Champion established in 1989; Deira origin; early handcrafted neon work | gn2019; gn2026; official corroborates year |
| early-life | Karachi; father Yousuf Merchant and signage background | gn2019 |
| dubai / arrival | 1976 arrival; elder brother Hanif and local industry experience | gn2019; gn2026 independently supports arrival year |
| challenges | Attributed account of limited resources and building credibility | retail2026 |
| innovation / profile | Neon-to-LED transition and diversification; 2026 is the profile year, **not an invented expansion date** | gn2026 |
| pandemic / response | Historical COVID disruption, staff/supplier support, sons' operational role and safety products | gn2020 |
| family | Shoaib/Shazil involvement and Champion Digital's development | gn2020; gn2026 |
| values | Customer commitments and staff/financial responsibilities as reported in interviews | gn2019; gn2020 |
| today | Website's service portfolio; no market-ranking claims | official |
| machinery | First CNC acquisition, attributed to the retrospective interview | retail2026 |
| workforce | Retention during the financial crisis, explicitly presented as Shoaib's recollection | retail2026 |

Section IDs and source references are checked by tests. Their accuracy still
rests on the reviewed publications; tests do not independently prove a biography.

## Discrepancies and omissions for client confirmation

- Arrival age: 18 in gn2019/gn2020 versus 17 in gn2026. Omitted. No age inferred.
- Initial premises: 800 sq ft office in gn2019 versus 150 sq ft workshop in
  retail2026. Omitted; not assumed to describe the same premises or stage.
- Financing: no-borrowing accounts in gn2019/gn2026 versus a 1998 CNC purchase on
  credit in retail2026. Funding mechanism omitted; no reconciliation invented.
- Shoaib: joining in 2012 (retail2026) versus returning in 2013 (gn2026). These
  may describe different events, but that is unconfirmed. Neither year is used.
- Elapsed-year headlines and changing titles are not converted into company age
  or current-age claims. The designation is traceable to the 2026 magazine.
- Precise arrival day is not used; the relevant KT page could not be fully read.
  Foundation month and undated technology-transition dates are omitted.
- Revenue, wealth, staffing totals, facility dimensions, personal anecdotes,
  awards and promotional rankings are not part of the new app story. No dates
  are assigned to services merely because a later article mentions them.
- No direct personal quotations were added. Published recollections remain
  attributed summaries rather than independently audited company records.

## Photograph and rights decision

At the initial Phase 5 review, no approved portrait was available, so the app
used SM initials. In the 2026-11-03 follow-up, the user supplied a portrait and
explicitly instructed saving that exact image in the project's local folder.

The original attached PNG is now bundled as
`src/assets/images/shabbir-merchant.png` (408 × 404; 230,139 bytes). It was saved
without generating, editing or substituting the image. SHA-256:
`3aec16183a5b9769930d3cd5ee67336e3cb8ea265eb34ad111af2004d7420948`.
Permission provenance is recorded in `founder-portrait-source.json`; upstream
copyright ownership is not independently established or represented as a public
reuse licence. No newspaper image was separately downloaded or hotlinked.

The supplied portrait now appears in the startup presentation, About preview
and manual Founder Journey; the Home Spotlight was subsequently removed. The initials
remain an accessible fallback if the asset is missing or fails to load.

## Implementation / validation

Added `src/features/founder` with typed content, source metadata, Spotlight,
local portrait/initials fallback and Founder Journey. About links into the manual root
route with the existing header/back/motion behavior; startup now presents the
automatic cinematic separately. No existing feature, storage
key or native asset was replaced. The bounded editorial screen uses the existing
scrollable Screen primitive; no network requests or effects are needed for text.

Initial Phase 5 validation on 2026-11-03 (before the cinematic startup update):

- `npm run typecheck`: passed.
- `npm run lint`: passed, no warnings.
- `npm test -- --runInBand --watchman=false`: **20 suites, 132 tests passed**.
- Includes 12 founder content/screen/placeholder/link/error tests and one new
  Home/About navigation/back integration test; all 119 prior tests also pass.
- `git diff --check`: passed. No native, auth, account or quote files modified.

Manual follow-up:
review editorial wording and photo approval with the client; check typography,
large text, source-link/browser failures and back navigation through Metro on the
installed app. A real native build was neither requested nor performed.

## Scroll-reveal follow-up (2026-11-03)

Founder Journey now reveals story cards and timeline milestones when scrolling
brings them into view. Each block animates once using native-driven opacity and
vertical translation. Content is not automatically scrolled or repeatedly
unmounted, and scroll events update refs rather than React state. Other screens
retain their existing scrolling behavior. Reduced Motion, screen-reader use or
unavailable accessibility preferences keep content immediately visible. Animation
and listener cleanup are covered by focused tests.

Follow-up validation: TypeScript and ESLint passed; all 21 suites / 137 tests
passed, including viewport-triggered reveal, no per-scroll content rerenders,
reduced-motion/screen-reader behavior, listener cleanup and photo-load fallback.
No native build or installation was performed. Physical-device visual review
through Metro remains a manual check.

## Automatic startup presentation update

The later 2026-11-03 requirement replaces the Home Spotlight with a cinematic
presentation immediately after the existing Splash. It reuses the same verified
content and portrait, with all story sections and timeline entries preserved.
No additional biography was researched or invented. About retains the manual
story and full reference links. See PHASE5_CINEMATIC_STARTUP.md for playback,
accessibility, routing, lifecycle and validation details.

Final cinematic validation: TypeScript and ESLint passed; all **24 suites / 156
tests** passed. Native files, authentication/account persistence and signing
configuration remain unchanged. Current startup and manual-device checks are
recorded in PHASE5_CINEMATIC_STARTUP.md.
