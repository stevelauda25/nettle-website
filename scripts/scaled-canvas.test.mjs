import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const source = read("src/components/visuals/product-dashboard/scaled-canvas.tsx");
const css = read("src/components/visuals/product-dashboard/scaled-canvas.module.css").replace(/\/\*[\s\S]*?\*\//g, "");
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

// Execute the actual server component, stubbing only the CSS module import.
// These tests inspect server markup and arithmetic, not browser layout/painting.
const exports = {};
runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, {
  exports,
  require(name) {
    if (name === "./scaled-canvas.module.css") return { __esModule: true, default: { canvas: "canvas-test" } };
    assert.equal(name, "react/jsx-runtime");
    return require(name);
  },
});
const { ScaledCanvas } = exports;

test("Canvas uses capability-gated direct division at all widths with the existing fallback", () => {
  assert.match(css, /^\s*\.canvas\s*\{\s*scale: tan\(atan2\(100cqw, var\(--canvas-design-width\)\)\);\s*\}/);
  assert.match(css, /@supports \(scale: calc\(1px \/ 1px\)\)\s*\{\s*\.canvas\s*\{\s*scale: calc\(100cqw \/ var\(--canvas-design-width\)\);\s*\}\s*\}/);
  assert.doesNotMatch(css, /@media|!important|opacity:|zoom:|transform:|width:|height:/);
  assert.doesNotMatch(source, /use client|useEffect|useState|ResizeObserver|addEventListener|navigator|window\.|scale:/);
});

// Cover every current design width, including both mobile testimonial heights.
const canvases = [[340, 255], [340, 201], [370, 299], [416, 346], [448, 385], [500, 346], [1144, 701], [1144, 516], [1376, 527]];
const viewports = [375, 390, 393, 414, 430, 639, 640, 641, 767, 768, 769, 1023, 1024, 1025, 1279, 1280, 1281, 1440];

for (const [width, height] of canvases) {
  test(`${width} × ${height}: server DOM, dimensions, origin and proportional scaling remain intact`, () => {
    const child = createElement("span", { "data-artwork-probe": "" }, "Artwork");
    const tree = ScaledCanvas({ width, height, label: "Artwork label", className: "rounded-none", children: child });
    assert.equal(tree.type, "div");
    assert.equal(tree.props.role, "img");
    assert.equal(tree.props["aria-label"], "Artwork label");
    assert.equal(tree.props.className, "@container relative w-full overflow-hidden rounded-md rounded-none");
    assert.equal(tree.props.style.aspectRatio, `${width} / ${height}`);
    const inner = tree.props.children;
    assert.equal(inner.type, "div");
    assert.equal(inner.props["aria-hidden"], "true");
    assert.equal(inner.props["data-slot"], "scaled-canvas");
    assert.equal(inner.props.className, "absolute top-0 left-0 origin-top-left select-none canvas-test");
    assert.equal(inner.props.style.width, width);
    assert.equal(inner.props.style.height, height);
    assert.equal(inner.props.style["--canvas-design-width"], `${width}px`);
    assert.equal(inner.props.children, child);
    const markup = renderToStaticMarkup(tree);
    assert.match(markup, new RegExp(`--canvas-design-width:${width}px`));
    assert.doesNotMatch(markup, /style="[^"]*scale:/);

    // Model the exact division asserted above. This is not a CSS-engine test.
    for (const viewport of viewports) {
      const gutter = 16 + 16 * Math.min(1, Math.max(0, (viewport - 390) / 1050));
      for (const available of [viewport - 2 * gutter, (viewport - 2 * gutter - 16) / 2, 640, width, width + 0.375]) {
        const designWidth = Number.parseFloat(inner.props.style["--canvas-design-width"]);
        const scale = available / designWidth;
        close(width * scale, available);
        close(height * scale, available * height / width);
        close(scale, Math.tan(Math.atan2(available, width)));
      }
    }
  });
}

test("390px reference geometry fits the approved Hero, role, testimonial and Security compositions", () => {
  close(53 * (640 / 1144), 29.65034965034965);
  close(701 * (640 / 1144), 392.16783216783216);
  const roleWidth = 390 - 2 * 16 - 2 * 24;
  close(roleWidth, 310);
  close(250 * (roleWidth / 500), roleWidth / 2);
  close(173 * (roleWidth / 500), (346 * roleWidth / 500) / 2);
  const testimonialWidth = Math.min(340, 390 - 16 - 16 - 32);
  close(testimonialWidth, 326);
  const securityScale = (390 - 2 * 16) / 370;
  assert.ok((260 + 86) * securityScale < 358, "Badge stays inside the right edge");
  assert.ok((24 + 86) * securityScale < 239 * securityScale, "Badge stays inside the mobile crop");
  close(86 * securityScale, 83.21081081081081);
});

test("Section branches, geometry and existing artwork sources remain available", () => {
  const hero = read("src/components/sections/hero/hero.tsx");
  assert.match(hero, /w-\[640px\] min-w-full md:w-auto md:min-w-0 lg:col-start-2 lg:col-end-12/);
  for (const name of ["loss-control", "underwriting"]) {
    assert.match(read(`src/components/sections/solutions-by-role/visuals/${name}-visual.tsx`), /<ScaledCanvas width=\{500\} height=\{346\}/);
  }
  const testimonial = read("src/components/sections/testimonial/testimonial.tsx");
  assert.match(testimonial, /hidden select-none md:block/);
  assert.match(testimonial, /select-none md:hidden/);
  assert.match(testimonial, /mobileArtwork=\{<AllianzMobileArtwork \/>\}/);
  assert.match(testimonial, /mobileArtwork=\{<BrotherhoodMobileArtwork \/>\}/);
  const security = read("src/components/sections/security/visuals/security-artwork.tsx");
  assert.match(security, /aspect-\[370\/239\]/);
  assert.match(security, /max-md:-translate-y-\[60px\]/);
  assert.match(security, /top-6 left-\[260px\] size-\[86px\]/);
  assert.match(read("src/components/sections/security/security-card.tsx"), /min-h-\[400px\].*md:min-h-\[460px\]/);
  for (const asset of [
    "security/iso-27001-badge.svg", "security/privacy-badge.svg", "security/regional-hosting-badge.svg", "security/line-pattern.svg",
    "testimonial/allianz-mobile-linework.svg", "testimonial/brotherhood-mobile-linework.svg",
    "testimonial/allianz-mask-lower.svg", "testimonial/allianz-mask-upper.svg", "testimonial/brotherhood-accent-mask.svg",
    "solutions-by-role/loss-control-mask.svg", "solutions-by-role/underwriting-mask.svg",
  ]) {
    const path = `public/assets/icons/${asset}`;
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), asset);
    assert.match(read(path), /viewBox="[^"]+"/, asset);
  }
});
