# Novapharm Innovation Technology website audit

**Audit date:** 21 July 2026  
**Repository:** `NovapharmHealthacre/novapharm-innovation-technology`  
**Production domain:** `https://nit.novapharmhealthcare.com`

## Executive finding

The previous site was technically small but strategically risky. It used four separate HTML documents with large duplicated style blocks, generic card-based presentation, emoji icons, a wrapping rather than purpose-built mobile navigation, a non-functional/malformed enquiry form and several claims that were stronger than the evidence shown on the website.

The redesign keeps the low-maintenance static architecture while bringing the public experience closer to the established Novapharm design standard: restrained, pharmaceutical, editorial, precise and credibility-led.

## Critical issues identified

1. **Enquiry flow:** the previous contact page contained form controls without a reliable complete form implementation or delivery mechanism.
2. **Brand integrity:** the official red SVG was modified visually through a CSS inversion filter to create an unapproved white version.
3. **Claim exposure:** language such as “premier”, “active presence across seven markets”, exact years of experience, regulator-specific execution capabilities and unsourced market-size figures created avoidable credibility and substantiation risk.
4. **Legal links:** Privacy Policy and Terms links pointed to the contact page or a placeholder rather than real legal content.
5. **Mobile navigation:** desktop links simply wrapped on smaller screens; there was no accessible mobile menu.
6. **Maintainability:** each page carried its own near-duplicate CSS, increasing inconsistency and future editing risk.
7. **SEO consistency:** titles and descriptions were long, social metadata was incomplete, sitemap dates were stale and the site lacked a clear machine-readable company summary.
8. **Visual standard:** heavy red header/footer blocks, repeated cards and emoji icons made the site feel like a generic small-business template rather than a disciplined pharmaceutical company.

## Implemented changes

### Brand and design

- Introduced a shared design system in `assets/css/site.css`.
- Moved the visual language to paper white, deep navy, near-black, restrained official red, thin rules and generous negative space.
- Added serif editorial display typography using system-safe fonts without third-party font downloads.
- Preserved `assets/NIT-logo.svg` unchanged and displays it on light backgrounds without filters.
- Removed emoji-based visual language.
- Added a premium, accessible mobile navigation and reduced-motion handling.

### Content and positioning

- Repositioned the company around disciplined pharmaceutical development, CMC planning, technology transfer, manufacturing readiness and portfolio strategy.
- Replaced unsupported scale and market-presence claims with clear scope and responsibility statements.
- Added an About page explaining the India base, operating principles and partner-led model.
- Reframed the Markets page as responsible destination-market pathway planning rather than direct regulatory execution.
- Added explicit distinctions between planning, regulated responsibility, formal advice and guaranteed outcomes.

### Conversion and trust

- Rebuilt the contact page with valid semantic form markup.
- Added a JavaScript workflow that prepares a structured email in the visitor’s email application.
- States clearly that the static website does not upload or store form data.
- Added direct business-development email and Vadodara address.
- Added useful project-brief prompts and a no-sensitive-data warning.
- Added real Privacy and Terms pages.

### Search, AI and technical foundations

- Added concise unique titles, descriptions, canonical URLs and consistent Open Graph metadata.
- Added `WebSite` and `Organization` structured data to the homepage.
- Added `llms.txt` as a machine-readable company and scope summary.
- Updated `sitemap.xml` with the complete current page set and current modification date.
- Added `site.webmanifest` and a branded `404.html` page.
- Added a repository README with brand, claims, deployment and QA rules.

## Intentionally not implemented

1. **Square favicon or app icons:** the supplied website asset is a wide wordmark. No symbol was invented, cropped or redrawn.
2. **Social-sharing hero image:** an approved landscape social card or logo lockup was not available in the current repository.
3. **Server-side contact form:** GitHub Pages is static. A mailto-based brief was chosen rather than pretending submissions are stored or delivered by a backend.
4. **Analytics:** no analytics or advertising scripts were added without an approved privacy and measurement decision.
5. **Team biographies, certifications, client logos, product metrics or regulator badges:** none were introduced without authoritative current evidence and approval.

## Owner actions before final production approval

- Supply the current authoritative NIT logo pack in SVG, PNG, PDF and EPS if it differs from `assets/NIT-logo.svg`.
- Approve or provide a compact favicon/application icon.
- Approve or provide a 1200 × 630 social-sharing image.
- Confirm the published Vadodara address and business-development email.
- Review the Privacy and Terms pages with legal counsel if they will be relied on as formal policies.
- Decide whether the website should remain email-based or move to a secure server-side enquiry service.
- Confirm every public capability against the actual team, contracted partner network and current delivery model.

## Release recommendation

Deploy through a draft pull request, inspect the GitHub Pages preview or branch build, test keyboard/mobile behaviour and merge only after owner review of the revised positioning and legal text.
