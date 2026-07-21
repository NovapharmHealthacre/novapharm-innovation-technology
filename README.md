# Novapharm Innovation Technology website

Public website for **Novapharm Innovation Technology**, deployed at:

- https://nit.novapharmhealthcare.com

## Architecture

This is a dependency-free static website designed for GitHub Pages.

### Public pages

- `index.html` — homepage
- `about.html` — company profile and operating model
- `services.html` — pharmaceutical development capabilities
- `markets.html` — responsible destination-market pathway planning
- `contact.html` — transparent email-based project brief
- `privacy.html` — website privacy notice
- `terms.html` — website terms and professional disclaimers
- `404.html` — branded error page

### Shared assets

- `assets/NIT-logo.svg` — official company logo; preserve without filters, recolouring, cropping or redrawing
- `assets/css/site.css` — shared design system and responsive layout
- `assets/js/site.js` — accessible mobile navigation, current year and enquiry-email preparation
- `site.webmanifest` — website metadata
- `llms.txt` — machine-readable company and scope summary
- `sitemap.xml` and `robots.txt` — search discovery

## Brand rules

1. Use the supplied SVG as the primary website wordmark.
2. Keep the logo on a clean light background.
3. Do not manufacture a white, monochrome, square or abbreviated logo.
4. Do not apply CSS filters to alter the logo.
5. A compact favicon, application icon and social-sharing image require an approved brand asset from the owner.

## Content rules

- Do not imply that Novapharm Innovation Technology holds an approval, licence, filing role or regulated appointment unless current evidence supports the statement.
- Do not describe a market as an active presence solely because it is under evaluation.
- Do not publish market statistics without a named, current and reviewable source.
- Distinguish early-stage pathway planning from formal regulatory, legal, manufacturing or laboratory responsibility.
- Keep the India company positioned independently unless the owner explicitly approves a documented corporate relationship statement.

## Contact form

The site is static. The form in `contact.html` does not upload or store data. JavaScript prepares a structured email addressed to `bd@novapharmhealthcare.com` in the visitor's email application.

If a server-side form is introduced later, update the privacy notice, security controls, retention policy and failure handling before deployment.

## Deployment

The repository is intended for GitHub Pages and retains the existing `CNAME` file for `nit.novapharmhealthcare.com`.

Before merging a release:

1. Review every changed claim.
2. Confirm the official logo file is unchanged.
3. Check all internal links.
4. Test the mobile navigation at 320 px, 375 px and 768 px widths.
5. Test keyboard navigation and visible focus.
6. Submit a test enquiry and confirm the email application opens with the expected project brief.
7. Confirm `sitemap.xml`, `robots.txt`, `llms.txt`, privacy and terms pages are publicly accessible.
8. Verify the deployed custom domain before updating Search Console.
