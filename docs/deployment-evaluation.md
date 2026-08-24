# Static Hosting Evaluation

TableSpark builds to static PWA assets under `dist/`. The repository can therefore be deployed to a static HTTPS host, but this document intentionally stops at evaluation. It does **not** create or change a production deployment because the production host/origin is an owner-level decision.

## Deployment requirements

Any selected host must provide:

- HTTPS on the final public origin;
- static file hosting for the complete `dist/` artifact;
- correct MIME types for JavaScript, CSS, SVG, JSON, and the web manifest;
- support for service-worker delivery from the application scope;
- predictable cache behavior for `index.html`, service-worker files, and hashed assets;
- a documented rollback path;
- custom-domain support if a project domain is later selected;
- no mandatory injection of advertising or tracking into the application output.

## Candidate: GitHub Pages

### Strengths

- natural fit for a public GitHub repository;
- HTTPS is available;
- no separate application server is required;
- deployment can be integrated with GitHub Actions after explicit approval.

### Considerations

- project-site base paths need to match the Vite/PWA configuration if deployed under `/tablespark/` rather than a root/custom domain;
- service-worker scope and manifest paths must be verified on the actual Pages URL;
- branch/environment permissions should protect production deployments;
- deployment should use built output, not expose source files as the application root.

## Candidate: Cloudflare Pages

### Strengths

- static hosting and HTTPS;
- custom-domain support;
- CDN delivery and deployment previews.

### Considerations

- requires a Cloudflare account/project connection outside this repository;
- account ownership and access controls need an explicit owner decision;
- build/deploy settings become another operational configuration surface.

## Candidate: Netlify

### Strengths

- static-site deployment and HTTPS;
- preview deployments;
- custom-domain support.

### Considerations

- requires an external service/account connection;
- production deploy permissions and ownership must be established;
- redirects/headers configuration should remain minimal and documented.

## Candidate: Vercel

### Strengths

- static output deployment with HTTPS;
- preview deployments and custom domains.

### Considerations

- requires an external service/account connection;
- TableSpark does not require Vercel server functions for its current architecture;
- account/project ownership and deployment permissions must be explicit.

## Recommended selection order

For the current public repository, **GitHub Pages is the lowest-operational-complexity candidate to test first** if the owner approves a GitHub-hosted production origin. A custom domain can be considered later.

If deployment previews, independent CDN controls, or a non-GitHub production account become explicit requirements, re-evaluate Cloudflare Pages, Netlify, or Vercel.

## Pre-deployment gate

Do not enable production deployment until:

1. the owner selects the host and final origin strategy;
2. the current release-candidate PR passes CI, E2E, and CodeQL;
3. the PWA base/scope configuration is reviewed against the chosen origin/path;
4. the release artifact checksum is generated and verified;
5. privacy/support links are correct for the public release;
6. a rollback procedure and deployment permissions are documented.

## Post-deployment validation

After an approved deployment, verify on the **real HTTPS origin**:

- first load succeeds without console/runtime errors;
- manifest is discoverable;
- installability behavior is correct for supported browsers;
- service worker becomes active within the intended scope;
- one online load followed by an offline reload succeeds;
- an update deployment produces the non-blocking update prompt;
- table generation, practice, progress, settings, and local profiles still work;
- worksheet printing works from the deployed origin;
- light/dark and compact/wide release screenshots are captured from the real build;
- external support/source/funding links are correct.

## Rollback principle

A production deployment should be able to return to the last known-good immutable artifact. Do not mutate an existing release tag to perform a rollback. Redeploy a verified prior artifact or publish a corrective patch release and record the result in `what_changed.md`.

## Current decision

Static deployment is technically suitable, but **no production host is activated by this evaluation**. Deployment remains blocked on explicit owner approval of the host/origin and successful release-candidate verification.
