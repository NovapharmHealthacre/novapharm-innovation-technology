import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'about.html',
  'services.html',
  'markets.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  '404.html'
];
const indexablePages = pages.filter((page) => page !== '404.html');
const errors = [];
const contents = new Map();

function fail(message) {
  errors.push(message);
}

function read(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`Missing required file: ${relativePath}`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

function idsFor(html) {
  return [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
}

for (const page of pages) {
  const html = read(page);
  contents.set(page, html);
  if (!html) continue;

  if (!/^<!doctype html>/i.test(html.trimStart())) fail(`${page}: missing HTML doctype`);
  if (!/<html\s+lang="en-IN">/i.test(html)) fail(`${page}: expected lang="en-IN"`);
  if (!/<meta\s+name="viewport"/i.test(html)) fail(`${page}: missing viewport metadata`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page}: missing title`);
  if (!/<main\b[^>]*\bid="main"/i.test(html)) fail(`${page}: missing main landmark with id="main"`);
  if (!/<h1\b/i.test(html)) fail(`${page}: missing H1`);
  if (!/<header\b/i.test(html) || !/<footer\b/i.test(html)) fail(`${page}: missing header or footer landmark`);
  if (/<style\b/i.test(html)) fail(`${page}: inline style block found; use assets/css/site.css`);
  if (/href="#"/i.test(html)) fail(`${page}: placeholder href="#" found`);
  if (!/assets\/NIT-logo\.svg/.test(html)) fail(`${page}: official logo reference missing`);

  const ids = idsFor(html);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicates)) fail(`${page}: duplicate id="${id}"`);

  for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      fail(`${page}: invalid JSON-LD (${error.message})`);
    }
  }
}

for (const page of indexablePages) {
  const html = contents.get(page) || '';
  const expected = page === 'index.html'
    ? 'https://nit.novapharmhealthcare.com/'
    : `https://nit.novapharmhealthcare.com/${page}`;
  if (!html.includes(`<link rel="canonical" href="${expected}">`)) {
    fail(`${page}: missing or incorrect canonical URL`);
  }
}

for (const [page, html] of contents) {
  const currentIds = new Set(idsFor(html));
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:)/i.test(href)) continue;

    const [pathPart, fragment] = href.split('#');
    const target = pathPart === '' ? page : pathPart === '/' ? 'index.html' : pathPart;
    if (!existsSync(resolve(root, target))) {
      fail(`${page}: broken internal link to ${href}`);
      continue;
    }

    if (fragment) {
      const targetHtml = target === page ? html : contents.get(target) || read(target);
      const targetIds = target === page ? currentIds : new Set(idsFor(targetHtml));
      if (!targetIds.has(fragment)) fail(`${page}: missing fragment target ${href}`);
    }
  }
}

const contact = contents.get('contact.html') || '';
const openForms = (contact.match(/<form\b/gi) || []).length;
const closeForms = (contact.match(/<\/form>/gi) || []).length;
if (openForms !== 1 || closeForms !== 1) fail('contact.html: expected one complete form');
if (!/data-enquiry-form/.test(contact)) fail('contact.html: enquiry form hook missing');
for (const field of ['first_name', 'last_name', 'email', 'enquiry_type', 'message']) {
  if (!contact.includes(`name="${field}"`)) fail(`contact.html: missing required field ${field}`);
}

const siteCss = read('assets/css/site.css');
if (/brightness\s*\(|invert\s*\(/i.test(siteCss)) fail('assets/css/site.css: logo-altering filter found');
if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(siteCss)) fail('assets/css/site.css: reduced-motion support missing');
if (!/:focus-visible/i.test(siteCss)) fail('assets/css/site.css: focus-visible treatment missing');

const combinedPublicCopy = indexablePages.map((page) => contents.get(page) || '').join('\n');
const forbiddenClaims = [
  /active presence across seven markets/i,
  /70\+ years/i,
  /\$2\.35T/i,
  /premier pharmaceutical services firm/i,
  /FDA-approved formulation/i
];
for (const pattern of forbiddenClaims) {
  if (pattern.test(combinedPublicCopy)) fail(`Public copy reintroduced restricted claim: ${pattern}`);
}

const sitemap = read('sitemap.xml');
for (const page of indexablePages) {
  const url = page === 'index.html'
    ? 'https://nit.novapharmhealthcare.com/'
    : `https://nit.novapharmhealthcare.com/${page}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap.xml: missing ${url}`);
}

const robots = read('robots.txt');
if (!robots.includes('https://nit.novapharmhealthcare.com/sitemap.xml')) fail('robots.txt: sitemap URL missing');
read('llms.txt');
read('site.webmanifest');
read('assets/js/site.js');
read('assets/NIT-logo.svg');

if (errors.length) {
  console.error(`Website validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Website validation passed: ${pages.length} HTML pages, shared assets, links, claims and discovery files checked.`);
