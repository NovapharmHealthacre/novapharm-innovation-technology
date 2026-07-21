# Novapharm Innovation Technology

A consulting-grade digital platform for an India-based pharmaceutical strategy and execution advisory firm.

## Positioning

The site is organised around the decisions pharmaceutical leadership teams need to make—not around a generic catalogue of services. The public experience connects:

- strategy and growth;
- portfolio and product strategy;
- market entry and access;
- development, CMC and technology transfer;
- operations, sourcing and resilience;
- commercial readiness and launch;
- digital, data and AI strategy; and
- partnerships, licensing and diligence.

The language is intentionally evidence-led. It does not claim client scale, regulatory authority, licences, outcomes, offices, team size, or delivery capabilities that have not been substantiated.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript 7 native compiler for strict typechecking
- TypeScript 6 API compatibility layer for the current lint/build ecosystem
- Motion for reduced-motion-aware interaction
- Canvas-based responsive network visualisation
- Static export for secure, fast GitHub Pages delivery
- Exact direct dependency versions and automated export validation

Browsers ultimately receive HTML, CSS and JavaScript; every web framework does that. The application source, component model, interaction logic, content system and build pipeline are TypeScript/React rather than hand-authored page-by-page HTML.

## Brand integrity

`assets/NIT-logo.svg` is the official repository artwork. It is copied byte-for-byte into the production export. Do not redraw, recolour, filter, crop, or reconstruct it.

## Local development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run lint
npm run build
npm run validate:export
```

These commands run TypeScript 7 typechecking, ESLint, the Next.js production build, and a link/metadata/claim/logo-integrity validator against `out/`. Direct dependency versions are pinned in `package.json`; CI performs a clean install for each run.

## Deployment

The repository includes `.github/workflows/deploy-pages.yml`. After the new platform is approved, the repository administrator must select:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

The workflow then builds and publishes `out/` on pushes to `main`. The existing `CNAME` remains `nit.novapharmhealthcare.com`.

## Content governance

Before publishing new claims, verify the evidence and approval owner. Formal medical, legal, patent, investment, regulatory, quality, laboratory, manufacturing, clinical, or local-representation work must be described only within the actual engagement scope and delivered by appropriately qualified parties.
