import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = file => readFileSync(join(root,file),"utf8");
export function verifyNitRelease() {
  for(const path of ["app","components","data","styles","scripts/validate-export.mjs","app/robots.ts","app/sitemap.ts","app/globals.css","assets/NIT-logo.svg","CNAME"]) {
    assert.ok(existsSync(join(root,path)), "Missing NIT site design or quality source: "+path);
  }
  const ci = read(".github/workflows/site-quality.yml");
  for(const command of ["pull_request:","branches: [main]","npm ci --ignore-scripts","npm audit --audit-level=high","npm run typecheck","npm run lint","npm run build","npm run validate:export"]) {
    assert.ok(ci.includes(command),"Site quality CI no longer requires: "+command);
  }
  const deploy = read(".github/workflows/deploy-pages.yml");
  for(const contract of ["workflow_dispatch:","expected_sha:","vars.NIT_PRODUCTION_RELEASE_APPROVED == 'true'","persist-credentials: false","actions/deploy-pages@","actions/upload-pages-artifact@","environment:","name: github-pages","contents: read"]) {
    assert.ok(deploy.includes(contract),"Publisher missing independent release contract: "+contract);
  }
  assert.doesNotMatch(deploy,/\bpush:\s*\n\s*branches:\s*\[main\]/,"No automatic branch-push deployment");
  assert.doesNotMatch(deploy,/git push|git add -A|contents: write/,"Publisher must not write a source branch");
  assert.match(read("CNAME"), /nit\.novapharmhealthcare\.com/);
  return {siteQuality:true,exportArtifact:true,ownerApprovedOnly:true,sourceBranchWrites:false};
}
if(process.argv[1] && fileURLToPath(import.meta.url)===fileURLToPath(new URL("test-nit-ci-release-contract.mjs",import.meta.url))) {
  console.log(verifyNitRelease());
}
