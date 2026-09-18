import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

/**
 * Production-output guard for the Motion Lab. Run after `pnpm build`:
 * the lab must leave no code, styles or markers in the client bundles, the
 * server chunks or the prerendered homepage. Skips when no build exists so the
 * ordinary `pnpm test` run stays build-free.
 */
const root = fileURLToPath(new URL("../", import.meta.url));
const built = existsSync(resolve(root, ".next/static/chunks")) && existsSync(resolve(root, ".next/server/app"));

function walk(dir, out = []) {
  const absolute = resolve(root, dir);
  if (!existsSync(absolute)) return out;
  for (const name of readdirSync(absolute)) {
    const path = `${dir}/${name}`;
    if (statSync(resolve(root, path)).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

/**
 * Strings that exist only in the lab's implementation (channel name, scope
 * attributes, shell copy, stage styles). The route path "motion-lab" itself
 * legitimately appears in Next's route-tree manifests and in the ~1 KB gated
 * route stubs, so it is not a marker on its own.
 */
const IMPLEMENTATION = /nettle-motion-lab|nettle-motion:command|data-motion-state|Motion controls|Choose a section|stageCell|runway|MotionScope/;
/** Chunk names Turbopack gives modules bundled from the lab or the motion core. */
const LAB_CHUNK = /src_motion-lab_|src_motion_/;

test("Production client bundles and stylesheets contain no Motion Lab code", { skip: !built && "no production build present" }, () => {
  const files = walk(".next/static").filter((path) => /\.(?:js|css)$/.test(path));
  assert.deepEqual(files.filter((path) => LAB_CHUNK.test(path)), [], "no lab chunks in client output");
  assert.deepEqual(files.filter((path) => IMPLEMENTATION.test(readFileSync(resolve(root, path), "utf8"))), [], "no lab code in client output");
});

test("Production server chunks contain no Motion Lab modules", { skip: !built && "no production build present" }, () => {
  const files = walk(".next/server").filter((path) => path.endsWith(".js"));
  assert.deepEqual(files.filter((path) => LAB_CHUNK.test(path)), [], "no lab chunks in server output");
  assert.deepEqual(files.filter((path) => IMPLEMENTATION.test(readFileSync(resolve(root, path), "utf8"))), [], "no lab code in server output");
  for (const stub of ["motion-lab/page.js", "motion-lab/[section]/[entry]/page.js", "motion-lab/stage/[section]/[entry]/page.js"]) {
    const path = resolve(root, ".next/server/app", stub);
    if (existsSync(path)) assert.ok(statSync(path).size < 4096, `${stub}: gated route stub stays tiny (${statSync(path).size} bytes)`);
  }
});

test("Prerendered homepage carries no motion markers", { skip: !built && "no production build present" }, () => {
  for (const page of ["index.html", "homepage.html"]) {
    const path = resolve(root, ".next/server/app", page);
    if (!existsSync(path)) continue;
    assert.doesNotMatch(readFileSync(path, "utf8"), /motion-lab|data-motion/, page);
  }
});
