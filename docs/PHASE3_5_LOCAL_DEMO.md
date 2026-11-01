# Phase 3.5 — persistent client demo

## Implemented

- Required name/email/phone/password signup, case-insensitive duplicate rejection,
  locally verified login, logout, persisted session/automatic login and guest access.
- Registered-email reset with a visible generated six-digit demo code, five-minute
  expiry, five attempts, resend invalidation and single-use password update.
- Profile identity, email/phone, selectable initials-avatar colors, Edit Profile,
  Change Password, quotation history/details, saved projects, read/unread local
  notifications, persisted notification preference, Settings and confirmed clear.
- Help routes to verified Call/Email/WhatsApp/Maps/FAQs; About reuses the existing
  implementation. Guest account actions lead directly to Login/Sign Up.
- Quote form previews remain available to guests. Logged-in users can save local
  drafts with reference/date/service/status. Repeated saves use an idempotency ID.
  Nothing is submitted to Champion Group. Saving a draft creates a local activity
  notification only when enabled. No fake seed accounts, requests or messages.
- Existing 16 solutions, projects, clients, testimonials, FAQs, galleries and
  contact actions remain. Full-screen photographs and minimum 3-second splash
  from prior refinements are preserved.

## Storage and migration

AsyncStorage instance: `champion-demo`.
Versioned key: `champion-demo:v1:database`.
One validated JSON document contains `{ version: 1, accounts, session }`.
Each account contains an immutable ID/profile, password credential, saved IDs,
quotation drafts, local notifications and notification preference. Session is
null, guest, or an account ID; no bearer/security token is created.

A serialized repository queue and single-document writes avoid partial updates
between session/account data. UI snapshots update only after a successful write.
Zod validates stored JSON and inputs. Invalid/unsupported data shows retry and
confirmed clear options rather than silently overwriting it. Duplicate account
IDs/emails/record IDs are rejected. Stale saved project IDs remain removable.
Account-specific mutations reject session changes while queued.

Legacy `demo-access-v1` is read only for one-time migration. Guest access is
preserved; old fake demo-login flags cannot invent a registered account. After
migration the new database is authoritative, including explicit logged-out state.
The existing `champion-preferences` onboarding key is never cleared or overwritten
by account clearing. Clear demo data removes ALL demo accounts on this device.

The repository owns profile/account snapshots; Redux only tracks navigation access,
startup/save status and errors. Passwords never enter Redux actions or storage.

## Password handling and demo limitations

Added one pure-JavaScript dependency: pinned `@noble/hashes@1.8.0`. No native module,
polyfill, build or linking required. Password derivation is asynchronous
PBKDF2-HMAC-SHA256, 10,000 iterations for new demo credentials, 32-byte digest,
per-password unique salt. This intentionally reduced demo work factor is not a
production password policy. Existing 600,000-iteration credentials remain readable.
Salt and algorithm/work-factor metadata are stored with the digest. UTF-8 encoding
works without Hermes TextEncoder. Digest comparison has no early character exit.
The implementation is tested against Node's independent PBKDF2 result, including
Unicode. Hashing yields periodically; physical-device latency needs verification.

This is not production authentication: AsyncStorage is not encrypted, the session
ID is locally editable, IDs/salts use non-secret uniqueness values rather than a
claimed secure RNG, and verification codes are deliberately shown on screen.
Use sample personal details and passwords never used on real accounts. Reset
challenges are memory-only and must be restarted after app termination. No real
email/SMS, social login, push notifications or backend requests are introduced.

## Official documents

Verified https://championgroup.ae/privacy-policy/ exists, but contains suggested
WordPress/template wording. The app explains that it is a website document, not
an app-specific policy, and opens the source externally. No authoritative Terms
page was verified at https://championgroup.ae/terms-and-conditions/ or through
official-domain search; its screen clearly reports unavailable and offers Contact.
No legal terms were invented. Verified company content remains sourced from
https://championgroup.ae/ and the existing source manifests.

## Files

New: `src/features/account/domain/models.ts`; account data factory, repository,
password hasher; AccountPrimitives; ProfileFormScreens, AccountCollectionScreens,
AccountSettingsScreens; `src/shared/hooks/useAsyncAction.ts`; repository, hashing
and storage test helpers.

Updated: typed AuthRepository/provider/screens/slice, ProfileScreen, GetQuoteScreen,
ProjectDetailsScreen, app dependencies/store/provider/routes/LaunchGate, splash
error recovery, package.json/lock and auth/navigation tests.

Removed: obsolete accept-any-credentials DemoAuthRepository, expandable placeholder
Profile content, and disabled decorative social-login controls/styles. Existing
working company screens/assets were not deleted.

## Validation and device review

TypeScript and ESLint pass. Full Jest suite: 88 tests across 15 suites pass.
Metro successfully serves the Android
JavaScript bundle with the new hashing library (HTTP 200); this is not a native
build. Tests cover signup persistence/duplicates, login/session/logout, reset
expiry/resend/replay, edit/change password, saves, isolation, corrupt/failed storage,
legacy migration, clearing, guest browsing and Profile/quotation navigation.

Physical phone checks still required: signup/hash latency, keyboard and large fonts,
cold-start auto-login, saved data across force-close, all device app handoffs and
actual safe-area/rendering behavior. No native build, reinstall, APK/AAB/IPA,
Gradle, Xcode, push or real Phase 4 integration was performed.

## Signup responsiveness correction — verified on connected Hermes runtime

The original 600,000-round JavaScript hash was still running after 49.6 seconds
on the connected iPhone 17 Pro runtime. UI yields alone did not solve latency.
New local-demo credentials now use 10,000 PBKDF2-HMAC-SHA256 rounds, with real
macrotask yields every 512 iterations. Stored iteration metadata is used when
verifying passwords, including legacy 600,000-round accounts. Legacy login can
still be slow; a local demo password reset writes the new format. Passwords are
never stored plaintext. This work factor is for a non-production demo only.

An isolated repository using the actual native AsyncStorage and production
hasher was exercised through the connected Hermes inspector:
- Signup and profile creation: 4,412 ms.
- Logout: 1 ms.
- Login with saved credentials: 4,237 ms.
- New repository/session restoration: passed (under 1 ms reported).

Diagnostic storage was separate from user accounts and removed after the test.
Metro reload cleared the previous in-flight hash; no native build or reinstall.
These timings verify the repository on the connected runtime, not automated
screen tapping or physical-device performance across all models. Jest UI tests
cover signup navigation; independent Node PBKDF2 vectors cover both work factors.
