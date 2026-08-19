# Native Packaging Evaluation

TableSpark is currently a static offline-first web/PWA application. This document evaluates whether a Trusted Web Activity (TWA) or another native wrapper should be introduced later without treating native packaging as a requirement for the web product.

## Current product needs

The current product needs are already served by the PWA architecture:

- custom multiplication tables;
- offline practice after the service worker has cached the app shell;
- local learner profiles and progress;
- printable worksheets and answer keys;
- browser text-to-speech where available;
- installable PWA behavior on supporting browsers;
- no required backend or account.

None of these requirements currently depends on a privileged native API.

## Option 1 — Keep the PWA as the primary product

### Advantages

- one deployable codebase;
- smallest maintenance/security surface;
- immediate web updates without app-store review;
- direct use on desktop and mobile browsers;
- no native build toolchain required for contributors;
- no wrapper-specific storage synchronization problem.

### Limitations

- install UX varies by browser/platform;
- some platforms expose fewer PWA capabilities;
- app-store discovery is limited unless a wrapper is introduced;
- browser-managed storage/service-worker behavior remains platform-dependent.

## Option 2 — Android Trusted Web Activity

A TWA can present a verified HTTPS web origin in an Android application shell with minimal native UI.

### Potential benefits

- Android launcher/store distribution while retaining the hosted web app as the product source;
- relatively small native layer compared with a full native rewrite;
- web application behavior can remain the primary implementation.

### Requirements before adoption

A TWA should not be added until all of the following are true:

1. a stable production HTTPS origin has been selected and approved by the repository owner;
2. Digital Asset Links can be hosted at that origin;
3. the production PWA passes installability/offline checks on the real origin;
4. Android package name, signing-key ownership, release-key backup, and store ownership are decided;
5. privacy/support/release documentation covers the Android distribution channel;
6. the maintenance cost of Android build tooling is accepted.

### Risks

- signing keys become security-critical release assets;
- a production-origin outage affects the wrapped experience;
- origin/package verification adds operational complexity;
- app-store requirements can change independently of the web project;
- a wrapper can create an appearance of native capability that the underlying web app does not actually provide.

## Option 3 — Capacitor or another embedded web wrapper

A web-view wrapper could package built assets and expose optional native plugins.

This is not recommended for the current requirements because it would add:

- another dependency/runtime layer;
- native Android/iOS build projects;
- plugin lifecycle and permission review;
- more complex release/security maintenance;
- additional testing for differences between browser PWA and embedded web view.

It becomes reasonable only if TableSpark later requires a native capability that cannot be delivered responsibly through the target browsers.

## Option 4 — Full native rewrite

A full Kotlin/Swift/other native rewrite is not justified by the current product requirements. It would duplicate core learning logic and substantially increase testing, accessibility, persistence, release, and feature-parity work.

## Decision for the current roadmap

**Keep the PWA as the canonical product. Do not add a TWA, Capacitor wrapper, or native rewrite in the current release line.**

A TWA is the first native-packaging option to re-evaluate if Android store distribution becomes an explicit owner-approved requirement after a production origin exists.

This is an architecture decision, not a permanent prohibition. Re-evaluate when requirements change rather than adding native build infrastructure speculatively.

## Re-evaluation checklist

Open a dedicated architecture issue/ADR if any of these become true:

- Android store distribution becomes a release requirement;
- a required classroom/device API is unavailable to the PWA;
- managed-device deployment requires an application package;
- offline behavior must be independent of a hosted origin/service-worker lifecycle;
- owner-approved production hosting and signing-key management are in place.

The evaluation should include accessibility, privacy, update behavior, storage migration, package signing, dependency maintenance, CI build cost, and rollback procedures before implementation begins.
