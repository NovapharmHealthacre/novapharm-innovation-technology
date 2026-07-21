import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const failures = [];
const requiredRoutes = [
  "index.html",
  "expertise/index.html",
  "sectors/index.html",
  "approach/index.html",
  "insights/index.html",
  "insights/approval-is-not-access/index.html",
  "insights/portfolio-resilience-before-sourcing/index.html",
  "insights/technology-transfer-is-governance/index.html",
  "about/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "CNAME",
  "assets/NIT-logo.svg",
];

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

function fail(message) { failures.push(message); }
function sha256(content) { return createHash("sha256").update(content).digest("hex"); }

for (const relative of requiredRoutes) {
  if (!(await exists(path.join(out, relative)))) fail(`Missing export: ${relative}`);
}

if (await exists(path.join(out, "CNAME"))) {
  const cname = (await readFile(path.join(out, "CNAME"), "utf8")).trim();
  if (cname !== "nit.novapharmhealthcare.com") fail(`Unexpected CNAME: ${cname}`);
}

const sourceLogo = path.join(root, "assets", "NIT-logo.svg");
const exportedLogo = path.join(out, "assets", "NIT-logo.svg");
if (await exists(sourceLogo) && await exists(exportedLogo)) {
  const [source, exported] = await Promise.all([readFile(sourceLogo), readFile(exportedLogo)]);
  if (sha256(source) !== sha256(exported)) fail("Official NIT logo changed during export");
}

const restricted = [
  /active presence across seven markets/i,
  /70\+ years/i,
  /\$2\.35T/i,
  /premier pharmaceutical services firm/i,
  /FDA-approved formulation/i,
  /McKinsey|Deloitte|PwC|KPMG|Ernst\s*&\s*Young|Boston Consulting Group/i,
];

const htmlFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
await walk(out);

const hrefs = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(out, file);
  if (!/<html[^>]+lang="en"/i.test(html)) fail(`${relative}: missing lang=en`);
  if (!/<main\b/i.test(html)) fail(`${relative}: missing main landmark`);
  if (!/<h1\b/i.test(html) && relative !== "404.html") fail(`${relative}: missing h1`);
  if (!/<link[^>]+rel="canonical"/i.test(html) && relative !== "404.html") fail(`${relative}: missing canonical URL`);
  if (!/<meta[^>]+name="description"/i.test(html) && relative !== "404.html") fail(`${relative}: missing meta description`);
  if (/href=["']#["']/i.test(html)) fail(`${relative}: placeholder href`);
  for (const pattern of restricted) if (pattern.test(html)) fail(`${relative}: restricted claim or competitor reference matched ${pattern}`);
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) hrefs.add(match[1]);
}

for (const href of hrefs) {
  if (href.startsWith("/_next/") || href.startsWith("/assets/")) continue;
  const clean = href.replace(/^\//, "").replace(/\/$/, "");
  const candidates = clean === ""
    ? [path.join(out, "index.html")]
    : [path.join(out, clean, "index.html"), path.join(out, clean)];
  if (!(await Promise.all(candidates.map(exists))).some(Boolean)) fail(`Broken internal link: ${href}`);
}

if (await exists(path.join(out, "sitemap.xml"))) {
  const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
  for (const route of ["/expertise/", "/sectors/", "/approach/", "/insights/", "/about/", "/contact/"]) {
    if (!sitemap.includes(`https://nit.novapharmhealthcare.com${route}`)) fail(`Sitemap missing ${route}`);
  }
}

if (failures.length) {
  console.error("Export validation failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Export validation passed: ${htmlFiles.length} HTML documents, ${hrefs.size} internal links.`);
