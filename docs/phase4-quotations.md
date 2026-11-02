# Phase 4 quotation demo

The quote flow contains solution selection, project requirements, contact details,
review, and a local success confirmation. All 16 existing solutions are available.
Solution and project detail links preserve their context. Home, catalog lists,
Contact, and Profile also provide quote entry points.

Signed-in visitors can save incomplete drafts, resume them from My Quotations,
submit a demo request, view details, cancel submitted demo requests, and delete
requests. Leaving an edited form asks before discarding changes. Contact edits
apply to the request without changing the account profile.

Guest Login and Sign Up actions persist an explicit handoff before opening auth.
After authentication, the handoff becomes an account draft and the form reopens
at its previous step. The handoff is then removed. Restoration failures preserve
the handoff and offer retry.

The existing LocalDemoRepository remains the account and quotation repository.
It stages versioned account-specific quote documents in the existing AsyncStorage
namespace and commits their pointers in the account database last. Failed writes
leave previous documents readable. Successfully replaced documents are removed.
Existing embedded Phase 3 quotations migrate on the next successful mutation.
Request IDs provide idempotent submission, and references include the unique ID.
Account operations are serialized and verify the account that initiated them.

Nothing is sent to Champion Group. Statuses represent local demo actions only.
Clearing app storage or demo data removes locally saved requests. No backend,
native dependency, native build, or application reinstall is required.

Validation commands:

```sh
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

For a device check through the existing Metro session, select a solution, save a
partially filled draft, reopen it, submit it, then inspect its history and details.
Repeat as a guest through Login or Sign Up and switch accounts to check isolation.

## Optimization verification

Unchanged draft saves and duplicate submissions skip AsyncStorage writes and
subscriber notifications. Serialized account quote documents are cached for
comparison, and account documents load concurrently at startup. Unchanged
snapshot fields retain their references so quotation updates do not rerender
profile-only subscribers. Quote inputs and solution cards are memoized with
stable change handlers; editing a field leaves its unchanged siblings intact.

Guest handoff changes are serialized. Cleanup checks the expected draft ID,
claims are idempotent, and restoration retries reuse an already adopted account
draft. Failed cleanup cannot expose an account-bound handoff to another account.
Focused tests verify write counts, render counts, retry preservation, and stale
handoff cleanup. These are functional measurements, not device FPS benchmarks.
