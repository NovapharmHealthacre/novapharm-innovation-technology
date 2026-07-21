import { cp, mkdir, readdir, copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
await mkdir(publicDir, { recursive: true });

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const assets = path.join(root, "assets");
if (await exists(assets)) {
  await cp(assets, path.join(publicDir, "assets"), { recursive: true, force: true });
}

for (const file of ["CNAME", "BingSiteAuth.xml"]) {
  const source = path.join(root, file);
  if (await exists(source)) await copyFile(source, path.join(publicDir, file));
}

for (const file of await readdir(root)) {
  if (/^google.*\.html$/i.test(file)) {
    await copyFile(path.join(root, file), path.join(publicDir, file));
  }
}
