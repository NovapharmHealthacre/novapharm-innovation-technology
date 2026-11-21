# NIT GitHub Pages release safety — migration is intentionally HELD

The previous `.github/workflows/deploy-pages.yml` ran automatically after pushes to `main`, copied generated files into the repository root, staged everything with `git add -A` and pushed those generated files back to `main`. This is a source-of-truth and rollback risk, especially while `main` has no protection.

This draft candidate replaces direct source mutation with **manual exact-SHA, owner-approved GitHub Pages artifact publishing**. It does not enable a release or change the site merely by opening a PR. The new `NIT CI governance and safe-release contract` remains on every PR and main push; the existing `Site quality` workflow still performs npm audit, typecheck, lint, production build, static export validation and artifact reporting.

## Important before merge

1. An authorized GitHub administrator must confirm the currently active Pages source and prepare **Settings → Pages → Build and deployment → Source: GitHub Actions**. The old deployment mechanism may depend on branch-root publication, so do not merge before planning this transition and verifying rollback.
2. Enable and review `main` branch ruleset: PR required, block force pushes/deletions, require `Site quality / validate` and `NIT source, Google, web-quality and non-publishing release gate`, require exact up-to-date reviews; add independent CODEOWNER review when a second reviewer exists.
3. Set repository variable `NIT_PRODUCTION_RELEASE_APPROVED=true` only after independent owner approval. Manual `Publish approved NIT website artifact` must use the exact approved `main` SHA. Configure `github-pages` environment protection and trusted release actor.
4. On first migration, verify `https://nit.novapharmhealthcare.com/` and important routes, assets, CNAME, and CSS in an independent browser, and retain a previous known-good source and rollback path.

This PR is **not permission** to deploy, does not enable native app or AI cloud access, and makes no independent Apple HIG/SEO/production acceptance claim.
