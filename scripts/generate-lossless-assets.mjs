import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

// Reuse Next's installed image tooling; this is never imported by the app.
const require = createRequire(import.meta.url);
export const sharp = require(require.resolve("sharp", { paths: [require.resolve("next/package.json")] }));
export const deliveryAssets = [
  "key-metrics/engraved-ink",
  "key-metrics/halftone-band",
  "features/fire-door-maintenance",
];
export const assetUrl = (path) => new URL(`../public/assets/images/${path}`, import.meta.url);

// Explicit opt-in: node scripts/generate-lossless-assets.mjs --write
// Keep the approved PNG sources. Only these delivery copies are generated.
if (process.argv.includes("--write")) {
  for (const name of deliveryAssets) {
    const source = await readFile(assetUrl(`${name}.png`));
    const output = await sharp(source).webp({ lossless: true, effort: 4 }).toBuffer();
    const before = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const after = await sharp(output).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual(after.info, before.info, `${name}: dimensions/channels changed`);
    assert.ok(after.data.equals(before.data), `${name}: decoded pixels changed`);
    assert.ok(output.length < source.length, `${name}: delivery copy must be smaller`);
    await writeFile(assetUrl(`${name}.webp`), output);
    console.log(`${name}: ${source.length} → ${output.length} bytes; identical decoded pixels`);
  }
}
