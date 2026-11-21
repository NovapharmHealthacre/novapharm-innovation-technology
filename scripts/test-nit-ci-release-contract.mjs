import test from "node:test";
import assert from "node:assert/strict";
import {verifyNitRelease} from "./verify-nit-ci-release-contract.mjs";

test("NIT CI cannot auto-publish or push generated output to main", () => {
  assert.deepEqual(verifyNitRelease(),{siteQuality:true,exportArtifact:true,ownerApprovedOnly:true,sourceBranchWrites:false});
});
